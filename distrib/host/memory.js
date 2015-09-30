///<reference path="../globals.ts" />
///<reference path="byte.ts" />
var TSOS;
(function (TSOS) {
    var MemoryBlock = (function () {
        function MemoryBlock() {
            this.block = [];
            this.counter = 0;
        }
        MemoryBlock.prototype.init = function () {
            this.counter = 0;
            for (var i = 0; i < 255; i++) {
                this.block[i] = new TSOS.Byte(i);
            }
        };
        MemoryBlock.prototype.getLength = function () {
            return this.block.length;
        };
        MemoryBlock.prototype.setByte = function (args) {
            this.block[args[0]] = args[0];
        };
        MemoryBlock.prototype.setNextByte = function (arg) {
            var nextCharacter = arg[0];
            var nextBlock = this.block[this.counter];
            if (nextBlock.length == 0) {
                this.block[this.counter] = nextCharacter;
            }
            else if (nextBlock.length == 1) {
                //console.log(nextBlock.length + "length");
                this.block[this.counter] = nextBlock + nextCharacter;
                this.counter = this.counter + 1;
            }
            else {
                console.log("over 2");
                this.counter = this.counter + 1;
                this.block[this.counter] = nextBlock + nextCharacter;
            }
        };
        MemoryBlock.prototype.getByte = function (arg) {
            return this.block[arg];
        };
        MemoryBlock.prototype.clearMemory = function () {
        };
        return MemoryBlock;
    })();
    TSOS.MemoryBlock = MemoryBlock;
})(TSOS || (TSOS = {}));
