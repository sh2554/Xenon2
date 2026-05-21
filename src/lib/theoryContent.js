export const THEORY_UNITS = [
  {
    id: "1-1-architecture",
    unit: "Unit 1.1",
    title: "Systems Architecture",
    accent: "#4fb8ff",
    notes: [
      {
        heading: "Purpose of the CPU",
        body: "The CPU (Central Processing Unit) is the hardware that executes programs and manages the rest of the hardware. It is often called the 'brain' of the computer.\n\nKey functions:\n• To process data and instructions\n• To control the rest of the computer system\n• To perform the Fetch-Decode-Execute cycle\n\nExam tip: In 1-mark questions, mention fetch, decode and execute — not just 'runs programs'.",
        proDetail: "OCR often asks you to link the CPU to the FDE cycle in 2–3 mark questions. A strong answer names the PC (next address), MAR/MDR (memory transfer), CU (decode/control signals), and ALU (arithmetic/logic). Mention that clock speed × cores × cache size all affect effective performance, not just GHz alone.",
      },
      {
        heading: "Von Neumann Architecture",
        body: "Most modern computers use Von Neumann architecture, where both data and instructions are stored in the same memory (RAM).\n\nKey Components:\n• Control Unit (CU): Decodes instructions and sends signals to control data flow.\n• ALU (Arithmetic Logic Unit): Performs all mathematical and logical operations.\n• Cache: High-speed memory inside the CPU that stores frequently used data.\n• Registers: Small, fast storage locations inside the CPU.\n\nThe von Neumann bottleneck: the CPU and memory share one bus, so they cannot both be accessed at full speed at the same time.",
        proDetail: "Contrast with Harvard architecture (separate buses for instructions and data) — useful in 4–6 mark compare questions. Be ready to draw a simple block diagram: CPU ↔ bus ↔ RAM, with cache between CPU and RAM.",
      },
      {
        heading: "CPU Registers (OCR/AQA focus)",
        body: "• Program Counter (PC): Holds the address of the next instruction to be fetched.\n• Memory Address Register (MAR): Holds the address of the current instruction/data being read from or written to memory.\n• Memory Data Register (MDR): Holds the actual data or instruction fetched from memory.\n• Accumulator (ACC): Holds the results of calculations performed by the ALU.\n• Current Instruction Register (CIR): Holds the instruction currently being decoded (OCR-specific).",
        proDetail: "Trace table questions: when PC increments, it is usually by the size of one instruction. For 'describe fetch', write: address from PC → MAR; data from memory address → MDR → CIR; PC incremented.",
      },
      {
        heading: "The FDE Cycle",
        body: "1. Fetch: The CPU fetches the next instruction from RAM using the address in the PC. The instruction is moved to the MDR/CIR.\n2. Decode: The Control Unit (CU) decodes the instruction to understand what needs to be done.\n3. Execute: The instruction is carried out. This might involve calculations in the ALU or moving data between registers.\n\nThis cycle repeats billions of times per second (clock speed).",
        proDetail: "Extended response: include that decode sends control signals; execute may update ACC or memory; PC updates ready for next fetch. Interrupts can pause the cycle to handle urgent events (keyboard, timer).",
      },
      {
        heading: "CPU Performance Factors",
        body: "• Clock Speed: Measured in Hertz (Hz). The number of FDE cycles a CPU can perform per second.\n• Number of Cores: Each core can process an instruction independently. Multiple cores help multitasking and parallel programs.\n• Cache Size: Larger cache reduces the time the CPU spends waiting for data from RAM.\n\nMore cores do not always double speed — software must support parallel execution.",
        proDetail: "6-mark explain: give a scenario (gaming vs word processing). Word processing may not use all cores; video encoding benefits from many cores. Cache hit rate matters: L1 fastest, L2/L3 larger but slower.",
      },
    ],
    flashcards: [
      { q: "What does the Program Counter (PC) do?", a: "Holds the memory address of the next instruction to be fetched." },
      { q: "What is the role of the ALU?", a: "Performs arithmetic calculations and logical comparisons (e.g. <, >)." },
      { q: "What happens during the 'Fetch' stage?", a: "The next instruction is copied from RAM to the CPU (MDR) using the address in the MAR." },
      { q: "What is meant by a 'core' in a CPU?", a: "A core is an independent processing unit that can execute its own FDE cycle." },
      { q: "How does Cache improve CPU performance?", a: "It provides faster access to frequently used instructions compared to RAM." },
      { q: "Which register stores the result of ALU calculations?", a: "The Accumulator (ACC)." }
    ],
  },
  {
    id: "1-2-memory-storage",
    unit: "Unit 1.2",
    title: "Memory & Storage",
    accent: "#a78bfa",
    notes: [
      {
        heading: "Primary vs Secondary Storage",
        body: "• Primary Storage: Memory that the CPU can access directly (RAM, ROM, Cache). Usually volatile (except ROM).\n• Secondary Storage: Non-volatile storage used for long-term data (HDD, SSD, Optical). Not directly accessible by the CPU — data must be loaded into RAM first.\n\nCapacity vs speed: primary is faster but smaller; secondary is larger but slower.",
        proDetail: "Compare HDD vs SSD for exam essays: SSD = flash, no moving parts, faster boot, lower latency; HDD = magnetic platters, cheaper per GB, mechanical failure risk. Always state volatility for RAM vs ROM.",
      },
      {
        heading: "RAM vs ROM",
        body: "• RAM (Random Access Memory): Volatile (loses data when power is off). Used to store currently running programs and data.\n• ROM (Read Only Memory): Non-volatile. Stores the BIOS/Bootstrap instructions needed to start the computer.",
      },
      {
        heading: "Virtual Memory",
        body: "When RAM is full, the computer uses a section of the secondary storage (HDD/SSD) as temporary RAM. This is much slower than real RAM and can lead to 'disk thrashing'.",
      },
      {
        heading: "Secondary Storage Types",
        body: "• Magnetic: Uses spinning platters and magnetic heads (HDD). High capacity, low cost, but mechanical and slower.\n• Solid State: No moving parts (SSD, Flash). Very fast, durable, silent, but more expensive per GB.\n• Optical: Uses lasers to read/write pits and lands (CD, DVD, Blu-ray). Cheap, portable, but low capacity and easily damaged.",
      },
      {
        heading: "Capacity Units",
        body: "• Bit (b): 0 or 1\n• Nibble: 4 bits\n• Byte (B): 8 bits\n• Kilobyte (KB): 1000 Bytes (or 1024)\n• Megabyte (MB): 1000 KB\n• Gigabyte (GB): 1000 MB\n• Terabyte (TB): 1000 GB",
      },
    ],
    flashcards: [
      { q: "What is the main difference between RAM and ROM?", a: "RAM is volatile (temporary) while ROM is non-volatile (permanent)." },
      { q: "Why is secondary storage needed?", a: "To store data and programs long-term when the power is turned off." },
      { q: "Name a benefit of Solid State Storage over Magnetic.", a: "Faster access speeds, more durable (no moving parts), and uses less power." },
      { q: "What is Virtual Memory?", a: "A section of secondary storage used as temporary RAM when physical RAM is full." },
      { q: "How many bits are in a Byte?", a: "8 bits." },
      { q: "Which storage type is best for distributing movies?", a: "Optical (Blu-ray/DVD) due to portability and low cost." }
    ],
  },
  {
    id: "2-1-algorithms",
    unit: "Unit 2.1",
    title: "Algorithms",
    accent: "#fbbf24",
    notes: [
      {
        heading: "Computational Thinking",
        body: "• Abstraction: Removing unnecessary details to focus on the important parts.\n• Decomposition: Breaking a complex problem down into smaller, manageable parts.\n• Algorithmic Thinking: Creating a logical step-by-step process to solve a problem.",
      },
      {
        heading: "Binary Search",
        body: "Requirement: The list must be SORTED.\nSteps:\n1. Find the middle element.\n2. If it's the target, stop.\n3. If target is smaller, repeat on the left half.\n4. If target is larger, repeat on the right half.",
      },
      {
        heading: "Linear Search",
        body: "Works on any list (sorted or unsorted).\nSteps:\n1. Start at the first item.\n2. Check if it's the target.\n3. If not, move to the next item.\n4. Repeat until found or end of list.",
      },
      {
        heading: "Bubble Sort",
        body: "Steps:\n1. Compare adjacent items.\n2. Swap if they are in the wrong order.\n3. Repeat for the whole list (one 'pass').\n4. Repeat passes until a full pass is made with no swaps.",
      },
      {
        heading: "Merge Sort",
        body: "A 'divide and conquer' algorithm.\n1. Split the list in half repeatedly until each list has only 1 item.\n2. Merge pairs of lists back together in the correct order until only one sorted list remains.",
      },
    ],
    flashcards: [
      { q: "What is abstraction?", a: "Removing unnecessary details from a problem to focus on the essential features." },
      { q: "What is the main requirement for a Binary Search?", a: "The list must be sorted." },
      { q: "Which sort is usually faster for large lists: Bubble or Merge?", a: "Merge Sort." },
      { q: "How does a Linear Search work?", a: "It checks every item in the list one by one until the target is found." },
      { q: "What is decomposition?", a: "Breaking a large problem into smaller, easier-to-solve sub-problems." },
      { q: "What is a 'pass' in a Bubble Sort?", a: "One complete trip through the list comparing and swapping adjacent items." }
    ],
  },
  {
    id: "2-2-programming",
    unit: "Unit 2.2",
    title: "Programming Fundamentals",
    accent: "#34d399",
    notes: [
      {
        heading: "The Three Basic Constructs",
        body: "• Sequence: Instructions follow one after another in order.\n• Selection: Using 'if' statements to choose a path based on a condition.\n• Iteration: Using loops (for/while) to repeat instructions.",
      },
      {
        heading: "Variables and Constants",
        body: "• Variable: A memory location used to store data that CAN change while the program is running.\n• Constant: A memory location used to store data that CANNOT change while the program is running.",
      },
      {
        heading: "Data Types",
        body: "• Integer: Whole numbers (e.g. 10, -5).\n• Real/Float: Numbers with decimal points (e.g. 3.14).\n• Boolean: True or False values.\n• Character: A single letter, number or symbol.\n• String: A collection of characters (text).",
      },
      {
        heading: "Arithmetic Operators",
        body: "• + (Addition)\n• - (Subtraction)\n• * (Multiplication)\n• / (Division)\n• // (Floor Division - ignores the remainder)\n• % (Modulus - gives the remainder only)\n• ** (Exponent - to the power of)",
      },
      {
        heading: "Logic Operators",
        body: "• AND: Both conditions must be true.\n• OR: At least one condition must be true.\n• NOT: Inverts the result (True becomes False).",
      },
    ],
    flashcards: [
      { q: "What are the three programming constructs?", a: "Sequence, Selection, and Iteration." },
      { q: "What is the difference between // and / in Python?", a: "/ is standard division (gives a decimal), // is floor division (gives a whole number)." },
      { q: "What does the MOD (%) operator do?", a: "It returns the remainder of a division." },
      { q: "What is a constant?", a: "A value that remains the same throughout the entire program execution." },
      { q: "Which data type would store a phone number?", a: "String (to keep leading zeros and handle spaces/symbols)." },
      { q: "What is iteration?", a: "The process of repeating a set of instructions (using loops)." }
    ],
  },
  {
    id: "1-3-networks",
    unit: "Unit 1.3",
    title: "Networks & Topologies",
    accent: "#fb923c",
    notes: [
      {
        heading: "LAN vs WAN",
        body: "• LAN (Local Area Network): Covers a small geographical area (e.g. a home or office). Uses own hardware.\n• WAN (Wide Area Network): Covers a large geographical area (e.g. the Internet). Uses third-party hardware (cables/satellites).",
      },
      {
        heading: "Factors Affecting Network Performance",
        body: "• Bandwidth: The amount of data that can be sent in a given time.\n• Number of Users: More users can slow down the network (sharing bandwidth).\n• Latency: The delay between sending and receiving data.\n• Errors: Transmission errors require data to be resent.",
      },
      {
        heading: "Network Hardware",
        body: "• NIC (Network Interface Card): Connects a device to a network.\n• Switch: Connects devices on a LAN and sends data to the correct MAC address.\n• Router: Connects different networks together (e.g. LAN to WAN).",
      },
      {
        heading: "Star and Mesh Topologies",
        body: "• Star: All devices connect to a central switch. Fast and reliable, but if the switch fails, the whole network goes down.\n• Mesh: Every device connects to every other device. Very reliable (many paths) but expensive and difficult to set up.",
      },
      {
        heading: "Protocols",
        body: "• TCP/IP: Sets rules for how data is sent over the internet.\n• HTTP/HTTPS: For accessing websites (HTTPS is encrypted).\n• FTP: For transferring files.\n• SMTP/IMAP/POP: For handling emails.",
      },
    ],
    flashcards: [
      { q: "What is a LAN?", a: "A network covering a small geographical area, like a home or school." },
      { q: "What does a Router do?", a: "Connects different networks together and directs data packets." },
      { q: "What is Bandwidth?", a: "The maximum rate of data transfer across a network." },
      { q: "Name an advantage of a Mesh topology.", a: "There is no single point of failure; data can take many routes." },
      { q: "Which protocol is used for sending emails?", a: "SMTP (Simple Mail Transfer Protocol)." },
      { q: "What is the role of a Switch in a LAN?", a: "To receive data packets and send them only to the device they are intended for." }
    ],
  },
  {
    id: "1-4-security",
    unit: "Unit 1.4",
    title: "Network Security",
    accent: "#f87171",
    notes: [
      {
        heading: "Malware",
        body: "Software designed to cause harm to a computer system.\n• Virus: Attaches to files and spreads when they are opened.\n• Worm: Self-replicates and spreads across networks.\n• Trojan: Disguised as legitimate software.\n• Ransomware: Encrypts files and demands money.",
      },
      {
        heading: "Social Engineering",
        body: "Tricking people into giving away secrets.\n• Phishing: Fake emails/websites designed to steal passwords.\n• Shoulder Surfing: Watching someone enter a PIN or password.",
      },
      {
        heading: "Network Attacks",
        body: "• Brute Force: Trying every possible password combination.\n• Denial of Service (DoS): Flooding a server with traffic to crash it.\n• SQL Injection: Entering code into a web form to manipulate a database.",
      },
      {
        heading: "Security Measures",
        body: "• Firewall: Monitors traffic and blocks unauthorised access.\n• Encryption: Scrambling data so it can only be read with a key.\n• Anti-Malware: Scans for and removes harmful software.\n• User Access Levels: Restricting what users can see or do.",
      },
    ],
    flashcards: [
      { q: "What is Phishing?", a: "A social engineering attack using fake emails to steal sensitive data." },
      { q: "How does a Firewall protect a network?", a: "It monitors incoming and outgoing traffic and blocks suspicious packets." },
      { q: "What is a Trojan?", a: "Malware that is disguised as a useful program but performs harmful actions." },
      { q: "What is a Brute Force attack?", a: "An automated attack that tries millions of password combinations to gain access." },
      { q: "Why should you use Encryption?", a: "To ensure that if data is intercepted, it cannot be understood without a key." },
      { q: "What is the purpose of Anti-Malware software?", a: "To detect, quarantine, and remove malicious software from a system." }
    ],
  },
  {
    id: "2-3-logic-languages",
    unit: "Unit 2.3",
    title: "Logic & Languages",
    accent: "#ec4899",
    notes: [
      {
        heading: "Logic Gates",
        body: "• NOT Gate: Inverts the input (True becomes False).\n• AND Gate: Output is True only if BOTH inputs are True.\n• OR Gate: Output is True if AT LEAST ONE input is True.",
      },
      {
        heading: "Truth Tables",
        body: "Used to show all possible inputs and outputs for a logic circuit. For two inputs (A and B), there are 4 combinations: (0,0), (0,1), (1,0), (1,1).",
      },
      {
        heading: "High-Level vs Low-Level Languages",
        body: "• High-Level (e.g. Python, Java): Easy for humans to read, portable across different CPUs, needs translating.\n• Low-Level (e.g. Assembly, Machine Code): Hard for humans, specific to one CPU type, very fast execution.",
      },
      {
        heading: "Translators",
        body: "• Compiler: Translates the whole program at once. Creates an executable file. Faster execution but harder to debug.\n• Interpreter: Translates line-by-line. Stops at the first error. Easier for development but slower execution.",
      },
      {
        heading: "IDE Tools",
        body: "Integrated Development Environments (like Xenon) provide:\n• Editor: For writing code (with syntax highlighting).\n• Debugger: To find and fix errors.\n• Compiler/Interpreter: To run the code.\n• Run-time environment: To execute the program.",
      },
    ],
    flashcards: [
      { q: "What does an AND gate produce if inputs are 1 and 0?", a: "0 (Both must be 1 for an AND gate to output 1)." },
      { q: "What is an IDE?", a: "Integrated Development Environment — a tool for writing and testing code." },
      { q: "Name a benefit of High-Level languages.", a: "Easier for humans to read/write and portable across different systems." },
      { q: "What is the difference between a Compiler and an Interpreter?", a: "Compilers translate everything at once; Interpreters translate line-by-line." },
      { q: "Which gate has only one input?", a: "The NOT gate." },
      { q: "What is Machine Code?", a: "Binary code (1s and 0s) that the CPU can directly understand and execute." }
    ],
  },
  {
    id: "1-5-ethics",
    unit: "Unit 1.5",
    title: "Ethical & Legal Issues",
    accent: "#14b8a6",
    notes: [
      {
        heading: "Ethical & Cultural Issues",
        body: "• Digital Divide: The gap between those with access to tech and those without.\n• Job Displacement: Automation replacing human workers.\n• Surveillance: Tracking user data for advertising or monitoring.",
      },
      {
        heading: "Environmental Issues",
        body: "• E-waste: Old devices ending up in landfill (toxic chemicals).\n• Energy Use: Large data centres consuming huge amounts of electricity.\n• Rare Minerals: Mining for materials used in batteries and circuits.",
      },
      {
        heading: "Legislations (UK Law)",
        body: "• Data Protection Act 2018 (GDPR): Rules on how personal data is stored and used.\n• Computer Misuse Act 1990: Makes hacking and spreading malware illegal.\n• Copyright, Designs and Patents Act: Protects intellectual property (software, music, etc.).",
      },
      {
        heading: "Open Source vs Proprietary",
        body: "• Open Source: Source code is public. Free to modify. Community-driven.\n• Proprietary: Source code is private. Users pay for a license. Professional support provided.",
      },
    ],
    flashcards: [
      { q: "What is the Digital Divide?", a: "The inequality between people who have access to modern technology and those who do not." },
      { q: "Which law makes hacking illegal?", a: "The Computer Misuse Act 1990." },
      { q: "What is 'e-waste'?", a: "Electronic waste from discarded devices like phones and computers." },
      { q: "What is Proprietary Software?", a: "Software where the source code is kept private and users usually pay for a license." },
      { q: "Give a principle of the Data Protection Act.", a: "Data must be kept secure; Data must be accurate; Data must not be kept longer than necessary." },
      { q: "Why is data centre energy use an environmental concern?", a: "They require massive amounts of electricity, often contributing to carbon emissions." }
    ],
  }
];
