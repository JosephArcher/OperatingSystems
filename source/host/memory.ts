module TSOS {

	export class MemoryBlock {

		public bytes = [];

		constructor() {}

			public init () {

				for (var i = 0; i < 256; i++){
					this.bytes[i] = "null";
				}
		}

	}
}
