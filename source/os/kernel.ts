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
///<reference path="TerminatedProcessTable.ts" />
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
           
            // Initialize our global queues.
            _KernelInterruptQueue = new Queue();   // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array();          // Buffers... for the kernel.
            _KernelInputQueue = new Queue();       // Where device input lands before being processed out somewhere.   

            _ReadyQueue = new ReadyQueue();        // Initialize the Ready Queue             
            _ResidentList = new ResidentList();    // Initialize the Resident Queue 
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

            _krnKeyboardDriver = new DeviceDriverKeyboard();     // Construct it.
            _krnKeyboardDriver.driverEntry();                    // Call the driverEntry() initialization routine.

            this.krnTrace(_krnKeyboardDriver.status);


            // Load the File System Device Driver
            this.krnTrace("Loading the File System.");

            _krnFileSystemDriver = new DeviceDriverFileSystem();
            _krnFileSystemDriver.driverEntry();

            this.krnTrace(_krnFileSystemDriver.status);

            
            // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();
            
            // Initalize the Cpu Statistics Table with its Table Element
            _CpuStatisticsTable = new CpuStatisticsTable(_CpuStatisticsTableElement);

            // Initalize the Memory Information Table with its Table Element
            _MemoryInformationTable = new MemoryInformationTable(_MemoryInformationTableElement);

            // Initalize the System InformationInferface with its HTML Elements
            _SystemInformationInterface = new SystemInformationSection(_StatusSectionElement, _DateSectionElement, _TimeSectionElement);

            // Initalize the Ready Queue Table
            _ReadyQueueTable = new ReadyQueueTable(_ReadyQueueTableElement);

            //Initalize the Terminated Process List
            _TerminatedProcessTable = new TerminatedProcessTable(_TerminatedProcessTableElement);
 
            // Initalize the timer
            _Timer = new Timer();

            // Initalize the CPU Scheduler
            _CPUScheduler = new CpuScheduler();

            // Launch the shell.
            this.krnTrace("Creating and Launching the shell.");

            //Initalize the shell
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
            if(_ReadyQueue.getSize() > 0 || _CPUScheduler.getCurrentProcess() != null) {
                _StdOut.putText("Warning at least one process is currerntly running... R.I.P. we shutting it down"); 
            }

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

                console.log("About to cycle the CPU for PID " + _CPUScheduler.getCurrentProcess().getProcessID() );
 
                    // Checks to see if the single step mode is checked and if so do not allow the next cpu to cycle
                    if ((_SingleStepMode == true && _AllowNextCycle == true) || (_SingleStepMode == false)) {

                        // Cycle the CPU
                        _CPU.cycle();

                        // Update the UI 
                        _ReadyQueue.incrementWaitTime();
                        _ReadyQueue.incrementTurnAroundTime();

                       // Decrement the timer by one and check to see if it is finished
                       if (_Timer.decreaseTimerByOne() == TIMER_FINISHED) {

                             _KernelInterruptQueue.enqueue(new Interrupt(TIMER_IRQ, _CPUScheduler.getCurrentProcess() ));

                        } else {
                           // If the timer is not finished then do nothing
                       }
                    }
            } 
            else {// If there are no interrupts and there is nothing being executed then just be idle. :(
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
                    this.krnTimerISR(params);           // Kernel built-in routine for timers (not the clock).
                    break;
                case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params);     // Kernel mode device driver
                    _StdIn.handleInput();
                    break;
                case FILE_SYSTEM_IRQ:                   // File System Device Driver
                    _krnFileSystemDriver.isr(params);
                    break;
                case PRINT_INTEGER_IRQ:                 // Integer Console Output
                    this.writeIntegerConsole(params);
                    break;
                case PRINT_STRING_IRQ:                  // String Console Output 
                    this.writeStringConsole(params)
                    break;
                case INVALID_OPCODE_IRQ:                // Invalid Op code 
                    this.invalidOpCode(params);
                    break;
                case BREAK_IRQ:                         // Break
                    this.krnBreakISR(params);
                    break;
                case BSOD_IRQ:                          // Blue Screen of death Test Case
                    this.krnTrapError("BSOD Command");
                    break;
                case INVALID_OPCODE_USE_IRQ:            // Invalid Op Code 
                    this.badOpCodeUsage(params);
                    break;
                case MEMORY_OUT_OF_BOUNDS_IRQ:          // Memory Out of Bounds
                    this.memoryOutOfBounds(params);
                    break;
                case CREATE_PROCESSS_IRQ:               // Create a new process
                    this.createProcess(params);
                    break;
                case START_PROCESS_IRQ:                 // Start a new process
                    this.startProcess(params);
                    break;
                case TERMINATE_PROCESS_IRQ:             // Terminate a process
                    this.terminateProcess(params);
                    break;
                case CONTEXT_SWITCH_IRQ:                // Swtich between processes
                   // this.contextSwitch();              
                    break; 
                case END_CPU_IRQ:                       // Stop CPU Execution
                    this.stopCpuExecution();
                    break;
                default:                                // Handles bad interrupt
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            }
        }
        /**
         * Used to kill to current process when a memory access violation occurs
         */
        public memoryOutOfBounds(params: string) {

            // Tell the user whats up
            _StdOut.putText("Error, Memory Access Violation");

            // Kill the current process 


            // Check to see if another process wants to execute
            if (_ReadyQueue.getSize() > 0) {   

                // Get the next process
                var nextProcess: TSOS.ProcessControlBlock = _CPUScheduler.getNextProcess();

                // Start the next process
                _KernelInterruptQueue.enqueue(new Interrupt(START_PROCESS_IRQ, nextProcess));

            }
            else {
                // If no other process exists then stop CPU
                _KernelInterruptQueue.enqueue(new Interrupt(END_CPU_IRQ, nextProcess));
            }

        }
        /**
         *  Used to handle the break interrupt
         */
        public krnBreakISR(process: TSOS.ProcessControlBlock) {

                 // Do not add the current process back to the ready queue and set the current process to null in order to signal the timer
                
                // Save the current CPU Register values into the process control block
               _CPUScheduler.runningProcess.setProgramCounter(_CPU.PC);
               _CPUScheduler.runningProcess.setAcc(_CPU.Acc);
               _CPUScheduler.runningProcess.setXReg(_CPU.Xreg);
               _CPUScheduler.runningProcess.setYReg(_CPU.Yreg);
               _CPUScheduler.runningProcess.setZFlag(_CPU.Zflag);
               _CPUScheduler.runningProcess.setProcessState(PROCESS_STATE_TERMINATED);

               // Remove the process from memory and update the UI Table
               _MemoryManager.clearMemoryPartition(process);

               // Get the index of the process in the Resident List
               var indexOfProcess: number = _ResidentList.getElementIndexByProccessId(process); 

               // Remove the process from the residentList
               _ResidentList = _ResidentList.removeElementAtIndex(indexOfProcess);

               // Clear the Process from the UI Ready queue
               _ReadyQueueTable.removeProcessById(process);

               // Add to the terminated UI Table
               _TerminatedProcessTable.addRow(process);

               // Clear the current timer
               _Timer.clearTimer();

               // Set current process to null so signal the timer
               _CPUScheduler.setCurrentProcess(null);

               // check to see if you need to start another process 
               if(_ReadyQueue.getSize() > 0 ){
                   // Start the next process
                   var nextProcess: TSOS.ProcessControlBlock = _CPUScheduler.getNextProcess();

                   _KernelInterruptQueue.enqueue(new Interrupt(START_PROCESS_IRQ, nextProcess));
               }
               else{
                   _KernelInterruptQueue.enqueue(new Interrupt(END_CPU_IRQ, null));
               }
        }
        /**
         * Used to set the current CPU information with the next process in order to run it correctly
         * @Params process {ProcessControlBlock} - The process that is being used to set the CPU
         */
        public stateRestore(process: ProcessControlBlock): void {

            _Kernel.krnTrace("CPU Scheduler: Restoring the state of process" + _CPUScheduler.runningProcess.getProcessID());

            // Set the Current Process equal to the process that was just restored
            _CPUScheduler.runningProcess = <TSOS.ProcessControlBlock> process;

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
        public createProcess(baseAddress: number): TSOS.ProcessControlBlock {

            // Create the new process
            var newProcess: TSOS.ProcessControlBlock = new ProcessControlBlock();

            // Set the base and limit registers of the process
            newProcess.setBaseReg(baseAddress);
            newProcess.setLimitReg(256);

            // Add the newly created process to the end of the resident list
            _ResidentList.enqueue(newProcess);

            // Return the ID of the newly created process
            return <TSOS.ProcessControlBlock> newProcess;
        }
        /*
         * Used to set the _CPU.isExecuting Property to True
         * This also calls the UI stuff that should happen when the CPU starts executing user programs
         */
        public startProcess(theProcess: TSOS.ProcessControlBlock): void {

            console.log("The process to start it " + theProcess + " size of interupt quuee  " + _KernelInterruptQueue.getSize() );

            // Set the current process
            _CPUScheduler.setCurrentProcess(theProcess);

            // Load the PCB into the CPU to start the program
            this.stateRestore(theProcess);

            // Sets the Cpu to executing
            _CPU.isExecuting = true;

            // Handle UI from having programs executing
            Utils.startProgramSpinner();

            _Timer.clearTimer();
            // Set a new Timer for the length of the current Quanta
            _Timer.setNewTimer(_CPUScheduler.getQuantum());

            // Set the state of the process to running
            theProcess.setProcessState(PROCESS_STATE_RUNNING); 

            // The Ready queue UI for the current running process
            _ReadyQueueTable.updateProcessById(theProcess);
        }
        /**
         * used to handle the timer interrupt (This is what happens when the currentProcess is paused)
         */
        public krnTimerISR(process: TSOS.ProcessControlBlock) {

            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
            if (_CPU.isExecuting == true && _CPUScheduler.getCurrentProcess() != null) {

                // Check for a timing error
                if(_CPUScheduler.getCurrentProcess().getProcessID() == process.getProcessID()) {

                console.log("THE TIMER HAS ENDED RING RING RING");

                // Clear the timer and turn it off
                _Timer.clearTimer();  

                // Save the current CPU Register values into the process control block
                _CPUScheduler.runningProcess.setProgramCounter(_CPU.PC);
                _CPUScheduler.runningProcess.setAcc(_CPU.Acc);
                _CPUScheduler.runningProcess.setXReg(_CPU.Xreg);
                _CPUScheduler.runningProcess.setYReg(_CPU.Yreg);
                _CPUScheduler.runningProcess.setZFlag(_CPU.Zflag);
                _CPUScheduler.runningProcess.setProcessState(PROCESS_STATE_WAITING);
            
                // Add the current process back into the queue
                _ReadyQueue.enqueue(_CPUScheduler.getCurrentProcess());

                // Update the UI for the Process
                _ReadyQueueTable.updateProcessById(_CPUScheduler.getCurrentProcess());

                // Get the next process
                var nextProcess: TSOS.ProcessControlBlock = _CPUScheduler.getNextProcess();

                // Start next Process
                _KernelInterruptQueue.enqueue(new Interrupt(START_PROCESS_IRQ, nextProcess));

                }
                else{
                    // dont switch this was just handled in timing error
                    console.log("ERROR FIXED");
                }
            }
        }
        /**
         * used to terminate a currenlty running process and remove it fromt he ready qyeye
         */
        public terminateProcess(process: TSOS.ProcessControlBlock) {


            console.log("Teminating process " + process.getProcessID() );

             // Check to see if the process is currently running
            if ( process.getProcessID() == _CPUScheduler.getCurrentProcess().getProcessID() ) {   // The process to terminate is running
                  
                console.log("Terminating the current process");

                // Save the current CPU Register values into the process control block
                _CPUScheduler.runningProcess.setProgramCounter(_CPU.PC);
                _CPUScheduler.runningProcess.setAcc(_CPU.Acc);
                _CPUScheduler.runningProcess.setXReg(_CPU.Xreg);
                _CPUScheduler.runningProcess.setYReg(_CPU.Yreg);
                _CPUScheduler.runningProcess.setZFlag(_CPU.Zflag);
                _CPUScheduler.runningProcess.setProcessState(PROCESS_STATE_TERMINATED); // Update the State to terminated

                // Clear current timer
                _Timer.clearTimer();

                // Set the current process to null
                _CPUScheduler.setCurrentProcess(null);

                // Check to see if another process wants to run
                if (_ReadyQueue.getSize() > 0) {

                    console.log("starting process after termination");

                    // Get the next process
                    var nextProcess: TSOS.ProcessControlBlock = _CPUScheduler.getNextProcess();

                    //Start the next process
                    _KernelInterruptQueue.enqueue(new Interrupt(START_PROCESS_IRQ, nextProcess));

                }
                else{
                    // Stop the CPU 
                    _KernelInterruptQueue.enqueue(new Interrupt(END_CPU_IRQ, nextProcess));

                }
            } else {

                console.log("the current process is not being terminated");

                // The process to terminate is not running and chilling in the Ready Queue

                // Search
                var indexInReadyQueue: number = _ReadyQueue.getElementIndexByProccessId(process);

                // And ...

                // Destroy
                _ReadyQueue = _ReadyQueue.removeElementAtIndex(indexInReadyQueue);
            }
            
                // Remove the process from memory and update the UI Table
                _MemoryManager.clearMemoryPartition(process);

                // Get the index of the process in the Resident List
                var indexOfProcess: number = _ResidentList.getElementIndexByProccessId(process); 

                // Remove the process from the residentList
                _ResidentList = _ResidentList.removeElementAtIndex(indexOfProcess);

                // Clear the Process from the UI Ready queue
                _ReadyQueueTable.removeProcessById(process);

                // Add to the terminated UI Table
                _TerminatedProcessTable.addRow(process);   
        }
        /*
         * Used to set the _CPU.isExecuting Property to False
         * This also calls the UI stuff that should happen when the CPU stops executing user programs
         */
        public stopCpuExecution(): void {

            console.log("Stopping the CPU execution becuase no processes are currently active");
            // Stop the Cpu from executing
            _CPU.isExecuting = false;
            _CPUScheduler.runningProcess = null;
            // Handle the UI from having no programs execuing
            Utils.endProgramSpinner();
            _Console.advanceLine();
            _OsShell.putPrompt(); 
        
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
