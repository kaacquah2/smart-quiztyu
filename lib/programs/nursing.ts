import { Program } from '../types/program';

export const nursingProgram: Program = {
  "id": "nursing",
  "title": "BSc. Nursing",
  "description": "Study of nursing practice, patient care, and healthcare systems",
  "years": [
    {
      "year": 1,
      "semesters": [
        {
          "semester": 1,
          "courses": [
            {
              "id": "intro-nursing",
              "title": "Introduction to Nursing",
              "description": "Fundamentals of nursing practice and patient care"
            },
            {
              "id": "anatomy-physiology",
              "title": "Anatomy and Physiology",
              "description": "Human body structure and function"
            },
            {
              "id": "nursing-ethics",
              "title": "Nursing Ethics and Professional Practice",
              "description": "Ethical principles in nursing practice"
            }
          ]
        },
        {
          "semester": 2,
          "courses": [
            {
              "id": "health-assessment",
              "title": "Health Assessment",
              "description": "Patient assessment and health history taking"
            },
            {
              "id": "nursing-skills",
              "title": "Basic Nursing Skills",
              "description": "Fundamental nursing procedures and techniques"
            }
          ]
        }
      ]
    }
  ]
}; 