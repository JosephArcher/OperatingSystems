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
        function MemoryManager(theMemoryBlock, memoryPartitionArray) {
            this.memoryPartitionIndex = new Array(); // Array with each base address for the memory partitions
            this.availableMemoryPartitions = new TSOS.Queue(); // A Queue used to determine the next memory partition to be used (This cycles between each one in the queue)
            this.memoryBlock = theMemoryBlock; // The Array of bytes to be managed
            this.memoryPartitionIndex = memoryPartitionArray; // The Array of all existing memory partitions
            // On creation all memory partitions are available so add them to the the queue
            for (var i = 0; i < memoryPartitionArray.length; i++) {
                this.availableMemoryPartitions.enqueue(memoryPartitionArray[i]);
            }
            console.log("NUMBER OF MEMORY PARTITIONS AVAILABLE IS " + this.availableMemoryPartitions.getSize());
        }
        /**
         * Returns the number of bytes in memory
         */
        MemoryManager.prototype.getTotalMemorySize = function () {
            return this.memoryBlock.memoryBlock.length;
        };
        /**
        * Used find the memory location of the process the user is trying to run
        */
        MemoryManager.prototype.findProcessInMemory = function (processID) {
            // Initalize variables
            var len = _ResidentList.getSize();
            var nextProcess;
            console.log("The Process ID is " + processID);
            if (len < 1) {
                return null;
            }
            for (var i = 0; i < len; i++) {
                nextProcess = _ResidentList.getElementAt(i);
                console.log("TEST: 1   " + nextProcess.getProcessID());
                console.log("TEST: 2   " + processID);
                if (nextProcess.getProcessID() == processID) {
                    console.log("ThE NEXT PROCES IS MEMEORY WAS FOUND AND IT IS " + nextProcess.getBaseReg());
                    return nextProcess;
                }
            }
            return null;
        };
        /**
         * This method is used to check if the current address a process is trying to access is inside its valid memory bounds
         * @Params  {Number}  requestedMemoryAddress - The memory location the process is attempting to access
         *                                   process - The Process that is trying to access the memory
         * @Returns {Boolean}                   True - If the process has access to the location
         *                                     False - If the process does not have access to the location
         */
        MemoryManager.prototype.hasAccessToMemoryAddress = function (requestedMemoryAddress, process) {
            // Initalize variables
            var baseAddressValue = 0; // The first memory address location the process can access
            var limitAddressValue = 0; // the last memory address location the process can access
            // Get the base address of the current process
            baseAddressValue = process.getBaseReg(); // Get the processes base address
            limitAddressValue = process.getLimitReg(); // Get the processes limit address
            console.log(baseAddressValue + ' Test for joe base address');
            console.log(limitAddressValue + " Test for joe limit address");
            // Check to see if the requested memory address is both...
            // 1. More than the smallest possible address 
            // 2. Less than the largest possible address
            if ((requestedMemoryAddress <= limitAddressValue) && (function (requestedMemoryAddress) { return baseAddressValue; })) {
                // Means the process can safely access the memory location and return true
                console.log("has accesss");
                return true;
            }
            // If either of the two bounds are passed and return false
            console.log("no accesss");
            return false;
        };
        /**
         * Returns the next available memory partition in memory
         * @Return memoryAddressOfNextFree {number} - The memory address of the next free memory partition
         * If no free memory partition is currently available -1 will be returned
         */
        MemoryManager.prototype.getNextAvailableMemoryPartition = function () {
            // Check to see if a free memory partition exisits
            if (this.availableMemoryPartitions.getSize() > 0) {
                // Get the next partition from the queue
                var nextPartition = this.availableMemoryPartitions.dequeue();
                // Return the base value for the next memory partition
                return nextPartition;
            }
            else {
                return -1;
            }
        };
        /**
         * "Clears" a single memory partition in memory and adds it back to the available partition queue
         */
        MemoryManager.prototype.clearMemoryPartition = function (process) {
            // Get the base regisger of the process 
            var processBaseRegister = process.getBaseReg();
            // Get the length of the partition index
            var length = this.memoryPartitionIndex.length;
            // Get the length of the residentList
            var listLength = _ResidentList.getSize();
            // The partitionIndex
            var theMemoryPartition;
            // Loop over the partition index and find a matching base address
            for (var i = 0; i < length; i++) {
                // check the processBaseAddress with the base address in the index
                if (processBaseRegister == this.memoryPartitionIndex[i]) {
                    // If a match is found then save the answer to the variable for later user
                    theMemoryPartition = this.memoryPartitionIndex[i];
                }
                else {
                }
            }
            console.log(" The Base address to clear starts at ..." + theMemoryPartition);
            console.log("The size of the ready queue is ..." + _ResidentList.getSize());
            // Clear the memory blocks at those locations
            for (var i = theMemoryPartition; i < theMemoryPartition + 256; i++) {
                this.memoryBlock[i] = new TSOS.Byte(i, "00");
                _MemoryInformationTable.setCellData(i, "00");
            }
            // Add the partition back into the available memory partitions
            this.availableMemoryPartitions.enqueue(theMemoryPartition);
        };
        /**
         * "Clears" all of the Memory Partitions in memory
         */
        MemoryManager.prototype.clearAllMemoryPartitions = function () {
            // Set every byte in memory to 00
            for (var i = 0; i < 768; i++) {
                this.memoryBlock[i] = new TSOS.Byte(i, "00");
            }
            // Add the Memory Partitions back
            this.availableMemoryPartitions = new TSOS.Queue();
            // On creation all memory partitions are available so add them to the the queue
            for (var i = 0; i < this.memoryPartitionIndex.length; i++) {
                this.availableMemoryPartitions.enqueue(this.memoryPartitionIndex[i]);
            }
            // Clear the Ready Queue
            _ReadyQueue = new TSOS.ReadyQueue();
            // Clear the Resident List
            _ResidentList = new TSOS.ReadyQueue();
            // Clear the Memory UI Table
            _MemoryInformationTable.clearTable();
        };
        /**
         * Used to load the user program into memory
         * @Params userProgram {String} - The user program to be loaded into memory
         * @Return processID {Number}   - The process ID of the newly created process
         */
        MemoryManager.prototype.loadProgramIntoMemory = function (userProgram) {
            // Initalize needed variables
            var firstHexNumber = ""; // The first hex digit while looping
            var secondHexNumber = ""; // The second hex digit while looping
            var nextByteValue = ""; // The value of the next byte
            var baseMemoryOffset = 0; // The offest to track each where each byte is being placed
            var nextMemoryAddress = 0; // The value of the next memory address
            // Get the next base address to write the user program
            var nextBaseMemoryPartitionAddress = this.getNextAvailableMemoryPartition();
            console.log("Loading a new user program starting at the base address of... " + nextBaseMemoryPartitionAddress);
            console.log("User Program Length = " + userProgram.length);
            //loop over the length of the user program 
            for (var i = 0; i < userProgram.length; i = i + 2) {
                // Get the next two hex digits to form a byte
                firstHexNumber = userProgram.charAt(i); // First Digit
                secondHexNumber = userProgram.charAt(i + 1); // Second Digit
                nextByteValue = firstHexNumber + secondHexNumber + "";
                nextMemoryAddress = nextBaseMemoryPartitionAddress + baseMemoryOffset;
                // Place the byte in memory
                // The byte index will be the base memory partition being used + the offst
                // The value if the combination of both the hex numbers;
                console.log("Loading: " + nextByteValue + "   In the memory location of  " + nextMemoryAddress);
                _MemoryManager.memoryBlock[nextMemoryAddress] = new TSOS.Byte(nextMemoryAddress, nextByteValue);
                _MemoryInformationTable.setCellData(nextMemoryAddress, nextByteValue);
                // Increment the offset
                baseMemoryOffset = baseMemoryOffset + 1;
            }
            // Create a new process control block
            var newProcess = _Kernel.createProcess(nextBaseMemoryPartitionAddress, 256);
            // Return the newly created process ID 
            return newProcess.getProcessID();
        };
        /**
         * Used to convert the logical address of the program into the physical address
         */
        MemoryManager.prototype.convertLogicalToPhysicalAddress = function (logicalAddress) {
            var physicalAddress = 0;
            physicalAddress = logicalAddress + _CPUScheduler.getCurrentProcess().getBaseReg();
            console.log("The Next physiucal address is right fucking here " + physicalAddress);
            return physicalAddress;
        };
        /**
         * Returns the byte at the given index in the memory
         * @Params partitionIndex {Number} - The index of the partition in memory you want to access
         * 		   byteIndex      {Number} - The index of the byte in the memory partion you want to access
         * @Return respose        {Byte}   - The byte at the given location
         */
        MemoryManager.prototype.getByte = function (byteIndex) {
            // Need to check to make sure that the index the current process is trying to access is within bounds
            if (this.hasAccessToMemoryAddress(byteIndex, _CPUScheduler.getCurrentProcess()) == true) {
                // Convert the logical address to the physical address
                var physicalAddress = this.convertLogicalToPhysicalAddress(byteIndex);
                // Get the location from the memory block using the physical address
                var response = this.memoryBlock[physicalAddress];
                //console.log(<Byte>response);
                // Return the byte at the location
                return response;
            }
            else {
                // Create and Interrupt because the memory has execceded its bounds
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(MEMORY_OUT_OF_BOUNDS_IRQ, _CPUScheduler.getCurrentProcess())); // Memory Out Of Bounds Interrupt , The current Process Control Block 	
            }
        };
        /**
         * Returns the bytes at the given indexs in the memory
         * @Params byteIndex1     {Number} - The index of the byte you want
                   byteIndex2     {Number} - The index of the byte you want
         * @Return respose        {Array}  - The byteArray of the bytes at the given location
         */
        MemoryManager.prototype.getTwoBytes = function (byteIndex1, byteIndex2) {
            // Initalize variables
            var byteArray = [];
            // Need to check to make sure that the indexs the current process is trying to access is within bounds
            if ((this.hasAccessToMemoryAddress(byteIndex1, _CPUScheduler.getCurrentProcess()) == true) && (this.hasAccessToMemoryAddress(byteIndex2, _CPUScheduler.getCurrentProcess()) == true)) {
                var physicalAddress1 = this.convertLogicalToPhysicalAddress(byteIndex1);
                var physicalAddress2 = this.convertLogicalToPhysicalAddress(byteIndex2);
                var byte1 = this.memoryBlock[physicalAddress1];
                var byte2 = this.memoryBlock[physicalAddress2];
                byteArray[0] = byte1;
                byteArray[1] = byte2;
                return byteArray;
            }
            else {
                // Create and Interrupt because the memory has execceded its bounds
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(MEMORY_OUT_OF_BOUNDS_IRQ, _CPUScheduler.getCurrentProcess())); // Memory Out Of Bounds Interrupt , The current Process Control Block 	
            }
        };
        /**
         * Sets the value of the byte in memory at the given index
         * @Params  partitionIndex {Number} - The index of the partition in memory you want to access
                    byteIndex      {Number} - The index of the byte you wish to change
                    byteValue      {String} - The value to set the byte in memory to
         *
        */
        MemoryManager.prototype.setByte = function (byteIndex, byteValue) {
            // Need to check to make sure that the indexs the current process is trying to access is within bounds
            if (this.hasAccessToMemoryAddress(byteIndex, _CPUScheduler.getCurrentProcess()) == true) {
                this.memoryBlock[byteIndex] = new TSOS.Byte(byteIndex, byteValue);
                //console.log("Setting memory address " + byteIndex + " To the value of " + byteValue);
                _MemoryInformationTable.setCellData(byteIndex, byteValue);
            }
            else {
                // Create and Interrupt because the memory has execceded its bounds
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(MEMORY_OUT_OF_BOUNDS_IRQ, _CPUScheduler.getCurrentProcess())); // Memory Out Of Bounds Interrupt , The current Process Control Block 	
            }
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
