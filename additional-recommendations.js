// Additional recommendations for the 6 new programs
const additionalRecommendations = [
  // Mechanical Engineering Recommendations
  {
    id: "me-rec-1",
    title: "Master Mechanical Engineering Fundamentals",
    description: "Build a strong foundation in mechanical engineering principles",
    category: "mechanical-engineering",
    difficulty: "Beginner",
    duration: "6 months",
    prerequisites: ["high school physics", "high school mathematics"],
    steps: [
      "Start with basic physics concepts - mechanics, thermodynamics, and fluid dynamics",
      "Learn mathematical foundations - calculus, linear algebra, and differential equations",
      "Study material science and properties of engineering materials",
      "Practice with CAD software and technical drawing",
      "Work on hands-on projects to apply theoretical knowledge"
    ],
    resources: [
      "MIT OpenCourseWare - Introduction to Mechanical Engineering",
      "Khan Academy - Physics and Mathematics",
      "SolidWorks or AutoCAD for CAD practice",
      "Engineering design projects and competitions"
    ],
    tips: [
      "Focus on understanding fundamental principles rather than memorizing formulas",
      "Practice problem-solving regularly",
      "Join engineering clubs and participate in projects",
      "Develop strong analytical and critical thinking skills"
    ]
  },
  {
    id: "me-rec-2",
    title: "Advanced Mechanical Systems Design",
    description: "Learn to design complex mechanical systems and components",
    category: "mechanical-engineering",
    difficulty: "Advanced",
    duration: "8 months",
    prerequisites: ["mechanical engineering fundamentals", "CAD skills"],
    steps: [
      "Study advanced mechanics and dynamics",
      "Learn finite element analysis (FEA) for structural analysis",
      "Master machine design principles and standards",
      "Study control systems and automation",
      "Work on comprehensive design projects"
    ],
    resources: [
      "ANSYS or similar FEA software",
      "Machine Design textbooks and standards",
      "Control systems simulation software",
      "Industry case studies and real-world projects"
    ],
    tips: [
      "Focus on practical applications and industry standards",
      "Learn to use professional engineering software",
      "Understand safety and reliability requirements",
      "Develop project management skills"
    ]
  },
  // Civil Engineering Recommendations
  {
    id: "civil-rec-1",
    title: "Civil Engineering Infrastructure Design",
    description: "Learn to design and analyze civil infrastructure systems",
    category: "civil-engineering",
    difficulty: "Beginner",
    duration: "7 months",
    prerequisites: ["high school physics", "high school mathematics"],
    steps: [
      "Study structural analysis and mechanics of materials",
      "Learn geotechnical engineering and soil mechanics",
      "Understand transportation engineering principles",
      "Study environmental engineering and sustainability",
      "Practice with civil engineering software"
    ],
    resources: [
      "AutoCAD Civil 3D for civil design",
      "STAAD.Pro for structural analysis",
      "Civil engineering textbooks and codes",
      "Site visits and field experience"
    ],
    tips: [
      "Understand building codes and regulations",
      "Focus on sustainable design practices",
      "Develop strong project management skills",
      "Learn to work with multidisciplinary teams"
    ]
  },
  {
    id: "civil-rec-2",
    title: "Advanced Structural Engineering",
    description: "Master advanced structural analysis and design",
    category: "civil-engineering",
    difficulty: "Advanced",
    duration: "9 months",
    prerequisites: ["structural analysis", "mechanics of materials"],
    steps: [
      "Study advanced structural analysis methods",
      "Learn seismic design and earthquake engineering",
      "Master steel and concrete design",
      "Study bridge and building design",
      "Work on complex structural projects"
    ],
    resources: [
      "ETABS or SAP2000 for structural analysis",
      "Advanced structural engineering textbooks",
      "Building codes and design standards",
      "Professional engineering software"
    ],
    tips: [
      "Focus on safety and reliability in design",
      "Understand construction methods and constraints",
      "Learn to optimize designs for cost and performance",
      "Stay updated with latest design codes and standards"
    ]
  },
  // Chemical Engineering Recommendations
  {
    id: "chem-rec-1",
    title: "Chemical Process Engineering Fundamentals",
    description: "Build foundation in chemical engineering processes",
    category: "chemical-engineering",
    difficulty: "Beginner",
    duration: "6 months",
    prerequisites: ["high school chemistry", "high school mathematics"],
    steps: [
      "Study chemical engineering thermodynamics",
      "Learn fluid mechanics and heat transfer",
      "Understand mass transfer and separation processes",
      "Study chemical reaction engineering",
      "Practice with process simulation software"
    ],
    resources: [
      "Aspen Plus or similar process simulation software",
      "Chemical engineering textbooks",
      "Laboratory experiments and safety training",
      "Industry case studies"
    ],
    tips: [
      "Focus on understanding process fundamentals",
      "Develop strong safety awareness",
      "Learn to use process simulation tools",
      "Understand environmental and economic considerations"
    ]
  },
  {
    id: "chem-rec-2",
    title: "Advanced Chemical Process Design",
    description: "Master complex chemical process design and optimization",
    category: "chemical-engineering",
    difficulty: "Advanced",
    duration: "8 months",
    prerequisites: ["chemical engineering fundamentals", "process simulation"],
    steps: [
      "Study advanced process design principles",
      "Learn process control and automation",
      "Master plant design and economics",
      "Study safety and risk assessment",
      "Work on comprehensive process design projects"
    ],
    resources: [
      "Advanced process simulation software",
      "Plant design and economics textbooks",
      "Safety analysis software",
      "Industry design standards and codes"
    ],
    tips: [
      "Focus on safety and environmental compliance",
      "Understand economic optimization",
      "Learn to work with multidisciplinary teams",
      "Stay updated with industry best practices"
    ]
  },
  // Architecture Recommendations
  {
    id: "arch-rec-1",
    title: "Architectural Design Fundamentals",
    description: "Develop core architectural design skills and principles",
    category: "architecture",
    difficulty: "Beginner",
    duration: "8 months",
    prerequisites: ["art and design interest", "basic drawing skills"],
    steps: [
      "Study architectural history and theory",
      "Learn architectural drawing and representation",
      "Understand building systems and construction",
      "Study environmental design and sustainability",
      "Practice with architectural software"
    ],
    resources: [
      "AutoCAD and Revit for architectural design",
      "SketchUp for 3D modeling",
      "Architectural history books and case studies",
      "Drawing and sketching practice"
    ],
    tips: [
      "Develop strong visual and spatial thinking",
      "Focus on sustainable and human-centered design",
      "Learn to communicate design ideas effectively",
      "Build a portfolio of design work"
    ]
  },
  {
    id: "arch-rec-2",
    title: "Advanced Architectural Design Studio",
    description: "Master complex architectural design and urban planning",
    category: "architecture",
    difficulty: "Advanced",
    duration: "10 months",
    prerequisites: ["architectural fundamentals", "design software skills"],
    steps: [
      "Study advanced architectural theory",
      "Learn urban planning and design",
      "Master building technology and systems",
      "Study architectural research methods",
      "Work on comprehensive design projects"
    ],
    resources: [
      "Advanced architectural software",
      "Urban planning and design tools",
      "Building information modeling (BIM)",
      "Research and case study analysis"
    ],
    tips: [
      "Focus on innovative and sustainable design solutions",
      "Understand social and cultural contexts",
      "Develop strong research and analytical skills",
      "Build professional networks and collaborations"
    ]
  },
  // Medicine Recommendations
  {
    id: "med-rec-1",
    title: "Medical Foundation Studies",
    description: "Build strong foundation in medical sciences and practice",
    category: "medicine",
    difficulty: "Beginner",
    duration: "12 months",
    prerequisites: ["high school biology", "high school chemistry"],
    steps: [
      "Study human anatomy and physiology",
      "Learn biochemistry and molecular biology",
      "Understand medical terminology and concepts",
      "Study basic clinical skills",
      "Develop professional communication skills"
    ],
    resources: [
      "Anatomy and physiology textbooks",
      "Medical terminology courses",
      "Clinical skills training",
      "Healthcare shadowing experiences"
    ],
    tips: [
      "Focus on understanding fundamental biological processes",
      "Develop strong communication and empathy skills",
      "Learn to work in healthcare teams",
      "Maintain high ethical standards"
    ]
  },
  {
    id: "med-rec-2",
    title: "Advanced Medical Practice",
    description: "Master clinical skills and medical decision-making",
    category: "medicine",
    difficulty: "Advanced",
    duration: "18 months",
    prerequisites: ["medical foundation", "clinical experience"],
    steps: [
      "Study advanced clinical medicine",
      "Learn diagnostic reasoning and decision-making",
      "Master patient care and management",
      "Study medical ethics and professionalism",
      "Work in clinical settings under supervision"
    ],
    resources: [
      "Clinical medicine textbooks",
      "Medical simulation and training",
      "Clinical rotations and internships",
      "Professional development programs"
    ],
    tips: [
      "Focus on evidence-based practice",
      "Develop strong clinical reasoning skills",
      "Maintain patient safety and quality care",
      "Continue lifelong learning and professional development"
    ]
  },
  // Law Recommendations
  {
    id: "law-rec-1",
    title: "Legal Studies Foundation",
    description: "Build strong foundation in legal principles and systems",
    category: "law",
    difficulty: "Beginner",
    duration: "10 months",
    prerequisites: ["strong reading and writing skills", "critical thinking"],
    steps: [
      "Study legal system and jurisprudence",
      "Learn constitutional law and rights",
      "Understand contract and tort law",
      "Study legal research and writing",
      "Develop analytical and argumentation skills"
    ],
    resources: [
      "Legal textbooks and case law",
      "Legal research databases",
      "Writing and argumentation courses",
      "Moot court and debate practice"
    ],
    tips: [
      "Focus on understanding legal reasoning and logic",
      "Develop strong research and writing skills",
      "Learn to analyze complex legal issues",
      "Build strong argumentation and advocacy skills"
    ]
  },
  {
    id: "law-rec-2",
    title: "Advanced Legal Practice",
    description: "Master legal practice and specialized areas of law",
    category: "law",
    difficulty: "Advanced",
    duration: "12 months",
    prerequisites: ["legal foundation", "research skills"],
    steps: [
      "Study specialized areas of law",
      "Learn advanced legal research and writing",
      "Master legal advocacy and negotiation",
      "Study legal ethics and professionalism",
      "Work in legal settings under supervision"
    ],
    resources: [
      "Advanced legal textbooks and journals",
      "Legal practice software and tools",
      "Internships and clerkships",
      "Professional development programs"
    ],
    tips: [
      "Focus on practical legal skills",
      "Develop strong advocacy and negotiation skills",
      "Maintain high ethical standards",
      "Build professional networks and reputation"
    ]
  }
];

module.exports = { additionalRecommendations }; 