///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="deviceDriver.ts" />
///<reference path="canvastext.ts" />

/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.
            super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
           if(_CPU.isExecuting == true){
               console.log("Preventing keyboard press");
               return;
           }
            var keyCode = params[0];
            var isShifted = params[1];
            var nextCharacter = "";
            
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
           
            var chr = "";
 

            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
                ((keyCode >= 97) && (keyCode <= 123))) {  // a..z {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    
                    chr = String.fromCharCode(keyCode);
                }
                
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            }
            else if( ((keyCode >= 48) && (keyCode <= 57))) { // Digits

                if(isShifted) {
                    chr = Utils.getShiftedNumber(keyCode);
                }
                else {
                    chr = String.fromCharCode(keyCode);
                }
                _KernelInputQueue.enqueue(chr);
            } 
            else if ( (keyCode == 32) || (keyCode == 13) ) { // Space or Enter                   
                                                            
                 chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            else if(  ((keyCode >= 186) && (keyCode <= 192) ) ||
                       ((keyCode >= 219) && (keyCode <= 222)) )  { // Handle the punctucation (DOES NOT INCLUDE THE SHIFTED NUMBERS)

                   if(isShifted) {
                       chr = Utils.getSpecialCharacterShifted(keyCode);
                   }
                   else {
                        chr = Utils.getSpecialCharacter(keyCode);
                   }
                   _KernelInputQueue.enqueue(chr);
            }
            else if( (keyCode == 38) || (keyCode == 40)) { // Up or Down Arrow

                var nextCharacter = "";
                var command = "";             
                // First check to see if anything is actually in the command history
                if(_Console.commandHistory.length > 0) {

                    if (keyCode == 38) { // Up Arrow

                        //console.log("Up Arrow was pressed");
                        
                        // Check to see if the user is already viewing the first command
                        if (_Console.commandCounter == 0) {
                            // Cant do anything 
                        }
                        else { 

                            //Clear the Current Line and the current Buffer
                            _Console.clearLine(); 

                            // because using an array have to account for the index offset so minus 1 to get the most recent command
                            _Console.commandCounter = _Console.commandCounter - 1;
                           // console.log("The command Counter is at index" + _Console.commandCounter);
                            // Look up the newly adjusted counter in our history to get the exact command
                            command = _Console.commandHistory[_Console.commandCounter];
                           
                            // Loop over the command and add each of the characters into the Input Queue for the kernal to handle
                            for (var i = 0; i < command.length; i++) {
                                _KernelInputQueue.enqueue(command.charAt(i)); // Doing it this way should also add this to buffer 
                            }
                        }
                  }
                  else { // Down Arrow
                       
                      // Check to see if the user is already viewing the more recent command
                        //console.log("Counter ... " + _Console.commandCounter);
                        //console.log("Length of history" + _Console.commandHistory.length);

                      if( (_Console.commandCounter + 1) >= _Console.commandHistory.length) {
                          //console.log("cant do anything already showing user the most recent command or not command exists");                      
                      }
                      else { 
                           //Clear the Current Line and the current Buffer
                            _Console.clearLine(); 

                            // because using an array have to account for the index offset so minus 1 to get the most recent command
                            _Console.commandCounter = _Console.commandCounter + 1;
                           
                            // Look up the newly adjusted counter in our history to get the exact command
                            command = _Console.commandHistory[_Console.commandCounter];
                           // console.log(command.length + " this is the length");
                            // Loop over the command and add each of the characters into the Input Queue for the kernal to handle
                            for (var i = 0; i < command.length; i++) {
                                _KernelInputQueue.enqueue(command.charAt(i)); // Doing it this way should also add this to buffer 
                            }
                        }
                    }                        
                }              
            }
            else if(keyCode == 8) { // Backspace 

                // First check to see if anything is in the buffer
                if (_Console.buffer != "") {
                    _Console.backSpace();
                }
                else{
                    // Do nothing you are not able to backspace 
                }
            }
            else if(keyCode == 9) { // Tab   

                var matchingCommands = new Array();  // Create an array to hold the possible matching commands

                // Initalize the variables needed
                var nextCommand;    // Used to store the next command in the list while looping                
                var subCommand;     // Used to store the section of the command that i need to compare to
                var currentBuffer;  // The current buffer in a string
               
                 //Check what is currenly in the buffer...
                 currentBuffer = _Console.buffer;

                 // If text exists
                 if(currentBuffer != "") {

                     // Loop over the current command List
                     for (var i = 0; i < _OsShell.commandList.length; i++) {

                         nextCommand = _OsShell.commandList[i].command; // The next command to be checked
                         subCommand = nextCommand.substring(0, currentBuffer.length); // The substring that will allow to see if the buffer has any partial commands typed

                         // Compare the next subcommand to the buffer and if any match store them into an array for Output
                         if (subCommand === currentBuffer) {    
                             matchingCommands.push(_OsShell.commandList[i].command);
                             //console.log(" new command was added to the command line " + _OsShell.commandList[i].command);
                         }
                         else {
                             // Test the next commmand
                             // Do nothing here
                         }
                     }
                 }
                 else {
                     console.log("Opps user cant tab with nothing being typed! do nothing");
                 }
                 // Check the length of the array and if  1 then only one commmand matched 
                 if(matchingCommands.length === 1) {  
                     // Clear the current buffer cause we are about to add to it
                    // _Console.buffer = "";
                     _Console.clearLine();
                     // Then Auto Fill the command that matched
                     //console.log("this is the length of the command" + matchingCommands[0].length);
                     for (var i = 0; i < matchingCommands[0].length; i++){
                         //console.log("adding to the querue  " + matchingCommands[0].charAt(i));
                         _KernelInputQueue.enqueue(matchingCommands[0].charAt(i));
                     } 
                     //_StdOut.putText(matchingCommands[0]);
                     // Then add the new command to the buffer 
                    // _Console.buffer = matchingCommands[0];

                     // console.log( _Console.buffer + " ... Is the current Buffer");

                 }
                 // If more than one command matched then just display all of the possible options to the user
                 else if(matchingCommands.length > 1){
                      // Clear the current line and the current buffer
                     _Console.clearLine();

                     // Loop over the current MatchingCommands Array and output them to the console
                     for (var i = 0; i < matchingCommands.length; i++) {

                          _StdOut.putText("-" + matchingCommands[i] + " ");

                         }
                       
                     
                     // Next because the line makes no sense now to the user and contains many differnt commmands just give them a new line to type on
                     _Console.advanceLine();
                     _OsShell.putPrompt();

                    // console.log( _Console.buffer + " ... Is the current Buffer");
                 } 
                 // This is the case if none of the commands matched and just need to do nothing
                 else {
                     // Do Nothing
                 }
            }
        }
    }
}
