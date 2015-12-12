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
            console.log("number of rows: " + rows);
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
            console.log(output + " Joe this is the table output");
            return output;
        };
        TerminatedProcessTable.prototype.clearTable = function () {
            for (var i = 1; i < this.numberOfRows(); i++) {
                this.removeRow(i);
            }
        };
        // public updateTableContents(): void {
        // 	this.setProcessStateValue(PROCESS_STATE_TERMINATED);
        // 	this.setProgramCounterValue(_CPU.PC + "");
        // 	this.setXRegisterValue(_CPU.Xreg + "");
        // 	this.setYRegisterValue(_CPU.Yreg + "");
        // 	this.setAccumulatorValue(_CPU.Acc + "");
        // 	this.setZFlagValue(_CPU.Zflag + "");
        // }
        // public clearTable(): void {
        // 	this.setProcessStateValue("00");
        // 	this.setProgramCounterValue("00");
        // 	this.setXRegisterValue("00");
        // 	this.setYRegisterValue("00");
        // 	this.setAccumulatorValue("00");
        // 	this.setZFlagValue("00");
        // }
        // public addNewProcess(newProcess: TSOS.ProcessControlBlock): void {
        // 	console.log(this.table.rows.length + "ROWDSFSDFSDSF");
        // 	this.addRow(newProcess);
        // }
        TerminatedProcessTable.prototype.addRow = function (process) {
            var row = this.table.insertRow(this.numberOfRows());
            var cell0 = row.insertCell(0); // State
            var cell1 = row.insertCell(1); // PC
            var cell2 = row.insertCell(2); // ACC
            var cell3 = row.insertCell(3); // X
            var cell4 = row.insertCell(4); // Y
            var cell5 = row.insertCell(5); // Z
            var cell6 = row.insertCell(6); // PID
            var cell7 = row.insertCell(7); // Base
            var cell8 = row.insertCell(8); // Turnaround Time
            var cell9 = row.insertCell(9); // Wait Time
            cell0.innerHTML = process.getProcessState();
            cell1.innerHTML = process.getProgramCounter() + "";
            cell2.innerHTML = process.getAcc() + "";
            cell3.innerHTML = process.getXReg() + "";
            cell4.innerHTML = process.getYReg() + "";
            cell5.innerHTML = process.getZFlag() + "";
            cell6.innerHTML = process.getProcessID() + "";
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
