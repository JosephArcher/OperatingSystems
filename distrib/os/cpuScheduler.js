var TSOS;
(function (TSOS) {
    var CpuScheduler = (function () {
        function CpuScheduler() {
            // The quantum the Scheduler will use 
            this.quantum = 6;
        }
        CpuScheduler.prototype.needToSwap = function (arg) {
            if ((arg % this.quantum) == 0) {
                console.log("Need to swap cause quantum is over");
                return true;
            }
            else {
                return false;
                console.log("Quantum is not done yet");
            }
        };
        CpuScheduler.prototype.getQuantum = function () {
            return this.quantum;
        };
        CpuScheduler.prototype.setQuantum = function (newQuantum) {
            this.quantum = newQuantum;
        };
        return CpuScheduler;
    })();
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
