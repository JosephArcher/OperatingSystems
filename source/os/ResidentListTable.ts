///<reference path="../globals.ts" />
///<reference path="processControlBlock.ts" />

/**
 * This class is used to represent the ProcessControlTable on the User Interface
 * This class provides methods to update the information about the current Process Control Block
 * and update the table as the process executes.
*/

module TSOS {

	export class ResidentListTable {

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
		public numberOfRows():number {
			var rows: number = this.table.rows.length;
			console.log("number of rows: " + rows);
			return rows;
		}
		private setCellData(row: number, cell: number, data: string): void {

			this.currentRow = <HTMLTableRowElement>this.table.rows.item(row);
			this.currentCell = <HTMLTableCellElement>this.currentRow.cells.item(cell);

			this.currentCell.innerHTML = data;
		}
        public setProcessStateValue(value: string): void {
			this.setCellData(1, 0, value);
        }
       	public setProgramCounterValue(value: string): void {
			this.setCellData(1, 1, value);
       	}
       	public setAccumulatorValue(value: string): void {
			this.setCellData(1, 2, value);
       	}
		public setXRegisterValue(value: string): void {
			this.setCellData(1, 3, value);
		}
       	public setYRegisterValue(value: string): void {
			this.setCellData(1, 4, value);
		}
		public setZFlagValue(value: string): void {
			this.setCellData(1, 5, value);
		}
		public updateTableContents(): void {

			this.setProcessStateValue(PROCESS_STATE_TERMINATED);
			this.setProgramCounterValue(_CPU.PC + "");
			this.setXRegisterValue(_CPU.Xreg + "");
			this.setYRegisterValue(_CPU.Yreg + "");
			this.setAccumulatorValue(_CPU.Acc + "");
			this.setZFlagValue(_CPU.Zflag + "");
		}
		public clearTable(): void {
			this.setProcessStateValue("00");
			this.setProgramCounterValue("00");
			this.setXRegisterValue("00");
			this.setYRegisterValue("00");
			this.setAccumulatorValue("00");
			this.setZFlagValue("00");
		}
		public addNewProcess(newProcess: TSOS.ProcessControlBlock): void {
			console.log(this.table.rows.length + "ROWDSFSDFSDSF");
			this.addRow();
			

		}
		public addRow() {

			var row: HTMLTableRowElement = <HTMLTableRowElement>this.table.insertRow(this.numberOfRows() );

			var cell0 = row.insertCell(0);
			var cell1 = row.insertCell(1);
			var cell2 = row.insertCell(2);
			var cell3 = row.insertCell(3);
			var cell4 = row.insertCell(4);
			var cell5 = row.insertCell(5);


			cell0.innerHTML = "00";
			cell1.innerHTML = "00";
			cell2.innerHTML = "00";
			cell3.innerHTML = "00";
			cell4.innerHTML = "00";
			cell5.innerHTML = "00";


		}
		public removeRow(rowNumber: number): void {
			this.table.deleteRow(rowNumber);
		}
	}
}