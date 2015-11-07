///<reference path="os/collections.ts" />
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
var APP_NAME = "Joe/S"; // Joe is Love Joe is Lyfe
var APP_VERSION = "0.03"; // 
// System 
var CPU_CLOCK_INTERVAL = 100; // This is in ms (milliseconds) so 1000 = 1 second.
// Interrupts
var TIMER_IRQ = 0; // Timer         
var KEYBOARD_IRQ = 1; // Keyboard 
var BSOD_IRQ = 2; // Blue Screen of Death
var PRINT_INTEGER_IRQ = 3; // Print Integer
var PRINT_STRING_IRQ = 4; // Print String
var BREAK_IRQ = 5; // Break
var INVALID_OPCODE_IRQ = 6; // Invalid Op Code
var INVALID_OPCODE_USE_IRQ = 7; // Invalid Op Code Usage
var MEMORY_OUT_OF_BOUNDS_IRQ = 8; // Memory Out of Bounds
var CREATE_PROCESSS_IRQ = 9; // Create a new process
var START_PROCESS_IRQ = 10; // Start a new  process
var TERMINATE_PROCESS_IRQ = 11; // Terminate a  process
var CONTEXT_SWITCH_IRQ = 12; // Context Swtich Between Processes
// Process States as consts for the Process Control Blocks // Process States \\   
var PROCESS_STATE_NEW = "NEW"; //   * New
var PROCESS_STATE_RUNNING = "RUNNING"; //   * Running
var PROCESS_STATE_WAITING = "WAITING"; //   * Waiting
var PROCESS_STATE_READY = "READY"; //   * Ready
var PROCESS_STATE_TERMINATED = "TERMINATED"; //   * Terminated
// TImer States		
var TIMER_IS_SET = "SET"; //  Set
var TIMER_IS_OFF = "OFF"; //  OFF
var TIMER_NOT_FINISHED = "TIMER_NOT_FINISHED"; // Timer not finished yet
var TIMER_FINISHED = "TIMER_FINISHED"; // Timer is finished
// Not Really Sure What to Call These Yet
var TIMER_ENDED_PROCESS = "TIMER"; // * The timer has been called and ended the user process
var BREAK_ENDED_PROCESS = "BREAK"; // * The break instruction was called and ended the user process
// Memory Partition Stuff
var MEMORY_PARTITION_SIZE = 256; // The size of each memory partition
var MEMORY_PARTITION_0_BASE_ADDRESS = 0; // Partition 1
var MEMORY_PARTITION_1_BASE_ADDRESS = 256; // Partition 2
var MEMORY_PARTITION_2_BASE_ADDRESS = 512; // Partition 3 
// CPU Scheduling Algorithms
var ROUND_ROBIN = "Round Robin"; // Round Robin
//********************************************************\\
//                 Global Variables                       \\
//********************************************************\\
// TODO: 
//   1. Make a global object and use that instead of the "_" naming convention in the global namespace.
//********************************************************\\
//                O/S  Variables                          \\
//********************************************************\\
// The Choo Choo CPU
var _CPU;
// The Cool Console
var _Console;
var _Canvas; // Canvas used to draw console UI
var _DrawingContext; // Used to track the drawing context of the Console Canvas
var _DefaultFontFamily = "sans"; // Sets the consoles default font
var _DefaultFontSize = 13; // Sets the consoles default font size
var _FontHeightMargin = 4; // Sets the consoles default font height margin
// I/O Fo Sho Yo
var _StdIn; // Input
var _StdOut; // Output
// The Super Slick Scheduler
var _CPUScheduler;
console.log(_CPUScheduler + " SDFKLJSDKLFJSLKDFJLKSDJFKLSJDFKLSDF");
// The Sharp Shell
var _OsShell;
// The Magnificent Memory
var _MemoryBlock;
// The Mighty Memory Mananger
var _MemoryManager;
// The Mysterious Mode
var _Mode = 0; // 0 = Kernel Mode |  1 = User Mode
// The Hardy Hardware Clock
var _hardwareClockID = null;
// The Kooky Kernel
var _Kernel;
// The Timely Timer
var _Timer;
// The Impressive Interrupt Queue
var _KernelInterruptQueue;
// The Impacfull Input Queue
var _KernelInputQueue = null;
// The Bashful Kernel Buffers
var _KernelBuffers = null;
// The Silly Sarcastic Mode
var _SarcasticMode = false;
// The Trendy Trace
var _Trace = true; // Default the OS trace to be on.
// The Obnoxioius OS Clock
var _OSclock = 0;
// An Array of all the available memory partitions available to the operating system
var _MemoryPartitionArray = [];
// Adding the Const Partition Base values to the array
_MemoryPartitionArray[0] = MEMORY_PARTITION_0_BASE_ADDRESS; // Partition 0
_MemoryPartitionArray[1] = MEMORY_PARTITION_1_BASE_ADDRESS; // Partition 1
_MemoryPartitionArray[2] = MEMORY_PARTITION_2_BASE_ADDRESS; // Partition 2
// Used to track if the OS is currently turned on or off
var _SystemIsOn = false;
// CPU Cycle Counter 
var _cpuCycleCounter = 0; // Counts the number of times the CPU has cycled 
// Single Step Mode
var _SingleStepMode = false;
var _AllowNextCycle = false;
// The Percise Process Counter
var _ProcessCounterID = -1;
//********************************************************\\
//              CPU Scheduling Variables                  \\
//********************************************************\\
// The CPU Scheduling Queues
var _TerminatedProcessQueue; // Completed Process Queue: Used to Store each PCB once it has been completed
var _ReadyQueue; // Queue of all of the currently running processes
var _ResidentList; // Stores a list of all loaded processes
//********************************************************\\
//             Device Driver Variables                    \\
//********************************************************\\
// Global Device Driver Objects - page 12
var _krnKeyboardDriver; //  = null;
//********************************************************\\
//                  UI Variables                          \\
//********************************************************\\
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
// Create an image global for the blue screen of death
var BSOD_IMAGE = new Image();
// Get the Image from the web
BSOD_IMAGE.src = "https://neosmart.net/wiki/wp-content/uploads/sites/5/2013/08/unmountable-boot-volume.png";
//********************************************************\\
//               Testing Variables                        \\
//********************************************************\\
// For testing (and enrichment)...
var Glados = null; // This is the function Glados() in glados.js on Labouseur.com.
var _GLaDOS = null; // If the above is linked in, this is the instantiated instance of Glados.
var onDocumentLoad = function () {
    TSOS.Control.hostInit();
};
