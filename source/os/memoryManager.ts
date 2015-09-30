///<reference path="../globals.ts" />
///<reference path="../utils.ts" />


module TSOS {

	export class MemoryManager {

		public memoryBlock = null;
		private counter = 0;
		private processID = 0;

		constructor(block: TSOS.MemoryBlock) {

			this.memoryBlock = block;
		}
		public getByte(index: number ): string {

			var response = this.memoryBlock.block[index];

			return response;
		}
		public setByte(index: number,
					   value: string): void {

			this.memoryBlock[index] = value;
			console.log("index " + index + " was set to " + value);
			Utils.setFreeMemoryInfo(Utils.getTableRowPosition(this.counter), Utils.getTableColumnPosition(this.counter), value);
		}				
		public setNextByte(value: string): void {

				//Base Case
				if(this.counter > 255){
					console.log("Memory is full");
					return;
				}
				var nextByte = this.memoryBlock.block[this.counter];
				var nibble = this.memoryBlock.block[this.counter].address;

				console.log(nextByte.address + " asdf");

				if(nextByte.n1Set == false ) {

					nextByte.nibble1 = value;
					console.log("set n1 value" + nextByte.nibble1);
					nextByte.n1Set = true;
					//_MemoryInfoTable.rows.item(this.counter)
					Utils.setFreeMemoryInfo(Utils.getTableRowPosition(this.counter), Utils.getTableColumnPosition(this.counter), value);
				}
				else if(nextByte.n1Set == true && nextByte.n2Set == false) {
					console.log("set n2 value" + nextByte.nibble2);
					nextByte.nibble2 = value;
					nextByte.n2Set = true;
					Utils.setHalfFreeMemoryInfo(Utils.getTableRowPosition(this.counter), Utils.getTableColumnPosition(this.counter), value);
				}
				else {
					// Case when the current counter is on a full byte already
					this.counter = this.counter + 1;
					this.setNextByte(value);
				}				
			}
		
	}
}
