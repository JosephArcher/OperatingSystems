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

		public  memoryBlock: TSOS.MemoryBlock;						  // An array of 768 byte memory partitions
		public  currentProcess: TSOS.ProcessControlBlock = null;      // The current procss being executed by the CPU
		private memoryPartitionCounter: number = 0;                   // The counter for the memory loading

		private processID = 0;										 //		
		public  currentMemoryLocation = 0;                           //
		private placeholder = "";                                    //
		

		constructor(theMemoryBlock: TSOS.MemoryBlock) {

			this.memoryBlock = theMemoryBlock;
		}
		/**
		 * Returns the next available memory partition in memory
		 * @Return respose {number} - The index of the next memory partition
		 */
		public getNextAvailableMemoryPartition(): number {

			// Save the value of the current counter to the variable to return as the answer
			var nextPartitionIndex: number = this.memoryPartitionCounter;

			// Increment the counter in order to keep track of switching between memory partitions
			this.incrementMemoryPartitionCounter();

			// Return the actual nextPartition because we saved it in the variable
			return nextPartitionIndex;
			
		}
		// Used to increment the nextMemoryPartitionCounter but handles the logic by using the length of the memoryPartitionArray
		public incrementMemoryPartitionCounter(): void {

			// Figure out what the next value will be
			var possibleNewValue = this.memoryPartitionCounter + 1;

			// Check this value against the the # of all possible partitions indexs
			if(possibleNewValue > this.memoryPartitionArray.length -1) { // If the next possible value is now greater then is should be then we need to wrap back to zero
				this.memoryPartitionCounter = 0;
			}
			else { // If the next possible value is actually possible then set counter
				this.memoryPartitionCounter = possibleNewValue;
			}

		}
		/**
		 * "Clears" the memoryPartition at the index given
		 * @Params index {Number} - The index of memory partition you want to clear
		 */
		public clearMemoryBlock(): void {

			for (var i = 0; i < 768; i++) {

				this.memoryBlock[i] = new Byte(i, "00");
			}
		}
		public convertLogicalToPhysicalAddress(logicalAddress: number): number {

			var physicalAddress: number = 0;

			return physicalAddress;
		}
		public convertPhysicalToLogicalAddrss(physicalAddrss: number): number {

			var logicalAddress: number = 0;
			return logicalAddress;

		}
		/**
		 * Returns the byte at the given index in the memory
		 * @Params partitionIndex {Number} - The index of the partition in memory you want to access
		 * 		   byteIndex      {Number} - The index of the byte in the memory partion you want to access
		 * @Return respose        {Byte}   - The byte at the given location
		 */
		public getByte(byteIndex:number ): TSOS.Byte {

			var physicalAddress = this.convertLogicalToPhysicalAddress(byteIndex);

			var response: TSOS.Byte =  <Byte> this.memoryBlock[physicalAddress];

			return <Byte> response;
		}
		/**
		 * Returns the bytes at the given indexs in the memory
		 * @Params partitionIndex {Number} - The index of the partition in memory you want to access
		 		   byteIndex1     {Number} - The index of the byte you want
		 		   byteIndex2     {Number} - The index of the byte you want
		 * @Return respose        {Array}  - The byteArray of the bytes at the given location
		 */
		public getTwoBytes(partitionIndex: number, byteIndex1: number, byteIndex2: number) {

			var byteArray = [];

			var byte1: TSOS.Byte = <Byte> this.memoryPartitionArray[partitionIndex].memoryPartition[byteIndex1];
			var byte2: TSOS.Byte = <Byte> this.memoryPartitionArray[partitionIndex].memoryPartition[byteIndex2];

			byteArray[0] = byte1;
			byteArray[1] = byte2;

			return byteArray;
		}
		/**
		 * Sets the value of the byte in memory at the given index
		 * @Params  partitionIndex {Number} - The index of the partition in memory you want to access
		 			byteIndex      {Number} - The index of the byte you wish to change
		 			byteValue      {String} - The value to set the byte in memory to
		 * 
		*/
		public setByte(partitionIndex: number, byteIndex: number, byteValue: string): void {
			
			this.memoryPartitionArray[partitionIndex].memoryPartition[byteIndex] = new Byte(byteIndex, byteValue);

			console.log("Setting memory address " + byteIndex + " To the value of " + byteValue);

			_MemoryInformationTable.setCellData(byteIndex, byteValue);
			
		}
	}
}
