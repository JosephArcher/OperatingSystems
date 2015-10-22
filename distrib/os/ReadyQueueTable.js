///<reference path="../globals.ts" />
///<reference path="processControlBlock.ts" />
/**
 * This class is used to represent the ProcessControlTable on the User Interface
 * This class provides methods to update the information about the current Process Control Block
 * and update the table as the process executes.
*/
var TSOS;
(function (TSOS) {
    var ReadyQueueTable = (function () {
        function ReadyQueueTable(tableElement) {
            this.table = tableElement;
        }
        ReadyQueueTable.prototype.numberOfRows = function () {
            var rows = this.table.rows.length;
            console.log("number of rows: " + rows);
            return rows;
        };
        ReadyQueueTable.prototype.setCellData = function (row, cell, data) {
            this.currentRow = this.table.rows.item(row);
            this.currentCell = this.currentRow.cells.item(cell);
            this.currentCell.innerHTML = data;
        };
        ReadyQueueTable.prototype.setProcessStateValue = function (value) {
            this.setCellData(1, 0, value);
        };
        ReadyQueueTable.prototype.setProgramCounterValue = function (value) {
            this.setCellData(1, 1, value);
        };
        ReadyQueueTable.prototype.setAccumulatorValue = function (value) {
            this.setCellData(1, 2, value);
        };
        ReadyQueueTable.prototype.setXRegisterValue = function (value) {
            this.setCellData(1, 3, value);
        };
        ReadyQueueTable.prototype.setYRegisterValue = function (value) {
            this.setCellData(1, 4, value);
        };
        ReadyQueueTable.prototype.setZFlagValue = function (value) {
            this.setCellData(1, 5, value);
        };
        ReadyQueueTable.prototype.updateTableContents = function () {
            this.setProcessStateValue(PROCESS_STATE_TERMINATED);
            this.setProgramCounterValue(_CPU.PC + "");
            this.setXRegisterValue(_CPU.Xreg + "");
            this.setYRegisterValue(_CPU.Yreg + "");
            this.setAccumulatorValue(_CPU.Acc + "");
            this.setZFlagValue(_CPU.Zflag + "");
        };
        ReadyQueueTable.prototype.clearTable = function () {
            this.setProcessStateValue("00");
            this.setProgramCounterValue("00");
            this.setXRegisterValue("00");
            this.setYRegisterValue("00");
            this.setAccumulatorValue("00");
            this.setZFlagValue("00");
        };
        ReadyQueueTable.prototype.addNewProcess = function (newProcess) {
            console.log(this.table.rows.length + "ROWDSFSDFSDSF");
            this.addRow();
        };
        ReadyQueueTable.prototype.addRow = function () {
            var row = this.table.insertRow(this.numberOfRows());
            var cell0 = row.insertCell(0);
            var cell1 = row.insertCell(1);
            var cell2 = row.insertCell(2);
            var cell3 = row.insertCell(3);
            var cell4 = row.insertCell(4);
            var cell5 = row.insertCell(5);
            cell0.innerHTML = "00";
            cell1.innerHTML = "00";
            cell2.innerHTML = "00";
            cell3.innerHTML = "00";
            cell4.innerHTML = "00";
            cell5.innerHTML = "00";
        };
        ReadyQueueTable.prototype.removeRow = function (rowNumber) {
            this.table.deleteRow(rowNumber);
        };
        return ReadyQueueTable;
    })();
    TSOS.ReadyQueueTable = ReadyQueueTable;
})(TSOS || (TSOS = {}));
