///<reference path="../utils.ts" />
/* ------------
     File.ts
   ------------ */
var TSOS;
(function (TSOS) {
    var File = (function () {
        function File(filename, fileLocation, fileSize) {
            this.Name = "";
            this.Location = "";
            this.Size = "";
            this.Created = "";
            this.ReadOnly = false;
            this.Hidden = false;
            this.Data = "";
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
        return File;
    })();
    TSOS.File = File;
})(TSOS || (TSOS = {}));
