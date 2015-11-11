///<reference path="../globals.ts" />
///<reference path="byte.ts" />
/**
 * This class is used to represent a 256 Byte block of Core Memory (Main Memory) for the CPU
*/
var TSOS;
(function (TSOS) {
    var MemoryBlock = (function () {
        function MemoryBlock() {
            this.memoryBlock = []; // The partition of memory to be stored as a array of bytes
        }
        /**
         * Used to create 768 bytes in memory
         */
        MemoryBlock.prototype.init = function () {
            // Creates 768 bytes in memory from the starting address
            for (var i = 0; i < 768; i++) {
                this.memoryBlock[i] = new TSOS.Byte(i, "00"); // Create each byte
            }
        };
        return MemoryBlock;
    })();
    TSOS.MemoryBlock = MemoryBlock;
})(TSOS || (TSOS = {}));
