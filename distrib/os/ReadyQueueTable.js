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
            this.addRow(newProcess);
        };
        ReadyQueueTable.prototype.addRow = function (process) {
            var row = this.table.insertRow(this.numberOfRows());
            var cell0 = row.insertCell(0); // State
            var cell1 = row.insertCell(1); // PC
            var cell2 = row.insertCell(2); // ACC
            var cell3 = row.insertCell(3); // X
            var cell4 = row.insertCell(4); // Y
            var cell5 = row.insertCell(5); // Z
            var cell6 = row.insertCell(6); // PID
            var cell7 = row.insertCell(7); // Base
            cell0.innerHTML = process.getProcessState();
            cell1.innerHTML = process.getProgramCounter() + "";
            cell2.innerHTML = process.getAcc() + "";
            cell3.innerHTML = process.getXReg() + "";
            cell4.innerHTML = process.getYReg() + "";
            cell5.innerHTML = process.getZFlag() + "";
            cell6.innerHTML = process.getProcessID() + "";
            cell7.innerHTML = process.getBaseReg() + "";
        };
        ReadyQueueTable.prototype.removeRow = function (rowNumber) {
            this.table.deleteRow(rowNumber);
        };
        return ReadyQueueTable;
    })();
    TSOS.ReadyQueueTable = ReadyQueueTable;
})(TSOS || (TSOS = {}));
