///<reference path="../globals.ts" />
/**
 * This class is used to represent a Process Control Block
 */
var TSOS;
(function (TSOS) {
    var ProcessControlBlock = (function () {
        function ProcessControlBlock() {
            this.processID = 0; // Process ID
            this.processState = ""; // Process State
            this.programCounter = -1; // Program Counter
            this.Acc = 0; // Accumulator
            this.Xreg = 0; // X Register
            this.Yreg = 0; // Y Flag 
            this.Zflag = 0; // Z Flag   
            this.baseReg = 0; // Base Register
            this.limitReg = 256; // Limit Register
            this.creationCycle = 0; // The cycle the process was created in
            this.terminationCycle = 0; // The cycle the process was terminated
            this.waitingTime = 0; // The number of cycles the process has waited
            this.processID = this.assignNextProcessID();
            this.processState = PROCESS_STATE_NEW;
            console.log("Creating new PCB");
        }
        /**
         * Used to auto increment the Process ID for a ProcessControlBlock on creation
         * @Returns {Number} The next ID
        */
        ProcessControlBlock.prototype.assignNextProcessID = function () {
            // When creating a new process control block need to auto increment the ID's 
            var nextProcessID = _ProcessCounterID + 1; // Create the nextProcessID by incrementing 1
            _ProcessCounterID = _ProcessCounterID + 1; // Increment the global counting variable
            return nextProcessID; // Return the next process ID 
        };
        /**
         * Increments the current program counter by the given amount
         * @Params value {Number} - The value to increase the program counter by
         *
        */
        ProcessControlBlock.prototype.incrementProgramCounter = function (value) {
            // TODO: Should I put checks her for memory bounds and protection? instead of inside of  branch
            this.programCounter = this.programCounter + value;
        };
        /**
         * Used to auto increment the Process ID for a ProcessControlBlock on creation
         * @Returns {Number} The next ID
        */
        ProcessControlBlock.prototype.getProcessID = function () {
            return this.processID;
        };
        /**
         * Sets the current state of the process
         * @Params state {string} - The state to set
         *
        */
        ProcessControlBlock.prototype.setProcessState = function (state) {
            this.processState = state;
        };
        /**
         * Returns the current process state
         * @Return {string} - The current state of the process
         *
        */
        ProcessControlBlock.prototype.getProcessState = function () {
            return this.processState;
        };
        /**
         * Sets the current program counter with the given value
         * @Params value {Number} - The value to be set
         *
        */
        ProcessControlBlock.prototype.setProgramCounter = function (value) {
            this.programCounter = value;
        };
        /**
         * Returns the current program counter
         * @Return {number} - The current program counter
         *
        */
        ProcessControlBlock.prototype.getProgramCounter = function () {
            return this.programCounter;
        };
        /**
         * Sets the current accumulator register with the given value
         * @Params value {Number} - The value to be set
         *
        */
        ProcessControlBlock.prototype.setAcc = function (value) {
            this.Acc = value;
        };
        /**
         * Returns the current accumulator
         * @Return {number} - The current accumulator value
         *
        */
        ProcessControlBlock.prototype.getAcc = function () {
            return this.Acc;
        };
        /**
         * Sets the current x register with the given value
         * @Params value {Number} - The value to be set
         *
        */
        ProcessControlBlock.prototype.setXReg = function (value) {
            this.Xreg = value;
        };
        /**
         * Returns the current x register
         * @Return {number} - The current x register value
         *
        */
        ProcessControlBlock.prototype.getXReg = function () {
            return this.Xreg;
        };
        /**
         * Sets the current y register with the given value
         * @Params value {Number} - The value to be set
         *
        */
        ProcessControlBlock.prototype.setYReg = function (value) {
            this.Yreg = value;
        };
        /**
         * Returns the current program counter
         * @Return {number} - The current y register value
         *
        */
        ProcessControlBlock.prototype.getYReg = function () {
            return this.Yreg;
        };
        /**
         * Sets the current z register with the given value
         * @Params value {Number} - The value to be set
         *
        */
        ProcessControlBlock.prototype.setZFlag = function (value) {
            this.Zflag = value;
        };
        /**
         * Returns the current z flag resister
         * @Return {number} - The current z flag resgister value
         *
        */
        ProcessControlBlock.prototype.getZFlag = function () {
            return this.Zflag;
        };
        /**
         * Sets the current base register with the given value
         * @Params value {Number} - The value to be set
         *
        */
        ProcessControlBlock.prototype.setBaseReg = function (value) {
            this.baseReg = value;
        };
        /**
         * Returns the current base register
         * @Return {Number} - The current value in the base register
         *
        */
        ProcessControlBlock.prototype.getBaseReg = function () {
            return this.baseReg;
        };
        /**
         * Sets the current limit register with the given value
         * @Params value {Number} - The value to be set
         *
        */
        ProcessControlBlock.prototype.setLimitReg = function (value) {
            this.limitReg = value;
        };
        /**
         * Returns the current limit register
         * @Return {Number} - The current value in the limit register
         *
        */
        ProcessControlBlock.prototype.getLimitReg = function () {
            return this.limitReg;
        };
        /**
         * Sets the creation cycle of the process with the given value
         * @Params value {Number} - The cycle number when the proces was created
         *
        */
        ProcessControlBlock.prototype.setCreationCycle = function (value) {
            this.creationCycle = value;
        };
        /**
         * Returns the creation cycle of the process
         * @Return {Number} - The cycle number when the process was created
         *
        */
        ProcessControlBlock.prototype.getCreationCycle = function () {
            return this.creationCycle;
        };
        /**
         * Sets the termination cycle of the process with the given value
         * @Params value {Number} - The cycle number the process was terminated
         *
        */
        ProcessControlBlock.prototype.setTerminationCycle = function (value) {
            this.terminationCycle = value;
        };
        /**
         * Returns the termination cycle of the process
         * @Return {Number} - The cylce number the process was terminated
         *
        */
        ProcessControlBlock.prototype.getTerminationCycle = function () {
            return this.terminationCycle;
        };
        /**
         * Increments the waiting time counter for this process
        */
        ProcessControlBlock.prototype.incrementWaitingTime = function () {
            this.waitingTime = this.waitingTime + 1;
        };
        /**
         * Returns the current total waiting time of the process
         * @Return {Number} - The current waiting time of the process
         *
        */
        ProcessControlBlock.prototype.getWaitingTime = function () {
            return this.waitingTime;
        };
        return ProcessControlBlock;
    })();
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
