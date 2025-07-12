"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.programs = void 0;
exports.getProgramById = getProgramById;
exports.getCourseById = getCourseById;
exports.programs = [
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
                                id: "data-structures",
                                title: "Data Structures and Algorithms",
                                description: "Fundamental data structures and algorithm design",
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
                                id: "artificial-intelligence",
                                title: "Artificial Intelligence",
                                description: "Fundamentals of AI and intelligent systems",
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
                        semester: 2,
                        courses: [
                            {
                                id: "circuit-analysis",
                                title: "Circuit Analysis",
                                description: "Advanced analysis of electrical circuits",
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
                        ],
                    },
                ],
            },
        ],
    },
];
function getProgramById(id) {
    return exports.programs.find((program) => program.id === id);
}
function getCourseById(programId, courseId) {
    const program = getProgramById(programId);
    if (!program)
        return undefined;
    for (const year of program.years) {
        for (const semester of year.semesters) {
            const course = semester.courses.find((course) => course.id === courseId);
            if (course)
                return course;
        }
    }
    return undefined;
}
// Debug: Log the number of programs being exported
console.log(`🔍 DEBUG: program-data-simple.ts loaded with ${exports.programs.length} programs`);
exports.programs.forEach((program, index) => {
    console.log(`   Program ${index + 1}: ${program.title} (${program.id}) - ${program.years.length} years`);
    program.years.forEach(year => {
        console.log(`     Year ${year.year}: ${year.semesters.length} semesters`);
    });
});
