// Additional quizzes for the 6 new programs
const additionalQuizzes = [
  // Mechanical Engineering Quizzes
  {
    id: "intro-to-me",
    title: "Introduction to Mechanical Engineering",
    description: "Test your knowledge of mechanical engineering fundamentals",
    difficulty: "Beginner",
    timeLimit: 10,
    tags: ["mechanical engineering", "fundamentals", "engineering"],
    questions: [
      {
        text: "What is the primary focus of mechanical engineering?",
        options: [
          "Electrical systems",
          "Mechanical systems and energy conversion",
          "Chemical processes",
          "Computer programming"
        ],
        correctAnswer: "Mechanical systems and energy conversion",
        explanation: "Mechanical engineering focuses on the design, analysis, and manufacturing of mechanical systems and the conversion of energy from one form to another."
      },
      {
        text: "Which of the following is NOT a core area of mechanical engineering?",
        options: [
          "Thermodynamics",
          "Fluid mechanics",
          "Organic chemistry",
          "Materials science"
        ],
        correctAnswer: "Organic chemistry",
        explanation: "Organic chemistry is primarily a chemical engineering topic. Core mechanical engineering areas include thermodynamics, fluid mechanics, materials science, and mechanics."
      },
      {
        text: "What is the study of forces and their effects on bodies called?",
        options: [
          "Thermodynamics",
          "Mechanics",
          "Fluid dynamics",
          "Materials science"
        ],
        correctAnswer: "Mechanics",
        explanation: "Mechanics is the branch of physics that deals with forces and their effects on bodies, including statics (stationary bodies) and dynamics (moving bodies)."
      },
      {
        text: "Which law states that energy cannot be created or destroyed, only transformed?",
        options: [
          "First Law of Thermodynamics",
          "Second Law of Thermodynamics",
          "Newton's First Law",
          "Hooke's Law"
        ],
        correctAnswer: "First Law of Thermodynamics",
        explanation: "The First Law of Thermodynamics states that energy cannot be created or destroyed, only converted from one form to another."
      },
      {
        text: "What is the SI unit of force?",
        options: [
          "Joule",
          "Watt",
          "Newton",
          "Pascal"
        ],
        correctAnswer: "Newton",
        explanation: "The Newton (N) is the SI unit of force, defined as the force required to accelerate a mass of 1 kilogram at 1 meter per second squared."
      }
    ]
  },
  {
    id: "thermodynamics-1",
    title: "Thermodynamics I",
    description: "Test your knowledge of basic thermodynamic principles",
    difficulty: "Intermediate",
    timeLimit: 12,
    tags: ["thermodynamics", "mechanical engineering", "energy"],
    questions: [
      {
        text: "What is the definition of a thermodynamic system?",
        options: [
          "Any collection of matter",
          "A region of space with defined boundaries",
          "A heat engine",
          "A closed container"
        ],
        correctAnswer: "A region of space with defined boundaries",
        explanation: "A thermodynamic system is a region of space with defined boundaries that contains the matter and energy being studied."
      },
      {
        text: "Which thermodynamic process occurs at constant temperature?",
        options: [
          "Isobaric",
          "Isothermal",
          "Isentropic",
          "Isochoric"
        ],
        correctAnswer: "Isothermal",
        explanation: "An isothermal process occurs at constant temperature, while isobaric is constant pressure, isentropic is constant entropy, and isochoric is constant volume."
      },
      {
        text: "What is the efficiency of a Carnot engine operating between temperatures T1 and T2?",
        options: [
          "1 - T2/T1",
          "T1/T2",
          "T2/T1",
          "1 - T1/T2"
        ],
        correctAnswer: "1 - T2/T1",
        explanation: "The efficiency of a Carnot engine is given by η = 1 - T2/T1, where T2 is the lower temperature and T1 is the higher temperature."
      },
      {
        text: "Which of the following is a property of a pure substance?",
        options: [
          "Work",
          "Heat",
          "Internal energy",
          "Power"
        ],
        correctAnswer: "Internal energy",
        explanation: "Internal energy is a property of a pure substance, while work, heat, and power are not properties but forms of energy transfer."
      },
      {
        text: "What does the Second Law of Thermodynamics state about entropy?",
        options: [
          "Entropy always decreases",
          "Entropy always increases in isolated systems",
          "Entropy remains constant",
          "Entropy can be negative"
        ],
        correctAnswer: "Entropy always increases in isolated systems",
        explanation: "The Second Law states that the entropy of an isolated system always increases or remains constant, never decreases."
      }
    ]
  },
  // Civil Engineering Quizzes
  {
    id: "intro-to-civil",
    title: "Introduction to Civil Engineering",
    description: "Test your knowledge of civil engineering fundamentals",
    difficulty: "Beginner",
    timeLimit: 10,
    tags: ["civil engineering", "infrastructure", "construction"],
    questions: [
      {
        text: "What is the primary focus of civil engineering?",
        options: [
          "Electrical systems",
          "Infrastructure and built environment",
          "Chemical processes",
          "Computer systems"
        ],
        correctAnswer: "Infrastructure and built environment",
        explanation: "Civil engineering focuses on the design, construction, and maintenance of infrastructure and the built environment, including buildings, roads, bridges, and water systems."
      },
      {
        text: "Which of the following is NOT a major sub-discipline of civil engineering?",
        options: [
          "Structural engineering",
          "Transportation engineering",
          "Electrical engineering",
          "Environmental engineering"
        ],
        correctAnswer: "Electrical engineering",
        explanation: "Electrical engineering is a separate discipline. Major civil engineering sub-disciplines include structural, transportation, environmental, geotechnical, and water resources engineering."
      },
      {
        text: "What is the study of soil behavior called?",
        options: [
          "Geology",
          "Geotechnical engineering",
          "Soil science",
          "Hydrology"
        ],
        correctAnswer: "Geotechnical engineering",
        explanation: "Geotechnical engineering is the branch of civil engineering that deals with soil behavior and its application to the design of foundations and earth structures."
      },
      {
        text: "What is the primary purpose of a foundation?",
        options: [
          "To provide aesthetics",
          "To transfer loads to the ground",
          "To provide insulation",
          "To create space"
        ],
        correctAnswer: "To transfer loads to the ground",
        explanation: "The primary purpose of a foundation is to transfer the loads from the structure safely to the underlying soil or rock."
      },
      {
        text: "Which material is most commonly used in modern construction?",
        options: [
          "Wood",
          "Steel",
          "Concrete",
          "Brick"
        ],
        correctAnswer: "Concrete",
        explanation: "Concrete is the most widely used construction material in the world due to its versatility, strength, and cost-effectiveness."
      }
    ]
  },
  {
    id: "structural-analysis-1",
    title: "Structural Analysis I",
    description: "Test your knowledge of basic structural analysis principles",
    difficulty: "Intermediate",
    timeLimit: 12,
    tags: ["structural analysis", "civil engineering", "mechanics"],
    questions: [
      {
        text: "What is the primary assumption in structural analysis?",
        options: [
          "Materials are always elastic",
          "Structures are always in equilibrium",
          "Loads are always static",
          "All of the above"
        ],
        correctAnswer: "All of the above",
        explanation: "Structural analysis assumes materials behave elastically, structures are in equilibrium, and loads are static for basic analysis."
      },
      {
        text: "What type of support prevents both translation and rotation?",
        options: [
          "Pin support",
          "Roller support",
          "Fixed support",
          "Simple support"
        ],
        correctAnswer: "Fixed support",
        explanation: "A fixed support prevents both translation and rotation, while pin supports allow rotation and roller supports allow both translation and rotation."
      },
      {
        text: "What is the bending moment at a point?",
        options: [
          "The sum of all forces",
          "The tendency to cause rotation",
          "The internal force",
          "The external load"
        ],
        correctAnswer: "The tendency to cause rotation",
        explanation: "Bending moment is the tendency of a force to cause rotation about a point, measured as force times distance."
      },
      {
        text: "Which method is used to analyze statically indeterminate structures?",
        options: [
          "Method of joints",
          "Method of sections",
          "Force method",
          "Graphical method"
        ],
        correctAnswer: "Force method",
        explanation: "The force method (also called flexibility method) is used to analyze statically indeterminate structures by considering compatibility conditions."
      },
      {
        text: "What is the unit of bending moment?",
        options: [
          "Newton",
          "Newton-meter",
          "Pascal",
          "Joule"
        ],
        correctAnswer: "Newton-meter",
        explanation: "Bending moment is measured in Newton-meters (N⋅m) as it is force times distance."
      }
    ]
  },
  // Chemical Engineering Quizzes
  {
    id: "intro-to-chemical",
    title: "Introduction to Chemical Engineering",
    description: "Test your knowledge of chemical engineering fundamentals",
    difficulty: "Beginner",
    timeLimit: 10,
    tags: ["chemical engineering", "processes", "chemistry"],
    questions: [
      {
        text: "What is the primary focus of chemical engineering?",
        options: [
          "Chemical reactions only",
          "Design and operation of chemical processes",
          "Laboratory chemistry",
          "Environmental protection"
        ],
        correctAnswer: "Design and operation of chemical processes",
        explanation: "Chemical engineering focuses on the design, operation, and optimization of chemical processes for large-scale production."
      },
      {
        text: "Which of the following is NOT a core area of chemical engineering?",
        options: [
          "Thermodynamics",
          "Fluid mechanics",
          "Quantum mechanics",
          "Mass transfer"
        ],
        correctAnswer: "Quantum mechanics",
        explanation: "Quantum mechanics is primarily a physics topic. Core chemical engineering areas include thermodynamics, fluid mechanics, mass transfer, and heat transfer."
      },
      {
        text: "What is a unit operation?",
        options: [
          "A single chemical reaction",
          "A basic step in a chemical process",
          "A piece of equipment",
          "A laboratory procedure"
        ],
        correctAnswer: "A basic step in a chemical process",
        explanation: "A unit operation is a basic step in a chemical process, such as distillation, filtration, or heat exchange."
      },
      {
        text: "What is the purpose of a material balance?",
        options: [
          "To track costs",
          "To ensure mass conservation",
          "To measure temperature",
          "To control pressure"
        ],
        correctAnswer: "To ensure mass conservation",
        explanation: "Material balances ensure that mass is conserved in chemical processes, following the principle that mass cannot be created or destroyed."
      },
      {
        text: "Which of the following is a common chemical engineering unit?",
        options: [
          "Mole",
          "Newton",
          "Joule",
          "All of the above"
        ],
        correctAnswer: "All of the above",
        explanation: "Chemical engineers use various units including moles (for chemical amounts), Newtons (for force), and Joules (for energy)."
      }
    ]
  },
  {
    id: "thermodynamics-chemical",
    title: "Chemical Engineering Thermodynamics",
    description: "Test your knowledge of thermodynamic principles in chemical engineering",
    difficulty: "Intermediate",
    timeLimit: 12,
    tags: ["thermodynamics", "chemical engineering", "processes"],
    questions: [
      {
        text: "What is the Gibbs free energy used to determine?",
        options: [
          "Temperature",
          "Pressure",
          "Spontaneity of reactions",
          "Volume"
        ],
        correctAnswer: "Spontaneity of reactions",
        explanation: "Gibbs free energy is used to determine the spontaneity of chemical reactions at constant temperature and pressure."
      },
      {
        text: "What is an ideal gas?",
        options: [
          "A gas that follows PV=nRT exactly",
          "Any gas at high temperature",
          "A gas with no intermolecular forces",
          "Both A and C"
        ],
        correctAnswer: "Both A and C",
        explanation: "An ideal gas follows the equation PV=nRT exactly and has no intermolecular forces between molecules."
      },
      {
        text: "What is the definition of enthalpy?",
        options: [
          "H = U + PV",
          "H = U - PV",
          "H = U × PV",
          "H = U ÷ PV"
        ],
        correctAnswer: "H = U + PV",
        explanation: "Enthalpy is defined as H = U + PV, where U is internal energy, P is pressure, and V is volume."
      },
      {
        text: "What is the Clausius-Clapeyron equation used for?",
        options: [
          "Vapor pressure calculation",
          "Heat capacity",
          "Entropy change",
          "Work done"
        ],
        correctAnswer: "Vapor pressure calculation",
        explanation: "The Clausius-Clapeyron equation relates the vapor pressure of a substance to its temperature."
      },
      {
        text: "What is the efficiency of a reversible process?",
        options: [
          "Always 100%",
          "Always less than 100%",
          "Depends on the process",
          "Cannot be determined"
        ],
        correctAnswer: "Always 100%",
        explanation: "A reversible process is theoretically 100% efficient, though such processes are idealized and cannot be achieved in practice."
      }
    ]
  },
  // Architecture Quizzes
  {
    id: "intro-to-architecture",
    title: "Introduction to Architecture",
    description: "Test your knowledge of architectural principles and history",
    difficulty: "Beginner",
    timeLimit: 10,
    tags: ["architecture", "design", "history"],
    questions: [
      {
        text: "What is the primary purpose of architecture?",
        options: [
          "To create beautiful buildings",
          "To provide shelter and functional spaces",
          "To maximize profit",
          "To follow building codes"
        ],
        correctAnswer: "To provide shelter and functional spaces",
        explanation: "The primary purpose of architecture is to create functional spaces that provide shelter and meet human needs while considering aesthetics and context."
      },
      {
        text: "What are the three principles of architecture according to Vitruvius?",
        options: [
          "Form, function, and style",
          "Firmitas, utilitas, venustas",
          "Design, build, maintain",
          "Plan, section, elevation"
        ],
        correctAnswer: "Firmitas, utilitas, venustas",
        explanation: "Vitruvius defined architecture by three principles: firmitas (strength), utilitas (utility), and venustas (beauty)."
      },
      {
        text: "Which architectural style is characterized by pointed arches and flying buttresses?",
        options: [
          "Romanesque",
          "Gothic",
          "Renaissance",
          "Baroque"
        ],
        correctAnswer: "Gothic",
        explanation: "Gothic architecture is characterized by pointed arches, flying buttresses, and ribbed vaults, allowing for taller and more open spaces."
      },
      {
        text: "What is the golden ratio approximately equal to?",
        options: [
          "1.414",
          "1.618",
          "2.718",
          "3.141"
        ],
        correctAnswer: "1.618",
        explanation: "The golden ratio (φ) is approximately 1.618 and has been used in architecture and art for its aesthetically pleasing proportions."
      },
      {
        text: "What is a floor plan?",
        options: [
          "A view from above",
          "A view from the side",
          "A 3D model",
          "A perspective drawing"
        ],
        correctAnswer: "A view from above",
        explanation: "A floor plan is a horizontal section view showing the layout of a building as seen from above, typically at eye level."
      }
    ]
  },
  {
    id: "architectural-design-1",
    title: "Architectural Design Studio I",
    description: "Test your knowledge of basic architectural design principles",
    difficulty: "Intermediate",
    timeLimit: 12,
    tags: ["architectural design", "studio", "principles"],
    questions: [
      {
        text: "What is the first step in the architectural design process?",
        options: [
          "Drawing floor plans",
          "Site analysis",
          "Client meeting",
          "Material selection"
        ],
        correctAnswer: "Site analysis",
        explanation: "Site analysis is typically the first step, involving understanding the physical, environmental, and contextual characteristics of the site."
      },
      {
        text: "What is the purpose of a parti diagram?",
        options: [
          "To show construction details",
          "To communicate the basic concept",
          "To calculate costs",
          "To show electrical layout"
        ],
        correctAnswer: "To communicate the basic concept",
        explanation: "A parti diagram is a simple diagram that communicates the basic concept or organizing principle of a design."
      },
      {
        text: "What is the relationship between form and function in architecture?",
        options: [
          "Form always follows function",
          "Function always follows form",
          "They should be integrated",
          "They are independent"
        ],
        correctAnswer: "They should be integrated",
        explanation: "In good architecture, form and function should be integrated, with the form supporting and enhancing the function."
      },
      {
        text: "What is a circulation diagram?",
        options: [
          "A traffic flow diagram",
          "A diagram showing movement through spaces",
          "A plumbing diagram",
          "A ventilation diagram"
        ],
        correctAnswer: "A diagram showing movement through spaces",
        explanation: "A circulation diagram shows how people move through and between spaces in a building."
      },
      {
        text: "What is the purpose of a bubble diagram?",
        options: [
          "To show room relationships",
          "To show construction details",
          "To show electrical systems",
          "To show structural elements"
        ],
        correctAnswer: "To show room relationships",
        explanation: "A bubble diagram shows the relationships between spaces and their relative sizes and adjacencies."
      }
    ]
  },
  // Medicine Quizzes
  {
    id: "intro-to-medicine",
    title: "Introduction to Medicine",
    description: "Test your knowledge of medical profession fundamentals",
    difficulty: "Beginner",
    timeLimit: 10,
    tags: ["medicine", "healthcare", "medical profession"],
    questions: [
      {
        text: "What is the primary goal of medicine?",
        options: [
          "To cure all diseases",
          "To promote health and treat illness",
          "To perform surgery",
          "To prescribe medications"
        ],
        correctAnswer: "To promote health and treat illness",
        explanation: "The primary goal of medicine is to promote health, prevent disease, and treat illness to improve patient well-being."
      },
      {
        text: "What does the Hippocratic Oath emphasize?",
        options: [
          "Financial gain",
          "Ethical practice and patient care",
          "Research advancement",
          "Professional recognition"
        ],
        correctAnswer: "Ethical practice and patient care",
        explanation: "The Hippocratic Oath emphasizes ethical practice, patient confidentiality, and the duty to do no harm."
      },
      {
        text: "What is evidence-based medicine?",
        options: [
          "Medicine based on tradition",
          "Medicine based on scientific evidence",
          "Medicine based on intuition",
          "Medicine based on cost"
        ],
        correctAnswer: "Medicine based on scientific evidence",
        explanation: "Evidence-based medicine integrates clinical expertise with the best available scientific evidence to make patient care decisions."
      },
      {
        text: "What is the role of a primary care physician?",
        options: [
          "To perform surgery only",
          "To provide comprehensive healthcare",
          "To work in emergency rooms only",
          "To conduct research only"
        ],
        correctAnswer: "To provide comprehensive healthcare",
        explanation: "Primary care physicians provide comprehensive healthcare, including prevention, diagnosis, treatment, and coordination of care."
      },
      {
        text: "What is informed consent?",
        options: [
          "A legal document",
          "Patient's understanding and agreement to treatment",
          "A medical procedure",
          "A type of medication"
        ],
        correctAnswer: "Patient's understanding and agreement to treatment",
        explanation: "Informed consent is the process where patients understand their condition, treatment options, and give voluntary agreement to treatment."
      }
    ]
  },
  {
    id: "anatomy-1",
    title: "Anatomy I",
    description: "Test your knowledge of human anatomy fundamentals",
    difficulty: "Intermediate",
    timeLimit: 12,
    tags: ["anatomy", "medicine", "human body"],
    questions: [
      {
        text: "What is the largest organ in the human body?",
        options: [
          "Heart",
          "Brain",
          "Skin",
          "Liver"
        ],
        correctAnswer: "Skin",
        explanation: "The skin is the largest organ in the human body, covering approximately 20 square feet and weighing about 8 pounds."
      },
      {
        text: "How many bones are in the adult human skeleton?",
        options: [
          "206",
          "186",
          "226",
          "196"
        ],
        correctAnswer: "206",
        explanation: "The adult human skeleton typically contains 206 bones, though this number can vary slightly between individuals."
      },
      {
        text: "What is the function of red blood cells?",
        options: [
          "To fight infection",
          "To transport oxygen",
          "To clot blood",
          "To produce antibodies"
        ],
        correctAnswer: "To transport oxygen",
        explanation: "Red blood cells contain hemoglobin and are responsible for transporting oxygen from the lungs to tissues throughout the body."
      },
      {
        text: "What is the main function of the heart?",
        options: [
          "To produce blood",
          "To pump blood throughout the body",
          "To filter blood",
          "To store blood"
        ],
        correctAnswer: "To pump blood throughout the body",
        explanation: "The heart's main function is to pump blood throughout the circulatory system, delivering oxygen and nutrients to tissues."
      },
      {
        text: "What is the largest part of the brain?",
        options: [
          "Cerebellum",
          "Brainstem",
          "Cerebrum",
          "Thalamus"
        ],
        correctAnswer: "Cerebrum",
        explanation: "The cerebrum is the largest part of the brain, responsible for higher cognitive functions like thinking, memory, and voluntary movement."
      }
    ]
  },
  // Law Quizzes
  {
    id: "intro-to-law",
    title: "Introduction to Law",
    description: "Test your knowledge of legal system fundamentals",
    difficulty: "Beginner",
    timeLimit: 10,
    tags: ["law", "legal system", "jurisprudence"],
    questions: [
      {
        text: "What is the primary purpose of law?",
        options: [
          "To generate revenue",
          "To maintain order and justice",
          "To create government jobs",
          "To restrict freedom"
        ],
        correctAnswer: "To maintain order and justice",
        explanation: "The primary purpose of law is to maintain social order, provide justice, and establish rules for peaceful coexistence in society."
      },
      {
        text: "What is common law?",
        options: [
          "Law made by legislatures",
          "Law based on judicial decisions",
          "International law",
          "Constitutional law"
        ],
        correctAnswer: "Law based on judicial decisions",
        explanation: "Common law is a legal system based on judicial decisions and precedents rather than statutory laws."
      },
      {
        text: "What is the principle of stare decisis?",
        options: [
          "To stand by decided cases",
          "To overturn precedents",
          "To create new laws",
          "To interpret constitutions"
        ],
        correctAnswer: "To stand by decided cases",
        explanation: "Stare decisis means 'to stand by decided cases' and is the principle of following precedent in legal decisions."
      },
      {
        text: "What is the difference between civil and criminal law?",
        options: [
          "Civil law is more serious",
          "Criminal law involves state prosecution",
          "Civil law only involves contracts",
          "There is no difference"
        ],
        correctAnswer: "Criminal law involves state prosecution",
        explanation: "Criminal law involves offenses against the state and is prosecuted by the government, while civil law involves disputes between individuals."
      },
      {
        text: "What is jurisprudence?",
        options: [
          "The study of law",
          "The practice of law",
          "The enforcement of law",
          "The creation of law"
        ],
        correctAnswer: "The study of law",
        explanation: "Jurisprudence is the study of law, legal theory, and the philosophy of law."
      }
    ]
  },
  {
    id: "constitutional-law-1",
    title: "Constitutional Law I",
    description: "Test your knowledge of constitutional law principles",
    difficulty: "Intermediate",
    timeLimit: 12,
    tags: ["constitutional law", "government", "rights"],
    questions: [
      {
        text: "What is the purpose of a constitution?",
        options: [
          "To create government jobs",
          "To establish government structure and protect rights",
          "To generate revenue",
          "To restrict freedoms"
        ],
        correctAnswer: "To establish government structure and protect rights",
        explanation: "A constitution establishes the structure of government, defines its powers, and protects fundamental rights of citizens."
      },
      {
        text: "What is judicial review?",
        options: [
          "Review of judicial decisions",
          "Power of courts to review government actions",
          "Review of legislation",
          "All of the above"
        ],
        correctAnswer: "All of the above",
        explanation: "Judicial review is the power of courts to review and potentially invalidate government actions, including legislation and executive decisions."
      },
      {
        text: "What are fundamental rights?",
        options: [
          "Rights that can be easily changed",
          "Basic human rights protected by constitution",
          "Rights granted by government",
          "Economic rights only"
        ],
        correctAnswer: "Basic human rights protected by constitution",
        explanation: "Fundamental rights are basic human rights that are protected by the constitution and cannot be easily abridged by government."
      },
      {
        text: "What is the principle of separation of powers?",
        options: [
          "Division of government into branches",
          "Separation of church and state",
          "Separation of federal and state powers",
          "Separation of rich and poor"
        ],
        correctAnswer: "Division of government into branches",
        explanation: "Separation of powers divides government into distinct branches (executive, legislative, judicial) to prevent concentration of power."
      },
      {
        text: "What is the purpose of checks and balances?",
        options: [
          "To slow down government",
          "To prevent abuse of power",
          "To create bureaucracy",
          "To increase efficiency"
        ],
        correctAnswer: "To prevent abuse of power",
        explanation: "Checks and balances allow each branch of government to limit the powers of other branches, preventing abuse of power."
      }
    ]
  }
];

module.exports = { additionalQuizzes }; 