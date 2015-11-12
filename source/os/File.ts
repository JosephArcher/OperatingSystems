///<reference path="../utils.ts" />


/* ------------
     File.ts
   ------------ */

module TSOS {

    export class File {

		public Name: string = "";
		public Location: string = "";
		public Size: string = "";
		public Created: string = "";
		public ReadOnly: boolean = false;
		public Hidden: boolean = false;
		public Data: string = "";

		public constructor(filename: string , fileLocation: string , fileSize: string) {

			this.Name = filename;
			this.Location = fileLocation;
			this.Size = fileSize;
			this.Created = Utils.getDate() + Utils.getTime();
		}
		public getFilename(): string {
			return this.Name;	
		}
		public getFileLocation(): string {
			return this.Location;
		}
		public getFileSize(): string {
			return this.Size;
		}
		public getCreationTime(): string {
			return this.Created;
		}
		public isReadyOnly(): boolean {
			return this.ReadOnly;
		}
		public isHidden(): boolean {
			return this.Hidden;
		}
		public writeToFile(data: string){
			this.Data = this.Data + data;
		}
		public readFromFile(): string {
			return this.Data;
		}
		public setReadyOnly(mode: boolean){
			this.ReadOnly = mode;
		}
		public setHidden(mode: boolean){
			this.Hidden = mode;			
		}
    }
}
