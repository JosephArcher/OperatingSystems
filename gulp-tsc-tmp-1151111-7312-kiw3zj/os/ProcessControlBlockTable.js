/**
 * This class is used to represent the ProcessControlTable on the User Interface
 * This class provides methods to update the information about the current Process Control Block
 * and update the table as the process executes.
*/
var TSOS;
(function (TSOS) {
    var ProcessControlBlockTable = (function () {
        function ProcessControlBlockTable(tableElement) {
            this.table = tableElement;
        }
        ProcessControlBlockTable.prototype.setCellData = function (row, cell, data) {
            this.currentRow = this.table.rows.item(row);
            this.currentCell = this.currentRow.cells.item(cell);
            this.currentCell.innerHTML = data;
        };
        ProcessControlBlockTable.prototype.setProcessStateValue = function (value) {
            this.setCellData(1, 0, value);
        };
        ProcessControlBlockTable.prototype.setProgramCounterValue = function (value) {
            this.setCellData(1, 1, value);
        };
        ProcessControlBlockTable.prototype.setAccumulatorValue = function (value) {
            this.setCellData(1, 2, value);
        };
        ProcessControlBlockTable.prototype.setXRegisterValue = function (value) {
            this.setCellData(1, 3, value);
        };
        ProcessControlBlockTable.prototype.setYRegisterValue = function (value) {
            this.setCellData(1, 4, value);
        };
        ProcessControlBlockTable.prototype.setZFlagValue = function (value) {
            this.setCellData(1, 5, value);
        };
        ProcessControlBlockTable.prototype.updateTableContents = function () {
            this.setProcessStateValue(PROCESS_STATE_TERMINATED);
            this.setProgramCounterValue(_CPU.PC + "");
            this.setXRegisterValue(_CPU.Xreg + "");
            this.setYRegisterValue(_CPU.Yreg + "");
            this.setAccumulatorValue(_CPU.Acc + "");
            this.setZFlagValue(_CPU.Zflag + "");
        };
        ProcessControlBlockTable.prototype.clearTable = function () {
            this.setProcessStateValue("00");
            this.setProgramCounterValue("00");
            this.setXRegisterValue("00");
            this.setYRegisterValue("00");
            this.setAccumulatorValue("00");
            this.setZFlagValue("00");
        };
        return ProcessControlBlockTable;
    })();
    TSOS.ProcessControlBlockTable = ProcessControlBlockTable;
})(TSOS || (TSOS = {}));
