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
			this.fillRows();		
		}
		public fillRows(): void{
		
			for (var i = 0; i < 96; i++){
				this.addRow(i);
			}
		}
		public clearTable(): void{
			for (var i = 0; i < 96; i++){
				this.addRow(i);
			}
		}
		public addRow(rowNumber: number) {

			var row: HTMLTableRowElement = <HTMLTableRowElement> this.table.insertRow(rowNumber + 1);

			var cell0 = row.insertCell(0);
			var cell1 = row.insertCell(1);
			var cell2 = row.insertCell(2);
			var cell3 = row.insertCell(3);
			var cell4 = row.insertCell(4);
			var cell5 = row.insertCell(5);
			var cell6= row.insertCell(6);
			var cell7 = row.insertCell(7);

			cell0.innerHTML = "00";
			cell1.innerHTML = "00";
			cell2.innerHTML = "00";
			cell3.innerHTML = "00";
			cell4.innerHTML = "00";
			cell5.innerHTML = "00";
			cell6.innerHTML = "00";
			cell7.innerHTML = "00";
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
