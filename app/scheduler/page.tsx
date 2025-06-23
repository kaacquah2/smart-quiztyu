"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addDays, isSameDay, parseISO, isWithinInterval } from "date-fns"
import { AlertCircle, CalendarIcon, Check, Clock, Edit, Plus, Trash2, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { API_ROUTES } from "@/lib/routes"

// Sample courses data
const coursesData = [
  { id: "intro-to-cs", name: "Introduction to Computer Science" },
  { id: "data-structures", name: "Data Structures and Algorithms" },
  { id: "algorithms", name: "Advanced Algorithms" },
  { id: "database-systems", name: "Database Systems" },
  { id: "intro-to-python", name: "Introduction to Python" },
  { id: "web-development", name: "Web Development" },
  { id: "operating-systems", name: "Operating Systems" },
  { id: "computer-networks", name: "Computer Networks" },
  { id: "artificial-intelligence", name: "Artificial Intelligence" },
  { id: "machine-learning", name: "Machine Learning" },
]

// Priority colors
const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300",
  low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
}

export default function SchedulerPage() {
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [studySessions, setStudySessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalStudyDays: 0
  })
  const [newSession, setNewSession] = useState({
    title: "",
    description: "",
    date: new Date().toISOString(),
    startTime: "09:00",
    endTime: "10:00",
    course: "",
    priority: "medium",
    reminders: true,
  })
  const [editingSession, setEditingSession] = useState<any | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [view, setView] = useState<"day" | "week" | "month">("day")

  // Fetch sessions and streak data from API
  useEffect(() => {
    setLoading(true)
    setError(null)
    
    // Fetch sessions
    const fetchSessions = fetch(API_ROUTES.SESSIONS)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load sessions")
        return res.json()
      })
    
    // Fetch streak data
    const fetchStreak = fetch(API_ROUTES.SESSIONS_STREAK)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load streak data")
        return res.json()
      })
    
    Promise.all([fetchSessions, fetchStreak])
      .then(([sessionsData, streakData]) => {
        setStudySessions(sessionsData)
        setStreakData(streakData)
        setLoading(false)
      })
      .catch(err => {
        setError("Failed to load data. Please try again.")
        setLoading(false)
        toast({
          title: "Error",
          description: "Failed to load study data.",
          variant: "destructive",
        })
      })
  }, [toast])

  // Get sessions for the selected date
  const getSessionsForDate = (date: Date | undefined) => {
    if (!date) return []
    return studySessions.filter((session) => {
      const sessionDate = parseISO(session.date)
      return isSameDay(sessionDate, date)
    })
  }

  // Get sessions for the selected week
  const getSessionsForWeek = (date: Date | undefined) => {
    if (!date) return []
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay()) // Start from Sunday
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6) // End on Saturday

    return studySessions.filter((session) => {
      const sessionDate = parseISO(session.date)
      return isWithinInterval(sessionDate, { start: startOfWeek, end: endOfWeek })
    })
  }

  // Get sessions for the selected month
  const getSessionsForMonth = (date: Date | undefined) => {
    if (!date) return []
    const year = date.getFullYear()
    const month = date.getMonth()

    return studySessions.filter((session) => {
      const sessionDate = parseISO(session.date)
      return sessionDate.getFullYear() === year && sessionDate.getMonth() === month
    })
  }

  // Get dates with sessions for calendar highlighting
  const getDatesWithSessions = () => {
    const dates = new Set<string>()
    studySessions.forEach(session => {
      dates.add(new Date(session.date).toISOString().split('T')[0])
    })
    return Array.from(dates).map(date => new Date(date))
  }

  // Handle calendar date click for quick add
  const handleCalendarDateClick = (selectedDate: Date | undefined) => {
    if (!selectedDate) return
    setDate(selectedDate)
    setNewSession(prev => ({
      ...prev,
      date: selectedDate.toISOString()
    }))
    setIsAddDialogOpen(true)
  }

  // Add session
  const handleAddSession = async () => {
    setActionLoading(true)
    setError(null)
    try {
      const res = await fetch(API_ROUTES.SESSIONS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSession),
      })
      if (!res.ok) throw new Error("Failed to add session")
      const session = await res.json()
      setStudySessions(prev => [...prev, session])
      setNewSession({
        title: "",
        description: "",
        date: new Date().toISOString(),
        startTime: "09:00",
        endTime: "10:00",
        course: "",
        priority: "medium",
        reminders: true,
      })
      setIsAddDialogOpen(false)
      toast({
        title: "Success",
        description: "Study session added successfully!",
      })
    } catch (e) {
      setError("Failed to add session.")
      toast({
        title: "Error",
        description: "Failed to add study session. Please try again.",
        variant: "destructive",
      })
    }
    setActionLoading(false)
  }

  // Edit session
  const handleEditSession = async () => {
    if (!editingSession) return
    setActionLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_ROUTES.SESSIONS}/${editingSession.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSession),
      })
      if (!res.ok) throw new Error("Failed to update session")
      const updated = await res.json()
      setStudySessions(prev => prev.map(s => s.id === updated.id ? updated : s))
      setIsEditDialogOpen(false)
      setEditingSession(null)
      toast({
        title: "Success",
        description: "Study session updated successfully!",
      })
    } catch (e) {
      setError("Failed to update session.")
      toast({
        title: "Error",
        description: "Failed to update study session. Please try again.",
        variant: "destructive",
      })
    }
    setActionLoading(false)
  }

  // Delete session
  const handleDeleteSession = async (id: string) => {
    setActionLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_ROUTES.SESSIONS}/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete session")
      setStudySessions(prev => prev.filter(s => s.id !== id))
      toast({
        title: "Success",
        description: "Study session deleted successfully!",
      })
    } catch (e) {
      setError("Failed to delete session.")
      toast({
        title: "Error",
        description: "Failed to delete study session. Please try again.",
        variant: "destructive",
      })
    }
    setActionLoading(false)
  }

  // Toggle completion
  const handleToggleCompletion = async (id: string) => {
    const session = studySessions.find(s => s.id === id)
    if (!session) return
    setActionLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_ROUTES.SESSIONS}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...session, completed: !session.completed }),
      })
      if (!res.ok) throw new Error("Failed to update session")
      const updated = await res.json()
      setStudySessions(prev => prev.map(s => s.id === updated.id ? updated : s))
      toast({
        title: "Success",
        description: `Session marked as ${updated.completed ? "completed" : "incomplete"}!`,
      })
    } catch (e) {
      setError("Failed to update session.")
      toast({
        title: "Error",
        description: "Failed to update study session. Please try again.",
        variant: "destructive",
      })
    }
    setActionLoading(false)
  }

  // Calculate study stats
  const totalSessions = studySessions.length
  const completedSessions = studySessions.filter((session) => session.completed).length
  const upcomingSessions = studySessions.filter(
    (session) => !session.completed && new Date(session.date) >= new Date(),
  ).length
  const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0

  // Calculate total study hours this week
  const thisWeekSessions = getSessionsForWeek(new Date())
  const totalHoursThisWeek = thisWeekSessions.reduce((total, session) => {
    const startHour = Number.parseInt(session.startTime.split(":")[0])
    const startMinute = Number.parseInt(session.startTime.split(":")[1])
    const endHour = Number.parseInt(session.endTime.split(":")[0])
    const endMinute = Number.parseInt(session.endTime.split(":")[1])

    const startDate = new Date()
    startDate.setHours(startHour, startMinute, 0)

    const endDate = new Date()
    endDate.setHours(endHour, endMinute, 0)

    const durationMs = endDate.getTime() - startDate.getTime()
    const durationHours = durationMs / (1000 * 60 * 60)

    return total + durationHours
  }, 0)

  // Calculate study hours by course
  const studyHoursByCourse: Record<string, number> = studySessions.reduce((acc, session) => {
    if (!session.completed) return acc
    
    const startHour = Number.parseInt(session.startTime.split(":")[0])
    const startMinute = Number.parseInt(session.startTime.split(":")[1])
    const endHour = Number.parseInt(session.endTime.split(":")[0])
    const endMinute = Number.parseInt(session.endTime.split(":")[1])

    const startDate = new Date()
    startDate.setHours(startHour, startMinute, 0)
    const endDate = new Date()
    endDate.setHours(endHour, endMinute, 0)

    const durationMs = endDate.getTime() - startDate.getTime()
    const durationHours = durationMs / (1000 * 60 * 60)

    const courseName = coursesData.find(c => c.id === session.course)?.name || session.course
    acc[courseName] = (acc[courseName] || 0) + durationHours
    
    return acc
  }, {} as Record<string, number>)

  // Calculate weekly progress
  const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const daySessions = getSessionsForDate(date)
    const completedCount = daySessions.filter(s => s.completed).length
    const totalCount = daySessions.length
    
    return {
      date: date.toISOString().split('T')[0],
      completed: completedCount,
      total: totalCount,
      percentage: totalCount > 0 ? (completedCount / totalCount) * 100 : 0
    }
  }).reverse()

  return (
    <>
      <DashboardHeader />
      <DashboardShell>
        <div className="flex flex-col gap-8">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Study Scheduler</h1>
              <p className="text-muted-foreground">Plan and organize your study sessions</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1" disabled={actionLoading}>
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Add Study Session
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Study Session</DialogTitle>
                  <DialogDescription>Create a new study session for your schedule.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newSession.title}
                      onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                      placeholder="e.g., Data Structures Review"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={newSession.description}
                      onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                      placeholder="What will you study in this session?"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newSession.date ? format(parseISO(newSession.date), "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={parseISO(newSession.date)}
                            onSelect={(date) =>
                              setNewSession({ ...newSession, date: date?.toISOString() || new Date().toISOString() })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="course">Course</Label>
                      <Select
                        value={newSession.course}
                        onValueChange={(value) => setNewSession({ ...newSession, course: value })}
                      >
                        <SelectTrigger id="course">
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {coursesData.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={newSession.startTime}
                        onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={newSession.endTime}
                        onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newSession.priority}
                        onValueChange={(value) => setNewSession({ ...newSession, priority: value })}
                      >
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="reminders" className="mb-1">
                        Reminders
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="reminders"
                          checked={newSession.reminders}
                          onCheckedChange={(checked) => setNewSession({ ...newSession, reminders: checked })}
                        />
                        <Label htmlFor="reminders">Enable notifications</Label>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={actionLoading}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleAddSession()} disabled={!newSession.title || !newSession.course || actionLoading}>
                    {actionLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Session"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Study Session</DialogTitle>
                  <DialogDescription>Update your study session details.</DialogDescription>
                </DialogHeader>
                {editingSession && (
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-title">Title</Label>
                      <Input
                        id="edit-title"
                        value={editingSession.title}
                        onChange={(e) => setEditingSession({ ...editingSession, title: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-description">Description (Optional)</Label>
                      <Textarea
                        id="edit-description"
                        value={editingSession.description}
                        onChange={(e) => setEditingSession({ ...editingSession, description: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label>Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {editingSession.date ? format(parseISO(editingSession.date), "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={parseISO(editingSession.date)}
                              onSelect={(date) =>
                                setEditingSession({
                                  ...editingSession,
                                  date: date?.toISOString() || new Date().toISOString(),
                                })
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-course">Course</Label>
                        <Select
                          value={editingSession.course}
                          onValueChange={(value) => setEditingSession({ ...editingSession, course: value })}
                        >
                          <SelectTrigger id="edit-course">
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                          <SelectContent>
                            {coursesData.map((course) => (
                              <SelectItem key={course.id} value={course.id}>
                                {course.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-startTime">Start Time</Label>
                        <Input
                          id="edit-startTime"
                          type="time"
                          value={editingSession.startTime}
                          onChange={(e) => setEditingSession({ ...editingSession, startTime: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-endTime">End Time</Label>
                        <Input
                          id="edit-endTime"
                          type="time"
                          value={editingSession.endTime}
                          onChange={(e) => setEditingSession({ ...editingSession, endTime: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-priority">Priority</Label>
                        <Select
                          value={editingSession.priority}
                          onValueChange={(value) => setEditingSession({ ...editingSession, priority: value })}
                        >
                          <SelectTrigger id="edit-priority">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-reminders" className="mb-1">
                          Reminders
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="edit-reminders"
                            checked={editingSession.reminders}
                            onCheckedChange={(checked) => setEditingSession({ ...editingSession, reminders: checked })}
                          />
                          <Label htmlFor="edit-reminders">Enable notifications</Label>
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-completed" className="mb-1">
                        Status
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="edit-completed"
                          checked={editingSession.completed}
                          onCheckedChange={(checked) => setEditingSession({ ...editingSession, completed: checked })}
                        />
                        <Label htmlFor="edit-completed">Mark as completed</Label>
                      </div>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={actionLoading}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleEditSession()} disabled={actionLoading}>
                    {actionLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-muted-foreground">Loading study sessions...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Enhanced Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Study Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalSessions}</div>
                    <p className="text-xs text-muted-foreground">
                      {upcomingSessions} upcoming, {completedSessions} completed
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{streakData.currentStreak} days</div>
                    <p className="text-xs text-muted-foreground">
                      Longest: {streakData.longestStreak} days
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{completionRate}%</div>
                    <div className="mt-2">
                      <Progress value={completionRate} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Study Hours This Week</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalHoursThisWeek.toFixed(1)} hours</div>
                    <p className="text-xs text-muted-foreground">Across {thisWeekSessions.length} study sessions</p>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Analytics */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Study Hours by Course</CardTitle>
                    <CardDescription>Breakdown of completed study time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(Object.entries(studyHoursByCourse) as [string, number][])
                        .sort(([,a], [,b]) => b - a)
                        .map(([course, hours]) => (
                          <div key={course} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{course}</span>
                            <span className="text-sm text-muted-foreground">{hours.toFixed(1)} hours</span>
                          </div>
                        ))}
                      {Object.keys(studyHoursByCourse).length === 0 && (
                        <p className="text-sm text-muted-foreground">No completed sessions yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Progress</CardTitle>
                    <CardDescription>Daily completion rates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {weeklyProgress.map((day) => (
                        <div key={day.date} className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {format(new Date(day.date), 'EEE')}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {day.completed}/{day.total}
                            </span>
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="bg-primary h-full rounded-full transition-all"
                                style={{ width: `${day.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Calendar and Sessions */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Calendar</CardTitle>
                    <CardDescription>Select a date to view sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar 
                      mode="single" 
                      selected={date} 
                      onSelect={handleCalendarDateClick}
                      modifiers={{
                        hasSessions: getDatesWithSessions()
                      }}
                      modifiersStyles={{
                        hasSessions: {
                          backgroundColor: "hsl(var(--primary) / 0.1)",
                          color: "hsl(var(--primary))",
                          fontWeight: "bold"
                        }
                      }}
                      className="rounded-md border" 
                    />
                    <div className="mt-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary/10 border border-primary"></div>
                        <span>Days with sessions</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle>Study Sessions</CardTitle>
                      <CardDescription>{date ? format(date, "MMMM d, yyyy") : "Select a date"}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant={view === "day" ? "default" : "outline"} size="sm" onClick={() => setView("day")}>
                        Day
                      </Button>
                      <Button variant={view === "week" ? "default" : "outline"} size="sm" onClick={() => setView("week")}>
                        Week
                      </Button>
                      <Button variant={view === "month" ? "default" : "outline"} size="sm" onClick={() => setView("month")}>
                        Month
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="upcoming" className="space-y-4">
                      <TabsList>
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                        <TabsTrigger value="all">All</TabsTrigger>
                      </TabsList>

                      <TabsContent value="upcoming" className="space-y-4">
                        {(() => {
                          let sessions
                          if (view === "day") sessions = getSessionsForDate(date)
                          else if (view === "week") sessions = getSessionsForWeek(date)
                          else sessions = getSessionsForMonth(date)

                          const upcomingSessions = sessions.filter((s) => !s.completed)

                          return upcomingSessions.length > 0 ? (
                            upcomingSessions.map((session) => (
                              <SessionCard
                                key={session.id}
                                session={session}
                                onDelete={handleDeleteSession}
                                onToggleCompletion={handleToggleCompletion}
                                onEdit={(session) => {
                                  setEditingSession(session)
                                  setIsEditDialogOpen(true)
                                }}
                                coursesData={coursesData}
                              />
                            ))
                          ) : (
                            <Alert>
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>No upcoming sessions</AlertTitle>
                              <AlertDescription>
                                {view === "day"
                                  ? "No upcoming study sessions for this day."
                                  : view === "week"
                                    ? "No upcoming study sessions for this week."
                                    : "No upcoming study sessions for this month."}
                              </AlertDescription>
                            </Alert>
                          )
                        })()}
                      </TabsContent>

                      <TabsContent value="completed" className="space-y-4">
                        {(() => {
                          let sessions
                          if (view === "day") sessions = getSessionsForDate(date)
                          else if (view === "week") sessions = getSessionsForWeek(date)
                          else sessions = getSessionsForMonth(date)

                          const completedSessions = sessions.filter((s) => s.completed)

                          return completedSessions.length > 0 ? (
                            completedSessions.map((session) => (
                              <SessionCard
                                key={session.id}
                                session={session}
                                onDelete={handleDeleteSession}
                                onToggleCompletion={handleToggleCompletion}
                                onEdit={(session) => {
                                  setEditingSession(session)
                                  setIsEditDialogOpen(true)
                                }}
                                coursesData={coursesData}
                              />
                            ))
                          ) : (
                            <Alert>
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>No completed sessions</AlertTitle>
                              <AlertDescription>
                                {view === "day"
                                  ? "No completed study sessions for this day."
                                  : view === "week"
                                    ? "No completed study sessions for this week."
                                    : "No completed study sessions for this month."}
                              </AlertDescription>
                            </Alert>
                          )
                        })()}
                      </TabsContent>

                      <TabsContent value="all" className="space-y-4">
                        {(() => {
                          let sessions
                          if (view === "day") sessions = getSessionsForDate(date)
                          else if (view === "week") sessions = getSessionsForWeek(date)
                          else sessions = getSessionsForMonth(date)

                          return sessions.length > 0 ? (
                            sessions.map((session) => (
                              <SessionCard
                                key={session.id}
                                session={session}
                                onDelete={handleDeleteSession}
                                onToggleCompletion={handleToggleCompletion}
                                onEdit={(session) => {
                                  setEditingSession(session)
                                  setIsEditDialogOpen(true)
                                }}
                                coursesData={coursesData}
                              />
                            ))
                          ) : (
                            <Alert>
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>No sessions found</AlertTitle>
                              <AlertDescription>
                                {view === "day"
                                  ? "No study sessions for this day."
                                  : view === "week"
                                    ? "No study sessions for this week."
                                    : "No study sessions for this month."}
                              </AlertDescription>
                            </Alert>
                          )
                        })()}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Study Goals */}
              <Card>
                <CardHeader>
                  <CardTitle>Study Goals</CardTitle>
                  <CardDescription>Track your progress towards your study goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Complete Data Structures Course</h3>
                          <p className="text-sm text-muted-foreground mt-1">Finish all lectures and practice problems</p>
                        </div>
                        <Badge variant="outline" className={priorityColors.high}>
                          High Priority
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>65%</span>
                        </div>
                        <div className="h-2 mt-1 bg-muted rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: "65%" }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Study 20 Hours This Week</h3>
                          <p className="text-sm text-muted-foreground mt-1">Maintain consistent study schedule</p>
                        </div>
                        <Badge variant="outline" className={priorityColors.medium}>
                          Medium Priority
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{totalHoursThisWeek.toFixed(1)}/20 hours</span>
                        </div>
                        <div className="h-2 mt-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${(totalHoursThisWeek / 20) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Complete 10 Practice Exams</h3>
                          <p className="text-sm text-muted-foreground mt-1">Prepare for final exams with practice tests</p>
                        </div>
                        <Badge variant="outline" className={priorityColors.low}>
                          Low Priority
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>3/10 completed</span>
                        </div>
                        <div className="h-2 mt-1 bg-muted rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: "30%" }}></div>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" /> Add New Goal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DashboardShell>
    </>
  )
}

// Session Card Component
function SessionCard({
  session,
  onDelete,
  onToggleCompletion,
  onEdit,
  coursesData,
}: {
  session: any
  onDelete: (id: string) => void
  onToggleCompletion: (id: string) => void
  onEdit: (session: any) => void
  coursesData: any[]
}) {
  const courseName = coursesData.find((course) => course.id === session.course)?.name || session.course

  return (
    <div className={`rounded-lg border p-4 ${session.completed ? "bg-muted/50" : ""}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={`h-5 w-5 rounded-full ${session.completed ? "bg-primary text-primary-foreground" : "border"}`}
            onClick={() => onToggleCompletion(session.id)}
          >
            {session.completed && <Check className="h-3 w-3" />}
            <span className="sr-only">{session.completed ? "Mark as incomplete" : "Mark as complete"}</span>
          </Button>
          <div>
            <h3 className={`font-medium ${session.completed ? "line-through text-muted-foreground" : ""}`}>
              {session.title}
            </h3>
            {session.description && <p className="text-sm text-muted-foreground mt-1">{session.description}</p>}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline" className={priorityColors[session.priority]}>
                {session.priority.charAt(0).toUpperCase() + session.priority.slice(1)}
              </Badge>
              <Badge variant="outline">{courseName}</Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {session.startTime} - {session.endTime}
              </div>
              <div className="text-xs text-muted-foreground">{format(parseISO(session.date), "MMM d, yyyy")}</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(session)}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(session.id)}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
