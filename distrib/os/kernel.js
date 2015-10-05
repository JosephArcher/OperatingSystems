///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="collections.ts" />
///<reference path="queue.ts" />
///<reference path="console.ts" />
///<reference path="memoryManager.ts" />
///<reference path="CpuStatisticsTable.ts" />
///<reference path="MemoryInformationTable.ts" />
///<reference path="ProcessControlBlockTable.ts" />
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
            //Initalize Memory
            _MemoryManager0 = new TSOS.MemoryManager(_MemoryBlock0);
            // Initialize our global queues.
            _KernelInterruptQueue = new TSOS.Queue(); // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array(); // Buffers... for the kernel.
            _KernelInputQueue = new TSOS.Queue(); // Where device input lands before being processed out somewhere.   
            // Create the Ready Queue where all the programs that are ready to run a kept
            _ReadyQueue = new collections.LinkedList();
            // Initialize the console.
            _Console = new TSOS.Console(); // The command line interface / console I/O device.
            _Console.init();
            // Initialize standard input and output to the _Console.
            _StdIn = _Console;
            _StdOut = _Console;
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
            // Update the current clock display
            var time = document.getElementById("currentTime");
            var date = document.getElementById("currentDate");
            //Append the updated date and time to the top bar
            time.innerHTML = TSOS.Utils.getTime() + "";
            date.innerHTML = TSOS.Utils.getDate() + "";
            // Check for an interrupt, are any. Page 560
            if (_KernelInterruptQueue.getSize() > 0) {
                // Process the first interrupt on the interrupt queue.
                // TODO: Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
                var interrupt = _KernelInterruptQueue.dequeue();
                this.krnInterruptHandler(interrupt.irq, interrupt.params);
            }
            else if (_CPU.isExecuting) {
                _CPU.cycle();
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
                case PRINT_IRQ:
                    this.writeConsole(params);
                    break;
                case INVALID_OPCODE_IRQ:
                    this.invalidOpCode(params);
                    break;
                case BREAK_IRQ:
                    this.endProcess();
                    break;
                case BSOD_IRQ:
                    this.krnTrapError("BSOD Command");
                    break;
                case INVALID_OPCODE_USE_IRQ:
                    this.badOpCodeUsage(params);
                    break;
                default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            }
        };
        Kernel.prototype.krnTimerISR = function () {
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
        };
        //
        // System Calls... that generate software interrupts via tha Application Programming Interface library routines.
        //
        Kernel.prototype.writeConsole = function (output) {
            console.log(output + "this is the output!");
            _StdOut.putText(output);
            _Console.advanceLine();
        };
        Kernel.prototype.endProcess = function () {
            _CPU.isExecuting = false;
            // Update and display the PCB Contents
            var holder = _ReadyQueue.first();
            holder.setProcessState(PROCESS_STATE_TERMINATED);
            _ProcessControlBlockTable.updateTableContents(_ReadyQueue.first());
            _ReadyQueue.clear();
            console.log(_ReadyQueue.size() + 'after clear ');
            this.writeConsole("Program Finished Running");
            _OsShell.putPrompt();
        };
        Kernel.prototype.badOpCodeUsage = function (userMsg) {
            _CPU.isExecuting = false;
            this.writeConsole(userMsg);
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
        Kernel.prototype.loadUserProgram = function () {
            console.log("Loading a new user program!");
            // Set the counter to zero to load the user program into memory 0000
            var counter = 0;
            // Clear the current memory
            _MemoryManager0.clearMemory();
            // Create a placeholder string to help with placing of hex digits used later in for loop
            var placeholder = "";
            // Create a new process control block
            var processControlBlock = new TSOS.ProcessControlBlock();
            // Get the element where the user input is kept
            var userInputHTML = document.getElementById("taProgramInput");
            // Store the input as a string
            var userInput = userInputHTML.value;
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
            // Add the new PCB to the queue to be run
            _ReadyQueue.add(processControlBlock);
            // Tell the user the code was valid and report the process ID to them
            _StdOut.putText("Code Validated and assigned a Process ID of " + processControlBlock.processID);
        };
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
