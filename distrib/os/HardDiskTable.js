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
                this.addRow(i);
            }
        };
        HardDiskTable.prototype.clearTable = function () {
            for (var i = 0; i < 96; i++) {
                this.addRow(i);
            }
        };
        HardDiskTable.prototype.createTSBString = function (rowNumber) {
            var rowString = rowNumber + "";
            if (rowNumber < 10) {
                return "( 0 , 0 , " + rowNumber + " )";
            }
            if (rowNumber < 100) {
                return "( 0 , " + rowString.charAt(0) + " , " + rowString.charAt(1) + " )";
            }
            return "(  " + rowString.charAt(0) + " , " + rowString.charAt(1) + " , " + rowString.charAt(2) + " )";
        };
        HardDiskTable.prototype.addRow = function (rowNumber) {
            var row = this.table.insertRow(rowNumber + 1);
            var cell0 = row.insertCell(0);
            var cell1 = row.insertCell(1);
            var cell2 = row.insertCell(2);
            cell0.innerHTML = this.createTSBString(rowNumber);
            cell1.innerHTML = "0000";
            cell2.innerHTML = "0000000000000000000000000000000000000000000000000000000000000000";
        };
        /**
         * Sets the current cell at the given address to the given value
         * @Params Address {Number} - The address of the cell
         *         Data    {String} - The current data for the cell
        */
        HardDiskTable.prototype.setCellData = function (address, data) {
            this.currentRow = this.table.rows.item(this.getTableRowPosition(address));
            this.currentCell = this.currentRow.cells.item(this.getTableColumnPosition(address));
            this.currentCell.innerHTML = data;
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
