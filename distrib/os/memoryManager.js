///<reference path="collections.ts" />
///<reference path="ProcessControlBlock.ts" />
///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="../host/byte.ts" />
///<reference path="../host/memory.ts" />
/**
 * This class is used to handle the memory and the operations that need to be performed on it
*/
var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager(theMemoryBlock) {
            this.currentProcess = null; // The current procss being executed by the CPU
            this.memoryPartitionCounter = 0; // The counter for the memory loading
            this.processID = 0; //		
            this.currentMemoryLocation = 0; //
            this.placeholder = ""; //
            this.memoryBlock = theMemoryBlock;
        }
        /**
         * Returns the next available memory partition in memory
         * @Return respose {number} - The index of the next memory partition
         */
        MemoryManager.prototype.getNextAvailableMemoryPartition = function () {
            // Save the value of the current counter to the variable to return as the answer
            var nextPartitionIndex = this.memoryPartitionCounter;
            // Increment the counter in order to keep track of switching between memory partitions
            this.incrementMemoryPartitionCounter();
            // Return the actual nextPartition because we saved it in the variable
            return nextPartitionIndex;
        };
        // Used to increment the nextMemoryPartitionCounter but handles the logic by using the length of the memoryPartitionArray
        MemoryManager.prototype.incrementMemoryPartitionCounter = function () {
            // Figure out what the next value will be
            var possibleNewValue = this.memoryPartitionCounter + 1;
            // Check this value against the the # of all possible partitions indexs
            if (possibleNewValue > this.memoryPartitionArray.length - 1) {
                this.memoryPartitionCounter = 0;
            }
            else {
                this.memoryPartitionCounter = possibleNewValue;
            }
        };
        /**
         * "Clears" the memoryPartition at the index given
         * @Params index {Number} - The index of memory partition you want to clear
         */
        MemoryManager.prototype.clearMemoryBlock = function () {
            for (var i = 0; i < 768; i++) {
                this.memoryBlock[i] = new TSOS.Byte(i, "00");
            }
        };
        MemoryManager.prototype.convertLogicalToPhysicalAddress = function (logicalAddress) {
            var physicalAddress = 0;
            return physicalAddress;
        };
        MemoryManager.prototype.convertPhysicalToLogicalAddrss = function (physicalAddrss) {
            var logicalAddress = 0;
            return logicalAddress;
        };
        /**
         * Returns the byte at the given index in the memory
         * @Params partitionIndex {Number} - The index of the partition in memory you want to access
         * 		   byteIndex      {Number} - The index of the byte in the memory partion you want to access
         * @Return respose        {Byte}   - The byte at the given location
         */
        MemoryManager.prototype.getByte = function (byteIndex) {
            var physicalAddress = this.convertLogicalToPhysicalAddress(byteIndex);
            var response = this.memoryBlock[physicalAddress];
            return response;
        };
        /**
         * Returns the bytes at the given indexs in the memory
         * @Params partitionIndex {Number} - The index of the partition in memory you want to access
                   byteIndex1     {Number} - The index of the byte you want
                   byteIndex2     {Number} - The index of the byte you want
         * @Return respose        {Array}  - The byteArray of the bytes at the given location
         */
        MemoryManager.prototype.getTwoBytes = function (partitionIndex, byteIndex1, byteIndex2) {
            var byteArray = [];
            var byte1 = this.memoryPartitionArray[partitionIndex].memoryPartition[byteIndex1];
            var byte2 = this.memoryPartitionArray[partitionIndex].memoryPartition[byteIndex2];
            byteArray[0] = byte1;
            byteArray[1] = byte2;
            return byteArray;
        };
        /**
         * Sets the value of the byte in memory at the given index
         * @Params  partitionIndex {Number} - The index of the partition in memory you want to access
                    byteIndex      {Number} - The index of the byte you wish to change
                    byteValue      {String} - The value to set the byte in memory to
         *
        */
        MemoryManager.prototype.setByte = function (partitionIndex, byteIndex, byteValue) {
            this.memoryPartitionArray[partitionIndex].memoryPartition[byteIndex] = new TSOS.Byte(byteIndex, byteValue);
            console.log("Setting memory address " + byteIndex + " To the value of " + byteValue);
            _MemoryInformationTable.setCellData(byteIndex, byteValue);
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
