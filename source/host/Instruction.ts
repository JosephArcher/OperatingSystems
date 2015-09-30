///<reference path="../globals.ts" />

module TSOS {

	export class Instruction {
		
		constructor(
				public func: any,
				public opCode = "",
				public description = ""){

		}

	}
}
