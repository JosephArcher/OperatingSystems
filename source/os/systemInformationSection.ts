///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
/**
 * This class is used in order to handle the UI System Information Section above the user console
 */
module TSOS {
	export class SystemInformationSection {

		// The HTML Elements in the UI
		public statusSectionElement: HTMLElement;
		public dateSectionElement: HTMLElement;
		public timeSectionElement: HTMLElement;

		public constructor(statusSectionP: HTMLElement, dateSectionP: HTMLElement, timeSectionP: HTMLElement) {

			this.statusSectionElement = statusSectionP;
			this.dateSectionElement = dateSectionP;
			this.timeSectionElement = timeSectionP;
		}
		/**
		 * Used to set the status message on the UI
		 */ 
		public setStatusMessage(statusMessage: string): void {
		//	this.statusSectionElement.innerHTML =  "Status: " + statusMessage;
		}
		/**
		 * Used to set the date on the UI
		 */
		private setDateSection(dateString: string): void {
			//this.dateSectionElement.innerHTML =  "Date: " + dateString;
		}
		/**
		 * Used to set the time on the UI
		 */
		private setTimeSection(timeString: string): void {
			//this.timeSectionElement.innerHTML = "Time: " + timeString;			
		}
		/**
		 * Used to update the curret date and time, called on every clock tick
		 */
		public updateDateTime(): void {
			//this.setDateSection(Utils.getDate() );
			//this.setTimeSection(Utils.getTime() );
		}
		/**
		 * Used to clear the time, date, and status information
		 */
		public systemOffMode(): void {
			//this.setTimeSection("");
			//this.setDateSection("");
			//this.setStatusMessage("");
		}
	}
}