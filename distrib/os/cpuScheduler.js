///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="../host/cpu.ts"/>
///<reference path="timer.ts" />
///<reference path="processControlBlock.ts" />
/**
 * The CPU Scheduler for Joe/s
 *
 * Used to track the current process the O/S is running, what algorithm is being used, and the current time quantum
 *
 */
var TSOS;
(function (TSOS) {
    var CpuScheduler = (function () {
        function CpuScheduler() {
            this.quantum = 6; // Quantum or time slice for each process (Default is 6)
            this.SchedulingAlgorithm = ROUND_ROBIN; // The scheduling algorithm the that is currently being used (Default is Round Robin)
            this.quantum = 6;
            this.SchedulingAlgorithm = ROUND_ROBIN;
            this.runningProcess = null;
        }
        /**
         * Returns the current quantum being used for round robin
         */
        CpuScheduler.prototype.getQuantum = function () {
            return this.quantum;
        };
        /**
         * Sets the quantum property of the scheduler
         */
        CpuScheduler.prototype.setQuantum = function (newQuantum) {
            this.quantum = newQuantum;
        };
        /**
         *  Returns the current process that is running
         */
        CpuScheduler.prototype.getCurrentProcess = function () {
            return this.runningProcess;
        };
        /**
         *  Sets the current process
         */
        CpuScheduler.prototype.setCurrentProcess = function (nextProcess) {
            this.runningProcess = nextProcess;
        };
        /**
         * Sets the current scheduling algorithm
         */
        CpuScheduler.prototype.setSchedulingAlgorithm = function (newSchedulingAlgorithm) {
            this.SchedulingAlgorithm = newSchedulingAlgorithm;
        };
        /**
         * Gets the current scheduling algorithm
         */
        CpuScheduler.prototype.getSchedulingAlgorithm = function () {
            return this.SchedulingAlgorithm;
        };
        CpuScheduler.prototype.validSchedulingAlgorithm = function (algorithm) {
            if (algorithm != ROUND_ROBIN && algorithm != NON_PREEMPTIVE_PRIORITY && algorithm != FIRST_COME_FIRST_SERVE) {
                console.log("The algorithm is not valid");
                return false;
            }
            console.log("The algorithm is  valid");
            return true;
        };
        /**
         * Used to make a scheduling decision based on the current algorithm being used by the O/S
         * @Returns  {ProcessControlBlock} - The next process to be exeuted
         * 									- If no processes exists then return null
         */
        CpuScheduler.prototype.getNextProcess = function () {
            var nextProcess = null;
            //First check the next size of the ready queue
            if (_ReadyQueue.getSize() > 0) {
                // Next check what current scheduling algorithm is being used
                if (this.SchedulingAlgorithm == NON_PREEMPTIVE_PRIORITY) {
                    // Just get next one 	
                    nextProcess = _ReadyQueue.dequeue(); // Get the next process from  the ready queue
                }
                else {
                    // Just get next one 	
                    nextProcess = _ReadyQueue.dequeue(); // Get the next process from  the ready queue
                }
            }
            this.setCurrentProcess(nextProcess); //
            return nextProcess;
        };
        return CpuScheduler;
    })();
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
