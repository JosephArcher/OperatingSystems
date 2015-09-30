///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var Byte = (function () {
        function Byte(address) {
            this.address = 0;
            this.nibble1 = "00";
            this.nibble2 = "00";
            this.n1Set = false;
            this.n2Set = false;
            this.address = address;
        }
        return Byte;
    })();
    TSOS.Byte = Byte;
})(TSOS || (TSOS = {}));
