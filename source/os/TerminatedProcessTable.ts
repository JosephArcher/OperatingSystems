///<reference path="../globals.ts" />
///<reference path="processControlBlock.ts" />

/**
 * This class is used to represent the ProcessControlTable on the User Interface
 * This class provides methods to update the information about the current Process Control Block
 * and update the table as the process executes.
*/

module TSOS {

	export class TerminatedProcessTable {

		public table: HTMLTableElement;

		/*	     
		* Row 0: PS - PC - A - XR - YR - ZF - Turnaround - Wait
		* Row 1: +    +    +   +    +    +  -    +       -  + 
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
        public setProcessStateValue(row: number, value: string): void {
			this.setCellData(row, 0, value);
        }
       	public setProgramCounterValue(row: number, value: string): void {
			this.setCellData(row, 1, value);
       	}
		public setAccumulatorValue(row: number, value: string): void {
			this.setCellData(row, 2, value);
       	}
		public setXRegisterValue(row: number, value: string): void {
			this.setCellData(row, 3, value);
		}
       	public setYRegisterValue(row: number, value: string): void {
			this.setCellData(row, 4, value);
		}
		public setZFlagValue(row: number, value: string): void {
			this.setCellData(row, 5, value);
		}
		public getProcessID(row: number): number {

			var processID: number = 0;

			var test = <HTMLTableRowElement>this.table.rows.item(row);

			var nextTablePID = <HTMLTableCellElement>test.cells.item(6);

			var output: number = parseInt(nextTablePID.innerHTML, 16);

			return output;
		} 
		public clearTable(): void {
			for (var i = 1; i < this.numberOfRows(); i++) {
				this.removeRow(i);
			}
		}
		public addRow(process: TSOS.ProcessControlBlock) {

			var row: HTMLTableRowElement = <HTMLTableRowElement>this.table.insertRow(this.numberOfRows());

			var cell0 = row.insertCell(0); // PID
			var cell1 = row.insertCell(1); // State
			var cell2 = row.insertCell(2); // PC
			var cell3 = row.insertCell(3); // ACC
			var cell4 = row.insertCell(4); // X
			var cell5 = row.insertCell(5); // Y
			var cell6 = row.insertCell(6); // Z
			var cell7 = row.insertCell(7); // Base
			var cell8 = row.insertCell(8); // Turn
			var cell9 = row.insertCell(9); // Wait

			cell0.innerHTML = process.getProcessID() + "";
			cell1.innerHTML = process.getProcessState() + "";
			cell2.innerHTML = process.getProgramCounter() + "";
			cell3.innerHTML = process.getAcc() + "";
			cell4.innerHTML = process.getXReg() + "";
			cell5.innerHTML = process.getYReg() + "";
			cell6.innerHTML = process.getZFlag() + "";
			cell7.innerHTML = process.getBaseReg() + "";
			cell8.innerHTML = process.getTurnAroundTime() + "";
			cell9.innerHTML = process.getWaitTime() + "";
		}
		public removeRow(rowNumber: number): void {
			this.table.deleteRow(rowNumber);
		}
	}
}