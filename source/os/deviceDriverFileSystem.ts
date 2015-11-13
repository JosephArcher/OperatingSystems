///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="deviceDriver.ts" />
///<reference path="canvastext.ts" />
///<reference path="File.ts" />

/* ----------------------------------
   DeviceDriverFileSystem.ts

   Requires deviceDriver.ts

   The Kernel File System Driver
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverFileSystem extends DeviceDriver {


        
       public  constructor() {
           super(this.krnFSDriverEntry, this.krnFSOperationRespose);
       }
       public formatHardDisk() {

          var tracks: number = 4;
          var sectors: number = 8;
          var blocks: number = 8;

          var nextStorageLocation = "";
          // Loop and initalize the session storage
          for (var i = 0; i < tracks; i++) {
              for (var j = 0; j < sectors; j++) {
                   for (var k = 0; k < blocks; k++) {
                       nextStorageLocation = i.toString() + j.toString() + k.toString();
                       console.log(nextStorageLocation + "storage Location");
                       sessionStorage.setItem(nextStorageLocation, "00");
                   }
               }
           }
       }
       public getNextAvailableMemoryLocation() {

       }
       public krnFSDriverEntry() {

            // Initialization File System Device Driver.
            this.status = "loaded";    
        }
        // Update the kernal with the status of File System Operations
        public krnFSOperationRespose(args){
            var operation: string = args[0];
            var data1: string = args[1];
            var data2: string = args[2];

            switch (operation) {
                case CREATE_FILE:
                    this.createFile(data1);
                    break;
                case READ_FILE:
                    this.readFile(data1);
                    break;
                case WRITE_FILE:
                    this.writeFile(data1 , data2);
                    break;
                case DELETE_FILE:
                    this.deleteFile(data1);
                    break;
                case LIST_FILES:
                    this.listFiles();
                    break;
                case FORMAT_DRIVE:
                    this.formatHardDisk();
                    break;
               default:
                    break;
            }
        }
        /**
         * Used to create a new file with the given file name
         * @Params filename <String> - the name for the new file
         * @Returns        <True>  - If the file is successfully created
                           <False> - If the file is not created
         */
        public createFile(filename: string): boolean {

           // First check to see if the file name already exists in the file system
           var fileNameFound: boolean = this.filenameExists(filename);

            // Create the properties for the new file
            var newFileName = filename;
            var newFileLocation = "C:\\" + newFileName;
            var newFileSize = "0 Bytes";

            // If the file name is not found
            if(fileNameFound == false) {  

                // Create a new file 
                var newFile: TSOS.File = new File(newFileName, newFileLocation, newFileSize);

                // Store it in the session storage disk drive
                sessionStorage.setItem(newFile.getFilename(), newFile.getFilename());

                // Report to the user that the creation was successful
                _StdOut.putText("Success: The file was created"); 

                // Advance the line in the console
                _Console.advanceLine();

                // Place the prompt
                _OsShell.putPrompt();
                return true;
            }
            else {  // If the file name is found
                _StdOut.putText("Error: The filename already exists "); 

                // Advance the line
                _Console.advanceLine();

                // Place the prompt
                _OsShell.putPrompt();

                return false;
            }

        }
        /**
         * Used to read a file with the given file name
         * @Params filename <String> - the name of the file tp read frp,
         * @Returns         <True>  - If the file was successfully read
                            <False> - If the file is not read
         */
        public readFile(filename: string) {

            // First check to see if the file name already exists in the file system
            var fileNameFound: boolean = this.filenameExists(filename);

            // First check to see if the file name already exists

            if (fileNameFound == false) {  // If the file name is not found

                _StdOut.putText("Read Error: The file name does not exist "); 

                // Advance line
                _Console.advanceLine();

                // Place the prompt
                _OsShell.putPrompt();

                return false;
            }
            else { // If the file was found

                _StdOut.putText("Read Successful ");

                // Advance
                _Console.advanceLine();

                // Place the prompt
                _OsShell.putPrompt();

               
                return true;
            }

        }
        /**
         * Used to write <filedata> to a file with the given <Filename>
         * @Params filename <String> - The name of the file to write to 
         *         filedata <String> - The data to write to the file
         * @Returns         <True>   - If the file was successfully writen to
                            <False>  - If the file is not writen to
         */
        public writeFile(filename: string, filedata){

            // First check to see if the file name already exists in the file system
            var fileNameFound: boolean = this.filenameExists(filename);

            // First check to see if the file name already exists
            if (fileNameFound == false) {  // If the file name is not found

                // Tell the user
                _StdOut.putText("Write Error: The file name does not exist ");

                // Advance the line
                _Console.advanceLine();

                // Place the prompt
                _OsShell.putPrompt();

                return false;
            }
            else { // If the file was found

                // Tell the user
                _StdOut.putText("Write Successful ");

                // Advance the line
                _Console.advanceLine();

                // Place the prompt
                _OsShell.putPrompt();


                return true;
            }

        }
        /**
         * Used to delete a file with the given <Filename>
         * @Params filename <String> - the name of the file to delete
         * @Returns         <True>  - If the file was successfully deleted
                            <False> - If the file is not deleted
         */
        public deleteFile(filename: string) {

            // First check to see if the file name already exists in the file system
            var fileNameFound: boolean = this.filenameExists(filename);

            // First check to see if the file name already exists
            if (fileNameFound == false) {  // If the file name is not found

                // Tell the user
                _StdOut.putText("Delete Error: The file name does not exist ");

                // Advance the line
                _Console.advanceLine();

                // Place the prompt
                _OsShell.putPrompt();

                return false;
            }
            else { // If the file was found

                sessionStorage.removeItem(filename);
                // Tell the user
                _StdOut.putText("Delete Successful ");

                // Advance the line
                _Console.advanceLine();

                // Place the prompt
                _OsShell.putPrompt();


                return true;
            }
        }
        /**
         * Used to check if a file name exists in the file system
         */
        public filenameExists(filename: string ): boolean {
            
            // Check to see if the file name is in stored in the session storage
            var fileExists = sessionStorage.getItem(filename);

            // If the file exists
            if (fileExists != null) { 
                // Return true
                return true;
            }
            // If file does not exist
            else { 
                // Return false
                return false;
            }
        }
        /**
         * Checks to see if the given file name already exists in the file system
         */
        public listFiles() {

            // Initlize Variables
            var fileList = [];

            // Find all the files in the File System and add them into the arrary

            // Return file list
            return fileList;
        }

        public getAllFiles() {
            // Initlize Variables
            var fileList = [];

            // Find all the files in the File System and add them into the arrary

            // Return file list
            return fileList;
        }
       // public findNextAvailableMemoryBlock(): string {

        //}

    }
}
