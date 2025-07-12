import { useState, useEffect, useMemo } from "react"
import { Check, ChevronsUpDown, BookOpen, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { Program } from "@/lib/program-service"

interface CourseAutocompleteProps {
  programs: Program[]
  onCourseSelect: (course: CourseSuggestion) => void
}

export interface CourseSuggestion {
  id: string
  title: string
  programId: string
  programTitle: string
  year: number
  semester: number
}

export const CourseAutocomplete: React.FC<CourseAutocompleteProps> = ({ programs, onCourseSelect }) => {
  const [search, setSearch] = useState("")

  // Flatten all courses for search
  const allCourses: CourseSuggestion[] = useMemo(() => {
    if (!programs || !Array.isArray(programs)) {
      return []
    }
    return programs.flatMap(program =>
      program.years.flatMap(year =>
        year.semesters.flatMap(semester =>
          semester.courses.map(course => ({
            id: course.id,
            title: course.title,
            programId: program.id,
            programTitle: program.title,
            year: year.year,
            semester: semester.semester,
          }))
        )
      )
    )
  }, [programs])

  // Filter courses by search
  const filteredCourses = useMemo(() => {
    const q = search.toLowerCase()
    return allCourses.filter(course =>
      course.title.toLowerCase().includes(q) ||
      course.programTitle.toLowerCase().includes(q)
    )
  }, [allCourses, search])

  return (
    <Command className="w-full max-w-xl mx-auto border rounded-md shadow-sm">
      <CommandInput
        placeholder="Search for a course..."
        value={search}
        onValueChange={setSearch}
        autoFocus
      />
      <CommandList>
        <CommandEmpty>No courses found.</CommandEmpty>
        <CommandGroup heading="Courses">
          {filteredCourses.map(course => (
            <CommandItem
              key={course.id + course.year + course.semester + course.programId}
              value={course.title}
              onSelect={() => onCourseSelect(course)}
              className="flex flex-col items-start gap-1 py-2"
            >
              <span className="font-medium flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                {course.title}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-2">
                <GraduationCap className="w-3 h-3" />
                {course.programTitle} &mdash; Year {course.year}, Semester {course.semester}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
} 