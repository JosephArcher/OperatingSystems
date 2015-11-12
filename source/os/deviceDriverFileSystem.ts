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
        public krnFSDriverEntry() {

            // Initialization File System Device Driver.
            this.status = "loaded";    
        }
        // Update the kernal with the status of File System Operations
        public krnFSOperationRespose () {

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
            var newFileName     = filename.trim();
            var newFileLocation = "C:\\" + newFileName;
            var newFileSize = "0 Bytes";

           // Check to see if the file name already exists 

            if (fileNameFound == false) {  // If the file name is not found

                // Create a new file 
                var newFile = new File(newFileName, newFileLocation, newFileSize);
                return true;
            }
            else {  // If the file name is found 
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

            // Initalize Variables
            var fileNameFound: boolean = this.filenameExists(filename);

            // First check to see if the file exists
          
            if (fileNameFound == true) { // If the files exists

                // Get the data from the file and return it to the user
                return true;

            }
            else { // If the file is not found
                // Return false
                return false;
            }

        }
        /**
         * Used to write <filedata> to a file with the given <Filename>
         * @Params filename <String> - The name of the file to write to 
         *         filedata <String> - The data to write to the file
         * @Returns         <True>   - If the file was successfully writen to
                            <False>  - If the file is not writen to
         */
        public writeFile(filedata: string , filename: string){

            // Initalize Variables
            var fileNameFound: boolean = this.filenameExists(filename);

            // First check to see if the file exists
          
            if (fileNameFound == true) { // If the files exists

                // Get the data from the file and return it to the user
                return true;

            }
            else { // If the file is not found
                // Return false
                return false;
            }

        }
        /**
         * Used to delete a file with the given <Filename>
         * @Params filename <String> - the name of the file to delete
         * @Returns         <True>  - If the file was successfully deleted
                            <False> - If the file is not deleted
         */
        public deleteFile(filename: string) {

            // Initalize Variables
            var fileNameFound: boolean = this.filenameExists(filename);

            // First check to see if the file exists
          
            if (fileNameFound == true) { // If the files exists

                // Get the data from the file and return it to the user
                return true;

            }
            else { // If the file is not found
                // Return false
                return false;
            }
        }
        /**
         * Used to check if a file name exists in the file system
         */
        public filenameExists(filename: string ): boolean {

            // Initalize the variables
            var fileList = [];
            var nextFile = null;

            // Get all the files in the file system
            fileList = this.getAllFiles();

            // Loop over the list comparing the name of the file to the given name
            for (var i = 0; i < fileList.length; i++) {

                // Get the next file in the list
                nextFile = fileList[i];

                // Compare that next files name to the given name
                if(filename == nextFile.getFileName() ) { // If the names match
                    // Return TRUE
                    return true;
                }

            }
            // If after looping no matching name was found return false
            return false;
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

    }
}
