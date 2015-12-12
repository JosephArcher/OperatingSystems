To improve on the functionality from iProject Three (all of which is required) by adding a	
local Gile system and swapped virtual memory so	you	can	execute	more processes than	you	
have partitions	for	in	memory.	Also, to make something	of which you are proud, that you	
can	show people, and brag about, and talk about	in job interviews for years to come.

Functional Requirements

	Add	shell commands for the following disk operations:	

		create <filename>         — Create the Gile "ilename and display a message denoting success or failure.
		read   <filename>         — Read and display the contents of "filename or display an error if something went wrong.	
		write  <filename>  “data” — Write the data inside the quotes to "filename and display a message denoting success or failure.	
		delete <filename>	      —	Remove "filename from storage and display a	message	denoting success or failure.	
		format                    —	Initialize all blocks in all sectors in	all	tracks and display a message denoting success or failure.
		ls                        -	List the files currently stored on the disk
		setschedule <Algrorithm>  - Allow the user to select a CPU	scheduling	algorithm
		gettschedule              - Return the currently selected cpu scheduling algorithm.
	
Implementation	Requirements

	- Implement a	File system	in HTML5 web storage as	discussed in class.
	- Include	a File system viewer in	your OS	interface.	
	- Develop	a File System Device Driver	(fsDD) for all of the functional requirements noted above.	
	- Load the fsDD inm a	similar	manner as the keyboard device driver.	
	- Develop	your fsDD to insulate and encapsulate the implementation of the	kernel-level I/O operations (noted above) from the byte-level details of your individual blocks on the local storage.	
	- Add new scheduling algorithms	to	your CPU scheduler.	Default	to RR.
		- First-come, First-served (FCFS)	
		- Non-preemptive priority (You will need an	optional load parameter	here.)
	- Implement	swapped	virtual	memory	with enough	physical memory	for	three concurrent user processes.	
	- Allow	the	OS to execute four concurrent user process by writing roll-out and roll-in routines to . . .		
		Take a ready process and store it to the disk via your fsDD.	
			Load a swapped-out process and place it	in the ready queue
			Your ready queue should	denote which processes are where	

	- Your code	must separate structure	from presentation, be professionally formatted, use	and	demonstrate	best practices, and make me proud to be your teacher.	
	- You must commit to Git early and often.