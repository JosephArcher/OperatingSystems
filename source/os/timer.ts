///<reference path="../globals.ts" />

module TSOS {

	export class Timer {

		public state: string = TIMER_IS_OFF;
		public timeRemaining = 0;

		/**
		 * Used to set a new timer for the number of clock cycles given
		 * @Params {Number} - The number of cycles for the current timer 
		 */
		public setNewTimer(value: number): void {

			if (this.state == TIMER_IS_SET) {
				console.log("ERROR: Unable to set a new timer because one is already running");
				return;
			}
			else if (this.state == TIMER_IS_OFF){
				console.log("SUCCESS: Setting a timer for " + value + " clock cycles");
				this.timeRemaining = value;
				this.state = TIMER_IS_SET;
			}
			else {
				console.log("This should never happen");
				return;
			}
		}
		/**
		 * Used to clear the current timer and set the timer to off

		 */
		public clearTimer(): void {
			this.timeRemaining = 0;
			this.state = TIMER_IS_OFF;
		}
		/**
		 *  Used to decrease the current amount of time remainaing by 1
		 *	@Returns      TIMER_FINISHED  If the timeRemaining = -1
		 	          TIMER_NOT_FINISHED  If the timeRemaining  > 0
		 */
		public decreaseTimerByOne(): string {

			// Check to see if the timer is currently set
			if (this.state == TIMER_IS_SET) {

				// Decrement the time remaining
				this.timeRemaining = this.timeRemaining - 1;

				// Check to see if the time remaining is less than 0
				if(this.timeRemaining <= 0) {
					return TIMER_FINISHED;
				}
				else {
					return TIMER_NOT_FINISHED;
				}	
			} 
			else {
		 	// Do nothing just let it all go bro
			}
		}
	}
}