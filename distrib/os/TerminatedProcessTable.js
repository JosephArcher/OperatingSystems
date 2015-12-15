///<reference path="../globals.ts" />
///<reference path="processControlBlock.ts" />
/**
 * This class is used to represent the ProcessControlTable on the User Interface
 * This class provides methods to update the information about the current Process Control Block
 * and update the table as the process executes.
*/
var TSOS;
(function (TSOS) {
    var TerminatedProcessTable = (function () {
        function TerminatedProcessTable(tableElement) {
            this.table = tableElement;
        }
        TerminatedProcessTable.prototype.numberOfRows = function () {
            var rows = this.table.rows.length;
            return rows;
        };
        TerminatedProcessTable.prototype.setCellData = function (row, cell, data) {
            this.currentRow = this.table.rows.item(row);
            this.currentCell = this.currentRow.cells.item(cell);
            this.currentCell.innerHTML = data;
        };
        TerminatedProcessTable.prototype.setProcessStateValue = function (row, value) {
            this.setCellData(row, 0, value);
        };
        TerminatedProcessTable.prototype.setProgramCounterValue = function (row, value) {
            this.setCellData(row, 1, value);
        };
        TerminatedProcessTable.prototype.setAccumulatorValue = function (row, value) {
            this.setCellData(row, 2, value);
        };
        TerminatedProcessTable.prototype.setXRegisterValue = function (row, value) {
            this.setCellData(row, 3, value);
        };
        TerminatedProcessTable.prototype.setYRegisterValue = function (row, value) {
            this.setCellData(row, 4, value);
        };
        TerminatedProcessTable.prototype.setZFlagValue = function (row, value) {
            this.setCellData(row, 5, value);
        };
        TerminatedProcessTable.prototype.getProcessID = function (row) {
            var processID = 0;
            var test = this.table.rows.item(row);
            var nextTablePID = test.cells.item(6);
            var output = parseInt(nextTablePID.innerHTML, 16);
            return output;
        };
        TerminatedProcessTable.prototype.clearTable = function () {
            for (var i = 1; i < this.numberOfRows(); i++) {
                this.removeRow(i);
            }
        };
        TerminatedProcessTable.prototype.addRow = function (process) {
            var row = this.table.insertRow(this.numberOfRows());
            var cell0 = row.insertCell(0); // PID
            var cell1 = row.insertCell(1); // State
            var cell2 = row.insertCell(2); // PC
            var cell3 = row.insertCell(3); // ACC
            var cell4 = row.insertCell(4); // X
            var cell5 = row.insertCell(5); // Y
            var cell6 = row.insertCell(6); // Z
            var cell7 = row.insertCell(7); // Base
            var cell8 = row.insertCell(8); // Turn
            var cell9 = row.insertCell(9); // Wait
            cell0.innerHTML = process.getProcessID() + "";
            cell1.innerHTML = process.getProcessState() + "";
            cell2.innerHTML = process.getProgramCounter() + "";
            cell3.innerHTML = process.getAcc() + "";
            cell4.innerHTML = process.getXReg() + "";
            cell5.innerHTML = process.getYReg() + "";
            cell6.innerHTML = process.getZFlag() + "";
            cell7.innerHTML = process.getBaseReg() + "";
            cell8.innerHTML = process.getTurnAroundTime() + "";
            cell9.innerHTML = process.getWaitTime() + "";
        };
        TerminatedProcessTable.prototype.removeRow = function (rowNumber) {
            this.table.deleteRow(rowNumber);
        };
        return TerminatedProcessTable;
    })();
    TSOS.TerminatedProcessTable = TerminatedProcessTable;
})(TSOS || (TSOS = {}));
