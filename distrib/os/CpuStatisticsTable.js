///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
/**
    This class is used to alter the CPU Statistics Display Table
*/
var TSOS;
(function (TSOS) {
    var CpuStatisticsTable = (function () {
        function CpuStatisticsTable(tableElement) {
            this.table = tableElement;
        }
        /**
         * Sets the program counter in the user display
        */
        CpuStatisticsTable.prototype.setProgramCounter = function (value) {
            this.currentRow = this.table.rows.item(1);
            this.currentCell = this.currentRow.cells.item(0);
            this.currentCell.innerHTML = value;
        };
        /**
         * Sets the Instruction Register in the current display
        */
        CpuStatisticsTable.prototype.setInstructionRegister = function (value) {
            this.currentRow = this.table.rows.item(1);
            this.currentCell = this.currentRow.cells.item(1);
            this.currentCell.innerHTML = value;
        };
        /**
         * Sets the Accumulator in the current display
        */
        CpuStatisticsTable.prototype.setAccumulator = function (value) {
            this.currentRow = this.table.rows.item(1);
            this.currentCell = this.currentRow.cells.item(2);
            this.currentCell.innerHTML = value;
        };
        /**
         * Sets the X Register in the current display
        */
        CpuStatisticsTable.prototype.setXRegister = function (value) {
            this.currentRow = this.table.rows.item(1);
            this.currentCell = this.currentRow.cells.item(3);
            this.currentCell.innerHTML = value;
        };
        /**
         * Sets the Y Register in the current display
        */
        CpuStatisticsTable.prototype.setYRegister = function (value) {
            this.currentRow = this.table.rows.item(1);
            this.currentCell = this.currentRow.cells.item(4);
            this.currentCell.innerHTML = value;
        };
        /**
         * Sets the Z Flag in the current display
        */
        CpuStatisticsTable.prototype.setZFlag = function (value) {
            this.currentRow = this.table.rows.item(1);
            this.currentCell = this.currentRow.cells.item(5);
            this.currentCell.innerHTML = value;
        };
        /**
         * Updates the entire status bar with the values from the CPU
        */
        CpuStatisticsTable.prototype.updateStatusBar = function () {
            this.setProgramCounter(_CPU.PC + "");
            this.setInstructionRegister("0");
            this.setAccumulator(_CPU.Acc + "");
            this.setXRegister(_CPU.Xreg + "");
            this.setYRegister(_CPU.Yreg + "");
            this.setZFlag(_CPU.Zflag + "");
        };
        return CpuStatisticsTable;
    })();
    TSOS.CpuStatisticsTable = CpuStatisticsTable;
})(TSOS || (TSOS = {}));
