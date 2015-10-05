/**
 * This class is used to alter the Memory Information Display Table
*/

module TSOS {

	export class MemoryInformationTable{

		public table: HTMLTableElement;
		/*	     
		* Row 0: 0 - 1 - 2 - 3 - 4 - 5 - 6 - 7
		* Row 1: +   +   +   +   +   +   +   +
		* Row 2: +   +   +   +   +   +   +   +
		*/

		private currentRow: HTMLTableRowElement;
		private currentCell: HTMLTableCellElement;

		public constructor(tableElement: HTMLTableElement) {
			this.table = tableElement;
		}
		/**
		 * Sets the current cell at the given address to the given value
		 * @Params Address {Number} - The address of the cell
		 *         Data    {String} - The current data for the cell
		*/
		public setCellData(address: number, data: string): void {

			this.currentRow = <HTMLTableRowElement> this.table.rows.item(this.getTableRowPosition(address));
			this.currentCell = <HTMLTableCellElement>this.currentRow.cells.item(this.getTableColumnPosition(address));

			this.currentCell.innerHTML = data;
		}
		/**
		 * Get the current row position for the given address
		 * @Params Address {Number} - The address of the cell
		 * @Return {Number} - The current row
		*/
		private getTableRowPosition(address: number): number {

			var rowNumber: number = Math.floor(address / 8);

			return rowNumber + 1;
        }
        /**
		 * Get the current column position for the given address
		 * @Params Address {Number} - The address of the cell
		 * @Return {Number} - The current cell
		*/
        private getTableColumnPosition(address: number): number {

			var columnNumber: number = address % 8;
			
			return columnNumber;
        }
	}
}
