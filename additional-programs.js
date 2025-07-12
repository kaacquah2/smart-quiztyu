// Additional programs to be added to the existing programs array
const additionalPrograms = [
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
              { id: "intro-to-me", title: "Introduction to Mechanical Engineering", description: "Fundamentals of mechanical engineering principles" },
              { id: "engineering-mechanics", title: "Engineering Mechanics", description: "Statics and dynamics of mechanical systems" },
              { id: "engineering-math-me", title: "Engineering Mathematics", description: "Mathematical foundations for mechanical engineering" },
              { id: "engineering-drawing", title: "Engineering Drawing and CAD", description: "Technical drawing and computer-aided design" },
              { id: "materials-science", title: "Materials Science", description: "Properties and behavior of engineering materials" },
              { id: "communication-skills-me", title: "Technical Communication", description: "Effective communication in engineering contexts" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "thermodynamics-1", title: "Thermodynamics I", description: "Basic principles of thermodynamics" },
              { id: "fluid-mechanics-1", title: "Fluid Mechanics I", description: "Fundamentals of fluid behavior and flow" },
              { id: "mechanics-materials", title: "Mechanics of Materials", description: "Stress, strain, and deformation of materials" },
              { id: "manufacturing-processes", title: "Manufacturing Processes", description: "Basic manufacturing techniques and processes" },
              { id: "computer-programming-me", title: "Computer Programming for Engineers", description: "Programming fundamentals for mechanical engineers" },
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
              { id: "thermodynamics-2", title: "Thermodynamics II", description: "Advanced thermodynamic cycles and applications" },
              { id: "fluid-mechanics-2", title: "Fluid Mechanics II", description: "Advanced fluid dynamics and applications" },
              { id: "machine-design", title: "Machine Design", description: "Principles of mechanical design and analysis" },
              { id: "heat-transfer", title: "Heat Transfer", description: "Conduction, convection, and radiation heat transfer" },
              { id: "dynamics-systems", title: "Dynamics and Vibrations", description: "Dynamic analysis of mechanical systems" },
              { id: "engineering-economics-me", title: "Engineering Economics", description: "Economic analysis for engineering decisions" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "control-systems-me", title: "Control Systems", description: "Analysis and design of control systems" },
              { id: "mechatronics", title: "Mechatronics", description: "Integration of mechanical, electrical, and computer systems" },
              { id: "finite-element-analysis", title: "Finite Element Analysis", description: "Numerical methods for engineering analysis" },
              { id: "robotics", title: "Robotics and Automation", description: "Principles of robotics and automated systems" },
              { id: "engineering-ethics-me", title: "Engineering Ethics and Professionalism", description: "Ethics and professional practice" },
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
              { id: "internal-combustion-engines", title: "Internal Combustion Engines", description: "Design and analysis of IC engines" },
              { id: "refrigeration-air-conditioning", title: "Refrigeration and Air Conditioning", description: "HVAC systems and refrigeration cycles" },
              { id: "turbomachinery", title: "Turbomachinery", description: "Turbines, pumps, and compressors" },
              { id: "composite-materials", title: "Composite Materials", description: "Properties and applications of composite materials" },
              { id: "engineering-project-me", title: "Engineering Design Project", description: "Team-based engineering design project" },
              { id: "technical-elective-me-1", title: "Technical Elective I", description: "Specialized mechanical engineering topic" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "automotive-engineering", title: "Automotive Engineering", description: "Vehicle design and automotive systems" },
              { id: "aerospace-engineering", title: "Aerospace Engineering", description: "Aircraft and spacecraft design principles" },
              { id: "renewable-energy-systems", title: "Renewable Energy Systems", description: "Solar, wind, and other renewable energy technologies" },
              { id: "quality-control", title: "Quality Control and Reliability", description: "Quality assurance and reliability engineering" },
              { id: "industrial-engineering", title: "Industrial Engineering", description: "Production systems and operations management" },
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
              { id: "advanced-thermodynamics", title: "Advanced Thermodynamics", description: "Advanced thermodynamic concepts and applications" },
              { id: "computational-fluid-dynamics", title: "Computational Fluid Dynamics", description: "Numerical simulation of fluid flows" },
              { id: "advanced-materials", title: "Advanced Materials Engineering", description: "Advanced materials and their applications" },
              { id: "research-methods-me", title: "Research Methods in Mechanical Engineering", description: "Research methodologies in mechanical engineering" },
              { id: "internship-me", title: "Mechanical Engineering Internship", description: "Practical industry experience" },
              { id: "technical-elective-me-3", title: "Technical Elective III", description: "Specialized mechanical engineering topic" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "capstone-project-me-1", title: "Capstone Project I (Research/Design)", description: "First part of the capstone project" },
              { id: "sustainable-engineering", title: "Sustainable Engineering", description: "Environmental considerations in engineering design" },
              { id: "advanced-manufacturing", title: "Advanced Manufacturing Technologies", description: "Modern manufacturing processes and technologies" },
              { id: "engineering-management", title: "Engineering Management", description: "Management principles for engineering projects" },
              { id: "technical-elective-me-4", title: "Technical Elective IV", description: "Specialized mechanical engineering topic" },
              { id: "capstone-project-me-2", title: "Capstone Project II (Implementation/Final Presentation)", description: "Final part of the capstone project" }
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
              { id: "intro-to-civil", title: "Introduction to Civil Engineering", description: "Fundamentals of civil engineering principles" },
              { id: "engineering-mechanics-civil", title: "Engineering Mechanics", description: "Statics and dynamics for civil engineering" },
              { id: "engineering-math-civil", title: "Engineering Mathematics", description: "Mathematical foundations for civil engineering" },
              { id: "engineering-drawing-civil", title: "Engineering Drawing and Surveying", description: "Technical drawing and surveying fundamentals" },
              { id: "materials-civil", title: "Construction Materials", description: "Properties and behavior of construction materials" },
              { id: "communication-skills-civil", title: "Technical Communication", description: "Effective communication in civil engineering" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "structural-analysis-1", title: "Structural Analysis I", description: "Basic principles of structural analysis" },
              { id: "fluid-mechanics-civil", title: "Fluid Mechanics", description: "Fluid behavior and hydraulic principles" },
              { id: "soil-mechanics-1", title: "Soil Mechanics I", description: "Fundamentals of soil behavior and properties" },
              { id: "construction-technology", title: "Construction Technology", description: "Construction methods and techniques" },
              { id: "computer-aided-design", title: "Computer-Aided Design", description: "CAD software for civil engineering" },
              { id: "university-elective-civil-1", title: "University Elective/General Education", description: "General education course" }
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
              { id: "structural-analysis-2", title: "Structural Analysis II", description: "Advanced structural analysis methods" },
              { id: "reinforced-concrete", title: "Reinforced Concrete Design", description: "Design of reinforced concrete structures" },
              { id: "steel-structures", title: "Steel Structures", description: "Design of steel structural elements" },
              { id: "soil-mechanics-2", title: "Soil Mechanics II", description: "Advanced soil mechanics and foundation design" },
              { id: "transportation-engineering", title: "Transportation Engineering", description: "Highway and transportation systems" },
              { id: "engineering-economics-civil", title: "Engineering Economics", description: "Economic analysis for civil engineering projects" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "foundation-engineering", title: "Foundation Engineering", description: "Design of foundations and retaining structures" },
              { id: "water-resources", title: "Water Resources Engineering", description: "Water supply, drainage, and hydrology" },
              { id: "environmental-engineering", title: "Environmental Engineering", description: "Environmental protection and waste management" },
              { id: "construction-management", title: "Construction Management", description: "Project management in construction" },
              { id: "engineering-ethics-civil", title: "Engineering Ethics and Professionalism", description: "Ethics and professional practice" },
              { id: "university-elective-civil-2", title: "University Elective/General Education", description: "General education course" }
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
              { id: "prestressed-concrete", title: "Prestressed Concrete", description: "Design of prestressed concrete structures" },
              { id: "bridge-engineering", title: "Bridge Engineering", description: "Design and analysis of bridge structures" },
              { id: "geotechnical-engineering", title: "Geotechnical Engineering", description: "Advanced geotechnical analysis and design" },
              { id: "traffic-engineering", title: "Traffic Engineering", description: "Traffic flow analysis and control" },
              { id: "engineering-project-civil", title: "Civil Engineering Design Project", description: "Team-based engineering design project" },
              { id: "technical-elective-civil-1", title: "Technical Elective I", description: "Specialized civil engineering topic" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "earthquake-engineering", title: "Earthquake Engineering", description: "Seismic design and analysis of structures" },
              { id: "coastal-engineering", title: "Coastal Engineering", description: "Coastal structures and shoreline protection" },
              { id: "wastewater-treatment", title: "Wastewater Treatment", description: "Design of wastewater treatment systems" },
              { id: "pavement-design", title: "Pavement Design", description: "Design of highway and airport pavements" },
              { id: "construction-safety", title: "Construction Safety", description: "Safety management in construction projects" },
              { id: "technical-elective-civil-2", title: "Technical Elective II", description: "Specialized civil engineering topic" }
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
              { id: "advanced-structural-analysis", title: "Advanced Structural Analysis", description: "Advanced methods in structural analysis" },
              { id: "finite-element-methods", title: "Finite Element Methods", description: "Numerical methods for structural analysis" },
              { id: "sustainable-construction", title: "Sustainable Construction", description: "Green building and sustainable practices" },
              { id: "research-methods-civil", title: "Research Methods in Civil Engineering", description: "Research methodologies in civil engineering" },
              { id: "internship-civil", title: "Civil Engineering Internship", description: "Practical industry experience" },
              { id: "technical-elective-civil-3", title: "Technical Elective III", description: "Specialized civil engineering topic" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "capstone-project-civil-1", title: "Capstone Project I (Research/Design)", description: "First part of the capstone project" },
              { id: "infrastructure-planning", title: "Infrastructure Planning and Development", description: "Planning and development of infrastructure systems" },
              { id: "advanced-construction-methods", title: "Advanced Construction Methods", description: "Modern construction techniques and technologies" },
              { id: "project-management-civil", title: "Project Management", description: "Management of civil engineering projects" },
              { id: "technical-elective-civil-4", title: "Technical Elective IV", description: "Specialized civil engineering topic" },
              { id: "capstone-project-civil-2", title: "Capstone Project II (Implementation/Final Presentation)", description: "Final part of the capstone project" }
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
              { id: "intro-to-chemical", title: "Introduction to Chemical Engineering", description: "Fundamentals of chemical engineering principles" },
              { id: "general-chemistry", title: "General Chemistry", description: "Basic principles of chemistry" },
              { id: "engineering-math-chemical", title: "Engineering Mathematics", description: "Mathematical foundations for chemical engineering" },
              { id: "physics-chemical", title: "Physics for Chemical Engineers", description: "Physics principles for chemical engineering" },
              { id: "computer-programming-chemical", title: "Computer Programming", description: "Programming fundamentals for chemical engineers" },
              { id: "communication-skills-chemical", title: "Technical Communication", description: "Effective communication in chemical engineering" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "organic-chemistry", title: "Organic Chemistry", description: "Structure and reactions of organic compounds" },
              { id: "physical-chemistry", title: "Physical Chemistry", description: "Physical principles of chemical systems" },
              { id: "thermodynamics-chemical", title: "Chemical Engineering Thermodynamics", description: "Thermodynamic principles in chemical processes" },
              { id: "fluid-mechanics-chemical", title: "Fluid Mechanics", description: "Fluid behavior in chemical processes" },
              { id: "material-balances", title: "Material Balances", description: "Mass conservation in chemical processes" },
              { id: "university-elective-chemical-1", title: "University Elective/General Education", description: "General education course" }
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
              { id: "heat-transfer-chemical", title: "Heat Transfer", description: "Heat transfer in chemical processes" },
              { id: "mass-transfer", title: "Mass Transfer", description: "Mass transfer principles and applications" },
              { id: "chemical-kinetics", title: "Chemical Kinetics", description: "Reaction rates and mechanisms" },
              { id: "unit-operations-1", title: "Unit Operations I", description: "Basic unit operations in chemical engineering" },
              { id: "process-control-1", title: "Process Control I", description: "Basic principles of process control" },
              { id: "engineering-economics-chemical", title: "Engineering Economics", description: "Economic analysis for chemical processes" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "unit-operations-2", title: "Unit Operations II", description: "Advanced unit operations" },
              { id: "reactor-design", title: "Chemical Reactor Design", description: "Design of chemical reactors" },
              { id: "separation-processes", title: "Separation Processes", description: "Principles of separation techniques" },
              { id: "process-simulation", title: "Process Simulation", description: "Computer simulation of chemical processes" },
              { id: "engineering-ethics-chemical", title: "Engineering Ethics and Professionalism", description: "Ethics and professional practice" },
              { id: "university-elective-chemical-2", title: "University Elective/General Education", description: "General education course" }
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
              { id: "process-design", title: "Process Design", description: "Design of chemical processes" },
              { id: "plant-design", title: "Plant Design", description: "Design of chemical plants" },
              { id: "catalysis", title: "Catalysis and Catalytic Processes", description: "Catalytic reactions and processes" },
              { id: "polymer-engineering", title: "Polymer Engineering", description: "Polymer science and engineering" },
              { id: "engineering-project-chemical", title: "Chemical Engineering Design Project", description: "Team-based engineering design project" },
              { id: "technical-elective-chemical-1", title: "Technical Elective I", description: "Specialized chemical engineering topic" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "biochemical-engineering", title: "Biochemical Engineering", description: "Biological processes in engineering" },
              { id: "petroleum-refining", title: "Petroleum Refining", description: "Oil refining processes and technologies" },
              { id: "environmental-engineering-chemical", title: "Environmental Engineering", description: "Environmental protection in chemical processes" },
              { id: "safety-chemical", title: "Process Safety", description: "Safety in chemical processes" },
              { id: "quality-control-chemical", title: "Quality Control", description: "Quality assurance in chemical processes" },
              { id: "technical-elective-chemical-2", title: "Technical Elective II", description: "Specialized chemical engineering topic" }
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
              { id: "advanced-process-control", title: "Advanced Process Control", description: "Advanced control strategies for chemical processes" },
              { id: "computational-fluid-dynamics-chemical", title: "Computational Fluid Dynamics", description: "Numerical simulation of fluid flows in chemical processes" },
              { id: "nanotechnology", title: "Nanotechnology in Chemical Engineering", description: "Applications of nanotechnology in chemical engineering" },
              { id: "research-methods-chemical", title: "Research Methods in Chemical Engineering", description: "Research methodologies in chemical engineering" },
              { id: "internship-chemical", title: "Chemical Engineering Internship", description: "Practical industry experience" },
              { id: "technical-elective-chemical-3", title: "Technical Elective III", description: "Specialized chemical engineering topic" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "capstone-project-chemical-1", title: "Capstone Project I (Research/Design)", description: "First part of the capstone project" },
              { id: "sustainable-processes", title: "Sustainable Chemical Processes", description: "Green chemistry and sustainable processes" },
              { id: "advanced-separations", title: "Advanced Separation Technologies", description: "Modern separation techniques" },
              { id: "project-management-chemical", title: "Project Management", description: "Management of chemical engineering projects" },
              { id: "technical-elective-chemical-4", title: "Technical Elective IV", description: "Specialized chemical engineering topic" },
              { id: "capstone-project-chemical-2", title: "Capstone Project II (Implementation/Final Presentation)", description: "Final part of the capstone project" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "architecture",
    title: "BSc. Architecture",
    description: "Study of architectural design, building technology, and urban planning",
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "intro-to-architecture", title: "Introduction to Architecture", description: "Fundamentals of architectural principles and history" },
              { id: "architectural-drawing", title: "Architectural Drawing and Representation", description: "Basic drawing techniques and architectural representation" },
              { id: "architectural-history-1", title: "History of Architecture I", description: "Ancient and classical architecture" },
              { id: "building-materials", title: "Building Materials and Construction", description: "Properties and applications of building materials" },
              { id: "design-fundamentals", title: "Design Fundamentals", description: "Basic principles of design and composition" },
              { id: "communication-skills-arch", title: "Communication Skills", description: "Effective communication in architectural contexts" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "architectural-design-1", title: "Architectural Design Studio I", description: "Basic architectural design principles and studio work" },
              { id: "architectural-history-2", title: "History of Architecture II", description: "Medieval and Renaissance architecture" },
              { id: "building-science", title: "Building Science", description: "Physical principles affecting building performance" },
              { id: "digital-tools-arch", title: "Digital Tools for Architecture", description: "Computer-aided design and digital modeling" },
              { id: "structures-1", title: "Structures I", description: "Basic structural principles for architects" },
              { id: "university-elective-arch-1", title: "University Elective/General Education", description: "General education course" }
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
              { id: "architectural-design-2", title: "Architectural Design Studio II", description: "Intermediate architectural design and studio work" },
              { id: "architectural-history-3", title: "History of Architecture III", description: "Modern and contemporary architecture" },
              { id: "building-technology", title: "Building Technology", description: "Construction systems and building assemblies" },
              { id: "environmental-design", title: "Environmental Design", description: "Environmental considerations in architectural design" },
              { id: "structures-2", title: "Structures II", description: "Advanced structural principles for architects" },
              { id: "site-planning", title: "Site Planning and Landscape", description: "Site analysis and landscape design principles" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "architectural-design-3", title: "Architectural Design Studio III", description: "Advanced architectural design and studio work" },
              { id: "building-services", title: "Building Services", description: "Mechanical, electrical, and plumbing systems" },
              { id: "urban-design", title: "Urban Design", description: "Principles of urban design and planning" },
              { id: "architectural-theory", title: "Architectural Theory", description: "Theoretical foundations of architecture" },
              { id: "professional-practice-1", title: "Professional Practice I", description: "Introduction to architectural practice" },
              { id: "university-elective-arch-2", title: "University Elective/General Education", description: "General education course" }
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
              { id: "architectural-design-4", title: "Architectural Design Studio IV", description: "Complex architectural design projects" },
              { id: "building-codes", title: "Building Codes and Regulations", description: "Building codes and regulatory requirements" },
              { id: "sustainable-architecture", title: "Sustainable Architecture", description: "Green building and sustainable design principles" },
              { id: "interior-design", title: "Interior Design", description: "Principles of interior design and space planning" },
              { id: "architectural-project-1", title: "Architectural Project I", description: "Comprehensive architectural project" },
              { id: "technical-elective-arch-1", title: "Technical Elective I", description: "Specialized architectural topic" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "architectural-design-5", title: "Architectural Design Studio V", description: "Advanced architectural design with urban context" },
              { id: "construction-management-arch", title: "Construction Management", description: "Project management in construction" },
              { id: "heritage-conservation", title: "Heritage Conservation", description: "Preservation and restoration of historic buildings" },
              { id: "parametric-design", title: "Parametric Design", description: "Computational design and parametric modeling" },
              { id: "professional-practice-2", title: "Professional Practice II", description: "Advanced architectural practice" },
              { id: "technical-elective-arch-2", title: "Technical Elective II", description: "Specialized architectural topic" }
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
              { id: "architectural-design-6", title: "Architectural Design Studio VI", description: "Comprehensive architectural design thesis preparation" },
              { id: "research-methods-arch", title: "Research Methods in Architecture", description: "Research methodologies in architecture" },
              { id: "advanced-building-technology", title: "Advanced Building Technology", description: "Advanced construction systems and technologies" },
              { id: "urban-planning", title: "Urban Planning", description: "Comprehensive urban planning principles" },
              { id: "internship-arch", title: "Architectural Internship", description: "Practical experience in architectural practice" },
              { id: "technical-elective-arch-3", title: "Technical Elective III", description: "Specialized architectural topic" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "capstone-project-arch-1", title: "Capstone Project I (Research/Design)", description: "First part of the architectural thesis project" },
              { id: "advanced-architectural-theory", title: "Advanced Architectural Theory", description: "Contemporary architectural theory and criticism" },
              { id: "digital-fabrication", title: "Digital Fabrication", description: "Computer-aided manufacturing in architecture" },
              { id: "project-management-arch", title: "Project Management", description: "Management of architectural projects" },
              { id: "technical-elective-arch-4", title: "Technical Elective IV", description: "Specialized architectural topic" },
              { id: "capstone-project-arch-2", title: "Capstone Project II (Implementation/Final Presentation)", description: "Final part of the architectural thesis project" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "medicine",
    title: "MBBS Medicine",
    description: "Study of medical science, clinical practice, and patient care",
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "intro-to-medicine", title: "Introduction to Medicine", description: "Overview of medical profession and healthcare systems" },
              { id: "anatomy-1", title: "Anatomy I", description: "Gross anatomy of the human body" },
              { id: "physiology-1", title: "Physiology I", description: "Basic physiological principles" },
              { id: "biochemistry-1", title: "Biochemistry I", description: "Basic biochemical principles" },
              { id: "medical-ethics-1", title: "Medical Ethics and Professionalism", description: "Ethical principles in medical practice" },
              { id: "communication-skills-med", title: "Medical Communication Skills", description: "Patient communication and history taking" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "anatomy-2", title: "Anatomy II", description: "Advanced anatomy and histology" },
              { id: "physiology-2", title: "Physiology II", description: "Advanced physiological systems" },
              { id: "biochemistry-2", title: "Biochemistry II", description: "Advanced biochemical processes" },
              { id: "medical-statistics", title: "Medical Statistics and Epidemiology", description: "Statistical methods in medicine" },
              { id: "behavioral-sciences", title: "Behavioral Sciences", description: "Psychology and sociology in medicine" },
              { id: "university-elective-med-1", title: "University Elective/General Education", description: "General education course" }
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
              { id: "pathology-1", title: "Pathology I", description: "General pathology and disease mechanisms" },
              { id: "microbiology-1", title: "Microbiology I", description: "Basic microbiology and infectious diseases" },
              { id: "pharmacology-1", title: "Pharmacology I", description: "Basic pharmacological principles" },
              { id: "clinical-skills-1", title: "Clinical Skills I", description: "Basic clinical examination skills" },
              { id: "community-medicine-1", title: "Community Medicine I", description: "Public health and preventive medicine" },
              { id: "medical-research-1", title: "Medical Research Methods", description: "Research methodology in medicine" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "pathology-2", title: "Pathology II", description: "Systemic pathology" },
              { id: "microbiology-2", title: "Microbiology II", description: "Advanced microbiology and immunology" },
              { id: "pharmacology-2", title: "Pharmacology II", description: "Clinical pharmacology" },
              { id: "clinical-skills-2", title: "Clinical Skills II", description: "Advanced clinical examination skills" },
              { id: "community-medicine-2", title: "Community Medicine II", description: "Epidemiology and health promotion" },
              { id: "university-elective-med-2", title: "University Elective/General Education", description: "General education course" }
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
              { id: "internal-medicine-1", title: "Internal Medicine I", description: "Medical diagnosis and treatment" },
              { id: "surgery-1", title: "Surgery I", description: "Basic surgical principles and procedures" },
              { id: "pediatrics-1", title: "Pediatrics I", description: "Child health and development" },
              { id: "obstetrics-gynecology-1", title: "Obstetrics and Gynecology I", description: "Women's health and pregnancy" },
              { id: "psychiatry-1", title: "Psychiatry I", description: "Mental health and psychiatric disorders" },
              { id: "clinical-rotation-1", title: "Clinical Rotation I", description: "Hospital-based clinical training" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "internal-medicine-2", title: "Internal Medicine II", description: "Advanced medical diagnosis and treatment" },
              { id: "surgery-2", title: "Surgery II", description: "Advanced surgical procedures" },
              { id: "pediatrics-2", title: "Pediatrics II", description: "Advanced pediatric care" },
              { id: "obstetrics-gynecology-2", title: "Obstetrics and Gynecology II", description: "Advanced women's health care" },
              { id: "psychiatry-2", title: "Psychiatry II", description: "Advanced psychiatric care" },
              { id: "clinical-rotation-2", title: "Clinical Rotation II", description: "Advanced hospital-based clinical training" }
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
              { id: "emergency-medicine", title: "Emergency Medicine", description: "Emergency care and critical care medicine" },
              { id: "radiology", title: "Radiology", description: "Medical imaging and diagnostic radiology" },
              { id: "anesthesiology", title: "Anesthesiology", description: "Anesthesia and perioperative care" },
              { id: "dermatology", title: "Dermatology", description: "Skin diseases and dermatological conditions" },
              { id: "ophthalmology", title: "Ophthalmology", description: "Eye diseases and vision care" },
              { id: "clinical-rotation-3", title: "Clinical Rotation III", description: "Specialized clinical training" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "capstone-project-med-1", title: "Capstone Project I (Research/Design)", description: "First part of the medical research project" },
              { id: "medical-leadership", title: "Medical Leadership and Management", description: "Leadership in healthcare settings" },
              { id: "global-health", title: "Global Health", description: "International health issues and challenges" },
              { id: "medical-innovation", title: "Medical Innovation and Technology", description: "Emerging technologies in medicine" },
              { id: "clinical-rotation-4", title: "Clinical Rotation IV", description: "Final clinical training" },
              { id: "capstone-project-med-2", title: "Capstone Project II (Implementation/Final Presentation)", description: "Final part of the medical research project" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "law",
    title: "LLB Law",
    description: "Study of legal principles, jurisprudence, and legal practice",
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: [
              { id: "intro-to-law", title: "Introduction to Law", description: "Fundamentals of legal systems and jurisprudence" },
              { id: "constitutional-law-1", title: "Constitutional Law I", description: "Basic constitutional principles and rights" },
              { id: "contract-law-1", title: "Contract Law I", description: "Basic principles of contract formation and enforcement" },
              { id: "criminal-law-1", title: "Criminal Law I", description: "Basic criminal law principles and offenses" },
              { id: "legal-research", title: "Legal Research and Writing", description: "Legal research methods and writing skills" },
              { id: "communication-skills-law", title: "Legal Communication Skills", description: "Effective communication in legal contexts" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "constitutional-law-2", title: "Constitutional Law II", description: "Advanced constitutional law and judicial review" },
              { id: "contract-law-2", title: "Contract Law II", description: "Advanced contract law and remedies" },
              { id: "criminal-law-2", title: "Criminal Law II", description: "Advanced criminal law and defenses" },
              { id: "tort-law", title: "Tort Law", description: "Civil wrongs and personal injury law" },
              { id: "legal-systems", title: "Comparative Legal Systems", description: "Comparison of different legal systems" },
              { id: "university-elective-law-1", title: "University Elective/General Education", description: "General education course" }
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
              { id: "property-law", title: "Property Law", description: "Real and personal property law" },
              { id: "administrative-law", title: "Administrative Law", description: "Government regulation and administrative procedures" },
              { id: "evidence-law", title: "Evidence Law", description: "Rules of evidence in legal proceedings" },
              { id: "civil-procedure", title: "Civil Procedure", description: "Civil litigation procedures and rules" },
              { id: "criminal-procedure", title: "Criminal Procedure", description: "Criminal justice procedures and rights" },
              { id: "legal-ethics", title: "Legal Ethics and Professional Responsibility", description: "Ethical obligations of legal professionals" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "commercial-law", title: "Commercial Law", description: "Business and commercial transactions" },
              { id: "family-law", title: "Family Law", description: "Marriage, divorce, and family relationships" },
              { id: "labor-law", title: "Labor and Employment Law", description: "Employment relationships and workplace law" },
              { id: "international-law", title: "International Law", description: "International legal principles and treaties" },
              { id: "legal-theory", title: "Legal Theory and Jurisprudence", description: "Philosophical foundations of law" },
              { id: "university-elective-law-2", title: "University Elective/General Education", description: "General education course" }
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
              { id: "corporate-law", title: "Corporate Law", description: "Business organizations and corporate governance" },
              { id: "tax-law", title: "Tax Law", description: "Taxation principles and tax planning" },
              { id: "environmental-law", title: "Environmental Law", description: "Environmental protection and regulation" },
              { id: "human-rights-law", title: "Human Rights Law", description: "International and domestic human rights" },
              { id: "legal-project-1", title: "Legal Research Project I", description: "Comprehensive legal research project" },
              { id: "technical-elective-law-1", title: "Technical Elective I", description: "Specialized legal topic" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "intellectual-property", title: "Intellectual Property Law", description: "Patents, copyrights, and trademarks" },
              { id: "cyber-law", title: "Cyber Law and Technology", description: "Legal issues in technology and cyberspace" },
              { id: "alternative-dispute-resolution", title: "Alternative Dispute Resolution", description: "Mediation, arbitration, and negotiation" },
              { id: "legal-practice", title: "Legal Practice and Advocacy", description: "Practical legal skills and advocacy" },
              { id: "legal-project-2", title: "Legal Research Project II", description: "Advanced legal research project" },
              { id: "technical-elective-law-2", title: "Technical Elective II", description: "Specialized legal topic" }
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
              { id: "advanced-constitutional-law", title: "Advanced Constitutional Law", description: "Advanced constitutional issues and cases" },
              { id: "international-trade-law", title: "International Trade Law", description: "International trade and commerce law" },
              { id: "criminal-justice", title: "Criminal Justice and Reform", description: "Criminal justice system and reform" },
              { id: "research-methods-law", title: "Research Methods in Law", description: "Advanced legal research methodologies" },
              { id: "internship-law", title: "Legal Internship", description: "Practical experience in legal practice" },
              { id: "technical-elective-law-3", title: "Technical Elective III", description: "Specialized legal topic" }
            ]
          },
          {
            semester: 2,
            courses: [
              { id: "capstone-project-law-1", title: "Capstone Project I (Research/Design)", description: "First part of the legal research thesis" },
              { id: "legal-leadership", title: "Legal Leadership and Management", description: "Leadership in legal organizations" },
              { id: "global-law", title: "Global Law and Governance", description: "International legal governance" },
              { id: "legal-innovation", title: "Legal Innovation and Technology", description: "Technology in legal practice" },
              { id: "technical-elective-law-4", title: "Technical Elective IV", description: "Specialized legal topic" },
              { id: "capstone-project-law-2", title: "Capstone Project II (Implementation/Final Presentation)", description: "Final part of the legal research thesis" }
            ]
          }
        ]
      }
    ]
  }
];

module.exports = { additionalPrograms }; 