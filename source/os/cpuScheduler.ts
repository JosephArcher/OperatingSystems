///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="../host/cpu.ts"/>
///<reference path="timer.ts" />
///<reference path="processControlBlock.ts" />

/**
 * The CPU Scheduler for Joe/s
 * 
 * Used to track the current process the O/S is running, what algorithm is being used, and the current time quantum
 * 
 */
module TSOS {
	export class CpuScheduler {

		public quantum: number = 6;                          // Quantum or time slice for each process (Default is 6)
		public SchedulingAlgorithm: string = ROUND_ROBIN;    // The scheduling algorithm the that is currently being used (Default is Round Robin)
		public runningProcess: TSOS.ProcessControlBlock;     // The current process that is being executed by the CPU

		public constructor() {
			this.quantum = 6;                                   
			this.SchedulingAlgorithm = ROUND_ROBIN;
			this.runningProcess = null;
		}
		/**
		 * Returns the current quantum being used for round robin
		 */
		public getQuantum(): number {
			return this.quantum;
		}
		/**
		 * Sets the quantum property of the scheduler
		 */
		public setQuantum(newQuantum: number): void {
			this.quantum = newQuantum;
		}
		/**
		 *  Returns the current process that is running
		 */
		 public getCurrentProcess(): TSOS.ProcessControlBlock {
			 return  this.runningProcess;
		}
		/**
		 *  Sets the current process 
		 */
		 public setCurrentProcess(nextProcess: TSOS.ProcessControlBlock ):void {
			this.runningProcess = nextProcess;
		}	
		/**
		 * Used to make a scheduling decision based on the current algorithm being used by the O/S
		 * @Returns  {ProcessControlBlock} - The next process to be exeuted 
		 * 									- If no processes exists then return null
		 */
		public getNextProcess(): TSOS.ProcessControlBlock {

			var nextProcess: TSOS.ProcessControlBlock = null;

			// First check the next size of the ready queue
			if (_ReadyQueue.getSize() > 0) {
				
				nextProcess = _ReadyQueue.dequeue(); // Get the next process from  the ready queue
				console.log("NEXTPROCESS: " + nextProcess.getProcessID());
			}
			this.setCurrentProcess(nextProcess);
			return nextProcess;
		}	
	}
}