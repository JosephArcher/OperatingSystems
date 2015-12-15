///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
/**
 * This class is used to alter the Memory Information Display Table
*/
var TSOS;
(function (TSOS) {
    var HardDiskTable = (function () {
        function HardDiskTable(tableElement) {
            this.table = tableElement;
            this.fillRows();
        }
        HardDiskTable.prototype.fillRows = function () {
            for (var i = 0; i < 378; i++) {
                this.addRow(i, "", "");
            }
        };
        HardDiskTable.prototype.clearTable = function () {
            for (var i = 0; i < 378; i++) {
                this.table.deleteRow(1);
            }
        };
        HardDiskTable.prototype.createTSBString = function (rowNumber) {
            var rowString = rowNumber + "";
            if (rowNumber < 10) {
                return "( 0 , 0 , " + parseInt(rowString, 10) + " )";
            }
            if (rowNumber < 100) {
                return "( 0 , " + rowString.charAt(0) + " , " + rowString.charAt(1) + " )";
            }
            return "(  " + rowString.charAt(0) + " , " + rowString.charAt(1) + " , " + rowString.charAt(2) + " )";
        };
        HardDiskTable.prototype.setCellData = function (row, cell, data) {
            var currentRow = this.table.rows.item(row);
            var currentCell = currentRow.cells.item(cell);
            currentCell.innerHTML = data;
        };
        HardDiskTable.prototype.addRow = function (rowNumber, rowHeader, rowData) {
            var row = this.table.insertRow(rowNumber + 1);
            var cell0 = row.insertCell(0);
            var cell1 = row.insertCell(1);
            var cell2 = row.insertCell(2);
            cell0.innerHTML = this.createTSBString(rowNumber);
            cell1.innerHTML = rowHeader;
            cell2.innerHTML = rowData;
        };
        HardDiskTable.prototype.updateRow = function (rowNumber, rowHeader, rowData) {
            this.setCellData(rowNumber + 1, 0, this.createTSBString(rowNumber));
            this.setCellData(rowNumber + 1, 1, rowHeader);
            this.setCellData(rowNumber + 1, 2, rowData);
        };
        HardDiskTable.prototype.deleteRow = function (rowNumber) {
            this.setCellData(rowNumber + 1, 0, this.createTSBString(rowNumber));
            this.setCellData(rowNumber + 1, 1, "----");
            this.setCellData(rowNumber + 1, 2, "--------------------------------------------------------------");
        };
        /**
         * Get the current row position for the given address
         * @Params Address {Number} - The address of the cell
         * @Return {Number} - The current row
        */
        HardDiskTable.prototype.getTableRowPosition = function (address) {
            var rowNumber = Math.floor(address / 8);
            return rowNumber + 1;
        };
        /**
         * Get the current column position for the given address
         * @Params Address {Number} - The address of the cell
         * @Return {Number} - The current cell
        */
        HardDiskTable.prototype.getTableColumnPosition = function (address) {
            var columnNumber = address % 8;
            return columnNumber;
        };
        return HardDiskTable;
    })();
    TSOS.HardDiskTable = HardDiskTable;
})(TSOS || (TSOS = {}));
