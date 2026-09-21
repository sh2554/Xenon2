// ══════════════════════════════════════════════════════════════════════════
// OCR GCSE Computer Science (J277) — Complete Curriculum Structure
// Aligned 100% with official OCR J277 specification and Craig 'n' Dave
//
// Component 01 (J277/01): Computer Systems (50% of GCSE, 80 Marks)
// Component 02 (J277/02): Computational Thinking, Algorithms and Programming (50% of GCSE, 80 Marks)
// ══════════════════════════════════════════════════════════════════════════

export const THEORY_UNITS = [
  // ══════════════════════════════════════════════════════════════════════════
  // COMPONENT 01: COMPUTER SYSTEMS (J277/01)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "1-1-architecture",
    unit: "Unit 1.1",
    paper: 1,
    paperCode: "J277/01",
    paperTitle: "Paper 1: Computer Systems",
    title: "Systems Architecture",
    subtopics: [
      "1.1.1 Architecture of the CPU",
      "1.1.2 CPU Performance",
      "1.1.3 Embedded Systems"
    ],
    accent: "#38bdf8",
    notes: [
      {
        heading: "Purpose of the CPU & The FDE Cycle",
        body: "The CPU (Central Processing Unit) is the hardware device that executes programs and manages the rest of the computer system. It continuously carries out the Fetch-Decode-Execute (FDE) cycle at billions of cycles per second (measured in GHz).\n\n1. Fetch: The memory address of the next instruction is copied from the Program Counter (PC) to the Memory Address Register (MAR). The instruction is read from RAM into the Memory Data Register (MDR). The PC is incremented by 1.\n2. Decode: The Control Unit (CU) decodes the instruction in the Current Instruction Register to determine the required action.\n3. Execute: The instruction is carried out (e.g. data transferred, calculations done by ALU, or branch taken).",
        proDetail: "OCR Mark Scheme Tip: When asked for 3 marks to describe the 'Fetch' stage, you MUST mention: 1) PC holds address of next instruction copied to MAR, 2) instruction fetched from RAM into MDR, and 3) Program Counter is incremented. Never just write 'it gets the instruction'.",
      },
      {
        heading: "Von Neumann Architecture & CPU Components",
        body: "Von Neumann architecture is the foundational design where both program instructions and data are stored together in the same read-write memory (RAM).\n\nKey Internal CPU Components:\n• Control Unit (CU): Controls data flow inside and outside the CPU, decodes instructions, and sends timing/control signals.\n• Arithmetic Logic Unit (ALU): Performs arithmetic calculations (+, -, *, /) and logical decisions (AND, OR, NOT, comparisons <, >, ==).\n• Cache: Ultra-fast, low-capacity memory located on or right next to the CPU that stores frequently used instructions/data.\n• Clock: Quartz crystal that pulses at a constant frequency to synchronise all CPU operations.",
        proDetail: "Comparison Tip: In 4–6 mark questions comparing Cache levels: L1 is smallest (2–64KB) but fastest; L2 is medium speed and size; L3 is largest (several MB) but slowest cache tier. All cache levels are significantly faster than RAM.",
      },
      {
        heading: "Common CPU Registers",
        body: "Registers are extremely high-speed, small-capacity temporary storage locations directly inside the CPU:\n\n• Program Counter (PC): Holds the memory address of the next instruction to be fetched.\n• Memory Address Register (MAR): Holds the address in RAM currently being read from or written to.\n• Memory Data Register (MDR): Holds the actual data or instruction just fetched from RAM, or waiting to be written to RAM.\n• Accumulator (ACC): Temporarily stores the immediate results of calculations and operations performed by the ALU.\n• Current Instruction Register (CIR): Holds the instruction that is currently being decoded by the CU.",
        proDetail: "Exam Trap: Do not confuse MAR and MDR! Memory Address Register holds an address (where in RAM). Memory Data Register holds the actual data or instruction (what was found at that address).",
      },
      {
        heading: "Factors Affecting CPU Performance",
        body: "CPU throughput depends on three main hardware characteristics:\n\n• Clock Speed: Number of FDE cycles the CPU performs per second, measured in Gigahertz (GHz, billions of cycles/sec). Higher clock speed = more instructions executed per second. Overclocking increases speed but generates excess heat.\n• Cache Size: Larger cache holds more instructions close to the processor, avoiding slow access journeys to RAM (improves cache hit rate).\n• Number of Cores: A multi-core processor has multiple independent processing units capable of executing separate FDE cycles simultaneously.",
        proDetail: "6-Marker Alert: Doubling the number of cores does NOT simply double performance. Software must be specially written for parallel processing/multithreading. Cores also share cache and system buses, creating communication bottlenecks.",
      },
      {
        heading: "Embedded Systems",
        body: "An embedded system is a computer system with a dedicated, single specific function embedded within a larger mechanical or electronic device.\n\nCharacteristics:\n• Highly specialised with dedicated software usually stored in ROM/Flash memory.\n• Minimal user interface (buttons, LEDs, dials) or headless.\n• Low power consumption, compact size, and low manufacturing cost.\n• High reliability and real-time responsiveness.\n\nExamples: Dishwashers, microwave ovens, car anti-lock braking systems (ABS), smart washing machines, digital watches, traffic light controllers.",
        proDetail: "Exam Distinction: A desktop PC, laptop, or smartphone is a General Purpose computer (can run many different apps for varied tasks). An embedded system only carries out its single dedicated job.",
      },
    ],
    flashcards: [
      { q: "What is the purpose of the Program Counter (PC)?", a: "Holds the memory address of the next instruction to be fetched from RAM." },
      { q: "What are the three stages of the CPU instruction cycle?", a: "Fetch, Decode, and Execute (the FDE cycle)." },
      { q: "What is the role of the Arithmetic Logic Unit (ALU)?", a: "Performs mathematical arithmetic calculations and logical comparisons/decisions." },
      { q: "Define an Embedded System.", a: "A computer system with a dedicated single function built inside a larger mechanical or electrical device." },
      { q: "Why does doubling the number of CPU cores not always double performance?", a: "Software must support parallel execution, and cores must share buses and cache, causing communication overhead." },
      { q: "What does the Memory Data Register (MDR) hold?", a: "The actual data or instruction fetched from memory (RAM) or about to be written to memory." },
    ],
  },

  {
    id: "1-2-memory-storage",
    unit: "Unit 1.2",
    paper: 1,
    paperCode: "J277/01",
    paperTitle: "Paper 1: Computer Systems",
    title: "Memory and Storage",
    subtopics: [
      "1.2.1 Primary Storage (RAM & ROM)",
      "1.2.2 Secondary Storage",
      "1.2.3 Units of Data",
      "1.2.4 Data Representation",
      "1.2.5 Compression"
    ],
    accent: "#a855f7",
    notes: [
      {
        heading: "Primary Storage: RAM, ROM & Virtual Memory",
        body: "Primary storage is memory directly accessible by the CPU via the system buses.\n\n• RAM (Random Access Memory): Volatile (loses all contents when power is lost). Read and write memory. Stores currently open applications, operating system modules, and active data.\n• ROM (Read Only Memory): Non-volatile (contents retained without power). Read-only. Stores bootstrap loader and firmware (BIOS/UEFI) required to start the computer.\n• Virtual Memory: A partitioned area of secondary storage (hard drive/SSD) allocated as temporary RAM when physical RAM is full. Inactive data is swapped between RAM and disk. Excessive swapping causes 'disk thrashing' and drastic system slowdown.",
        proDetail: "Exam Distinction: RAM is volatile, ROM is non-volatile. Never state that RAM holds 'files' — files live on secondary storage and are copied into RAM only while actively in use.",
      },
      {
        heading: "Secondary Storage Technologies",
        body: "Secondary storage is non-volatile storage used to store data, software, and files permanently when power is turned off. The CPU cannot directly access secondary storage.\n\nThree Main Technologies:\n1. Optical (CD, DVD, Blu-Ray): Uses laser beams to read and write microscopic pits and lands on reflective spinning discs. Very cheap per disc, highly portable, but low capacity and easily scratched.\n2. Magnetic (HDD, Magnetic Tape): Uses spinning metallic platters with magnetic read/write heads. Very high capacity and low cost per gigabyte, but has moving parts, vulnerable to physical shocks, and slower than SSDs.\n3. Solid State (SSD, USB Flash, SD Card): Uses flash semiconductor memory cells (trapping electrons). No moving parts, extremely fast read/write speeds, silent, low power, durable, but higher cost per gigabyte.",
        proDetail: "6-Marker Framework: For 6-mark questions recommending storage for a scenario (e.g., a mountain hiker's action camera), evaluate all 6 characteristics: Capacity, Speed, Portability, Durability, Reliability, and Cost.",
      },
      {
        heading: "Units of Data Storage & Binary Conversions",
        body: "Computers use binary (base 2: 0 and 1) because electronic circuits consist of transistors acting as on/off switches.\n\nData Hierarchy:\n• Bit (b): Single binary digit 0 or 1\n• Nibble: 4 bits (e.g. 1010)\n• Byte (B): 8 bits (stores 1 ASCII character)\n• Kilobyte (KB): 1,000 bytes (10³)\n• Megabyte (MB): 1,000 KB (10⁶)\n• Gigabyte (GB): 1,000 MB (10⁹)\n• Terabyte (TB): 1,000 GB (10¹²)\n• Petabyte (PB): 1,000 TB (10¹⁵)\n\nNote: OCR J277 uses standard decimal multiples of 1,000 (SI units) for data capacity calculations.",
        proDetail: "Hexadecimal Conversion Tip: Hex (base 16: 0-9, A-F) is used because it is much easier for humans to read, debug, and write without errors (each hex digit maps to exactly one nibble / 4 bits).",
      },
      {
        heading: "Data Representation: Characters, Images & Sound",
        body: "All forms of media must be converted into binary to be processed by a computer.\n\n• Characters: Character sets map unique binary codes to glyphs.\n  - ASCII: 7-bit code (128 characters: English alphabet, digits, punctuation).\n  - Extended ASCII: 8-bit code (256 characters).\n  - Unicode: 16-bit to 32-bit code (over 1 million characters, supporting all world languages, symbols, and emojis).\n\n• Images (Bitmaps): Composed of a grid of picture elements (pixels).\n  - Resolution: Number of pixels (width × height).\n  - Colour Depth: Number of bits per pixel (e.g. 8 bits = 2⁸ = 256 colours, 24 bits = 16.7M colours).\n  - File size = width × height × colour depth (bits). Plus metadata (dimensions, colour profile, author).\n\n• Sound: Analogue audio is sampled into digital values at regular time intervals.\n  - Sample Rate: Number of audio samples taken per second (measured in Hz).\n  - Bit Depth: Number of bits used to record the amplitude of each sample.\n  - File size = sample rate (Hz) × bit depth × duration (seconds) × channels.",
        proDetail: "Exam Calculation Note: If an OCR question asks for file size in bytes, divide your bit total by 8. If in Kilobytes, divide by 1,000 (or 1,024 if explicitly prompted).",
      },
      {
        heading: "Data Compression: Lossy vs Lossless",
        body: "Compression reduces file size to save storage space and speed up transmission over networks.\n\n• Lossy Compression: Permanently removes unnecessary, redundant, or less perceptible data (e.g. frequencies human ears cannot detect in MP3, subtle colour variations in JPEG). Dramatically reduces file size, but slightly reduces quality and original data cannot be restored. Unusable on text or executable programs.\n• Lossless Compression: Reduces file size without discarding any data (e.g. Run Length Encoding RLE, dictionary algorithms in PNG, ZIP, FLAC). The original uncompressed file can be perfectly reconstructed byte-for-byte. Yields smaller compression ratios than lossy.",
        proDetail: "Classic Exam Scenario: Why is lossy unsuitable for program code or financial spreadsheets? Because removing a single character or digit corrupts the logic or causes errors.",
      },
    ],
    flashcards: [
      { q: "What is the difference between volatile and non-volatile memory?", a: "Volatile memory (RAM) loses its contents when power is turned off, while non-volatile memory (ROM, SSD) retains data permanently." },
      { q: "What is Virtual Memory and when is it used?", a: "A section of secondary storage used as temporary RAM when physical RAM becomes full." },
      { q: "Name the three types of secondary storage technologies.", a: "Optical, Magnetic, and Solid State." },
      { q: "How many bits are used in standard ASCII compared to Unicode?", a: "Standard ASCII uses 7 bits (128 characters), while Unicode uses 16 or 32 bits (supporting worldwide languages and emojis)." },
      { q: "What is the formula to calculate the file size of a bitmap image?", a: "Width (pixels) × Height (pixels) × Colour Depth (bits) + Metadata." },
      { q: "Why can lossy compression never be used on executable program files?", a: "Lossy permanently discards data, which would alter instructions and corrupt the program." },
    ],
  },

  {
    id: "1-3-networks",
    unit: "Unit 1.3",
    paper: 1,
    paperCode: "J277/01",
    paperTitle: "Paper 1: Computer Systems",
    title: "Networks, Connections & Protocols",
    subtopics: [
      "1.3.1 Networks & Topologies",
      "1.3.2 Hardware & Transmission Media",
      "1.3.3 The Internet & DNS",
      "1.3.4 Protocols & 4-Layer Model"
    ],
    accent: "#fb923c",
    notes: [
      {
        heading: "Types of Networks & Network Models",
        body: "A network is two or more computers connected together to share data, resources, and peripherals.\n\n• LAN (Local Area Network): Confined to a small geographical site (school, office building, home). Owned and maintained internally by the organisation.\n• WAN (Wide Area Network): Spans a large geographical area (cities, countries, global internet). Uses telecommunications infrastructure owned by third-party telecoms companies.\n\nNetwork Architecture Models:\n• Client-Server: Central servers store files, manage security, permissions, and backups. Clients request services from servers. Highly secure and central control, but server failure affects all clients.\n• Peer-to-Peer (P2P): All devices have equal status and share files directly. Easy and inexpensive to set up with no single point of failure, but difficult to maintain consistent backups and virus protection.",
        proDetail: "Comparison Tip: In OCR exam questions, contrast Client-Server (central management, expensive server hardware, needs network admin) with Peer-to-Peer (decentralised, cheap, no specialised OS required).",
      },
      {
        heading: "Network Topologies: Star & Mesh",
        body: "Topology refers to the physical or logical layout of devices in a network.\n\n• Star Topology: All nodes are individually connected to a central switch or hub.\n  - Advantages: If one cable or workstation breaks, other devices are unaffected; easy to add new devices without network downtime; high performance.\n  - Disadvantages: If the central switch fails, the entire network goes down; requires extensive cabling.\n\n• Mesh Topology: Devices are interconnected directly with multiple redundant links (Full mesh: every node connected to every other node; Partial mesh: at least two routes to every node).\n  - Advantages: Extremely fault-tolerant with no single point of failure; data packets can be dynamically rerouted.\n  - Disadvantages: Extremely expensive cabling and high setup/maintenance complexity.",
        proDetail: "Exam Tip: Draw or recognise star topologies with a switch in the center, and mesh topologies with multiple intersecting connections. Note that wireless networks often form partial mesh topologies.",
      },
      {
        heading: "Network Hardware & Transmission Media",
        body: "Key Hardware Components:\n• Network Interface Controller (NIC): Hardware component that allows a device to connect to a network. Contains a unique, unchangeable MAC address hardcoded by the manufacturer.\n• Switch: Connects devices on a LAN and forwards data frames intelligently only to the specific destination device based on MAC address.\n• Router: Connects different networks together (e.g. LAN to WAN / Internet). Inspects destination IP addresses to route packets along the fastest path.\n• Wireless Access Point (WAP): Transmits and receives radio signals to connect wireless devices to a wired network.\n\nTransmission Media:\n• Twisted Pair Copper (Ethernet): Cheap, flexible, up to 100m range, vulnerable to electromagnetic interference.\n• Fibre-Optic Cable: Uses pulses of light. Immune to electrical interference, extremely high bandwidth, long distances (kilometres), but expensive and fragile.\n• Wireless (Wi-Fi 2.4GHz / 5GHz, Bluetooth): Radio waves. Highly convenient and portable, but subject to interference from walls, lower bandwidth, and security vulnerabilities.",
        proDetail: "Switch vs Router Distinction: A switch uses MAC addresses within a single local network. A router uses IP addresses to transmit packets between separate networks.",
      },
      {
        heading: "The Internet, IP Addresses, DNS & The Cloud",
        body: "• IP Address: Logical numerical address assigned dynamically or statically to any device on a TCP/IP network. Used for global routing across networks.\n  - IPv4: 32-bit address written as 4 decimal octets (e.g. 192.168.1.1), providing 4.3 billion addresses.\n  - IPv6: 128-bit address written as 8 hex groups (e.g. 2001:0db8:85a3::8a2e:0370:7334), created due to IPv4 address exhaustion.\n• MAC Address (Media Access Control): 48-bit physical address permanently assigned to the NIC at manufacture. Used within LANs.\n• Domain Name System (DNS): Translates human-friendly URLs (e.g. craigndave.org) into machine-readable IP addresses.\n  - Process: Browser checks local cache → queries recursive DNS server → queries Root / TLD server → returns IP address to browser to initiate connection.\n• The Cloud: Remote servers accessed over the internet for data storage, processing, and web-based applications.",
        proDetail: "Exam Step Question: 'Describe how a website is loaded using DNS'. Steps: 1) User types domain URL, 2) DNS server looks up domain in database, 3) Corresponding IP address returned to computer, 4) Computer sends HTTP/HTTPS request directly to that IP address.",
      },
      {
        heading: "Network Protocols & The TCP/IP 4-Layer Model",
        body: "A protocol is a set of agreed rules that govern how data is formatted, transmitted, and received across a network.\n\nKey Application Protocols:\n• HTTP / HTTPS: Hypertext Transfer Protocol (HTTPS is encrypted using SSL/TLS) for web page delivery.\n• FTP: File Transfer Protocol for transferring files between client and server.\n• SMTP: Simple Mail Transfer Protocol used to send emails from client to server or server to server.\n• IMAP / POP: Post Office Protocol downloads and removes emails from server; Internet Message Access Protocol syncs emails across multiple client devices.\n\nThe 4-Layer TCP/IP Model:\n1. Application Layer: Encodes/decodes user data into application protocols (HTTP, HTTPS, FTP, SMTP, IMAP).\n2. Transport Layer: Breaks data into packets, manages sequence numbers, error checking, and packet reassembly (TCP, UDP).\n3. Internet Layer (Network): Adds source and destination IP addresses and routes packets across networks (IP).\n4. Link Layer (Network Access): Physical transmission of electrical, optical, or radio signals across hardware using MAC addresses (Ethernet, Wi-Fi).",
        proDetail: "Why use Layers? 1) Interoperability: Changes in one layer do not affect other layers, 2) Modularity: Manufacturers can develop hardware/software independently for specific layers, 3) Troubleshooting is easier.",
      },
    ],
    flashcards: [
      { q: "What is the key difference between a LAN and a WAN?", a: "A LAN covers a small geographical site using internal infrastructure; a WAN covers a large geographical area using third-party telecoms infrastructure." },
      { q: "Explain the main difference between a Switch and a Router.", a: "A switch directs data packets within a LAN using MAC addresses; a router forwards packets between different networks using IP addresses." },
      { q: "What does the Domain Name System (DNS) do?", a: "Translates human-readable domain names (URLs) into numerical IP addresses." },
      { q: "List the 4 layers of the TCP/IP stack from top to bottom.", a: "Application Layer, Transport Layer, Internet Layer, and Link Layer." },
      { q: "Which protocol is used to securely browse encrypted web pages?", a: "HTTPS (Hypertext Transfer Protocol Secure)." },
      { q: "Why is IMAP generally preferred over POP3 for modern email?", a: "IMAP syncs emails with the server so messages remain accessible across multiple devices, unlike POP which downloads and deletes from the server." },
    ],
  },

  {
    id: "1-4-security",
    unit: "Unit 1.4",
    paper: 1,
    paperCode: "J277/01",
    paperTitle: "Paper 1: Computer Systems",
    title: "Network Security",
    subtopics: [
      "1.4.1 Threats to Computer Systems",
      "1.4.2 Identifying & Preventing Vulnerabilities"
    ],
    accent: "#f43f5e",
    notes: [
      {
        heading: "Malware Threats",
        body: "Malware (malicious software) is any software intentionally designed to cause damage, disrupt systems, or gain unauthorised access.\n\nTypes of Malware:\n• Virus: Malicious code attached to a legitimate file/program that self-replicates when the host program is executed by a human.\n• Worm: Standalone self-replicating malware that spreads across computer networks automatically without human interaction or host files.\n• Trojan Horse: Malware disguised as legitimate, useful software (e.g. games or utilities) that secretly opens a backdoor for attackers.\n• Ransomware: Encrypts files on the user's hard drive and displays a ransom demand for the decryption key.\n• Spyware: Secretly monitors user activity, logging keystrokes (keylogger), capturing webcams, or stealing login credentials.\n• Adware: Unwanted software that displays intrusive advertisements and redirects browser traffic.",
        proDetail: "Virus vs Worm Distinction: An exam favourite! A virus needs a host file and human action to spread. A worm is standalone and replicates automatically across networks using vulnerabilities.",
      },
      {
        heading: "Social Engineering Threats",
        body: "Social engineering exploits human psychology and trust rather than technical software bugs to gain access to confidential data.\n\nCommon Vectors:\n• Phishing: Fraudulent emails claiming to be from banks, schools, or trusted companies containing malicious links or attachments to harvest credentials.\n• Shoulder Surfing: Watching someone enter their PIN, password, or security pattern over their shoulder in person.\n• Pretexting: Fabricating an invented scenario (e.g. pretending to be IT support) to trick an employee into revealing passwords or system access.\n• Baiting: Leaving an infected USB flash drive in a public place labeled 'Executive Salaries' hoping a victim plugs it in.",
        proDetail: "Mitigation Tip: Technical security alone cannot stop social engineering. The primary defence is continuous staff training and awareness policies (e.g. verifying email headers, two-factor authentication).",
      },
      {
        heading: "Technical Network Attacks",
        body: "• Brute-Force Attack: An automated program systematically tries every possible combination of letters, numbers, and symbols until the correct password is found. Mitigated by lockout policies and 2FA.\n• Denial of Service (DoS / DDoS): Flooding a target web server with overwhelming volumes of dummy traffic to consume its bandwidth and processing capacity, crashing it for legitimate users. Distributed DoS (DDoS) uses a botnet of infected computers.\n• SQL Injection: Attacker enters malicious SQL code into input fields on a web form (e.g. username box). If inputs are not sanitized, the database interprets the text as SQL commands (e.g. `' OR '1'='1`), revealing or modifying protected tables.\n• Data Interception & Theft (Man-in-the-Middle): Intercepting unencrypted data packets transmitted over public or unsecured Wi-Fi using packet sniffers.",
        proDetail: "SQL Injection Prevention: Input sanitisation and parameterised queries (prepared statements) ensure user input is treated strictly as literal data rather than executable SQL code.",
      },
      {
        heading: "Identifying & Preventing Vulnerabilities",
        body: "Comprehensive security requires multi-layered defence (Defence in Depth):\n\n• Penetration Testing (Pen Testing): Authorised ethical hackers simulate real-world attacks to identify security weaknesses in network configurations and software before criminals exploit them.\n• Firewalls: Hardware or software filters that inspect incoming and outgoing packets based on configurable security rules, blocking unauthorised connections.\n• Anti-Malware Software: Scans drives, compares files against signature databases, and performs heuristic analysis to detect, quarantine, and remove malware.\n• User Access Levels: Restricts employee access only to files and databases necessary for their specific job role (Principle of Least Privilege).\n• Strong Passwords & Multi-Factor Authentication (MFA): Combining something you know (password) with something you have (phone/token) or are (biometrics).\n• Encryption: Scrambling plaintext into unreadable ciphertext using an algorithm and key. Without the key, intercepted data is unintelligible.",
        proDetail: "Black-Hat vs White-Hat Pen Testing: White-box testing gives the tester full architectural information and code; Black-box testing simulates an external attacker with zero prior inside knowledge.",
      },
    ],
    flashcards: [
      { q: "What is the difference between a Computer Virus and a Worm?", a: "A virus requires a host file and user activation to spread; a worm is standalone and self-replicates across networks automatically." },
      { q: "How does an SQL Injection attack work?", a: "Malicious SQL commands are entered into web input fields to manipulate backend database queries." },
      { q: "What is the purpose of a Firewall?", a: "Monitors and filters incoming and outgoing network traffic based on predetermined security rules to block unauthorized packets." },
      { q: "Define Penetration Testing.", a: "Authorised simulated cyber attacks on a computer system to identify vulnerabilities and test security defences." },
      { q: "What is Phishing?", a: "A social engineering attack where fraudulent emails deceive victims into revealing passwords or financial credentials." },
      { q: "Why is Multi-Factor Authentication (MFA) more secure than a password alone?", a: "It requires two or more independent authentication factors (e.g. password + SMS code), so stolen passwords alone cannot grant access." },
    ],
  },

  {
    id: "1-5-systems-software",
    unit: "Unit 1.5",
    paper: 1,
    paperCode: "J277/01",
    paperTitle: "Paper 1: Computer Systems",
    title: "Systems Software",
    subtopics: [
      "1.5.1 Operating Systems",
      "1.5.2 Utility Software"
    ],
    accent: "#10b981",
    notes: [
      {
        heading: "Purpose & Core Functions of the Operating System",
        body: "Systems software manages the computer hardware and provides an environment for applications to run. The Operating System (OS) is the master control software that acts as an interface between the user, software applications, and computer hardware.\n\nFive Essential Roles of an Operating System:\n1. User Interface (UI): Provides a method for humans to interact with the computer (GUI, CLI, Touch, Voice).\n2. Memory Management: Allocates RAM to running programs and coordinates virtual memory.\n3. Processor Management & Multitasking: Allocates CPU time slices to active processes.\n4. Peripheral Management & Device Drivers: Communicates with external hardware devices.\n5. File and Disk Management: Organises files into hierarchical folder structures and tracks disk blocks.\n6. User Management: Enforces security, user accounts, and access permissions.",
        proDetail: "Examiner Tip: In questions asking 'Explain the purpose of an operating system', always state that it provides a platform on which applications can run and bridges the gap between hardware and user.",
      },
      {
        heading: "User Interfaces: GUI vs CLI",
        body: "• Graphical User Interface (GUI): Based on WIMP elements (Windows, Icons, Menus, Pointers). Visual, intuitive, easy for beginners, requires no programming knowledge. However, consumes heavy memory and processing power.\n• Command Line Interface (CLI): Text-based interface where users type precise commands and arguments.\n  - Advantages: Extremely fast, lightweight, consumes minimal RAM and CPU, can be easily automated with shell scripts, gives expert administrators direct granular control.\n  - Disadvantages: Difficult for beginners; users must memorise exact command syntax and options.",
        proDetail: "Scenario Questions: When asked which interface is better for a server running headless in a data centre: CLI is ideal because it uses minimal resources and allows remote scripting over SSH.",
      },
      {
        heading: "Memory Management, Multitasking & Device Drivers",
        body: "• Memory Management: The OS loads programs from secondary storage into RAM. It ensures applications do not overwrite each other's memory blocks. When physical RAM is depleted, it manages swapping data with Virtual Memory on disk.\n• Multitasking: Even on a single-core CPU, the OS gives the illusion of simultaneous execution by rapidly switching the CPU between processes using scheduling algorithms (time slicing / interrupts).\n• Peripheral Management: Manages input/output devices (keyboard, mouse, monitor, printer, webcam).\n• Device Drivers: Small software programs that translate generic OS commands into specific hardware commands that the peripheral can understand. Without drivers, the OS cannot control external hardware.",
        proDetail: "Key Definition: A Device Driver is software that enables the operating system to communicate directly with hardware peripherals.",
      },
      {
        heading: "User & File Management",
        body: "• User Management: Manages individual user accounts, passwords, and user profiles. Controls access permissions (read, write, execute) to ensure users cannot tamper with system files or other users' confidential documents.\n• File Management: Organises physical disk blocks into logical files and directories (folders). Handles file operations: create, read, write, rename, move, and delete. Maintains a File Allocation Table (FAT / NTFS / ext4) tracking where data blocks are physically stored on disk.",
        proDetail: "Security Connection: Relate User Management to the Principle of Least Privilege: users are only granted the specific permissions needed to perform their daily duties.",
      },
      {
        heading: "Utility Software: Maintenance Tools",
        body: "Utility software consists of dedicated system programs designed to maintain, optimize, and protect the computer system.\n\nKey Utilities:\n• Defragmentation Utility: Over time, as files are saved, edited, and deleted, files become scattered in non-contiguous clusters across a magnetic hard drive. Defragmentation rearranges fragmented file clusters so they sit contiguously next to each other. This reduces read/write head movement, dramatically improving magnetic drive read speeds. (Note: NEVER defragment SSDs — it causes unnecessary flash cell wear and SSDs have near-instant random access).\n• Compression Utility: Shrinks file sizes using algorithms to reduce storage consumption and transmission time.\n• Encryption Utility: Encrypts disks, folders, or files with cryptographic ciphers to prevent unauthorized access if physical hardware is stolen.\n• Backup Utilities:\n  - Full Backup: Copies every single file on the system. Slow to perform and requires large storage capacity, but restoration is fast (only 1 backup needed).\n  - Incremental Backup: Only backs up files that have changed or been created since the last backup. Very fast to create, but restoring requires the initial full backup plus every subsequent incremental backup in chronological order.",
        proDetail: "Defragmentation Trap: Solid State Drives (SSDs) should NEVER be defragmented. Flash memory has no moving mechanical heads, so fragmented files read just as quickly. Defragging burns SSD write cycles.",
      },
    ],
    flashcards: [
      { q: "What is the primary purpose of an Operating System?", a: "To manage computer hardware and software resources and provide an interface for users and applications." },
      { q: "What is a Device Driver?", a: "A small program that translates generic operating system commands into specific instructions for hardware peripherals." },
      { q: "Explain the difference between a Full Backup and an Incremental Backup.", a: "A full backup copies all files every time; an incremental backup only copies files that have changed since the last backup." },
      { q: "Why should you never defragment a Solid State Drive (SSD)?", a: "SSDs have no moving parts so fragmentation does not slow them down, and defragmentation causes unnecessary write wear to flash memory cells." },
      { q: "What are the two main types of user interfaces?", a: "Graphical User Interface (GUI) and Command Line Interface (CLI)." },
      { q: "How does the Operating System enable multitasking on a computer?", a: "It allocates small time slices of CPU execution to different programs in rapid succession, creating the illusion of running simultaneously." },
    ],
  },

  {
    id: "1-6-ethics-law",
    unit: "Unit 1.6",
    paper: 1,
    paperCode: "J277/01",
    paperTitle: "Paper 1: Computer Systems",
    title: "Ethical, Legal, Cultural & Environmental Impacts",
    subtopics: [
      "1.6.1 Ethical & Cultural Impacts",
      "1.6.2 Environmental Issues",
      "1.6.3 Computer Legislation",
      "1.6.4 Open Source vs Proprietary Software"
    ],
    accent: "#06b6d4",
    notes: [
      {
        heading: "Ethical & Cultural Impacts of Digital Technology",
        body: "• Digital Divide: The economic and social inequality between those who have modern internet access, digital literacy, and devices, and those who do not (often affecting low-income families, elderly citizens, and developing nations).\n• Job Displacement & Automation: AI and robotics replacing factory workers, clerks, and customer service staff, creating technological unemployment while creating high-skill tech roles.\n• Privacy & Surveillance: Big Tech tracking browsing habits, social media behaviour, location telemetry, and biometric face recognition. Trade-off between personalized convenience and personal privacy.\n• Censorship & Free Speech: Governments and platforms filtering internet content, blocking dissenting information, and algorithmic echo chambers amplifying misinformation.",
        proDetail: "8-Mark Essay Structure: When writing extended 8-mark OCR essays, balance your argument across Ethical, Cultural, Environmental, and Legal viewpoints with specific real-world examples.",
      },
      {
        heading: "Environmental Impacts: E-Waste & Energy",
        body: "• Electronic Waste (E-Waste): Discarded electronic equipment (smartphones, laptops, monitors). Often shipped illegally to developing countries where unregulated recycling exposes workers and groundwater to toxic chemicals (lead, mercury, cadmium, arsenic).\n• Energy Consumption: Giant hyperscale data centres hosting cloud services, AI model training, and streaming consume vast megawattages of electricity, contributing to global greenhouse gas emissions.\n• Depletion of Rare Earth Minerals: Mining precious metals (lithium, cobalt, gold, neodymium) causes habitat destruction, pollution, and geopolitical conflict.\n• Sustainability Solutions: Using renewable energy for data centres, designing modular repairable devices (e.g. Fairphone), and mandatory recycling regulations (WEEE directive).",
        proDetail: "Exam Scenario: If an exam question asks about the environmental impact of upgrading office laptops every 2 years: discuss manufacturing emissions, landfill toxicity, mineral extraction, and power consumption.",
      },
      {
        heading: "UK Computer Legislation",
        body: "Four Essential Acts of UK Law:\n\n1. Data Protection Act 2018 (and UK GDPR):\n   Governs how organisations collect, store, and process personal data.\n   Principles: Data must be collected lawfully and transparently; used only for specified explicit purposes; accurate and up to date; kept no longer than necessary; and kept secure with adequate safeguards.\n\n2. Computer Misuse Act 1990:\n   Criminalises malicious computer activities.\n   Three Key Offences:\n   • Unauthorised access to computer material (e.g. logging into someone's account without permission).\n   • Unauthorised access with intent to commit a further crime (e.g. hacking to steal money).\n   • Unauthorised modification of computer material (e.g. planting malware, deleting files, or launching DoS attacks).\n\n3. Copyright, Designs and Patents Act 1988:\n   Protects intellectual property rights (software source code, books, music, video, artwork). Makes it illegal to copy, distribute, or pirate copyrighted software without the copyright owner's permission or license.\n\n4. Regulation of Investigatory Powers Act 2000 (RIPA):\n   Regulates public authorities' powers to intercept communications, conduct digital surveillance, and demand access to encrypted data for national security.",
        proDetail: "Exam Trap: Saying 'hacking is illegal' earns 0 marks unless you cite the Computer Misuse Act 1990 and specify 'unauthorised access to computer materials'.",
      },
      {
        heading: "Software Licensing: Open Source vs Proprietary",
        body: "• Open Source Software:\n  - The source code is publicly accessible and freely shared (e.g. Linux, Python, Blender, Firefox).\n  - Users can inspect, modify, and redistribute the code.\n  - Benefits: Usually free, strong community collaboration, transparent security audits.\n  - Drawbacks: May lack dedicated official customer support, documentation may be incomplete, reliance on volunteer maintainers.\n\n• Proprietary (Closed Source) Software:\n  - The compiled machine code is sold under a commercial license; source code is kept secret (e.g. Microsoft Windows, macOS, Adobe Photoshop).\n  - Benefits: Professional customer support, polished user experience, regular updates, guaranteed compatibility.\n  - Drawbacks: Expensive licenses/subscriptions, users cannot modify or customize the software, locked into vendor ecosystem.",
        proDetail: "Mark Scheme Distinctions: Emphasise that Open Source does NOT just mean 'free of cost' — the crucial definition is that the SOURCE CODE is freely accessible to view and edit.",
      },
    ],
    flashcards: [
      { q: "What is the primary purpose of the Data Protection Act 2018 (GDPR)?", a: "To protect individual privacy and regulate how personal data is collected, processed, and stored by organisations." },
      { q: "Name two specific offences under the Computer Misuse Act 1990.", a: "1) Unauthorised access to computer material, and 2) Unauthorised modification of computer material." },
      { q: "What is meant by the 'Digital Divide'?", a: "The gap between people who have reliable access to modern digital technology and the internet, and those who do not." },
      { q: "Explain the main difference between Open Source and Proprietary software.", a: "Open source software allows anyone to view and modify its source code, whereas proprietary software keeps its source code secret and restricted by a commercial license." },
      { q: "Why is electronic waste (e-waste) an environmental hazard?", a: "It contains hazardous toxic chemicals (mercury, lead, cadmium) that can leach into soil and groundwater if not recycled safely." },
      { q: "Which law protects software creators from having their code pirated or copied without permission?", a: "The Copyright, Designs and Patents Act 1988." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // COMPONENT 02: COMPUTATIONAL THINKING, ALGORITHMS & PROGRAMMING (J277/02)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "2-1-algorithms",
    unit: "Unit 2.1",
    paper: 2,
    paperCode: "J277/02",
    paperTitle: "Paper 2: Computational Thinking, Algorithms & Programming",
    title: "Algorithms",
    subtopics: [
      "2.1.1 Computational Thinking",
      "2.1.2 Searching Algorithms",
      "2.1.3 Sorting Algorithms",
      "2.1.4 Flowcharts & Pseudocode"
    ],
    accent: "#eab308",
    notes: [
      {
        heading: "Principles of Computational Thinking",
        body: "Computational thinking is the problem-solving methodology used to break down complex challenges into steps computers can execute.\n\nThree Core Pillars:\n• Abstraction: Filtering out unnecessary characteristics and details from a problem to concentrate solely on the essential components needed to solve it (e.g. London Underground map ignores real street geography to focus on line connections).\n• Decomposition: Breaking down a complex problem or system into smaller, more manageable sub-problems that can be analyzed, developed, and tested independently.\n• Algorithmic Thinking: Designing a logical, unambiguous, step-by-step sequence of instructions to reach a solution or perform a specific task.",
        proDetail: "Exam Definition Tip: Always define Abstraction as 'removing unnecessary details to focus on what is important'. For Decomposition, write 'breaking down a problem into smaller, manageable sub-problems'.",
      },
      {
        heading: "Standard Searching Algorithms: Linear vs Binary",
        body: "• Linear Search:\n  - Starts at index 0 and compares each item sequentially against the target value until found or the end of the list is reached.\n  - Advantage: Works on ANY list, whether sorted or unsorted.\n  - Disadvantage: Inefficient on large lists (Time complexity: O(n)).\n\n• Binary Search:\n  - PREREQUISITE: The dataset MUST be sorted in ascending order.\n  - Mechanism: Finds the midpoint: `mid = (low + high) // 2`.\n    1. If target equals midpoint item, search succeeds.\n    2. If target is less than midpoint, discard the right half (`high = mid - 1`).\n    3. If target is greater than midpoint, discard the left half (`low = mid + 1`).\n    4. Repeat until target found or `low > high` (item not present).\n  - Efficiency: Exceptionally fast on large datasets (O(log n)).",
        proDetail: "OCR Binary Search Question: If asked to perform binary search on `[2, 5, 8, 12, 16, 23, 38, 56, 72, 91]`, write out every step: Low=0, High=9, Mid=4 (item 16). Show the exact comparisons and updated boundaries.",
      },
      {
        heading: "Standard Sorting Algorithms: Bubble, Merge & Insertion",
        body: "1. Bubble Sort:\n   - Compares adjacent elements in a pass and swaps them if out of order.\n   - Largest unsorted value 'bubbles' to the end in each pass.\n   - Algorithm terminates when a complete pass is made with ZERO swaps.\n   - Simple to program and memory efficient, but very slow for large datasets (O(n²)).\n\n2. Merge Sort:\n   - Divide-and-conquer algorithm:\n   - 1. Divide: Recursively splits the list in half until each sub-list contains exactly 1 element.\n   - 2. Conquer: Repeatedly merges adjacent sub-lists back together in sorted order until one combined list remains.\n   - Very fast and consistent (O(n log n)), but requires extra memory to store sub-lists.\n\n3. Insertion Sort:\n   - Steps through the list one element at a time, picking the current element and inserting it into its correct position within the sorted portion to the left.\n   - Fast on small or nearly-sorted lists with minimal memory overhead.",
        proDetail: "Comparison Matrix: Bubble Sort (easy, slow, no extra memory), Insertion Sort (fast on small/partially sorted lists, low memory), Merge Sort (fast on large datasets, requires extra memory).",
      },
      {
        heading: "Producing Algorithms: Flowcharts & Pseudocode",
        body: "• Standard Flowchart Symbols:\n  - Terminator (Rounded Rectangle / Pill): Start or End of an algorithm.\n  - Process (Rectangle): Calculation or assignment (e.g. `total = total + 1`).\n  - Input / Output (Parallelogram): Taking input from user or printing output.\n  - Decision (Diamond): Condition with two branching paths (Yes / No or True / False).\n  - Flowline (Arrow): Indicates direction of execution flow.\n\n• Pseudocode:\n  - Informal high-level description of algorithm logic that uses structured English without language-specific syntax rules.",
        proDetail: "OCR Pseudocode Convention: Variables are declared with clear types; array indices start at 0; indentation indicates control blocks (IF...THEN...ELSE...ENDIF; FOR...TO...NEXT; WHILE...ENDWHILE).",
      },
      {
        heading: "Trace Tables & Dry Runs",
        body: "A trace table is a structured debugging technique used to manually track the values of variables as each instruction is executed step-by-step.\n\nColumns represent variables, conditions, and outputs; rows represent execution steps. Trace tables help identify logic errors and determine final algorithm outputs.",
        proDetail: "Trace Table Exam Strategy: Never skip rows or calculate multiple steps mentally. Update variable columns only when their value changes on that line.",
      },
    ],
    flashcards: [
      { q: "What is the key prerequisite before running a Binary Search?", a: "The list or array MUST be sorted in ascending order." },
      { q: "Define Abstraction in computational thinking.", a: "Filtering out unnecessary details to focus only on the essential features of a problem." },
      { q: "What indicates that a Bubble Sort algorithm has completed its sorting?", a: "A complete pass is completed through the list with ZERO swaps made." },
      { q: "Which standard sorting algorithm uses the 'divide and conquer' strategy?", a: "Merge Sort." },
      { q: "What flowchart symbol is used for an IF statement or condition?", a: "A diamond (Decision symbol)." },
      { q: "Define Decomposition.", a: "Breaking down a complex problem into smaller, more manageable sub-problems." },
    ],
  },

  {
    id: "2-2-programming",
    unit: "Unit 2.2",
    paper: 2,
    paperCode: "J277/02",
    paperTitle: "Paper 2: Computational Thinking, Algorithms & Programming",
    title: "Programming Fundamentals",
    subtopics: [
      "2.2.1 Core Programming Constructs",
      "2.2.2 Data Types & Operators",
      "2.2.3 Additional Programming Techniques"
    ],
    accent: "#22c55e",
    notes: [
      {
        heading: "The 3 Fundamental Programming Constructs",
        body: "All computer programs can be constructed from three fundamental building blocks:\n\n1. Sequence: Executing statements in consecutive order, one after another, from top to bottom.\n2. Selection: Making decisions to take alternative execution branches based on boolean conditions (`if`, `elif`, `else`).\n3. Iteration (Looping): Repeating a block of code multiple times.\n   - Count-Controlled Iteration (`for` loop): Repeats a fixed, predetermined number of times.\n   - Condition-Controlled Iteration (`while` loop): Repeats continuously until a boolean condition evaluates to false (or true).",
        proDetail: "Exam Trap: If you know in advance how many times the loop will run (e.g. iterating 10 times or through a list of 5 items), use a FOR loop. If the termination depends on user input or state change, use a WHILE loop.",
      },
      {
        heading: "Variables, Constants & Data Types",
        body: "• Variable: A named memory location whose stored value CAN change while the program is executing.\n• Constant: A named memory location whose value CANNOT be altered during program execution (e.g. `PI = 3.14159`, `MAX_ATTEMPTS = 3`). Prevents accidental overwriting and enhances readability.\n\nFive Primitive Data Types:\n• Integer: Whole positive or negative numbers without decimals (e.g. `42`, `-5`).\n• Real / Float: Numbers containing fractional decimal points (e.g. `3.14`, `-0.5`).\n• Boolean: Logic truth value with only two possible states: `True` or `False`.\n• Character: Single alphanumeric character, symbol, or space (e.g. `'A'`, `'7'`, `'#'`).\n• String: Sequence of alphanumeric characters enclosed in quotes (e.g. `'Hello World'`).\n\nType Casting: Explicitly converting a value from one data type to another (e.g. `int(\"42\")`, `str(100)`).",
        proDetail: "Exam Question: Why should a phone number be stored as a String rather than an Integer? 1) To preserve leading zeros (e.g. 07123...), 2) To store spaces or international country code plus signs (`+44`).",
      },
      {
        heading: "Arithmetic, Comparison & Boolean Operators",
        body: "• Arithmetic Operators:\n  - `+` (Addition), `-` (Subtraction), `*` (Multiplication), `/` (Real Division: `7 / 2 = 3.5`)\n  - `//` or `DIV` (Integer / Floor Division: returns whole quotient only, e.g. `7 // 2 = 3`)\n  - `%` or `MOD` (Modulus: returns remainder only, e.g. `7 % 2 = 1`)\n  - `**` or `^` (Exponent / Power: `2 ** 3 = 8`)\n\n• Comparison Operators:\n  - `==` (Equal to), `!=` (Not equal to), `<` (Less than), `<=` (Less than or equal), `>` (Greater than), `>=` (Greater than or equal)\n\n• Boolean Logic Operators:\n  - `AND`: True only if BOTH operands are true.\n  - `OR`: True if AT LEAST ONE operand is true.\n  - `NOT`: Inverts truth state (True becomes False).",
        proDetail: "MOD & DIV Applications: Commonly tested in OCR exams! E.g. determining if a number is even (`num % 2 == 0`) or converting total seconds into minutes and seconds (`mins = total // 60`, `secs = total % 60`).",
      },
      {
        heading: "String Handling & 1D / 2D Arrays",
        body: "• String Manipulation:\n  - Length: `len(\"Python\")` returns 6.\n  - Indexing: `word[0]` accesses the first character.\n  - Slicing: `word[0:3]` extracts a substring.\n  - Case Conversion: `word.upper()` and `word.lower()`.\n  - Concatenation: Joining strings with `+`.\n\n• Arrays & Lists:\n  - 1D Array: A contiguous linear collection of elements accessed by a single index: `scores = [78, 85, 92]`.\n  - 2D Array: A grid/matrix of elements accessed by row and column indices: `grid[row][col]`. Useful for game boards, seating charts, and spreadsheets.",
        proDetail: "0-Indexed Array Reminder: Remember that array indexing begins at 0 in Python and OCR Reference Language. An array with 5 elements has indices 0, 1, 2, 3, 4.",
      },
      {
        heading: "File Handling & Subprograms (Functions vs Procedures)",
        body: "• File Handling:\n  - Open: `file = open(\"data.txt\", \"r\")` (modes: `\"r\"` read, `\"w\"` write, `\"a\"` append).\n  - Read / Write: `content = file.readline()` or `file.write(\"score\")`.\n  - Close: `file.close()` (essential to flush buffers and release system locks).\n\n• Subprograms:\n  - Self-contained blocks of code with a unique identifier that perform a specific sub-task.\n  - Advantages: Code reuse (avoid duplicating code), modular development, easier testing and debugging.\n  - Procedure: A subprogram that executes a series of actions but does NOT return a value to the caller.\n  - Function: A subprogram that performs calculations and DOES return a value (`return result`).\n  - Parameters: Variables defined in the subprogram header to receive inputs.\n  - Arguments: The actual values passed into the subprogram when called.",
        proDetail: "Exam Definition Tip: The fundamental difference between a Function and a Procedure is that a Function returns a value to the calling code, whereas a Procedure does not.",
      },
    ],
    flashcards: [
      { q: "What are the three fundamental programming constructs?", a: "Sequence, Selection, and Iteration." },
      { q: "What is the crucial difference between a Function and a Procedure?", a: "A function returns a value back to the calling code, whereas a procedure does not return a value." },
      { q: "What is the result of 17 MOD 5 (17 % 5)?", a: "2 (since 17 divided by 5 is 3 with a remainder of 2)." },
      { q: "What is the difference between a Variable and a Constant?", a: "A variable's value can change during program execution, whereas a constant's value cannot be altered once set." },
      { q: "Why is a phone number stored as a String rather than an Integer in databases?", a: "To preserve leading zeros (e.g. '07...') and allow international symbols like '+' or spaces." },
      { q: "What does DIV (floor division //) do in programming?", a: "It divides two numbers and returns only the whole number quotient, discarding any remainder." },
    ],
  },

  {
    id: "2-3-robust-programs",
    unit: "Unit 2.3",
    paper: 2,
    paperCode: "J277/02",
    paperTitle: "Paper 2: Computational Thinking, Algorithms & Programming",
    title: "Producing Robust Programs",
    subtopics: [
      "2.3.1 Defensive Design",
      "2.3.2 Testing & Test Data"
    ],
    accent: "#f97316",
    notes: [
      {
        heading: "Defensive Design & Anticipating Misuse",
        body: "Defensive design is the practice of developing programs that anticipate user misuse, handle unexpected inputs gracefully without crashing, and safeguard systems against security exploits.\n\nKey Principles:\n• Anticipating Misuse: Assuming users will enter unexpected, erroneous, or malicious data (e.g. entering words into age boxes, clicking buttons multiple times).\n• Authentication: Confirming the identity of a user before granting system access (e.g. username/password, OTP SMS verification, biometric thumbprints).\n• Contingency Planning: Incorporating exception handling (e.g. `try...except`) to recover from hardware errors, missing files, or lost network connections without crashing.",
        proDetail: "Robust Program Definition: A program is robust if it can handle unexpected actions and invalid inputs without crashing or producing incorrect results.",
      },
      {
        heading: "Input Validation Techniques",
        body: "Input validation is an automated check performed by computer code to ensure entered data meets predefined criteria before being accepted for processing.\n\nFive Standard Validation Checks:\n1. Range Check: Verifies a number falls within acceptable minimum and maximum limits (e.g. month between 1 and 12, exam mark between 0 and 100).\n2. Length Check: Verifies string character count is within bounds (e.g. password must be at least 8 characters, UK postcode under 9 characters).\n3. Presence Check: Ensures a required field is not left blank or empty.\n4. Format Check: Verifies data conforms to a specific pattern or regex (e.g. date format `DD/MM/YYYY`, email containing `@` and `.`).\n5. Type Check: Verifies data is of the expected data type (e.g. age must be integer, name must be text).\n\nInput Sanitisation: Cleaning input data by stripping dangerous characters (e.g. trimming whitespace, removing HTML/SQL script tags).",
        proDetail: "Validation vs Verification: Validation checks if data is sensible and acceptable according to software rules. Verification checks if data entered matches the original source document (e.g. double entry of passwords).",
      },
      {
        heading: "Code Maintainability",
        body: "Writing maintainable code ensures other programmers can easily understand, modify, update, and debug the program in the future.\n\nTechniques for High Maintainability:\n• Meaningful Variable & Subprogram Names: Using self-explanatory identifiers (e.g. `totalScore` rather than `x`).\n• Code Comments: Explaining complex algorithm logic, assumptions, and formulas using `#` comments.\n• Indentation & Whitespace: Structuring code blocks clearly to show hierarchy and loops.\n• Constants: Using named constants (e.g. `TAX_RATE = 0.20`) rather than 'magic numbers' so changes only require updating one line.\n• Modularization: Breaking programs into small, single-purpose functions and procedures.",
        proDetail: "Exam Question: 'State two features of a program that make it more maintainable.' High-scoring answers: 1) Comments explaining purpose of code, 2) Meaningful identifiers for variables and subprograms, 3) Consistent indentation.",
      },
      {
        heading: "Testing Types: Syntax vs Logic Errors",
        body: "Testing proves that a program works as specified, detects errors, and validates robust performance under unexpected conditions.\n\n• Syntax Error: A mistake in the grammar or spelling of the programming language (e.g. missing colon `:`, misspelling `prnt()`, unclosed parentheses). The code cannot be compiled or interpreted and will not run.\n• Logic Error: The program runs without crashing, but produces the wrong or unexpected output due to flawed algorithm logic (e.g. writing `average = total / 2` when there were 3 items, or using `<` instead of `<=`).\n\nTesting Phases:\n• Iterative Testing: Testing modules and functions continually during the development process.\n• Final / Terminal Testing: Testing the entire completed system under realistic operating conditions before release.",
        proDetail: "Syntax vs Logic Error Distinction: Syntax errors break the language rules and stop execution immediately. Logic errors allow execution to complete, but generate incorrect results.",
      },
      {
        heading: "Selecting Test Data: Normal, Boundary, Invalid & Erroneous",
        body: "A comprehensive test plan verifies an algorithm against four distinct categories of test data.\n\nScenario: A program accepts test scores from 0 to 100 inclusive:\n\n1. Normal Test Data: Sensible data within the valid range that the program should accept without issue (e.g. `45`, `72`).\n2. Boundary (Extreme) Test Data: Values at the exact boundary edges of the acceptable range (e.g. `0` and `100`, or `1` and `99`).\n3. Invalid Test Data: Data of the correct data type that lies outside the acceptable range and should be rejected (e.g. `-1`, `101`, `150`).\n4. Erroneous Test Data: Data of the completely wrong data type that should be rejected by type checks (e.g. `\"eighty\"`, `\"abc\"`, `\"#\"`).",
        proDetail: "OCR Test Plan Tables: When constructing test plans in exams, always specify 4 columns: 1) Test Data, 2) Test Type (Normal/Boundary/Invalid/Erroneous), 3) Expected Outcome, 4) Actual Outcome.",
      },
    ],
    flashcards: [
      { q: "What is the difference between a Syntax Error and a Logic Error?", a: "A syntax error breaks the grammatical rules of the language and prevents execution; a logic error allows the program to run but produces incorrect results." },
      { q: "Name four types of input validation checks.", a: "Range check, Length check, Presence check, and Type check (or Format check)." },
      { q: "What is the difference between Iterative Testing and Final/Terminal Testing?", a: "Iterative testing is conducted continuously during development; terminal testing is conducted on the complete finished program before release." },
      { q: "Give an example of Boundary test data for an age input between 11 and 16.", a: "11 and 16 (the exact upper and lower acceptable limits)." },
      { q: "How do meaningful variable names improve code maintainability?", a: "They make the program self-documenting and easier for other programmers to understand, debug, and update." },
      { q: "What is the purpose of defensive design in software development?", a: "To anticipate human error and malicious misuse, preventing crashes and security vulnerabilities." },
    ],
  },

  {
    id: "2-4-boolean-logic",
    unit: "Unit 2.4",
    paper: 2,
    paperCode: "J277/02",
    paperTitle: "Paper 2: Computational Thinking, Algorithms & Programming",
    title: "Boolean Logic",
    subtopics: [
      "2.4.1 Logic Gates",
      "2.4.2 Truth Tables",
      "2.4.3 Combining Logic Circuits"
    ],
    accent: "#d946ef",
    notes: [
      {
        heading: "The Three Fundamental Logic Gates",
        body: "All digital electronic processors are built from microscopic transistors wired into logic gates that process binary signals (0 = False / Low voltage, 1 = True / High voltage).\n\n1. NOT Gate (Inverter):\n   - Single input, single output.\n   - Inverts the input: Output is `1` when input is `0`; Output is `0` when input is `1`.\n   - Boolean symbol: `P = NOT A` (or `¬A` / `Ā`).\n\n2. AND Gate:\n   - Two (or more) inputs, single output.\n   - Output is `1` ONLY IF BOTH inputs are `1`. If any input is `0`, output is `0`.\n   - Boolean symbol: `P = A AND B` (or `A ∧ B` / `A · B`).\n\n3. OR Gate:\n   - Two (or more) inputs, single output.\n   - Output is `1` IF AT LEAST ONE input is `1`. Output is `0` only when both inputs are `0`.\n   - Boolean symbol: `P = A OR B` (or `A ∨ B` / `A + B`).",
        proDetail: "Gate Shape Recognition: NOT gate is a triangle with a circle on the tip; AND gate has a flat back and rounded D-shape front; OR gate has a curved pointed shield shape with a curved back.",
      },
      {
        heading: "Constructing & Interpreting Truth Tables",
        body: "A truth table exhaustively lists every possible combination of inputs to a logic circuit alongside the resulting outputs.\n\nInput Combinations:\n• For n inputs, there are 2ⁿ possible binary combinations.\n• 2 inputs (A, B): 4 combinations `(0,0), (0,1), (1,0), (1,1)`.\n• 3 inputs (A, B, C): 8 combinations `(0,0,0), (0,0,1), (0,1,0), (0,1,1), (1,0,0), (1,0,1), (1,1,0), (1,1,1)`.\n\nStandard Truth Tables:\n• NOT: In: 0 → Out: 1; In: 1 → Out: 0.\n• AND: (0,0)→0, (0,1)→0, (1,0)→0, (1,1)→1.\n• OR: (0,0)→0, (0,1)→1, (1,0)→1, (1,1)→1.",
        proDetail: "Truth Table Exam Strategy: When completing a 3-input truth table, always list binary numbers in counting order: 000, 001, 010, 011, 100, 101, 110, 111. Create intermediate working columns for each gate.",
      },
      {
        heading: "Combining Logic Gates into Circuits",
        body: "Logic circuits combine multiple gates to create decision-making hardware (e.g. security alarms, arithmetic adders, CPU ALU controls).\n\nExample Circuit Problem: An intruder alarm system activates (`Alarm = 1`) if:\n- The system is armed (`A = 1`), AND\n- Either the motion sensor triggers (`M = 1`) OR the door contact breaks (`D = 1`).\n\nCircuit Design:\n1. Connect `M` and `D` inputs into an OR gate → Output `X = M OR D`.\n2. Connect `X` and `A` inputs into an AND gate → Output `Alarm = A AND (M OR D)`.",
        proDetail: "Order of Precedence in Boolean Logic: Just like BIDMAS in mathematics, Boolean logic follows: 1) Brackets `()`, 2) NOT, 3) AND, 4) OR. Always evaluate expressions inside brackets first.",
      },
      {
        heading: "Writing & Evaluating Boolean Expressions",
        body: "OCR questions require you to write a single Boolean expression from a logic circuit diagram or word problem, or draw the circuit corresponding to an expression.\n\nWorked Example:\nGiven expression `Q = (NOT A) AND (B OR C)`:\n• If `A = 0, B = 0, C = 1`:\n  - `NOT A = NOT 0 = 1`\n  - `B OR C = 0 OR 1 = 1`\n  - `Q = 1 AND 1 = 1`.",
        proDetail: "Exam Tip: Use clear uppercase letters for logic operators: `AND`, `OR`, `NOT`. Always wrap multi-term operations in parentheses to avoid ambiguity.",
      },
    ],
    flashcards: [
      { q: "What is the output of an AND gate when inputs are A = 1 and B = 0?", a: "0 (Both inputs must be 1 for an AND gate to output 1)." },
      { q: "How many input combinations exist for a 3-input truth table?", a: "8 combinations (2³ = 8, from 000 to 111)." },
      { q: "Which logic gate has exactly one input and one output?", a: "The NOT gate (inverter)." },
      { q: "Under what condition does an OR gate output 0?", a: "Only when ALL inputs are 0." },
      { q: "In what order are Boolean operators evaluated without brackets?", a: "NOT is evaluated first, then AND, then OR." },
      { q: "Evaluate the expression Q = (A OR B) AND (NOT C) when A=0, B=1, C=1.", a: "0 (Because NOT C is 0, and anything AND 0 equals 0)." },
    ],
  },

  {
    id: "2-5-languages-ide",
    unit: "Unit 2.5",
    paper: 2,
    paperCode: "J277/02",
    paperTitle: "Paper 2: Computational Thinking, Algorithms & Programming",
    title: "Programming Languages & IDEs",
    subtopics: [
      "2.5.1 Programming Languages",
      "2.5.2 Translators (Compilers vs Interpreters)",
      "2.5.3 IDE Tools & Facilities"
    ],
    accent: "#ec4899",
    notes: [
      {
        heading: "Levels of Programming Languages",
        body: "Computers only execute binary machine code instructions. Programming languages exist across different levels of abstraction:\n\n• High-Level Languages (e.g. Python, Java, C++, C#):\n  - Use English-like keywords (`if`, `while`, `print`) and mathematical notation.\n  - Portable: Can run across different CPU architectures with appropriate translators.\n  - Easy for humans to read, write, debug, and maintain.\n  - One high-level command translates into many low-level machine instructions.\n\n• Low-Level Languages:\n  - 1. Machine Code: Raw binary (0s and 1s) that the CPU directly executes without translation. Extremely tedious and error-prone for humans.\n  - 2. Assembly Language: Uses short mnemonic codes (e.g. `INP`, `ADD`, `STA`, `BRA`) directly mapped to CPU architecture opcodes. Gives direct hardware control, compact code, and maximum execution speed, but is CPU-specific and difficult to learn.",
        proDetail: "Comparison Tip: In 4-mark questions contrasting High-level and Assembly: High-level is portable and easy to maintain; Assembly gives direct hardware control, executes faster, and requires less memory.",
      },
      {
        heading: "Translators: Compilers vs Interpreters vs Assemblers",
        body: "CPUs cannot run high-level source code directly; a translator program must convert it into machine code.\n\n1. Compiler:\n   - Translates the entire high-level program source code all at once into an executable file (`.exe` or binary).\n   - Advantages: Executable runs very fast; source code is protected and kept private; executable runs independently without needing the compiler installed.\n   - Disadvantages: Initial compilation takes time; returns an overwhelming list of errors all at once; difficult to debug during development.\n\n2. Interpreter:\n   - Analyzes and executes source code line-by-line in real time.\n   - Advantages: Stops execution at the very first error found, making debugging fast and intuitive during development.\n   - Disadvantages: Execution is much slower (lines in loops must be re-translated repeatedly); requires the interpreter installed on the user machine; source code is exposed.\n\n3. Assembler:\n   - Translates low-level Assembly mnemonic code directly into binary Machine Code.",
        proDetail: "Exam Trap: Do not just say 'compiler is faster'. Clarify that a compiled program executes faster at runtime, but the initial compilation step takes time.",
      },
      {
        heading: "Facilities of an Integrated Development Environment (IDE)",
        body: "An Integrated Development Environment (like Xenon Code) is a unified software suite that provides all necessary tools for programmers to write, test, and debug code.\n\nFour Essential IDE Facilities:\n1. Source Code Editor:\n   - Provides syntax highlighting (colour-coding keywords, strings, variables).\n   - Auto-indentation and automatic bracket/quote closure.\n   - Line numbering and code completion (IntelliSense).\n2. Error Diagnostics & Debugger:\n   - Identifies syntax errors in real time with line indicators.\n   - Debugging tools: Breakpoints (pausing execution at specific lines), stepping through code one line at a time, and variable watches to monitor memory values.\n3. Run-Time Environment:\n   - Allows programmers to run and execute code directly within the IDE at the click of a button.\n4. Translator / Compiler / Interpreter:\n   - Integrated build system that automatically compiles or interprets code without leaving the editor.",
        proDetail: "Exam Definition Tip: When asked for two facilities of an IDE, state: 1) Code editor with syntax highlighting, 2) Debugger with breakpoints and error tracking.",
      },
    ],
    flashcards: [
      { q: "What is the key difference between a High-Level and a Low-Level language?", a: "High-level languages use English-like commands and are portable across hardware; low-level languages (machine code/assembly) are specific to one CPU architecture." },
      { q: "How does a Compiler translate code compared to an Interpreter?", a: "A compiler translates the entire source code at once into an executable file; an interpreter translates and runs the code line-by-line." },
      { q: "What is an Assembler?", a: "A translator that converts low-level Assembly mnemonic language into binary Machine Code." },
      { q: "Name three common tools provided by an Integrated Development Environment (IDE).", a: "Source code editor with syntax highlighting, debugger with breakpoints, and a run-time environment." },
      { q: "Why is an Interpreter often preferred over a Compiler during software development?", a: "It stops execution immediately on the first error encountered, making bug identification and testing much faster." },
      { q: "Why is Assembly language still used for some embedded systems?", a: "It allows direct control of hardware registers, runs at maximum speed, and has minimal memory overhead." },
    ],
  },
];
