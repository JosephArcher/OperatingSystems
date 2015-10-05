/**
 * This class is used to alter the Memory Information Display Table
*/
var TSOS;
(function (TSOS) {
    var MemoryInformationTable = (function () {
        function MemoryInformationTable(tableElement) {
            this.table = tableElement;
        }
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
