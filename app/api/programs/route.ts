import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Add caching headers for better performance
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600'); // 5 minutes cache, 10 minutes stale

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
      },
      orderBy: {
        title: 'asc'
      }
    });

    // Validate that we have programs
    if (!programs || programs.length === 0) {
      return NextResponse.json([], {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      });
    }

    // Enhance programs with statistics
    const enhancedPrograms = await Promise.all(
      programs.map(async (program) => {
        try {
          // Get total quizzes for this program
          const totalQuizzes = program.years.reduce((yearSum, year) =>
            yearSum + year.semesters.reduce((semesterSum, semester) =>
              semesterSum + semester.courses.reduce((courseSum, course) =>
                courseSum + course.quizzes.length, 0), 0), 0
          );

          // Get total resources for this program
          const courseIds = program.years.flatMap(year =>
            year.semesters.flatMap(semester =>
              semester.courses.map(course => course.id)
            )
          );

          const totalResources = await prisma.resource.count({
            where: {
              courseIds: {
                hasSome: courseIds
              }
            }
          });

          // Get total submissions for this program
          const totalSubmissions = program.years.reduce((yearSum, year) =>
            yearSum + year.semesters.reduce((semesterSum, semester) =>
              semesterSum + semester.courses.reduce((courseSum, course) =>
                courseSum + course.quizzes.reduce((quizSum, quiz) =>
                  quizSum + quiz.submissions.length, 0), 0), 0), 0
          );

          return {
            ...program,
            statistics: {
              totalQuizzes,
              totalResources,
              totalSubmissions,
              enrolledStudents: program.users.length,
              totalCourses: courseIds.length
            }
          };
        } catch (error) {
          console.error(`Error processing program ${program.id}:`, error);
          // Return program with default statistics if processing fails
          return {
            ...program,
            statistics: {
              totalQuizzes: 0,
              totalResources: 0,
              totalSubmissions: 0,
              enrolledStudents: program.users.length,
              totalCourses: 0
            }
          };
        }
      })
    );

    return NextResponse.json(enhancedPrograms, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
    
    // Return a more detailed error response
    return NextResponse.json(
      { 
        error: 'Failed to fetch programs',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    );
  }
} 