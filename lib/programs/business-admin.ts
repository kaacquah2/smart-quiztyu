import { Program } from '../types/program';

export const businessAdminProgram: Program = {
  "id": "business-admin",
  "title": "BSc. Business Administration",
  "description": "Study of business management, economics, and organizational leadership",
  "years": [
    {
      "year": 1,
      "semesters": [
        {
          "semester": 1,
          "courses": [
            {
              "id": "intro-business",
              "title": "Introduction to Business",
              "description": "Fundamentals of business operations and management"
            },
            {
              "id": "microeconomics",
              "title": "Microeconomics",
              "description": "Individual economic behavior and market structures"
            },
            {
              "id": "business-math",
              "title": "Business Mathematics",
              "description": "Mathematical applications in business"
            }
          ]
        },
        {
          "semester": 2,
          "courses": [
            {
              "id": "accounting-1",
              "title": "Financial Accounting",
              "description": "Basic accounting principles and financial statements"
            },
            {
              "id": "marketing-principles",
              "title": "Marketing Principles",
              "description": "Fundamentals of marketing and consumer behavior"
            }
          ]
        }
      ]
    }
  ]
}; 