///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="processControlBlock.ts" />
///<reference path="timer.ts" />
///<reference path="../host/cpu.ts"/>

module TSOS {
	export class CpuScheduler {

		public quantum: number = 6;                                  // Quantum or time slice for each process (Default is 6)
		public SchedulingAlgorithm: string = ROUND_ROBIN;            // The scheduling algorithm the that is currently being used (Default is Round Robin)
		public currentProcess: TSOS.ProcessControlBlock = null;      // The current process that is being executed by the CPU
		public maximumNumberOfProcesses: number = 3;                 // The max number of processses that can be run at one time

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

		 	return <TSOS.ProcessControlBlock> this.currentProcess;
		}
		/**
		 *  Sets the current process 
		 */
		 public setCurrentProcess(nextProcess: TSOS.ProcessControlBlock ):void {

			 //_Kernel.krnTrace("CPU Scheduler: PCB " + nextProcess.getProcessID() + " is the new current process");
			 this.currentProcess = <TSOS.ProcessControlBlock> nextProcess;
		 }
		/**
		 *  Adds a new process to the end of the ready queue
		 *  If a process is not currently the current process then the newly added one will be set to the c urrent process
		 */
		public runProcess(process: TSOS.ProcessControlBlock) { 

			_Kernel.krnTrace("CPU Scheduler: PCB " + process.getProcessID() + " was added to the ready queue");
			
			// New processes are added to the tail of the ready queue.
			_ReadyQueue.enqueue(<TSOS.ProcessControlBlock> process);
			
			// check to see if a process is currently running
			if(this.currentProcess  == null) {	

				// If not process is running then the one we just added is the new current process	
				this.currentProcess = <TSOS.ProcessControlBlock> this.getNextProcess();

				console.log("No Process is currently set.. " + process.getProcessID() + " Is being set as the current process");

				// Start the process
				_Kernel.startProcess(process);
			}		
		}	
		/**
		 * Used to make a scheduling decision based on the current algorithm being used by the O/S
		 * @Returns  {ProcessControlBlock} - The next process to be exeuted 
		 * 									- If no processes exists then return null
		 */
		public getNextProcess(): TSOS.ProcessControlBlock {

			_Kernel.krnTrace("CPU Scheduler: Making a scheduling decision ");

			// Initalize Variables
			var sizeOfReadyQueue: number = 0;
			var nextProcess: TSOS.ProcessControlBlock = null;

			// If the scheduling algorithm is Round Robin (It always should be)
			if(this.SchedulingAlgorithm == ROUND_ROBIN) {

				_Kernel.krnTrace("CPU Scheduler: Round Robin is being used ");

				// Get the size of the ready queue
				sizeOfReadyQueue = _ReadyQueue.getSize();

				// First check to see if any more processes are in the readyQueue             
				if(sizeOfReadyQueue > 0) {

					// If at least one process is currently waiting in the readyQueue 
					nextProcess = _ReadyQueue.dequeue(); // Get the next process from the queue
					
					_Kernel.krnTrace("CPU Scheduler: Decision made... The next process to execute is  " + nextProcess.getProcessID() );

					// Return the next process 
					return nextProcess; 
				}
				else{
					_Kernel.krnTrace("CPU Scheduler: No active procceses to schedule... ");
					// If the ready queue is 0 or less then unable to schedule another process so return null and CPU should go idle
					return null;
				}

			}
			else {
				// If the scheduling algorithm is not round robin then something is really really wrong becuase its the only option
				console.log("This should never happen... JOE RUN TRUST NO ONE");
			}
		}
	}
}