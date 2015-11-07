
///<reference path="queue.ts" />
///<reference path="processControlBlock.ts" />

module TSOS {

	export class ResidentList extends TSOS.Queue {

		public removeElementAtIndex(index: number) {

			console.log('THE index is ' + index);
			var tempQueue = new ResidentList();

			if (_ResidentList.getSize() == 0) {
				console.log("TEMP QUEUE : THE SIZE WAS ZERO");
				return tempQueue // do nothing because nothing is in the queue
			}
			if (_ResidentList.getSize() == 1) {
				// When only one element is in queue then just dequeue it... so it will be an empty queue anyways
				console.log("TEMP QUEUE : THE SIZE WAS ONE");
				return tempQueue;
			}
			if (_ResidentList.getSize() > 1) {
				// When more than one element is in the queue then need to do some ugly shit... srry
				var len = _ResidentList.getSize();
				var nextElement;
				console.log("TEMP QUEUE : THE SIZE WAS " + len);
				// Loop over the entire queue 
				for (var i = 0; i < len; i++) {

					// Get the next Elment in the queue
					nextElement = _ResidentList.getElementAt(i);

					if (i == index) {
						// This is the element that we are removing so do nothing
					}
					else {
						// If the element is not equal to the index then we are keeping it
						tempQueue.enqueue(nextElement);
					}
				}
				// After tempQueue has been build with everything except the element to be removed
				console.log("JOE THE TEMP QUEUE SIZE IS " + tempQueue.getSize());
				return tempQueue;
			}
		}
		public getElementIndexByProccessId(process: TSOS.ProcessControlBlock): number {

			var theProcessId: number = process.getProcessID();
			var nextProcess: TSOS.ProcessControlBlock;
			var nextProcessId: number;
			var len = _ResidentList.getSize();

			for (var i = 0; i < len; i++) {
				nextProcess = <TSOS.ProcessControlBlock>_ResidentList.getElementAt(i);

				// Get the next process ID
				nextProcessId = nextProcess.getProcessID();
				// Check for match
				if (theProcessId == nextProcessId) {
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
		public isExistingProcess(process: TSOS.ProcessControlBlock): boolean {


			return false;
		}
		public getElementAt(index: number) {

			return <TSOS.ProcessControlBlock>this.q[index];
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