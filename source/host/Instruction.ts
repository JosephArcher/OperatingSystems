///<reference path="../globals.ts" />

/**
	This class is used to represesnt a 6502A machine instruction
*/

module TSOS {

	export class Instruction {

		// The function to run for the specificion instruction
		public function: any; 

		// The name of of the Op Code           
		public opCode: string = "";

		// A description of the Op Code
		public description: string = "";
		
		constructor(func: any,opCode = "", description = "") {

			this.function = func;
			this.opCode = opCode;
			this.description = description;
		}
	}
}
