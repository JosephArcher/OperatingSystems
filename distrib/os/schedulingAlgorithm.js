var TSOS;
(function (TSOS) {
    var SchedulingAlgorithm = (function () {
        function SchedulingAlgorithm(name) {
            this.nameOfAlgorithm = "";
            this.nameOfAlgorithm = name;
        }
        SchedulingAlgorithm.prototype.getNameOfAlgorithm = function () {
            return this.nameOfAlgorithm;
        };
        return SchedulingAlgorithm;
    })();
    TSOS.SchedulingAlgorithm = SchedulingAlgorithm;
})(TSOS || (TSOS = {}));
