import { Program } from '../types/program';

export const computerScienceProgram: Program = {
  "id": "computer-science",
  "title": "BSc. Computer Science",
  "description": "Study of computer systems, software development, and computational theory",
  "years": [
    {
      "year": 1,
      "semesters": [
        {
          "semester": 1,
          "courses": [
            {
              "id": "intro-programming",
              "title": "Introduction to Programming",
              "description": "Fundamentals of programming and problem solving"
            },
            {
              "id": "computer-architecture",
              "title": "Computer Architecture",
              "description": "Basic computer organization and architecture"
            },
            {
              "id": "mathematics-1",
              "title": "Mathematics for Computer Science I",
              "description": "Discrete mathematics and logic"
            }
          ]
        },
        {
          "semester": 2,
          "courses": [
            {
              "id": "data-structures",
              "title": "Data Structures and Algorithms",
              "description": "Fundamental data structures and algorithm analysis"
            },
            {
              "id": "object-oriented-programming",
              "title": "Object-Oriented Programming",
              "description": "Principles of OOP and software design"
            }
          ]
        }
      ]
    }
  ]
}; 