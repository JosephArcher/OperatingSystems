///<reference path="memory.ts" />
///<reference path="byte.ts" />
///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="Instruction.ts" />
///<reference path="../os/memoryManager.ts"/>
///<reference path="../os/interrupt.ts"/>
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
            instruction = new TSOS.Instruction(this.loadAccumulatorConstant, "A9", "-Load the accumulator with a constant", 1);
            this.instructionSet[this.instructionSet.length] = instruction;
            // AD Instruction 
            instruction = new TSOS.Instruction(this.loadAccumulatorMemory, "AD", "-Load the accumulator from memory", 2);
            this.instructionSet[this.instructionSet.length] = instruction;
            // 8D Instruction 
            instruction = new TSOS.Instruction(this.storeAccumulatorMemory, "8D", "-Store the accumulator in memory", 2);
            this.instructionSet[this.instructionSet.length] = instruction;
            // 6D Instruction 
            instruction = new TSOS.Instruction(this.addWithCarry, "6D", "-Add with carry \n Adds contents of an address to  the contents of the accumulator and keeps the result in the accumulator", 2);
            this.instructionSet[this.instructionSet.length] = instruction;
            // A2 Instruction 
            instruction = new TSOS.Instruction(this.loadXRegistrarWithConstant, "A2", "-Load the X register with a constant", 1);
            this.instructionSet[this.instructionSet.length] = instruction;
            // AE Instruction 
            instruction = new TSOS.Instruction(this.loadXRegistrarFromMemory, "AE", "-Load the X register from memory", 2);
            this.instructionSet[this.instructionSet.length] = instruction;
            // A0 Instruction 
            instruction = new TSOS.Instruction(this.loadYRegistrarWithConstant, "A0", "-Load the Y register with a constant", 1);
            this.instructionSet[this.instructionSet.length] = instruction;
            // AC Instruction 
            instruction = new TSOS.Instruction(this.loadYRegistrarFromMemory, "AC", "-Load the Y register from memory ", 2);
            this.instructionSet[this.instructionSet.length] = instruction;
            // EA Instruction 
            instruction = new TSOS.Instruction(this.noOperation, "EA", "-No Operation", 0);
            this.instructionSet[this.instructionSet.length] = instruction;
            // 00 Instruction 
            instruction = new TSOS.Instruction(this.breakOperation, "00", "- Break (which is really a system call)", 0);
            this.instructionSet[this.instructionSet.length] = instruction;
            // EC Instruction 
            instruction = new TSOS.Instruction(this.compareByte, "EC", "- Compare a byte in memory to the X reg \n Sets the Z (zero) flag if equal ", 2);
            this.instructionSet[this.instructionSet.length] = instruction;
            // D0 Instruction 
            instruction = new TSOS.Instruction(this.branchBytes, "D0", "- Branch n bytes if Z flag = 0 ", 1);
            this.instructionSet[this.instructionSet.length] = instruction;
            // EE Instruction 
            instruction = new TSOS.Instruction(this.incrementByte, "EE", "- Increment the value of a byte", 2);
            this.instructionSet[this.instructionSet.length] = instruction;
            // FF Instruction 
            instruction = new TSOS.Instruction(this.systemCall, "FF", "-System Call \n  #$01 in X reg = print the integer stored in the Y register \n  #$02 in X reg = print the 00-terminated string stored at the address in the Y register", 0);
            this.instructionSet[this.instructionSet.length] = instruction;
        };
        /**
        * Load the Accumulator with a constant
        * Uses the next byte for the constant value
       */
        Cpu.prototype.loadAccumulatorConstant = function () {
            // console.log("Loading the accumulator with a constant");
            // Get the next byte from memory to use as a constant value
            var nextMemoryLocation = _MemoryManager0.getByte(_CPU.PC + 1);
            //console.log("The hex value of the constant is " + nextMemoryLocation.getValue());
            // console.log("The Decimal value of the constant is " + parseInt(nextMemoryLocation.getValue(), 16) + "");
            // Set the accumulator to the deciamal value of the next Byte
            _CPU.Acc = parseInt(nextMemoryLocation.getValue(), 16);
        };
        /**
         * Load the Accumulator from memory
         * Uses the next 2 bytes as the memory address
        */
        Cpu.prototype.loadAccumulatorMemory = function () {
            // console.log("Loading the accumulator from memory");
            // Get the next two bytes from memory in an array
            var nextTwoBytes = _MemoryManager0.getTwoBytes(_CPU.PC + 1, _CPU.PC + 2);
            var loadLocation = _CPU.findLoadLocation(nextTwoBytes);
            var byteAtLocation = _MemoryManager0.getByte(loadLocation);
            // Set the accumulator to the decimal value of the value in memory
            _CPU.Acc = parseInt(byteAtLocation.getValue(), 16);
        };
        /**
         * Store the Accumulator in memory
         * Uses the next 2 bytes as the memory address
        */
        Cpu.prototype.storeAccumulatorMemory = function () {
            // console.log("Storing the accumulator in memory");
            //var valueToBeSet:string = _CPU.Acc + "";
            // Get the next two bytes from memory
            var nextTwoBytes = _MemoryManager0.getTwoBytes(_CPU.PC + 1, _CPU.PC + 2);
            var loadLocation = _CPU.findLoadLocation(nextTwoBytes);
            // Change the value in the memory 
            _MemoryManager0.setByte(loadLocation, _CPU.Acc.toString(16));
            // Update the memory UI Table
            _MemoryInformationTable.setCellData(loadLocation, _CPU.Acc.toString(16));
        };
        /**
         * Add with carry - Adds the contents of an address to the contents of the accumulator and keeps the result in the accumulator
         * Uses the next 2 bytes as the memory address
        */
        Cpu.prototype.addWithCarry = function () {
            //  console.log("Adding with carry");
            // Get the next two bytes from memory
            var nextTwoBytes = _MemoryManager0.getTwoBytes(_CPU.PC + 1, _CPU.PC + 2);
            var loadLocation = _CPU.findLoadLocation(nextTwoBytes);
            var byteAtLocation = _MemoryManager0.getByte(loadLocation);
            var valueAtLocation = parseInt(byteAtLocation.getValue(), 16);
            //  console.log("The value of the location in memory is ... " + valueAtLocation);
            // Set the accumulator 
            _CPU.Acc = _CPU.Acc + valueAtLocation;
        };
        /**
         * Load the X register with a constant
         * Uses the next byte as the value
        */
        Cpu.prototype.loadXRegistrarWithConstant = function () {
            //  console.log("Loading the X reg with a constant");
            // Get the next byte from memory to use as a constant value
            var nextMemoryLocation = _MemoryManager0.getByte(_CPU.PC + 1);
            // console.log("The hex value of the constant is " + nextMemoryLocation.getValue());
            //  console.log("The Decimal value of the constant is " + parseInt(nextMemoryLocation.getValue(), 16) + "");
            // Set the accumulator to the deciamal value of the next Byte
            _CPU.Xreg = parseInt(nextMemoryLocation.getValue(), 16);
        };
        /**
         * Load the X register from memory
         * Uses the next 2 bytes as the memory address
        */
        Cpu.prototype.loadXRegistrarFromMemory = function () {
            //   console.log("Loading the x Reg from memory");
            // Get the next two bytes from memory
            var nextTwoBytes = _MemoryManager0.getTwoBytes(_CPU.PC + 1, _CPU.PC + 2);
            var loadLocation = _CPU.findLoadLocation(nextTwoBytes);
            //   console.log("The location to load x reg from is .. " + loadLocation);
            var testByte = _MemoryManager0.getByte(loadLocation);
            //   console.log("The value of the x reg was " + testByte.getValue());
            //    console.log("The x register was set to " + parseInt(testByte.getValue(), 16));
            _CPU.Xreg = parseInt(testByte.getValue(), 16);
        };
        /**
         * Load the Y register with a constant
         * Uses the next byte as the value
        */
        Cpu.prototype.loadYRegistrarWithConstant = function () {
            //  console.log("Loading the y reg with a constant");
            // Get the next byte from memory to use as a constant value
            var nextMemoryLocation = _MemoryManager0.getByte(_CPU.PC + 1);
            //   console.log("The hex value of the constant is " + nextMemoryLocation.getValue());
            //   console.log("The Decimal value of the constant is " + parseInt(nextMemoryLocation.getValue(), 16) + "");
            // Set the accumulator to the deciamal value of the next Byte
            _CPU.Yreg = parseInt(nextMemoryLocation.getValue(), 16);
        };
        /**
         * Load the Y register from memory
         * Uses the next 2 bytes as the memory address
        */
        Cpu.prototype.loadYRegistrarFromMemory = function () {
            //     console.log("Loading the y Reg from memory");
            // Get the next two bytes from memory
            var nextTwoBytes = _MemoryManager0.getTwoBytes(_CPU.PC + 1, _CPU.PC + 2);
            var loadLocation = _CPU.findLoadLocation(nextTwoBytes);
            //     console.log("The location to load from is .. " + loadLocation);
            var testByte = _MemoryManager0.getByte(loadLocation);
            _CPU.Yreg = parseInt(testByte.getValue(), 16);
        };
        /**
         * No Operation
        */
        Cpu.prototype.noOperation = function () {
            // Do Nothing
            //    console.log("No Operation");
        };
        /**
         *  Break (Which really is a system call)
        */
        Cpu.prototype.breakOperation = function () {
            //    console.log("The break operation "); 
            _Kernel.createAndQueueInterrupt(BREAK_IRQ, false);
        };
        /**
         * Comapares a byte in memory to the x reg ands sets the z flag if equal
         * Uses the next 2 bytes as the memory address
        */
        Cpu.prototype.compareByte = function () {
            //     console.log("Comparing Bytes Operation");
            // Get the next two bytes from memory
            var nextTwoBytes = _MemoryManager0.getTwoBytes(_CPU.PC + 1, _CPU.PC + 2);
            var loadLocation = _CPU.findLoadLocation(nextTwoBytes);
            //    console.log("The location to load from is .. " + loadLocation);
            var testByte = _MemoryManager0.getByte(loadLocation);
            var byteValue = parseInt(testByte.getValue(), 16);
            //    console.log("The Current x reg is " + _CPU.Xreg);
            //   console.log("The Compare value is " + byteValue);
            if (_CPU.Xreg == byteValue) {
                //   console.log("Equal");
                _CPU.Zflag = 1;
                return;
            }
            else {
                //   console.log("Not Equal");
                _CPU.Zflag = 0;
                return;
            }
        };
        /**
         * Branch n bytes if z flag is equal to zero
         * Uses the next byte as the value
        */
        Cpu.prototype.branchBytes = function () {
            //  console.log("Branch Operation");
            if (_CPU.Zflag == 0) {
                //   console.log("Z flag is zero");
                // Get the next byte from memory to use as a constant value
                var nextMemoryLocation = _MemoryManager0.getByte(_CPU.PC + 1);
                // console.log("next memory Location is " + nextMemoryLocation.getValue()); 
                var valueToIncrementBy = parseInt(nextMemoryLocation.getValue(), 16);
                // console.log("Need to add to the current PC " + valueToIncrementBy);
                var currentPC = _CPU.PC;
                var newPC = valueToIncrementBy + currentPC;
                if (newPC > 256) {
                    newPC = newPC - 256;
                    //console.log("New pc value is" + newPC);
                    _CPU.PC = newPC;
                }
                else {
                    _CPU.PC = newPC;
                }
            }
            else {
            }
        };
        /**
         * Increment the value of a byte
         * Uses the next 2 bytes as the memory address
        */
        Cpu.prototype.incrementByte = function () {
            // console.log("Increment Bytes Operation ");
            var nextTwoBytes = _MemoryManager0.getTwoBytes(_CPU.PC + 1, _CPU.PC + 2);
            var loadLocation = _CPU.findLoadLocation(nextTwoBytes);
            var testByte = _MemoryManager0.getByte(loadLocation);
            // console.log("Before INC " + parseInt(testByte.getValue(), 16));
            var valueOfByte = parseInt(testByte.getValue(), 16) + 1;
            _MemoryManager0.setByte(loadLocation, valueOfByte.toString(16) + "");
            //console.log("The set mem loc .. " + loadLocation);
            // console.log("After INC " + valueOfByte.toString(16));
            // Need to update the memory table here
        };
        /**
         * System Call
         * $01 in X reg = print the integer stored in the Y register
         * $02 in X reg = print the 00-terminated string stored at the address in the Y register
        */
        Cpu.prototype.systemCall = function () {
            //   console.log("System Call operation");
            // #$01 in X reg = print the integer stored in the Y register.
            if (_CPU.Xreg == 1) {
                //  console.log("Pringing an int");
                //  console.log("value of y reg is " + _CPU.Yreg);
                // Create an interrupt and add it to the queue        
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(PRINT_INTEGER_IRQ, _CPU.Yreg));
            }
            else if (_CPU.Xreg == 2) {
                //   console.log("Need to print a string");
                // Create an interrupt and add it to the queue
                //   console.log("value of y reg is " + _CPU.Yreg);
                var decimalValue = _CPU.Yreg + "";
                var hexValue = parseInt(decimalValue, 16);
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(PRINT_STRING_IRQ, _CPU.Yreg));
            }
            else {
                // Create an interrupt and add it to the queue
                _Kernel.createAndQueueInterrupt(INVALID_OPCODE_USE_IRQ, "Error xReg value not valid syscall value 0 or 1 only");
            }
        };
        Cpu.prototype.cycle = function () {
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            _Kernel.krnTrace('CPU cycle');
            // Increment Program Counter before fetching next instruction
            this.PC = this.PC + 1;
            // Fetch the next instrcution from memory based on the Program counter
            var nextInstructionFromMemory = this.fetchInstruction();
            // Decode the instruction
            var nextInstruction = this.decodeInstruction(nextInstructionFromMemory);
            // Execute the instruction
            this.executeInstruction(nextInstruction);
            // Increment the Program Counter to account for the data used by the instruction
            this.PC = this.PC + nextInstruction.numberOfDataBytes;
            // Update the CPU Information for the user display
            _CpuStatisticsTable.updateStatusBar();
            _CpuStatisticsTable.setInstructionRegister(nextInstructionFromMemory);
            // Check if single step is enabled and if so handle it
            if (_SingleStepMode == true) {
                console.log("Single step mode is enabled!");
                _AllowNextCycle = false;
            }
            else {
                console.log("Single step mode is not enabled!");
                _AllowNextCycle = true;
            }
        };
        /**
         * Used to fetch the next instruction that the CPU needs to execute
         */
        Cpu.prototype.fetchInstruction = function () {
            console.log("Fetching the next instruction");
            var nextMemoryLocation = this.PC;
            // Get the next Byte at the Location
            var nextByte = _MemoryManager0.getByte(nextMemoryLocation);
            // Get the value of the byte            
            var nextInstruction = nextByte.getValue();
            console.log("Next Instruction: " + nextInstruction + " At memory Location: " + nextMemoryLocation);
            return nextInstruction;
        };
        /**
         * Used to decode the previously fetched instruction and decode it
         */
        Cpu.prototype.decodeInstruction = function (nextInstructionFromMemory) {
            // console.log("Decoding the next instruction");
            // Initalize variables used during the loop below
            var nextOpCode;
            var nextInstructionFunction;
            // Loop over the instruction set checking the value of the byte for a matching Op Code
            for (var i = 0; i < this.instructionSet.length; i++) {
                nextOpCode = this.instructionSet[i];
                // If one of the Op Codes matches the next instruction
                if (nextOpCode.opCode == nextInstructionFromMemory) {
                    // console.log("Found a matching op code" + <TSOS.Instruction>this.instructionSet[i] );
                    //Return the Instruction Object 
                    return this.instructionSet[i];
                }
            }
            // Invalid Op Code
            // console.log("Invalid Op Code");
            // Create an interrupt and add it to the queue
            _Kernel.createAndQueueInterrupt(INVALID_OPCODE_IRQ, nextInstructionFromMemory);
            return;
        };
        /**
         * Used to execute the next instruction in the cpu
         */
        Cpu.prototype.executeInstruction = function (nextInstruction) {
            //console.log("Executing the next instruction");
            // Get the function we need to call on execution from the Instruction Object
            var nextInstructionFunction = nextInstruction.function;
            // Execute the function                
            nextInstructionFunction();
        };
        /**
         * Used to save the current CPU information into the process control block
         */
        Cpu.prototype.saveProcessControlBlock = function () {
            // var currentProcess = <TSOS.ProcessControlBlock>_ReadyQueue.first();
            // console.log("saving process" + currentProcess);
            //   console.log("Program Counter: " + _CPU.PC +  "");
            //   console.log("Acc: " + _CPU.Acc + "");
            //   console.log("X-Reg: " + _CPU.Xreg + "");
            //   console.log("y-Reg: " + _CPU.Yreg + "");
            //   console.log("Z-Flag: " + _CPU.Zflag + "");
            _CurrentProcess.setProcessState(PROCESS_STATE_READY);
            _CurrentProcess.setProgramCounter(_CPU.PC);
            _CurrentProcess.setAcc(_CPU.Acc);
            _CurrentProcess.setXReg(_CPU.Xreg);
            _CurrentProcess.setYReg(_CPU.Yreg);
            _CurrentProcess.setZFlag(_CPU.Zflag);
            // _ReadyQueue.clear()
            // _ReadyQueue.add(currentProcess);
            //  console.log("Saving into a process control block" + <TSOS.ProcessControlBlock> currentProcess);
        };
        /**
         * Used to set the current CPU information
         */
        Cpu.prototype.beginExecuting = function (process) {
            //  console.log("Begining to Execute the process" + process);
            // console.log("Program Counter: " + parseInt(process.getProgramCounter(), 16) + "");
            // console.log("Acc: " + parseInt(process.getAcc(), 16) + "");
            // console.log("X-Reg: " + parseInt(process.getXReg(), 16) + "");
            // console.log("y-Reg: " + parseInt(process.getYReg(), 16) + "");
            // console.log("Z-Flag: " +  parseInt(process.getZFlag(), 16) + "");
            _CPU.PC = parseInt(process.getProgramCounter(), 16);
            _CPU.Acc = parseInt(process.getAcc(), 16);
            _CPU.Xreg = parseInt(process.getXReg(), 16);
            _CPU.Yreg = parseInt(process.getYReg(), 16);
            _CPU.Zflag = parseInt(process.getZFlag(), 16);
        };
        /**
         * Used to find the memory location (Handles Little Endian)
         */
        Cpu.prototype.findLoadLocation = function (byteArray) {
            var memoryLocation1 = byteArray[0].getValue();
            var memoryLocation2 = byteArray[1].getValue();
            var hexLocation = memoryLocation2 + memoryLocation1 + "";
            var location = parseInt(TSOS.Utils.hexToDecimal(hexLocation), 10); //This is the location in memory
            //  console.log("The location to load from is .. " + location);
            return location;
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
