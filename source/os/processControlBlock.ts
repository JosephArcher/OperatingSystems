 ///<reference path="../globals.ts" />
/**
 * This class is used to represent a Process Control Block
 */
module TSOS {

	export class ProcessControlBlock {

		public processID = 0;                  // Process ID
		public processState = "";              // Process State
		public programCounter = -1;            // Program Counter
		public Acc: number = 0;                // Accumulator
		public Xreg: number = 0;               // X Register
		public Yreg: number = 0;               // Y Flag 
		public Zflag: number = 0;              // Z Flag   
		public baseReg: number = 0;            // Base Register
		public limitReg: number = 256;         // Limit Register
		public turnAroundTime: number = 0;     // Turnaround Time
		public waitTime: number = 0;           // Wait Time
		public priority: string = "0";           // Process Priority
		public location: string = "";          // Process Location 
			
		public constructor() {
			
			this.processID = this.assignNextProcessID();
			this.processState = PROCESS_STATE_NEW;
			//console.log("Creating new PCB");
 		}
 		/**
 		 * Used to auto increment the Process ID for a ProcessControlBlock on creation
 		 * @Returns {Number} The next ID 
 		*/
 		public assignNextProcessID(): number {

 			// When creating a new process control block need to auto increment the ID's 

			var nextProcessID:number = _ProcessCounterID + 1; // Create the nextProcessID by incrementing 1

			_ProcessCounterID = _ProcessCounterID + 1;        // Increment the global counting variable

			return nextProcessID;                             // Return the next process ID 
		}
		/**
		 * Increments the current program counter by the given amount
		 * @Params value {Number} - The value to increase the program counter by
		 * 
		*/
		public incrementProgramCounter(value: number): void {
			// TODO: Should I put checks her for memory bounds and protection? instead of inside of  branch
			this.programCounter = this.programCounter + value;
		}
 		/**
 		 * Used to auto increment the Process ID for a ProcessControlBlock on creation
 		 * @Returns {Number} The next ID 
 		*/
 		public getProcessID(): number {

			return this.processID;
 		}
 		/**
		 * Sets the current state of the process
		 * @Params state {string} - The state to set
		 * 
		*/
 		public setProcessState(state: string): void {
				this.processState = state;
 		}
 		/**
		 * Returns the current process state
		 * @Return {string} - The current state of the process
		 * 
		*/
 		public getProcessState(): string {
				return this.processState;				
 		}
 		/**
		 * Sets the current program counter with the given value
		 * @Params value {Number} - The value to be set
		 * 
		*/
 		public setProgramCounter(value: number): void {
				this.programCounter = value;
 		}
 		/**
		 * Returns the current program counter
		 * @Return {number} - The current program counter
		 * 
		*/
 		public getProgramCounter(): number {
				return this.programCounter;
 		}
 		/**
		 * Sets the current accumulator register with the given value
		 * @Params value {Number} - The value to be set
		 * 
		*/
 		public setAcc(value:number): void {
				this.Acc = value;
 		}
 		/**
		 * Returns the current accumulator
		 * @Return {number} - The current accumulator value
		 * 
		*/
 		public getAcc(): number {
				return this.Acc;
 		}
 		/**
		 * Sets the current x register with the given value
		 * @Params value {Number} - The value to be set
		 * 
		*/
 		public setXReg(value:number): void  {
				this.Xreg = value;
 		}
 		/**
		 * Returns the current x register
		 * @Return {number} - The current x register value
		 * 
		*/
 		public getXReg(): number {
				return this.Xreg;
 		}
 		/**
		 * Sets the current y register with the given value
		 * @Params value {Number} - The value to be set
		 * 
		*/
 		public setYReg(value: number): void {
				this.Yreg = value;
 		}
 		/**
		 * Returns the current program counter
		 * @Return {number} - The current y register value
		 * 
		*/
 		public getYReg(): number {
				return this.Yreg;
 		}
 		/**
		 * Sets the current z register with the given value
		 * @Params value {Number} - The value to be set
		 * 
		*/
 		public setZFlag(value: number ): void {
				this.Zflag = value;
 		}
 		/**
		 * Returns the current z flag resister
		 * @Return {number} - The current z flag resgister value
		 * 
		*/
 		public getZFlag(): number{
				return this.Zflag ;
 		}
 		/**
		 * Sets the current base register with the given value
		 * @Params value {Number} - The value to be set
		 * 
		*/
 		public setBaseReg(value: number){
				this.baseReg = value;
 		}
 		/**
		 * Returns the current base register 
		 * @Return {Number} - The current value in the base register
		 * 
		*/
 		public getBaseReg(): number {
				return this.baseReg;
 		}
 		/**
		 * Increments the current turn around time by 1 
		 * 
		*/
 		public incrementTurnAroundTime() {
				this.turnAroundTime = this.turnAroundTime + 1;
 		}
 		/**
		 * Returns the current turn around time
		 * @Return {Number} - The current turn around time
		 * 
		*/
		public getTurnAroundTime(): number {
				return this.turnAroundTime;
 		}
		/**
		* Sets the current limit register with the given value
		* @Params value {Number} - The value to be set
		* 
		*/
		public setLimitReg(value: number) {
				this.limitReg = value;
		}
 		/**
		 * Returns the current limit register 
		 * @Return {Number} - The current value in the limit register
		 * 
		*/
		public getLimitReg(): number {
				return this.limitReg;
		}
		/**
		 * Increments the current wait time by 1 
		 * 
		*/
		public incrementWaitTime() {
			this.waitTime = this.waitTime + 1;
		}
		/**
		 * Returns the current wait time
		 * @Return {Number} - The current turn around time
		 * 
		*/
		public getWaitTime(): number {
			return this.waitTime;
		}
		/**
		 * Checks to see if the process is waiting or not
		 * if the process is waiting increment the counter
		 */
		public updateWaitTime() {

			// Check the process state
			if(this.processState == PROCESS_STATE_WAITING) {

				// Increment
				this.incrementWaitTime();
			}
		}
		/**
 		* Returns the priority of the process
 		* @Return {String} - The priority of the process
 		* 
		*/
		public getPriority(): string {
			return this.priority;
		}
		/**
		* Sets the priority of the process
		* @Params {String} - The priority to be set
		* 
		*/
		public setPriority(priority: string) {
			this.priority = priority;
		}
		public setLocation(str: string): void {
			this.location = str;
		}

	}
}