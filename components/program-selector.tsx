"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface Program {
  id: string
  title: string
  description: string
  years: Year[]
}

interface Year {
  id: string
  year: number
  semesters: Semester[]
}

interface Semester {
  id: string
  semester: number
  courses: Course[]
}

interface Course {
  id: string
  title: string
  description: string
}

interface ProgramSelectorProps {
  selectedProgram: string
  selectedYear: string
  selectedSemester: string
  onProgramChange: (value: string) => void
  onYearChange: (value: string) => void
  onSemesterChange: (value: string) => void
}

export function ProgramSelector({
  selectedProgram,
  selectedYear,
  selectedSemester,
  onProgramChange,
  onYearChange,
  onSemesterChange,
}: ProgramSelectorProps) {
  const { data: programs, error, isLoading } = useSWR<Program[]>("/api/programs", fetcher)

  if (error) return <div>Failed to load programs.</div>
  if (isLoading) return <div>Loading programs...</div>
  if (!programs) return <div>No programs available.</div>

  const currentProgram = programs.find(p => p.id === selectedProgram)
  const currentYear = currentProgram?.years.find(y => y.year.toString() === selectedYear)
  const currentSemester = currentYear?.semesters.find(s => s.semester.toString() === selectedSemester)

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor="program">Program</Label>
        <Select value={selectedProgram} onValueChange={onProgramChange}>
          <SelectTrigger id="program">
            <SelectValue placeholder="Select program" />
          </SelectTrigger>
          <SelectContent>
            {programs.map((program) => (
              <SelectItem key={program.id} value={program.id}>
                {program.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="year">Year</Label>
        <Select value={selectedYear} onValueChange={onYearChange}>
          <SelectTrigger id="year">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {currentProgram?.years.map((year) => (
              <SelectItem key={year.id} value={year.year.toString()}>
                Year {year.year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="semester">Semester</Label>
        <Select value={selectedSemester} onValueChange={onSemesterChange}>
          <SelectTrigger id="semester">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {currentYear?.semesters.map((semester) => (
              <SelectItem key={semester.id} value={semester.semester.toString()}>
                Semester {semester.semester}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
