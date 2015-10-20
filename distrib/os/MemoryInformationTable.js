/**
 * This class is used to alter the Memory Information Display Table
*/
var TSOS;
(function (TSOS) {
    var MemoryInformationTable = (function () {
        function MemoryInformationTable(tableElement) {
            this.table = tableElement;
            this.fillRows();
        }
        MemoryInformationTable.prototype.fillRows = function () {
            for (var i = 0; i < 32; i++) {
                this.addRow(i);
            }
        };
        MemoryInformationTable.prototype.addRow = function (rowNumber) {
            var row = this.table.insertRow(rowNumber + 1);
            var cell0 = row.insertCell(0);
            var cell1 = row.insertCell(1);
            var cell2 = row.insertCell(2);
            var cell3 = row.insertCell(3);
            var cell4 = row.insertCell(4);
            var cell5 = row.insertCell(5);
            var cell6 = row.insertCell(6);
            var cell7 = row.insertCell(7);
            cell0.innerHTML = "00";
            cell1.innerHTML = "00";
            cell2.innerHTML = "00";
            cell3.innerHTML = "00";
            cell4.innerHTML = "00";
            cell5.innerHTML = "00";
            cell6.innerHTML = "00";
            cell7.innerHTML = "00";
        };
        /**
         * Sets the current cell at the given address to the given value
         * @Params Address {Number} - The address of the cell
         *         Data    {String} - The current data for the cell
        */
        MemoryInformationTable.prototype.setCellData = function (address, data) {
            this.currentRow = this.table.rows.item(this.getTableRowPosition(address));
            this.currentCell = this.currentRow.cells.item(this.getTableColumnPosition(address));
            this.currentCell.innerHTML = data;
        };
        /**
         * Get the current row position for the given address
         * @Params Address {Number} - The address of the cell
         * @Return {Number} - The current row
        */
        MemoryInformationTable.prototype.getTableRowPosition = function (address) {
            var rowNumber = Math.floor(address / 8);
            return rowNumber + 1;
        };
        /**
         * Get the current column position for the given address
         * @Params Address {Number} - The address of the cell
         * @Return {Number} - The current cell
        */
        MemoryInformationTable.prototype.getTableColumnPosition = function (address) {
            var columnNumber = address % 8;
            return columnNumber;
        };
        return MemoryInformationTable;
    })();
    TSOS.MemoryInformationTable = MemoryInformationTable;
})(TSOS || (TSOS = {}));
