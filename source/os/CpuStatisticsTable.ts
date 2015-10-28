///<reference path="../globals.ts" />
///<reference path="../utils.ts" />

/**
	This class is used to alter the CPU Statistics Display Table
*/

module TSOS {

	export class CpuStatisticsTable {

		/*	     0     1   2   3     4   5
		* Row 0: PC - IR - A - XR - YR - ZF
		* Row 1: -------------------------
		*/

		public table: HTMLTableElement; // The Table Element 
		public programCounter;          
		public instructionRegistar;
		public Acccumlater;
		public xRegistrar;
		public yRegistrar;
		public zFlag;

		private currentRow:  HTMLTableRowElement;
		private currentCell: HTMLTableCellElement;

		public constructor (tableElement: HTMLTableElement) {
			this.table = tableElement;
		}
		/**
		 * Sets the program counter in the user display
		*/
		public setProgramCounter (value: string): void {

			this.currentRow = <HTMLTableRowElement> this.table.rows.item(1);
			this.currentCell = <HTMLTableCellElement> this.currentRow.cells.item(0);
			
			this.currentCell.innerHTML = value;

		}
		/**
		 * Sets the Instruction Register in the current display
		*/
		public setInstructionRegister(value: string): void {

			this.currentRow = <HTMLTableRowElement>this.table.rows.item(1);
			this.currentCell = <HTMLTableCellElement>this.currentRow.cells.item(1);
			
			this.currentCell.innerHTML = value;
		}
		/**
		 * Sets the Accumulator in the current display
		*/
		public setAccumulator(value: string): void {

			this.currentRow = <HTMLTableRowElement>this.table.rows.item(1);
			this.currentCell = <HTMLTableCellElement>this.currentRow.cells.item(2);

			this.currentCell.innerHTML = value;

		}
		/**
		 * Sets the X Register in the current display
		*/
		public setXRegister(value: string): void {

			this.currentRow = <HTMLTableRowElement>this.table.rows.item(1);
			this.currentCell = <HTMLTableCellElement>this.currentRow.cells.item(3);

			this.currentCell.innerHTML = value;

		}
		/**
		 * Sets the Y Register in the current display
		*/
		public setYRegister(value: string): void {

			this.currentRow = <HTMLTableRowElement>this.table.rows.item(1);
			this.currentCell = <HTMLTableCellElement>this.currentRow.cells.item(4);

			this.currentCell.innerHTML = value;

		}
		/**
		 * Sets the Z Flag in the current display
		*/
		public setZFlag(value: string): void {

			this.currentRow = <HTMLTableRowElement>this.table.rows.item(1);
			this.currentCell = <HTMLTableCellElement>this.currentRow.cells.item(5);

			this.currentCell.innerHTML = value;
		}		
		/**
		 * Updates the entire status bar with the values from the CPU	
		*/		 
		public updateStatusBar() {

			this.setProgramCounter(_CPU.PC + "");
			this.setInstructionRegister("0");
			this.setAccumulator(_CPU.Acc + "");
			this.setXRegister(_CPU.Xreg + "");
			this.setYRegister(_CPU.Yreg + "");
			this.setZFlag(_CPU.Zflag + "");
		}
	}
}
