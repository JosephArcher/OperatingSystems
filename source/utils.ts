  /// <reference path="jquery.d.ts" />
  ///<reference path="globals.ts" />
/* --------
   Utils.ts

   Utility functions.
   -------- */
module TSOS {

    export class Utils {

        public static trim(str): string {
            // Use a regular expression to remove leading and trailing spaces.
            return str.replace(/^\s+ | \s+$/g, "");
            /*
            Huh? WTF? Okay... take a breath. Here we go:
            - The "|" separates this into two expressions, as in A or B.
            - "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
            - "\s+$" is the same thing, but at the end of the string.
            - "g" makes is global, so we get all the whitespace.
            - "" is nothing, which is what we replace the whitespace with.
            */
        }
        /**
         * Used to clear the user input field when the O/S is turned off
         */ 
        public static clearUserInput(): void {

        var userInputHTML = <HTMLInputElement>document.getElementById("taProgramInput"); 

        userInputHTML.value = "";


        }
        /**
         * Used to clear the CPU UI table when the O/S is turned off
         */
        public static clearCpuUI(): void {
          _CpuStatisticsTable.setProgramCounter("00");
          _CpuStatisticsTable.setInstructionRegister("00");
          _CpuStatisticsTable.setAccumulator("00");
          _CpuStatisticsTable.setXRegister("00");
          _CpuStatisticsTable.setYRegister("00");
          _CpuStatisticsTable.setZFlag("00");
        }
        /**
         * Used to handle the UI changes when the power is turned on
         */
        public static togglePowerOn(): void {

         _ProgramSpinner.style.color = "#00B200";

        $(document).ready(function() {

        $("#btnStartOS").removeClass("btn-navPowerOffBorder");
        $("#btnStartOS").addClass("btn-navPowerOnBorder");

         
          $("#face").addClass("sad");
          $("#face").removeClass("happy");
          $("#systemInformationPanel").animate({ width: '100%' }, "slow");
          $("#systemInformationPanelCheck").fadeIn(); 

          $("#userProgramInputPanel").animate({ width: '100%' }, "slow");
          $("#userProgramInputPanelCheck").fadeIn(); 

          $("#residentListPanel").animate({ width: '100%' }, "slow");
          $("#residentListPanelCheck").fadeIn(); 

          $("#readyQueuePanel").animate({ width: '100%' }, "slow");
          $("#readyQueuePanelCheck").fadeIn(); 

          $("#cpuStatPanel").animate({ width: '100%' }, "slow");
          $("#cpuStatPanelCheck").fadeIn(); 

          $("#processControlBlockPanel").animate({ width: '100%' }, "slow");
          $("#processControlBlockPanelCheck").fadeIn(); 

          $("#mainMemoryPanel").animate({ width: '100%' }, "slow");   
          $("#mainMemoryPanelCheck").fadeIn(); 

          $("#processPanel").animate({ width: '100%' }, "slow");
          $("#processPanelCheck").fadeIn(); 
          $("#fileSystemPanelCheck").fadeIn(); 
         });    
       }

        /**
         * Used to handle the UI changes when the power is turned off
         */
        public static togglePowerOff(): void {
      console.log("OFFFFFFFFFFF");
            _ProgramSpinner.style.color = "#FF0000";
            this.endProgramSpinner();
  
            $(function() {
              $("#btnStartOS").removeClass("btn-navPowerOnBorder");
              $("#btnStartOS").addClass("btn-navPowerOffBorder");

              $("#mainMemoryPanelCheck").fadeOut();
              $("#processPanelCheck").fadeOut(); 
              $("#cpuStatPanelCheck").fadeOut(); 
              $("#userProgramInputPanelCheck").fadeOut();
              $("#fileSystemPanelCheck").fadeOut(); 

            });

            this.clearUserInput();
            this.clearCpuUI();
            _MemoryInformationTable.fillRows();
           // _TerminatedProcessTable.clearTable();
            _ReadyQueueTable.clearTable();
            _Console.clearScreen();

            _SystemInformationInterface.setStatusMessage("");
        }
        /**
         * Used to start the spinner when the the O/S executes a user process
         */ 
        public static startProgramSpinner() {

           $(function() {
              $("#programSpinner").addClass("fa-spin");
          });

        }
        /**
         * Used the stop the spinner when the O/S finishes user execution
         */
        public static endProgramSpinner() {

          $(function() {

            $("#programSpinner").removeClass("fa-spin");

          });

        }
        /**
         * Used to handle the UI changes when the users enters step mode
         */
        public static toggleStepModeOn(){

          $(function() {
            $("#btnStepForward").addClass("see");
            $("#btnStepForward").removeClass("inv");
           

            $("#btnStepOS").removeClass("btn-unselectedMode");
            $("#btnStepOS").addClass("btn-selectedMode");

            $("#btnRunOS").removeClass("btn-selectedMode");
            $("#btnRunOS").addClass("btn-unselectedMode");
          });

        }
       /**
         * Used to handle the UI changes when the users enters step mode
       */
        public static happyFace() {

      $(function() {
        $("#btnStepForward").addClass("see");
        $("#btnStepForward").removeClass("inv");


        $("#btnStepOS").removeClass("btn-unselectedMode");
        $("#btnStepOS").addClass("btn-selectedMode");

        $("#btnRunOS").removeClass("btn-selectedMode");
        $("#btnRunOS").addClass("btn-unselectedMode");
      });

        }
        /**
         * Used to handle the UI changes when the user enters run mode
         */
        public static toggleRunModeOn() {

            $(function() {

            $("#btnStepForward").removeClass("see");
            $("#btnStepForward").addClass("inv");


            $("#btnRunOS").removeClass("btn-unselectedMode");
            $("#btnRunOS").addClass("btn-selectedMode");

            $("#btnStepOS").removeClass("btn-selectedMode");
            $("#btnStepOS").addClass("btn-unselectedMode");
          });
        }
        /**
         * Used to convert a decimal string into a hex string
           @Params {String} - A decimal string
           @Returns {String} - A hex string
        */
        public static decimalToHex(input: string): string {

          
          var decimalNumber: number = parseInt(input, 10);

          var hexNumber = decimalNumber.toString(16);

          return hexNumber;

        }
        /**
         * Used to convert a hex string into a decimal string
           @Params {String} - A hex string
           @Returns {String} - A decimal string
        */
        public static hexToDecimal(input: string): string {

          var hexNumber: number = parseInt(input, 16);

          var decimalNumber = hexNumber.toString(10);

          return decimalNumber;

        }
        /**
         * Check to see if the user supplied process ID exists and can be run
           @Params {String} - The process ID of the process you wish you check
           @Returns {Boolean} - TRUE    If process exists
                              - FALSE  Process does not exist
        */
        public static isExistingProcess(processID: string): boolean {

          var nextProcess;

          for (var i = 0; i < _ReadyQueue.getSize(); i++) {

           // nextProcess = <TSOS.ProcessControlBlock>_ReadyQueue.elementAtIndex(i);

            if (nextProcess.getProcessID() == processID) {
              console.log(nextProcess.getProcessID() + " 1");
              console.log(processID + " 2");
              return true;
            }
          }
          return false;
        }       
         /**
         * Returns the reverse of the given string i
           @Params {String} - The string you wish to be reversed
           @Returns {String} - THe reverse of the input
        */
        public static reverseString(str) {
            var answer = "";

            for (var i = str.length - 1; i > -1; i --) {
                answer = answer + str.charAt(i);
            }
            return answer;
        }
       /**
         * Used find the current row the given address is in
           @Params {Number} - A memory address in decimal
           @Returns {Number} - The current row number
        */
        public static getTableRowPosition(address:number):number {
          var rowNumber:number = Math.floor(address / 8);         
          console.log(rowNumber);        
          return rowNumber;
        }
        /**
         * Used find the current cell/col in the table
           @Params {Number} - A memory address in decimal
           @Returns {Number} - The current cell/column number
        */
        public static getTableColumnPosition(address: number):number {
          var columnNumber:number = address % 8;
          console.log(columnNumber);
          return columnNumber;
        }
        /**
         * Used to check the state of the single step toggle
         * @Returns {Boolean} True - If the toggle is checked
                              False - If the toggle is not checked
        */
        public static isSingleStep(): boolean {

          if(_SingleStepMode == true){
            return true;
          }
          return false;
        }
        /*
          This method is used to get the current date 
          and return a nicely formated string (mm/dd/yyyy) 
        */
        public static getTime(): string {
            var date = new Date();
            // Get the current date 1 - 31
            var day = date.getDate();

            // Get the current Month 1 - 11
            var month = date.getMonth() + 1; // add one to account for 0 as starting position

            // Get the current year
            var year = date.getFullYear();
            
            // Get the time stuff
            var timeHours = date.getHours();
            var timeMin = date.getMinutes();
            var timeSec = date.getSeconds();

            return  timeHours + ":" + timeMin + ":" + timeSec + "";

        }
          /*
          This method is used to get the current time
          and return a nicely formated string (hr:min:sec)
        */
        public static getDate(): string {

            var date = new Date();
            // Get the current date 1 - 31
            var day = date.getDate();

            // Get the current Month 1 - 11
            var month = date.getMonth() + 1; // add one to account for 0 as starting position

            // Get the current year
            var year = date.getFullYear();
            
            // Get the time stuff
            var timeHours = date.getHours();
            var timeMin = date.getMinutes();
            var timeSec = date.getSeconds();

            return month + "/" + day + "/" + year ;

        }
         /**
         * Used to draw the blue screen of death on the console
        */
        public static createBSOD(): void {
                     
            _Kernel.krnShutdown();
            clearInterval(_hardwareClockID);
            _DrawingContext.clearRect(0, 0, 500, 500);
            _DrawingContext.drawImage(BSOD_IMAGE, 0, 0, 500, 500);
        }

        public static rot13(str: string): string {
            /*
               This is an easy-to understand implementation of the famous and common Rot13 obfuscator.
               You can do this in three lines with a complex regular expression, but I'd have
               trouble explaining it in the future.  There's a lot to be said for obvious code.
            */
            var retVal: string = "";
            for (var i in <any>str) {    // We need to cast the string to any for use in the for...in construct.
                var ch: string = str[i];
                var code: number = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(i) + 13;  // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                } else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(i) - 13;  // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                } else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        }
        /*
          This method is used to convert a number keypress while shifted 
          to its shifted value
        */
        public static getShiftedNumber(keyCode): string {

            var answer: string = "";

            switch (keyCode)
            {
                case 48:
                    answer = ")";
                    break;
                case 49:
                    answer = "!";
                    break;
                case 50:
                    answer = "@";
                    break;
                case 51:
                    answer = "#";
                    break;
                case 52:
                    answer = "$";
                    break;
                case 53:
                    answer = "%";
                    break;
                case 54:
                    answer = "^";
                    break;
                case 55:
                    answer = "&";
                    break;
                case 56:
                    answer = "*";
                    break;
                case 57:
                    answer = "(";
                    break;
                default:
                  console.log("This should never happen");
            }
            return answer;
        }
        public static hexToAscii(hexString: string): string {

        //  console.log("Hex Value is " + hexString);
          var test = String.fromCharCode(parseInt(hexString, 16))
        //  console.log("Ascii Value is " + test);
          return test;

        }
        /*
           This method is used to convert keypress to its SpecialCharacter 
        */
       public static getSpecialCharacter(keyCode): string {

           var answer: string = "";

           switch (keyCode)
           {
               case 186:
                   answer = ";";
                   break;
               case 187:
                   answer = "=";
                   break;
               case 188:
                   answer = ",";
                   break;
               case 189:
                   answer = "-";
                   break;
               case 190:
                   answer = ".";
                   break;
               case 191:
                   answer = "/";
                   break;
               case 192:
                   answer = "`";
                   break;
               case 219:
                   answer = "[";
                   break;
               case 220:
                   answer = "\\"
                   break;
               case 221:
                   answer = "]";
                   break;
               case 222:
                   answer = "'";
                   break;
               default:
                   console.log("This should never happen");
           }
           return answer;
       }
        /*
           This method is used to convert keypress to its shifted SpecialCharacter 
        */
       public static getSpecialCharacterShifted(keyCode) : string {

          var answer: string = "";
           switch (keyCode)
           {
               case 186:
                   answer = ":";
                   break;
               case 187:
                   answer = "+";
                   break;
               case 188:
                   answer = "<";
                   break;
               case 189:
                   answer = "_";
                   break;
               case 190:
                   answer = ">";
                   break;
               case 191:
                   answer = "?";
                   break;
               case 192:
                   answer = "~";
                   break;
               case 219:
                   answer = "{";
                   break;
               case 220:
                   answer = "|"
                   break;
               case 221:
                   answer = "}";
                   break;
               case 222:
                   answer = "\"";
                   break;
               default:
                 console.log("This should never happen");
           }
           return answer;
       }
    }
}
