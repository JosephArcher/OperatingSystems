var TSOS;
(function (TSOS) {
    var MemoryBlock = (function () {
        function MemoryBlock() {
            this.bytes = [];
            this.counter = 0;
        }
        MemoryBlock.prototype.init = function () {
            this.counter = 0;
            for (var i = 0; i < 255; i++) {
                this.bytes[i] = null;
            }
        };
        MemoryBlock.prototype.getLength = function () {
            return this.bytes.length;
        };
        MemoryBlock.prototype.setByte = function (args) {
            this.bytes[args[0]] = args[0];
        };
        MemoryBlock.prototype.setNextByte = function (arg) {
            var nextCharacter = arg[0];
            var nextBlock = this.bytes[this.counter];
            if (nextBlock == null) {
                console.log("null");
                this.bytes[this.counter] = nextCharacter;
            }
            else if (nextBlock.length < 2) {
                console.log("under 2");
                console.log(nextBlock.length + "length");
                this.bytes[this.counter] = nextBlock + nextCharacter;
                this.counter = this.counter + 1;
            }
            else {
                console.log("over 2");
                this.counter = this.counter + 1;
                this.bytes[this.counter] = nextBlock + nextCharacter;
            }
        };
        MemoryBlock.prototype.getByte = function (arg) {
            return this.bytes[arg];
        };
        MemoryBlock.prototype.clearMemory = function () {
        };
        MemoryBlock.prototype.nextOpen = function () {
            return this.counter;
        };
        return MemoryBlock;
    })();
    TSOS.MemoryBlock = MemoryBlock;
})(TSOS || (TSOS = {}));
