/// <reference path="jquery.d.ts" />
///<reference path="os/ReadyQueue.ts" />

/* ------------
   Globals.ts
   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in the text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//********************************************************\\
//                 Global CONSTANTS                       \\
//********************************************************\\

// Application Information
const APP_NAME: string    = "Joe/S";   // Joe is Love Joe is Lyfe
const APP_VERSION: string = "0.04";   // 

// System 
const CPU_CLOCK_INTERVAL: number = 100;   // This is in ms (milliseconds) so 1000 = 1 second.

// Interrupts
const TIMER_IRQ:number = 0;                  // Timer         
const KEYBOARD_IRQ:number = 1;               // Keyboard 
const FILE_SYSTEM_IRQ: number = 2;            // File System
const BSOD_IRQ:number = 3;                    // Blue Screen of Death
const PRINT_INTEGER_IRQ:number = 4;          // Print Integer
const PRINT_STRING_IRQ: number = 5;           // Print String
const BREAK_IRQ: number = 6;                 // Break
const INVALID_OPCODE_IRQ:number = 7;         // Invalid Op Code
const INVALID_OPCODE_USE_IRQ:number = 8;     // Invalid Op Code Usage
const MEMORY_OUT_OF_BOUNDS_IRQ:number = 9;   // Memory Out of Bounds
const CREATE_PROCESSS_IRQ:number = 10;        // Create a new process
const START_PROCESS_IRQ:number = 11; 		 // Start a new  process
const TERMINATE_PROCESS_IRQ:number = 12;     // Terminate a  process
const CONTEXT_SWITCH_IRQ:number = 13;        // Context Swtich Between Processes
const END_CPU_IRQ:number = 14;               // Stop the CPU from executing 

// Process States as consts for the Process Control Blocks // Process States \\   
const PROCESS_STATE_NEW: string         = "NEW";           //   * New
const PROCESS_STATE_RUNNING: string     = "RUNNING";       //   * Running
const PROCESS_STATE_WAITING: string     = "WAITING";       //   * Waiting
const PROCESS_STATE_READY: string       = "READY";         //   * Ready
const PROCESS_STATE_TERMINATED: string  = "TERMINATED";    //   * Terminated

// Process Location States
const PROCESS_ON_DISK: string = "DISK";
const PROCESS_IN_MEM:  string = "MEMORY";


// TImer States		
const TIMER_IS_SET: string = "SET";                       //  Set
const TIMER_IS_OFF: string = "OFF";                       //  OFF
const TIMER_NOT_FINISHED: string = "TIMER_NOT_FINISHED";  // Timer not finished yet
const TIMER_FINISHED: string = "TIMER_FINISHED";          // Timer is finished
const TIMER_INDEF: string = "TIMER_GOT_NO_BRAKES";

// Not Really Sure What to Call These Yet
const TIMER_ENDED_PROCESS: string = "TIMER";              // * The timer has been called and ended the user process
const BREAK_ENDED_PROCESS: string = "BREAK";              // * The break instruction was called and ended the user process

// Memory Partition Stuff
const MEMORY_PARTITION_SIZE: number = 256;             // The size of each memory partition
const MEMORY_PARTITION_0_BASE_ADDRESS: number = 0;     // Partition 1
const MEMORY_PARTITION_1_BASE_ADDRESS: number = 256;   // Partition 2
const MEMORY_PARTITION_2_BASE_ADDRESS: number = 512;   // Partition 3 

// CPU Scheduling Algorithms
const ROUND_ROBIN:string = "rr";                   // Round Robin
const FIRST_COME_FIRST_SERVE:string = "fcfs";      // First Come First Serve
const NON_PREEMPTIVE_PRIORITY:string = "priority"; // Non Preemptive Priority

// File System Operations
const CREATE_FILE: string = "OPEN";    // Open File
const DELETE_FILE: string = "DELETE";  // Delete File
const READ_FILE: string = "READ";      // Read File
const WRITE_FILE: string = "WRITE";    // Write File
const LIST_FILES: string = "LIST";     // List Files
const FORMAT_DRIVE: string = "FORMAT"; // Format Drive

// HardDisk Block States
const BLOCK_IN_USE: string = "BLOCK_IN_USE";
const BLOCK_FREE: string = "BLOCK_FREE";

const NO_FILE_DATA: string = "#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#,#";


//********************************************************\\
//                 Global Variables                       \\
//********************************************************\\
// TODO: 
//   1. Make a global object and use that instead of the "_" naming convention in the global namespace.

//********************************************************\\
//                O/S  Variables                          \\
//********************************************************\\

// The Choo Choo CPU
var _CPU: TSOS.Cpu; 

// The Cool Console
var _Console: TSOS.Console;

var _Canvas: HTMLCanvasElement;            // Canvas used to draw console UI
var _DrawingContext: any;                  // Used to track the drawing context of the Console Canvas
var _DefaultFontFamily: string = "sans";   // Sets the consoles default font
var _DefaultFontSize: number = 13;         // Sets the consoles default font size
var _FontHeightMargin: number = 4;         // Sets the consoles default font height margin

// I/O Fo Sho Yo
var _StdIn;     // Input
var _StdOut;    // Output

// The Super Slick Scheduler
var _CPUScheduler: TSOS.CpuScheduler;

// The Sharp Shell
var _OsShell: TSOS.Shell;

// The Magnificent Memory
var _MemoryBlock: TSOS.MemoryBlock;

// The Mighty Memory Mananger
var _MemoryManager: TSOS.MemoryManager; 

// The Mysterious Mode
var _Mode: number = 0;  // 0 = Kernel Mode |  1 = User Mode

// The Dank Disk
var _DiskIsFormated = false;

// The Hardy Hardware Clock
var _hardwareClockID: number = null;

// The Kooky Kernel
var _Kernel: TSOS.Kernel;

// The Timely Timer
var _Timer: TSOS.Timer;

// The Impressive Interrupt Queue
var _KernelInterruptQueue;         

// The Impacfull Input Queue
var _KernelInputQueue: any = null;  

// The Bashful Kernel Buffers
var _KernelBuffers: any[] = null; 

// The Silly Sarcastic Mode
var _SarcasticMode: boolean = false;

// The Trendy Trace
var _Trace: boolean = true;  // Default the OS trace to be on.

// The Obnoxioius OS Clock
var _OSclock: number = 0;  

// An Array of all the available memory partitions available to the operating system
var _MemoryPartitionArray = [];

// Adding the Const Partition Base values to the array
_MemoryPartitionArray[0] = MEMORY_PARTITION_0_BASE_ADDRESS // Partition 0
_MemoryPartitionArray[1] = MEMORY_PARTITION_1_BASE_ADDRESS // Partition 1
_MemoryPartitionArray[2] = MEMORY_PARTITION_2_BASE_ADDRESS // Partition 2

// Used to track if the OS is currently turned on or off
var _SystemIsOn = false;

// CPU Cycle Counter 
var _cpuCycleCounter: number = 0; // Counts the number of times the CPU has cycled 

// Single Step Mode
var _SingleStepMode = false;
var _AllowNextCycle = false;

// The Percise Process Counter
var _ProcessCounterID: number = -1;


//********************************************************\\
//              CPU Scheduling Variables                  \\
//********************************************************\\

// The CPU Scheduling Queues
var _TerminatedProcessQueue: TSOS.Queue;  // Completed Process Queue: Used to Store each PCB once it has been completed
var _ReadyQueue: TSOS.ReadyQueue;             // Queue of all of the currently running processes
var _ResidentList: TSOS.ResidentList;           // Stores a list of all loaded processes
//********************************************************\\
//             Device Driver Variables                    \\
//********************************************************\\

// Global Device Driver Objects - page 12
var _krnKeyboardDriver; //  = null;

var _krnFileSystemDriver; // = null
//********************************************************\\
//                  UI Variables                          \\
//********************************************************\\

// Memory Information Table
var _MemoryInformationTableElement: HTMLTableElement;
var _MemoryInformationTable: TSOS.MemoryInformationTable;

// Cpu Statistics Table
var _CpuStatisticsTableElement: HTMLTableElement;
var _CpuStatisticsTable: TSOS.CpuStatisticsTable;

// Process Control Block Table
var _ProcessControlBlockTableElement: HTMLTableElement;
var _ProcessControlBlockTable: TSOS.ProcessControlBlockTable;

// Single Step Stuff
var _SingleStepToggle: HTMLInputElement;
var _SingleStepButton: HTMLButtonElement;

// Program Running Spinner
var _ProgramSpinner: HTMLElement;

// System Information
var _SystemInformationInterface: TSOS.SystemInformationSection;

// The HTML Elements for the System Information
var _StatusSectionElement: HTMLElement;
var _DateSectionElement: HTMLElement;
var _TimeSectionElement: HTMLElement;

// Terminated Process List UI
var _TerminatedProcessTableElement: HTMLTableElement;
var _TerminatedProcessTable: TSOS.TerminatedProcessTable;

//Ready Queue UI
var _ReadyQueueTableElement: HTMLTableElement;
var _ReadyQueueTable: TSOS.ReadyQueueTable;

// Hard Disk UI
var _HardDiskTableElement: HTMLTableElement;
var _HardDiskTable: TSOS.HardDiskTable;


// Host Log UI Tracker
var lastUIMessage: string = "";
var hostCounter: number = 0;

// Create an image global for the blue screen of death
var BSOD_IMAGE = new Image();

// Get the Image from the web
BSOD_IMAGE.src = "https://neosmart.net/wiki/wp-content/uploads/sites/5/2013/08/unmountable-boot-volume.png"; 

//********************************************************\\
//               Testing Variables                        \\
//********************************************************\\

// For testing (and enrichment)...
var Glados: any = null;  // This is the function Glados() in glados.js on Labouseur.com.
var _GLaDOS: any = null; // If the above is linked in, this is the instantiated instance of Glados.

var onDocumentLoad = function() {
	TSOS.Control.hostInit();
};
