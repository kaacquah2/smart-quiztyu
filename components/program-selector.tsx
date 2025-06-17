"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor="program">Program</Label>
        <Select value={selectedProgram} onValueChange={onProgramChange}>
          <SelectTrigger id="program">
            <SelectValue placeholder="Select program" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="computer-science">BSc. Computer Science</SelectItem>
            <SelectItem value="electrical-engineering">BSc. Electrical and Electronic Engineering</SelectItem>
            <SelectItem value="business-admin">BSc. Business Administration</SelectItem>
            <SelectItem value="civil-engineering">BSc. Civil Engineering</SelectItem>
            <SelectItem value="nursing">BSc. Nursing</SelectItem>
            <SelectItem value="agriculture">BSc. Agriculture</SelectItem>
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
            <SelectItem value="1">Year 1</SelectItem>
            <SelectItem value="2">Year 2</SelectItem>
            <SelectItem value="3">Year 3</SelectItem>
            <SelectItem value="4">Year 4</SelectItem>
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
            <SelectItem value="1">Semester 1</SelectItem>
            <SelectItem value="2">Semester 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
