///<reference path="../globals.ts" />
/**
 * This class is used to represent a Process Control Block
 */
var TSOS;
(function (TSOS) {
    var ProcessControlBlock = (function () {
        function ProcessControlBlock() {
            this.processID = 0;
            this.processState = "";
            this.programCounter = -1;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.processID = this.assignNextProcessID();
            this.processState = PROCESS_STATE_NEW;
        }
        /**
         * Used to auto increment the Process ID for a ProcessControlBlock on creation
         * @Returns {Number} The next ID
        */
        ProcessControlBlock.prototype.assignNextProcessID = function () {
            var nextProcessID = _ProcessCounterID + 1;
            _ProcessCounterID = _ProcessCounterID + 1;
            return nextProcessID;
        };
        /**
         * Used to auto increment the Process ID for a ProcessControlBlock on creation
         * @Returns {Number} The next ID
        */
        ProcessControlBlock.prototype.getProcessID = function () {
            return this.processID + "";
        };
        ProcessControlBlock.prototype.setProcessState = function (state) {
            this.processState = state;
        };
        ProcessControlBlock.prototype.getProcessState = function () {
            return this.processState;
        };
        ProcessControlBlock.prototype.setProgramCounter = function (value) {
            this.programCounter = value;
        };
        ProcessControlBlock.prototype.getProgramCounter = function () {
            return this.programCounter + "";
        };
        ProcessControlBlock.prototype.setAcc = function (value) {
            this.Acc = value;
        };
        ProcessControlBlock.prototype.getAcc = function () {
            return this.Acc + "";
        };
        ProcessControlBlock.prototype.setXReg = function (value) {
            this.Xreg = value;
        };
        ProcessControlBlock.prototype.getXReg = function () {
            return this.Xreg + "";
        };
        ProcessControlBlock.prototype.setYReg = function (value) {
            this.Yreg = value;
        };
        ProcessControlBlock.prototype.getYReg = function () {
            return this.Yreg + "";
        };
        ProcessControlBlock.prototype.setZFlag = function (value) {
            this.Zflag = value;
        };
        ProcessControlBlock.prototype.getZFlag = function () {
            return this.Zflag + "";
        };
        ProcessControlBlock.prototype.incrementProgramCounter = function (value) {
            this.programCounter = this.programCounter + value;
        };
        return ProcessControlBlock;
    })();
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
