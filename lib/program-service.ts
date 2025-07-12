import { prisma } from "./prisma"

export interface Program {
  id: string
  title: string
  description: string
  years: Year[]
  statistics?: {
    totalQuizzes: number
    totalResources: number
    totalSubmissions: number
    enrolledStudents: number
    totalCourses: number
  }
}

export interface Year {
  id: string
  year: number
  semesters: Semester[]
}

export interface Semester {
  id: string
  semester: number
  courses: Course[]
}

export interface Course {
  id: string
  title: string
  description?: string
}

export async function getAllPrograms(): Promise<Program[]> {
  try {
    const programs = await prisma.program.findMany({
      include: {
        years: {
          include: {
            semesters: {
              include: {
                courses: {
                  include: {
                    quizzes: {
                      include: {
                        submissions: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        users: true
      }
    })

    // Enhance programs with statistics
    const enhancedPrograms = await Promise.all(
      programs.map(async (program) => {
        // Get total quizzes for this program
        const totalQuizzes = program.years.reduce((yearSum, year) =>
          yearSum + year.semesters.reduce((semesterSum, semester) =>
            semesterSum + semester.courses.reduce((courseSum, course) =>
              courseSum + course.quizzes.length, 0), 0), 0
        )

        // Get total resources for this program
        const courseIds = program.years.flatMap(year =>
          year.semesters.flatMap(semester =>
            semester.courses.map(course => course.id)
          )
        )

        const totalResources = await prisma.resource.count({
          where: {
            courseIds: {
              hasSome: courseIds
            }
          }
        })

        // Get total submissions for this program
        const totalSubmissions = program.years.reduce((yearSum, year) =>
          yearSum + year.semesters.reduce((semesterSum, semester) =>
            semesterSum + semester.courses.reduce((courseSum, course) =>
              courseSum + course.quizzes.reduce((quizSum, quiz) =>
                quizSum + quiz.submissions.length, 0), 0), 0), 0
        )

        return {
          ...program,
          statistics: {
            totalQuizzes,
            totalResources,
            totalSubmissions,
            enrolledStudents: program.users.length,
            totalCourses: courseIds.length
          }
        }
      })
    )

    return enhancedPrograms
  } catch (error) {
    console.error('Error fetching programs:', error)
    throw new Error('Failed to fetch programs')
  }
}

export async function getProgramById(id: string): Promise<Program | null> {
  try {
    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        years: {
          include: {
            semesters: {
              include: {
                courses: {
                  include: {
                    quizzes: {
                      include: {
                        submissions: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        users: true
      }
    })

    if (!program) return null

    // Calculate statistics
    const totalQuizzes = program.years.reduce((yearSum, year) =>
      yearSum + year.semesters.reduce((semesterSum, semester) =>
        semesterSum + semester.courses.reduce((courseSum, course) =>
          courseSum + course.quizzes.length, 0), 0), 0
    )

    const courseIds = program.years.flatMap(year =>
      year.semesters.flatMap(semester =>
        semester.courses.map(course => course.id)
      )
    )

    const totalResources = await prisma.resource.count({
      where: {
        courseIds: {
          hasSome: courseIds
        }
      }
    })

    const totalSubmissions = program.years.reduce((yearSum, year) =>
      yearSum + year.semesters.reduce((semesterSum, semester) =>
        semesterSum + semester.courses.reduce((courseSum, course) =>
          courseSum + course.quizzes.reduce((quizSum, quiz) =>
            quizSum + quiz.submissions.length, 0), 0), 0), 0
    )

    return {
      ...program,
      statistics: {
        totalQuizzes,
        totalResources,
        totalSubmissions,
        enrolledStudents: program.users.length,
        totalCourses: courseIds.length
      }
    }
  } catch (error) {
    console.error('Error fetching program:', error)
    throw new Error('Failed to fetch program')
  }
}

export async function getCourseById(programId: string, courseId: string): Promise<Course | null> {
  try {
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        semester: {
          year: {
            programId: programId
          }
        }
      }
    })

    return course
  } catch (error) {
    console.error('Error fetching course:', error)
    throw new Error('Failed to fetch course')
  }
}

export async function getProgramsByCategory(): Promise<Record<string, Program[]>> {
  try {
    const programs = await getAllPrograms()
    
    // Dynamically categorize programs based on their properties
    const categories = {
      "science-tech": programs.filter(p => 
        p.title.toLowerCase().includes('computer') || 
        p.title.toLowerCase().includes('mathematics') || 
        p.title.toLowerCase().includes('physics') ||
        p.title.toLowerCase().includes('science')
      ),
      "engineering": programs.filter(p => 
        p.title.toLowerCase().includes('engineering') ||
        p.title.toLowerCase().includes('mechanical') ||
        p.title.toLowerCase().includes('electrical') ||
        p.title.toLowerCase().includes('civil') ||
        p.title.toLowerCase().includes('chemical')
      ),
      "humanities": programs.filter(p => 
        p.title.toLowerCase().includes('business') || 
        p.title.toLowerCase().includes('economics') || 
        p.title.toLowerCase().includes('sociology') ||
        p.title.toLowerCase().includes('law') ||
        p.title.toLowerCase().includes('arts')
      ),
      "health": programs.filter(p => 
        p.title.toLowerCase().includes('nursing') || 
        p.title.toLowerCase().includes('pharmacy') || 
        p.title.toLowerCase().includes('biomedical') ||
        p.title.toLowerCase().includes('medicine') ||
        p.title.toLowerCase().includes('health')
      ),
      "design": programs.filter(p => 
        p.title.toLowerCase().includes('architecture') ||
        p.title.toLowerCase().includes('design')
      )
    }

    return categories
  } catch (error) {
    console.error('Error categorizing programs:', error)
    throw new Error('Failed to categorize programs')
  }
} 