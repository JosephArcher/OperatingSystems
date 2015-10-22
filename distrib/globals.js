///<reference path="os/collections.ts" /> // Imported in order to use linked list data type
/// <reference path="jquery.d.ts" />
/* ------------
   Globals.ts
   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in the text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */
//
// Global CONSTANTS (TypeScript 1.5 introduced const. Very cool.)
//
var APP_NAME = "Joe/S"; // Joe is Love Joe is Lyfe
var APP_VERSION = "0.02"; // Second Project so second version ? 
var CPU_CLOCK_INTERVAL = 100; // This is in ms (milliseconds) so 1000 = 1 second.
// Timer Interrupt
var TIMER_IRQ = 0; // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
// Keyboard Interrupt    
var KEYBOARD_IRQ = 1; // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
// This is for the Blue Screen Of Death command
var BSOD_IRQ = 2;
// Print Integer Operation system call
var PRINT_INTEGER_IRQ = 3;
// Print string Opertion system call
var PRINT_STRING_IRQ = 4;
// Break Operation system call
var BREAK_IRQ = 5;
// Invalid Op Code
var INVALID_OPCODE_IRQ = 6;
// Incorrect use of an Op Code
var INVALID_OPCODE_USE_IRQ = 7;
// Process States as consts for the Process Control Blocks
var PROCESS_STATE_NEW = "NEW";
var PROCESS_STATE_RUNNING = "RUNNING";
var PROCESS_STATE_WAITING = "WAITING";
var PROCESS_STATE_READY = "READY";
var PROCESS_STATE_TERMINATED = "TERMINATED";
// The base addresses for each memory partition
var MEMORY_PARTITION_0_BASE_ADDRESS = 0;
var MEMORY_PARTITION_1_BASE_ADDRESS = 256;
var MEMORY_PARTITION_2_BASE_ADDRESS = 512;
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
// Used to track if the OS is currently turned on or off
var _SystemIsOn = false;
// Single Step Mode
var _SingleStepMode = false;
var _AllowNextCycle = false;
// Used to create the auto incrementing process ID's for the Process Control Blocks
var _ProcessCounterID = -1;
// Create an image global for the blue screen of death
var BSOD_IMAGE = new Image();
// Get the Image from the web
BSOD_IMAGE.src = "https://neosmart.net/wiki/wp-content/uploads/sites/5/2013/08/unmountable-boot-volume.png";
var _CPU; // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.
// The Memory for the cpu
var _MemoryBlock;
// The Manager for the Memory
var _MemoryManager;
// Current Process
var _CurrentProcess;
var _OSclock = 0; // Page 23.
var _Mode = 0; // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.
var _Canvas; // Initialized in Control.hostInit().
var _DrawingContext; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily = "sans"; // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4; // Additional space added to font size when advancing a line.
var _Trace = true; // Default the OS trace to be on.
// The OS Kernel and its queues.
var _Kernel;
var _KernelInterruptQueue; // Initializing this to null (which I would normally do) would then require us to specify the 'any' type, as below.
var _KernelInputQueue = null; // Is this better? I don't like uninitialized variables. But I also don't like using the type specifier 'any'
var _KernelBuffers = null; // when clearly 'any' is not what we want. There is likely a better way, but what is it?
// Create the Ready Queue as a Linked List of Process Control Blocks
var _ReadyQueue;
// Create the Resident Queue as a Queue
var _ResidentQueue;
// Standard input and output
var _StdIn; // Same "to null or not to null" issue as above.
var _StdOut;
// UI
var _Console;
var _OsShell;
// Memory Information Table
var _MemoryInformationTableElement;
var _MemoryInformationTable;
// Cpu Statistics Table
var _CpuStatisticsTableElement;
var _CpuStatisticsTable;
// Process Control Block Table
var _ProcessControlBlockTableElement;
var _ProcessControlBlockTable;
// Single Step Stuff
var _SingleStepToggle;
var _SingleStepButton;
// Program Running Spinner
var _ProgramSpinner;
// System Information
var _SystemInformationInterface;
// The HTML Elements for the System Information
var _StatusSectionElement;
var _DateSectionElement;
var _TimeSectionElement;
// Resident List UI
var _ResidentListTableElement;
var _ResidentListTable;
//Ready Queue UI
var _ReadyQueueTableElement;
var _ReadyQueueTable;
// CPU Scheduler
var _CPUScheduler;
// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;
// Global Device Driver Objects - page 12
var _krnKeyboardDriver; //  = null;
var _hardwareClockID = null;
// For testing (and enrichment)...
var Glados = null; // This is the function Glados() in glados.js on Labouseur.com.
var _GLaDOS = null; // If the above is linked in, this is the instantiated instance of Glados.
var onDocumentLoad = function () {
    TSOS.Control.hostInit();
};
