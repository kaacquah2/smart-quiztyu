export interface Program {
  id: string
  title: string
  description: string
  years: Year[]
}

export interface Year {
  year: number
  semesters: Semester[]
}

export interface Semester {
  semester: number
  courses: Course[]
}

export interface Course {
  id: string
  title: string
  description?: string
}

export const programs: Program[] = [
  {
    id: "computer-science",
    title: "BSc. Computer Science",
    description: "Study of algorithms, programming languages, and computer systems",
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: [
              {
                id: "intro-to-cs",
                title: "Introduction to Computer Science",
                description: "Fundamentals of computer science and computing principles",
              },
              {
                id: "math-for-cs",
                title: "Mathematics for Computer Science",
                description: "Mathematical foundations for computer science",
              },
              {
                id: "intro-to-python",
                title: "Introduction to Programming (Python)",
                description: "Basics of programming using Python",
              },
              {
                id: "fundamentals-computing",
                title: "Fundamentals of Computing",
                description: "Core concepts in computing and information technology",
              },
              {
                id: "communication-skills",
                title: "Communication Skills",
                description: "Effective communication in technical contexts",
              },
              {
                id: "university-elective-1",
                title: "University Elective/General Education",
                description: "General education course",
              },
            ],
          },
          {
            semester: 2,
            courses: [
              {
                id: "data-structures",
                title: "Data Structures and Algorithms",
                description: "Fundamental data structures and algorithm design",
              },
              {
                id: "discrete-math",
                title: "Discrete Mathematics",
                description: "Mathematical structures for computer science",
              },
              {
                id: "database-systems",
                title: "Database Systems I",
                description: "Introduction to database design and SQL",
              },
              {
                id: "computer-organization",
                title: "Computer Organization",
                description: "Computer architecture and organization",
              },
              {
                id: "intro-software-eng",
                title: "Introduction to Software Engineering",
                description: "Software development methodologies and practices",
              },
              {
                id: "academic-writing",
                title: "Academic Writing and Research",
                description: "Research and writing skills for academic contexts",
              },
            ],
          },
        ],
      },
      {
        year: 2,
        semesters: [
          {
            semester: 1,
            courses: [
              {
                id: "operating-systems",
                title: "Operating Systems",
                description: "Principles and design of operating systems",
              },
              {
                id: "data-structures-2",
                title: "Data Structures and Algorithms II",
                description: "Advanced data structures and algorithm analysis",
              },
              {
                id: "oop-java",
                title: "Object-Oriented Programming (Java)",
                description: "Object-oriented programming concepts using Java",
              },
              {
                id: "digital-logic",
                title: "Digital Logic Design",
                description: "Design of digital circuits and systems",
              },
              {
                id: "linear-algebra",
                title: "Linear Algebra for Computing",
                description: "Linear algebra concepts for computer science applications",
              },
              {
                id: "university-elective-2",
                title: "General Education/University Elective",
                description: "General education course",
              },
            ],
          },
          {
            semester: 2,
            courses: [
              {
                id: "theory-computation",
                title: "Theory of Computation",
                description: "Formal languages, automata, and computability",
              },
              {
                id: "computer-networks",
                title: "Computer Networks",
                description: "Principles and protocols of computer networks",
              },
              {
                id: "database-systems-2",
                title: "Database Systems II",
                description: "Advanced database concepts and technologies",
              },
              {
                id: "web-development",
                title: "Web Development",
                description: "Client-side and server-side web development",
              },
              {
                id: "mathematical-logic",
                title: "Mathematical Logic",
                description: "Logic and formal reasoning for computer science",
              },
              {
                id: "professional-ethics",
                title: "Professional Ethics in Computing",
                description: "Ethical issues in computing and IT",
              },
            ],
          },
        ],
      },
      {
        year: 3,
        semesters: [
          {
            semester: 1,
            courses: [
              {
                id: "software-eng-advanced",
                title: "Software Engineering (Advanced)",
                description: "Advanced software engineering principles and practices",
              },
              {
                id: "artificial-intelligence",
                title: "Artificial Intelligence",
                description: "Fundamentals of AI and intelligent systems",
              },
              {
                id: "computer-graphics",
                title: "Computer Graphics",
                description: "Principles and algorithms for computer graphics",
              },
              {
                id: "advanced-database",
                title: "Advanced Database Management",
                description: "Advanced database concepts and technologies",
              },
              {
                id: "os-advanced",
                title: "Operating Systems (Advanced)",
                description: "Advanced operating system concepts",
              },
              {
                id: "mobile-app-dev",
                title: "Mobile Application Development",
                description: "Development of applications for mobile platforms",
              },
            ],
          },
          {
            semester: 2,
            courses: [
              {
                id: "machine-learning",
                title: "Machine Learning",
                description: "Algorithms and techniques for machine learning",
              },
              {
                id: "information-security",
                title: "Information Security",
                description: "Principles and practices of information security",
              },
              {
                id: "cloud-computing",
                title: "Cloud Computing",
                description: "Cloud computing technologies and services",
              },
              {
                id: "computer-vision",
                title: "Computer Vision",
                description: "Algorithms and applications of computer vision",
              },
              {
                id: "it-project-management",
                title: "IT Project Management",
                description: "Management of IT projects and teams",
              },
              {
                id: "university-elective-3",
                title: "General Education/University Elective",
                description: "General education course",
              },
            ],
          },
        ],
      },
      {
        year: 4,
        semesters: [
          {
            semester: 1,
            courses: [
              {
                id: "advanced-algorithms",
                title: "Advanced Algorithms",
                description: "Advanced algorithm design and analysis",
              },
              {
                id: "distributed-systems",
                title: "Distributed Systems",
                description: "Principles and design of distributed systems",
              },
              {
                id: "big-data-analytics",
                title: "Big Data Analytics",
                description: "Analysis of large-scale data sets",
              },
              {
                id: "cybersecurity",
                title: "Cybersecurity and Risk Management",
                description: "Security principles and risk management",
              },
              {
                id: "research-methods",
                title: "Research Methods in Computer Science",
                description: "Research methodologies in computer science",
              },
              {
                id: "internship",
                title: "Internship/Industrial Attachment",
                description: "Practical industry experience",
              },
            ],
          },
          {
            semester: 2,
            courses: [
              {
                id: "capstone-project-1",
                title: "Capstone Project I (Research/Design)",
                description: "First part of the capstone project",
              },
              {
                id: "advanced-web",
                title: "Advanced Web Technologies",
                description: "Advanced web development technologies",
              },
              {
                id: "blockchain",
                title: "Elective: Blockchain and Cryptocurrency",
                description: "Blockchain technology and applications",
              },
              {
                id: "game-development",
                title: "Elective: Game Development",
                description: "Principles and practices of game development",
              },
              {
                id: "iot",
                title: "Elective: Internet of Things (IoT)",
                description: "IoT technologies and applications",
              },
              {
                id: "capstone-project-2",
                title: "Capstone Project II (Implementation/Final Presentation)",
                description: "Final part of the capstone project",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "electrical-engineering",
    title: "BSc. Electrical and Electronic Engineering",
    description: "Study of electrical systems, electronics, and power generation",
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: [
              {
                id: "intro-to-ee",
                title: "Introduction to Electrical and Electronic Engineering",
                description: "Fundamentals of electrical and electronic engineering",
              },
              {
                id: "math-for-engineers-1",
                title: "Mathematics for Engineers I",
                description: "Mathematical foundations for engineering",
              },
              {
                id: "physics-for-engineers",
                title: "Physics for Engineers",
                description: "Physics principles for engineering applications",
              },
              {
                id: "intro-to-programming-ee",
                title: "Introduction to Programming",
                description: "Basics of programming for engineers",
              },
              {
                id: "basic-electrical-circuits",
                title: "Basic Electrical Circuits",
                description: "Fundamentals of electrical circuit analysis",
              },
              {
                id: "communication-skills-ee",
                title: "Communication Skills",
                description: "Effective communication in technical contexts",
              },
            ],
          },
          {
            semester: 2,
            courses: [
              {
                id: "circuit-analysis",
                title: "Circuit Analysis",
                description: "Advanced analysis of electrical circuits",
              },
              {
                id: "math-for-engineers-2",
                title: "Mathematics for Engineers II",
                description: "Advanced mathematical concepts for engineering",
              },
              {
                id: "digital-systems",
                title: "Digital Systems",
                description: "Digital logic and system design",
              },
              {
                id: "electronics-1",
                title: "Electronics I",
                description: "Introduction to electronic devices and circuits",
              },
              {
                id: "electromagnetism",
                title: "Electromagnetic Theory",
                description: "Principles of electromagnetic fields and waves",
              },
              {
                id: "technical-drawing",
                title: "Technical Drawing and CAD",
                description: "Engineering drawing and computer-aided design",
              },
            ],
          },
        ],
      },
      {
        year: 2,
        semesters: [
          {
            semester: 1,
            courses: [
              {
                id: "signals-systems",
                title: "Signals and Systems",
                description: "Analysis of signals and linear systems",
              },
              {
                id: "electronics-2",
                title: "Electronics II",
                description: "Advanced electronic circuits and devices",
              },
              {
                id: "electric-machines-1",
                title: "Electric Machines I",
                description: "Principles of electric motors and generators",
              },
              {
                id: "engineering-math",
                title: "Engineering Mathematics",
                description: "Applied mathematics for electrical engineering",
              },
              {
                id: "measurements-instrumentation",
                title: "Electrical Measurements and Instrumentation",
                description: "Techniques for electrical measurements",
              },
              {
                id: "engineering-economics",
                title: "Engineering Economics",
                description: "Economic analysis for engineering decisions",
              },
            ],
          },
          {
            semester: 2,
            courses: [
              {
                id: "control-systems",
                title: "Control Systems Engineering",
                description: "Analysis and design of control systems",
              },
              {
                id: "power-systems",
                title: "Power Systems I",
                description: "Introduction to electrical power systems",
              },
              {
                id: "digital-electronics",
                title: "Digital Electronics",
                description: "Analysis and design of digital electronic circuits",
              },
              {
                id: "electric-machines-2",
                title: "Electric Machines II",
                description: "Advanced electric machines and transformers",
              },
              {
                id: "numerical-methods",
                title: "Numerical Methods for Engineers",
                description: "Computational methods for engineering problems",
              },
              {
                id: "engineering-ethics",
                title: "Engineering Ethics and Professionalism",
                description: "Ethics and professional practice in engineering",
              },
            ],
          },
        ],
      },
      {
        year: 3,
        semesters: [
          {
            semester: 1,
            courses: [
              {
                id: "microprocessors",
                title: "Microprocessors and Microcontrollers",
                description: "Architecture and programming of microprocessors",
              },
              {
                id: "communication-systems",
                title: "Communication Systems",
                description: "Principles of analog and digital communication",
              },
              {
                id: "power-electronics",
                title: "Power Electronics",
                description: "Electronic conversion and control of electric power",
              },
              {
                id: "electromagnetic-fields",
                title: "Electromagnetic Fields and Waves",
                description: "Advanced electromagnetic theory",
              },
              {
                id: "engineering-design",
                title: "Engineering Design Project",
                description: "Team-based engineering design project",
              },
              {
                id: "technical-elective-1",
                title: "Technical Elective I",
                description: "Specialized electrical engineering topic",
              },
            ],
          },
          {
            semester: 2,
            courses: [
              {
                id: "digital-signal-processing",
                title: "Digital Signal Processing",
                description: "Processing and analysis of digital signals",
              },
              {
                id: "power-systems-2",
                title: "Power Systems II",
                description: "Advanced power systems analysis and operation",
              },
              {
                id: "renewable-energy",
                title: "Renewable Energy Systems",
                description: "Solar, wind, and other renewable energy technologies",
              },
              {
                id: "embedded-systems",
                title: "Embedded Systems",
                description: "Design of embedded computing systems",
              },
              {
                id: "industrial-electronics",
                title: "Industrial Electronics and Automation",
                description: "Electronic systems for industrial applications",
              },
              {
                id: "technical-elective-2",
                title: "Technical Elective II",
                description: "Specialized electrical engineering topic",
              },
            ],
          },
        ],
      },
      {
        year: 4,
        semesters: [
          {
            semester: 1,
            courses: [
              {
                id: "power-system-protection",
                title: "Power System Protection and Switchgear",
                description: "Protection of power systems from faults",
              },
              {
                id: "high-voltage-engineering",
                title: "High Voltage Engineering",
                description: "Principles of high voltage generation and testing",
              },
              {
                id: "wireless-communication",
                title: "Wireless and Mobile Communication",
                description: "Principles of wireless communication systems",
              },
              {
                id: "vlsi-design",
                title: "VLSI Design",
                description: "Design of very large scale integrated circuits",
              },
              {
                id: "research-project-1",
                title: "Final Year Research Project I",
                description: "First part of the final year research project",
              },
              {
                id: "technical-elective-3",
                title: "Technical Elective III",
                description: "Specialized electrical engineering topic",
              },
            ],
          },
          {
            semester: 2,
            courses: [
              {
                id: "research-project-2",
                title: "Final Year Research Project II",
                description: "Second part of the final year research project",
              },
              {
                id: "power-system-operation",
                title: "Power System Operation and Control",
                description: "Operation, control, and economics of power systems",
              },
              {
                id: "antenna-wave-propagation",
                title: "Antennas and Wave Propagation",
                description: "Principles of electromagnetic wave radiation and reception",
              },
              {
                id: "instrumentation-control",
                title: "Advanced Instrumentation and Control",
                description: "Advanced measurement and control systems",
              },
              {
                id: "technical-elective-4",
                title: "Technical Elective IV",
                description: "Specialized electrical engineering topic",
              },
              {
                id: "internship-ee",
                title: "Industrial Internship",
                description: "Practical industrial experience in electrical engineering",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "business-admin",
    title: "BSc. Business Administration",
    description: "Study of business operations, management, and strategy",
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: [
              {
                id: "intro-business",
                title: "Introduction to Business",
                description: "Overview of business concepts and practices",
              },
              {
                id: "principles-management",
                title: "Principles of Management",
                description: "Fundamentals of management theory and practice",
              },
              {
                id: "microeconomics",
                title: "Microeconomics",
                description: "Study of economic behavior at the individual and firm level",
              },
              {
                id: "business-math",
                title: "Business Mathematics",
                description: "Mathematical concepts applied to business",
              },
              {
                id: "business-communication",
                title: "Business Communication",
                description: "Effective communication in business contexts",
              },
              {
                id: "university-elective-ba-1",
                title: "University Elective/General Education",
                description: "General education course",
              },
            ],
          },
          {
            semester: 2,
            courses: [
              {
                id: "principles-accounting",
                title: "Principles of Accounting",
                description: "Fundamentals of accounting principles and practices",
              },
              {
                id: "macroeconomics",
                title: "Macroeconomics",
                description: "Study of economy-wide phenomena and policies",
              },
              {
                id: "business-statistics",
                title: "Business Statistics",
                description: "Statistical methods for business decision making",
              },
              {
                id: "organizational-behavior",
                title: "Organizational Behavior",
                description: "Study of human behavior in organizations",
              },
              {
                id: "business-law",
                title: "Business Law",
                description: "Legal principles affecting business operations",
              },
              {
                id: "it-business",
                title: "Information Technology for Business",
                description: "Application of IT in business contexts",
              },
            ],
          },
        ],
      },
      {
        year: 2,
        semesters: [
          {
            semester: 1,
            courses: [
              {
                id: "financial-accounting",
                title: "Financial Accounting",
                description: "Preparation and analysis of financial statements",
              },
              {
                id: "marketing-principles",
                title: "Principles of Marketing",
                description: "Fundamentals of marketing theory and practice",
              },
              {
                id: "business-finance",
                title: "Business Finance",
                description: "Financial management in business organizations",
              },
              {
                id: "human-resource-management",
                title: "Human Resource Management",
                description: "Management of human resources in organizations",
              },
              {
                id: "research-methods-business",
                title: "Research Methods for Business",
                description: "Research methodology for business problems",
              },
              {
                id: "university-elective-ba-2",
                title: "University Elective/General Education",
                description: "General education course",
              },
            ],
          },
          {
            semester: 2,
            courses: [
              {
                id: "management-accounting",
                title: "Management Accounting",
                description: "Accounting information for management decisions",
              },
              {
                id: "operations-management",
                title: "Operations Management",
                description: "Management of production processes and operations",
              },
              {
                id: "corporate-finance",
                title: "Corporate Finance",
                description: "Financial management in corporate settings",
              },
              {
                id: "business-ethics",
                title: "Business Ethics and Corporate Social Responsibility",
                description: "Ethical considerations in business decisions",
              },
              {
                id: "entrepreneurship",
                title: "Entrepreneurship",
                description: "Principles and practices of entrepreneurship",
              },
              {
                id: "business-analysis",
                title: "Business Analysis and Valuation",
                description: "Analysis and valuation of business enterprises",
              },
            ],
          },
        ],
      },
      {
        year: 3,
        semesters: [
          {
            semester: 1,
            courses: [
              {
                id: "strategic-management",
                title: "Strategic Management",
                description: "Formulation and implementation of business strategies",
              },
              {
                id: "marketing-management",
                title: "Marketing Management",
                description: "Development and implementation of marketing strategies",
              },
              {
                id: "investment-analysis",
                title: "Investment Analysis and Portfolio Management",
                description: "Analysis of investments and portfolio construction",
              },
              {
                id: "international-business",
                title: "International Business",
                description: "Business operations in a global context",
              },
              {
                id: "management-info-systems",
                title: "Management Information Systems",
                description: "Information systems for business management",
              },
              {
                id: "business-elective-1",
                title: "Business Elective I",
                description: "Specialized business topic",
              },
            ],
          },
          {
            semester: 2,
            courses: [
              {
                id: "innovation-management",
                title: "Innovation Management",
                description: "Management of innovation processes in organizations",
              },
              {
                id: "financial-markets",
                title: "Financial Markets and Institutions",
                description: "Structure and functions of financial markets",
              },
              {
                id: "quality-management",
                title: "Total Quality Management",
                description: "Principles and practices of quality management",
              },
              {
                id: "digital-marketing",
                title: "Digital Marketing",
                description: "Marketing strategies in digital environments",
              },
              {
                id: "business-analytics",
                title: "Business Analytics",
                description: "Data analytics for business decision making",
              },
              {
                id: "business-elective-2",
                title: "Business Elective II",
                description: "Specialized business topic",
              },
            ],
          },
        ],
      },
      {
        year: 4,
        semesters: [
          {
            semester: 1,
            courses: [
              {
                id: "business-research-project",
                title: "Business Research Project I",
                description: "First part of the business research project",
              },
              {
                id: "change-management",
                title: "Change Management and Leadership",
                description: "Management of organizational change processes",
              },
              {
                id: "business-forecasting",
                title: "Business Forecasting Methods",
                description: "Techniques for business forecasting",
              },
              {
                id: "risk-management",
                title: "Risk Management",
                description: "Identification and management of business risks",
              },
              {
                id: "supply-chain-management",
                title: "Supply Chain Management",
                description: "Management of supply chain activities",
              },
              {
                id: "business-elective-3",
                title: "Business Elective III",
                description: "Specialized business topic",
              },
            ],
          },
          {
            semester: 2,
            courses: [
              {
                id: "business-research-project-2",
                title: "Business Research Project II",
                description: "Second part of the business research project",
              },
              {
                id: "business-policy",
                title: "Business Policy and Strategy",
                description: "Integrative approach to business strategy",
              },
              {
                id: "project-management",
                title: "Project Management",
                description: "Management of business projects",
              },
              {
                id: "international-finance",
                title: "International Finance",
                description: "Financial management in international contexts",
              },
              {
                id: "business-simulation",
                title: "Business Simulation and Decision Making",
                description: "Simulation-based business decision making",
              },
              {
                id: "internship-ba",
                title: "Business Internship",
                description: "Practical business experience in organizational settings",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "nursing",
    title: "BSc. Nursing",
    description: "Study of patient care, health promotion, and disease prevention",
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: [
              {
                id: "intro-nursing",
                title: "Introduction to Nursing",
                description: "Fundamentals of nursing profession and practice",
              },
              {
                id: "anatomy-physiology-1",
                title: "Anatomy and Physiology I",
                description: "Structure and function of the human body",
              },
              {
                id: "microbiology",
                title: "Microbiology",
                description: "Study of microorganisms and their relation to health",
              },
              {
                id: "psychology-health",
                title: "Psychology for Health Professionals",
                description: "Psychological principles in healthcare",
              },
              {
                id: "nursing-ethics",
                title: "Nursing Ethics and Professional Practice",
                description: "Ethical principles in nursing practice",
              },
              {
                id: "communication-healthcare",
                title: "Communication in Healthcare",
                description: "Effective communication in healthcare settings",
              },
            ],
          },
          {
            semester: 2,
            courses: [
              {
                id: "fundamentals-nursing",
                title: "Fundamentals of Nursing Practice",
                description: "Basic nursing skills and procedures",
              },
              {
                id: "anatomy-physiology-2",
                title: "Anatomy and Physiology II",
                description: "Advanced study of human body systems",
              },
              {
                id: "biochemistry",
                title: "Biochemistry for Nurses",
                description: "Biochemical processes relevant to nursing",
              },
              {
                id: "nutrition",
                title: "Nutrition and Health",
                description: "Nutritional principles for health maintenance",
              },
              {
                id: "sociology-health",
                title: "Sociology of Health and Illness",
                description: "Social aspects of health and healthcare",
              },
              {
                id: "university-elective-nursing-1",
                title: "University Elective/General Education",
                description: "General education course",
              },
            ],
          },
        ],
      },
      {
        year: 2,
        semesters: [
          {
            semester: 1,
            courses: [
              {
                id: "adult-health-nursing-1",
                title: "Adult Health Nursing I",
                description: "Nursing care for adults with various health conditions",
              },
              {
                id: "pharmacology-1",
                title: "Pharmacology I",
                description: "Study of drugs and their effects",
              },
              {
                id: "health-assessment",
                title: "Health Assessment",
                description: "Methods for assessing patient health status",
              },
              {
                id: "pathophysiology",
                title: "Pathophysiology",
                description: "Study of disease processes",
              },
              {
                id: "clinical-practice-1",
                title: "Clinical Nursing Practice I",
                description: "Supervised clinical practice in healthcare settings",
              },
              {
                id: "research-nursing",
                title: "Research Methods in Nursing",
                description: "Research methodology for nursing practice",
              },
            ],
          },
          {
            semester: 2,
            courses: [
              {
                id: "adult-health-nursing-2",
                title: "Adult Health Nursing II",
                description: "Advanced nursing care for adults",
              },
              {
                id: "pharmacology-2",
                title: "Pharmacology II",
                description: "Advanced study of pharmacological principles",
              },
              {
                id: "maternal-newborn-nursing",
                title: "Maternal and Newborn Nursing",
                description: "Nursing care for mothers and newborns",
              },
              {
                id: "community-health-nursing-1",
                title: "Community Health Nursing I",
                description: "Nursing practice in community settings",
              },
              {
                id: "clinical-practice-2",
                title: "Clinical Nursing Practice II",
                description: "Advanced supervised clinical practice",
              },
              {
                id: "university-elective-nursing-2",
                title: "University Elective/General Education",
                description: "General education course",
              },
            ],
          },
        ],
      },
      {
        year: 3,
        semesters: [
          {
            semester: 1,
            courses: [
              {
                id: "pediatric-nursing",
                title: "Pediatric Nursing",
                description: "Nursing care for infants, children, and adolescents",
              },
              {
                id: "mental-health-nursing",
                title: "Mental Health Nursing",
                description: "Nursing care for individuals with mental health conditions",
              },
              {
                id: "community-health-nursing-2",
                title: "Community Health Nursing II",
                description: "Advanced community health nursing practice",
              },
              {
                id: "nursing-leadership",
                title: "Nursing Leadership and Management",
                description: "Leadership principles in nursing practice",
              },
              {
                id: "clinical-practice-3",
                title: "Clinical Nursing Practice III",
                description: "Specialized clinical practice",
              },
              {
                id: "nursing-informatics",
                title: "Nursing Informatics",
                description: "Information technology in nursing practice",
              },
            ],
          },
          {
            semester: 2,
            courses: [
              {
                id: "geriatric-nursing",
                title: "Geriatric Nursing",
                description: "Nursing care for older adults",
              },
              {
                id: "critical-care-nursing",
                title: "Critical Care Nursing",
                description: "Nursing care in critical care settings",
              },
              {
                id: "nursing-research-project",
                title: "Nursing Research Project",
                description: "Research project in nursing",
              },
              {
                id: "health-policy",
                title: "Health Policy and Healthcare Systems",
                description: "Study of healthcare policy and systems",
              },
              {
                id: "clinical-practice-4",
                title: "Clinical Nursing Practice IV",
                description: "Advanced specialized clinical practice",
              },
              {
                id: "university-elective-nursing-3",
                title: "University Elective/General Education",
                description: "General education course",
              },
            ],
          },
        ],
      },
      {
        year: 4,
        semesters: [
          {
            semester: 1,
            courses: [
              {
                id: "advanced-medical-surgical-nursing",
                title: "Advanced Medical-Surgical Nursing",
                description: "Advanced nursing care for medical-surgical patients",
              },
              {
                id: "emergency-nursing",
                title: "Emergency Nursing",
                description: "Nursing care in emergency situations",
              },
              {
                id: "nursing-elective-1",
                title: "Nursing Elective I",
                description: "Specialized nursing topic",
              },
              {
                id: "nursing-elective-2",
                title: "Nursing Elective II",
                description: "Specialized nursing topic",
              },
              {
                id: "clinical-practice-5",
                title: "Clinical Nursing Practice V",
                description: "Advanced clinical practice in specialized areas",
              },
              {
                id: "evidence-based-practice",
                title: "Evidence-Based Nursing Practice",
                description: "Application of research evidence in nursing practice",
              },
            ],
          },
          {
            semester: 2,
            courses: [
              {
                id: "nursing-internship",
                title: "Nursing Internship",
                description: "Intensive clinical practice in healthcare settings",
              },
              {
                id: "comprehensive-nursing-practice",
                title: "Comprehensive Nursing Practice",
                description: "Integration of nursing knowledge and skills",
              },
              {
                id: "global-health-issues",
                title: "Global Health Issues",
                description: "Study of global health challenges",
              },
              {
                id: "nursing-elective-3",
                title: "Nursing Elective III",
                description: "Specialized nursing topic",
              },
              {
                id: "professional-development",
                title: "Professional Development in Nursing",
                description: "Career planning and professional growth",
              },
              {
                id: "nursing-capstone",
                title: "Nursing Capstone Project",
                description: "Culminating project in nursing education",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "mechanical-engineering",
    title: "BSc. Mechanical Engineering",
    description: "Study of mechanics, thermodynamics, materials, and machine design",
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "intro-mechanical-eng", title: "Introduction to Mechanical Engineering", description: "Overview of mechanical engineering principles and careers" },
              { id: "engineering-math-1", title: "Engineering Mathematics I", description: "Mathematical foundations for engineering" },
              { id: "physics-mechanics", title: "Physics: Mechanics", description: "Fundamentals of mechanics and motion" },
              { id: "engineering-drawing", title: "Engineering Drawing and CAD", description: "Technical drawing and computer-aided design" },
              { id: "chemistry-engineers", title: "Chemistry for Engineers", description: "Basic chemistry concepts for engineering" },
              { id: "communication-skills-me", title: "Communication Skills", description: "Effective communication in technical contexts" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "engineering-math-2", title: "Engineering Mathematics II", description: "Advanced mathematical concepts for engineering" },
              { id: "materials-science", title: "Materials Science", description: "Properties and applications of engineering materials" },
              { id: "thermodynamics-1", title: "Thermodynamics I", description: "Basic thermodynamic principles" },
              { id: "statics", title: "Engineering Statics", description: "Analysis of static structures and forces" },
              { id: "workshop-practice", title: "Workshop Practice", description: "Hands-on training in engineering workshops" },
              { id: "university-elective-me-1", title: "University Elective/General Education", description: "General education course" }
            ]
          }
        ]
      },
      {
        year: 2,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "dynamics", title: "Engineering Dynamics", description: "Study of moving bodies and systems" },
              { id: "mechanics-materials", title: "Mechanics of Materials", description: "Behavior of materials under load" },
              { id: "thermodynamics-2", title: "Thermodynamics II", description: "Advanced thermodynamic systems" },
              { id: "fluid-mechanics-1", title: "Fluid Mechanics I", description: "Fundamentals of fluid behavior" },
              { id: "electrical-tech-me", title: "Electrical Technology for Mechanical Engineers", description: "Electrical concepts for mechanical systems" },
              { id: "engineering-economics-me", title: "Engineering Economics", description: "Economic analysis for engineering decisions" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "manufacturing-processes", title: "Manufacturing Processes", description: "Techniques and technologies in manufacturing" },
              { id: "machine-drawing", title: "Machine Drawing", description: "Technical drawing for machine components" },
              { id: "fluid-mechanics-2", title: "Fluid Mechanics II", description: "Advanced fluid mechanics" },
              { id: "applied-thermodynamics", title: "Applied Thermodynamics", description: "Applications of thermodynamic principles" },
              { id: "numerical-methods-me", title: "Numerical Methods for Engineers", description: "Computational methods in engineering" },
              { id: "university-elective-me-2", title: "University Elective/General Education", description: "General education course" }
            ]
          }
        ]
      },
      {
        year: 3,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "machine-design-1", title: "Machine Design I", description: "Design of machine elements and systems" },
              { id: "heat-transfer", title: "Heat Transfer", description: "Mechanisms of heat transfer in engineering" },
              { id: "control-systems-me", title: "Control Systems", description: "Principles of automatic control" },
              { id: "mechanical-vibrations", title: "Mechanical Vibrations", description: "Analysis of vibrating systems" },
              { id: "mechatronics", title: "Mechatronics", description: "Integration of mechanical and electronic systems" },
              { id: "technical-elective-me-1", title: "Technical Elective I", description: "Specialized mechanical engineering topic" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "machine-design-2", title: "Machine Design II", description: "Advanced machine design concepts" },
              { id: "production-planning", title: "Production Planning and Control", description: "Management of manufacturing processes" },
              { id: "automobile-engineering", title: "Automobile Engineering", description: "Design and analysis of automotive systems" },
              { id: "refrigeration-ac", title: "Refrigeration and Air Conditioning", description: "Principles of refrigeration and HVAC" },
              { id: "industrial-engineering", title: "Industrial Engineering", description: "Optimization of industrial operations" },
              { id: "technical-elective-me-2", title: "Technical Elective II", description: "Specialized mechanical engineering topic" }
            ]
          }
        ]
      },
      {
        year: 4,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "power-plant-eng", title: "Power Plant Engineering", description: "Design and operation of power plants" },
              { id: "finite-element-analysis", title: "Finite Element Analysis", description: "Numerical analysis of engineering structures" },
              { id: "renewable-energy-me", title: "Renewable Energy Systems", description: "Alternative energy sources and technologies" },
              { id: "project-management-me", title: "Project Management", description: "Management of engineering projects" },
              { id: "seminar-me", title: "Seminar", description: "Presentation and discussion of engineering topics" },
              { id: "major-project-1", title: "Major Project I", description: "First phase of final year project" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "major-project-2", title: "Major Project II", description: "Completion of final year project" },
              { id: "industrial-training", title: "Industrial Training/Internship", description: "Practical industry experience" },
              { id: "robotics-me", title: "Robotics", description: "Principles and applications of robotics" },
              { id: "environmental-eng", title: "Environmental Engineering", description: "Environmental impact and sustainability in engineering" },
              { id: "technical-elective-me-3", title: "Technical Elective III", description: "Specialized mechanical engineering topic" },
              { id: "technical-elective-me-4", title: "Technical Elective IV", description: "Specialized mechanical engineering topic" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "mathematics",
    title: "BSc. Mathematics",
    description: "Study of numbers, quantities, shapes, and patterns",
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "calculus-1", title: "Calculus I", description: "Differential and integral calculus" },
              { id: "linear-algebra-1", title: "Linear Algebra I", description: "Vector spaces and linear transformations" },
              { id: "intro-math", title: "Introduction to Mathematics", description: "Fundamental concepts in mathematics" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "calculus-2", title: "Calculus II", description: "Sequences, series, and multivariable calculus" },
              { id: "discrete-math-math", title: "Discrete Mathematics", description: "Logic, sets, and combinatorics" },
              { id: "probability", title: "Probability Theory", description: "Basic probability and statistics" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "physics",
    title: "BSc. Physics",
    description: "Study of matter, energy, and the interactions between them",
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "mechanics", title: "Mechanics", description: "Motion, forces, and energy" },
              { id: "waves-optics", title: "Waves and Optics", description: "Wave phenomena and optics" },
              { id: "math-physics", title: "Mathematics for Physics", description: "Mathematical methods in physics" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "electricity-magnetism", title: "Electricity and Magnetism", description: "Electromagnetic theory" },
              { id: "thermal-physics", title: "Thermal Physics", description: "Heat, temperature, and thermodynamics" },
              { id: "modern-physics", title: "Modern Physics", description: "Relativity and quantum mechanics" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "civil-engineering",
    title: "BSc. Civil Engineering",
    description: "Study of design, construction, and maintenance of the built environment",
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "intro-civil-eng", title: "Introduction to Civil Engineering", description: "Overview of civil engineering" },
              { id: "engineering-math-ce", title: "Engineering Mathematics", description: "Mathematics for civil engineers" },
              { id: "engineering-drawing-ce", title: "Engineering Drawing", description: "Technical drawing for civil engineering" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "materials-science-ce", title: "Materials Science", description: "Properties of construction materials" },
              { id: "surveying", title: "Surveying", description: "Principles and methods of surveying" },
              { id: "mechanics-structures", title: "Mechanics of Structures", description: "Statics and strength of materials" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "economics",
    title: "BA. Economics",
    description: "Study of production, distribution, and consumption of goods and services",
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "microeconomics-eco", title: "Microeconomics", description: "Consumer and firm behavior" },
              { id: "math-economics", title: "Mathematics for Economics", description: "Mathematical tools for economics" },
              { id: "economic-history", title: "Economic History", description: "Development of economic systems" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "macroeconomics-eco", title: "Macroeconomics", description: "National income and policy" },
              { id: "statistics-economics", title: "Statistics for Economics", description: "Statistical methods in economics" },
              { id: "development-economics", title: "Development Economics", description: "Economics of developing countries" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "sociology",
    title: "BA. Sociology",
    description: "Study of society, social relationships, and institutions",
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "intro-sociology", title: "Introduction to Sociology", description: "Basic concepts in sociology" },
              { id: "social-theory", title: "Social Theory", description: "Classical and contemporary social theory" },
              { id: "research-methods-soc", title: "Research Methods", description: "Methods of sociological research" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "sociology-family", title: "Sociology of the Family", description: "Family structures and relationships" },
              { id: "social-stratification", title: "Social Stratification", description: "Inequality and social class" },
              { id: "culture-society", title: "Culture and Society", description: "Cultural influences on society" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "pharmacy",
    title: "BSc. Pharmacy",
    description: "Study of drugs, their preparation, and their effects",
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "intro-pharmacy", title: "Introduction to Pharmacy", description: "Overview of pharmacy profession" },
              { id: "pharmaceutical-chemistry", title: "Pharmaceutical Chemistry", description: "Chemistry of drugs" },
              { id: "human-anatomy-pharm", title: "Human Anatomy", description: "Structure of the human body" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "pharmaceutics", title: "Pharmaceutics", description: "Formulation and delivery of drugs" },
              { id: "physiology-pharm", title: "Physiology", description: "Functions of the human body" },
              { id: "microbiology-pharm", title: "Microbiology", description: "Microorganisms and health" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "biomedical-science",
    title: "BSc. Biomedical Science",
    description: "Study of biological sciences related to human health and disease",
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "intro-biomed", title: "Introduction to Biomedical Science", description: "Overview of biomedical science" },
              { id: "cell-biology", title: "Cell Biology", description: "Structure and function of cells" },
              { id: "chemistry-biomed", title: "Chemistry for Biomedical Science", description: "Basic chemistry concepts" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "genetics", title: "Genetics", description: "Principles of heredity and variation" },
              { id: "biochemistry-biomed", title: "Biochemistry", description: "Biochemical processes in living organisms" },
              { id: "anatomy-biomed", title: "Anatomy", description: "Human body structure" }
            ]
          }
        ]
      }
    ]
  }
]

export function getProgramById(id: string): Program | undefined {
  return programs.find((program) => program.id === id)
}

export function getCourseById(programId: string, courseId: string): Course | undefined {
  const program = getProgramById(programId)
  if (!program) return undefined

  for (const year of program.years) {
    for (const semester of year.semesters) {
      const course = semester.courses.find((course) => course.id === courseId)
      if (course) return course
    }
  }

  return undefined
}
