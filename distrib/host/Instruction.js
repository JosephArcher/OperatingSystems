///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var Instruction = (function () {
        function Instruction(func, opCode, description) {
            if (opCode === void 0) { opCode = ""; }
            if (description === void 0) { description = ""; }
            this.func = func;
            this.opCode = opCode;
            this.description = description;
        }
        return Instruction;
    })();
    TSOS.Instruction = Instruction;
})(TSOS || (TSOS = {}));
