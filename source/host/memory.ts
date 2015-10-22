///<reference path="../globals.ts" />
///<reference path="byte.ts" />

/**
 * This class is used to represent a 256 Byte block of Core Memory (Main Memory) for the CPU
*/

module TSOS {

	export class MemoryBlock {
		
		public memoryBlock = [];       // The partition of memory to be stored as a array of bytes
		
		public constructor() {
		}
		/**
		 * Used to create 768 bytes in memory
		 */
		public init () {
			
			// Creates 768 bytes in memory from the starting address
			for (var i = 0; i < 768; i++) {    // Create the 768 byte memory block					
				this.memoryBlock[i] = new Byte(i, "00");   // Create each byte
			}		
		}
	}
}
