"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { programs } from "@/lib/program-data"

export function TestDropdown() {
  const [selectedProgram, setSelectedProgram] = useState("computer-science")
  const [selectedYear, setSelectedYear] = useState("1")
  const [selectedSemester, setSelectedSemester] = useState("1")

  // Get current program data
  const currentProgram = programs.find(p => p.id === selectedProgram)
  const currentYear = currentProgram?.years.find(y => y.year.toString() === selectedYear)
  const currentSemester = currentYear?.semesters.find(s => s.semester.toString() === selectedSemester)

  return (
    <div className="p-4 space-y-4 border border-red-500">
      <h2 className="text-lg font-bold">Test Dropdowns with Real Data</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="test-program">Program</Label>
          <Select value={selectedProgram} onValueChange={setSelectedProgram}>
            <SelectTrigger>
              <SelectValue placeholder="Select program" />
            </SelectTrigger>
            <SelectContent>
              {programs && programs.length > 0 ? (
                programs.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.title}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading" disabled>
                  Loading programs...
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="test-year">Year</Label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {currentProgram && currentProgram.years.length > 0 ? (
                currentProgram.years.map((year) => (
                  <SelectItem key={year.year} value={year.year.toString()}>
                    Year {year.year}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading" disabled>
                  No years available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="test-semester">Semester</Label>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger>
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {currentYear && currentYear.semesters.length > 0 ? (
                currentYear.semesters.map((semester) => (
                  <SelectItem key={semester.semester} value={semester.semester.toString()}>
                    Semester {semester.semester}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading" disabled>
                  No semesters available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-3 bg-muted rounded-md">
        <p className="text-sm">
          <strong>Selected:</strong> Program: {selectedProgram}, Year: {selectedYear}, Semester: {selectedSemester}
        </p>
        <p className="text-sm">
          <strong>Data:</strong> Programs: {programs.length}, Current Program Years: {currentProgram?.years.length || 0}, Current Year Semesters: {currentYear?.semesters.length || 0}
        </p>
        <p className="text-sm">
          <strong>Courses:</strong> {currentSemester?.courses.length || 0} courses available
        </p>
      </div>

      <Button onClick={() => {
        console.log('Test dropdowns with real data - Current state:', { 
          selectedProgram, 
          selectedYear, 
          selectedSemester,
          programsCount: programs.length,
          currentProgram: currentProgram?.title,
          currentYear: currentYear?.year,
          currentSemester: currentSemester?.semester,
          coursesCount: currentSemester?.courses.length
        })
      }}>
        Log State
      </Button>
    </div>
  )
} 