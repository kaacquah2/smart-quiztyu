"use client"

import { useState } from "react"
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
import { AlertCircle, CalendarIcon, Check, Clock, Edit, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

// Sample study sessions data
const initialStudySessions = [
  {
    id: "1",
    title: "Data Structures Review",
    description: "Review linked lists, trees, and graphs",
    date: addDays(new Date(), 1).toISOString(),
    startTime: "14:00",
    endTime: "16:00",
    course: "data-structures",
    priority: "high",
    completed: false,
    reminders: true,
  },
  {
    id: "2",
    title: "Algorithm Practice",
    description: "Solve 5 algorithm problems on sorting and searching",
    date: addDays(new Date(), 2).toISOString(),
    startTime: "10:00",
    endTime: "12:00",
    course: "algorithms",
    priority: "medium",
    completed: false,
    reminders: true,
  },
  {
    id: "3",
    title: "Database Concepts",
    description: "Study normalization and SQL queries",
    date: addDays(new Date(), 3).toISOString(),
    startTime: "16:00",
    endTime: "18:00",
    course: "database-systems",
    priority: "low",
    completed: false,
    reminders: false,
  },
  {
    id: "4",
    title: "Python Programming",
    description: "Practice object-oriented programming concepts",
    date: new Date().toISOString(),
    startTime: "19:00",
    endTime: "21:00",
    course: "intro-to-python",
    priority: "high",
    completed: false,
    reminders: true,
  },
  {
    id: "5",
    title: "Web Development",
    description: "Learn about React hooks and state management",
    date: addDays(new Date(), -1).toISOString(),
    startTime: "15:00",
    endTime: "17:00",
    course: "web-development",
    priority: "medium",
    completed: true,
    reminders: false,
  },
]

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
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [studySessions, setStudySessions] = useState(initialStudySessions)
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

  // Handle adding a new session
  const handleAddSession = () => {
    const id = Math.random().toString(36).substring(2, 9)
    setStudySessions([...studySessions, { ...newSession, id, completed: false }])
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
  }

  // Handle editing a session
  const handleEditSession = () => {
    if (!editingSession) return
    setStudySessions(studySessions.map((session) => (session.id === editingSession.id ? editingSession : session)))
    setIsEditDialogOpen(false)
    setEditingSession(null)
  }

  // Handle deleting a session
  const handleDeleteSession = (id: string) => {
    setStudySessions(studySessions.filter((session) => session.id !== id))
  }

  // Handle toggling session completion
  const handleToggleCompletion = (id: string) => {
    setStudySessions(
      studySessions.map((session) => (session.id === id ? { ...session, completed: !session.completed } : session)),
    )
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

  return (
    <>
      <DashboardHeader />
      <DashboardShell>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Study Scheduler</h1>
              <p className="text-muted-foreground">Plan and organize your study sessions</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <Plus className="h-4 w-4" /> Add Study Session
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
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSession} disabled={!newSession.title || !newSession.course}>
                    Add Session
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
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditSession}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
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
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Next Session</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingSessions > 0 ? (
                  <>
                    <div className="text-lg font-medium line-clamp-1">
                      {
                        studySessions
                          .filter((s) => !s.completed && new Date(s.date) >= new Date())
                          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]?.title
                      }
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(
                        parseISO(
                          studySessions
                            .filter((s) => !s.completed && new Date(s.date) >= new Date())
                            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]?.date,
                        ),
                        "PPP",
                      )}{" "}
                      at{" "}
                      {
                        studySessions
                          .filter((s) => !s.completed && new Date(s.date) >= new Date())
                          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]?.startTime
                      }
                    </p>
                  </>
                ) : (
                  <div className="text-muted-foreground">No upcoming sessions</div>
                )}
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
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
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
