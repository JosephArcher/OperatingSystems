///<reference path="../globals.ts" />
module TSOS {
	export class Byte {	

		public address = 0;
		public nibble1 = "00";
		public nibble2 = "00";
		public n1Set = false;
		public n2Set = false;
		
		public constructor (address: number) {

			this.address = address;
		}
	}	
}