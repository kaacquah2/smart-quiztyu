"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import useSWR from "swr"
import type { Program } from "@/lib/program-service"
import { ChevronDownIcon } from "@heroicons/react/24/outline"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function TestDropdown() {
  const { data: programs, error } = useSWR<Program[]>("/api/programs", fetcher)
  const [selectedProgram, setSelectedProgram] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("")

  if (error) return <div>Failed to load programs.</div>
  if (!programs) return <div>Loading programs...</div>

  const currentProgram = programs.find((p: any) => p.id === selectedProgram)
  const currentYear = currentProgram?.years.find((y: any) => y.year.toString() === selectedYear)
  const currentSemester = currentYear?.semesters.find((s: any) => s.semester.toString() === selectedSemester)

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
                programs.map((program: any) => (
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
                currentProgram.years.map((year: any) => (
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
                currentYear.semesters.map((semester: any) => (
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

      <Button onClick={() => {
        // No debug info or console.log
      }}>
        Log State
      </Button>
    </div>
  )
} 