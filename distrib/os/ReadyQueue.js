///<reference path="queue.ts" />
///<reference path="processControlBlock.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSOS;
(function (TSOS) {
    var ReadyQueue = (function (_super) {
        __extends(ReadyQueue, _super);
        function ReadyQueue() {
            _super.apply(this, arguments);
        }
        ReadyQueue.prototype.removeElementAtIndex = function (index) {
            //console.log('THE index is ' + index);
            var tempQueue = new ReadyQueue();
            if (_ReadyQueue.getSize() == 0) {
                //console.log("TEMP QUEUE : THE SIZE WAS ZERO");
                return tempQueue; // do nothing because nothing is in the queue
            }
            if (_ReadyQueue.getSize() == 1) {
                // When only one element is in queue then just dequeue it... so it will be an empty queue anyways
                //console.log("TEMP QUEUE : THE SIZE WAS ONE");
                return tempQueue;
            }
            if (_ReadyQueue.getSize() > 1) {
                // When more than one element is in the queue then need to do some ugly shit... srry
                var len = _ReadyQueue.getSize();
                var nextElement;
                //	console.log("TEMP QUEUE : THE SIZE WAS " + len);
                // Loop over the entire queue 
                for (var i = 0; i < len; i++) {
                    // Get the next Elment in the queue
                    nextElement = _ReadyQueue.getElementAt(i);
                    if (i == index) {
                    }
                    else {
                        // If the element is not equal to the index then we are keeping it
                        tempQueue.enqueue(nextElement);
                    }
                }
                return tempQueue;
            }
        };
        ReadyQueue.prototype.getElementIndexByProccessId = function (process) {
            var theProcessId = process.getProcessID();
            var nextProcess;
            var nextProcessId;
            var len = _ReadyQueue.getSize();
            for (var i = 0; i < len; i++) {
                nextProcess = _ReadyQueue.getElementAt(i);
                // Get the next process ID
                nextProcessId = nextProcess.getProcessID();
                // Check for match
                if (theProcessId == nextProcessId) {
                    return i;
                }
            }
        };
        ReadyQueue.prototype.returnAllProcessIds = function () {
            var nextProcessBlock;
            var processArray = new Array();
            for (var i = 0; i < this.getSize(); i++) {
                nextProcessBlock = this.q[i];
                processArray.push(nextProcessBlock.processID);
            }
            //console.log(processArray);
            return processArray;
        };
        ReadyQueue.prototype.isExistingProcess = function (processID) {
            var size = this.q.length;
            var nextProcess;
            // Loop over the queue 
            for (var i = 0; i < size; i++) {
                nextProcess = _ReadyQueue.getElementAt(i);
                // Compare the given process ID and the one at the position in the queue
                if (nextProcess.getProcessID() == processID) {
                    return nextProcess;
                }
            }
            // If process does not exists return null
            return null;
        };
        ReadyQueue.prototype.isFileWrittenToDisk = function () {
            var size = _ReadyQueue.getSize();
            var nextProcess;
            //	console.log("IS THE FILE WRITTEN " + size);
            //	console.log(_ReadyQueue);
            // Loop over the queue 
            for (var i = 0; i < size; i++) {
                nextProcess = _ReadyQueue.getElementAt(i);
                //	console.log(nextProcess.location + "test for adis");
                //console.log(PROCESS_ON_DISK + "test for adis 3");
                // Check the next process to see if the process is on the disk or in mem
                if (nextProcess.location == PROCESS_ON_DISK) {
                    return true;
                }
            }
            // If no process is written to disk return false
            return false;
        };
        ReadyQueue.prototype.getElementAt = function (index) {
            return this.q[index];
        };
        /**
         * Used to find the priority with the highest priority in the ready queue
         * @Returns {Number} - The index in the ready queue with the highest priority
         */
        ReadyQueue.prototype.findHighestPriorityIndex = function () {
            // Initialize variables
            var currentLargestPriority = -1;
            var largestIndex = -1;
            var nextProcecss = null;
            // Loop over the list checking each pcb in the ready queue for the heightest Process with ties being broken by FCFS
            for (var i = 0; i < _ReadyQueue.getSize(); i++) {
                // Get the next PCB in the next queue
                nextProcecss = _ReadyQueue.getElementAt(i);
                // Compare the next process's priority to the current heightest priority
                if (nextProcecss.getPriority() > currentLargestPriority) {
                    // Update the globals
                    currentLargestPriority = nextProcecss.getPriority();
                    largestIndex = i;
                }
                else {
                }
            }
            // Return the index of the highest priority
            return largestIndex;
        };
        ReadyQueue.prototype.incrementWaitTime = function () {
            // Get the size of the ready queue
            var size = _ReadyQueue.getSize();
            var nextProcess;
            // Loop over the ready queue
            for (var i = 0; i < size; i++) {
                // Get the next process in the queue
                nextProcess = _ReadyQueue.getElementAt(i);
                // Increment its waiting time by 1
                nextProcess.incrementWaitTime();
            }
        };
        ReadyQueue.prototype.incrementTurnAroundTime = function () {
            // Get the size of the ready queue
            var size = _ReadyQueue.getSize();
            var nextProcess;
            // Loop over the ready queue
            for (var i = 0; i < size; i++) {
                // Get the next process in the queue
                nextProcess = _ReadyQueue.getElementAt(i);
                // Increment its waiting time by 1
                nextProcess.incrementTurnAroundTime();
            }
            // Check to see if a process is running
            if (_CPUScheduler.getCurrentProcess() != null) {
                _CPUScheduler.getCurrentProcess().incrementTurnAroundTime();
            }
        };
        ReadyQueue.prototype.getAllPids = function () {
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
        };
        return ReadyQueue;
    })(TSOS.Queue);
    TSOS.ReadyQueue = ReadyQueue;
})(TSOS || (TSOS = {}));
