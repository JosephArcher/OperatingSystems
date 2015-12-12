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
            //console.log("number of rows: " + rows);
            return rows;
        };
        ReadyQueueTable.prototype.setCellData = function (row, cell, data) {
            this.currentRow = this.table.rows.item(row);
            this.currentCell = this.currentRow.cells.item(cell);
            this.currentCell.innerHTML = data;
        };
        ReadyQueueTable.prototype.setProcessStateValue = function (row, value) {
            this.setCellData(row, 0, value);
        };
        ReadyQueueTable.prototype.setProgramCounterValue = function (row, value) {
            this.setCellData(row, 1, value);
        };
        ReadyQueueTable.prototype.setAccumulatorValue = function (row, value) {
            this.setCellData(row, 2, value);
        };
        ReadyQueueTable.prototype.setXRegisterValue = function (row, value) {
            this.setCellData(row, 3, value);
        };
        ReadyQueueTable.prototype.setYRegisterValue = function (row, value) {
            this.setCellData(row, 4, value);
        };
        ReadyQueueTable.prototype.setZFlagValue = function (row, value) {
            this.setCellData(row, 5, value);
        };
        ReadyQueueTable.prototype.getProcessID = function (row) {
            var processID = 0;
            var test = this.table.rows.item(row);
            var nextTablePID = test.cells.item(0);
            var output = parseInt(nextTablePID.innerHTML, 16);
            //console.log(output + " Joe this is the table output");
            return output;
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
        ReadyQueueTable.prototype.addNewProcess = function (newProcess) {
            //	console.log(this.table.rows.length + "ROWDSFSDFSDSF");
            this.addRow(newProcess);
        };
        ReadyQueueTable.prototype.addRow = function (process) {
            var row = this.table.insertRow(this.numberOfRows());
            var cell0 = row.insertCell(0); // PID
            var cell1 = row.insertCell(1); // LOC
            var cell2 = row.insertCell(2); // State
            var cell3 = row.insertCell(3); // PC
            var cell4 = row.insertCell(4); // ACC
            var cell5 = row.insertCell(5); // X
            var cell6 = row.insertCell(6); // y
            var cell7 = row.insertCell(7); // z
            var cell8 = row.insertCell(8); // base
            var cell9 = row.insertCell(9); // turn
            var cell10 = row.insertCell(10); // wait
            cell0.innerHTML = process.getProcessID() + "";
            cell1.innerHTML = process.location + "";
            cell2.innerHTML = process.getProcessState() + "";
            cell3.innerHTML = process.getProgramCounter() + "";
            cell4.innerHTML = process.getAcc() + "";
            cell5.innerHTML = process.getXReg() + "";
            cell6.innerHTML = process.getYReg() + "";
            cell7.innerHTML = process.getZFlag() + "";
            cell8.innerHTML = process.getBaseReg() + "";
            cell9.innerHTML = process.getTurnAroundTime() + "";
            cell10.innerHTML = process.getWaitTime() + "";
        };
        ReadyQueueTable.prototype.removeRow = function (rowNumber) {
            this.table.deleteRow(rowNumber);
        };
        ReadyQueueTable.prototype.clearTable = function () {
            for (var i = 1; i < this.numberOfRows(); i++) {
                this.removeRow(i);
            }
        };
        ReadyQueueTable.prototype.updateProcessById = function (process) {
            // Initalize Variables
            var nextProcessRowID;
            var theProcessID = process.getProcessID();
            var row;
            // If at least one process exists in the ready queue
            if (_ReadyQueue.getSize() > 0) {
                // Loop over each row in the table (offset by 1 to account for the heading)
                for (var i = 0; i < this.numberOfRows(); i++) {
                    // Get the ID of the row 
                    nextProcessRowID = this.getProcessID(i);
                    // Compare the ID of the row to the ID of the process that is ending
                    if (nextProcessRowID == theProcessID) {
                        //	console.log("The Process ID matches one in the current table! UPDATING RIGHT NOW BB");
                        // Get the row that matches in order to update its contents
                        row = this.table.rows.item(i);
                        var cell0 = row.cells.item(0); // PID
                        var cell1 = row.cells.item(1); // LOC
                        var cell2 = row.cells.item(2); // State
                        var cell3 = row.cells.item(3); // PC
                        var cell4 = row.cells.item(4); // ACC
                        var cell5 = row.cells.item(5); // X
                        var cell6 = row.cells.item(6); // y
                        var cell7 = row.cells.item(7); // z
                        var cell8 = row.cells.item(8); // base
                        var cell9 = row.cells.item(9); // turn
                        var cell10 = row.cells.item(10); // wait
                        cell0.innerHTML = process.getProcessID() + "";
                        cell1.innerHTML = process.location + "";
                        cell2.innerHTML = process.getProcessState() + "";
                        cell3.innerHTML = process.getProgramCounter() + "";
                        cell4.innerHTML = process.getAcc() + "";
                        cell5.innerHTML = process.getXReg() + "";
                        cell6.innerHTML = process.getYReg() + "";
                        cell7.innerHTML = process.getZFlag() + "";
                        cell8.innerHTML = process.getBaseReg() + "";
                        cell9.innerHTML = process.getTurnAroundTime() + "";
                        cell10.innerHTML = process.getWaitTime() + "";
                    }
                }
            }
        };
        ReadyQueueTable.prototype.removeProcessById = function (process) {
            // Initalize Variables
            var nextProcessRowID;
            var theProcessID = process.getProcessID();
            // If at least one process exists in the ready queue
            if (_ReadyQueue.getSize() > 0 || _CPUScheduler.getCurrentProcess() != null) {
                // Loop over each row in the table (offset by 1 to account for the heading)
                for (var i = 0; i < this.numberOfRows(); i++) {
                    // Get the ID of the row 
                    nextProcessRowID = this.getProcessID(i);
                    // Compare the ID of the row to the ID of the process that is ending
                    if (nextProcessRowID == theProcessID) {
                        //	console.log("THe Process ID matches one in the current table ! fuck yes");
                        // Remove the row that matches to show a process that is ending!
                        this.removeRow(i);
                    }
                }
            }
            else {
            }
        };
        return ReadyQueueTable;
    })();
    TSOS.ReadyQueueTable = ReadyQueueTable;
})(TSOS || (TSOS = {}));
