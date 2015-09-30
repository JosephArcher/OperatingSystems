/* --------
   Utils.ts

   Utility functions.
   -------- */
var TSOS;
(function (TSOS) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.trim = function (str) {
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
        };
        // Takes a given string and returns it in reverse
        Utils.reverseString = function (str) {
            var answer = "";
            for (var i = str.length - 1; i > -1; i--) {
                answer = answer + str.charAt(i);
            }
            return answer;
        };
        Utils.setFreeMemoryInfo = function (row, column, value) {
            // var currentRow = _MemoryInfoTable.rows[row];
            // var currentCol = _MemoryInfoTable.cols[column];
            var currentRow = _MemoryInfoTable.rows.item(row + 1);
            var currentCell = currentRow.cells.item(column);
            currentCell.innerHTML = value;
            //console.log(currentCell.innerHTML + "    CurrentCell");
        };
        Utils.setHalfFreeMemoryInfo = function (row, column, value) {
            // var currentRow = _MemoryInfoTable.rows[row];
            // var currentCol = _MemoryInfoTable.cols[column];
            var currentRow = _MemoryInfoTable.rows.item(row + 1);
            var currentCell = currentRow.cells.item(column);
            var oldValue = currentCell.innerHTML;
            currentCell.innerHTML = oldValue + value;
        };
        Utils.getTableRowPosition = function (address) {
            var rowNumber = Math.floor(address / 8);
            console.log(rowNumber);
            return rowNumber;
        };
        Utils.getTableColumnPosition = function (address) {
            var columnNumber = address % 8;
            console.log(columnNumber);
            return columnNumber;
        };
        /*
          This method is used to get the current date and time
          and return a nicely formated string  (mm/dd/yyyy) (hr:min:sec)
        */
        Utils.getDateTime = function () {
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
        };
        /*
          This method is used to create a blue screen of death which is drawn in the console
        */
        Utils.createBSOD = function () {
            _Kernel.krnShutdown();
            clearInterval(_hardwareClockID);
            _DrawingContext.clearRect(0, 0, 500, 500);
            _DrawingContext.drawImage(BSOD_IMAGE, 0, 0, 500, 500);
        };
        Utils.rot13 = function (str) {
            /*
               This is an easy-to understand implementation of the famous and common Rot13 obfuscator.
               You can do this in three lines with a complex regular expression, but I'd have
               trouble explaining it in the future.  There's a lot to be said for obvious code.
            */
            var retVal = "";
            for (var i in str) {
                var ch = str[i];
                var code = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(i) + 13; // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                }
                else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(i) - 13; // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                }
                else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        };
        /*
          This method is used to convert a number keypress while shifted
          to its shifted value
        */
        Utils.getShiftedNumber = function (keyCode) {
            var answer = "";
            switch (keyCode) {
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
        };
        /*
           This method is used to convert keypress to its SpecialCharacter
        */
        Utils.getSpecialCharacter = function (keyCode) {
            var answer = "";
            switch (keyCode) {
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
                    answer = "\\";
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
        };
        /*
           This method is used to convert keypress to its shifted SpecialCharacter
        */
        Utils.getSpecialCharacterShifted = function (keyCode) {
            var answer = "";
            switch (keyCode) {
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
                    answer = "|";
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
        };
        return Utils;
    })();
    TSOS.Utils = Utils;
})(TSOS || (TSOS = {}));
