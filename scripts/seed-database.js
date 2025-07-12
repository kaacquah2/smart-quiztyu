const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// Program data - copied from lib/program-data.ts
let programs = [
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
  },
  {
    id: "mathematics",
    title: "BSc. Mathematics",
    description: "Study of pure and applied mathematics, including analysis, algebra, and statistics.",
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "calculus-1", title: "Calculus I", description: "Limits, derivatives, and integrals of functions of one variable." }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "mechanical-engineering",
    title: "BSc. Mechanical Engineering",
    description: "Study of mechanical systems, thermodynamics, and manufacturing processes",
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "intro-me", title: "Introduction to Mechanical Engineering", description: "Fundamentals of mechanical engineering and its applications" },
              { id: "math-for-me-1", title: "Mathematics for Mechanical Engineers I", description: "Mathematical foundations for mechanical engineering" },
              { id: "physics-for-me", title: "Physics for Mechanical Engineers", description: "Physics principles for mechanical engineering applications" },
              { id: "intro-to-programming-me", title: "Introduction to Programming", description: "Basics of programming for mechanical engineers" },
              { id: "basic-mechanical-principles", title: "Basic Mechanical Principles", description: "Fundamentals of mechanics and thermodynamics" },
              { id: "communication-skills-me", title: "Communication Skills", description: "Effective communication in technical contexts" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "mechanics-1", title: "Mechanics I", description: "Introduction to statics and dynamics of rigid bodies" },
              { id: "math-for-me-2", title: "Mathematics for Mechanical Engineers II", description: "Advanced mathematical concepts for mechanical engineering" },
              { id: "materials-science", title: "Materials Science", description: "Introduction to materials science and engineering" },
              { id: "thermal-engineering", title: "Thermal Engineering", description: "Introduction to heat transfer and thermodynamics" },
              { id: "technical-drawing-me", title: "Technical Drawing and CAD", description: "Engineering drawing and computer-aided design" }
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
              { id: "mechanics-2", title: "Mechanics II", description: "Advanced dynamics and vibrations of mechanical systems" },
              { id: "fluid-mechanics", title: "Fluid Mechanics", description: "Introduction to fluid mechanics and its applications" },
              { id: "machine-design", title: "Machine Design", description: "Introduction to machine design and analysis" },
              { id: "engineering-math-me", title: "Engineering Mathematics", description: "Applied mathematics for mechanical engineering" },
              { id: "measurements-instrumentation-me", title: "Electrical Measurements and Instrumentation", description: "Techniques for mechanical measurements" },
              { id: "engineering-economics-me", title: "Engineering Economics", description: "Economic analysis for mechanical engineering decisions" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "control-systems-me", title: "Control Systems Engineering", description: "Analysis and design of control systems" },
              { id: "power-systems-me", title: "Power Systems I", description: "Introduction to electrical power systems" },
              { id: "digital-electronics-me", title: "Digital Electronics", description: "Analysis and design of digital electronic circuits" },
              { id: "electric-machines-2-me", title: "Electric Machines II", description: "Advanced electric machines and transformers" },
              { id: "numerical-methods-me", title: "Numerical Methods for Engineers", description: "Computational methods for engineering problems" },
              { id: "engineering-ethics-me", title: "Engineering Ethics and Professionalism", description: "Ethics and professional practice in engineering" }
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
              { id: "microprocessors-me", title: "Microprocessors and Microcontrollers", description: "Architecture and programming of microprocessors" },
              { id: "communication-systems-me", title: "Communication Systems", description: "Principles of analog and digital communication" },
              { id: "power-electronics-me", title: "Power Electronics", description: "Electronic conversion and control of electric power" },
              { id: "electromagnetic-fields-me", title: "Electromagnetic Fields and Waves", description: "Advanced electromagnetic theory" },
              { id: "engineering-design-me", title: "Engineering Design Project", description: "Team-based engineering design project" },
              { id: "technical-elective-1-me", title: "Technical Elective I", description: "Specialized mechanical engineering topic" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "digital-signal-processing-me", title: "Digital Signal Processing", description: "Processing and analysis of digital signals" },
              { id: "power-systems-2-me", title: "Power Systems II", description: "Advanced power systems analysis and operation" },
              { id: "renewable-energy-me", title: "Renewable Energy Systems", description: "Solar, wind, and other renewable energy technologies" },
              { id: "embedded-systems-me", title: "Embedded Systems", description: "Design of embedded computing systems" },
              { id: "industrial-electronics-me", title: "Industrial Electronics and Automation", description: "Electronic systems for industrial applications" },
              { id: "technical-elective-2-me", title: "Technical Elective II", description: "Specialized mechanical engineering topic" }
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
              { id: "power-system-protection-me", title: "Power System Protection and Switchgear", description: "Protection of power systems from faults" },
              { id: "high-voltage-engineering-me", title: "High Voltage Engineering", description: "Principles of high voltage generation and testing" },
              { id: "wireless-communication-me", title: "Wireless and Mobile Communication", description: "Principles of wireless communication systems" },
              { id: "vlsi-design-me", title: "VLSI Design", description: "Design of very large scale integrated circuits" },
              { id: "research-project-1-me", title: "Final Year Research Project I", description: "First part of the final year research project" },
              { id: "technical-elective-3-me", title: "Technical Elective III", description: "Specialized mechanical engineering topic" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "research-project-2-me", title: "Final Year Research Project II", description: "Second part of the final year research project" },
              { id: "power-system-operation-me", title: "Power System Operation and Control", description: "Operation, control, and economics of power systems" },
              { id: "antenna-wave-propagation-me", title: "Antennas and Wave Propagation", description: "Principles of electromagnetic wave radiation and reception" },
              { id: "instrumentation-control-me", title: "Advanced Instrumentation and Control", description: "Advanced measurement and control systems" },
              { id: "technical-elective-4-me", title: "Technical Elective IV", description: "Specialized mechanical engineering topic" },
              { id: "internship-ee-me", title: "Industrial Internship", description: "Practical industrial experience in electrical engineering" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "civil-engineering",
    title: "BSc. Civil Engineering",
    description: "Study of infrastructure, construction, and environmental engineering",
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "intro-ce", title: "Introduction to Civil Engineering", description: "Fundamentals of civil engineering and its applications" },
              { id: "math-for-ce-1", title: "Mathematics for Civil Engineers I", description: "Mathematical foundations for civil engineering" },
              { id: "physics-for-ce", title: "Physics for Civil Engineers", description: "Physics principles for civil engineering applications" },
              { id: "intro-to-programming-ce", title: "Introduction to Programming", description: "Basics of programming for civil engineers" },
              { id: "basic-civil-principles", title: "Basic Civil Principles", description: "Fundamentals of civil engineering and construction" },
              { id: "communication-skills-ce", title: "Communication Skills", description: "Effective communication in technical contexts" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "structural-analysis", title: "Structural Analysis", description: "Introduction to structural analysis and design" },
              { id: "math-for-ce-2", title: "Mathematics for Civil Engineers II", description: "Advanced mathematical concepts for civil engineering" },
              { id: "materials-science-ce", title: "Materials Science", description: "Introduction to materials science and engineering" },
              { id: "geotechnical-engineering", title: "Geotechnical Engineering", description: "Introduction to geotechnical engineering and soil mechanics" },
              { id: "technical-drawing-ce", title: "Technical Drawing and CAD", description: "Engineering drawing and computer-aided design" }
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
              { id: "structural-design", title: "Structural Design", description: "Introduction to structural design and analysis" },
              { id: "fluid-mechanics-ce", title: "Fluid Mechanics", description: "Introduction to fluid mechanics and its applications" },
              { id: "transportation-engineering", title: "Transportation Engineering", description: "Introduction to transportation systems and highways" },
              { id: "engineering-math-ce", title: "Engineering Mathematics", description: "Applied mathematics for civil engineering" },
              { id: "measurements-instrumentation-ce", title: "Electrical Measurements and Instrumentation", description: "Techniques for civil engineering measurements" },
              { id: "engineering-economics-ce", title: "Engineering Economics", description: "Economic analysis for civil engineering decisions" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "control-systems-ce", title: "Control Systems Engineering", description: "Analysis and design of control systems" },
              { id: "power-systems-ce", title: "Power Systems I", description: "Introduction to electrical power systems" },
              { id: "digital-electronics-ce", title: "Digital Electronics", description: "Analysis and design of digital electronic circuits" },
              { id: "electric-machines-2-ce", title: "Electric Machines II", description: "Advanced electric machines and transformers" },
              { id: "numerical-methods-ce", title: "Numerical Methods for Engineers", description: "Computational methods for engineering problems" },
              { id: "engineering-ethics-ce", title: "Engineering Ethics and Professionalism", description: "Ethics and professional practice in engineering" }
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
              { id: "microprocessors-ce", title: "Microprocessors and Microcontrollers", description: "Architecture and programming of microprocessors" },
              { id: "communication-systems-ce", title: "Communication Systems", description: "Principles of analog and digital communication" },
              { id: "power-electronics-ce", title: "Power Electronics", description: "Electronic conversion and control of electric power" },
              { id: "electromagnetic-fields-ce", title: "Electromagnetic Fields and Waves", description: "Advanced electromagnetic theory" },
              { id: "engineering-design-ce", title: "Engineering Design Project", description: "Team-based engineering design project" },
              { id: "technical-elective-1-ce", title: "Technical Elective I", description: "Specialized civil engineering topic" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "digital-signal-processing-ce", title: "Digital Signal Processing", description: "Processing and analysis of digital signals" },
              { id: "power-systems-2-ce", title: "Power Systems II", description: "Advanced power systems analysis and operation" },
              { id: "renewable-energy-ce", title: "Renewable Energy Systems", description: "Solar, wind, and other renewable energy technologies" },
              { id: "embedded-systems-ce", title: "Embedded Systems", description: "Design of embedded computing systems" },
              { id: "industrial-electronics-ce", title: "Industrial Electronics and Automation", description: "Electronic systems for industrial applications" },
              { id: "technical-elective-2-ce", title: "Technical Elective II", description: "Specialized civil engineering topic" }
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
              { id: "power-system-protection-ce", title: "Power System Protection and Switchgear", description: "Protection of power systems from faults" },
              { id: "high-voltage-engineering-ce", title: "High Voltage Engineering", description: "Principles of high voltage generation and testing" },
              { id: "wireless-communication-ce", title: "Wireless and Mobile Communication", description: "Principles of wireless communication systems" },
              { id: "vlsi-design-ce", title: "VLSI Design", description: "Design of very large scale integrated circuits" },
              { id: "research-project-1-ce", title: "Final Year Research Project I", description: "First part of the final year research project" },
              { id: "technical-elective-3-ce", title: "Technical Elective III", description: "Specialized civil engineering topic" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "research-project-2-ce", title: "Final Year Research Project II", description: "Second part of the final year research project" },
              { id: "power-system-operation-ce", title: "Power System Operation and Control", description: "Operation, control, and economics of power systems" },
              { id: "antenna-wave-propagation-ce", title: "Antennas and Wave Propagation", description: "Principles of electromagnetic wave radiation and reception" },
              { id: "instrumentation-control-ce", title: "Advanced Instrumentation and Control", description: "Advanced measurement and control systems" },
              { id: "technical-elective-4-ce", title: "Technical Elective IV", description: "Specialized civil engineering topic" },
              { id: "internship-ee-ce", title: "Industrial Internship", description: "Practical industrial experience in electrical engineering" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "chemical-engineering",
    title: "BSc. Chemical Engineering",
    description: "Study of chemical processes, reactions, and industrial applications",
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "intro-che", title: "Introduction to Chemical Engineering", description: "Fundamentals of chemical engineering and its applications" },
              { id: "math-for-che-1", title: "Mathematics for Chemical Engineers I", description: "Mathematical foundations for chemical engineering" },
              { id: "physics-for-che", title: "Physics for Chemical Engineers", description: "Physics principles for chemical engineering applications" },
              { id: "intro-to-programming-che", title: "Introduction to Programming", description: "Basics of programming for chemical engineers" },
              { id: "basic-chemical-principles", title: "Basic Chemical Principles", description: "Fundamentals of chemical engineering and processes" },
              { id: "communication-skills-che", title: "Communication Skills", description: "Effective communication in technical contexts" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "chemical-reaction-engineering", title: "Chemical Reaction Engineering", description: "Introduction to chemical reaction engineering and kinetics" },
              { id: "math-for-che-2", title: "Mathematics for Chemical Engineers II", description: "Advanced mathematical concepts for chemical engineering" },
              { id: "materials-science-che", title: "Materials Science", description: "Introduction to materials science and engineering" },
              { id: "process-design", title: "Process Design", description: "Introduction to process design and optimization" },
              { id: "technical-drawing-che", title: "Technical Drawing and CAD", description: "Engineering drawing and computer-aided design" }
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
              { id: "process-control", title: "Process Control", description: "Introduction to process control and instrumentation" },
              { id: "fluid-mechanics-che", title: "Fluid Mechanics", description: "Introduction to fluid mechanics and its applications" },
              { id: "transportation-engineering-che", title: "Transportation Engineering", description: "Introduction to transportation systems and highways" },
              { id: "engineering-math-che", title: "Engineering Mathematics", description: "Applied mathematics for chemical engineering" },
              { id: "measurements-instrumentation-che", title: "Electrical Measurements and Instrumentation", description: "Techniques for chemical engineering measurements" },
              { id: "engineering-economics-che", title: "Engineering Economics", description: "Economic analysis for chemical engineering decisions" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "control-systems-che", title: "Control Systems Engineering", description: "Analysis and design of control systems" },
              { id: "power-systems-che", title: "Power Systems I", description: "Introduction to electrical power systems" },
              { id: "digital-electronics-che", title: "Digital Electronics", description: "Analysis and design of digital electronic circuits" },
              { id: "electric-machines-2-che", title: "Electric Machines II", description: "Advanced electric machines and transformers" },
              { id: "numerical-methods-che", title: "Numerical Methods for Engineers", description: "Computational methods for engineering problems" },
              { id: "engineering-ethics-che", title: "Engineering Ethics and Professionalism", description: "Ethics and professional practice in engineering" }
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
              { id: "microprocessors-che", title: "Microprocessors and Microcontrollers", description: "Architecture and programming of microprocessors" },
              { id: "communication-systems-che", title: "Communication Systems", description: "Principles of analog and digital communication" },
              { id: "power-electronics-che", title: "Power Electronics", description: "Electronic conversion and control of electric power" },
              { id: "electromagnetic-fields-che", title: "Electromagnetic Fields and Waves", description: "Advanced electromagnetic theory" },
              { id: "engineering-design-che", title: "Engineering Design Project", description: "Team-based engineering design project" },
              { id: "technical-elective-1-che", title: "Technical Elective I", description: "Specialized chemical engineering topic" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "digital-signal-processing-che", title: "Digital Signal Processing", description: "Processing and analysis of digital signals" },
              { id: "power-systems-2-che", title: "Power Systems II", description: "Advanced power systems analysis and operation" },
              { id: "renewable-energy-che", title: "Renewable Energy Systems", description: "Solar, wind, and other renewable energy technologies" },
              { id: "embedded-systems-che", title: "Embedded Systems", description: "Design of embedded computing systems" },
              { id: "industrial-electronics-che", title: "Industrial Electronics and Automation", description: "Electronic systems for industrial applications" },
              { id: "technical-elective-2-che", title: "Technical Elective II", description: "Specialized chemical engineering topic" }
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
              { id: "power-system-protection-che", title: "Power System Protection and Switchgear", description: "Protection of power systems from faults" },
              { id: "high-voltage-engineering-che", title: "High Voltage Engineering", description: "Principles of high voltage generation and testing" },
              { id: "wireless-communication-che", title: "Wireless and Mobile Communication", description: "Principles of wireless communication systems" },
              { id: "vlsi-design-che", title: "VLSI Design", description: "Design of very large scale integrated circuits" },
              { id: "research-project-1-che", title: "Final Year Research Project I", description: "First part of the final year research project" },
              { id: "technical-elective-3-che", title: "Technical Elective III", description: "Specialized chemical engineering topic" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "research-project-2-che", title: "Final Year Research Project II", description: "Second part of the final year research project" },
              { id: "power-system-operation-che", title: "Power System Operation and Control", description: "Operation, control, and economics of power systems" },
              { id: "antenna-wave-propagation-che", title: "Antennas and Wave Propagation", description: "Principles of electromagnetic wave radiation and reception" },
              { id: "instrumentation-control-che", title: "Advanced Instrumentation and Control", description: "Advanced measurement and control systems" },
              { id: "technical-elective-4-che", title: "Technical Elective IV", description: "Specialized chemical engineering topic" },
              { id: "internship-ee-che", title: "Industrial Internship", description: "Practical industrial experience in electrical engineering" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "architecture",
    title: "BSc. Architecture",
    description: "Study of architectural design, history, and building technology",
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "intro-arch", title: "Introduction to Architecture", description: "Fundamentals of architectural design and drawing" },
              { id: "history-of-architecture", title: "History of Architecture", description: "Study of architectural styles and historical periods" },
              { id: "building-materials", title: "Building Materials", description: "Introduction to construction materials and their properties" },
              { id: "structural-principles", title: "Structural Principles", description: "Fundamentals of structural engineering and design" },
              { id: "urban-design", title: "Urban Design", description: "Principles of urban planning and design" },
              { id: "university-elective-arch-1", title: "University Elective/General Education", description: "General education course" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "architecture-design-1", title: "Architecture Design I", description: "Introduction to architectural design and drawing" },
              { id: "history-of-architecture-2", title: "History of Architecture II", description: "Advanced study of architectural styles and periods" },
              { id: "building-technology", title: "Building Technology", description: "Introduction to building construction and technology" },
              { id: "structural-analysis", title: "Structural Analysis", description: "Advanced analysis of building structures" },
              { id: "urban-planning-1", title: "Urban Planning I", description: "Introduction to urban planning and design principles" },
              { id: "university-elective-arch-2", title: "University Elective/General Education", description: "General education course" }
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
              { id: "architecture-design-2", title: "Architecture Design II", description: "Advanced architectural design and drawing" },
              { id: "building-technology-2", title: "Building Technology II", description: "Advanced building construction and technology" },
              { id: "structural-design", title: "Structural Design", description: "Advanced structural analysis and design" },
              { id: "urban-planning-2", title: "Urban Planning II", description: "Advanced urban planning and design" },
              { id: "architectural-history", title: "Architectural History", description: "Study of architectural history and theory" },
              { id: "university-elective-arch-3", title: "University Elective/General Education", description: "General education course" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "capstone-project-arch", title: "Capstone Project in Architecture", description: "Final architectural design project" },
              { id: "professional-practice", title: "Professional Practice", description: "Integration of theoretical knowledge with practical experience" },
              { id: "architectural-theory", title: "Architectural Theory", description: "Study of architectural theories and principles" },
              { id: "sustainable-design", title: "Sustainable Design", description: "Principles of sustainable architectural design" },
              { id: "university-elective-arch-4", title: "University Elective/General Education", description: "General education course" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "medicine",
    title: "MBChB. Medicine",
    description: "Study of medical sciences, clinical practice, and patient care",
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "intro-med", title: "Introduction to Medicine", description: "Fundamentals of medical sciences and clinical practice" },
              { id: "anatomy-physiology-med", title: "Anatomy and Physiology", description: "Study of human body systems and physiology" },
              { id: "pathology", title: "Pathology", description: "Introduction to medical pathology and disease processes" },
              { id: "pharmacology", title: "Pharmacology", description: "Introduction to drug action and therapeutic principles" },
              { id: "medical-ethics", title: "Medical Ethics", description: "Ethical principles and professional conduct in medicine" },
              { id: "university-elective-med-1", title: "University Elective/General Education", description: "General education course" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "clinical-skills-1", title: "Clinical Skills I", description: "Basic clinical skills and patient interaction" },
              { id: "medical-microbiology", title: "Medical Microbiology", description: "Study of microorganisms and their role in medicine" },
              { id: "community-health", title: "Community Health", description: "Introduction to public health and community medicine" },
              { id: "basic-clinical-skills", title: "Basic Clinical Skills", description: "Practical skills in patient assessment and care" },
              { id: "university-elective-med-2", title: "University Elective/General Education", description: "General education course" }
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
              { id: "clinical-skills-2", title: "Clinical Skills II", description: "Advanced clinical skills and patient care" },
              { id: "medical-parasitology", title: "Medical Parasitology", description: "Study of parasites and their role in medicine" },
              { id: "emergency-medicine", title: "Emergency Medicine", description: "Principles and management of emergency situations" },
              { id: "basic-clinical-skills-2", title: "Basic Clinical Skills II", description: "Advanced practical skills in patient assessment and care" },
              { id: "university-elective-med-3", title: "University Elective/General Education", description: "General education course" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "clinical-skills-3", title: "Clinical Skills III", description: "Specialized clinical skills and patient care" },
              { id: "medical-entomology", title: "Medical Entomology", description: "Study of insects and their role in medicine" },
              { id: "infectious-diseases", title: "Infectious Diseases", description: "Principles and management of infectious diseases" },
              { id: "basic-clinical-skills-3", title: "Basic Clinical Skills III", description: "Advanced specialized clinical skills" },
              { id: "university-elective-med-4", title: "University Elective/General Education", description: "General education course" }
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
              { id: "clinical-skills-4", title: "Clinical Skills IV", description: "Advanced clinical skills and patient care" },
              { id: "medical-zoology", title: "Medical Zoology", description: "Study of animals and their role in medicine" },
              { id: "neurology", title: "Neurology", description: "Principles and management of neurological disorders" },
              { id: "basic-clinical-skills-4", title: "Basic Clinical Skills IV", description: "Advanced specialized clinical skills" },
              { id: "university-elective-med-5", title: "University Elective/General Education", description: "General education course" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "clinical-skills-5", title: "Clinical Skills V", description: "Advanced clinical skills and patient care" },
              { id: "medical-botany", title: "Medical Botany", description: "Study of plants and their role in medicine" },
              { id: "psychiatry", title: "Psychiatry", description: "Principles and management of mental health disorders" },
              { id: "basic-clinical-skills-5", title: "Basic Clinical Skills V", description: "Advanced specialized clinical skills" },
              { id: "university-elective-med-6", title: "University Elective/General Education", description: "General education course" }
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
              { id: "clinical-skills-6", title: "Clinical Skills VI", description: "Advanced clinical skills and patient care" },
              { id: "medical-entomology-2", title: "Medical Entomology II", description: "Advanced study of insects and their role in medicine" },
              { id: "infectious-diseases-2", title: "Infectious Diseases II", description: "Advanced principles and management of infectious diseases" },
              { id: "basic-clinical-skills-6", title: "Basic Clinical Skills VI", description: "Advanced specialized clinical skills" },
              { id: "university-elective-med-7", title: "University Elective/General Education", description: "General education course" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "clinical-skills-7", title: "Clinical Skills VII", description: "Advanced clinical skills and patient care" },
              { id: "medical-zoology-2", title: "Medical Zoology II", description: "Advanced study of animals and their role in medicine" },
              { id: "neurology-2", title: "Neurology II", description: "Advanced principles and management of neurological disorders" },
              { id: "basic-clinical-skills-7", title: "Basic Clinical Skills VII", description: "Advanced specialized clinical skills" },
              { id: "university-elective-med-8", title: "University Elective/General Education", description: "General education course" }
            ]
          }
        ]
      },
      {
        year: 5,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "clinical-skills-8", title: "Clinical Skills VIII", description: "Advanced clinical skills and patient care" },
              { id: "medical-botany-2", title: "Medical Botany II", description: "Advanced study of plants and their role in medicine" },
              { id: "psychiatry-2", title: "Psychiatry II", description: "Advanced principles and management of mental health disorders" },
              { id: "basic-clinical-skills-8", title: "Basic Clinical Skills VIII", description: "Advanced specialized clinical skills" },
              { id: "university-elective-med-9", title: "University Elective/General Education", description: "General education course" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "clinical-skills-9", title: "Clinical Skills IX", description: "Advanced clinical skills and patient care" },
              { id: "medical-entomology-3", title: "Medical Entomology III", description: "Advanced study of insects and their role in medicine" },
              { id: "infectious-diseases-3", title: "Infectious Diseases III", description: "Advanced principles and management of infectious diseases" },
              { id: "basic-clinical-skills-9", title: "Basic Clinical Skills IX", description: "Advanced specialized clinical skills" },
              { id: "university-elective-med-10", title: "University Elective/General Education", description: "General education course" }
            ]
          }
        ]
      },
      {
        year: 6,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "clinical-skills-10", title: "Clinical Skills X", description: "Advanced clinical skills and patient care" },
              { id: "medical-zoology-3", title: "Medical Zoology III", description: "Advanced study of animals and their role in medicine" },
              { id: "neurology-3", title: "Neurology III", description: "Advanced principles and management of neurological disorders" },
              { id: "basic-clinical-skills-10", title: "Basic Clinical Skills X", description: "Advanced specialized clinical skills" },
              { id: "university-elective-med-11", title: "University Elective/General Education", description: "General education course" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "clinical-skills-11", title: "Clinical Skills XI", description: "Advanced clinical skills and patient care" },
              { id: "medical-botany-3", title: "Medical Botany III", description: "Advanced study of plants and their role in medicine" },
              { id: "psychiatry-3", title: "Psychiatry III", description: "Advanced principles and management of mental health disorders" },
              { id: "basic-clinical-skills-11", title: "Basic Clinical Skills XI", description: "Advanced specialized clinical skills" },
              { id: "university-elective-med-12", title: "University Elective/General Education", description: "General education course" }
            ]
          }
        ]
      },
      {
        year: 7,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "clinical-skills-12", title: "Clinical Skills XII", description: "Advanced clinical skills and patient care" },
              { id: "medical-entomology-4", title: "Medical Entomology IV", description: "Advanced study of insects and their role in medicine" },
              { id: "infectious-diseases-4", title: "Infectious Diseases IV", description: "Advanced principles and management of infectious diseases" },
              { id: "basic-clinical-skills-12", title: "Basic Clinical Skills XII", description: "Advanced specialized clinical skills" },
              { id: "university-elective-med-13", title: "University Elective/General Education", description: "General education course" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "clinical-skills-13", title: "Clinical Skills XIII", description: "Advanced clinical skills and patient care" },
              { id: "medical-zoology-4", title: "Medical Zoology IV", description: "Advanced study of animals and their role in medicine" },
              { id: "neurology-4", title: "Neurology IV", description: "Advanced principles and management of neurological disorders" },
              { id: "basic-clinical-skills-13", title: "Basic Clinical Skills XIII", description: "Advanced specialized clinical skills" },
              { id: "university-elective-med-14", title: "University Elective/General Education", description: "General education course" }
            ]
          }
        ]
      },
      {
        year: 8,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "clinical-skills-14", title: "Clinical Skills XIV", description: "Advanced clinical skills and patient care" },
              { id: "medical-botany-4", title: "Medical Botany IV", description: "Advanced study of plants and their role in medicine" },
              { id: "psychiatry-4", title: "Psychiatry IV", description: "Advanced principles and management of mental health disorders" },
              { id: "basic-clinical-skills-14", title: "Basic Clinical Skills XIV", description: "Advanced specialized clinical skills" },
              { id: "university-elective-med-15", title: "University Elective/General Education", description: "General education course" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "clinical-skills-15", title: "Clinical Skills XV", description: "Advanced clinical skills and patient care" },
              { id: "medical-entomology-5", title: "Medical Entomology V", description: "Advanced study of insects and their role in medicine" },
              { id: "infectious-diseases-5", title: "Infectious Diseases V", description: "Advanced principles and management of infectious diseases" },
              { id: "basic-clinical-skills-15", title: "Basic Clinical Skills XV", description: "Advanced specialized clinical skills" },
              { id: "university-elective-med-16", title: "University Elective/General Education", description: "General education course" }
            ]
          }
        ]
      },
      {
        year: 9,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "clinical-skills-16", title: "Clinical Skills XVI", description: "Advanced clinical skills and patient care" },
              { id: "medical-zoology-5", title: "Medical Zoology V", description: "Advanced study of animals and their role in medicine" },
              { id: "neurology-5", title: "Neurology V", description: "Advanced principles and management of neurological disorders" },
              { id: "basic-clinical-skills-16", title: "Basic Clinical Skills XVI", description: "Advanced specialized clinical skills" },
              { id: "university-elective-med-17", title: "University Elective/General Education", description: "General education course" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "clinical-skills-17", title: "Clinical Skills XVII", description: "Advanced clinical skills and patient care" },
              { id: "medical-botany-5", title: "Medical Botany V", description: "Advanced study of plants and their role in medicine" },
              { id: "psychiatry-5", title: "Psychiatry V", description: "Advanced principles and management of mental health disorders" },
              { id: "basic-clinical-skills-17", title: "Basic Clinical Skills XVII", description: "Advanced specialized clinical skills" },
              { id: "university-elective-med-18", title: "University Elective/General Education", description: "General education course" }
            ]
          }
        ]
      },
      {
        year: 10,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "clinical-skills-18", title: "Clinical Skills XVIII", description: "Advanced clinical skills and patient care" },
              { id: "medical-entomology-6", title: "Medical Entomology VI", description: "Advanced study of insects and their role in medicine" },
              { id: "infectious-diseases-6", title: "Infectious Diseases VI", description: "Advanced principles and management of infectious diseases" },
              { id: "basic-clinical-skills-18", title: "Basic Clinical Skills XVIII", description: "Advanced specialized clinical skills" },
              { id: "university-elective-med-19", title: "University Elective/General Education", description: "General education course" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "clinical-skills-19", title: "Clinical Skills XIX", description: "Advanced clinical skills and patient care" },
              { id: "medical-zoology-6", title: "Medical Zoology VI", description: "Advanced study of animals and their role in medicine" },
              { id: "neurology-6", title: "Neurology VI", description: "Advanced principles and management of neurological disorders" },
              { id: "basic-clinical-skills-19", title: "Basic Clinical Skills XIX", description: "Advanced specialized clinical skills" },
              { id: "university-elective-med-20", title: "University Elective/General Education", description: "General education course" }
            ]
          }
        ]
      },
      {
        year: 11,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "clinical-skills-20", title: "Clinical Skills XX", description: "Advanced clinical skills and patient care" },
              { id: "medical-botany-6", title: "Medical Botany VI", description: "Advanced study of plants and their role in medicine" },
              { id: "psychiatry-6", title: "Psychiatry VI", description: "Advanced principles and management of mental health disorders" },
              { id: "basic-clinical-skills-20", title: "Basic Clinical Skills XX", description: "Advanced specialized clinical skills" },
              { id: "university-elective-med-21", title: "University Elective/General Education", description: "General education course" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "clinical-skills-21", title: "Clinical Skills XXI", description: "Advanced clinical skills and patient care" },
              { id: "medical-entomology-7", title: "Medical Entomology VII", description: "Advanced study of insects and their role in medicine" },
              { id: "infectious-diseases-7", title: "Infectious Diseases VII", description: "Advanced principles and management of infectious diseases" },
              { id: "basic-clinical-skills-21", title: "Basic Clinical Skills XXI", description: "Advanced specialized clinical skills" },
              { id: "university-elective-med-22", title: "University Elective/General Education", description: "General education course" }
            ]
          }
        ]
      },
      {
        year: 12,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "clinical-skills-22", title: "Clinical Skills XXII", description: "Advanced clinical skills and patient care" },
              { id: "medical-zoology-7", title: "Medical Zoology VII", description: "Advanced study of animals and their role in medicine" },
              { id: "neurology-7", title: "Neurology VII", description: "Advanced principles and management of neurological disorders" },
              { id: "basic-clinical-skills-22", title: "Basic Clinical Skills XXII", description: "Advanced specialized clinical skills" },
              { id: "university-elective-med-23", title: "University Elective/General Education", description: "General education course" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "clinical-skills-23", title: "Clinical Skills XXIII", description: "Advanced clinical skills and patient care" },
              { id: "medical-botany-7", title: "Medical Botany VII", description: "Advanced study of plants and their role in medicine" },
              { id: "psychiatry-7", title: "Psychiatry VII", description: "Advanced principles and management of mental health disorders" },
              { id: "basic-clinical-skills-23", title: "Basic Clinical Skills XXIII", description: "Advanced specialized clinical skills" },
              { id: "university-elective-med-24", title: "University Elective/General Education", description: "General education course" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "law",
    title: "LLB. Law",
    description: "Study of legal systems, jurisprudence, and legal practice",
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "intro-law", title: "Introduction to Law", description: "Fundamentals of legal systems and legal reasoning" },
              { id: "legal-methods", title: "Legal Methods", description: "Introduction to legal research, writing, and analysis" },
              { id: "contract-law", title: "Contract Law", description: "Introduction to contract formation, interpretation, and breach" },
              { id: "tort-law", title: "Tort Law", description: "Introduction to civil wrongs and liability" },
              { id: "university-elective-law-1", title: "University Elective/General Education", description: "General education course" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "criminal-law", title: "Criminal Law", description: "Introduction to criminal offenses and defenses" },
              { id: "property-law", title: "Property Law", description: "Introduction to ownership, transfer, and encumbrances" },
              { id: "constitutional-law", title: "Constitutional Law", description: "Introduction to the legal system and fundamental rights" },
              { id: "university-elective-law-2", title: "University Elective/General Education", description: "General education course" }
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
              { id: "contract-law-2", title: "Contract Law II", description: "Advanced study of contract formation, interpretation, and breach" },
              { id: "tort-law-2", title: "Tort Law II", description: "Advanced study of civil wrongs and liability" },
              { id: "criminal-law-2", title: "Criminal Law II", description: "Advanced study of criminal offenses and defenses" },
              { id: "property-law-2", title: "Property Law II", description: "Advanced study of ownership, transfer, and encumbrances" },
              { id: "constitutional-law-2", title: "Constitutional Law II", description: "Advanced study of the legal system and fundamental rights" },
              { id: "university-elective-law-3", title: "University Elective/General Education", description: "General education course" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "international-law", title: "International Law", description: "Introduction to international legal systems and treaties" },
              { id: "legal-writing-2", title: "Legal Writing II", description: "Advanced legal research, writing, and analysis" },
              { id: "legal-skills", title: "Legal Skills", description: "Practical legal skills in negotiation, drafting, and advocacy" },
              { id: "university-elective-law-4", title: "University Elective/General Education", description: "General education course" }
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
              { id: "contract-law-3", title: "Contract Law III", description: "Advanced study of contract formation, interpretation, and breach" },
              { id: "tort-law-3", title: "Tort Law III", description: "Advanced study of civil wrongs and liability" },
              { id: "criminal-law-3", title: "Criminal Law III", description: "Advanced study of criminal offenses and defenses" },
              { id: "property-law-3", title: "Property Law III", description: "Advanced study of ownership, transfer, and encumbrances" },
              { id: "constitutional-law-3", title: "Constitutional Law III", description: "Advanced study of the legal system and fundamental rights" },
              { id: "university-elective-law-5", title: "University Elective/General Education", description: "General education course" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "international-law-2", title: "International Law II", description: "Advanced study of international legal systems and treaties" },
              { id: "legal-writing-3", title: "Legal Writing III", description: "Advanced legal research, writing, and analysis" },
              { id: "legal-skills-2", title: "Legal Skills II", description: "Advanced practical legal skills in negotiation, drafting, and advocacy" },
              { id: "university-elective-law-6", title: "University Elective/General Education", description: "General education course" }
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
              { id: "contract-law-4", title: "Contract Law IV", description: "Advanced study of contract formation, interpretation, and breach" },
              { id: "tort-law-4", title: "Tort Law IV", description: "Advanced study of civil wrongs and liability" },
              { id: "criminal-law-4", title: "Criminal Law IV", description: "Advanced study of criminal offenses and defenses" },
              { id: "property-law-4", title: "Property Law IV", description: "Advanced study of ownership, transfer, and encumbrances" },
              { id: "constitutional-law-4", title: "Constitutional Law IV", description: "Advanced study of the legal system and fundamental rights" },
              { id: "university-elective-law-7", title: "University Elective/General Education", description: "General education course" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "international-law-3", title: "International Law III", description: "Advanced study of international legal systems and treaties" },
              { id: "legal-writing-4", title: "Legal Writing IV", description: "Advanced legal research, writing, and analysis" },
              { id: "legal-skills-3", title: "Legal Skills III", description: "Advanced practical legal skills in negotiation, drafting, and advocacy" },
              { id: "university-elective-law-8", title: "University Elective/General Education", description: "General education course" }
            ]
          }
        ]
      }
    ]
  }
]

// Prefix all course IDs with their program ID for uniqueness
function prefixCourseIds(programs) {
  return programs.map(program => ({
    ...program,
    years: program.years.map(year => ({
      ...year,
      semesters: year.semesters.map(semester => ({
        ...semester,
        courses: semester.courses.map(course => ({
          ...course,
          id: `${program.id}-${course.id}`
        }))
      }))
    }))
  }))
}

programs = prefixCourseIds(programs)

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
  ],
  "calculus-1": [
    {
      text: "What is the derivative of sin(x)?",
      options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
      correctAnswer: "cos(x)"
    },
    {
      text: "What is the integral of 1/x dx?",
      options: ["ln|x| + C", "x^2/2 + C", "e^x + C", "1/(x^2) + C"],
      correctAnswer: "ln|x| + C"
    },
    {
      text: "What is the limit of (sin(x)/x) as x approaches 0?",
      options: ["0", "1", "Infinity", "Does not exist"],
      correctAnswer: "1"
    },
    {
      text: "Which rule is used to differentiate a product of two functions?",
      options: ["Product Rule", "Quotient Rule", "Chain Rule", "Power Rule"],
      correctAnswer: "Product Rule"
    },
    {
      text: "What is the area under the curve y = x from x = 0 to x = 2?",
      options: ["2", "4", "1", "None of the above"],
      correctAnswer: "2"
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
    await prisma.course.deleteMany()
    await prisma.semester.deleteMany()
    await prisma.year.deleteMany()
    await prisma.program.deleteMany()

    // Seed programs, years, semesters, and courses
    console.log('Seeding programs, years, semesters, and courses...')
    for (const programData of programs) {
      const program = await prisma.program.create({
        data: {
          id: programData.id,
          title: programData.title,
          description: programData.description
        }
      })

      for (const yearData of programData.years) {
        const year = await prisma.year.create({
          data: {
            year: yearData.year,
            programId: program.id
          }
        })

        for (const semesterData of yearData.semesters) {
          const semester = await prisma.semester.create({
            data: {
              semester: semesterData.semester,
              yearId: year.id
            }
          })

          for (const courseData of semesterData.courses) {
            await prisma.course.create({
              data: {
                id: courseData.id,
                title: courseData.title,
                description: courseData.description,
                semesterId: semester.id
              }
            })
          }
        }
      }
    }

    // Seed recommendations
    console.log('Seeding recommendations...')
    // Temporarily skip recommendations to focus on programs
    /*
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
    */

    // Seed quizzes for all courses
    console.log('Seeding quizzes for all courses...')
    let quizCount = 0

    for (const program of programs) {
      for (const year of program.years) {
        for (const semester of year.semesters) {
          for (const course of semester.courses) {
            const questions = generateQuizQuestions(course.id.replace(`${program.id}-`, ''), course.title)
            
            // Create quiz with proper courseId linking
            const quiz = await prisma.quiz.create({
              data: {
                title: course.title,
                description: course.description || `Quiz for ${course.title}`,
                difficulty: year.year === 1 ? "Beginner" : year.year === 2 ? "Intermediate" : "Advanced",
                timeLimit: 15,
                tags: [program.id, `year-${year.year}`, `semester-${semester.semester}`],
                courseId: course.id  // Link the quiz to the course
              }
            })

            // Create questions for this quiz
            for (const questionData of questions) {
              await prisma.question.create({
                data: {
                  text: questionData.text,
                  options: questionData.options,
                  correctAnswer: questionData.correctAnswer,
                  explanation: questionData.explanation || `This question tests understanding of ${course.title}`,
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
    // console.log(`Created ${recommendationsData.length} recommendations`)

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