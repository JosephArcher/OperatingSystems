///<reference path="../utils.ts" />


/* ------------
     File.ts
   ------------ */

module TSOS {

    export class File {

		public Name: string = "";          // The File name
		public Indentifier: string = "";   // The ID for the file 
		public Type: string = "";          // The type of file 
		public Location: string = "";      // This information is a pointer to a device and to the location of the file on that device
		public Size: string = "";          // The size of the file
		public TimeCreated: string = "";   // The time the file was created
		public DateCreated: string = "";   // The day the file was first created
		public ReadOnly: boolean = false;  // If the file is able to be written to
		public Hidden: boolean = false;    // If the file should be shown 

		public constructor(filename: string , fileLocation: string , fileSize: string) {

			this.Name = filename;               
			this.Location = fileLocation;
			this.Size = fileSize;
			this.TimeCreated = Utils.getTime();
			this.DateCreated = Utils.getDate();

		}

		///////////////////////////////////////////////////////////////////////////////////////
		//                                                                                   //
		//																					 //
		//                           GETTERS and SETTERS 									 //
		//																					 //
		///////////////////////////////////////////////////////////////////////////////////////

		public getFilename(): string {
			return this.Name;	
		}
		public getFileLocation(): string {
			return this.Location;
		}
		public getFileSize(): string {
			return this.Size;
		}
		public getTimeCreated(): string {
			return this.TimeCreated;
		}
		public getDateCreated(): string {
			return this.DateCreated;
		}
		public isReadyOnly(): boolean {
			return this.ReadOnly;
		}
		public isHidden(): boolean {
			return this.Hidden;
		}
		public setReadyOnly(mode: boolean) {
			this.ReadOnly = mode;
		}
		public setHidden(mode: boolean) {
			this.Hidden = mode;
		}
		
    }
}
