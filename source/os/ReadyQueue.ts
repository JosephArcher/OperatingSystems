///<reference path="queue.ts" />
///<reference path="processControlBlock.ts" />

 module TSOS {

	export class ReadyQueue extends TSOS.Queue {

		public removeElementAtIndex(index: number) {

			var tempQueue = new ReadyQueue();

			if (this.q.length == 0) {
				return tempQueue // do nothing because nothing is in the queue
			}
			if (this.q.length == 1) {
				// When only one element is in queue then just dequeue it... so it will be an empty queue anyways
				return tempQueue;
			}
			if (this.q.length > 1) {
				// When more than one element is in the queue then need to do some ugly shit... srry
				var len = this.q.length;
				var nextElement;

				// Loop over the entire queue 
				for (var i = 0; i < len; i++) {

					// Get the next Elment in the queue
					nextElement = this.q[i];

					if (i == index) {
						// This is the element that we are removing so do nothing
					}
					else {
						// If the element is not equal to the index then we are keeping it
						tempQueue.enqueue(nextElement);
					}
				}
				// After tempQueue has been build with everything except the element to be removed
				return tempQueue;
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
		public isExistingProcess(process: TSOS.ProcessControlBlock): boolean {


			return false;
		}
		public getElementAt(index: number) {

			return <TSOS.ProcessControlBlock> this.q[index];
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