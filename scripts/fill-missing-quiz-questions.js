const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Full program data copied from lib/program-data.ts
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
              { id: "industrial-electronics", title: "Industrial Electronics", description: "Electronics for industrial applications" },
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
              { id: "advanced-power-systems", title: "Advanced Power Systems", description: "Advanced power system analysis and control" },
              { id: "wireless-communications", title: "Wireless Communications", description: "Principles of wireless communication systems" },
              { id: "smart-grid", title: "Smart Grid Technologies", description: "Modern power grid technologies and management" },
              { id: "power-quality", title: "Power Quality and Reliability", description: "Power quality issues and solutions" },
              { id: "research-methods-ee", title: "Research Methods in Electrical Engineering", description: "Research methodologies in electrical engineering" },
              { id: "internship-ee", title: "Internship/Industrial Attachment", description: "Practical industry experience" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "capstone-project-ee-1", title: "Capstone Project I (Research/Design)", description: "First part of the capstone project" },
              { id: "advanced-control-systems", title: "Advanced Control Systems", description: "Advanced control system design and analysis" },
              { id: "elective-power-electronics", title: "Elective: Advanced Power Electronics", description: "Advanced power electronic systems" },
              { id: "elective-renewable-energy", title: "Elective: Advanced Renewable Energy", description: "Advanced renewable energy technologies" },
              { id: "elective-communications", title: "Elective: Advanced Communications", description: "Advanced communication systems" },
              { id: "capstone-project-ee-2", title: "Capstone Project II (Implementation/Final Presentation)", description: "Final part of the capstone project" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "business-administration",
    title: "BSc. Business Administration",
    description: "Study of business principles, management, and organizational behavior",
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "intro-business", title: "Introduction to Business", description: "Overview of business concepts and principles" },
              { id: "principles-management", title: "Principles of Management", description: "Fundamental management concepts and practices" },
              { id: "microeconomics", title: "Microeconomics", description: "Study of individual economic units and markets" },
              { id: "business-math", title: "Business Mathematics", description: "Mathematical concepts for business applications" },
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
              { id: "marketing-principles", title: "Principles of Marketing", description: "Fundamental marketing concepts and strategies" },
              { id: "business-finance", title: "Business Finance", description: "Financial management and investment decisions" },
              { id: "human-resource-management", title: "Human Resource Management", description: "Management of human resources in organizations" },
              { id: "management-accounting", title: "Management Accounting", description: "Accounting for internal decision making" },
              { id: "business-elective-1", title: "Business Elective I", description: "Specialized business topic" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "operations-management", title: "Operations Management", description: "Management of production and service operations" },
              { id: "corporate-finance", title: "Corporate Finance", description: "Advanced financial management for corporations" },
              { id: "business-ethics", title: "Business Ethics", description: "Ethical issues in business decision making" },
              { id: "entrepreneurship", title: "Entrepreneurship", description: "Starting and managing new business ventures" },
              { id: "business-analysis", title: "Business Analysis", description: "Analysis of business processes and systems" },
              { id: "business-elective-2", title: "Business Elective II", description: "Specialized business topic" }
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
              { id: "business-elective-3", title: "Business Elective III", description: "Specialized business topic" }
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
              { id: "business-elective-4", title: "Business Elective IV", description: "Specialized business topic" }
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
              { id: "global-strategy", title: "Global Strategy", description: "Strategic management in global markets" },
              { id: "advanced-financial-management", title: "Advanced Financial Management", description: "Advanced financial management techniques" },
              { id: "supply-chain-management", title: "Supply Chain Management", description: "Management of supply chain operations" },
              { id: "risk-management", title: "Risk Management", description: "Identification and management of business risks" },
              { id: "research-methods-ba", title: "Research Methods in Business", description: "Research methodologies in business" },
              { id: "internship-ba", title: "Internship/Industrial Attachment", description: "Practical industry experience" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "capstone-project-ba-1", title: "Capstone Project I (Research/Design)", description: "First part of the capstone project" },
              { id: "advanced-marketing", title: "Advanced Marketing Strategies", description: "Advanced marketing concepts and strategies" },
              { id: "elective-financial-analysis", title: "Elective: Advanced Financial Analysis", description: "Advanced financial analysis techniques" },
              { id: "elective-business-technology", title: "Elective: Business Technology Management", description: "Management of business technology" },
              { id: "elective-international-marketing", title: "Elective: International Marketing", description: "Marketing in international markets" },
              { id: "capstone-project-ba-2", title: "Capstone Project II (Implementation/Final Presentation)", description: "Final part of the capstone project" }
            ]
          }
        ]
      }
    ]
  }
]

// Generic question generator
function generateGenericQuestions(courseTitle, needed) {
  const templates = [
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
  // Repeat templates if needed
  const questions = []
  for (let i = 0; i < needed; i++) {
    const t = templates[i % templates.length]
    // Slightly vary the question text for duplicates
    questions.push({
      text: t.text + (i >= templates.length ? ` (variant ${Math.floor(i/templates.length)+1})` : ''),
      options: t.options,
      correctAnswer: t.correctAnswer
    })
  }
  return questions
}

async function fillMissingQuizQuestions() {
  try {
    console.log('Filling missing quiz questions for all programs and courses...\n')

    // Get all quizzes with their question counts
    const quizzes = await prisma.quiz.findMany({
      include: {
        questions: true
      }
    })
    const quizMap = {}
    quizzes.forEach(quiz => {
      quizMap[quiz.id] = quiz
    })

    let totalAdded = 0
    let totalQuizzesCreated = 0
    for (const program of programs) {
      for (const year of program.years) {
        for (const semester of year.semesters) {
          for (const course of semester.courses) {
            let quiz = quizMap[course.id]
            // If quiz doesn't exist, create it
            if (!quiz) {
              quiz = await prisma.quiz.create({
                data: {
                  id: course.id,
                  title: course.title,
                  description: course.description || `Quiz for ${course.title}`,
                  difficulty: year.year === 1 ? "Beginner" : year.year === 2 ? "Intermediate" : "Advanced",
                  timeLimit: 15,
                  tags: [program.id, `year-${year.year}`, `semester-${semester.semester}`]
                }
              })
              quizMap[course.id] = quiz
              totalQuizzesCreated++
              console.log(`Created quiz for course: ${course.title} (${course.id})`)
            }
            // Now ensure it has at least 10 questions
            // Refresh questions count if just created
            const questions = await prisma.question.findMany({ where: { quizId: quiz.id } })
            const currentCount = questions.length
            if (currentCount < 10) {
              const needed = 10 - currentCount
              const newQuestions = generateGenericQuestions(course.title, needed)
              for (const q of newQuestions) {
                await prisma.question.create({
                  data: {
                    text: q.text,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    quizId: quiz.id
                  }
                })
                totalAdded++
              }
              if (needed > 0) {
                console.log(`Added ${needed} questions to ${course.title} (${course.id}) [now has 10 questions]`)
              }
            }
          }
        }
      }
    }
    console.log(`\nDone! Created ${totalQuizzesCreated} quizzes and added a total of ${totalAdded} questions.`)
  } catch (error) {
    console.error('Error filling missing quiz questions:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

fillMissingQuizQuestions()
  .then(() => {
    console.log('Quiz question filling completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Failed to fill missing quiz questions:', error)
    process.exit(1)
  }) 