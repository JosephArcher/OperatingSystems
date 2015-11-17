///<reference path="../utils.ts" />
/* ------------
     File.ts
   ------------ */
var TSOS;
(function (TSOS) {
    var File = (function () {
        function File(filename, fileLocation, fileSize) {
            this.Name = ""; // The File name
            this.Indentifier = ""; // The ID for the file 
            this.Type = ""; // The type of file 
            this.Location = ""; // This information is a pointer to a device and to the location of the file on that device
            this.Size = ""; // The size of the file
            this.TimeCreated = ""; // The time the file was created
            this.DateCreated = ""; // The day the file was first created
            this.ReadOnly = false; // If the file is able to be written to
            this.Hidden = false; // If the file should be shown 
            this.Name = filename;
            this.Location = fileLocation;
            this.Size = fileSize;
            this.TimeCreated = TSOS.Utils.getTime();
            this.DateCreated = TSOS.Utils.getDate();
        }
        ///////////////////////////////////////////////////////////////////////////////////////
        //                                                                                   //
        //																					 //
        //                           GETTERS and SETTERS 									 //
        //																					 //
        ///////////////////////////////////////////////////////////////////////////////////////
        File.prototype.getFilename = function () {
            return this.Name;
        };
        File.prototype.getFileLocation = function () {
            return this.Location;
        };
        File.prototype.getFileSize = function () {
            return this.Size;
        };
        File.prototype.getTimeCreated = function () {
            return this.TimeCreated;
        };
        File.prototype.getDateCreated = function () {
            return this.DateCreated;
        };
        File.prototype.isReadyOnly = function () {
            return this.ReadOnly;
        };
        File.prototype.isHidden = function () {
            return this.Hidden;
        };
        File.prototype.setReadyOnly = function (mode) {
            this.ReadOnly = mode;
        };
        File.prototype.setHidden = function (mode) {
            this.Hidden = mode;
        };
        return File;
    })();
    TSOS.File = File;
})(TSOS || (TSOS = {}));
