///<reference path="../utils.ts" />
/* ------------
     File.ts
   ------------ */
var TSOS;
(function (TSOS) {
    var File = (function () {
        function File(filename, fileLocation, fileSize) {
            this.state = "";
            this.Name = "";
            this.Location = "";
            this.Size = "";
            this.Created = "";
            this.ReadOnly = false;
            this.Hidden = false;
            this.Data = "";
            this.track = "";
            this.sector = "";
            this.block = "";
            this.state = BLOCK_FREE;
            this.Name = filename;
            this.Location = fileLocation;
            this.Size = fileSize;
            this.Created = TSOS.Utils.getDate() + TSOS.Utils.getTime();
        }
        File.prototype.getFilename = function () {
            return this.Name;
        };
        File.prototype.getFileLocation = function () {
            return this.Location;
        };
        File.prototype.getFileSize = function () {
            return this.Size;
        };
        File.prototype.getCreationTime = function () {
            return this.Created;
        };
        File.prototype.isReadyOnly = function () {
            return this.ReadOnly;
        };
        File.prototype.isHidden = function () {
            return this.Hidden;
        };
        File.prototype.writeToFile = function (data) {
            this.Data = this.Data + data;
        };
        File.prototype.readFromFile = function () {
            return this.Data;
        };
        File.prototype.setReadyOnly = function (mode) {
            this.ReadOnly = mode;
        };
        File.prototype.setHidden = function (mode) {
            this.Hidden = mode;
        };
        File.prototype.convertToString = function () {
            var output = "";
            // First check the state to determine if in use or not
            if (this.state == BLOCK_FREE) {
                output = output + "0";
            }
            else {
                output = output + "1";
            }
            // Next wrap up the sector , track , block info
            output = output + this.track + this.sector + this.block;
            // Next Wrap up the data 
            return output;
        };
        return File;
    })();
    TSOS.File = File;
})(TSOS || (TSOS = {}));
