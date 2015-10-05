///<reference path="../globals.ts" />
///<reference path="byte.ts" />

/**
 * This class is used to represent a 256 Byte block of Core Memory (Main Memory) for the CPU
*/

module TSOS {

	export class MemoryBlock {

		// The block of memory to be stored as a array
		public memoryBlock = [];
		
		public constructor() {}

		public init () {
			// Create the 265 byte memory block	
			for (var i = 0; i < 255; i++) {
				// Create each byte
				this.memoryBlock[i] = new Byte(i, "00");
			}		
		}
	}
}
