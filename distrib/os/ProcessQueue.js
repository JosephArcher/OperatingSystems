///<reference path="queue.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSOS;
(function (TSOS) {
    var ProcessQueue = (function (_super) {
        __extends(ProcessQueue, _super);
        function ProcessQueue() {
            _super.apply(this, arguments);
        }
        // public constructor (arg) {
        // }
        ProcessQueue.prototype.returnAllProcesses = function () {
            var nextProcessBlock;
            var processArray = new Array();
            for (var i = 0; i < this.getSize(); i++) {
                nextProcessBlock = this.q[i];
                processArray.push(nextProcessBlock);
            }
            return processArray;
        };
        return ProcessQueue;
    })(TSOS.Queue);
    TSOS.ProcessQueue = ProcessQueue;
})(TSOS || (TSOS = {}));
