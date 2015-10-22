module TSOS {
	export class CpuScheduler{

		// The quantum the Scheduler will use 
		public quantum: number = 6;

		public needToSwap(arg:number): boolean {


			if( (arg % this.quantum) == 0){
				console.log("Need to swap cause quantum is over");
				return true;

			}
			else{
				return false;
				console.log("Quantum is not done yet");
			}
		}
		public getQuantum(): number {

			return this.quantum;
		}
		public setQuantum(newQuantum: number): void {

			this.quantum = newQuantum;
		}

	}
}