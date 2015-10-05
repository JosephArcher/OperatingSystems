///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="canvastext.ts" />
///<reference path="shell.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "",
                    public lineHeight = _DefaultFontSize +_DrawingContext.fontDescent(currentFont, currentFontSize) + _FontHeightMargin , // Same Constant Used at the bottom to calculate the advanced line
                    public commandHistory = new Array(), // Used to track the commands the user enters
                    public commandCounter = 0, // Used to track the current position the user as they traverse the command history
                    public xPositionHistoy = new Array() // Used to track the history of the line wraped x positions to enable the backspace to find its spot on the previous line
                   ) {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }
        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }
        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }
        /*
           This is used to clear the users current command
           NOTE: This method calls the backspace command and will clear the current buffer
        */
        public clearLine(): void {

            // First check what is in the current buffer cause I need to backspace and clear those characters from the buffer
            var currentBuffer = this.buffer;

            //Check to make sure that the buffer is not empty
            if(currentBuffer != "") {
              
                for (var i = 0; i < currentBuffer.length; i ++) {

                    //Backspace the last character in the buffer
                    this.backSpace();
                }
            }
        }
        /*
            This is used to backspace the last character in the buffer
            The last character is removed from the console also
        */
        public backSpace(): void {

            // First get the last character that was entered ... this is the last character is the buffer
            var lastCharacter = this.buffer.charAt(this.buffer.length - 1);

            // Get the width of the character that we need to backspace
            var lastCharacterWidth = CanvasTextFunctions.measure(this.currentFont, this.currentFontSize, lastCharacter);


           // console.log(" the last character in the buffer is ... " + lastCharacter);

            // Next see if the character was drawn on the previous line and we have to move the x and y pos
            if(this.currentXPosition - lastCharacterWidth < -1) {
                // Still working on this feature
                console.log("Need to handle the reverse line wrap This is not implemented yet !");
                //Check the array to get the last inputed value
                if(this.xPositionHistoy.length != 0) {
                    this.currentXPosition = this.xPositionHistoy[this.xPositionHistoy.length - 1];
                    this.currentYPosition = this.currentYPosition - this.lineHeight;

                    //Clear the character from the buffer            
                    _DrawingContext.clearRect(this.currentXPosition - lastCharacterWidth, this.currentYPosition + _FontHeightMargin - this.lineHeight, lastCharacterWidth, this.lineHeight + 1);  

                    //Reset the current x position to account for the backspace    
                    this.currentXPosition = this.currentXPosition - lastCharacterWidth;

                    //Remove the lastCharacter from the buffer
                    this.buffer = this.buffer.substring(0, this.buffer.length - 1);
                }
            }
            else { 

                //Clear the character from the buffer            
               _DrawingContext.clearRect(this.currentXPosition - lastCharacterWidth, this.currentYPosition + _FontHeightMargin - this.lineHeight, lastCharacterWidth, this.lineHeight + 1);  

               //Reset the current x position to account for the backspace    
               this.currentXPosition = this.currentXPosition - lastCharacterWidth;

               //Remove the lastCharacter from the buffer
               this.buffer = this.buffer.substring(0, this.buffer.length - 1);
           }
        }
        public clearPrompt(): void {

            var lastCharacterWidth = CanvasTextFunctions.measure(this.currentFont, this.currentFontSize, ">");
            //Clear the character from the buffer            
            _DrawingContext.clearRect(this.currentXPosition - lastCharacterWidth, this.currentYPosition + _FontHeightMargin - this.lineHeight, lastCharacterWidth, this.lineHeight + 1);  

            //Reset the current x position to account for the backspace    
            this.currentXPosition = this.currentXPosition - lastCharacterWidth;

        }
        public handleInput(): void {

            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).

                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ... 
                   // console.log("Enter was pressed ..." + this.buffer);

                    if (this.buffer != "") { // Check to make sure that we dont add a blank command to the history

                        // Add the command to the command history
                        this.commandHistory.push(this.buffer);                    
                    }  
                     // Reset the counter to include the new command also if the user hits enter this should be reset anyways
                    this.commandCounter = this.commandHistory.length;

                    //Reset the array that handles the multi line inputs for a command because its different for each command
                    this.xPositionHistoy = [];  

                    _OsShell.handleInput(this.buffer);

                    // ... and reset our buffer.
                    this.buffer = "";
                }                
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                           
                    this.putText(chr);
                    // ... and add it to our buffer.                  
                    this.buffer += chr;
                                   
                }
                // TODO: Write a case for Ctrl-C.
            }
        }
        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that. 
            var nextCharacter = "";

            if (text !== "") {
                                         
                for (var i = 0; i < text.length; i++) {

                    nextCharacter = text.charAt(i) + "";
                    //Check to make sure that the character is able to be drawn on the current line
                    if (this.canFitOnLine(nextCharacter) === false) { // If not then 

                        console.log("we need to line wrap here");
                        //before we do this we need to save the space left to allow the backspace to find the last x pos on the previous line 
                        this.xPositionHistoy.push(this.currentXPosition);
                        console.log("The x pos for the previous line should be ...  " + this.currentXPosition);
                        this.advanceLine();
                    }
                    // Draw the text at the current X and Y coordinates.
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, nextCharacter);
                    var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, nextCharacter);
                    // Move the current X position.
                    this.currentXPosition = this.currentXPosition + offset;
                }
            } 
         }
         /*
             This is used to measure a character and return a boolean
             True:  if the character is able to be drawn
             False: if the character is not able to be drawn
         */
         public canFitOnLine(text): boolean {

            // Add the current x position to the width of the character to determine if the character can be drawn 
            var calculateLineWrap: number  = this.currentXPosition + CanvasTextFunctions.measure(this.currentFont, this.currentFontSize, text);

            // If the above number is over the width of the canvas
            if(calculateLineWrap > _Canvas.width) {

                return false; // Line wrap
            }
             return true; // No line wrap
         }
        
        public advanceLine(): void {

            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize + 
                                     _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                     _FontHeightMargin;

            // Check to see if the console needs to scroll
            if(this.currentYPosition >= _Canvas.height) {              

                // Get the image of the current canvas offset by the height of a line
                var imgData = _DrawingContext.getImageData(0, this.lineHeight + 2, _Canvas.width, _Canvas.height - this.lineHeight);

                // Clear the screen
                this.clearScreen();

                // Place the old text back on the screen at the  0 X 0 Y pos
                _DrawingContext.putImageData(imgData, 0, 0);  

                //Change the current y position to account for the offset
                this.currentYPosition = this.currentYPosition - this.lineHeight;

                //Change the current x position to the start of the line
                this.currentXPosition = 0;      
            }
        }
    }
 }
