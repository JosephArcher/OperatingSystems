 ///<reference path="../globals.ts" />

/**
 * This class is used to represent a Process Control Block
 */
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
			
			this.processID = this.assignNextProcessID();
			this.processState = PROCESS_STATE_NEW;
 		}
 		/**
 		 * Used to auto increment the Process ID for a ProcessControlBlock on creation
 		 * @Returns {Number} The next ID 
 		*/
 		public assignNextProcessID(): number {

			var nextProcessID:number = _ProcessCounterID + 1;

			_ProcessCounterID = _ProcessCounterID + 1;

			return nextProcessID;
 		}
 		/**
 		 * Used to auto increment the Process ID for a ProcessControlBlock on creation
 		 * @Returns {Number} The next ID 
 		*/
 		public getProcessID(): string {

			return this.processID + "";
 		}
 		public setProcessState(state: string): void {
				this.processState = state;
 		}
 		public getProcessState(): string {

				return this.processState;				
 		}
 		public setProgramCounter(value: number): void {
				this.programCounter = value;
 		}
 		public getProgramCounter(): string {
				return this.programCounter + "";
 		}
 		public setAcc(value:number): void {
				this.Acc = value;
 		}
 		public getAcc(): string {
				return this.Acc + "";
 		}
 		public setXReg(value:number): void  {
				this.Xreg = value;
 		}
 		public getXReg(): string {
				return this.Xreg + "";
 		}
 		public setYReg(value: number): void {
				this.Yreg = value;
 		}
 		public getYReg(): string {
				return this.Yreg + "";
 		}
 		public setZFlag(value: number ): void {
				this.Zflag = value;
 		}
 		public getZFlag(): string {
				return this.Zflag  + "";
 		}
 		public incrementProgramCounter(value: number): void{
				this.programCounter = this.programCounter + value;
 		}

	}
}