/**
 * This class is used to represent the ProcessControlTable on the User Interface
 * This class provides methods to update the information about the current Process Control Block
 * and update the table as the process executes.
*/

module TSOS {

	export class ProcessControlBlockTable {

		public table: HTMLTableElement;

		/*	     
		* Row 0: PS - PC - A - XR - YR - ZF  
		* Row 1: +    +    +   +    +    +     
		*/

		private currentRow: HTMLTableRowElement;
		private currentCell: HTMLTableCellElement;
		
		public constructor (tableElement: HTMLTableElement) {
			this.table = tableElement;
		}
		private setCellData(row: number, cell: number, data: string): void {

			this.currentRow = <HTMLTableRowElement>   this.table.rows.item(row);
			this.currentCell = <HTMLTableCellElement> this.currentRow.cells.item(cell);

			this.currentCell.innerHTML = data;
		}
        public setProcessStateValue(value: string): void {
			this.setCellData(1, 0, value);
        }
       	public setProgramCounterValue(value: string): void{
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
		public clearTable() : void {
			this.setProcessStateValue("00");
			this.setProgramCounterValue( "00");
			this.setXRegisterValue( "00");
			this.setYRegisterValue("00");
			this.setAccumulatorValue( "00");
			this.setZFlagValue("00");
		}
	}
}