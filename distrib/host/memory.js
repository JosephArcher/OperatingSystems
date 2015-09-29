var TSOS;
(function (TSOS) {
    var MemoryBlock = (function () {
        function MemoryBlock() {
            this.bytes = [];
        }
        MemoryBlock.prototype.init = function () {
            for (var i = 0; i < 256; i++) {
                this.bytes[i] = "null";
            }
        };
        return MemoryBlock;
    })();
    TSOS.MemoryBlock = MemoryBlock;
})(TSOS || (TSOS = {}));
