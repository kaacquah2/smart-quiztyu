import { Program } from '../types/program';

export const electricalEngineeringProgram: Program = {
  "id": "electrical-engineering",
  "title": "BSc. Electrical Engineering",
  "description": "Study of electrical systems, electronics, and power engineering",
  "years": [
    {
      "year": 1,
      "semesters": [
        {
          "semester": 1,
          "courses": [
            {
              "id": "circuit-analysis",
              "title": "Circuit Analysis",
              "description": "Basic electrical circuit theory and analysis"
            },
            {
              "id": "engineering-mathematics",
              "title": "Engineering Mathematics",
              "description": "Mathematical foundations for engineering"
            },
            {
              "id": "physics-1",
              "title": "Physics for Engineers I",
              "description": "Mechanics and thermodynamics"
            }
          ]
        },
        {
          "semester": 2,
          "courses": [
            {
              "id": "electronics-1",
              "title": "Electronics I",
              "description": "Basic electronic components and circuits"
            },
            {
              "id": "digital-logic",
              "title": "Digital Logic Design",
              "description": "Digital circuits and logic design"
            }
          ]
        }
      ]
    }
  ]
}; 