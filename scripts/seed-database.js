const { PrismaClient } = require('../lib/generated/prisma')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// Program data - copied from lib/program-data.ts
const programs = [
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
              { id: "intro-to-cs", title: "Introduction to Computer Science", description: "Fundamentals of computer science and computing principles" },
              { id: "math-for-cs", title: "Mathematics for Computer Science", description: "Mathematical foundations for computer science" },
              { id: "intro-to-python", title: "Introduction to Programming (Python)", description: "Basics of programming using Python" },
              { id: "fundamentals-computing", title: "Fundamentals of Computing", description: "Core concepts in computing and information technology" },
              { id: "communication-skills", title: "Communication Skills", description: "Effective communication in technical contexts" },
              { id: "university-elective-1", title: "University Elective/General Education", description: "General education course" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "data-structures", title: "Data Structures and Algorithms", description: "Fundamental data structures and algorithm design" },
              { id: "discrete-math", title: "Discrete Mathematics", description: "Mathematical structures for computer science" },
              { id: "database-systems", title: "Database Systems I", description: "Introduction to database design and SQL" },
              { id: "computer-organization", title: "Computer Organization", description: "Computer architecture and organization" },
              { id: "intro-software-eng", title: "Introduction to Software Engineering", description: "Software development methodologies and practices" },
              { id: "academic-writing", title: "Academic Writing and Research", description: "Research and writing skills for academic contexts" }
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
              { id: "operating-systems", title: "Operating Systems", description: "Principles and design of operating systems" },
              { id: "data-structures-2", title: "Data Structures and Algorithms II", description: "Advanced data structures and algorithm analysis" },
              { id: "oop-java", title: "Object-Oriented Programming (Java)", description: "Object-oriented programming concepts using Java" },
              { id: "digital-logic", title: "Digital Logic Design", description: "Design of digital circuits and systems" },
              { id: "linear-algebra", title: "Linear Algebra for Computing", description: "Linear algebra concepts for computer science applications" },
              { id: "university-elective-2", title: "General Education/University Elective", description: "General education course" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "theory-computation", title: "Theory of Computation", description: "Formal languages, automata, and computability" },
              { id: "computer-networks", title: "Computer Networks", description: "Principles and protocols of computer networks" },
              { id: "database-systems-2", title: "Database Systems II", description: "Advanced database concepts and technologies" },
              { id: "web-development", title: "Web Development", description: "Client-side and server-side web development" },
              { id: "mathematical-logic", title: "Mathematical Logic", description: "Logic and formal reasoning for computer science" },
              { id: "professional-ethics", title: "Professional Ethics in Computing", description: "Ethical issues in computing and IT" }
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
              { id: "software-eng-advanced", title: "Software Engineering (Advanced)", description: "Advanced software engineering principles and practices" },
              { id: "artificial-intelligence", title: "Artificial Intelligence", description: "Fundamentals of AI and intelligent systems" },
              { id: "computer-graphics", title: "Computer Graphics", description: "Principles and algorithms for computer graphics" },
              { id: "advanced-database", title: "Advanced Database Management", description: "Advanced database concepts and technologies" },
              { id: "os-advanced", title: "Operating Systems (Advanced)", description: "Advanced operating system concepts" },
              { id: "mobile-app-dev", title: "Mobile Application Development", description: "Development of applications for mobile platforms" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "machine-learning", title: "Machine Learning", description: "Algorithms and techniques for machine learning" },
              { id: "information-security", title: "Information Security", description: "Principles and practices of information security" },
              { id: "cloud-computing", title: "Cloud Computing", description: "Cloud computing technologies and services" },
              { id: "computer-vision", title: "Computer Vision", description: "Algorithms and applications of computer vision" },
              { id: "it-project-management", title: "IT Project Management", description: "Management of IT projects and teams" },
              { id: "university-elective-3", title: "General Education/University Elective", description: "General education course" }
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
              { id: "advanced-algorithms", title: "Advanced Algorithms", description: "Advanced algorithm design and analysis" },
              { id: "distributed-systems", title: "Distributed Systems", description: "Principles and design of distributed systems" },
              { id: "big-data-analytics", title: "Big Data Analytics", description: "Analysis of large-scale data sets" },
              { id: "cybersecurity", title: "Cybersecurity and Risk Management", description: "Security principles and risk management" },
              { id: "research-methods", title: "Research Methods in Computer Science", description: "Research methodologies in computer science" },
              { id: "internship", title: "Internship/Industrial Attachment", description: "Practical industry experience" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "capstone-project-1", title: "Capstone Project I (Research/Design)", description: "First part of the capstone project" },
              { id: "advanced-web", title: "Advanced Web Technologies", description: "Advanced web development technologies" },
              { id: "blockchain", title: "Elective: Blockchain and Cryptocurrency", description: "Blockchain technology and applications" },
              { id: "game-development", title: "Elective: Game Development", description: "Principles and practices of game development" },
              { id: "iot", title: "Elective: Internet of Things (IoT)", description: "IoT technologies and applications" },
              { id: "capstone-project-2", title: "Capstone Project II (Implementation/Final Presentation)", description: "Final part of the capstone project" }
            ]
          }
        ]
      }
    ]
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
              { id: "intro-to-ee", title: "Introduction to Electrical and Electronic Engineering", description: "Fundamentals of electrical and electronic engineering" },
              { id: "math-for-engineers-1", title: "Mathematics for Engineers I", description: "Mathematical foundations for engineering" },
              { id: "physics-for-engineers", title: "Physics for Engineers", description: "Physics principles for engineering applications" },
              { id: "intro-to-programming-ee", title: "Introduction to Programming", description: "Basics of programming for engineers" },
              { id: "basic-electrical-circuits", title: "Basic Electrical Circuits", description: "Fundamentals of electrical circuit analysis" },
              { id: "communication-skills-ee", title: "Communication Skills", description: "Effective communication in technical contexts" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "circuit-analysis", title: "Circuit Analysis", description: "Advanced analysis of electrical circuits" },
              { id: "math-for-engineers-2", title: "Mathematics for Engineers II", description: "Advanced mathematical concepts for engineering" },
              { id: "digital-systems", title: "Digital Systems", description: "Digital logic and system design" },
              { id: "electronics-1", title: "Electronics I", description: "Introduction to electronic devices and circuits" },
              { id: "electromagnetism", title: "Electromagnetic Theory", description: "Principles of electromagnetic fields and waves" },
              { id: "technical-drawing", title: "Technical Drawing and CAD", description: "Engineering drawing and computer-aided design" }
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
              { id: "signals-systems", title: "Signals and Systems", description: "Analysis of signals and linear systems" },
              { id: "electronics-2", title: "Electronics II", description: "Advanced electronic circuits and devices" },
              { id: "electric-machines-1", title: "Electric Machines I", description: "Principles of electric motors and generators" },
              { id: "engineering-math", title: "Engineering Mathematics", description: "Applied mathematics for electrical engineering" },
              { id: "measurements-instrumentation", title: "Electrical Measurements and Instrumentation", description: "Techniques for electrical measurements" },
              { id: "engineering-economics", title: "Engineering Economics", description: "Economic analysis for engineering decisions" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "control-systems", title: "Control Systems Engineering", description: "Analysis and design of control systems" },
              { id: "power-systems", title: "Power Systems I", description: "Introduction to electrical power systems" },
              { id: "digital-electronics", title: "Digital Electronics", description: "Analysis and design of digital electronic circuits" },
              { id: "electric-machines-2", title: "Electric Machines II", description: "Advanced electric machines and transformers" },
              { id: "numerical-methods", title: "Numerical Methods for Engineers", description: "Computational methods for engineering problems" },
              { id: "engineering-ethics", title: "Engineering Ethics and Professionalism", description: "Ethics and professional practice in engineering" }
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
              { id: "microprocessors", title: "Microprocessors and Microcontrollers", description: "Architecture and programming of microprocessors" },
              { id: "communication-systems", title: "Communication Systems", description: "Principles of analog and digital communication" },
              { id: "power-electronics", title: "Power Electronics", description: "Electronic conversion and control of electric power" },
              { id: "electromagnetic-fields", title: "Electromagnetic Fields and Waves", description: "Advanced electromagnetic theory" },
              { id: "engineering-design", title: "Engineering Design Project", description: "Team-based engineering design project" },
              { id: "technical-elective-1", title: "Technical Elective I", description: "Specialized electrical engineering topic" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "digital-signal-processing", title: "Digital Signal Processing", description: "Processing and analysis of digital signals" },
              { id: "power-systems-2", title: "Power Systems II", description: "Advanced power systems analysis and operation" },
              { id: "renewable-energy", title: "Renewable Energy Systems", description: "Solar, wind, and other renewable energy technologies" },
              { id: "embedded-systems", title: "Embedded Systems", description: "Design of embedded computing systems" },
              { id: "industrial-electronics", title: "Industrial Electronics and Automation", description: "Electronic systems for industrial applications" },
              { id: "technical-elective-2", title: "Technical Elective II", description: "Specialized electrical engineering topic" }
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
              { id: "power-system-protection", title: "Power System Protection and Switchgear", description: "Protection of power systems from faults" },
              { id: "high-voltage-engineering", title: "High Voltage Engineering", description: "Principles of high voltage generation and testing" },
              { id: "wireless-communication", title: "Wireless and Mobile Communication", description: "Principles of wireless communication systems" },
              { id: "vlsi-design", title: "VLSI Design", description: "Design of very large scale integrated circuits" },
              { id: "research-project-1", title: "Final Year Research Project I", description: "First part of the final year research project" },
              { id: "technical-elective-3", title: "Technical Elective III", description: "Specialized electrical engineering topic" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "research-project-2", title: "Final Year Research Project II", description: "Second part of the final year research project" },
              { id: "power-system-operation", title: "Power System Operation and Control", description: "Operation, control, and economics of power systems" },
              { id: "antenna-wave-propagation", title: "Antennas and Wave Propagation", description: "Principles of electromagnetic wave radiation and reception" },
              { id: "instrumentation-control", title: "Advanced Instrumentation and Control", description: "Advanced measurement and control systems" },
              { id: "technical-elective-4", title: "Technical Elective IV", description: "Specialized electrical engineering topic" },
              { id: "internship-ee", title: "Industrial Internship", description: "Practical industrial experience in electrical engineering" }
            ]
          }
        ]
      }
    ]
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
              { id: "intro-business", title: "Introduction to Business", description: "Overview of business concepts and practices" },
              { id: "principles-management", title: "Principles of Management", description: "Fundamentals of management theory and practice" },
              { id: "microeconomics", title: "Microeconomics", description: "Study of economic behavior at the individual and firm level" },
              { id: "business-math", title: "Business Mathematics", description: "Mathematical concepts applied to business" },
              { id: "business-communication", title: "Business Communication", description: "Effective communication in business contexts" },
              { id: "university-elective-ba-1", title: "University Elective/General Education", description: "General education course" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "principles-accounting", title: "Principles of Accounting", description: "Fundamentals of accounting principles and practices" },
              { id: "macroeconomics", title: "Macroeconomics", description: "Study of economy-wide phenomena and policies" },
              { id: "business-statistics", title: "Business Statistics", description: "Statistical methods for business decision making" },
              { id: "organizational-behavior", title: "Organizational Behavior", description: "Study of human behavior in organizations" },
              { id: "business-law", title: "Business Law", description: "Legal principles affecting business operations" },
              { id: "it-business", title: "Information Technology for Business", description: "Application of IT in business contexts" }
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
              { id: "financial-accounting", title: "Financial Accounting", description: "Preparation and analysis of financial statements" },
              { id: "marketing-principles", title: "Principles of Marketing", description: "Fundamentals of marketing theory and practice" },
              { id: "business-finance", title: "Business Finance", description: "Financial management in business organizations" },
              { id: "human-resource-management", title: "Human Resource Management", description: "Management of human resources in organizations" },
              { id: "research-methods-business", title: "Research Methods for Business", description: "Research methodology for business problems" },
              { id: "university-elective-ba-2", title: "University Elective/General Education", description: "General education course" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "management-accounting", title: "Management Accounting", description: "Accounting information for management decisions" },
              { id: "operations-management", title: "Operations Management", description: "Management of production processes and operations" },
              { id: "corporate-finance", title: "Corporate Finance", description: "Financial management in corporate settings" },
              { id: "business-ethics", title: "Business Ethics and Corporate Social Responsibility", description: "Ethical considerations in business decisions" },
              { id: "entrepreneurship", title: "Entrepreneurship", description: "Principles and practices of entrepreneurship" },
              { id: "business-analysis", title: "Business Analysis and Valuation", description: "Analysis and valuation of business enterprises" }
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
              { id: "strategic-management", title: "Strategic Management", description: "Formulation and implementation of business strategies" },
              { id: "marketing-management", title: "Marketing Management", description: "Development and implementation of marketing strategies" },
              { id: "investment-analysis", title: "Investment Analysis and Portfolio Management", description: "Analysis of investments and portfolio construction" },
              { id: "international-business", title: "International Business", description: "Business operations in a global context" },
              { id: "management-info-systems", title: "Management Information Systems", description: "Information systems for business management" },
              { id: "business-elective-1", title: "Business Elective I", description: "Specialized business topic" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "innovation-management", title: "Innovation Management", description: "Management of innovation processes in organizations" },
              { id: "financial-markets", title: "Financial Markets and Institutions", description: "Structure and functions of financial markets" },
              { id: "quality-management", title: "Total Quality Management", description: "Principles and practices of quality management" },
              { id: "digital-marketing", title: "Digital Marketing", description: "Marketing strategies in digital environments" },
              { id: "business-analytics", title: "Business Analytics", description: "Data analytics for business decision making" },
              { id: "business-elective-2", title: "Business Elective II", description: "Specialized business topic" }
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
              { id: "business-research-project", title: "Business Research Project I", description: "First part of the business research project" },
              { id: "change-management", title: "Change Management and Leadership", description: "Management of organizational change processes" },
              { id: "business-forecasting", title: "Business Forecasting Methods", description: "Techniques for business forecasting" },
              { id: "risk-management", title: "Risk Management", description: "Identification and management of business risks" },
              { id: "supply-chain-management", title: "Supply Chain Management", description: "Management of supply chain activities" },
              { id: "business-elective-3", title: "Business Elective III", description: "Specialized business topic" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "business-research-project-2", title: "Business Research Project II", description: "Second part of the business research project" },
              { id: "business-policy", title: "Business Policy and Strategy", description: "Integrative approach to business strategy" },
              { id: "project-management", title: "Project Management", description: "Management of business projects" },
              { id: "international-finance", title: "International Finance", description: "Financial management in international contexts" },
              { id: "business-simulation", title: "Business Simulation and Decision Making", description: "Simulation-based business decision making" },
              { id: "internship-ba", title: "Business Internship", description: "Practical business experience in organizational settings" }
            ]
          }
        ]
      }
    ]
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
              { id: "intro-nursing", title: "Introduction to Nursing", description: "Fundamentals of nursing profession and practice" },
              { id: "anatomy-physiology-1", title: "Anatomy and Physiology I", description: "Structure and function of the human body" },
              { id: "microbiology", title: "Microbiology", description: "Study of microorganisms and their relation to health" },
              { id: "psychology-health", title: "Psychology for Health Professionals", description: "Psychological principles in healthcare" },
              { id: "nursing-ethics", title: "Nursing Ethics and Professional Practice", description: "Ethical principles in nursing practice" },
              { id: "communication-healthcare", title: "Communication in Healthcare", description: "Effective communication in healthcare settings" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "fundamentals-nursing", title: "Fundamentals of Nursing Practice", description: "Basic nursing skills and procedures" },
              { id: "anatomy-physiology-2", title: "Anatomy and Physiology II", description: "Advanced study of human body systems" },
              { id: "biochemistry", title: "Biochemistry for Nurses", description: "Biochemical processes relevant to nursing" },
              { id: "nutrition", title: "Nutrition and Health", description: "Nutritional principles for health maintenance" },
              { id: "sociology-health", title: "Sociology of Health and Illness", description: "Social aspects of health and healthcare" },
              { id: "university-elective-nursing-1", title: "University Elective/General Education", description: "General education course" }
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
              { id: "adult-health-nursing-1", title: "Adult Health Nursing I", description: "Nursing care for adults with various health conditions" },
              { id: "pharmacology-1", title: "Pharmacology I", description: "Study of drugs and their effects" },
              { id: "health-assessment", title: "Health Assessment", description: "Methods for assessing patient health status" },
              { id: "pathophysiology", title: "Pathophysiology", description: "Study of disease processes" },
              { id: "clinical-practice-1", title: "Clinical Nursing Practice I", description: "Supervised clinical practice in healthcare settings" },
              { id: "research-nursing", title: "Research Methods in Nursing", description: "Research methodology for nursing practice" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "adult-health-nursing-2", title: "Adult Health Nursing II", description: "Advanced nursing care for adults" },
              { id: "pharmacology-2", title: "Pharmacology II", description: "Advanced study of pharmacological principles" },
              { id: "maternal-newborn-nursing", title: "Maternal and Newborn Nursing", description: "Nursing care for mothers and newborns" },
              { id: "community-health-nursing-1", title: "Community Health Nursing I", description: "Nursing practice in community settings" },
              { id: "clinical-practice-2", title: "Clinical Nursing Practice II", description: "Advanced supervised clinical practice" },
              { id: "university-elective-nursing-2", title: "University Elective/General Education", description: "General education course" }
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
              { id: "pediatric-nursing", title: "Pediatric Nursing", description: "Nursing care for infants, children, and adolescents" },
              { id: "mental-health-nursing", title: "Mental Health Nursing", description: "Nursing care for individuals with mental health conditions" },
              { id: "community-health-nursing-2", title: "Community Health Nursing II", description: "Advanced community health nursing practice" },
              { id: "nursing-leadership", title: "Nursing Leadership and Management", description: "Leadership principles in nursing practice" },
              { id: "clinical-practice-3", title: "Clinical Nursing Practice III", description: "Specialized clinical practice" },
              { id: "nursing-informatics", title: "Nursing Informatics", description: "Information technology in nursing practice" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "geriatric-nursing", title: "Geriatric Nursing", description: "Nursing care for older adults" },
              { id: "critical-care-nursing", title: "Critical Care Nursing", description: "Nursing care in critical care settings" },
              { id: "nursing-research-project", title: "Nursing Research Project", description: "Research project in nursing" },
              { id: "health-policy", title: "Health Policy and Healthcare Systems", description: "Study of healthcare policy and systems" },
              { id: "clinical-practice-4", title: "Clinical Nursing Practice IV", description: "Advanced specialized clinical practice" },
              { id: "university-elective-nursing-3", title: "University Elective/General Education", description: "General education course" }
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
              { id: "advanced-medical-surgical-nursing", title: "Advanced Medical-Surgical Nursing", description: "Advanced nursing care for medical-surgical patients" },
              { id: "emergency-nursing", title: "Emergency Nursing", description: "Nursing care in emergency situations" },
              { id: "nursing-elective-1", title: "Nursing Elective I", description: "Specialized nursing topic" },
              { id: "nursing-elective-2", title: "Nursing Elective II", description: "Specialized nursing topic" },
              { id: "clinical-practice-5", title: "Clinical Nursing Practice V", description: "Advanced clinical practice in specialized areas" },
              { id: "evidence-based-practice", title: "Evidence-Based Nursing Practice", description: "Application of research evidence in nursing practice" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "nursing-internship", title: "Nursing Internship", description: "Intensive clinical practice in healthcare settings" },
              { id: "comprehensive-nursing-practice", title: "Comprehensive Nursing Practice", description: "Integration of nursing knowledge and skills" },
              { id: "global-health-issues", title: "Global Health Issues", description: "Study of global health challenges" },
              { id: "nursing-elective-3", title: "Nursing Elective III", description: "Specialized nursing topic" },
              { id: "professional-development", title: "Professional Development in Nursing", description: "Career planning and professional growth" },
              { id: "nursing-capstone", title: "Nursing Capstone Project", description: "Culminating project in nursing education" }
            ]
          }
        ]
      }
    ]
  }
]

// Quiz questions data - we'll generate this for all courses
const quizQuestions = {
  // Computer Science Courses
  "intro-to-cs": [
    {
      text: "What is an algorithm?",
      options: [
        "A programming language",
        "A step-by-step procedure for solving a problem",
        "A type of computer hardware",
        "A mathematical equation"
      ],
      correctAnswer: "A step-by-step procedure for solving a problem"
    },
    {
      text: "Which of the following is NOT a programming paradigm?",
      options: [
        "Object-Oriented Programming",
        "Functional Programming",
        "Procedural Programming",
        "Analytical Programming"
      ],
      correctAnswer: "Analytical Programming"
    },
    {
      text: "What does CPU stand for?",
      options: [
        "Central Processing Unit",
        "Computer Processing Unit",
        "Central Program Unit",
        "Central Processor Utility"
      ],
      correctAnswer: "Central Processing Unit"
    },
    {
      text: "Which of the following is an example of secondary storage?",
      options: ["RAM", "CPU Cache", "Hard Disk Drive", "Registers"],
      correctAnswer: "Hard Disk Drive"
    },
    {
      text: "What is the binary representation of the decimal number 10?",
      options: ["1010", "1100", "1001", "1110"],
      correctAnswer: "1010"
    }
  ],
  "math-for-cs": [
    {
      text: "What is a proposition in mathematical logic?",
      options: [
        "A statement that is always true",
        "A statement that is always false",
        "A statement that can be either true or false",
        "A question that requires an answer"
      ],
      correctAnswer: "A statement that can be either true or false"
    },
    {
      text: "Which of the following is the contrapositive of 'If P, then Q'?",
      options: ["If Q, then P", "If not P, then not Q", "If not Q, then not P", "If P, then not Q"],
      correctAnswer: "If not Q, then not P"
    },
    {
      text: "What is the result of the boolean expression: (true AND false) OR (NOT false)?",
      options: ["true", "false", "undefined", "error"],
      correctAnswer: "true"
    },
    {
      text: "In set theory, what is the cardinality of the power set of a set with n elements?",
      options: ["n", "2n", "n²", "n!"],
      correctAnswer: "2n"
    },
    {
      text: "Which of the following is NOT a type of graph?",
      options: ["Directed Graph", "Undirected Graph", "Weighted Graph", "Logical Graph"],
      correctAnswer: "Logical Graph"
    }
  ],
  "intro-to-python": [
    {
      text: "What is the correct way to create a variable named 'age' with the value 25 in Python?",
      options: ["var age = 25", "age = 25", "int age = 25", "age := 25"],
      correctAnswer: "age = 25"
    },
    {
      text: "Which of the following is NOT a valid data type in Python?",
      options: ["int", "float", "char", "bool"],
      correctAnswer: "char"
    },
    {
      text: "What will the following code output? print(3 * '7')",
      options: ["21", "777", "37", "Error"],
      correctAnswer: "777"
    },
    {
      text: "Which of the following is the correct way to define a function in Python?",
      options: ["function my_function():", "def my_function():", "define my_function():", "func my_function():"],
      correctAnswer: "def my_function():"
    },
    {
      text: "What is the output of the following code? print(list(range(5)))",
      options: ["[0, 1, 2, 3, 4, 5]", "[0, 1, 2, 3, 4]", "[1, 2, 3, 4, 5]", "[5]"],
      correctAnswer: "[0, 1, 2, 3, 4]"
    }
  ],
  "data-structures": [
    {
      text: "Which data structure operates on a LIFO (Last In, First Out) principle?",
      options: ["Queue", "Stack", "Linked List", "Tree"],
      correctAnswer: "Stack"
    },
    {
      text: "What is the time complexity of searching in a binary search tree?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correctAnswer: "O(log n)"
    },
    {
      text: "Which of the following is NOT a type of linked list?",
      options: ["Singly linked list", "Doubly linked list", "Circular linked list", "Triangular linked list"],
      correctAnswer: "Triangular linked list"
    },
    {
      text: "What is the main advantage of a hash table?",
      options: [
        "Constant time search",
        "Ordered data storage",
        "Memory efficiency",
        "Easy sorting"
      ],
      correctAnswer: "Constant time search"
    },
    {
      text: "Which sorting algorithm has the best average-case time complexity?",
      options: ["Bubble Sort", "Quick Sort", "Selection Sort", "Insertion Sort"],
      correctAnswer: "Quick Sort"
    }
  ],
  "database-systems": [
    {
      text: "What does SQL stand for?",
      options: [
        "Structured Query Language",
        "Simple Query Language",
        "Standard Query Language",
        "System Query Language"
      ],
      correctAnswer: "Structured Query Language"
    },
    {
      text: "Which of the following is NOT a type of database relationship?",
      options: ["One-to-One", "One-to-Many", "Many-to-Many", "One-to-All"],
      correctAnswer: "One-to-All"
    },
    {
      text: "What is the primary key in a database table?",
      options: [
        "A key that can be null",
        "A unique identifier for each row",
        "A foreign key reference",
        "An index on the table"
      ],
      correctAnswer: "A unique identifier for each row"
    },
    {
      text: "Which SQL command is used to retrieve data from a database?",
      options: ["INSERT", "SELECT", "UPDATE", "DELETE"],
      correctAnswer: "SELECT"
    },
    {
      text: "What is normalization in database design?",
      options: [
        "The process of organizing data to reduce redundancy",
        "The process of adding more data",
        "The process of creating backups",
        "The process of indexing tables"
      ],
      correctAnswer: "The process of organizing data to reduce redundancy"
    }
  ],
  "operating-systems": [
    {
      text: "What is the main function of an operating system?",
      options: [
        "To provide a user interface",
        "To manage hardware resources",
        "To run applications",
        "All of the above"
      ],
      correctAnswer: "All of the above"
    },
    {
      text: "Which scheduling algorithm gives priority to the process that has been waiting the longest?",
      options: ["Round Robin", "First Come First Serve", "Shortest Job First", "Priority Scheduling"],
      correctAnswer: "First Come First Serve"
    },
    {
      text: "What is a deadlock?",
      options: [
        "A situation where two or more processes are waiting for each other",
        "A system crash",
        "A memory leak",
        "A virus infection"
      ],
      correctAnswer: "A situation where two or more processes are waiting for each other"
    },
    {
      text: "Which of the following is NOT a memory management technique?",
      options: ["Paging", "Segmentation", "Virtual Memory", "Process Scheduling"],
      correctAnswer: "Process Scheduling"
    },
    {
      text: "What is the purpose of a file system?",
      options: [
        "To organize and store data on storage devices",
        "To manage network connections",
        "To control hardware devices",
        "To run applications"
      ],
      correctAnswer: "To organize and store data on storage devices"
    }
  ],
  "computer-networks": [
    {
      text: "What is the purpose of the OSI model?",
      options: [
        "To standardize network communication",
        "To create network protocols",
        "To manage network security",
        "To design network hardware"
      ],
      correctAnswer: "To standardize network communication"
    },
    {
      text: "Which protocol operates at the transport layer?",
      options: ["HTTP", "TCP", "IP", "Ethernet"],
      correctAnswer: "TCP"
    },
    {
      text: "What is the function of a router?",
      options: [
        "To connect devices in a local network",
        "To forward packets between networks",
        "To provide wireless connectivity",
        "To manage network security"
      ],
      correctAnswer: "To forward packets between networks"
    },
    {
      text: "Which of the following is NOT a type of network topology?",
      options: ["Star", "Bus", "Ring", "Triangle"],
      correctAnswer: "Triangle"
    },
    {
      text: "What is DNS used for?",
      options: [
        "To convert domain names to IP addresses",
        "To secure network connections",
        "To manage network traffic",
        "To store network data"
      ],
      correctAnswer: "To convert domain names to IP addresses"
    }
  ],
  "artificial-intelligence": [
    {
      text: "What is machine learning?",
      options: [
        "A subset of artificial intelligence that enables computers to learn",
        "A type of computer hardware",
        "A programming language",
        "A database system"
      ],
      correctAnswer: "A subset of artificial intelligence that enables computers to learn"
    },
    {
      text: "Which of the following is NOT a type of machine learning?",
      options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Manual Learning"],
      correctAnswer: "Manual Learning"
    },
    {
      text: "What is a neural network?",
      options: [
        "A computational model inspired by biological neural networks",
        "A type of computer network",
        "A database structure",
        "A programming paradigm"
      ],
      correctAnswer: "A computational model inspired by biological neural networks"
    },
    {
      text: "What is the Turing Test used for?",
      options: [
        "To determine if a machine can exhibit intelligent behavior",
        "To test computer performance",
        "To evaluate programming skills",
        "To measure network speed"
      ],
      correctAnswer: "To determine if a machine can exhibit intelligent behavior"
    },
    {
      text: "Which algorithm is commonly used for classification in machine learning?",
      options: ["K-means", "Linear Regression", "Decision Trees", "All of the above"],
      correctAnswer: "All of the above"
    }
  ],
  "machine-learning": [
    {
      text: "What is overfitting in machine learning?",
      options: [
        "When a model performs well on training data but poorly on new data",
        "When a model is too simple",
        "When a model has too many features",
        "When a model is too fast"
      ],
      correctAnswer: "When a model performs well on training data but poorly on new data"
    },
    {
      text: "What is cross-validation used for?",
      options: [
        "To assess how well a model will generalize to new data",
        "To speed up training",
        "To reduce model complexity",
        "To increase accuracy"
      ],
      correctAnswer: "To assess how well a model will generalize to new data"
    },
    {
      text: "Which of the following is a supervised learning algorithm?",
      options: ["K-means", "Linear Regression", "Principal Component Analysis", "Apriori"],
      correctAnswer: "Linear Regression"
    },
    {
      text: "What is the purpose of feature scaling?",
      options: [
        "To normalize features to the same scale",
        "To reduce the number of features",
        "To increase model accuracy",
        "To speed up training"
      ],
      correctAnswer: "To normalize features to the same scale"
    },
    {
      text: "What is the difference between classification and regression?",
      options: [
        "Classification predicts categories, regression predicts continuous values",
        "Classification is faster than regression",
        "Classification uses more data than regression",
        "There is no difference"
      ],
      correctAnswer: "Classification predicts categories, regression predicts continuous values"
    }
  ]
}

// Generate quiz questions for a course
function generateQuizQuestions(courseId, courseTitle) {
  // Check if we have specific questions for this course
  if (quizQuestions[courseId]) {
    return quizQuestions[courseId]
  }

  // Generate generic questions based on course title
  const questions = [
    {
      text: `What is the main focus of ${courseTitle}?`,
      options: ["Theory and concepts", "Practical applications", "Historical development", "All of the above"],
      correctAnswer: "All of the above"
    },
    {
      text: `Which of the following is most important in ${courseTitle}?`,
      options: ["Memorization", "Understanding concepts", "Speed", "Creativity"],
      correctAnswer: "Understanding concepts"
    },
    {
      text: `What skill is most valuable for ${courseTitle}?`,
      options: ["Critical thinking", "Memorization", "Speed reading", "Artistic ability"],
      correctAnswer: "Critical thinking"
    },
    {
      text: `Which approach is best for learning ${courseTitle}?`,
      options: ["Passive reading", "Active practice", "Memorization only", "Avoiding difficult topics"],
      correctAnswer: "Active practice"
    },
    {
      text: `What is the primary goal of ${courseTitle}?`,
      options: ["To pass exams", "To develop practical skills", "To understand fundamental principles", "All of the above"],
      correctAnswer: "All of the above"
    }
  ]
  return questions
}

async function seedDatabase() {
  try {
    console.log('Starting database seeding...')

    // Clear existing data
    console.log('Clearing existing data...')
    await prisma.quizResult.deleteMany()
    await prisma.quizSubmission.deleteMany()
    await prisma.question.deleteMany()
    await prisma.quiz.deleteMany()
    await prisma.recommendation.deleteMany()

    // Seed recommendations
    console.log('Seeding recommendations...')
    const recommendationsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/recommendations.json'), 'utf8'))
    
    for (const rec of recommendationsData) {
      await prisma.recommendation.create({
        data: {
          id: rec.id,
          title: rec.title,
          description: rec.description,
          url: rec.url,
          type: rec.type,
          tags: rec.tags,
          difficulty: rec.difficulty
        }
      })
    }

    // Seed quizzes for all courses
    console.log('Seeding quizzes for all courses...')
    let quizCount = 0

    for (const program of programs) {
      for (const year of program.years) {
        for (const semester of year.semesters) {
          for (const course of semester.courses) {
            const questions = generateQuizQuestions(course.id, course.title)
            
            // Create quiz
            const quiz = await prisma.quiz.create({
              data: {
                id: course.id,
                title: course.title,
                description: course.description || `Quiz for ${course.title}`,
                difficulty: year.year === 1 ? "Beginner" : year.year === 2 ? "Intermediate" : "Advanced",
                timeLimit: 15,
                tags: [program.id, `year-${year.year}`, `semester-${semester.semester}`]
              }
            })

            // Create questions for this quiz
            for (const questionData of questions) {
              await prisma.question.create({
                data: {
                  text: questionData.text,
                  options: questionData.options,
                  correctAnswer: questionData.correctAnswer,
                  quizId: quiz.id
                }
              })
            }

            quizCount++
            console.log(`Created quiz for: ${course.title} (${questions.length} questions)`)
          }
        }
      }
    }

    console.log(`\nDatabase seeding completed successfully!`)
    console.log(`Created ${quizCount} quizzes with questions`)
    console.log(`Created ${recommendationsData.length} recommendations`)

  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log('Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  }) 