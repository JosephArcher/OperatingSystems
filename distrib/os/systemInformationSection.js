///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
/**
 * This class is used in order to handle the UI System Information Section above the user console
 */
var TSOS;
(function (TSOS) {
    var SystemInformationSection = (function () {
        function SystemInformationSection(statusSectionP, dateSectionP, timeSectionP) {
            this.statusSectionElement = statusSectionP;
            this.dateSectionElement = dateSectionP;
            this.timeSectionElement = timeSectionP;
        }
        /**
         * Used to set the status message on the UI
         */
        SystemInformationSection.prototype.setStatusMessage = function (statusMessage) {
            //	this.statusSectionElement.innerHTML =  "Status: " + statusMessage;
        };
        /**
         * Used to set the date on the UI
         */
        SystemInformationSection.prototype.setDateSection = function (dateString) {
            //this.dateSectionElement.innerHTML =  "Date: " + dateString;
        };
        /**
         * Used to set the time on the UI
         */
        SystemInformationSection.prototype.setTimeSection = function (timeString) {
            //this.timeSectionElement.innerHTML = "Time: " + timeString;			
        };
        /**
         * Used to update the curret date and time, called on every clock tick
         */
        SystemInformationSection.prototype.updateDateTime = function () {
            //this.setDateSection(Utils.getDate() );
            //this.setTimeSection(Utils.getTime() );
        };
        /**
         * Used to clear the time, date, and status information
         */
        SystemInformationSection.prototype.systemOffMode = function () {
            //this.setTimeSection("");
            //this.setDateSection("");
            //this.setStatusMessage("");
        };
        return SystemInformationSection;
    })();
    TSOS.SystemInformationSection = SystemInformationSection;
})(TSOS || (TSOS = {}));
