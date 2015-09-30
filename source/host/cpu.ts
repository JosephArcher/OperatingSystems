///<reference path="../globals.ts" />
///<reference path="Instruction.ts" />
///<reference path="memory.ts" />

/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Cpu {



        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false,
                    public instructionSet = [] //
                 
                    ) {

        }
        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            //
            var instruction; //

            //
            instruction = new Instruction(this.LDA,
                "A9",
                "-Load the accumulator with a constant");
            this.instructionSet[this.instructionSet.length] = instruction;

            instruction = new Instruction(this.LDA,
                "AD",
                "-Load the accumulator from memory");
            this.instructionSet[this.instructionSet.length] = instruction;

            instruction = new Instruction(this.STA,
                "8D",
                "-Store the accumulator in memory");
            this.instructionSet[this.instructionSet.length] = instruction;

            instruction = new Instruction(this.ADC,
                "6D",
                "-Add with carry \n Adds contents of an address to  the contents of the accumulator and keeps the result in the accumulator");
            this.instructionSet[this.instructionSet.length] = instruction;

            instruction = new Instruction(this.LDX,
                "A2",
                "-Load the X register with a constant");
            this.instructionSet[this.instructionSet.length] = instruction;

            instruction = new Instruction(this.LDX,
                "AE",
                "-Load the X register from memory");
            this.instructionSet[this.instructionSet.length] = instruction;

            instruction = new Instruction(this.LDY,
                "A0",
                "-Load the Y register with a constant");
            this.instructionSet[this.instructionSet.length] = instruction;

            instruction = new Instruction(this.LDY,
                "AC",
                "-Load the Y register from memory ");
            this.instructionSet[this.instructionSet.length] = instruction;

            instruction = new Instruction(this.NOP,
                "EA",
                "-No Operation");
            this.instructionSet[this.instructionSet.length] = instruction;

            instruction = new Instruction(this.BRK,
                "00",
                "- Break (which is really a system call)");
            this.instructionSet[this.instructionSet.length] = instruction;

            instruction = new Instruction(this.CPX,
                "EC",
                "- Compare a byte in memory to the X reg \n Sets the Z (zero) flag if equal ");
            this.instructionSet[this.instructionSet.length] = instruction;

            instruction = new Instruction(this.BNE,
                "D0",
                "- Branch n bytes if Z flag = 0 ");
            this.instructionSet[this.instructionSet.length] = instruction;

            instruction = new Instruction(this.INC,
                "EE",
                "- Increment the value of a byte");
            this.instructionSet[this.instructionSet.length] = instruction;

            instruction = new Instruction(this.SYS,
                "FF",
                "-System Call \n  #$01 in X reg = print the integer stored in the Y register \n  #$02 in X reg = print the 00-terminated string stored at the address in the Y register");
            this.instructionSet[this.instructionSet.length] = instruction;
        }
        public LDA() {
            //this.Acc
        }
        public STA() {

        }
        public ADC() {

        }
        public LDX() {

        }
        public LDY() {

        }
        public NOP() {

        }
        public BRK() {


        }
        public CPX() {

        }
        public BNE() {

        }
        public INC() {

        }
        public SYS() {

        }
        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            
            //Fetch the next instruction from memory

            // Decode it... Determine what CPU routine to call 

            // Call the routine

        }
    }

}
