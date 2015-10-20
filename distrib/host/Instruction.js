///<reference path="../globals.ts" />
/**
    This class is used to represesnt a 6502A machine instruction
*/
var TSOS;
(function (TSOS) {
    var Instruction = (function () {
        function Instruction(func, opCode, description, numberofDataBytes) {
            // The name of of the Op Code           
            this.opCode = "";
            // A description of the Op Code
            this.description = "";
            // DataBytesUsed
            this.numberOfDataBytes = 0;
            this.function = func;
            this.opCode = opCode;
            this.description = description;
            this.numberOfDataBytes = numberofDataBytes;
        }
        return Instruction;
    })();
    TSOS.Instruction = Instruction;
})(TSOS || (TSOS = {}));
