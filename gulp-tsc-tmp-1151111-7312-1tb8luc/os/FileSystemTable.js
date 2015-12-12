///<reference path="../globals.ts" />
///<reference path="processControlBlock.ts" />
/**
 * This class is used to represent the ProcessControlTable on the User Interface
 * This class provides methods to update the information about the current Process Control Block
 * and update the table as the process executes.
*/
var TSOS;
(function (TSOS) {
    var FileSystemTable = (function () {
        function FileSystemTable(tableElement) {
            this.table = tableElement;
        }
        FileSystemTable.prototype.numberOfRows = function () {
            var rows = this.table.rows.length;
            return rows;
        };
        FileSystemTable.prototype.setCellData = function (row, cell, data) {
            this.currentRow = this.table.rows.item(row);
            this.currentCell = this.currentRow.cells.item(cell);
            this.currentCell.innerHTML = data;
        };
        FileSystemTable.prototype.setFileName = function (row, value) {
            this.setCellData(row, 0, value);
        };
        FileSystemTable.prototype.setFileTrack = function (row, value) {
            this.setCellData(row, 1, value);
        };
        FileSystemTable.prototype.setFileSector = function (row, value) {
            this.setCellData(row, 2, value);
        };
        FileSystemTable.prototype.setFileBlock = function (row, value) {
            this.setCellData(row, 3, value);
        };
        FileSystemTable.prototype.setFileContenets = function (row, value) {
            this.setCellData(row, 4, value);
        };
        FileSystemTable.prototype.addRow = function (name, track, sector, block, contents) {
            var row = this.table.insertRow(this.numberOfRows());
            var cell0 = row.insertCell(0); // File Name
            var cell1 = row.insertCell(1); // Track
            var cell2 = row.insertCell(2); // Sector
            var cell3 = row.insertCell(3); // Block
            var cell4 = row.insertCell(4); // Contents
            cell0.innerHTML = name;
            cell1.innerHTML = track;
            cell2.innerHTML = sector;
            cell3.innerHTML = block;
            cell4.innerHTML = contents;
        };
        FileSystemTable.prototype.removeRow = function (rowNumber) {
            this.table.deleteRow(rowNumber);
        };
        FileSystemTable.prototype.clearTable = function () {
            for (var i = 1; i < this.numberOfRows(); i++) {
                this.removeRow(i);
            }
        };
        FileSystemTable.prototype.getFileName = function (rowNumber) {
            var row;
            row = this.table.rows.item(rowNumber);
            var cell0 = row.cells.item(0); // State
            console.log(cell0.innerHTML + " testasdfasdfasdfasdf");
            return cell0.innerHTML + "";
        };
        FileSystemTable.prototype.updateFileByName = function (filename, filedata) {
            // Initalize Variables
            var nextFileRowID;
            // Loop over each row in the table (offset by 1 to account for the heading)
            for (var i = 0; i < this.numberOfRows(); i++) {
                // Get the filename of the row 
                nextFileRowID = this.getFileName(i);
                console.log("Comparing:" + nextFileRowID + "        and        " + filename);
                // Compare the ID of the row to the ID of the process that is ending
                if (nextFileRowID == filename) {
                    // Update the File Data
                    var row = this.table.rows.item(i);
                    var cell4 = row.cells.item(4); // State
                    cell4.innerHTML = filedata;
                }
            }
        };
        FileSystemTable.prototype.removeFileByName = function (filename) {
            // Initalize Variables
            var nextFileRowID;
            // Loop over each row in the table (offset by 1 to account for the heading)
            for (var i = 0; i < this.numberOfRows(); i++) {
                // Get the filename of the row 
                nextFileRowID = this.getFileName(i);
                console.log("Comparing:" + nextFileRowID + "        and        " + filename);
                // Compare the ID of the row to the ID of the process that is ending
                if (nextFileRowID == filename) {
                    console.log("The file names match ");
                    // Remove the row that matches to show a process that is ending!
                    this.removeRow(i);
                }
            }
        };
        return FileSystemTable;
    })();
    TSOS.FileSystemTable = FileSystemTable;
})(TSOS || (TSOS = {}));
