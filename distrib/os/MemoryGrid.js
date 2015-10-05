var TSOS;
(function (TSOS) {
    var MemoryGrid = (function () {
        function MemoryGrid(tableElement) {
            this.table = tableElement;
        }
        MemoryGrid.prototype.setCellData = function (address, data) {
            this.currentRow = this.table.rows.item(this.getTableRowPosition(address));
            this.currentCell = this.currentRow.cells.item(this.getTableColumnPosition(address));
            this.currentCell.innerHTML = data;
        };
        MemoryGrid.prototype.getTableRowPosition = function (address) {
            var rowNumber = Math.floor(address / 8);
            return rowNumber + 1;
        };
        MemoryGrid.prototype.getTableColumnPosition = function (address) {
            var columnNumber = address % 8;
            return columnNumber;
        };
        return MemoryGrid;
    })();
    TSOS.MemoryGrid = MemoryGrid;
})(TSOS || (TSOS = {}));
