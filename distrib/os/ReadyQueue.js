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
            console.log('THE index is ' + index);
            var tempQueue = new ReadyQueue();
            if (_ReadyQueue.getSize() == 0) {
                console.log("TEMP QUEUE : THE SIZE WAS ZERO");
                return tempQueue; // do nothing because nothing is in the queue
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
        };
        ReadyQueue.prototype.getElementIndexByProccessId = function (process) {
            var theProcessId = process.getProcessID();
            var nextProcess;
            var nextProcessId;
            var len = _ReadyQueue.getSize();
            for (var i = 0; i < len; i++) {
                nextProcess = _ReadyQueue.getElementAt(i);
                // Get the next process ID
                console.log(nextProcess + " JOE THIS IS THE ERROR");
                nextProcessId = nextProcess.getProcessID();
                // Check for match
                if (theProcessId == nextProcessId) {
                    console.log(i + " JOE THIS IS THE INDEX OF THE PROCESS TO TERMINATE");
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
            console.log(processArray);
            return processArray;
        };
        ReadyQueue.prototype.isExistingProcess = function (process) {
            return false;
        };
        ReadyQueue.prototype.getElementAt = function (index) {
            return this.q[index];
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
