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
        // Takes a given string and returns it in reverse
        public static reverseString(str) {
            var answer = "";

            for (var i = str.length - 1; i > -1; i --) {
                answer = answer + str.charAt(i);
            }
            return answer;
        }
        public static setFreeMemoryInfo(row:number, column:number, value: string): void {
         // var currentRow = _MemoryInfoTable.rows[row];
         // var currentCol = _MemoryInfoTable.cols[column];
        
       var currentRow:  HTMLTableRowElement = <HTMLTableRowElement>_MemoryInfoTable.rows.item(row + 1);
       var currentCell: HTMLTableCellElement = <HTMLTableCellElement>currentRow.cells.item(column);
       currentCell.innerHTML = value;
       //console.log(currentCell.innerHTML + "    CurrentCell");

         
        }
    public static setHalfFreeMemoryInfo(row: number, column: number, value: string): void {
      // var currentRow = _MemoryInfoTable.rows[row];
      // var currentCol = _MemoryInfoTable.cols[column];
        
      var currentRow: HTMLTableRowElement = <HTMLTableRowElement>_MemoryInfoTable.rows.item(row + 1);
      var currentCell: HTMLTableCellElement = <HTMLTableCellElement>currentRow.cells.item(column);
      var oldValue = currentCell.innerHTML;
      currentCell.innerHTML = oldValue + value;
      
     }
        public static getTableRowPosition(address:number):number {
          var rowNumber:number = Math.floor(address / 8);         
          console.log(rowNumber);        
          return rowNumber;
        }
        public static getTableColumnPosition(address: number):number {
          var columnNumber:number = address % 8;
          console.log(columnNumber);
          return columnNumber;
        }
        /*
          This method is used to get the current date and time
          and return a nicely formated string  (mm/dd/yyyy) (hr:min:sec)
        */
        public static getDateTime(): string {
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

            return "Date: " + month + "/" + day + "/" + year + " Time: " + timeHours + ":" + timeMin + ":" + timeSec + "";

        }
        /*
          This method is used to create a blue screen of death which is drawn in the console
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
