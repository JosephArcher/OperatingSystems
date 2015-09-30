///<reference path="../globals.ts" />
///<reference path="byte.ts" />

module TSOS {

	export class MemoryBlock {

		public block: any = [];
		private counter: number = 0;

		constructor() {}

			public init () {

				this.counter = 0;
				
				for (var i = 0; i < 255; i++) {

					this.block[i] = new Byte(i);
				}		
		}
		public getLength(): number {

			return this.block.length;

		}
		public setByte(args): void{

			this.block[args[0]] = args[0];


		}
		public setNextByte(arg): void {

			
			var nextCharacter: string = arg[0];
			var nextBlock: string = this.block[this.counter];

			if(nextBlock.length == 0 ) {
			
				this.block[this.counter] = nextCharacter;

			}
			else if(nextBlock.length == 1) {
				
				//console.log(nextBlock.length + "length");
				this.block[this.counter] = nextBlock + nextCharacter;
				this.counter = this.counter + 1;
			}
			else {
				console.log("over 2");

				this.counter = this.counter + 1;
				this.block[this.counter] = nextBlock + nextCharacter;
			}

			

		}
		public getByte(arg): String {


			return this.block[arg];
		}
		public clearMemory(): void {

		}

	}
}
