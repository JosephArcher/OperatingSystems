///<reference path="../globals.ts" />
///<reference path="processControlBlock.ts" />

/**
 * This class is used to represent the ProcessControlTable on the User Interface
 * This class provides methods to update the information about the current Process Control Block
 * and update the table as the process executes.
*/

module TSOS {

	export class ReadyQueueTable {

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
			console.log("number of rows: " + rows);
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

			console.log(output + " Joe this is the table output");

			return output;
		}
		// public updateTableContents(): void {

		// 	this.setProcessStateValue(PROCESS_STATE_TERMINATED);
		// 	this.setProgramCounterValue(_CPU.PC + "");
		// 	this.setXRegisterValue(_CPU.Xreg + "");
		// 	this.setYRegisterValue(_CPU.Yreg + "");
		// 	this.setAccumulatorValue(_CPU.Acc + "");
		// 	this.setZFlagValue(_CPU.Zflag + "");
		// }
		// public clearTable(): void {

		// 	this.setProcessStateValue("00");
		// 	this.setProgramCounterValue("00");
		// 	this.setXRegisterValue("00");
		// 	this.setYRegisterValue("00");
		// 	this.setAccumulatorValue("00");
		// 	this.setZFlagValue("00");
		// }
		public addNewProcess(newProcess: TSOS.ProcessControlBlock): void {
			console.log(this.table.rows.length + "ROWDSFSDFSDSF");
			this.addRow(newProcess);


		}
		public addRow(process: TSOS.ProcessControlBlock) {

			var row: HTMLTableRowElement = <HTMLTableRowElement>this.table.insertRow(this.numberOfRows());

			var cell0 = row.insertCell(0); // State
			var cell1 = row.insertCell(1); // PC
			var cell2 = row.insertCell(2); // ACC
			var cell3 = row.insertCell(3); // X
			var cell4 = row.insertCell(4); // Y
			var cell5 = row.insertCell(5); // Z
			var cell6 = row.insertCell(6); // PID
			var cell7 = row.insertCell(7); // Base
			var cell8 = row.insertCell(8); // Turn Around Time
			var cell9 = row.insertCell(9); // Wait Time
	
			cell0.innerHTML = process.getProcessState();
			cell1.innerHTML = process.getProgramCounter() + "";
			cell2.innerHTML = process.getAcc() + "";
			cell3.innerHTML = process.getXReg() + "";
			cell4.innerHTML = process.getYReg() + "";
			cell5.innerHTML = process.getZFlag() + "";
			cell6.innerHTML = process.getProcessID() + "";
			cell7.innerHTML = process.getBaseReg() + "";
			cell8.innerHTML = process.getTurnAroundTime() + "";
			cell9.innerHTML = process.getWaitTime() + "";

		}
		public removeRow(rowNumber: number): void {
			this.table.deleteRow(rowNumber);
		}
		public clearTable(): void {
			for (var i = 1; i < this.numberOfRows(); i++){
				this.removeRow(i);
			}
		}
		public updateProcessById(process: TSOS.ProcessControlBlock) {

			// Initalize Variables
			var nextProcessRowID: number;
			var theProcessID: number = process.getProcessID();
			var row: HTMLTableRowElement;

			// If at least one process exists in the ready queue
			if (_ReadyQueue.getSize() > 0) {
				// Loop over each row in the table (offset by 1 to account for the heading)
				for (var i = 0; i < this.numberOfRows(); i++) {

					// Get the ID of the row 
					nextProcessRowID = this.getProcessID(i);

					// Compare the ID of the row to the ID of the process that is ending
					if (nextProcessRowID == theProcessID) {
						console.log("The Process ID matches one in the current table! UPDATING RIGHT NOW BB");
						// Get the row that matches in order to update its contents
						row = <HTMLTableRowElement>this.table.rows.item(i);

						var cell0 = <HTMLTableCellElement>row.cells.item(0); // State
						var cell1 = <HTMLTableCellElement>row.cells.item(1); // PC
						var cell2 = <HTMLTableCellElement>row.cells.item(2); // ACC
						var cell3 = <HTMLTableCellElement>row.cells.item(3); // X
						var cell4 = <HTMLTableCellElement>row.cells.item(4); // Y
						var cell5 = <HTMLTableCellElement>row.cells.item(5); // Z
						var cell6 = <HTMLTableCellElement>row.cells.item(6); // PID
						var cell7 = <HTMLTableCellElement>row.cells.item(7); // Base
						var cell8 = <HTMLTableCellElement>row.cells.item(8); // PID
						var cell9 = <HTMLTableCellElement>row.cells.item(9); // Base

						cell0.innerHTML = process.getProcessState();
						cell1.innerHTML = process.getProgramCounter() + "";
						cell2.innerHTML = process.getAcc() + "";
						cell3.innerHTML = process.getXReg() + "";
						cell4.innerHTML = process.getYReg() + "";
						cell5.innerHTML = process.getZFlag() + "";
						cell6.innerHTML = process.getProcessID() + "";
						cell7.innerHTML = process.getBaseReg() + "";
						cell8.innerHTML = process.getTurnAroundTime() + "";
						cell9.innerHTML = process.getWaitTime() + "";


					}
				}
			}
		}
		public removeProcessById(process: TSOS.ProcessControlBlock) {

			// Initalize Variables
			var nextProcessRowID: number;
			var theProcessID: number = process.getProcessID();

			// If at least one process exists in the ready queue
			if (_ReadyQueue.getSize() > 0 || _CPUScheduler.getCurrentProcess() != null) {
				// Loop over each row in the table (offset by 1 to account for the heading)
				for (var i = 0; i < this.numberOfRows(); i++) {

					// Get the ID of the row 
					nextProcessRowID = this.getProcessID(i);

					// Compare the ID of the row to the ID of the process that is ending
					if (nextProcessRowID == theProcessID) {
						console.log("THe Process ID matches one in the current table ! fuck yes");
						// Remove the row that matches to show a process that is ending!
						this.removeRow(i);
					}
				}
			}
			else{
				console.log("topkek123");
			}
		}
	}
}