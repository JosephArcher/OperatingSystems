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
var TSOS;
(function (TSOS) {
    var Kernel = (function () {
        function Kernel() {
        }
        //
        // OS Startup and Shutdown Routines
        //
        Kernel.prototype.krnBootstrap = function () {
            TSOS.Control.hostLog("bootstrap", "host"); // Use hostLog because we ALWAYS want this, even if _Trace is off.
            // Initalize the memory blocks
            _MemoryBlock = new TSOS.MemoryBlock();
            _MemoryBlock.init();
            // Initalize the memory partition array
            _MemoryManager = new TSOS.MemoryManager(_MemoryBlock, _MemoryPartitionArray);
            // _MemoryManager.printAllMemoryPartitions();
            console.log(_MemoryManager.getTotalMemorySize() + " JOE THE MEMORY SIZE IS");
            // Initialize our global queues.
            _KernelInterruptQueue = new TSOS.Queue(); // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array(); // Buffers... for the kernel.
            _KernelInputQueue = new TSOS.Queue(); // Where device input lands before being processed out somewhere.   
            _ReadyQueue = new TSOS.ReadyQueue(); // Initialize the Ready Queue             
            _ResidentList = new TSOS.ReadyQueue(); // Initialize the Resident Queue 
            _TerminatedProcessQueue = new TSOS.Queue(); // Initalize the Terminated Process Queue
            // Initialize the console.
            _Console = new TSOS.Console(); // The command line interface / console I/O device.
            _Console.init();
            // Initialize standard input and output to the _Console.
            _StdIn = _Console;
            _StdOut = _Console;
            // Initalize the Process Control Block Counter 
            _ProcessCounterID = -1;
            // Load the Keyboard Device Driver
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new TSOS.DeviceDriverKeyboard(); // Construct it.
            _krnKeyboardDriver.driverEntry(); // Call the driverEntry() initialization routine.
            this.krnTrace(_krnKeyboardDriver.status);
            // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();
            // Initalize the Cpu Statistics Table with its Table Element
            _CpuStatisticsTable = new TSOS.CpuStatisticsTable(_CpuStatisticsTableElement);
            // Initalize the Memory Information Table with its Table Element
            _MemoryInformationTable = new TSOS.MemoryInformationTable(_MemoryInformationTableElement);
            // Initalize the Process Control Table with its Table Element
            _ProcessControlBlockTable = new TSOS.ProcessControlBlockTable(_ProcessControlBlockTableElement);
            // Initalize the System InformationInferface with its HTML Elements
            _SystemInformationInterface = new TSOS.SystemInformationSection(_StatusSectionElement, _DateSectionElement, _TimeSectionElement);
            //Initalize the Resident List
            _ResidentListTable = new TSOS.ResidentListTable(_ResidentListTableElement);
            // Initalize the Ready Queue
            _ReadyQueueTable = new TSOS.ReadyQueueTable(_ReadyQueueTableElement);
            // Timer
            _Timer = new TSOS.Timer();
            // CPU Scheduling 
            _CPUScheduler = new TSOS.CpuScheduler();
            // Launch the shell.
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new TSOS.Shell();
            _OsShell.init();
            // Finally, initiate student testing protocol.
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
        };
        Kernel.prototype.krnShutdown = function () {
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
        };
        Kernel.prototype.krnOnCPUClockPulse = function () {
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
            }
            else if (_CPU.isExecuting) {
                console.log("About to cycle the CPU");
                // Checks to see if the single step mode is checked and if so do not allow the next cpu to cycle
                if ((_SingleStepMode == true && _AllowNextCycle == true) || (_SingleStepMode == false)) {
                    // Cycle the CPU
                    _CPU.cycle();
                    // Decrement the timer by one and check to see if it is finished
                    if (_Timer.decreaseTimerByOne() == TIMER_FINISHED) {
                        console.log("The Timer is finished/ Creating an interrupt");
                        // Create new interrupt to signal the end of the timer
                        _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TIMER_IRQ, TIMER_ENDED_PROCESS));
                    }
                    else {
                    }
                }
            }
            else {
                this.krnTrace("Idle");
            }
        };
        //
        // Interrupt Handling
        //
        Kernel.prototype.krnEnableInterrupts = function () {
            // Keyboard
            TSOS.Devices.hostEnableKeyboardInterrupt();
            // Put more here.
        };
        Kernel.prototype.createAndQueueInterrupt = function (name, values) {
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(name, values));
        };
        Kernel.prototype.krnDisableInterrupts = function () {
            // Keyboard
            TSOS.Devices.hostDisableKeyboardInterrupt();
            // Put more here.
        };
        Kernel.prototype.krnInterruptHandler = function (irq, params) {
            // This is the Interrupt Handler Routine.  See pages 8 and 560.
            // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on. Page 766.
            this.krnTrace("Handling IRQ~" + irq);
            // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
            // TODO: Consider using an Interrupt Vector in the future.
            // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.
            //       Maybe the hardware simulation will grow to support/require that in the future.
            switch (irq) {
                case TIMER_IRQ:
                    this.krnTimerISR(); // Kernel built-in routine for timers (not the clock).
                    break;
                case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params); // Kernel mode device driver
                    _StdIn.handleInput();
                    break;
                case PRINT_INTEGER_IRQ:
                    this.writeIntegerConsole(params);
                    break;
                case PRINT_STRING_IRQ:
                    this.writeStringConsole(params);
                    break;
                case INVALID_OPCODE_IRQ:
                    this.invalidOpCode(params);
                    break;
                case BREAK_IRQ:
                    this.krnBreakISR();
                    break;
                case BSOD_IRQ:
                    this.krnTrapError("BSOD Command");
                    break;
                case INVALID_OPCODE_USE_IRQ:
                    this.badOpCodeUsage(params);
                    break;
                case MEMORY_OUT_OF_BOUNDS_IRQ:
                    this.memoryOutOfBounds(params);
                    break;
                default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            }
        };
        Kernel.prototype.memoryOutOfBounds = function (params) {
            this.krnTrapError("BSOD Command");
        };
        /**
         * used to handle the timer interrupt
         */
        Kernel.prototype.krnTimerISR = function () {
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
            console.log("THE TIMER HAS ENDED RING RING RING");
            // Clear the timer and turn it off
            _Timer.clearTimer();
            // End the current process
            this.endProcess(_CPUScheduler.getCurrentProcess(), TIMER_ENDED_PROCESS);
        };
        /**
         *  Used to handle the break interrupt
         */
        Kernel.prototype.krnBreakISR = function () {
            console.log("The Break Interrupt has been hit");
            // End the current process
            this.endProcess(_CPUScheduler.getCurrentProcess(), BREAK_ENDED_PROCESS);
        };
        /**
         * Used to switch between processes
         * @Params nextProcessToRun {ProcessControlBlock} - The Next Process to be run by the cpu
         */
        Kernel.prototype.contextSwitch = function () {
            console.log("Performing a context swtich with processes");
            // Save the state of the current process into its PCB Block
            this.stateSave();
            // Get the next process to be run on the CPU
            var nextProcess = _CPUScheduler.getNextProcess(); // Calls the CPU Scheduler and returns the next process to run 
            // Start the next process by calling stateRestore
            this.startProcess(nextProcess);
        };
        /**
         * Used to store the current CPU information into the current process control block
         * Part of the context switch
         */
        Kernel.prototype.stateSave = function () {
            _Kernel.krnTrace("CPU Scheduler: Saving the state of PCB " + _CPUScheduler.currentProcess.getProcessID());
            console.log("Saving the State");
            // Save the current CPU Register values into the process control block
            _CPUScheduler.currentProcess.setProgramCounter(_CPU.PC);
            _CPUScheduler.currentProcess.setAcc(_CPU.Acc);
            _CPUScheduler.currentProcess.setXReg(_CPU.Xreg);
            _CPUScheduler.currentProcess.setYReg(_CPU.Yreg);
            _CPUScheduler.currentProcess.setZFlag(_CPU.Zflag);
        };
        /**
         * Used to set the current CPU information with the next process in order to run it correctly
         * @Params process {ProcessControlBlock} - The process that is being used to set the CPU
         */
        Kernel.prototype.stateRestore = function (process) {
            _Kernel.krnTrace("CPU Scheduler: Restoring the state of process" + _CPUScheduler.currentProcess.getProcessID());
            console.log("Restoring the State");
            // Set the Current Process equal to the process that was just restored
            _CPUScheduler.currentProcess = process;
            _CPU.PC = process.getProgramCounter();
            _CPU.Acc = process.getAcc();
            _CPU.Xreg = process.getXReg();
            _CPU.Yreg = process.getYReg();
            _CPU.Zflag = process.getZFlag();
        };
        /**
         * Used to create a new process
         * @Params baseAddress {Number} - The base address of the process in memory
         *         limitAddress{Number} - The limit address of the process in memory
         * @Returns {Number} - The ID of the newly created process
         */
        Kernel.prototype.createProcess = function (baseAddress, limitAddress) {
            // Create the new process
            var newProcess = new TSOS.ProcessControlBlock();
            // Set the base and limit registers of the process
            newProcess.setBaseReg(baseAddress);
            newProcess.setLimitReg(limitAddress);
            // Add the newly created process to the end of the resident list
            _ResidentList.enqueue(newProcess);
            // Return the ID of the newly created process
            return newProcess;
        };
        /*
         * Used to set the _CPU.isExecuting Property to True
         * This also calls the UI stuff that should happen when the CPU starts executing user programs
         */
        Kernel.prototype.startProcess = function (process) {
            console.log("The process to start it " + process);
            // Sets the Cpu to executing
            _CPU.isExecuting = true;
            // Load the PCB into the CPU to start the program
            this.stateRestore(process);
            // Handle UI from having programs executing
            TSOS.Utils.startProgramSpinner();
            // Set a new Timer for the length of the current Quanta
            _Timer.setNewTimer(_CPUScheduler.getQuantum());
            // Set the state of the process to running
            process.setProcessState(PROCESS_STATE_RUNNING);
        };
        /**
        * Used to end the given process and decide what to do next
        * @Params process {ProcessControlBlock} - The process that is being ended
                  callee  {String}              - The service that is ending the process
        */
        Kernel.prototype.endProcess = function (process, callee) {
            // First, check to see why the process was ended 
            // If the timer ended the process because of a scheduling algorithm
            if (callee == TIMER_ENDED_PROCESS) {
                // The process is not finished because of break so add it to the end of the ready queue
                _ReadyQueue.enqueue(process);
                // Context Switch to figure out what to do next
                this.contextSwitch();
            }
            else if (callee == BREAK_ENDED_PROCESS) {
                // Terminate the process
                this.terminateProcess(process);
                // Check to see if another process wants to execute
                if (_ReadyQueue.getSize() > 0) {
                    // If another process is currently active
                    this.contextSwitch(); // Context Switch
                }
                else {
                    // If no other process exists then stop CPU
                    this.stopCpuExecution(); // Stop the CPU
                }
            }
            else {
                console.log("This should never happen");
            }
        };
        Kernel.prototype.terminateProcess = function (process) {
            console.log("Terminating a process " + process.getProcessID());
            // Set the state of the process to terminated
            process.setProcessState(PROCESS_STATE_TERMINATED);
            // Remove the process from memory and update the UI Table
            _MemoryManager.clearMemoryPartition(process);
            // Add the process to the terminated process queue for later use
            _TerminatedProcessQueue.enqueue(process);
        };
        /*
         * Used to set the _CPU.isExecuting Property to False
         * This also calls the UI stuff that should happen when the CPU stops executing user programs
         */
        Kernel.prototype.stopCpuExecution = function () {
            console.log("Stopping the CPU execution becuase no processes are currently active");
            // Stop the Cpu from executing
            _CPU.isExecuting = false;
            // Handle the UI from having no programs execuing
            TSOS.Utils.endProgramSpinner();
            _Console.advanceLine();
            _OsShell.putPrompt();
            _CPUScheduler.currentProcess = null;
        };
        //
        // System Calls... that generate software interrupts via tha Application Programming Interface library routines.
        //
        /**
         * Used to write a string to the console
         */
        Kernel.prototype.writeStringConsole = function (startAddress) {
            var memLoc = startAddress - 1;
            //  console.log("Write a string out to the console!");
            var nextByte = _MemoryManager.getByte(memLoc);
            var nextValue = "";
            // Loop untill the null terminated string ends
            while (nextValue != "00") {
                // Increase the memory location 
                memLoc = 1 + memLoc;
                // Get the next
                var byte = _MemoryManager.getByte(memLoc);
                // console.log("Value of the Byte is :  " + byte.getValue());
                // var test = <Byte>_MemoryManager0.getByte(parseInt(byte.getValue(),16 ));
                // Print the next character to the console
                _StdOut.putText(TSOS.Utils.hexToAscii(byte.getValue()));
                // console.log("another etst " + test.getValue());
                // console.log("Address After: " + memLoc);
                // 
                nextValue = byte.getValue();
            }
            // console.log("hit a 00 and end of the string has been found");
            _Console.advanceLine();
        };
        /**
        * Used to write a integer to the console
        */
        Kernel.prototype.writeIntegerConsole = function (output) {
            // console.log("Write an Integer out to the console!");
            _StdOut.putText(output + "");
            _Console.advanceLine();
            //_CPU.beginExecuting( _ReadyQueue.first() );
        };
        Kernel.prototype.badOpCodeUsage = function (userMsg) {
            _CPU.isExecuting = false;
            // this.writeConsole(userMsg);
            _OsShell.putPrompt();
        };
        Kernel.prototype.invalidOpCode = function (code) {
            _CPU.isExecuting = false;
            _StdOut.putText("Error: The user program contains the unrecognizable Op Code " + code);
            _Console.advanceLine();
            _StdOut.putText("Ending the current running program");
            _Console.advanceLine();
            _OsShell.putPrompt();
        };
        //
        // OS Utility Routines
        //
        Kernel.prototype.krnTrace = function (msg) {
            // Check globals to see if trace is set ON.  If so, then (maybe) log the message.
            if (_Trace) {
                if (msg === "Idle") {
                    // We can't log every idle clock pulse because it would lag the browser very quickly.
                    if (_OSclock % 10 == 0) {
                        // Check the CPU_CLOCK_INTERVAL in globals.ts for an
                        // idea of the tick rate and adjust this line accordingly.
                        TSOS.Control.hostLog(msg, "OS");
                    }
                }
                else {
                    TSOS.Control.hostLog(msg, "OS");
                }
            }
        };
        Kernel.prototype.krnTrapError = function (msg) {
            TSOS.Control.hostLog("OS ERROR - TRAP: " + msg);
            TSOS.Utils.createBSOD(); // Create the blue screen of death
            this.krnShutdown();
            clearInterval(_hardwareClockID);
        };
        return Kernel;
    })();
    TSOS.Kernel = Kernel;
})(TSOS || (TSOS = {}));
