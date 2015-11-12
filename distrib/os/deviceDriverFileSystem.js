///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="deviceDriver.ts" />
///<reference path="canvastext.ts" />
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
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverFileSystem = (function (_super) {
        __extends(DeviceDriverFileSystem, _super);
        function DeviceDriverFileSystem() {
            _super.call(this, this.krnFSDriverEntry, this.krnFSOperationRespose);
        }
        DeviceDriverFileSystem.prototype.krnFSDriverEntry = function () {
            // Initialization File System Device Driver.
            this.status = "loaded";
        };
        // Update the kernal with the status of File System Operations
        DeviceDriverFileSystem.prototype.krnFSOperationRespose = function () {
        };
        /**
         * Used to create a new file with the given file name
         */
        DeviceDriverFileSystem.prototype.createFile = function (filename) {
        };
        /**
         * Used to read a file with the given file name
         */
        DeviceDriverFileSystem.prototype.readFile = function (filename) {
        };
        /**
         * Used to write the given file data to the given file name
         */
        DeviceDriverFileSystem.prototype.writeFile = function (fileData, filename) {
        };
        /**
         * Used to delete a new file with the given file name
         */
        DeviceDriverFileSystem.prototype.deleteFile = function (filename) {
        };
        /**
         * Used to check if a file name exists in the file system
         */
        DeviceDriverFileSystem.prototype.filenameExists = function (filename) {
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
                if (filename == nextFile.getFileName()) {
                    // Return TRUE
                    return true;
                }
            }
            // If after looping no matching name was found return false
            return false;
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
