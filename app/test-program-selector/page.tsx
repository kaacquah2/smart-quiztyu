"use client"

import { useState } from "react"
import { ProgramSelector } from "@/components/program-selector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestProgramSelectorPage() {
  const [selectedProgram, setSelectedProgram] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Test Program Selector with PostgreSQL Data</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Program Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgramSelector
            selectedProgram={selectedProgram}
            selectedYear={selectedYear}
            selectedSemester={selectedSemester}
            onProgramChange={setSelectedProgram}
            onYearChange={setSelectedYear}
            onSemesterChange={setSelectedSemester}
          />
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Selected Values</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Program:</strong> {selectedProgram || "None selected"}</p>
            <p><strong>Year:</strong> {selectedYear || "None selected"}</p>
            <p><strong>Semester:</strong> {selectedSemester || "None selected"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 