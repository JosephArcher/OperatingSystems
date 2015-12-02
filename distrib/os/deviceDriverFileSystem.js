///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="deviceDriver.ts" />
///<reference path="canvastext.ts" />
///<reference path="File.ts" />
///<reference path="FileDirectoryObject.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverFileSystem = (function (_super) {
        __extends(DeviceDriverFileSystem, _super);
        function DeviceDriverFileSystem() {
            _super.call(this, this.krnFSDriverEntry, this.krnFSOperationRespose);
        }
        /**
         * Used to format the hard disk from 0 0 0 -> 3 3 7
         *
         */
        DeviceDriverFileSystem.prototype.formatHardDisk = function () {
            _DiskIsFormated = true;
            var tracks = 4;
            var sectors = 8;
            var blocks = 8;
            var nextStorageLocation = "";
            // Loop and initalize the session storage
            // For every track
            for (var i = 0; i < tracks; i++) {
                // For every sector
                for (var j = 0; j < sectors; j++) {
                    // A block is chilling out
                    for (var k = 0; k < blocks; k++) {
                        // Initalize the session storage at location i , j , k  with the initial value of *
                        sessionStorage.setItem(this.createFileLocationString(i + "", j + "", k + ""), this.createDirectoryFileDataString(0, i, j, k, NO_FILE_DATA));
                    }
                }
            }
        };
        /**
         * Used to create a well formated key for the hard drive
         * @Params track {number} - The track of the location
         *         sector {number} - The sector of the location
         *         block {number}  - The block of the location
         * @Returns {string} - A well formated key to be used for session storage or look-up
         *
         */
        DeviceDriverFileSystem.prototype.createFileLocationString = function (track, sector, block) {
            var locationString = "";
            locationString = "" + track + "," + sector + "," + block + "";
            return locationString;
        };
        /**
         * Used to create a well formated value for the hard drive
         * @Params filename {string} - The name of the file to be created
         * @Returns {string} - A well formated value to be used for session storage
         */
        DeviceDriverFileSystem.prototype.createDirectoryFileDataString = function (in_use, track, sector, block, filename) {
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
        };
        DeviceDriverFileSystem.prototype.createDataFileString = function (in_use, track, sector, block, filedata) {
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
            fileDataString = fileDataString + filedata;
            // Return that shizz
            return fileDataString;
        };
        /**
         * Used to search the file directory to see if the file name exists
         * @Params filename {string} - The name of the file to search for
         * @Returns {Array} -  0[The I , J , K] 1[filedirectorydata] position
         *
         */
        DeviceDriverFileSystem.prototype.searchForFile = function (filename) {
            // Initalize the variables
            var nextFileDataString;
            var nextFileData = [];
            var response = []; // The response array
            // First convert the filename to hex
            filename = filename + "";
            // Loop from 0 0 1 - > 0 7 7 and search each value for a matching file name
            for (var i = 0; i < 1; i++) {
                for (var j = 0; j < 7; j++) {
                    for (var k = 0; k < 7; k++) {
                        // Get the next directory entry
                        nextFileDataString = sessionStorage.getItem(this.createFileLocationString(i + "", j + "", k + ""));
                        // Break up the string by the commas and add it to an array
                        nextFileData = nextFileDataString.split(',');
                        // First check to see if the current index in the directory is being used
                        if (nextFileData[0] == "1") {
                            // compare the file name of the current index in the directory to the one that the user is searching for
                            if (nextFileData[4] == filename) {
                                // Fill the array
                                response[0] = this.createFileLocationString(i + "", j + "", k + "");
                                response[1] = nextFileData.toString();
                                return response;
                            }
                        }
                    }
                }
            }
            // If the code makes it to this section then the file does not exist and return null
            return null;
        };
        /**
         * Used to get the next open file directoy location
         * Possible location are | 0 0 1 -> 0 7 7  |
         *
         */
        DeviceDriverFileSystem.prototype.getNextFileDirectoryLocation = function () {
            // Initalize the variables
            var nextFileDataString;
            var nextFileData = [];
            // Loop over the possible file directory locations and check for the first one that is not in use
            for (var i = 0; i < 1; i++) {
                for (var j = 0; j < 7; j++) {
                    for (var k = 1; k < 7; k++) {
                        // Get the next directory entry
                        nextFileDataString = sessionStorage.getItem(this.createFileLocationString(i + "", j + "", k + ""));
                        // Break up the string by the commas and add it to an array
                        nextFileData = nextFileDataString.split(',');
                        // Check the in use byte
                        if (nextFileData[0] == "0") {
                            console.log("The next free directory location is... " + i + j + k);
                            // return the key for the free index
                            return this.createFileLocationString(i + "", j + "", k + "");
                        }
                    }
                }
            }
            // If the code is unable to find a free directory location then return null
            return null; // If not more space if left
        };
        /**
         * USed to get the next open file data location
         * Possible locations 1 0 0 - > 3 7 7
         */
        DeviceDriverFileSystem.prototype.getNextFileDataLocation = function () {
            // Initalize the variables
            var nextFileDataString;
            var nextFileData = [];
            // Loop over the possible file data locations and check for the first one that is not in use
            for (var i = 1; i < 3; i++) {
                for (var j = 0; j < 7; j++) {
                    for (var k = 0; k < 7; k++) {
                        // Get the next directory entry
                        nextFileDataString = sessionStorage.getItem(this.createFileLocationString(i + "", j + "", k + ""));
                        // Break up the string by the commas and add it to an array
                        nextFileData = nextFileDataString.split(',');
                        console.log("Index " + i + j + k + "is equal to" + nextFileData[0]);
                        // Check the in use byte
                        if (nextFileData[0] == "0") {
                            console.log("The next free data location is... " + i + j + k);
                            // return the key for the free index
                            return this.createFileLocationString(i + "", j + "", k + "");
                        }
                    }
                }
            }
            // If the code is unable to find a free directory location then return null
            return null; // If not more space if left
        };
        DeviceDriverFileSystem.prototype.krnFSDriverEntry = function () {
            // Initialization File System Device Driver.
            this.status = "loaded";
        };
        // Update the kernal with the status of File System Operations
        DeviceDriverFileSystem.prototype.krnFSOperationRespose = function (args) {
            var operation = args[0];
            var data1 = args[1];
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
                        this.writeFile(data1);
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
        };
        /**
         * Used to create a new file with the given file name
         * @Params filename <String> - the name for the new file
         * @Returns        <True>  - If the file is successfully created
                           <False> - If the file is not created
         */
        DeviceDriverFileSystem.prototype.createFile = function (filename) {
            // Initalize variables
            var nextFreeDirectoryLocation;
            var nextFreeDataLocation;
            var fileDirectoryData;
            var fileTableData;
            // Check to see if a file name was given and if not stop
            if (filename == "") {
                // Report an error to the user
                _StdOut.putText("Error: A file name must be given");
                // Advance the line
                _Console.advanceLine();
                // Place the prompt
                _OsShell.putPrompt();
                return false;
            }
            // Check to see if the file name already exists in the file system
            if (this.searchForFile(filename) == null) {
                // Get the next free directory index
                nextFreeDirectoryLocation = this.getNextFileDirectoryLocation();
                fileDirectoryData = nextFreeDirectoryLocation.split(',');
                // If a free index exists 
                if (nextFreeDirectoryLocation != null) {
                    // Get the next free data index
                    nextFreeDataLocation = this.getNextFileDataLocation();
                    fileTableData = nextFreeDataLocation.split(',');
                    // Check to see if free space exists for the file data
                    if (nextFreeDataLocation != null) {
                        // Create the directory entry for the new file
                        sessionStorage.setItem(nextFreeDirectoryLocation, this.createDirectoryFileDataString(1, fileTableData[0], fileTableData[1], fileTableData[2], filename));
                        // Create the table entry for the new file
                        sessionStorage.setItem(nextFreeDataLocation, this.createDataFileString("1", "0", "0", "0", "IPSUM YOUSUM"));
                        // Report to the user that the creation was successful
                        _StdOut.putText("Success: The file was created");
                        // Advance the line in the console
                        _Console.advanceLine();
                        // Place the prompt
                        _OsShell.putPrompt();
                        // IT WORKED !
                        return true;
                    }
                    else {
                        // Tell the user 
                        _StdOut.putText("Error: No file table space");
                        // Advance the line
                        _Console.advanceLine();
                        // Place the prompt
                        _OsShell.putPrompt();
                        return false;
                    }
                }
                else {
                    // Tell the user 
                    _StdOut.putText("Error: No file directory index space");
                    // Advance the line
                    _Console.advanceLine();
                    // Place the prompt
                    _OsShell.putPrompt();
                    return false;
                }
            }
            else {
                // Tell the user 
                _StdOut.putText("Error: The filename already exists ");
                // Advance the line
                _Console.advanceLine();
                // Place the prompt
                _OsShell.putPrompt();
                return false;
            }
        };
        /**
         * Used to read a file with the given file name
         * @Params filename <String> - the name of the file tp read frp,
         * @Returns         <True>  - If the file was successfully read
                            <False> - If the file is not read
         */
        DeviceDriverFileSystem.prototype.readFile = function (filename) {
            // Search for the file 
            var response = this.searchForFile(filename);
            // If the file exists
            if (response != null) {
                // Split apart the response array
                var fileLocation = response[0];
                var fileData = response[1];
                // Split apart the index and get the track , sector, block from the index
                var fileDataArray = fileData.split(',');
                var Lookup = this.createFileLocationString(fileDataArray[1], fileDataArray[2], fileDataArray[3]);
                var value = sessionStorage.getItem(Lookup);
                var test = value.split(',');
                // Tell the user 
                _StdOut.putText("Data: " + test[4]);
                // Advance the line
                _Console.advanceLine();
                // Place the prompt
                _OsShell.putPrompt();
                return false;
            }
            else {
                // Tell the user 
                _StdOut.putText("Error: The filename does not exist");
                // Advance the line
                _Console.advanceLine();
                // Place the prompt
                _OsShell.putPrompt();
                return false;
            }
        };
        /**
         * Used to write <filedata> to a file with the given <Filename>
         * @Params filename <String> - The name of the file to write to
         *         filedata <String> - The data to write to the file
         * @Returns         <True>   - If the file was successfully writen to
                            <False>  - If the file is not writen to
         */
        DeviceDriverFileSystem.prototype.writeFile = function (fileInfo) {
            // split the n   ame into two parts the real file name and the data to write
            // Search for the file 
            var filename = fileInfo[0];
            var filedata = fileInfo[1];
            var response = this.searchForFile(filename);
            // console.log("FILE INDEX IS : " + fileIndex);
            // If the file exists
            if (response != null) {
                // Split apart the response array
                var fileLocation = response[0];
                var fileData = response[1];
                // Split apart the index and get the track , sector, block from the index
                var fileDataArray = fileData.split(',');
                var Lookup = this.createFileLocationString(fileDataArray[1], fileDataArray[2], fileDataArray[3]);
                var value = sessionStorage.getItem(Lookup);
                var test = value.split(',');
                var littleLessFun = test[4];
                for (var i = 0; i < filedata.length - 2; i++) {
                    console.log(i);
                    if (i == filedata.length) {
                    }
                    else {
                        littleLessFun = littleLessFun + filedata.charAt(i + 1);
                    }
                }
                var splits = Lookup.split(',');
                sessionStorage.setItem(Lookup, this.createDataFileString("1", test[1], test[2], test[3], littleLessFun));
                // Tell the user 
                _StdOut.putText("File Write Success");
                // Advance the line
                _Console.advanceLine();
                // Place the prompt
                _OsShell.putPrompt();
                return false;
            }
            else {
            }
        };
        /**
         * Used to delete a file with the given <Filename>
         * @Params filename <String> - the name of the file to delete
         * @Returns         <True>  - If the file was successfully deleted
                            <False> - If the file is not deleted
         */
        DeviceDriverFileSystem.prototype.deleteFile = function (filename) {
            // Search for the file 
            var response = this.searchForFile(filename);
            // If the file exists
            if (response != null) {
                // Split apart the response array
                var fileLocation = response[0];
                var fileData = response[1];
                // Split apart the file directory location
                var fileLocationArray = fileLocation.split(',');
                // Get the TSB of the directory location
                var orgTrack = fileLocationArray[0];
                var orgSector = fileLocationArray[1];
                var orgBlock = fileLocationArray[2];
                var value = sessionStorage.getItem(this.createFileLocationString(orgTrack + "", orgSector + "", orgBlock + ""));
                console.log("Deleting from index  item " + this.createFileLocationString(orgTrack + "", orgSector + "", orgBlock + ""));
                // Clear the Directory entry(Sets the in use bit to 0 T = -1 S = -1 B = -1 and a blank file name)
                sessionStorage.setItem(this.createFileLocationString(orgTrack + "", orgSector + "", orgBlock + ""), this.createDirectoryFileDataString(0, 0, 0, 0, ""));
                // Next cascade delete from the table sooooooooooooooo.............
                // Split apart the index and get the track , sector, block from the index
                var fileDataArray = fileData.split(',');
                var track = fileDataArray[1];
                var sector = fileDataArray[2];
                var block = fileDataArray[3];
                // Recusively delete untill all blocks have been vaporized
                if (this.cascadeDeleteFileBlocks(this.createFileLocationString(track + "", sector + "", block + "")) == true) {
                    // Tell the user 
                    _StdOut.putText("File Successfully Deleted");
                    // Advance the line
                    _Console.advanceLine();
                    // Place the prompt
                    _OsShell.putPrompt();
                    return false;
                }
                else {
                    // Tell the user 
                    _StdOut.putText("Woops.... some shit happened");
                    // Advance the line
                    _Console.advanceLine();
                    // Place the prompt
                    _OsShell.putPrompt();
                    return false;
                }
            }
            else {
                // Tell the user 
                _StdOut.putText("Error: The filename does not exist");
                // Advance the line
                _Console.advanceLine();
                // Place the prompt
                _OsShell.putPrompt();
                return false;
            }
        };
        /**
         * This is a recurisive function that when given a starting location string
         * it will delete blocks until the section of the header of the block that
         * is being deleted is equal to 000
         * @Params startingLocation: {String} - The first block in the chain
         *
         */
        DeviceDriverFileSystem.prototype.cascadeDeleteFileBlocks = function (startingLocation) {
            console.log("Starting the cascading delete at... " + startingLocation);
            // First get the Item at the location
            var block = sessionStorage.getItem(startingLocation);
            console.log(block + " THIS IS THE NEXT ITEM");
            // Split next item data into an array
            var blockDataArray = block.split(',');
            console.log(" THIS IS ANOTHER TEST   " + blockDataArray[0] + blockDataArray[1] + blockDataArray[2] + blockDataArray[3] + blockDataArray[4]);
            // Build a string with the next block location for late use to determine if recursion is needed
            var nextBlockLocation = "" + blockDataArray[1] + blockDataArray[2] + blockDataArray[3];
            // Delete the current block
            sessionStorage.setItem(startingLocation, this.createDataFileString("0", "0", "0", "0", ""));
            console.log(startingLocation + "was just deleted");
            // Check to see if recursion is needed
            if (nextBlockLocation == "000") {
                // STOP RECURSION
                console.log("RECURSION STOPING");
                return true;
            }
            else {
                console.log("RECURSION IS HAPPENING !!!");
                // If another location needs to be deleted then recurse 
                this.cascadeDeleteFileBlocks(this.createFileLocationString(blockDataArray[1], blockDataArray[2], blockDataArray[3]));
            }
        };
        /**
         * Used to check if a file name exists in the file system
         */
        DeviceDriverFileSystem.prototype.filenameExists = function (filename) {
            // Check to see if the file name is in stored in the session storage
            var fileExists = sessionStorage.getItem(filename);
            // If the file exists
            if (fileExists != null) {
                // Return true
                return true;
            }
            else {
                // Return false
                return false;
            }
        };
        /**
         * Checks to see if the given file name already exists in the file system
         */
        DeviceDriverFileSystem.prototype.listFiles = function () {
            // Initlize Variables
            var fileList = [];
            // Find all the files in the File System and add them into the arrary
            // Return file list
            return fileList;
        };
        DeviceDriverFileSystem.prototype.getAllFiles = function () {
            // Initlize Variables
            var fileList = [];
            // Find all the files in the File System and add them into the arrary
            // Return file list
            return fileList;
        };
        return DeviceDriverFileSystem;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverFileSystem = DeviceDriverFileSystem;
})(TSOS || (TSOS = {}));
