var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var FileDirectory = (function () {
        function FileDirectory(inuse, track, sector, block, filename) {
            this.In_Use = inuse;
            this.track = track;
            this.sector = sector;
            this.block = block;
            this.filename = filename;
        }
        ///////////////////////////////////////////////////////////////////////////////////////
        //                                                                                   //
        //																					 //
        //                           GETTERS and SETTERS 									 //
        //																					 //
        ///////////////////////////////////////////////////////////////////////////////////////
        FileDirectory.prototype.isFileInUse = function () {
            if (this.In_Use == 0) {
                return false;
            }
            else if (this.In_Use == 1) {
                return true;
            }
            else {
                return true;
            }
        };
        FileDirectory.prototype.getTrackLocation = function () {
            return this.track;
        };
        FileDirectory.prototype.getSectorLocation = function () {
            return this.sector;
        };
        FileDirectory.prototype.getBlockLocation = function () {
            return this.block;
        };
        FileDirectory.prototype.getFileName = function () {
            return this.filename;
        };
        FileDirectory.prototype.toString = function () {
            // Add the first half of the date to the return string 
            var testing = "[" + "{" + this.In_Use + "}" + "{" + this.track + "}" + "{" + this.sector + "}" + "{" + this.block + "}";
            var nextLetter = "";
            // Next loop over the file name and append each character onto the end of the string in its open {} 
            for (var i = 0; i < this.filename.length; i++) {
                nextLetter = "{" + this.filename.charAt(i) + "}";
                testing = testing + nextLetter;
            }
            console.log(testing + "JOE THIS IS THE TEST");
            return testing;
        };
        return FileDirectory;
    })();
    TSOS.FileDirectory = FileDirectory;
})(TSOS || (TSOS = {}));
