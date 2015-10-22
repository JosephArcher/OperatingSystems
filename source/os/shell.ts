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

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {
        }

        public init() {
            var sc;
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            //date
            sc = new ShellCommand(this.shellDate,
                                    "date",
                                    "- Displays the current time and date");
            this.commandList[this.commandList.length] = sc;

            //WhereAmI
            sc = new ShellCommand(this.shellLocation,
                                    "whereami",
                                    "- Displays the current URL of the Page");
            this.commandList[this.commandList.length] = sc;

            //Screen
            sc = new ShellCommand(this.shellScreen,
                                    "screen",
                                    "-Displays information about the screen");
            this.commandList[this.commandList.length] = sc;

            //Status
            sc = new ShellCommand(this.shellStatus,
                                    "status",
                                    "<String> - Sets the status message on the taskbar to the <String>");
            this.commandList[this.commandList.length] = sc;

            //Blue Screen Of Death
            sc = new ShellCommand(this.shellBSOD,
                                    "bsod",
                                    "- Crash the mighty Joe/S with a single command! RAW POWER!");
            this.commandList[this.commandList.length] = sc;

            //Load
            sc = new ShellCommand(this.shellLoad,
                                    "load",
                                    "- Validates code in 'User Program Input' section ");
            this.commandList[this.commandList.length] = sc;

            //Run
            sc = new ShellCommand(this.shellRun,
                                    "run",
                                    "- Runs a program already in memory");
            this.commandList[this.commandList.length] = sc;

            //ClearMem
            sc = new ShellCommand(this.clearMem,
                                    "clearmem",
                                    "-Clears all memory partitions");
            this.commandList[this.commandList.length] = sc;

            //RunAll
            sc = new ShellCommand(this.runAll,
                                    "runall",
                                    "Executes all programs");
            this.commandList[this.commandList.length] = sc;

            // Quantum <int>
            sc = new ShellCommand(this.quantum,
                "quantum",
                "<int> - Sets the Round Robin Quantum (Measured in clock ticks)");
            this.commandList[this.commandList.length] = sc;

            // PS 
            sc = new ShellCommand(this.ps,
                                    "ps",
                                     "-Displays the PIDs of all active processes");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.kill,
                                    "kill",
                                "<PID> - Kills the active process");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.

            //
            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
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
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);   
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
            
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }

            // ... and finally write the prompt again.
            if(fn == this.shellRun && _CurrentProcess != null) {
                if(_CurrentProcess.getProcessID() == args){                 
                    return;
                }                      
            }
              this.putPrompt();           
        }
        public parseInput(buffer): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }
        public shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION); // Get the name of the OS and the version number
            
        }
        public shellDate(args) {
            _StdOut.putText( Utils.getDate() + " " + Utils.getTime() ); // Get the current date
        }
        public shellLocation(args) {

            var x = location.href; // Get the current URL    
            _StdOut.putText(x);
        }
        public shellScreen(args) {
            
            var width = screen.width; // get Screen width
            var height = screen.height; // get screen height
            var color = screen.pixelDepth; // get screen color pixel in bits

            _StdOut.putText("Width: " + width + " Height: " + height + " Color: " + color + " Bit");
        }
        public shellStatus(args) {
            
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

        }
        public shellBSOD() {
            var params = "";
            _KernelInterruptQueue.enqueue(new Interrupt(BSOD_IRQ , params)); // Create a new Interupt to handle the Blue Screen of death and add it to the queue    

        }
        /**
         * used to load the user program in the text area into main memory
        */
        public shellLoad(args) {

             // load the program into memory 
            _Kernel.loadUserProgram();      
        }
        /**
        * Used to run a user program that is currently in main memory
        */ 
        public shellRun(args) {

            var userInput:string = args;
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
           if(_CurrentProcess == null){
               process = false;
               _StdOut.putText("Sorry, the process ID that you entered does not exist");
               return;

           }
           if(_CurrentProcess.getProcessID() != userInput){
             
               _StdOut.putText("Sorry, the process ID that you entered does not match any currently loaded processes");
               process = false;
               return;
           }

            if(process == true) {

               // var currentProcess = <TSOS.ProcessControlBlock> _ReadyQueue.first();
                _CurrentProcess.setProcessState(PROCESS_STATE_RUNNING); 
                _CPU.beginExecuting(_CurrentProcess);
                _CPU.isExecuting = true;
                Utils.startProgramSpinner();
            }
            else{
                _StdOut.putText("Sorry, the process ID that you entered does not exist");

            }     
        }
        public clearMem(args) { 
            console.log("Clearing all memory partitions");

        }
        public runAll(args){
            console.log("Running all user processes");
        }
        public quantum(newQuantum: number){
            console.log("Setting the Round Robin Quantum to... " + newQuantum);
            _CPUScheduler.setQuantum(newQuantum);
        }
        public ps(args){
            console.log("Displaying all active PIDS");
        }
        public kill(args){
            console.log("Killing process " + args);

            if(Utils.isExistingProcess(args) == true){
                _ReadyQueueTable.removeRow(args);
                _StdOut.putText("Deleted process"); 
            }
            else{
                _StdOut.putText("Sorry, the process ID that you entered does not exist"); 
            }
            
            
        }
        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }
        public shellShutdown(args) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }
        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellMan(args) {

            if (args.length > 0) {


                // The user string that was enterd
                var topic = args[0];

                // The length of the current command list

                var test: number = _OsShell.commandList.length;

                // The next command in the list

                var nextCommand;

                // Loop over the list 
                for (var i = 0; i < test; i++) {
                    //Get the next command in the list
                    nextCommand = _OsShell.commandList[i];

                    // if the next command matches the user string
                    if(nextCommand.command == topic) {

                        // Tell the user what the commmand does
                        _StdOut.putText(" The " + args[0] + " command  does " + nextCommand.description);
                        return;
                    }

                }
                _StdOut.putText(" The " + args[0] + " command  does not exist" );
            }  
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }
        public shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
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
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

    }
}
