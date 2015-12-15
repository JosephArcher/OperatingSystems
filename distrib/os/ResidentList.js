//<reference path="queue.ts" />
///<reference path="processControlBlock.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 *   Resident List
 *
 *	 Queue with extended functionally
 */
var TSOS;
(function (TSOS) {
    var ResidentList = (function (_super) {
        __extends(ResidentList, _super);
        function ResidentList() {
            _super.apply(this, arguments);
        }
        ResidentList.prototype.removeElementAtIndex = function (index) {
            console.log('THE index is ' + index);
            var tempQueue = new ResidentList();
            if (_ResidentList.getSize() == 0) {
                console.log("TEMP QUEUE : THE SIZE WAS ZERO");
                return tempQueue; // do nothing because nothing is in the queue
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
        ResidentList.prototype.getElementIndexByProccessId = function (process) {
            var theProcessId = process.getProcessID();
            var nextProcess;
            var nextProcessId;
            var len = _ResidentList.getSize();
            for (var i = 0; i < len; i++) {
                nextProcess = _ResidentList.getElementAt(i);
                // Get the next process ID
                nextProcessId = nextProcess.getProcessID();
                // Check for match
                if (theProcessId == nextProcessId) {
                    return i;
                }
            }
        };
        ResidentList.prototype.isFileWrittenToDisk = function () {
            var size = _ResidentList.getSize();
            var nextProcess;
            // Loop over the queue 
            for (var i = 0; i < size; i++) {
                nextProcess = _ResidentList.getElementAt(i);
                console.log(nextProcess.location + "test for adis");
                // Check the next process to see if the process is on the disk or in mem
                if (nextProcess.location == PROCESS_ON_DISK) {
                    return true;
                }
            }
            // If no process is written to disk return false
            return false;
        };
        ResidentList.prototype.returnAllProcessIds = function () {
            var nextProcessBlock;
            var processArray = new Array();
            for (var i = 0; i < this.getSize(); i++) {
                nextProcessBlock = this.q[i];
                processArray.push(nextProcessBlock.processID);
            }
            console.log(processArray);
            return processArray;
        };
        ResidentList.prototype.getElementAt = function (index) {
            return this.q[index];
        };
        ResidentList.prototype.getAllPids = function () {
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
        return ResidentList;
    })(TSOS.Queue);
    TSOS.ResidentList = ResidentList;
})(TSOS || (TSOS = {}));
