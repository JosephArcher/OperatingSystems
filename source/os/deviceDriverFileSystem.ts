///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="deviceDriver.ts" />
///<reference path="canvastext.ts" />
///<reference path="File.ts" />
///<reference path="FileDirectoryObject.ts" />

/* ----------------------------------
   DeviceDriverFileSystem.ts

   Requires deviceDriver.ts

   The Kernel File System Driver
   ---------------------------------- */


   /**


T S B  | [0-1] T S B  | FileName
0 0 0  | MASTA BOOT RECORD
0 0 1  | Start of DIR
X X X  |
0 7 7  |
   */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverFileSystem extends DeviceDriver {

       public  constructor() {
           super(this.krnFSDriverEntry, this.krnFSOperationRespose);
       }
       /**
        * Used to format the hard disk from 0 0 0 -> 3 3 7
        *
        */
       public formatHardDisk() {

          _DiskIsFormated = true;

          var tracks: number = 4;
          var sectors: number = 8;
          var blocks: number = 8;

          var nextStorageLocation = "";
          var testFile = new File("afsd", "asdf", "asdf");
          // Loop and initalize the session storage

           // For every track
          for (var i = 0; i < tracks; i++) {
              // For every sector
              for (var j = 0; j < sectors; j++) {
                  // A block is chilling out
                   for (var k = 0; k < blocks; k++) {
                       // Initalize the session storage at location i , j , k  with the initial value of *
                       sessionStorage.setItem(this.createFileLocationString(i, j, k), this.createDirectoryFileDataString(0, i, j, k, NO_FILE_DATA));
                   }
               }
           }
       } 
       /**
        * Used to create a well formated key for the hard drive 
        * @Params track {number} - The track of the location
        *         sector {number} - The sector of the location
        *         block {number}  - The block of the location
        * @Returns {string} - A well formated key to be used for session storage or look-up
        * 
        */
       public createFileLocationString(track: number, sector: number, block: number):string {
           var locationString: string = "";

           locationString = "" + track + "," + sector + "," + block + "";

           return locationString;          
       }
       /**
        * Used to create a well formated value for the hard drive
        * @Params filename {string} - The name of the file to be created
        * @Returns {string} - A well formated value to be used for session storage
        */
       public createDirectoryFileDataString(in_use: number, track: number, sector: number, block: number, filename: string): string {

           // Create the start of the File data string
           var fileDataString = "";

           // Add the in_use to the string
           fileDataString = fileDataString + in_use + ",";

           // Add the track to the string
           fileDataString = fileDataString + track + ",";

           // Add the sector to the string
           fileDataString = fileDataString + sector + ",";

           // Add the block to the string
           fileDataString = fileDataString + block + ",";

           // Add the name to the string
           fileDataString = fileDataString + filename;
       

           // Return that shizz
           return fileDataString;
       }
       /**
        * Used to search the file directory to see if the file name exists 
        * @Params filename {string} - The name of the file to search for
        * @Returns {string} - The key of the matching filename
        *
        */
       public searchForFile(filename) {

           // Initalize the variables
           var nextFileDataString: string;
           var nextFileData = [];

           // First convert the filename to hex
           filename = filename + "";

           // Loop from 0 0 1 - > 0 7 7 and search each value for a matching file name
           for (var i = 0; i < 1; i++) {
               for (var j = 0; j < 7; j++) {
                   for (var k = 0; k < 7; k++) {

                       // Get the next directory entry
                       nextFileDataString = sessionStorage.getItem(this.createFileLocationString(i, j, k));

                       // Break up the string by the commas and add it to an array
                       nextFileData = nextFileDataString.split(',');

                       // First check to see if the current index in the directory is being used
                       if (nextFileData[0] == "1") { // If the directory is in use

                           // compare the file name of the current index in the directory to the one that the user is searching for
                           if (nextFileData[4] == filename) {
                               // Return the string 
                               return nextFileData.toString();
                           }
                       }
                   }
               }
           }
           // If the code makes it to this section then the file does not exist and return null
           console.log("THE FILE DOES NOT EXISTS");
           return null;
       } 
       /**
        * Used to get the next open file directoy location
        * Possible location are | 0 0 1 -> 0 7 7  |
        * 
        */
       public getNextFileDirectoryLocation(): string {

           // Initalize the variables
           var nextFileDataString: string;
           var nextFileData = [];

           // Loop over the possible file directory locations and check for the first one that is not in use
           for (var i = 0; i < 1; i++) {
               for (var j = 0; j < 7; j++){
                   for (var k = 1; k < 7; k++){

                       // Get the next directory entry
                       nextFileDataString = sessionStorage.getItem(this.createFileLocationString(i, j, k));

                       // Break up the string by the commas and add it to an array
                       nextFileData = nextFileDataString.split(',');

                       // Check the in use byte
                       if (nextFileData[0] == 0) {  // If the directory index is not currently in use
                           console.log("The next free directory location is... " + i + j + k);
                            // return the key for the free index
                           return this.createFileLocationString(i, j, k);
                       }
                   }
               }
           }
           // If the code is unable to find a free directory location then return null
           return null; // If not more space if left
       }
       /**
        * USed to get the next open file data location
        */
       public getNextFileDataLocation(): string {

           return "";
       }    
       public krnFSDriverEntry() {

            // Initialization File System Device Driver.
            this.status = "loaded";    
        }
        // Update the kernal with the status of File System Operations
        public krnFSOperationRespose(args) {

            var operation: string = args[0];
            var data1: string = args[1];
            var data2: string = args[2];         

            if (_DiskIsFormated == false && operation != FORMAT_DRIVE) {

                // Tell the user the error
                 _StdOut.putText("Error: Disk not formatted "); 

                // Advance the line
                _Console.advanceLine();

                // Place the prompt
                _OsShell.putPrompt();
            }
            else {
                switch (operation) {
                    case CREATE_FILE:
                        this.createFile(data1);
                            break;
                        case READ_FILE:
                            this.readFile(data1);
                            break;
                        case WRITE_FILE:
                            this.writeFile(data1, data2);
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
        }
        /**
         * Used to create a new file with the given file name
         * @Params filename <String> - the name for the new file
         * @Returns        <True>  - If the file is successfully created
                           <False> - If the file is not created
         */
        public createFile(filename: string): boolean {

       
            // Initalize variables
            var nextFreeDirectoryLocation;
            var nextFreeDataLocation = 12;
            var fileDirectoryData;

           // First check to see if the file name already exists in the file system
           if(this.searchForFile(filename) == null) { // If not file of that name exists then 

               // Get the next free directory index
               nextFreeDirectoryLocation = this.getNextFileDirectoryLocation();
               fileDirectoryData = nextFreeDirectoryLocation.split(',');

               // If a free index exists 
               if(nextFreeDirectoryLocation != null) {

                   // Check to see if free space exists for the file data
                   if(nextFreeDataLocation != null) { // If a free data index exists

                    sessionStorage.setItem(nextFreeDirectoryLocation, this.createDirectoryFileDataString(1, fileDirectoryData[1], fileDirectoryData[2], fileDirectoryData[3], filename));

                    // Report to the user that the creation was successful
                    _StdOut.putText("Success: The file was created"); 

                    // Advance the line in the console
                    _Console.advanceLine();

                    // Place the prompt
                    _OsShell.putPrompt();

                    // IT WORKED !
                    return true;
                   }
                   else { // If no file blocks are availble
                       // Tell the user 
                       _StdOut.putText("Error: No file table space"); 

                       // Advance the line
                       _Console.advanceLine();

                       // Place the prompt
                       _OsShell.putPrompt();

                       return false;
                   }

               }
               else { // If no free directory location exists

                   // Tell the user 
                   _StdOut.putText("Error: No file directory index space"); 

                   // Advance the line
                   _Console.advanceLine();

                   // Place the prompt
                   _OsShell.putPrompt();

                   return false;
               }

           }
           else {  // If the file name is found

               // Tell the user 
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


          // To read from a file we use a system call that specifies the name of the file and where
          // (in memory) the next block of the file should be put. 

           // Again, the directoy is searched for the associated entry, and the system needs to keep a read pointer to the location 
           // in the file where the next read is to take place.

           // Once the read had taken place,  the read pointer is updated. Because a process is usually either reading or writing 
           // to a file, the current operation location can be kept as a per-process current-file-position- pointer.

           // Both the read and write operations use this same pointer, saving space and reducing system complexity


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


            // To write a file, we make a system call specifiying both the name of the file and the information to be written to the file
            // Given the name of the file, the system searches the directory to find the file's location
            // The system keeps a write pointer to the location in the file where the next write occurs to take place
            // The write pointer must be updated whenever a write occurs


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


            // To delete a file , we search the directory for the named file.

            // Having found the associated directory entry, we relesase all file space, so that 
            // it can be reused by other files, and erase the directory entry
            

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
