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
            var tempQueue = new ReadyQueue();
            if (this.q.length == 0) {
                return tempQueue; // do nothing because nothing is in the queue
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
                    }
                    else {
                        // If the element is not equal to the index then we are keeping it
                        tempQueue.enqueue(nextElement);
                    }
                }
                // After tempQueue has been build with everything except the element to be removed
                return tempQueue;
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
