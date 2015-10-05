///<reference path="../globals.ts" />
///<reference path="byte.ts" />
/**
 * This class is used to represent a 256 Byte block of Core Memory (Main Memory) for the CPU
*/
var TSOS;
(function (TSOS) {
    var MemoryBlock = (function () {
        function MemoryBlock() {
            // The block of memory to be stored as a array
            this.memoryBlock = [];
        }
        MemoryBlock.prototype.init = function () {
            // Create the 265 byte memory block	
            for (var i = 0; i < 255; i++) {
                // Create each byte
                this.memoryBlock[i] = new TSOS.Byte(i, "00");
            }
        };
        return MemoryBlock;
    })();
    TSOS.MemoryBlock = MemoryBlock;
})(TSOS || (TSOS = {}));
