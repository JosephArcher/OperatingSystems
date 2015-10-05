///<reference path="../globals.ts" />
/*
* This class is used to represent a single Byte in memory
*/
var TSOS;
(function (TSOS) {
    var Byte = (function () {
        function Byte(address, value) {
            // The address is the location of this specific byte in memory
            this.address = 0;
            // The value is the 2 Charcter Hex Value 0 - 255
            this.value = "00";
            this.address = address;
            this.value = value;
        }
        /**
         * returns the address of the byte in memory
         * @return {string}
        */
        Byte.prototype.getAddress = function () {
            return this.address.toString();
        };
        /**
         * returns the value of the byte in memory
         * @return {string}
        */
        Byte.prototype.getValue = function () {
            return this.value;
        };
        /**
         * returns the first hex value of the byte in memory
         * @return {string}
        */
        Byte.prototype.getFirstNibble = function () {
            return this.value.substring(0, 1);
        };
        /**
         * returns the second hex value of the byte in memory
         * @return {string}
        */
        Byte.prototype.getSecondNibble = function () {
            return this.value.substring(1, 1);
        };
        /**
         * sets the value of the byte in memory
         * @params {string} value - The value to be set
        */
        Byte.prototype.setValue = function (value) {
            this.value = value;
        };
        /**
         * sets the value of the first nibble of the byte in memory
         * @params {string} value - The value to be set
        */
        Byte.prototype.setFirstNibble = function (value) {
            var newValue;
            if (value.length > 1) {
                console.log("ERROR: user string to long");
                return;
            }
            else if (value.length == 1) {
                newValue = value;
                var secondHalf = this.value.substring(1, 1);
                this.value = newValue + secondHalf;
                return;
            }
            else if (value.length == 0) {
                newValue = "0";
                this.value = newValue;
                return;
            }
            else {
                console.log("This should never happen");
                return;
            }
        };
        /**
         * sets the value of the second nibble of the byte in memory
         * @params {string} value - The value to be set
        */
        Byte.prototype.setSecondNibble = function (value) {
            var newValue;
            if (value.length > 1) {
                console.log("ERROR: user string to long");
                return;
            }
            else if (value.length == 1) {
                newValue = value;
                var firstHalf = this.value.substring(0, 1);
                this.value = firstHalf + newValue;
                return;
            }
            else if (value.length == 0) {
                newValue = "0";
                this.value = newValue;
                return;
            }
            else {
                console.log("This should never happen");
                return;
            }
        };
        return Byte;
    })();
    TSOS.Byte = Byte;
})(TSOS || (TSOS = {}));
