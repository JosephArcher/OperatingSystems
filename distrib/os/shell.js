///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="interrupt.ts" />
///<reference path="processControlBlock.ts" />
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
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            //date
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
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            //
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
            if (fn == this.shellRun && _CurrentProcess != null) {
                if (_CurrentProcess.getProcessID() == args) {
                    return;
                }
            }
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
            // load the program into memory 
            _Kernel.loadUserProgram();
        };
        /**
        * Used to run a user program that is currently in main memory
        */
        Shell.prototype.shellRun = function (args) {
            var userInput = args;
            var process = true;
            // Check to see if anything is in the ready queue
            // if (_CurrentProcess != null) {
            //   
            //  }else{
            //     _StdOut.putText("No user program is loaded, please load a program using the load command");
            //   
            //   }
            // Check the user Input for a PID and then see if that current one exists in the queue          
            // process = Utils.isExistingProcess(args);
            if (_CurrentProcess == null) {
                process = false;
                _StdOut.putText("Sorry, the process ID that you entered does not exist");
                return;
            }
            if (_CurrentProcess.getProcessID() != userInput) {
                _StdOut.putText("Sorry, the process ID that you entered does not match any currently loaded processes");
                process = false;
                return;
            }
            if (process == true) {
                // var currentProcess = <TSOS.ProcessControlBlock> _ReadyQueue.first();
                _CurrentProcess.setProcessState(PROCESS_STATE_RUNNING);
                _CPU.beginExecuting(_CurrentProcess);
                _CPU.isExecuting = true;
                TSOS.Utils.startProgramSpinner();
            }
            else {
                _StdOut.putText("Sorry, the process ID that you entered does not exist");
            }
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
