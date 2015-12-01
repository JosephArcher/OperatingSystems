module TSOS {

    // Extends DeviceDriver
    export class FileDirectory {

		public In_Use: number;
		public track: number;
		public sector: number;
		public block: number;
		public filename: string;

		public constructor(inuse: number , track: number, sector: number , block : number, filename: string ) {
			
			this.In_Use = inuse;
			this.track = track;
			this.sector = sector;
			this.block = block;
			this.filename = filename;
		}

		///////////////////////////////////////////////////////////////////////////////////////
		//                                                                                   //																				 //
		//                             GETTERS and SETTERS 									 //
		//																					 //
		///////////////////////////////////////////////////////////////////////////////////////

		public isFileInUse(): boolean {
			if (this.In_Use == 0) {
				return false;
			}
			else if(this.In_Use == 1){
				return true
			}
			else{
				return true;
			}
		}
		public getTrackLocation(): number {
			return this.track;
		}
		public getSectorLocation(): number {
			return this.sector;
		}
		public getBlockLocation(): number {
			return this.block;
		}
		public getFileName(): string {
			return this.filename;
		}
		public toString(): string {

			// Add the first half of the date to the return string 
			var testing = "[" + "{" + this.In_Use + "}" + "{" + this.track + "}" + "{" + this.sector + "}" + "{" + this.block + "}"; 
			var nextLetter = "";

			// Next loop over the file name and append each character onto the end of the string in its open {} 
			for (var i = 0; i < this.filename.length; i++){
				nextLetter = "{" + this.filename.charAt(i) + "}";
				testing = testing + nextLetter;
			}
			console.log(testing + "JOE THIS IS THE TEST");
			return testing;
		}
    }
}
