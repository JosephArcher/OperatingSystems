///<reference path="os/collections.ts" />
/* ------------
   Globals.ts
   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in the text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */
// This is a random comment so I can test to see if gulp is working and should be deleted
//
// Global CONSTANTS (TypeScript 1.5 introduced const. Very cool.)
//
const APP_NAME: string    = "Joe/S";   // Joe is Love Joe is Lyfe
const APP_VERSION: string = "0.02";   // What did you expect?

const CPU_CLOCK_INTERVAL: number = 100;   // This is in ms (milliseconds) so 1000 = 1 second.

const TIMER_IRQ: number = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                              // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
const KEYBOARD_IRQ: number = 1;

// This is for the Blue Screen Of Death command
const BSOD_IRQ: number = 2; 

// Print Operation system call
const PRINT_IRQ: number = 3; 

// Break Operation system call
const BREAK_IRQ: number = 4; 

// Invalid Op Code
const INVALID_OPCODE_IRQ: number = 5; 

// Incorrect use of an Op Code
const INVALID_OPCODE_USE_IRQ: number = 6; 


// Process States as consts for the Process Control Blocks
const PROCESS_STATE_NEW: string         = "NEW";
const PROCESS_STATE_RUNNING: string     = "RUNNING"; 
const PROCESS_STATE_WAITING: string     = "WAITING"; 
const PROCESS_STATE_READY: string       = "READY"; 
const PROCESS_STATE_TERMINATED: string  = "TERMINATED"; 

//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.

// Used to create the auto incrementing process ID's for the Process Control Blocks
var _ProcessCounterID = -1;

// Create an image global for the blue screen of death
var BSOD_IMAGE = new Image();

// Get the Image from the web
BSOD_IMAGE.src = "https://neosmart.net/wiki/wp-content/uploads/sites/5/2013/08/unmountable-boot-volume.png"; 

var _CPU: TSOS.Cpu;  // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.

// The Memory for the cpu
var _MemoryBlock0: TSOS.MemoryBlock;  

// The Manager for the Memory
var _MemoryManager0: TSOS.MemoryManager; 

// Create the Ready Queue as a Linked List of Process Control Blocks
var _ReadyQueue: collections.LinkedList<TSOS.ProcessControlBlock>;

var _OSclock: number = 0;  // Page 23.

var _Mode: number = 0;     // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas: HTMLCanvasElement;         // Initialized in Control.hostInit().
var _DrawingContext: any; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily: string = "sans";        // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize: number = 13;
var _FontHeightMargin: number = 4;              // Additional space added to font size when advancing a line.

var _Trace: boolean = true;  // Default the OS trace to be on.

// The OS Kernel and its queues.
var _Kernel: TSOS.Kernel;
var _KernelInterruptQueue;          // Initializing this to null (which I would normally do) would then require us to specify the 'any' type, as below.
var _KernelInputQueue: any = null;  // Is this better? I don't like uninitialized variables. But I also don't like using the type specifier 'any'
var _KernelBuffers: any[] = null;   // when clearly 'any' is not what we want. There is likely a better way, but what is it?

// Standard input and output
var _StdIn;    // Same "to null or not to null" issue as above.
var _StdOut;

// UI
var _Console: TSOS.Console;
var _OsShell: TSOS.Shell;

// Memory Information Table
var _MemoryInformationTableElement: HTMLTableElement;
var _MemoryInformationTable: TSOS.MemoryInformationTable;

// Cpu Statistics Table
var _CpuStatisticsTableElement: HTMLTableElement;
var _CpuStatisticsTable: TSOS.CpuStatisticsTable;

// Process Control Block Table
var _ProcessControlBlockTableElement: HTMLTableElement;
var _ProcessControlBlockTable: TSOS.ProcessControlBlockTable;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode: boolean = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver; //  = null;

var _hardwareClockID: number = null;

// For testing (and enrichment)...
var Glados: any = null;  // This is the function Glados() in glados.js on Labouseur.com.
var _GLaDOS: any = null; // If the above is linked in, this is the instantiated instance of Glados.

var onDocumentLoad = function() {
	TSOS.Control.hostInit();
};
