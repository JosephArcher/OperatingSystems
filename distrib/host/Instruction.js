///<reference path="../globals.ts" />
/**
    This class is used to represesnt a 6502A machine instruction
*/
var TSOS;
(function (TSOS) {
    var Instruction = (function () {
        function Instruction(func, opCode, description) {
            if (opCode === void 0) { opCode = ""; }
            if (description === void 0) { description = ""; }
            // The name of of the Op Code           
            this.opCode = "";
            // A description of the Op Code
            this.description = "";
            this.function = func;
            this.opCode = opCode;
            this.description = description;
        }
        return Instruction;
    })();
    TSOS.Instruction = Instruction;
})(TSOS || (TSOS = {}));
