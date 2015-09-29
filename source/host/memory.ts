module TSOS {

	export class MemoryBlock {

		public bytes = [];
		private counter: number = 0;

		constructor() {}

			public init () {

				this.counter = 0;

				for (var i = 0; i < 255; i++) {

					this.bytes[i] = null;
				}
		
		}
		public getLength(): number {

			return this.bytes.length;

		}
		public setByte(args): void{

			this.bytes[args[0]] = args[0];


		}
		public setNextByte(arg): void {

			
			var nextCharacter: string = arg[0];
			var nextBlock: string = this.bytes[this.counter];

			if(nextBlock == null) {
				console.log("null");
				this.bytes[this.counter] = nextCharacter;

			}
			else if(nextBlock.length < 2) {
				console.log("under 2");
				console.log(nextBlock.length + "length");
				this.bytes[this.counter] = nextBlock + nextCharacter;
				this.counter = this.counter + 1;
			}
			else {
				console.log("over 2");

				this.counter = this.counter + 1;
				this.bytes[this.counter] = nextBlock + nextCharacter;
			}

			

		}
		public getByte(arg): String {


			return this.bytes[arg];
		}
		public clearMemory(): void {

		}
		public nextOpen(): number {

			return this.counter;
		}

	}
}
