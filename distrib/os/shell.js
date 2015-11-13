///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="interrupt.ts" />
///<reference path="processControlBlock.ts" />
///<reference path="memoryManager.ts" />
/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc;
            // Load the command list.
            // Ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            //Date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the current time and date");
            this.commandList[this.commandList.length] = sc;
            //WhereAmI
            sc = new TSOS.ShellCommand(this.shellLocation, "whereami", "- Displays the current URL of the Page");
            this.commandList[this.commandList.length] = sc;
            //Screen
            sc = new TSOS.ShellCommand(this.shellScreen, "screen", "-Displays information about the screen");
            this.commandList[this.commandList.length] = sc;
            //Status
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<String> - Sets the status message on the taskbar to the <String>");
            this.commandList[this.commandList.length] = sc;
            //Blue Screen Of Death
            sc = new TSOS.ShellCommand(this.shellBSOD, "bsod", "- Crash the mighty Joe/S with a single command! RAW POWER!");
            this.commandList[this.commandList.length] = sc;
            //Load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Validates code in 'User Program Input' section ");
            this.commandList[this.commandList.length] = sc;
            //Run
            sc = new TSOS.ShellCommand(this.shellRun, "run", "- Runs a program already in memory");
            this.commandList[this.commandList.length] = sc;
            //ClearMem
            sc = new TSOS.ShellCommand(this.clearMem, "clearmem", "-Clears all memory partitions");
            this.commandList[this.commandList.length] = sc;
            //RunAll
            sc = new TSOS.ShellCommand(this.runAll, "runall", "Executes all programs");
            this.commandList[this.commandList.length] = sc;
            // Quantum <int>
            sc = new TSOS.ShellCommand(this.quantum, "quantum", "<int> - Sets the Round Robin Quantum (Measured in clock ticks)");
            this.commandList[this.commandList.length] = sc;
            // PS 
            sc = new TSOS.ShellCommand(this.ps, "ps", "-Displays the PIDs of all active processes");
            this.commandList[this.commandList.length] = sc;
            // Kill
            sc = new TSOS.ShellCommand(this.kill, "kill", "<PID> - Kills the active process");
            this.commandList[this.commandList.length] = sc;
            // Create <Filename>
            sc = new TSOS.ShellCommand(this.create, "create", "Create the file <Filename> and display a message denoting success or failure");
            this.commandList[this.commandList.length] = sc;
            // Read <Filename>
            sc = new TSOS.ShellCommand(this.read, "read", "Read and display the contents of <Filename> or display an error if somthing went wrong");
            this.commandList[this.commandList.length] = sc;
            // Write <Filename>
            sc = new TSOS.ShellCommand(this.write, "write", "Write the data inside the quotes to <Filename> and display a message denoting success or failure");
            this.commandList[this.commandList.length] = sc;
            // Delete <Filename>
            sc = new TSOS.ShellCommand(this.delete, "delete", "Remove <Filename> from storage and display a message denoting succss or failure");
            this.commandList[this.commandList.length] = sc;
            // Format
            sc = new TSOS.ShellCommand(this.format, "format", "Initalize all blocks in all sectors in all tracks and display a message denoting success or failure");
            this.commandList[this.commandList.length] = sc;
            // List
            sc = new TSOS.ShellCommand(this.list, "ls", "List the files currently stored on the disk");
            this.commandList[this.commandList.length] = sc;
            // Set Schedule
            sc = new TSOS.ShellCommand(this.setSchedule, "setschedule", "Set the CPU scheduling algorithm {rr , fcfs, priority }");
            this.commandList[this.commandList.length] = sc;
            // Get Schedule
            sc = new TSOS.ShellCommand(this.getSchedule, "getschedule", "Get the current CPU scheduling algorithm {rr , fcfs, priority }");
            this.commandList[this.commandList.length] = sc;
            // Help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // Shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // Cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // Man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // Trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // Prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // Display the initial prompt.
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) {
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    this.execute(this.shellApology);
                }
                else {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            // if(fn == this.shellRun && _CurrentProcess != null) {
            //    if(_CurrentProcess.getProcessID() == args){                 
            //         return;
            //     }                      
            //  }
            this.putPrompt();
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION); // Get the name of the OS and the version number
        };
        Shell.prototype.shellDate = function (args) {
            _StdOut.putText(TSOS.Utils.getDate() + " " + TSOS.Utils.getTime()); // Get the current date
        };
        Shell.prototype.shellLocation = function (args) {
            var x = location.href; // Get the current URL    
            _StdOut.putText(x);
        };
        Shell.prototype.shellScreen = function (args) {
            var width = screen.width; // get Screen width
            var height = screen.height; // get screen height
            var color = screen.pixelDepth; // get screen color pixel in bits
            _StdOut.putText("Width: " + width + " Height: " + height + " Color: " + color + " Bit");
        };
        Shell.prototype.shellStatus = function (args) {
            var output = "";
            var statusMsg = document.getElementById("statusMsg");
            if (args.length > 0) {
                for (var i = 0; i < args.length; i++) {
                    output = output + args[i] + " ";
                }
                _SystemInformationInterface.setStatusMessage(output);
            }
            else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellBSOD = function () {
            var params = "";
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(BSOD_IRQ, params)); // Create a new Interupt to handle the Blue Screen of death and add it to the queue    
        };
        /**
         * used to load the user program in the text area into main memory
        */
        Shell.prototype.shellLoad = function (args) {
            // Before doing any work check to see if any free space is available in memory
            if (_MemoryManager.availableMemoryPartitions.getSize() < 1) {
                // If no space is available then tell user
                _StdOut.putText("Unable to load program, no free memory partition ");
                // then stop and do nothing else
                return;
            }
            // Initalize Globals
            var counter = 0; // Set the counter to zero to load the user program into memory 0000
            var placeholder = ""; // Create a placeholder string to help with placing of hex digits used later in for loop
            // Pull the input value from the HTML Element
            var userInputHTML = document.getElementById("taProgramInput");
            // Save the input as a     
            var userInput = userInputHTML.value;
            // *** Validate the User input *** \\
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
            }
            // *** If the flow makes it here then the userInput is valid *** \\  
            // Load the program into memory and clean up the whitespace
            var processID = _MemoryManager.loadProgramIntoMemory(userInput.replace(/ /g, '')); // Load the program into memory and save its process ID to be printed out to user
            _StdOut.putText("Program loaded and assigned a Process ID of " + processID + " Size " + _ResidentList.getSize()); // Tell the user the process ID 
        };
        /**
        * Used to run a user program that is currently in main memory
        */
        Shell.prototype.shellRun = function (args) {
            // Check to see if the process the user wants to run is currently in memory
            var nextProcessControlBlock = _MemoryManager.findProcessInMemory(args);
            // If the process exists 
            if (nextProcessControlBlock != null) {
                // Tell the user
                _StdOut.putText("The Process exists");
                // Instead of starting process just add to the ready queue then call something
                _ReadyQueue.enqueue(nextProcessControlBlock);
                // Update the UI with the new process
                _ReadyQueueTable.addRow(nextProcessControlBlock);
                // Check to see if the CPU is currently executing
                if (_CPU.isExecuting != true) {
                    // Start the next process
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(START_PROCESS_IRQ, _CPUScheduler.getNextProcess()));
                }
            }
            else {
                // Tell the user and do nothing
                _StdOut.putText("The Process does not exist");
            }
        };
        /**
         * Used to run all of the currently loaded programs
         */
        Shell.prototype.runAll = function (args) {
            // Check to see if any programs are currently loaded in memory
            // If at least one process exists
            if (_ResidentList.getSize() > 0) {
                // Tell the user
                _StdOut.putText("Running All Processes size = " + _ResidentList.getSize());
                // Loop over the resident list and add each process in order to the ready queue
                for (var i = 0; i < _ResidentList.getSize(); i++) {
                    // Instead of starting process just add to the ready queue then call something
                    _ReadyQueue.enqueue(_ResidentList.getElementAt(i));
                    // Update the UI with the new process
                    _ReadyQueueTable.addRow(_ResidentList.getElementAt(i));
                }
                // Start the next process
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(START_PROCESS_IRQ, _CPUScheduler.getNextProcess()));
            }
            else {
                // Tell the user and do nothing
                _StdOut.putText("Error: Unable to run any programs because non are loaded into main memory");
            }
        };
        /**
         * Used to clear all memory partitions in the O/S
         */
        Shell.prototype.clearMem = function (args) {
            // Clear all memory partitions
            _MemoryManager.clearAllMemoryPartitions();
        };
        /**
         * Used to set the current quantum for round robin scheduling
         */
        Shell.prototype.quantum = function (newQuantum) {
            // Set the new quantm value
            _CPUScheduler.setQuantum(newQuantum);
        };
        /**
         *  Used to Display all of the active PID's
         */
        Shell.prototype.ps = function (args) {
            // Build a string of all the active PID's
            var activePIDs = _ReadyQueue.getAllPids();
            var outputString = "The currently active processes are: ";
            var len = activePIDs.length;
            var runningProcessID = "";
            if (len == 0) {
                _StdOut.putText("Sorry, no processes are currently active");
                return;
            }
            for (var i = 0; i < len; i++) {
                outputString = outputString + " " + activePIDs.charAt(i);
            }
            if (_CPUScheduler.getCurrentProcess() != null) {
                runningProcessID = _CPUScheduler.getCurrentProcess().getProcessID() + "";
            }
            // Write the out a message to the user with the with all the active pid's
            _StdOut.putText(outputString + " " + runningProcessID);
        };
        /**
         * Used to stop and kill a currently active process
         */
        Shell.prototype.kill = function (processID) {
            // Check the size of the ready queue 
            if (_ReadyQueue.getSize() > 0 || _CPUScheduler.getCurrentProcess() != null) {
                // Get the process form the  ready queue / _CPU Scheduler }
                var process = _ReadyQueue.isExistingProcess(processID);
                console.log(process + " JOE THIS IS THE PRCESS SHISDFJKLSJDL:KFJSKDL:FJ:SKLDFJ:KLSJF:KLSJDF:LKSJD:FLKJSD:");
                // Check to see if the process exists in ready queue
                if (process != null) {
                    _StdOut.putText("R.I.P process " + process.getProcessID());
                    // TERMINATE  
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TERMINATE_PROCESS_IRQ, process));
                }
                else {
                    // Check to see if process is the current one being executed
                    if (processID == _CPUScheduler.getCurrentProcess().getProcessID()) {
                        _StdOut.putText("Killing the current process");
                        _ReadyQueueTable.removeProcessById(_CPUScheduler.getCurrentProcess());
                        // TERMINATE
                        _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TERMINATE_PROCESS_IRQ, _CPUScheduler.getCurrentProcess()));
                    }
                    else {
                        _StdOut.putText("The process you are trying to kill does not exist");
                    }
                }
            }
            else {
                // Tell the user the error and do nothing
                _StdOut.putText("Sorry, no processes are currently running... ");
            }
        };
        /////////////////////////////////////////////////////////////////////////////////
        //                                                                             //
        //                     File System Shell Commands                              //
        //                                                                             //
        /////////////////////////////////////////////////////////////////////////////////
        /**
         * Used to create a new file in the file system
         */
        Shell.prototype.create = function (args) {
            var response = [];
            response[0] = CREATE_FILE;
            response[1] = args;
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(FILE_SYSTEM_IRQ, response));
        };
        /**
         * Used to read a file in the file system
         */
        Shell.prototype.read = function (args) {
            var response = [];
            response[0] = READ_FILE;
            response[1] = args;
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(FILE_SYSTEM_IRQ, response));
        };
        /**
         * Used to write to a file in the file system
         */
        Shell.prototype.write = function (args) {
            var response = [];
            response[0] = WRITE_FILE;
            response[1] = args;
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(FILE_SYSTEM_IRQ, response));
        };
        /**
         * Used to delete a file in the file system
         */
        Shell.prototype.delete = function (args) {
            var response = [];
            response[0] = DELETE_FILE;
            response[1] = args;
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(FILE_SYSTEM_IRQ, response));
        };
        /**
         * Used to list all the files in the file system
         */
        Shell.prototype.list = function () {
            var response = [];
            response[0] = LIST_FILES;
            response[1] = "";
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(FILE_SYSTEM_IRQ, response));
        };
        /**
         * Used to fomrat the drive
         */
        Shell.prototype.format = function () {
            var response = [];
            response[0] = FORMAT_DRIVE;
            response[1] = "";
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(FILE_SYSTEM_IRQ, response));
        };
        /**
         * Sets the current scheduling algorithm for the CPU Scheduler
         */
        Shell.prototype.setSchedule = function (schedulingAlgorithm) {
            // Check to see if the scheduling algorithm is valid
            if (schedulingAlgorithm == ROUND_ROBIN || schedulingAlgorithm == FIRST_COME_FIRST_SERVE || schedulingAlgorithm == NON_PREEMPTIVE_PRIORITY) {
                _CPUScheduler.setSchedulingAlgorithm(schedulingAlgorithm);
            }
            else {
                _StdOut.putText("Error { " + schedulingAlgorithm + " } is not valid... Please enter either rr, fcfs, or priority <INT>");
            }
        };
        /**
         * Gets the current scheduling algorithm from the CPU Scheduler
         */
        Shell.prototype.getSchedule = function () {
            // Get the current scheduling algorithm and report it to the user
            _StdOut.putText("The current scheduling algorithm is [ " + _CPUScheduler.getSchedulingAlgorithm + " ]");
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                // The user string that was enterd
                var topic = args[0];
                // The length of the current command list
                var test = _OsShell.commandList.length;
                // The next command in the list
                var nextCommand;
                // Loop over the list 
                for (var i = 0; i < test; i++) {
                    //Get the next command in the list
                    nextCommand = _OsShell.commandList[i];
                    // if the next command matches the user string
                    if (nextCommand.command == topic) {
                        // Tell the user what the commmand does
                        _StdOut.putText(" The " + args[0] + " command  does " + nextCommand.description);
                        return;
                    }
                }
                _StdOut.putText(" The " + args[0] + " command  does not exist");
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
        return Shell;
    })();
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
