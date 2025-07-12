export interface Course {
  id: string
  title: string
  description: string
}

export interface Semester {
  semester: number
  courses: Course[]
}

export interface Year {
  year: number
  semesters: Semester[]
}

export interface Program {
  id: string
  title: string
  description: string
  years: Year[]
} 