///<reference path="../globals.ts" />
/* 
* This class is used to represent a single Byte in memory
*/
module TSOS {

	export class Byte {	

		// The address is the location of this specific byte in memory
		public address = 0;

		// The value is the 2 Charcter Hex Value 0 - 255
		public value = "00";
		
		public constructor (address: number, value: string) {

			this.address = address;
			this.value = value;
		}
		/**
		 * returns the address of the byte in memory
		 * @return {string}
		*/			
		public getAddress(): string {

			return this.address.toString();
		}
		/**
		 * returns the value of the byte in memory
		 * @return {string}
		*/	
		public getValue(): string {

			return this.value;
		}
		/**
		 * returns the first hex value of the byte in memory
		 * @return {string}
		*/	
		public getFirstNibble(): string {

			return this.value.substring(0, 1);
		}
		/**
		 * returns the second hex value of the byte in memory
		 * @return {string}
		*/	
		public getSecondNibble(): string{
			return this.value.substring(1, 1);
		}
		/**
		 * sets the value of the byte in memory
		 * @params {string} value - The value to be set
		*/	
		public setValue(value: string): void{
			this.value = value;

		}
		/**
		 * sets the value of the first nibble of the byte in memory
		 * @params {string} value - The value to be set
		*/	
		public setFirstNibble(value: string):  void {

			var newValue: string;

			if(value.length > 1){
				
				return;
			}
			else if(value.length == 1){
				newValue = value;
				var secondHalf = this.value.substring(1, 1);
				this.value = newValue + secondHalf;
				return;

			}
			else if(value.length == 0){
				newValue = "0";
				this.value = newValue;
				return;

			}
			else{
				
				return;
			}

		}
		/**
		 * sets the value of the second nibble of the byte in memory
		 * @params {string} value - The value to be set
		*/
		public setSecondNibble(value: string): void {

			var newValue: string;

			if (value.length > 1) {
				
				return;
			}
			else if (value.length == 1) {
				newValue = value;
				var firstHalf = this.value.substring(0, 1);
				this.value = firstHalf + newValue;
				return;

			}
			else if (value.length == 0) {
				newValue = "0";			
				this.value = newValue;
				return;

			}
			else {
				
				return;
			}
		}
	}	
}