///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="deviceDriver.ts" />
///<reference path="canvastext.ts" />

/* ----------------------------------
   DeviceDriverFileSystem.ts

   Requires deviceDriver.ts

   The Kernel File System Driver
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverFileSystem extends DeviceDriver {

       public  constructor() {
           super(this.krnFSDriverEntry, this.krnFSOperationRespose);
        }

        public krnFSDriverEntry() {

            // Initialization File System Device Driver.
            this.status = "loaded";
       
        }
        // Update the kernal with the status of File System Operations
        public krnFSOperationRespose () {

        }

    }
}
