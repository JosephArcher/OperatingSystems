///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="Instruction.ts" />
///<reference path="memory.ts" />
///<reference path="byte.ts" />
///<reference path="../os/memoryManager.ts"/>
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
        function Cpu() {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.instructionSet = []; // An array filled with the 6502A instructions 
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.instructionSet = []; // An array filled with the 6502A instructions 
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            //
            var instruction;
            // A9 Instruction 
            instruction = new TSOS.Instruction(this.loadAccumulatorConstant, "A9", "-Load the accumulator with a constant");
            this.instructionSet[this.instructionSet.length] = instruction;
            // AD Instruction 
            instruction = new TSOS.Instruction(this.loadAccumulatorMemory, "AD", "-Load the accumulator from memory");
            this.instructionSet[this.instructionSet.length] = instruction;
            // 8D Instruction 
            instruction = new TSOS.Instruction(this.storeAccumulatorMemory, "8D", "-Store the accumulator in memory");
            this.instructionSet[this.instructionSet.length] = instruction;
            // 6D Instruction 
            instruction = new TSOS.Instruction(this.addWithCarry, "6D", "-Add with carry \n Adds contents of an address to  the contents of the accumulator and keeps the result in the accumulator");
            this.instructionSet[this.instructionSet.length] = instruction;
            // A2 Instruction 
            instruction = new TSOS.Instruction(this.loadXRegistrarWithConstant, "A2", "-Load the X register with a constant");
            this.instructionSet[this.instructionSet.length] = instruction;
            // AE Instruction 
            instruction = new TSOS.Instruction(this.loadXRegistrarFromMemory, "AE", "-Load the X register from memory");
            this.instructionSet[this.instructionSet.length] = instruction;
            // A0 Instruction 
            instruction = new TSOS.Instruction(this.loadYRegistrarWithConstant, "A0", "-Load the Y register with a constant");
            this.instructionSet[this.instructionSet.length] = instruction;
            // AC Instruction 
            instruction = new TSOS.Instruction(this.loadYRegistrarFromMemory, "AC", "-Load the Y register from memory ");
            this.instructionSet[this.instructionSet.length] = instruction;
            // EA Instruction 
            instruction = new TSOS.Instruction(this.noOperation, "EA", "-No Operation");
            this.instructionSet[this.instructionSet.length] = instruction;
            // 00 Instruction 
            instruction = new TSOS.Instruction(this.breakOperation, "00", "- Break (which is really a system call)");
            this.instructionSet[this.instructionSet.length] = instruction;
            // EC Instruction 
            instruction = new TSOS.Instruction(this.compareByte, "EC", "- Compare a byte in memory to the X reg \n Sets the Z (zero) flag if equal ");
            this.instructionSet[this.instructionSet.length] = instruction;
            // D0 Instruction 
            instruction = new TSOS.Instruction(this.branchBytes, "D0", "- Branch n bytes if Z flag = 0 ");
            this.instructionSet[this.instructionSet.length] = instruction;
            // EE Instruction 
            instruction = new TSOS.Instruction(this.incrementByte, "EE", "- Increment the value of a byte");
            this.instructionSet[this.instructionSet.length] = instruction;
            // FF Instruction 
            instruction = new TSOS.Instruction(this.systemCall, "FF", "-System Call \n  #$01 in X reg = print the integer stored in the Y register \n  #$02 in X reg = print the 00-terminated string stored at the address in the Y register");
            this.instructionSet[this.instructionSet.length] = instruction;
        };
        /**
        * Load the Accumulator with a constant
        * Uses the next byte for the constant value
       */
        Cpu.prototype.loadAccumulatorConstant = function () {
            // Get the next byte from memory to use as a constant value
            var nextMemoryLocation = _MemoryManager0.getByte(_CPU.PC + 1);
            // Set the accumulator to the deciamal value of the next Byte
            _CPU.Acc = parseInt(nextMemoryLocation.getValue(), 16);
            // //Update the User Interface to display the change to the value
            _CpuStatisticsTable.setAccumulator(_CPU.Acc + "");
            // // Increment the Program Counter 
            _CPU.PC = _CPU.PC + 2;
        };
        /**
         * Load the Accumulator from memory
         * Uses the next 2 bytes as the memory address
        */
        Cpu.prototype.loadAccumulatorMemory = function () {
            // Get the next two bytes from memory
            var nextTwoBytes = _MemoryManager0.getTwoBytes(_CPU.PC + 1, _CPU.PC + 2);
            var memoryLocation1 = nextTwoBytes[0].getValue();
            var memoryLocation2 = nextTwoBytes[1].getValue();
            var hexLocation = memoryLocation1 + memoryLocation2 + "";
            var loadLocation = parseInt(TSOS.Utils.hexToDecimal(hexLocation), 10); //This is the location in memory
            console.log("The location to load from is .. " + loadLocation);
            var testByte = _MemoryManager0.getByte(loadLocation);
            this.Acc = parseInt(testByte.getValue(), 10);
            _CPU.PC = _CPU.PC + 3;
        };
        /**
         * Store the Accumulator in memory
         * Uses the next 2 bytes as the memory address
        */
        Cpu.prototype.storeAccumulatorMemory = function () {
            var valueToBeSet = _CPU.Acc + "";
            // Get the next two bytes from memory
            var nextTwoBytes = _MemoryManager0.getTwoBytes(_CPU.PC + 1, _CPU.PC + 2);
            var memoryLocation1 = nextTwoBytes[0].getValue();
            var memoryLocation2 = nextTwoBytes[1].getValue();
            var hexLocation = memoryLocation1 + memoryLocation2 + "";
            var loadLocation = parseInt(TSOS.Utils.hexToDecimal(hexLocation), 10); //This is the location in memory
            _MemoryManager0.setByte(loadLocation, valueToBeSet);
            _MemoryInformationTable.setCellData(loadLocation, valueToBeSet);
            _CPU.PC = _CPU.PC + 3;
        };
        /**
         * Add with carry - Adds the contents of an address to the contents of the accumulator and keeps the result in the accumulator
         * Uses the next 2 bytes as the memory address
        */
        Cpu.prototype.addWithCarry = function () {
            // Get the next two bytes from memory
            var nextTwoBytes = _MemoryManager0.getTwoBytes(_CPU.PC + 1, _CPU.PC + 2);
            var memoryLocation1 = nextTwoBytes[0].getValue();
            var memoryLocation2 = nextTwoBytes[1].getValue();
            var hexLocation = memoryLocation1 + memoryLocation2 + "";
            var loadLocation = parseInt(TSOS.Utils.hexToDecimal(hexLocation), 10); //This is the location in memory
            var byteAtLocation = _MemoryManager0.getByte(loadLocation);
            var valueAtLocation = parseInt(byteAtLocation.getValue(), 16);
            console.log("The value of the location in memory is ... " + valueAtLocation);
            _CPU.Acc = _CPU.Acc + valueAtLocation;
            _CpuStatisticsTable.setAccumulator(_CPU.Acc + "");
            console.log("The new acc value is  " + _CPU.Acc);
            _CPU.PC = _CPU.PC + 3;
        };
        /**
         * Load the X register with a constant
         * Uses the next byte as the value
        */
        Cpu.prototype.loadXRegistrarWithConstant = function () {
            // Get the next byte from memory to use as a constant value
            var nextMemoryLocation = _MemoryManager0.getByte(_CPU.PC + 1);
            // Set the accumulator to the deciamal value of the next Byte
            _CPU.Xreg = parseInt(nextMemoryLocation.getValue(), 16);
            // //Update the User Interface to display the change to the value
            _CpuStatisticsTable.setXRegister(_CPU.Xreg + "");
            // // Increment the Program Counter 
            _CPU.PC = _CPU.PC + 2;
        };
        /**
         * Load the X register from memory
         * Uses the next 2 bytes as the memory address
        */
        Cpu.prototype.loadXRegistrarFromMemory = function () {
            var memoryLocationPart1 = _MemoryManager0.getByte(_MemoryManager0.currentProcess.programCounter + 1).getValue();
            var memoryLocationPart2 = _MemoryManager0.getByte(_MemoryManager0.currentProcess.programCounter + 2).getValue();
            var hexLocation = memoryLocationPart1 + memoryLocationPart2 + "";
            var memoryLocation = parseInt(TSOS.Utils.hexToDecimal(hexLocation), 10); //This is the location in memory
            var value = _MemoryManager0.getByte(memoryLocation).getValue();
            this.Xreg = parseInt(value, 16);
            _CpuStatisticsTable.setXRegister(this.Xreg + "");
            _MemoryManager0.currentProcess.programCounter = _MemoryManager0.currentProcess.programCounter + 3;
        };
        /**
         * Load the Y register with a constant
         * Uses the next byte as the value
        */
        Cpu.prototype.loadYRegistrarWithConstant = function () {
            var memoryLocation1 = _MemoryManager0.getByte(_MemoryManager0.currentProcess.programCounter + 1);
            this.Yreg = parseInt(memoryLocation1.getValue(), 16);
            _CpuStatisticsTable.setYRegister(this.Yreg + "");
            _MemoryManager0.currentProcess.programCounter = _MemoryManager0.currentProcess.programCounter + 2;
        };
        /**
         * Load the Y register from memory
         * Uses the next 2 bytes as the memory address
        */
        Cpu.prototype.loadYRegistrarFromMemory = function () {
            // Get the next two bytes from memory
            var nextTwoBytes = _MemoryManager0.getTwoBytes(_CPU.PC + 1, _CPU.PC + 2);
            var memoryLocation1 = nextTwoBytes[0].getValue();
            var memoryLocation2 = nextTwoBytes[1].getValue();
            var hexLocation = memoryLocation1 + memoryLocation2 + "";
            var loadLocation = parseInt(TSOS.Utils.hexToDecimal(hexLocation), 10); //This is the location in memory
            console.log("The location to load from is .. " + loadLocation);
            var testByte = _MemoryManager0.getByte(loadLocation);
            _CPU.Yreg = parseInt(testByte.getValue(), 10);
            _CpuStatisticsTable.setYRegister(_CPU.Yreg + "");
            _CPU.PC = _CPU.PC + 3;
        };
        /**
         * No Operation
        */
        Cpu.prototype.noOperation = function () {
            // Do Nothing
            console.log("No Operation");
            _CPU.PC = _CPU.PC + 1;
        };
        /**
         *  Break (Which really is a system call)
        */
        Cpu.prototype.breakOperation = function () {
            // Need to save the state of the CPU into the Program Control Block here and then add it back to the start of the ready queue
            _CPU.saveProcessControlBlock();
            _Kernel.createAndQueueInterrupt(BREAK_IRQ, false);
        };
        /**
         * Comapares a byte in memory to the x reg ands sets the z flag if equal
         * Uses the next 2 bytes as the memory address
        */
        Cpu.prototype.compareByte = function () {
            var memoryLocationPart1 = _MemoryManager0.getByte(_MemoryManager0.currentProcess.programCounter + 1).getValue();
            var memoryLocationPart2 = _MemoryManager0.getByte(_MemoryManager0.currentProcess.programCounter + 2).getValue();
            var hexLocation = memoryLocationPart1 + memoryLocationPart2 + "";
            var memoryLocation = parseInt(TSOS.Utils.hexToDecimal(hexLocation), 10); //This is the location in memory
            var memoryValue = parseInt(_MemoryManager0.getByte(memoryLocation).getValue(), 16);
            var xRegValue = this.Xreg;
            if (memoryValue == xRegValue) {
                this.Zflag = 1;
            }
        };
        /**
         * Branch n bytes if z flag is equal to zero
         * Uses the next byte as the value
        */
        Cpu.prototype.branchBytes = function () {
        };
        /**
         * Increment the value of a byte
         * Uses the next 2 bytes as the memory address
        */
        Cpu.prototype.incrementByte = function () {
            var memoryLocationPart1 = _MemoryManager0.getByte(_MemoryManager0.currentProcess.programCounter + 1).getValue();
            var memoryLocationPart2 = _MemoryManager0.getByte(_MemoryManager0.currentProcess.programCounter + 2).getValue();
            var hexLocation = memoryLocationPart1 + memoryLocationPart2 + "";
            var memoryLocation = parseInt(TSOS.Utils.hexToDecimal(hexLocation), 10); //This is the location in memory
            var memoryValue = parseInt(_MemoryManager0.getByte(memoryLocation).getValue(), 16);
            console.log(memoryValue + "Before Inc");
            memoryValue = memoryValue + 1;
            console.log(memoryValue + "After Inc");
            _MemoryManager0.setByte(memoryLocation, memoryValue.toString(16));
        };
        /**
         * System Call
         * $01 in X reg = print the integer stored in the Y register
         * $02 in X reg = print the 00-terminated string stored at the address in the Y register
        */
        Cpu.prototype.systemCall = function () {
            // #$01 in X reg = print the integer stored in the Y register.
            if (_CPU.Xreg == 1) {
                _CPU.saveProcessControlBlock();
                // Should type check here
                _Kernel.createAndQueueInterrupt(PRINT_IRQ, _CPU.Yreg + "");
            }
            else if (_CPU.Xreg == 2) {
                //Should type check here
                _Kernel.createAndQueueInterrupt(PRINT_IRQ, _CPU.Yreg + "");
            }
            else {
                _Kernel.createAndQueueInterrupt(INVALID_OPCODE_USE_IRQ, "Error xReg value not valid syscall value");
            }
            _CPU.PC = _CPU.PC + 1;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // Update the cpu status Bar
            _CpuStatisticsTable.updateStatusBar();
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            _CpuStatisticsTable.setProgramCounter(_CPU.PC + "");
            // Fetch the next memory location according to the value of the program counter
            var nextMemoryLocation = this.PC;
            // Get the next Byte at the Location
            var nextByte = _MemoryManager0.getByte(nextMemoryLocation);
            // Get the value of the byte            
            var nextInstruction = nextByte.getValue();
            console.log("Next Instruction: " + nextInstruction);
            var nextOpCode;
            var nextInstructionFunction;
            // Loop over the instruction set checking the value of the byte for a matching Op Code
            for (var i = 0; i < this.instructionSet.length; i++) {
                nextOpCode = this.instructionSet[i];
                // If one of the Op Codes matches the next instruction
                if (nextOpCode.opCode == nextInstruction) {
                    console.log("Found a matching op code");
                    nextInstructionFunction = nextOpCode.function; // Set the function of next instruction                   
                    nextInstructionFunction(this.PC); // Execute the function
                    _ProcessControlBlockTable.updateTableContents(_ReadyQueue.first());
                    return;
                }
            }
            // Invalid Op Code
            _Kernel.createAndQueueInterrupt(INVALID_OPCODE_IRQ, nextInstruction);
            return;
        };
        Cpu.prototype.saveProcessControlBlock = function () {
            var currentProcess = _ReadyQueue.first();
            currentProcess.setProcessState(PROCESS_STATE_READY);
            currentProcess.setProgramCounter(_CPU.PC);
            currentProcess.setAcc(_CPU.Acc);
            currentProcess.setXReg(_CPU.Xreg);
            currentProcess.setYReg(_CPU.Yreg);
            currentProcess.setZFlag(_CPU.Zflag);
        };
        Cpu.prototype.beginExecuting = function (process) {
            _CPU.PC = parseInt(process.getProgramCounter(), 16);
            _CPU.Acc = parseInt(process.getAcc(), 16);
            _CPU.Xreg = parseInt(process.getXReg(), 16);
            _CPU.Yreg = parseInt(process.getYReg(), 16);
            _CPU.Zflag = parseInt(process.getZFlag(), 16);
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
