///<reference path="../globals.ts" />
///<reference path="processControlBlock.ts" />

/**
 * This class is used to represent the ProcessControlTable on the User Interface
 * This class provides methods to update the information about the current Process Control Block
 * and update the table as the process executes.
*/

module TSOS {

	export class FileSystemTable {

		public table: HTMLTableElement;

		/*	     
		* Row 0: PS - PC - A - XR - YR - ZF  
		* Row 1: +    +    +   +    +    +     
		*/

		private currentRow: HTMLTableRowElement;
		private currentCell: HTMLTableCellElement;

		public constructor(tableElement: HTMLTableElement) {
			this.table = tableElement;
		}
		public numberOfRows(): number {
			var rows: number = this.table.rows.length;
			return rows;
		}
		private setCellData(row: number, cell: number, data: string): void {

			this.currentRow = <HTMLTableRowElement>this.table.rows.item(row);
			this.currentCell = <HTMLTableCellElement>this.currentRow.cells.item(cell);

			this.currentCell.innerHTML = data;
		}
        public setFileName(row: number, value: string): void {
			this.setCellData(row, 0, value);
        }
       	public setFileTrack(row: number, value: string): void {
			this.setCellData(row, 1, value);
       	}
		public setFileSector(row: number, value: string): void {
			this.setCellData(row, 2, value);
       	}
		public setFileBlock(row: number, value: string): void {
			this.setCellData(row, 3, value);
		}
       	public setFileContenets(row: number, value: string): void {
			this.setCellData(row, 4, value);
		}
		public addRow(name: string, track: string, sector:string, block:string, contents:string) {

			var row: HTMLTableRowElement = <HTMLTableRowElement>this.table.insertRow(this.numberOfRows());

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
			
		}
		public removeRow(rowNumber: number): void {
			this.table.deleteRow(rowNumber);
		}
		public clearTable(): void {
			for (var i = 1; i < this.numberOfRows(); i++) {
				this.removeRow(i);
			}
		}
		public getFileName(rowNumber: number): string {
			var row: HTMLTableRowElement;
			row = <HTMLTableRowElement>this.table.rows.item(rowNumber);

			var cell0 = <HTMLTableCellElement>row.cells.item(0); // State
			console.log(cell0.innerHTML + " testasdfasdfasdfasdf");
			return cell0.innerHTML + "";

		}
		public updateFileByName(filename: string, filedata:string) {

			// Initalize Variables
			var nextFileRowID: string;

			// Loop over each row in the table (offset by 1 to account for the heading)
			for (var i = 0; i < this.numberOfRows(); i++) {

				// Get the filename of the row 
				nextFileRowID = this.getFileName(i);
				console.log("Comparing:" + nextFileRowID + "        and        " + filename);
				// Compare the ID of the row to the ID of the process that is ending
				if (nextFileRowID == filename) {

					// Update the File Data
					var	row = <HTMLTableRowElement>this.table.rows.item(i);
					var cell4 = <HTMLTableCellElement>row.cells.item(4); // State
					cell4.innerHTML = filedata;

				}
			}
		}
		public removeFileByName(filename: string) {

			// Initalize Variables
			var nextFileRowID: string;

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
		
		}
	}
}