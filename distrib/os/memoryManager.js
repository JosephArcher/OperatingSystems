///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager(block) {
            this.memoryBlock = null;
            this.counter = 0;
            this.processID = 0;
            this.memoryBlock = block;
        }
        MemoryManager.prototype.getByte = function (index) {
            var response = this.memoryBlock.block[index];
            return response;
        };
        MemoryManager.prototype.setByte = function (index, value) {
            this.memoryBlock[index] = value;
            console.log("index " + index + " was set to " + value);
            TSOS.Utils.setFreeMemoryInfo(TSOS.Utils.getTableRowPosition(this.counter), TSOS.Utils.getTableColumnPosition(this.counter), value);
        };
        MemoryManager.prototype.setNextByte = function (value) {
            //Base Case
            if (this.counter > 255) {
                console.log("Memory is full");
                return;
            }
            var nextByte = this.memoryBlock.block[this.counter];
            var nibble = this.memoryBlock.block[this.counter].address;
            console.log(nextByte.address + " asdf");
            if (nextByte.n1Set == false) {
                nextByte.nibble1 = value;
                console.log("set n1 value" + nextByte.nibble1);
                nextByte.n1Set = true;
                //_MemoryInfoTable.rows.item(this.counter)
                TSOS.Utils.setFreeMemoryInfo(TSOS.Utils.getTableRowPosition(this.counter), TSOS.Utils.getTableColumnPosition(this.counter), value);
            }
            else if (nextByte.n1Set == true && nextByte.n2Set == false) {
                console.log("set n2 value" + nextByte.nibble2);
                nextByte.nibble2 = value;
                nextByte.n2Set = true;
                TSOS.Utils.setHalfFreeMemoryInfo(TSOS.Utils.getTableRowPosition(this.counter), TSOS.Utils.getTableColumnPosition(this.counter), value);
            }
            else {
                // Case when the current counter is on a full byte already
                this.counter = this.counter + 1;
                this.setNextByte(value);
            }
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
