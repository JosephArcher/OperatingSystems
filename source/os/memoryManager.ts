///<reference path="collections.ts" />
///<reference path="ProcessControlBlock.ts" />
///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="../host/byte.ts" />

/**
 * This class is used to handle the memory and the operations that need to be performed on it
*/

module TSOS {

	export class MemoryManager {

		public  memory: TSOS.MemoryBlock;
		public  counter: number = 0;
		private processID = 0;
		public  currentProcess: TSOS.ProcessControlBlock = null;
		public  currentMemoryLocation = 0;
		private placeholder = "";

		constructor(block) {

			this.memory = block;
		}
		public printBlock(): void {

			var nextByte: TSOS.Byte;

			for (var i = 0; i < 255; i++) {
				nextByte = <Byte> this.memory.memoryBlock[i];
				console.log("Next Byte Address:  " + nextByte.getAddress() + "  Value: " + nextByte.getValue() + "" );
			}
		}
		/**
		 * CLears the current memory by setting each byte equal to "00"
		*/
		public clearMemory(): void {


			for (var i = 0; i < 255; i++) {

				this.memory.memoryBlock[i] = new Byte(i, "00");
			}

			console.log("Memory was cleared");

		}
		/**
		 * Returns the byte at the given index in the memory
		 * @Params index {Number} - The index of the byte you want
		 * @Return respose {Byte} - The byte at the given location
		 */
		public getByte(index: number ): TSOS.Byte {

			var response: TSOS.Byte =  <Byte> this.memory.memoryBlock[index];

			return <Byte> response;
		}
		/**
		 * Returns the bytes at the given indexs in the memory
		 * @Params index1 {Number} - The index of the byte you want
		 		   index2 {Number} - The index of the byte you want
		 * @Return respose {Array} - The byteArray of the bytes at the given location
		 */
		public getTwoBytes(index1: number, index2: number) {

			var byteArray = [];

			var byte1: TSOS.Byte = <Byte> this.memory.memoryBlock[index1];
			var byte2: TSOS.Byte = <Byte> this.memory.memoryBlock[index2];

			byteArray[0] = byte1;
			byteArray[1] = byte2;

			return byteArray;
		}
		/**
		 * Sets the value of the byte in memory at the given index
		 * @Params index {Number} - The index of the byte you wish to change
		 * 
		 * 
		*/
		public setByte(index: number, value: string): void {
			
			this.memory.memoryBlock[index] = new Byte(index, value);

			_MemoryInformationTable.setCellData(index, value);
			
		}
	}
}
