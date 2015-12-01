///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="cpu.ts" />
///<reference path="memory.ts" />
///<reference path="../os/canvastext.ts" />
///<reference path="../os/systemInformationSection.ts" />

/* ------------
     Control.ts

     Requires globals.ts.

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

//
// Control Services
//
module TSOS {

    export class Control {



        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value="";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

            // Memory Display for the UI
            _MemoryInformationTableElement = <HTMLTableElement>document.getElementById('memoryInfoTable'); 

             // Cpu Statistics Display for the UI
            _CpuStatisticsTableElement  = <HTMLTableElement>document.getElementById('cpuStatTable'); 

            // Process Control Block Display for the UI
            _ProcessControlBlockTableElement = <HTMLTableElement>document.getElementById('processControlBlockTable');

            // Single Step Display Initalization
            _SingleStepToggle = <HTMLInputElement>document.getElementById("singleStepToggle");

            // Program Spinner
            _ProgramSpinner = <HTMLElement>document.getElementById("programSpinner");

            // Status section
            _StatusSectionElement = <HTMLElement> document.getElementById("statusArea");

            // Data section
            _DateSectionElement = <HTMLElement> document.getElementById("dateArea");

            // Time section
            _TimeSectionElement = <HTMLElement> document.getElementById("timeArea");
           
            // Resient List
            _TerminatedProcessTableElement = <HTMLTableElement> document.getElementById("terminatedProcessTableElement");

            // Ready Queue
            _ReadyQueueTableElement = <HTMLTableElement> document.getElementById("readyQueueTableElement");

           
            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.

                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }
        public static hostLog(msg: string, source: string = "?"): void {

                 // Check to see if the new message is equal to the previous one
                 if(msg == lastUIMessage){
                     // If they are equal

                     // Increase the global repeat ui counter
                     hostCounter = hostCounter + 1;

                     // Update the UI
                  
                     $("#taHostLog li:first-child").replaceWith('<li class="hostLogListItem" style="height:75px;"> <p class="" >' + msg + '<span class="label logCounter">' + hostCounter + '</span> </p> <span class="logDateTime">' + Utils.getTime() + ' </span > <span class="logSource" >' + source + '</span> </li>');
                 }
                 else{
                    // If they are not equal

                     hostCounter = 1;

                     $("#taHostLog").prepend('<li class="hostLogListItem" style="height:75px;"> <p class="" >' + msg + '<span class="label logCounter">' + hostCounter + '</span> </p> <span class="logDateTime">' + Utils.getTime() + ' </span > <span class="logSource" >' + source + '</span> </li>');
                     // Reset the counter to one
                     
                     // Update the last UI message
                     lastUIMessage = msg;
                 }


            // Note the OS CLOCK.
            var clock: number = _OSclock;
            
        }
        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn): void {

           // When the power button is clicked need to check the current state of the system

            if(_SystemIsOn == false) { // If the system is currently off

                _SystemIsOn = true; // Turn the system on
             
                // .. enable the Halt and Reset buttons ...
               // (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
                (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;

                // .. set focus on the OS console display ...
                document.getElementById("display").focus();

                // ... Create and initialize the CPU (because it's part of the hardware)  ...
                _CPU = new Cpu();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
                _CPU.init();       //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.

                // Create and initalize the Memory for the CPU
                _MemoryBlock = new MemoryBlock();
                _MemoryBlock.init();
            
                // ... then set the host clock pulse ...
                _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
                // .. and call the OS Kernel Bootstrap routine.
                _Kernel = new Kernel();
                _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.     

                Utils.togglePowerOn();   // Handle what happens to the UI when the system turns on      
            }
            // System is already on and need to turn it off 
            else {
                _SystemIsOn = false; // Turn the system off
                _SystemInformationInterface.systemOffMode();
                _MemoryInformationTable.fillRows();
                _TerminatedProcessTable.clearTable();
                _ReadyQueueTable.clearTable();
                Utils.togglePowerOff(); // Handle what happens to the UI when the system turns off

                // Call the halt button becuase that is really what this is supposed to be
                this.hostBtnHaltOS_click(null);
            }          
        }

        public static hostBtnHaltOS_click(btn): void {
            console.log("HALT BUTTON");
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);

            // TODO: Is there anything else we need to do here?
        }
         /**
         * Called when the step button is clicked on the UI
         * Used to set the global step boolean to false
        */
        public static hostBtnStepOS_click(btn): void {  

                   _SingleStepMode = true; // Turn on single step moode
                   Utils.toggleStepModeOn(); // Handle the UI for single step mode
                   $("#taHostLog").append('<li class="list-group-item">Dapibus ac facilisis in <span class="badge">3</span> </li>');
                   

        }
        /**
         * What happens when the user is in single step mode and wants to step forward
         */
        public static hostBtnStepForward_click(btn): void {
            _AllowNextCycle = true; // Allow the CPU to complete another cycle
        }
        /**
         * What happens when the user wants to switch to run mode
         */ 
        public static hostBtnRunOS_click(btn): void {
            _SingleStepMode = false; // Turn off single step mode a.k.a. turn on run mode
            _AllowNextCycle = true; // Allow the CPU to cycle 
            Utils.toggleRunModeOn(); // Handle the UI for turning off single step mode
        }
        public static hostBtnReset_click(btn): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }
    }
}
