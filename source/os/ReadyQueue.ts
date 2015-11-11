
///<reference path="queue.ts" />
///<reference path="processControlBlock.ts" />

 module TSOS {

	export class ReadyQueue extends TSOS.Queue {

		public removeElementAtIndex(index: number) {

			console.log('THE index is ' + index);
			var tempQueue = new ReadyQueue();

			if (_ReadyQueue.getSize() == 0) {
				console.log("TEMP QUEUE : THE SIZE WAS ZERO");
				return tempQueue // do nothing because nothing is in the queue
			}
			if (_ReadyQueue.getSize() == 1) {
				// When only one element is in queue then just dequeue it... so it will be an empty queue anyways
				console.log("TEMP QUEUE : THE SIZE WAS ONE");
				return tempQueue;
			}
			if (_ReadyQueue.getSize() > 1) {
				// When more than one element is in the queue then need to do some ugly shit... srry
				var len = _ReadyQueue.getSize();
				var nextElement;
				console.log("TEMP QUEUE : THE SIZE WAS " + len);
				// Loop over the entire queue 
				for (var i = 0; i < len; i++) {

					// Get the next Elment in the queue
					nextElement = _ReadyQueue.getElementAt(i);

					if (i == index) {
						// This is the element that we are removing so do nothing
					}
					else {
						// If the element is not equal to the index then we are keeping it
						tempQueue.enqueue(nextElement);
					}
				}
				return tempQueue;
			}
		}
		public getElementIndexByProccessId(process: TSOS.ProcessControlBlock):number {

			var theProcessId:number = process.getProcessID();
			var nextProcess: TSOS.ProcessControlBlock;
			var nextProcessId:number;
			var len = _ReadyQueue.getSize();
		
			for (var i = 0; i < len; i++) {
				nextProcess = <TSOS.ProcessControlBlock> _ReadyQueue.getElementAt(i);

				// Get the next process ID
				nextProcessId = nextProcess.getProcessID();
				// Check for match
				if(theProcessId == nextProcessId) {
					return i;				
				}
			}
		}
		public returnAllProcessIds() {

			var nextProcessBlock;
			var processArray = new Array();

			for (var i = 0; i < this.getSize(); i++) {
				nextProcessBlock = this.q[i];
				processArray.push(nextProcessBlock.processID);
			}
			console.log(processArray);
			return processArray;
		}
		public isExistingProcess(processID: number) {

			var size: number = this.q.length;
			var nextProcess: TSOS.ProcessControlBlock;

			// Loop over the queue 
			for (var i = 0; i < size; i++) {

				nextProcess = <TSOS.ProcessControlBlock>_ReadyQueue.getElementAt(i);

				// Compare the given process ID and the one at the position in the queue
				if(nextProcess.getProcessID() == processID) {	
					
					return  <TSOS.ProcessControlBlock> nextProcess;
				}
			}
			// If process does not exists return null
			return null;
		}
		public getElementAt(index: number) {

			return <TSOS.ProcessControlBlock> this.q[index];
		}
		public incrementWaitTime() {

			// Get the size of the ready queue
			var size: number = _ReadyQueue.getSize();
			var nextProcess: TSOS.ProcessControlBlock;

			// Loop over the ready queue
			for (var i = 0; i < size; i++) {

				// Get the next process in the queue
				nextProcess = _ReadyQueue.getElementAt(i);

				// Increment its waiting time by 1
				nextProcess.incrementWaitTime(); 
			}
		}
		public incrementTurnAroundTime() {

			// Get the size of the ready queue
			var size: number = _ReadyQueue.getSize();
			var nextProcess: TSOS.ProcessControlBlock;

			// Loop over the ready queue
			for (var i = 0; i < size; i++) {

				// Get the next process in the queue
				nextProcess = _ReadyQueue.getElementAt(i);

				// Increment its waiting time by 1
				nextProcess.incrementTurnAroundTime();
			}
			// Check to see if a process is running
			if(_CPUScheduler.getCurrentProcess() != null){
				_CPUScheduler.getCurrentProcess().incrementTurnAroundTime();
			}
		}
		public getAllPids(): string {
			var PIDString = "";
			var len = this.q.length;
			var nextProcess;
			if (len < 1) {
				return "";
			}
			for (var i = 0; i < len; i++) {

				nextProcess = this.getElementAt(i);
				PIDString = PIDString + nextProcess.getProcessID();
			}
			return PIDString;
		}
	}
}