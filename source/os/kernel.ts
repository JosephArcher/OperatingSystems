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

            //Creaste a Memory Manager with a memory block
            _MemoryManager0 = new MemoryManager(_MemoryBlock0);
           
            // Initialize our global queues.
            _KernelInterruptQueue = new Queue();  // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array();         // Buffers... for the kernel.
            _KernelInputQueue = new Queue();      // Where device input lands before being processed out somewhere.   

            // Initialize the Ready Queue 
            _ReadyQueue = new collections.LinkedList<TSOS.ProcessControlBlock>();

            // Initialize the Resident Queue 
            _ResidentQueue = new Queue();
            
            // Initialize the console.
            _Console = new Console();          // The command line interface / console I/O device.
            _Console.init();

            // Initialize standard input and output to the _Console.
            _StdIn  = _Console;
            _StdOut = _Console;

            // Initalize the Process Control Block Counter 
            _ProcessCounterID = -1;

            // Initalize the Current Process Control Block global
            _CurrentProcess = null;

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

                // Checks to see if the single step mode is checked and if so do not allow the next cpu to cycle
                if ( (_SingleStepMode == true && _AllowNextCycle == true) || (_SingleStepMode == false) ) {
                    _CPU.cycle();
                }
            } else {                      // If there are no interrupts and there is nothing being executed then just be idle. {
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

        public krnInterruptHandler(irq, params) {
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
                    this.endProcess();
                    break;
                case BSOD_IRQ:                          //Blue Screen of death Test Case
                    this.krnTrapError("BSOD Command");
                    break;
                case INVALID_OPCODE_USE_IRQ:            // Invalid Op Code 
                    this.badOpCodeUsage(params);
                    break;
                default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            }
        }
        public krnTimerISR() {
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
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

            var nextByte: TSOS.Byte = <Byte> _MemoryManager0.getByte(memLoc); 

            var nextValue: string = ""; 
           
           // Loop untill the null terminated string ends
            while(nextValue != "00") {
                
                // Increase the memory location 
                memLoc = 1 + memLoc;

                // Get the next
                var byte = <Byte>_MemoryManager0.getByte(memLoc);

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
         /**
         * Used to end the current process
         */
        public endProcess() {

            // Set the global to no executing
            _CPU.isExecuting = false;  

            // Update and display the PCB Contents
            //var holder = <TSOS.ProcessControlBlock>_ReadyQueue.first();

            //holder.setProcessState(PROCESS_STATE_TERMINATED);
           _ProcessControlBlockTable.updateTableContents();
           // _ReadyQueue.clear();
           // console.log(_ReadyQueue.size() + 'after clear ');


            _StdOut.putText("Program Finished Running");
            _Console.advanceLine();
            _OsShell.putPrompt(); 
            Utils.endProgramSpinner();
            _CurrentProcess = null;

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
        public loadUserProgram():void {

            console.log("Loading a new user program!");

            // Set the counter to zero to load the user program into memory 0000
            var counter = 0;

            // Clear the current memory
            _MemoryManager0.clearMemory();

            // Create a placeholder string to help with placing of hex digits used later in for loop
            var placeholder = "";

 
            // Get the element where the user input is kept
            var userInputHTML = <HTMLInputElement>document.getElementById("taProgramInput"); 

            // Store the input as a string
            var userInput: string = userInputHTML.value; 

            // If the user has no input then cant validate it
            if (userInput.length < 1) {
                _StdOut.putText("No user code was found");
            }
            // Create a regular expression for only hex digits and spaces
            var regex = /[0-9A-Fa-f\s]/;

            // Loop over the current input
            for (var i = 0; i < userInput.length; i++) {

                // If the character fails to pass the test than input is invalid
                if (regex.test(userInput.charAt(i)) === false) {

                    _StdOut.putText("Error, the code is invalid because it contains something other than a space or hex digit");
                    return;
                }
                else {

                    //Check to see if the character is a space
                    if (userInput.charAt(i) != " ") {
                        // Checks to see if the placeholder is empty 
                        if (placeholder.length == 0) {
                            // If empty then not a full instruction and need to save it and read another one
                            placeholder = userInput.charAt(i);
                        }
                        // If the first part of an instruction already exists then concat them and set the byte
                        else if (placeholder.length == 1) {

                           _MemoryManager0.setByte(counter, placeholder + userInput.charAt(i));

                            placeholder = ""; // wipe the placeholder

                            // Increment the counter used to load programs
                            counter = counter + 1;
                        }
                        else {
                            // we should never get here!
                            console.log("This should never happen");
                        }
                    }
                }
            }

            // Create a new process control block
            _CurrentProcess = new ProcessControlBlock();

            // Add the new PCB to the queue to be run
           // _ReadyQueue.add(processControlBlock);
            
            // Tell the user the code was valid and report the process ID to them
            _StdOut.putText("Code Validated and assigned a Process ID of " + _CurrentProcess.processID); 

        }
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
