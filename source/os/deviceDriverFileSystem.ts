///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="deviceDriver.ts" />
///<reference path="canvastext.ts" />

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
         */
        public createFile(filename: string) {

        }
        /**
         * Used to read a file with the given file name
         */
        public readFile(filename: string) {

        }
        /**
         * Used to write the given file data to the given file name
         */
        public writeFile(fileData: string , filename: string){

        }
        /**
         * Used to delete a new file with the given file name
         */
        public deleteFile(filename: string) {

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
