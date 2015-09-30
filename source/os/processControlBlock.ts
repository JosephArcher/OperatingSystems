///<reference path="../globals.ts" />

module TSOS {

	export class ProcessControlBlock {

		public processID = 0;
		public processState = "";
		public programCounter = 0;
		public Acc: number = 0;
		public Xreg: number = 0;
		public Yreg: number = 0;
		public Zflag: number = 0;
		
		public constructor() {

			this.processID = _ProcessCounterID + 1;
			_ProcessCounterID = _ProcessCounterID + 1;
 		}

	}
}