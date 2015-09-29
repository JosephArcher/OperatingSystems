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
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting, instructionSet, //
            memoryBlock //
            ) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            if (instructionSet === void 0) { instructionSet = []; }
            if (memoryBlock === void 0) { memoryBlock = new TSOS.MemoryBlock(); }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.instructionSet = instructionSet;
            this.memoryBlock = memoryBlock;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            //
            this.memoryBlock = new TSOS.MemoryBlock();
            this.memoryBlock.init();
            var instruction; //
            //
            instruction = new TSOS.Instruction(this.LDA, "A9", "-Load the accumulator with a constant");
            this.instructionSet[this.instructionSet.length] = instruction;
            instruction = new TSOS.Instruction(this.LDA, "AD", "-Load the accumulator from memory");
            this.instructionSet[this.instructionSet.length] = instruction;
            instruction = new TSOS.Instruction(this.STA, "8D", "-Store the accumulator in memory");
            this.instructionSet[this.instructionSet.length] = instruction;
            instruction = new TSOS.Instruction(this.ADC, "6D", "-Add with carry \n Adds contents of an address to  the contents of the accumulator and keeps the result in the accumulator");
            this.instructionSet[this.instructionSet.length] = instruction;
            instruction = new TSOS.Instruction(this.LDX, "A2", "-Load the X register with a constant");
            this.instructionSet[this.instructionSet.length] = instruction;
            instruction = new TSOS.Instruction(this.LDX, "AE", "-Load the X register from memory");
            this.instructionSet[this.instructionSet.length] = instruction;
            instruction = new TSOS.Instruction(this.LDY, "A0", "-Load the Y register with a constant");
            this.instructionSet[this.instructionSet.length] = instruction;
            instruction = new TSOS.Instruction(this.LDY, "AC", "-Load the Y register from memory ");
            this.instructionSet[this.instructionSet.length] = instruction;
            instruction = new TSOS.Instruction(this.NOP, "EA", "-No Operation");
            this.instructionSet[this.instructionSet.length] = instruction;
            instruction = new TSOS.Instruction(this.BRK, "00", "- Break (which is really a system call)");
            this.instructionSet[this.instructionSet.length] = instruction;
            instruction = new TSOS.Instruction(this.CPX, "EC", "- Compare a byte in memory to the X reg \n Sets the Z (zero) flag if equal ");
            this.instructionSet[this.instructionSet.length] = instruction;
            instruction = new TSOS.Instruction(this.BNE, "D0", "- Branch n bytes if Z flag = 0 ");
            this.instructionSet[this.instructionSet.length] = instruction;
            instruction = new TSOS.Instruction(this.INC, "EE", "- Increment the value of a byte");
            this.instructionSet[this.instructionSet.length] = instruction;
            instruction = new TSOS.Instruction(this.SYS, "FF", "-System Call \n  #$01 in X reg = print the integer stored in the Y register \n  #$02 in X reg = print the 00-terminated string stored at the address in the Y register");
            this.instructionSet[this.instructionSet.length] = instruction;
        };
        Cpu.prototype.LDA = function () {
        };
        Cpu.prototype.STA = function () {
        };
        Cpu.prototype.ADC = function () {
        };
        Cpu.prototype.LDX = function () {
        };
        Cpu.prototype.LDY = function () {
        };
        Cpu.prototype.NOP = function () {
        };
        Cpu.prototype.BRK = function () {
        };
        Cpu.prototype.CPX = function () {
        };
        Cpu.prototype.BNE = function () {
        };
        Cpu.prototype.INC = function () {
        };
        Cpu.prototype.SYS = function () {
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
