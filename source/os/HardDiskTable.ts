///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
/**
 * This class is used to alter the Memory Information Display Table
*/

module TSOS {

	export class HardDiskTable {

		public table: HTMLTableElement;
		/*	     
		* Row 0: (T,S,B) - IN Use - Track - Sector - Block - FileName
		* Row 1: (T,S,B) - IN Use - Track - Sector - Block - FileData
		*/

		private currentRow: HTMLTableRowElement;
		private currentCell: HTMLTableCellElement;

		public constructor(tableElement: HTMLTableElement) {
			this.table = tableElement;
			this.fillRows();
		}
		public fillRows(): void {

			for (var i = 0; i < 378; i++) {
				this.addRow(i, "", "");
			}
		}
		public clearTable(): void {

			for (var i = 0; i < 378; i++) {
				this.table.deleteRow(1);
			}
		}

		public createTSBString(rowNumber: number):string {

			var rowString = rowNumber +  "";

			if(rowNumber < 10){

				return "( 0 , 0 , " + parseInt(rowString, 10)  + " )";
			}

			if(rowNumber < 100){
				return "( 0 , " + rowString.charAt(0) + " , " + rowString.charAt(1) + " )";
			}

			return "(  " + rowString.charAt(0) + " , " + rowString.charAt(1) + " , " + rowString.charAt(2) + " )";
		}
		public setCellData(row: number, cell: number, data: string): void {

			var currentRow = <HTMLTableRowElement>this.table.rows.item(row);
			var currentCell = <HTMLTableCellElement> currentRow.cells.item(cell);

			currentCell.innerHTML = data;
		}
		public addRow(rowNumber: number, rowHeader:string, rowData:string) {

			var row: HTMLTableRowElement = <HTMLTableRowElement>this.table.insertRow(rowNumber + 1);

			var cell0 = row.insertCell(0);
			var cell1 = row.insertCell(1);
			var cell2 = row.insertCell(2);


			cell0.innerHTML = this.createTSBString(rowNumber);
			cell1.innerHTML = rowHeader;
			cell2.innerHTML = rowData;

		}
		public updateRow(rowNumber: number, rowHeader: string, rowData: string) {

			this.setCellData(rowNumber + 1, 0, this.createTSBString(rowNumber));
			this.setCellData(rowNumber + 1, 1,rowHeader);
			this.setCellData(rowNumber + 1, 2, rowData);
		}
		public deleteRow(rowNumber:number){

			this.setCellData(rowNumber + 1, 0, this.createTSBString(rowNumber));
			this.setCellData(rowNumber + 1, 1, "----");
			this.setCellData(rowNumber + 1, 2, "--------------------------------------------------------------");
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
