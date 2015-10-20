///<reference path="collections.ts" />
///<reference path="ProcessControlBlock.ts" />
///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="../host/byte.ts" />
/**
 * This class is used to handle the memory and the operations that need to be performed on it
*/
var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager(block) {
            this.counter = 0;
            this.processID = 0;
            this.currentProcess = null;
            this.currentMemoryLocation = 0;
            this.placeholder = "";
            this.memory = block;
        }
        MemoryManager.prototype.printBlock = function () {
            var nextByte;
            for (var i = 0; i < 255; i++) {
                nextByte = this.memory.memoryBlock[i];
                console.log("Next Byte Address:  " + nextByte.getAddress() + "  Value: " + nextByte.getValue() + "");
            }
        };
        /**
         * CLears the current memory by setting each byte equal to "00"
        */
        MemoryManager.prototype.clearMemory = function () {
            for (var i = 0; i < 255; i++) {
                this.memory.memoryBlock[i] = new TSOS.Byte(i, "00");
            }
            console.log("Memory was cleared");
        };
        /**
         * Returns the byte at the given index in the memory
         * @Params index {Number} - The index of the byte you want
         * @Return respose {Byte} - The byte at the given location
         */
        MemoryManager.prototype.getByte = function (index) {
            var response = this.memory.memoryBlock[index];
            return response;
        };
        /**
         * Returns the bytes at the given indexs in the memory
         * @Params index1 {Number} - The index of the byte you want
                   index2 {Number} - The index of the byte you want
         * @Return respose {Array} - The byteArray of the bytes at the given location
         */
        MemoryManager.prototype.getTwoBytes = function (index1, index2) {
            var byteArray = [];
            var byte1 = this.memory.memoryBlock[index1];
            var byte2 = this.memory.memoryBlock[index2];
            byteArray[0] = byte1;
            byteArray[1] = byte2;
            return byteArray;
        };
        /**
         * Sets the value of the byte in memory at the given index
         * @Params index {Number} - The index of the byte you wish to change
         *
         *
        */
        MemoryManager.prototype.setByte = function (index, value) {
            this.memory.memoryBlock[index] = new TSOS.Byte(index, value);
            console.log("Setting memory address " + index + " To the value of " + value);
            _MemoryInformationTable.setCellData(index, value);
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
