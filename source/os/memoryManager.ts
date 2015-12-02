///<reference path="collections.ts" />
///<reference path="ProcessControlBlock.ts" />
///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="../host/byte.ts" />
///<reference path="../host/memory.ts" />

/**
 * This class is used to handle the memory and the operations that need to be performed on it
*/

module TSOS {

	export class MemoryManager {

		public  memoryBlock: TSOS.MemoryBlock;			   // The Memory Block Object: Basically just an Array of bytes
		public  memoryPartitionIndex = new Array();        // Array with each base address for the memory partitions
		public  availableMemoryPartitions= new Queue();    // A Queue used to determine the next memory partition to be used (This cycles between each one in the queue)

		
		public constructor(theMemoryBlock: TSOS.MemoryBlock, memoryPartitionArray) {

			this.memoryBlock = theMemoryBlock;                 // The Array of bytes to be managed
			this.memoryPartitionIndex = memoryPartitionArray;  // The Array of all existing memory partitions

			// On creation all memory partitions are available so add them to the the queue
			for(var i = 0; i < memoryPartitionArray.length; i++) {			
				this.availableMemoryPartitions.enqueue(memoryPartitionArray[i]);
			}
			console.log("NUMBER OF MEMORY PARTITIONS AVAILABLE IS " + this.availableMemoryPartitions.getSize());
		}
		/**
		 * Returns the number of bytes in memory
		 */
		public getTotalMemorySize(): number {

			return this.memoryBlock.memoryBlock.length;
		}		
		/**
 		* Used find the memory location of the process the user is trying to run 
 		*/
        public findProcessInMemory(processID: number): TSOS.ProcessControlBlock {

        	// Initalize variables
			var len = _ResidentList.getSize();
			var nextProcess:TSOS.ProcessControlBlock;

			//console.log("The Process ID is " + processID );

        	if(len < 1) {
				return null;
        	}
			
			for (var i = 0; i < len; i++) {
				nextProcess = <TSOS.ProcessControlBlock> _ResidentList.getElementAt(i);

				if(nextProcess.getProcessID() == processID) {
					
					console.log("The next process to run starts at address " +  nextProcess.getBaseReg() ) ;
					return <TSOS.ProcessControlBlock> nextProcess;
				}
			}
			return null;      
        }
        /**
         * This method is used to check if the current address a process is trying to access is inside its valid memory bounds
         * @Params  {Number}  requestedMemoryAddress - The memory location the process is attempting to access
         *                                   process - The Process that is trying to access the memory
         * @Returns {Boolean}                   True - If the process has access to the location
         *                                     False - If the process does not have access to the location
         */
        public hasAccessToMemoryAddress(requestedMemoryAddress: number, process: TSOS.ProcessControlBlock ): boolean {

        	// Initalize variables
			var baseAddressValue: number = 0;               // The first memory address location the process can access
			var limitAddressValue: number = 0;              // the last memory address location the process can access

			// Get the base address of the current process
			baseAddressValue = process.getBaseReg();        // Get the processes base address
			limitAddressValue = process.getLimitReg();      // Get the processes limit address

        	// Check to see if the requested memory address is both...
        	// 1. More than the smallest possible address 
        	// 2. Less than the largest possible address
        	if( (requestedMemoryAddress <= limitAddressValue) && (requestedMemoryAddress => baseAddressValue) ) {

        		// Means the process can safely access the memory location and return true
        		return true
        	}
        	// If either of the two bounds are passed and return false
			return false;
    	}
		/**
		 * Returns the next available memory partition in memory
		 * @Return memoryAddressOfNextFree {number} - The memory address of the next free memory partition
		 * If no free memory partition is currently available -1 will be returned
		 */
		public getNextAvailableMemoryPartition(): number {

			// Check to see if a free memory partition exisits
			if(this.availableMemoryPartitions.getSize() > 0){

				// Get the next partition from the queue
				var nextPartition = this.availableMemoryPartitions.dequeue(); 

				// Return the base value for the next memory partition
				return nextPartition;		
			}
			else {
				return -1;
			}			
		}
		/**
		 * "Clears" a single memory partition in memory and adds it back to the available partition queue
		 */
		 public clearMemoryPartition(process: TSOS.ProcessControlBlock): void  {

		 	// Get the base regisger of the process 
			var processBaseRegister = process.getBaseReg();
			
			// Get the length of the partition index
			var length = this.memoryPartitionIndex.length;

			// Get the length of the residentList
			var listLength = _ResidentList.getSize();

			// The partitionIndex
			var theMemoryPartition: number;

			// Loop over the partition index and find a matching base address
			for (var i = 0; i < length; i++) {

			 	// check the processBaseAddress with the base address in the index
			 	if(processBaseRegister == this.memoryPartitionIndex[i] ) {
			 		// If a match is found then save the answer to the variable for later user
			 		theMemoryPartition = this.memoryPartitionIndex[i]
			 	}
			 	else{
			 		// Loop another time
			 	}

			}
			console.log("The size of the resident list is ..." + _ResidentList.getSize());

			// Clear the memory blocks at those locations
			for (var i = theMemoryPartition; i < theMemoryPartition + 256; i++){
				this.memoryBlock[i] = new Byte(i, "00");
				_MemoryInformationTable.setCellData(i, "00");
			}

			// Add the partition back into the available memory partitions
			this.availableMemoryPartitions.enqueue(theMemoryPartition);

		 	
		}
		/**
		 * "Clears" all of the Memory Partitions in memory
		 */
		public clearAllMemoryPartitions(): void {

			// Set every byte in memory to 00
			for (var i = 0; i < 768; i++) {
				this.memoryBlock[i] = new Byte(i, "00");
			}

			// Add the Memory Partitions back
			this.availableMemoryPartitions = new Queue();

			// On creation all memory partitions are available so add them to the the queue
			for (var i = 0; i < this.memoryPartitionIndex.length; i++) {
				this.availableMemoryPartitions.enqueue(this.memoryPartitionIndex[i]);
			}

			// Clear the Ready Queue
			_ReadyQueue = new ReadyQueue();

			// Clear the Resident List
			_ResidentList = new ReadyQueue();

			// Clear the Memory UI Table
			_MemoryInformationTable.clearTable();
		}
		/**
		 * Used to load the user program into memory
		 * @Params userProgram {String} - The user program to be loaded into memory
		 * @Return processID {Number}   - The process ID of the newly created process
		 */
		public loadProgramIntoMemory(userProgram: string , priority: string): number {

			// Initalize needed variables
			var firstHexNumber: string = "";   // The first hex digit while looping
			var secondHexNumber: string = "";  // The second hex digit while looping
			var nextByteValue: string = "";	   // The value of the next byte
			var baseMemoryOffset: number = 0;  // The offest to track each where each byte is being placed
			var nextMemoryAddress: number = 0; // The value of the next memory address
		
			// Get the next base address to write the user program
			var nextBaseMemoryPartitionAddress: number = this.getNextAvailableMemoryPartition();

			//loop over the length of the user program 
			for (var i = 0; i < userProgram.length; i = i + 2) { // Grab two hex numbers each loop cycle to form the bytes

				// Get the next two hex digits to form a byte
				firstHexNumber = userProgram.charAt(i);      // First Digit
				secondHexNumber = userProgram.charAt(i + 1); // Second Digit
				nextByteValue = firstHexNumber + secondHexNumber + "";
				nextMemoryAddress = nextBaseMemoryPartitionAddress + baseMemoryOffset;
				// Place the byte in memory
				// The byte index will be the base memory partition being used + the offst
				// The value if the combination of both the hex numbers;
				_MemoryManager.memoryBlock[nextMemoryAddress] = new Byte(nextMemoryAddress , nextByteValue);
				_MemoryInformationTable.setCellData(nextMemoryAddress, nextByteValue);

				// Increment the offset
				baseMemoryOffset = baseMemoryOffset + 1;
			}    

		
		     // Create a new process control block
			var newProcess: TSOS.ProcessControlBlock = _Kernel.createProcess(nextBaseMemoryPartitionAddress);
			
			// Set the priority of the new process
			newProcess.setPriority(priority);

			console.log(newProcess.getPriority() + " Loaded process with a priority off...");
            // Return the newly created process ID 
            return newProcess.getProcessID();
		}
		/**
		 * Used to convert the logical address of the program into the physical address
		 */
		public convertLogicalToPhysicalAddress(logicalAddress: number): number {

			var physicalAddress: number = 0;
			physicalAddress = logicalAddress + _CPUScheduler.getCurrentProcess().getBaseReg();
		
			return physicalAddress;
		}
		/**
		 * Returns the byte at the given index in the memory
		 * @Params partitionIndex {Number} - The index of the partition in memory you want to access
		 * 		   byteIndex      {Number} - The index of the byte in the memory partion you want to access
		 * @Return respose        {Byte}   - The byte at the given location
		 */
		public getByte(byteIndex: number ): TSOS.Byte {

			// Need to check to make sure that the index the current process is trying to access is within bounds

			if (this.hasAccessToMemoryAddress(byteIndex, _CPUScheduler.getCurrentProcess()) == true) { // The current process is able to access the memory location

				// Convert the logical address to the physical address
				var physicalAddress = this.convertLogicalToPhysicalAddress(byteIndex);


				// Get the location from the memory block using the physical address
				var response: TSOS.Byte = <Byte>this.memoryBlock[physicalAddress];

				//console.log(<Byte>response);
				// Return the byte at the location
				return <Byte> response;

			}
			else { // The current process is unable to access the memory location 
				 // Create and Interrupt because the memory has execceded its bounds
				_KernelInterruptQueue.enqueue(new Interrupt(MEMORY_OUT_OF_BOUNDS_IRQ, _CPUScheduler.getCurrentProcess()));	// Memory Out Of Bounds Interrupt , The current Process Control Block 	
			}
		}
		/**
		 * Returns the bytes at the given indexs in the memory
		 * @Params byteIndex1     {Number} - The index of the byte you want
		 		   byteIndex2     {Number} - The index of the byte you want
		 * @Return respose        {Array}  - The byteArray of the bytes at the given location
		 */
		public getTwoBytes(byteIndex1: number, byteIndex2: number) {

			// Initalize variables
			var byteArray = [];

			// Need to check to make sure that the indexs the current process is trying to access is within bounds
			if( (this.hasAccessToMemoryAddress(byteIndex1, _CPUScheduler.getCurrentProcess()   ) == true) && (this.hasAccessToMemoryAddress(byteIndex2, _CPUScheduler.getCurrentProcess()) == true)) {

				var physicalAddress1 = this.convertLogicalToPhysicalAddress(byteIndex1);
				var physicalAddress2 = this.convertLogicalToPhysicalAddress(byteIndex2);

				var byte1: TSOS.Byte = <Byte>this.memoryBlock[physicalAddress1];
				var byte2: TSOS.Byte = <Byte>this.memoryBlock[physicalAddress2];

				byteArray[0] = byte1;
				byteArray[1] = byte2;

				return byteArray;
			}
			else { // The current process is unable to access the memory location 
				// Create and Interrupt because the memory has execceded its bounds
				_KernelInterruptQueue.enqueue(new Interrupt(MEMORY_OUT_OF_BOUNDS_IRQ, _CPUScheduler.getCurrentProcess()));	// Memory Out Of Bounds Interrupt , The current Process Control Block 	
			}
		}
		/**
		 * Sets the value of the byte in memory at the given index
		 * @Params  partitionIndex {Number} - The index of the partition in memory you want to access
		 			byteIndex      {Number} - The index of the byte you wish to change
		 			byteValue      {String} - The value to set the byte in memory to
		 * 
		*/
		public setByte(byteIndex: number, byteValue: string): void {

			// Need to check to make sure that the indexs the current process is trying to access is within bounds
			if (this.hasAccessToMemoryAddress(byteIndex, _CPUScheduler.getCurrentProcess()) == true) { // The current process is able to access the memory location

				var physicalAddress = this.convertLogicalToPhysicalAddress(byteIndex);

				this.memoryBlock[physicalAddress] = new Byte(physicalAddress, byteValue);

				_MemoryInformationTable.setCellData(physicalAddress, byteValue);

			}
			else { // The current process is unable to access the memory location 
				// Create and Interrupt because the memory has execceded its bounds
				_KernelInterruptQueue.enqueue(new Interrupt(MEMORY_OUT_OF_BOUNDS_IRQ, _CPUScheduler.getCurrentProcess()));	// Memory Out Of Bounds Interrupt , The current Process Control Block 	
			}	
		}
	}
}
