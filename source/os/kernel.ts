///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="collections.ts" />
///<reference path="queue.ts" />
///<reference path="console.ts" />
///<reference path="memoryManager.ts" />
///<reference path="CpuStatisticsTable.ts" />
///<reference path="MemoryInformationTable.ts" />
///<reference path="ProcessControlBlockTable.ts" />
///<reference path="systemInformationSection.ts" />
///<reference path="ResidentListTable.ts" />
///<reference path="ReadyQueueTable.ts" />
///<reference path="cpuScheduler.ts" />
///<reference path="timer.ts" />

/* ------------
     Kernel.ts

     Requires globals.ts
              queue.ts

     Routines for the Operating System, NOT the host.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
module TSOS {

    export class Kernel {
        //
        // OS Startup and Shutdown Routines
        //
        public krnBootstrap() {    

            Control.hostLog("bootstrap", "host");  // Use hostLog because we ALWAYS want this, even if _Trace is off.

            // Initalize the memory blocks
            _MemoryBlock = new MemoryBlock();
            _MemoryBlock.init();

            // Initalize the memory partition array

            _MemoryManager = new MemoryManager(_MemoryBlock, _MemoryPartitionArray);
           // _MemoryManager.printAllMemoryPartitions();

            console.log(_MemoryManager.getTotalMemorySize() + " JOE THE MEMORY SIZE IS");
           
            // Initialize our global queues.
            _KernelInterruptQueue = new Queue();   // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array();          // Buffers... for the kernel.
            _KernelInputQueue = new Queue();       // Where device input lands before being processed out somewhere.   

            _ReadyQueue = new ReadyQueue();        // Initialize the Ready Queue             
            _ResidentList = new ReadyQueue();      // Initialize the Resident Queue 
            _TerminatedProcessQueue = new Queue(); // Initalize the Terminated Process Queue
            

            // Initialize the console.
            _Console = new Console();          // The command line interface / console I/O device.
            _Console.init();

            // Initialize standard input and output to the _Console.
            _StdIn  = _Console;
            _StdOut = _Console;

            // Initalize the Process Control Block Counter 
            _ProcessCounterID = -1;

            // Load the Keyboard Device Driver
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new DeviceDriverKeyboard();    // Construct it.
            _krnKeyboardDriver.driverEntry();                    // Call the driverEntry() initialization routine.
            this.krnTrace(_krnKeyboardDriver.status);

            // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();
            
            // Initalize the Cpu Statistics Table with its Table Element
            _CpuStatisticsTable = new CpuStatisticsTable(_CpuStatisticsTableElement);

            // Initalize the Memory Information Table with its Table Element
            _MemoryInformationTable = new MemoryInformationTable(_MemoryInformationTableElement);

            // Initalize the Process Control Table with its Table Element
            _ProcessControlBlockTable = new ProcessControlBlockTable(_ProcessControlBlockTableElement);

            // Initalize the System InformationInferface with its HTML Elements
            _SystemInformationInterface = new SystemInformationSection(_StatusSectionElement, _DateSectionElement, _TimeSectionElement);

            //Initalize the Resident List
            _ResidentListTable = new ResidentListTable(_ResidentListTableElement);

            // Initalize the Ready Queue
            _ReadyQueueTable = new ReadyQueueTable(_ReadyQueueTableElement);
 
            // Timer
            _Timer = new Timer();

            // CPU Scheduling 
            _CPUScheduler = new CpuScheduler();

            // Launch the shell.
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new Shell();
            _OsShell.init();

            // Finally, initiate student testing protocol.
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
        }

        public krnShutdown() {
            this.krnTrace("begin shutdown OS");
            // TODO: Check for running processes.  If there are some, alert and stop. Else...
            // ... Disable the Interrupts.
            this.krnTrace("Disabling the interrupts.");
            this.krnDisableInterrupts();
            //
            // Unload the Device Drivers?
            // More?
            //
            this.krnTrace("end shutdown OS");
        }
        public krnOnCPUClockPulse() {
            /* This gets called from the host hardware simulation every time there is a hardware clock pulse.
               This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
               This, on the other hand, is the clock pulse from the hardware / VM / host that tells the kernel
               that it has to look for interrupts and process them if it finds any.    
            */
            // On each clock pulse the time on the UI system interface will update
           _SystemInformationInterface.updateDateTime();
           
            // Check for an interrupt, are any. Page 560
            if (_KernelInterruptQueue.getSize() > 0) {
                // Process the first interrupt on the interrupt queue.
                // TODO: Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
                var interrupt = _KernelInterruptQueue.dequeue();
                this.krnInterruptHandler(interrupt.irq, interrupt.params);
            } else if (_CPU.isExecuting) { // If there are no interrupts then run one CPU cycle if there is anything being processed. 
                console.log("About to cycle the CPU");
           
                    // Checks to see if the single step mode is checked and if so do not allow the next cpu to cycle
                    if ((_SingleStepMode == true && _AllowNextCycle == true) || (_SingleStepMode == false)) {

                        // Cycle the CPU
                        _CPU.cycle();

                        // Decrement the timer by one and check to see if it is finished
                        if (_Timer.decreaseTimerByOne() == TIMER_FINISHED) {
                            console.log("The Timer is finished/ Creating an interrupt");
                            // Create new interrupt to signal the end of the timer
                            _KernelInterruptQueue.enqueue(new Interrupt(TIMER_IRQ, TIMER_ENDED_PROCESS));
                        } else {
                            // If the timer is not finished then do nothing
                        }
                    }

            } else {// If there are no interrupts and there is nothing being executed then just be idle. :(
                this.krnTrace("Idle");
            }
        }
        //
        // Interrupt Handling
        //
        public krnEnableInterrupts() {
            // Keyboard
            Devices.hostEnableKeyboardInterrupt();
            // Put more here.
        }
        public createAndQueueInterrupt(name, values) {
            _KernelInterruptQueue.enqueue(new Interrupt(name, values));
        }

        public krnDisableInterrupts() {
            // Keyboard
            Devices.hostDisableKeyboardInterrupt();
            // Put more here.
        }
        public krnInterruptHandler(irq, params)  {
            // This is the Interrupt Handler Routine.  See pages 8 and 560.
            // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on. Page 766.
            this.krnTrace("Handling IRQ~" + irq);

            // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
            // TODO: Consider using an Interrupt Vector in the future.
            // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.
            //       Maybe the hardware simulation will grow to support/require that in the future.
            switch (irq) {
                case TIMER_IRQ:
                    this.krnTimerISR();                // Kernel built-in routine for timers (not the clock).
                    break;
                case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params);    // Kernel mode device driver
                    _StdIn.handleInput();
                    break;
                case PRINT_INTEGER_IRQ:                // Integer Console Output
                    this.writeIntegerConsole(params);
                    break;
                case PRINT_STRING_IRQ:                  // String Console Output 
                    this.writeStringConsole(params)
                    break;
                case INVALID_OPCODE_IRQ:                // Invalid Op code 
                    this.invalidOpCode(params);
                    break;
                case BREAK_IRQ:                         // Break
                   this.krnBreakISR()
                    break;
                case BSOD_IRQ:                          //Blue Screen of death Test Case
                    this.krnTrapError("BSOD Command");
                    break;
                case INVALID_OPCODE_USE_IRQ:            // Invalid Op Code 
                    this.badOpCodeUsage(params);
                    break;
                case MEMORY_OUT_OF_BOUNDS_IRQ:
                    this.memoryOutOfBounds(params);
                    break;
                default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            }
        }
        public memoryOutOfBounds(params: string) {
            this.krnTrapError("BSOD Command");

        }
        /**
         * used to handle the timer interrupt
         */
        public krnTimerISR() {

            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
            console.log("THE TIMER HAS ENDED RING RING RING");

            // Clear the timer and turn it off
            _Timer.clearTimer();  

            // End the current process
            this.endProcess(_CPUScheduler.getCurrentProcess(), TIMER_ENDED_PROCESS); 
        }
        /**
         *  Used to handle the break interrupt
         */
        public krnBreakISR() {

            console.log("The Break Interrupt has been hit");

            // End the current process
            this.endProcess(_CPUScheduler.getCurrentProcess(), BREAK_ENDED_PROCESS);
        }
        /**
         * Used to switch between processes
         * @Params nextProcessToRun {ProcessControlBlock} - The Next Process to be run by the cpu
         */
        public contextSwitch() {
           
            console.log("Performing a context swtich with processes");

            // Save the state of the current process into its PCB Block
            this.stateSave();

            // Get the next process to be run on the CPU
            var nextProcess = _CPUScheduler.getNextProcess(); // Calls the CPU Scheduler and returns the next process to run 

            // Start the next process by calling stateRestore
            this.startProcess(nextProcess);
        }
        /**
         * Used to store the current CPU information into the current process control block
         * Part of the context switch
         */
        public stateSave(): void {

            _Kernel.krnTrace("CPU Scheduler: Saving the state of PCB " + _CPUScheduler.currentProcess.getProcessID());

             console.log("Saving the State");

             // Save the current CPU Register values into the process control block
            _CPUScheduler.currentProcess.setProgramCounter(_CPU.PC);
            _CPUScheduler.currentProcess.setAcc(_CPU.Acc);
            _CPUScheduler.currentProcess.setXReg(_CPU.Xreg);
            _CPUScheduler.currentProcess.setYReg(_CPU.Yreg);
            _CPUScheduler.currentProcess.setZFlag(_CPU.Zflag);
            
        }
        /**
         * Used to set the current CPU information with the next process in order to run it correctly
         * @Params process {ProcessControlBlock} - The process that is being used to set the CPU
         */
        public stateRestore(process: ProcessControlBlock): void {

            _Kernel.krnTrace("CPU Scheduler: Restoring the state of process" + _CPUScheduler.currentProcess.getProcessID());

            console.log("Restoring the State");
            // Set the Current Process equal to the process that was just restored
            _CPUScheduler.currentProcess = <TSOS.ProcessControlBlock> process;

            _CPU.PC     = process.getProgramCounter();
            _CPU.Acc    = process.getAcc();
            _CPU.Xreg   = process.getXReg();
            _CPU.Yreg   = process.getYReg();
            _CPU.Zflag  = process.getZFlag();

        }  
        /**
         * Used to create a new process
         * @Params baseAddress {Number} - The base address of the process in memory
         *         limitAddress{Number} - The limit address of the process in memory 
         * @Returns {Number} - The ID of the newly created process
         */
        public createProcess(baseAddress: number , limitAddress: number): TSOS.ProcessControlBlock {

            // Create the new process
            var newProcess: TSOS.ProcessControlBlock = new ProcessControlBlock();

            // Set the base and limit registers of the process
            newProcess.setBaseReg(baseAddress);
            newProcess.setLimitReg(limitAddress);

            // Add the newly created process to the end of the resident list
            _ResidentList.enqueue(newProcess);

            // Return the ID of the newly created process
            return <TSOS.ProcessControlBlock> newProcess;
        }
        /*
         * Used to set the _CPU.isExecuting Property to True
         * This also calls the UI stuff that should happen when the CPU starts executing user programs
         */
        public startProcess(process: TSOS.ProcessControlBlock): void {

            console.log("The process to start it " + process);

            // Sets the Cpu to executing
            _CPU.isExecuting = true;
            
            // Load the PCB into the CPU to start the program
            this.stateRestore(process);

            // Handle UI from having programs executing
            Utils.startProgramSpinner();

            // Set a new Timer for the length of the current Quanta
            _Timer.setNewTimer(_CPUScheduler.getQuantum());

            // Set the state of the process to running
            process.setProcessState(PROCESS_STATE_RUNNING);
          
        }
        /**
        * Used to end the given process and decide what to do next
        * @Params process {ProcessControlBlock} - The process that is being ended
                  callee  {String}              - The service that is ending the process
        */
        public endProcess(process: TSOS.ProcessControlBlock, callee: string) {

            // First, check to see why the process was ended 

            // If the timer ended the process because of a scheduling algorithm
            if (callee == TIMER_ENDED_PROCESS) {

                // The process is not finished because of break so add it to the end of the ready queue
                _ReadyQueue.enqueue(process);

                // Context Switch to figure out what to do next
                this.contextSwitch();
                               
            }
            // If the break instruction was read then terminate the program
            else if (callee == BREAK_ENDED_PROCESS) {

               // Terminate the process
                this.terminateProcess(process);

                // Check to see if another process wants to execute
                if (_ReadyQueue.getSize() > 0) {    
                    // If another process is currently active
                    this.contextSwitch();      // Context Switch
                }
                else {
                    // If no other process exists then stop CPU
                    this.stopCpuExecution();  // Stop the CPU
                }
            }
            else{
                console.log("This should never happen");
            }  
        }
        public terminateProcess(process: TSOS.ProcessControlBlock) {

            console.log("Terminating a process " + process.getProcessID());

            // Set the state of the process to terminated
            process.setProcessState(PROCESS_STATE_TERMINATED);

            // Remove the process from memory and update the UI Table
            _MemoryManager.clearMemoryPartition(process);

            // Add the process to the terminated process queue for later use
            _TerminatedProcessQueue.enqueue(process);
        }
        /*
         * Used to set the _CPU.isExecuting Property to False
         * This also calls the UI stuff that should happen when the CPU stops executing user programs
         */
        public stopCpuExecution(): void {

            console.log("Stopping the CPU execution becuase no processes are currently active");
            // Stop the Cpu from executing
            _CPU.isExecuting = false;

            // Handle the UI from having no programs execuing
            Utils.endProgramSpinner();

            _Console.advanceLine();
            _OsShell.putPrompt(); 
            _CPUScheduler.currentProcess = null;
        }

        //
        // System Calls... that generate software interrupts via tha Application Programming Interface library routines.
        //

        /**
         * Used to write a string to the console
         */      
        public writeStringConsole(startAddress: number) {

            var memLoc = startAddress - 1;

          //  console.log("Write a string out to the console!");

            var nextByte: TSOS.Byte = <Byte> _MemoryManager.getByte(memLoc); 

            var nextValue: string = ""; 
           
           // Loop untill the null terminated string ends
            while(nextValue != "00") {
                
                // Increase the memory location 
                memLoc = 1 + memLoc;

                // Get the next
                var byte = <Byte>_MemoryManager.getByte(memLoc);

               // console.log("Value of the Byte is :  " + byte.getValue());

               // var test = <Byte>_MemoryManager0.getByte(parseInt(byte.getValue(),16 ));

               // Print the next character to the console
                _StdOut.putText(Utils.hexToAscii(byte.getValue()) );
                
               // console.log("another etst " + test.getValue());
               // console.log("Address After: " + memLoc);
               // 
                nextValue = byte.getValue();               
           }

           // console.log("hit a 00 and end of the string has been found");
            _Console.advanceLine();

        }
         /**
         * Used to write a integer to the console
         */
        public writeIntegerConsole(output) {

           // console.log("Write an Integer out to the console!");
            _StdOut.putText(output + "");
            _Console.advanceLine();
            //_CPU.beginExecuting( _ReadyQueue.first() );
        }
        
        public badOpCodeUsage(userMsg) {
            _CPU.isExecuting = false;
           // this.writeConsole(userMsg);
            _OsShell.putPrompt();     
        }
        public invalidOpCode(code): void {
            _CPU.isExecuting = false;
            _StdOut.putText("Error: The user program contains the unrecognizable Op Code " + code);
            _Console.advanceLine();
            _StdOut.putText("Ending the current running program");
            _Console.advanceLine();
            _OsShell.putPrompt();
        }
        //
        // OS Utility Routines
        //
        public krnTrace(msg: string) {
             // Check globals to see if trace is set ON.  If so, then (maybe) log the message.
             if (_Trace) {
                if (msg === "Idle") {
                    // We can't log every idle clock pulse because it would lag the browser very quickly.
                    if (_OSclock % 10 == 0) {
                        // Check the CPU_CLOCK_INTERVAL in globals.ts for an
                        // idea of the tick rate and adjust this line accordingly.
                        Control.hostLog(msg, "OS");
                    }
                } else {
                    Control.hostLog(msg, "OS");
                }
             }
        }
        public krnTrapError(msg) {
            Control.hostLog("OS ERROR - TRAP: " + msg);
            Utils.createBSOD(); // Create the blue screen of death
            this.krnShutdown();  
            clearInterval(_hardwareClockID);    
        }
    }
}
