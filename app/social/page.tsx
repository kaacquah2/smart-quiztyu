"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format, subDays, subHours } from "date-fns"
import {
  Award,
  BookOpen,
  Clock,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Search,
  Share2,
  Trophy,
  UserPlus,
  Users,
  Check,
} from "lucide-react"
import { UserAvatar } from "@/components/user-avatar"

// Sample users data
const usersData = [
  {
    id: "1",
    name: "Alex Johnson",
    username: "alexj",
    avatar: "/placeholder.svg?height=40&width=40",
    program: "Computer Science",
    year: 2,
    bio: "CS student passionate about AI and machine learning",
    stats: {
      quizzesTaken: 45,
      avgScore: 82,
      studyHours: 120,
      streak: 8,
    },
    badges: ["Quiz Master", "Study Streak", "Top Contributor"],
    isFollowing: true,
  },
  {
    id: "2",
    name: "Samantha Lee",
    username: "samlee",
    avatar: "/placeholder.svg?height=40&width=40",
    program: "Electrical Engineering",
    year: 3,
    bio: "EE student focusing on renewable energy systems",
    stats: {
      quizzesTaken: 38,
      avgScore: 88,
      studyHours: 150,
      streak: 12,
    },
    badges: ["Perfect Score", "Knowledge Sharer", "Early Adopter"],
    isFollowing: false,
  },
  {
    id: "3",
    name: "Michael Chen",
    username: "mchen",
    avatar: "/placeholder.svg?height=40&width=40",
    program: "Computer Science",
    year: 2,
    bio: "Full-stack developer and competitive programmer",
    stats: {
      quizzesTaken: 52,
      avgScore: 91,
      studyHours: 180,
      streak: 15,
    },
    badges: ["Quiz Master", "Top Scorer", "Consistency King"],
    isFollowing: true,
  },
  {
    id: "4",
    name: "Jessica Taylor",
    username: "jtaylor",
    avatar: "/placeholder.svg?height=40&width=40",
    program: "Business Administration",
    year: 3,
    bio: "Business student interested in entrepreneurship and marketing",
    stats: {
      quizzesTaken: 30,
      avgScore: 79,
      studyHours: 95,
      streak: 5,
    },
    badges: ["Team Player", "Quick Learner"],
    isFollowing: false,
  },
  {
    id: "5",
    name: "David Wilson",
    username: "dwilson",
    avatar: "/placeholder.svg?height=40&width=40",
    program: "Computer Science",
    year: 4,
    bio: "Senior CS student specializing in cybersecurity",
    stats: {
      quizzesTaken: 65,
      avgScore: 86,
      studyHours: 210,
      streak: 7,
    },
    badges: ["Security Expert", "Quiz Master", "Mentor"],
    isFollowing: true,
  },
]

// Sample activity feed data
const activityFeedData = [
  {
    id: "1",
    type: "quiz-completed",
    user: {
      id: "1",
      name: "Alex Johnson",
      username: "alexj",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: {
      quizTitle: "Data Structures and Algorithms",
      score: 92,
      totalQuestions: 10,
    },
    timestamp: subHours(new Date(), 2).toISOString(),
    likes: 12,
    comments: 3,
  },
  {
    id: "2",
    type: "achievement",
    user: {
      id: "3",
      name: "Michael Chen",
      username: "mchen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: {
      achievement: "Perfect Score",
      description: "Scored 100% on Advanced Algorithms quiz",
    },
    timestamp: subHours(new Date(), 5).toISOString(),
    likes: 24,
    comments: 7,
  },
  {
    id: "3",
    type: "study-milestone",
    user: {
      id: "2",
      name: "Samantha Lee",
      username: "samlee",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: {
      milestone: "100 Hours",
      description: "Reached 100 hours of study time",
    },
    timestamp: subHours(new Date(), 8).toISOString(),
    likes: 18,
    comments: 5,
  },
  {
    id: "4",
    type: "resource-shared",
    user: {
      id: "5",
      name: "David Wilson",
      username: "dwilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: {
      resourceTitle: "Introduction to Machine Learning",
      resourceType: "Video Course",
      resourceUrl: "https://example.com/ml-course",
    },
    timestamp: subHours(new Date(), 12).toISOString(),
    likes: 15,
    comments: 4,
  },
  {
    id: "5",
    type: "quiz-completed",
    user: {
      id: "4",
      name: "Jessica Taylor",
      username: "jtaylor",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: {
      quizTitle: "Marketing Fundamentals",
      score: 85,
      totalQuestions: 20,
    },
    timestamp: subHours(new Date(), 18).toISOString(),
    likes: 9,
    comments: 2,
  },
  {
    id: "6",
    type: "streak",
    user: {
      id: "3",
      name: "Michael Chen",
      username: "mchen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: {
      streak: 15,
      description: "15-day study streak! Keep it up!",
    },
    timestamp: subDays(new Date(), 1).toISOString(),
    likes: 22,
    comments: 6,
  },
  {
    id: "7",
    type: "quiz-completed",
    user: {
      id: "1",
      name: "Alex Johnson",
      username: "alexj",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: {
      quizTitle: "Web Development Fundamentals",
      score: 88,
      totalQuestions: 15,
    },
    timestamp: subDays(new Date(), 1).toISOString(),
    likes: 14,
    comments: 3,
  },
  {
    id: "8",
    type: "resource-shared",
    user: {
      id: "2",
      name: "Samantha Lee",
      username: "samlee",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: {
      resourceTitle: "Renewable Energy Systems: A Comprehensive Guide",
      resourceType: "E-Book",
      resourceUrl: "https://example.com/renewable-energy-ebook",
    },
    timestamp: subDays(new Date(), 2).toISOString(),
    likes: 11,
    comments: 2,
  },
]

// Sample leaderboard data
const leaderboardData = [
  {
    id: "1",
    rank: 1,
    user: {
      id: "3",
      name: "Michael Chen",
      username: "mchen",
      avatar: "/placeholder.svg?height=40&width=40",
      program: "Computer Science",
    },
    score: 2450,
    quizzesTaken: 52,
    avgScore: 91,
  },
  {
    id: "2",
    rank: 2,
    user: {
      id: "5",
      name: "David Wilson",
      username: "dwilson",
      avatar: "/placeholder.svg?height=40&width=40",
      program: "Computer Science",
    },
    score: 2320,
    quizzesTaken: 65,
    avgScore: 86,
  },
  {
    id: "3",
    rank: 3,
    user: {
      id: "2",
      name: "Samantha Lee",
      username: "samlee",
      avatar: "/placeholder.svg?height=40&width=40",
      program: "Electrical Engineering",
    },
    score: 2180,
    quizzesTaken: 38,
    avgScore: 88,
  },
  {
    id: "4",
    rank: 4,
    user: {
      id: "1",
      name: "Alex Johnson",
      username: "alexj",
      avatar: "/placeholder.svg?height=40&width=40",
      program: "Computer Science",
    },
    score: 1950,
    quizzesTaken: 45,
    avgScore: 82,
  },
  {
    id: "5",
    rank: 5,
    user: {
      id: "4",
      name: "Jessica Taylor",
      username: "jtaylor",
      avatar: "/placeholder.svg?height=40&width=40",
      program: "Business Administration",
    },
    score: 1680,
    quizzesTaken: 30,
    avgScore: 79,
  },
]

// Sample study groups data
const studyGroupsData = [
  {
    id: "1",
    name: "CS Algorithms Study Group",
    description: "Group for discussing and practicing algorithms and data structures",
    members: 28,
    category: "Computer Science",
    isJoined: true,
    avatar: "/placeholder.svg?height=40&width=40",
    recentActivity: "New discussion: Dynamic Programming Techniques",
  },
  {
    id: "2",
    name: "Web Development Club",
    description: "Learn and share web development knowledge and resources",
    members: 42,
    category: "Web Development",
    isJoined: false,
    avatar: "/placeholder.svg?height=40&width=40",
    recentActivity: "Upcoming event: React Workshop (May 25)",
  },
  {
    id: "3",
    name: "Machine Learning Enthusiasts",
    description: "Group for ML theory, practice, and project collaboration",
    members: 35,
    category: "Artificial Intelligence",
    isJoined: true,
    avatar: "/placeholder.svg?height=40&width=40",
    recentActivity: "New resource shared: TensorFlow Tutorial",
  },
  {
    id: "4",
    name: "Database Systems",
    description: "Study group for database design, SQL, and NoSQL systems",
    members: 19,
    category: "Databases",
    isJoined: false,
    avatar: "/placeholder.svg?height=40&width=40",
    recentActivity: "Quiz scheduled: SQL Fundamentals (May 22)",
  },
]

export default function SocialPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState(usersData)
  const [activityFeed, setActivityFeed] = useState(activityFeedData)
  const [leaderboard, setLeaderboard] = useState(leaderboardData)
  const [studyGroups, setStudyGroups] = useState(studyGroupsData)

  // Toggle follow status
  const toggleFollow = (userId: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user)))
  }

  // Toggle join status for study groups
  const toggleJoinGroup = (groupId: string) => {
    setStudyGroups(studyGroups.map((group) => (group.id === groupId ? { ...group, isJoined: !group.isJoined } : group)))
  }

  // Like an activity
  const likeActivity = (activityId: string) => {
    setActivityFeed(
      activityFeed.map((activity) =>
        activity.id === activityId ? { ...activity, likes: activity.likes + 1 } : activity,
      ),
    )
  }

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.program.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <DashboardHeader />
      <DashboardShell>
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Social Hub</h1>
            <p className="text-muted-foreground">Connect with classmates, join study groups, and track your progress</p>
          </div>

          <Tabs defaultValue="feed" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="feed">Activity Feed</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="groups">Study Groups</TabsTrigger>
              <TabsTrigger value="classmates">Find Classmates</TabsTrigger>
            </TabsList>

            {/* Activity Feed Tab */}
            <TabsContent value="feed" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {/* User Profile Card */}
                <Card className="md:col-span-1">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-4">
                      <UserAvatar user={{ name: "Your Profile" }} size="lg" />
                      <div>
                        <CardTitle>Your Profile</CardTitle>
                        <CardDescription>@username</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Quizzes Taken</span>
                        <span className="font-medium">32</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Average Score</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Study Hours</span>
                        <span className="font-medium">120</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Current Streak</span>
                        <span className="font-medium">5 days</span>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-sm font-medium mb-2">Your Badges</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" /> Quiz Master
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> 5-Day Streak
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Award className="h-3 w-3" /> Top 10%
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-sm font-medium mb-2">Friends</h3>
                      <div className="flex -space-x-2">
                        {users.slice(0, 5).map((user) => (
                          <UserAvatar
                            key={user.id}
                            user={{ name: user.name, image: user.avatar }}
                            size="sm"
                            className="border-2 border-background"
                          />
                        ))}
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs">
                          +12
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Full Profile
                    </Button>
                  </CardFooter>
                </Card>

                {/* Activity Feed */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Activity Feed</CardTitle>
                    <CardDescription>See what your classmates are up to</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-4">
                        {activityFeed.map((activity) => (
                          <ActivityCard
                            key={activity.id}
                            activity={activity}
                            onLike={() => likeActivity(activity.id)}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Leaderboard Tab */}
            <TabsContent value="leaderboard" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Students with the highest scores and engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboard.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                              entry.rank === 1
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                                : entry.rank === 2
                                  ? "bg-zinc-100 text-zinc-800 dark:bg-zinc-900/20 dark:text-zinc-300"
                                  : entry.rank === 3
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
                                    : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {entry.rank}
                          </div>
                          <UserAvatar user={{ name: entry.user.name, image: entry.user.avatar }} />
                          <div>
                            <p className="font-medium">{entry.user.name}</p>
                            <p className="text-sm text-muted-foreground">{entry.user.program}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium">{entry.score}</p>
                            <p className="text-xs text-muted-foreground">points</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{entry.avgScore}%</p>
                            <p className="text-xs text-muted-foreground">avg. score</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{entry.quizzesTaken}</p>
                            <p className="text-xs text-muted-foreground">quizzes</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Top by Program</CardTitle>
                    <CardDescription>Leaderboard by academic program</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="cs">
                      <TabsList className="w-full">
                        <TabsTrigger value="cs">Computer Science</TabsTrigger>
                        <TabsTrigger value="ee">Electrical Engineering</TabsTrigger>
                        <TabsTrigger value="ba">Business Admin</TabsTrigger>
                      </TabsList>
                      <div className="mt-4 space-y-4">
                        {leaderboard
                          .filter((entry) => entry.user.program === "Computer Science")
                          .map((entry) => (
                            <div key={entry.id} className="flex items-center justify-between rounded-lg border p-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                    entry.rank === 1
                                      ? "bg-yellow-100 text-yellow-800"
                                      : entry.rank === 2
                                        ? "bg-zinc-100 text-zinc-800"
                                        : entry.rank === 3
                                          ? "bg-amber-100 text-amber-800"
                                          : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {entry.rank}
                                </div>
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={entry.user.avatar || "/placeholder.svg"} alt={entry.user.name} />
                                  <AvatarFallback>{entry.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <p className="font-medium">{entry.user.name}</p>
                              </div>
                              <p className="font-medium">{entry.score} pts</p>
                            </div>
                          ))}
                      </div>
                    </Tabs>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Your Ranking</CardTitle>
                    <CardDescription>See where you stand compared to others</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold">
                            8
                          </div>
                          <UserAvatar user={{ name: "You" }} />
                          <div>
                            <p className="font-medium">You</p>
                            <p className="text-sm text-muted-foreground">Computer Science</p>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">1680</p>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Your Stats</h3>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Overall Ranking</span>
                            <span>8th of 124</span>
                          </div>
                          <Progress value={93.5} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Program Ranking</span>
                            <span>5th of 42</span>
                          </div>
                          <Progress value={88} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Year Ranking</span>
                            <span>3rd of 28</span>
                          </div>
                          <Progress value={89.3} className="h-2" />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4 bg-muted/50">
                      <h3 className="font-medium">How to Improve Your Ranking</h3>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4 text-primary" /> Take more quizzes
                        </li>
                        <li className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-primary" /> Improve your average score
                        </li>
                        <li className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-primary" /> Maintain your study streak
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Study Groups Tab */}
            <TabsContent value="groups" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Study Groups</CardTitle>
                    <CardDescription>Groups you've joined</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {studyGroups
                        .filter((group) => group.isJoined)
                        .map((group) => (
                          <StudyGroupCard key={group.id} group={group} onToggleJoin={() => toggleJoinGroup(group.id)} />
                        ))}
                      {studyGroups.filter((group) => group.isJoined).length === 0 && (
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                          <p className="mt-2 text-muted-foreground">You haven't joined any study groups yet.</p>
                          <Button variant="outline" className="mt-4">
                            Browse Groups
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Groups</CardTitle>
                    <CardDescription>Groups you might be interested in</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {studyGroups
                        .filter((group) => !group.isJoined)
                        .map((group) => (
                          <StudyGroupCard key={group.id} group={group} onToggleJoin={() => toggleJoinGroup(group.id)} />
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Create a Study Group</CardTitle>
                  <CardDescription>Start a new group for your course or topic</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="group-name">Group Name</label>
                      <Input id="group-name" placeholder="e.g., Calculus Study Group" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="group-category">Category</label>
                      <select id="group-category">
                        <option value="computer-science">Computer Science</option>
                        <option value="mathematics">Mathematics</option>
                        <option value="engineering">Engineering</option>
                        <option value="business">Business</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label htmlFor="group-description">Description</label>
                      <Input id="group-description" placeholder="Describe your study group" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Create Group</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Find Classmates Tab */}
            <TabsContent value="classmates" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Find Classmates</CardTitle>
                  <CardDescription>Connect with other students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by name, username, or program..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="space-y-4">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center gap-4">
                            <UserAvatar user={{ name: user.name, image: user.avatar }} />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">@{user.username}</p>
                              </div>
                              <p className="text-sm">
                                {user.program}, Year {user.year}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">{user.bio}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {user.badges.map((badge) => (
                                  <Badge key={badge} variant="outline" className="text-xs">
                                    {badge}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Button
                              variant={user.isFollowing ? "outline" : "default"}
                              size="sm"
                              className="gap-1"
                              onClick={() => toggleFollow(user.id)}
                            >
                              {user.isFollowing ? (
                                <>
                                  <Check className="h-4 w-4" /> Following
                                </>
                              ) : (
                                <>
                                  <UserPlus className="h-4 w-4" /> Follow
                                </>
                              )}
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">More options</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>Send Message</DropdownMenuItem>
                                <DropdownMenuItem>Block User</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No users found matching your search criteria.</p>
                        <Button variant="link" onClick={() => setSearchQuery("")}>
                          Clear search
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardShell>
    </>
  )
}

// Activity Card Component
function ActivityCard({ activity, onLike }: { activity: any; onLike: () => void }) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) {
      return `${diffMins}m ago`
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else if (diffDays < 7) {
      return `${diffDays}d ago`
    } else {
      return format(date, "MMM d, yyyy")
    }
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="flex gap-4">
        <UserAvatar user={{ name: activity.user.name, image: activity.user.avatar }} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="font-medium">{activity.user.name}</p>
              <p className="text-sm text-muted-foreground">@{activity.user.username}</p>
            </div>
            <p className="text-sm text-muted-foreground">{formatTime(activity.timestamp)}</p>
          </div>

          {activity.type === "quiz-completed" && (
            <div className="mt-2">
              <p>
                Completed the <span className="font-medium">{activity.content.quizTitle}</span> quiz with a score of{" "}
                <span className="font-medium">
                  {activity.content.score}/{activity.content.totalQuestions}
                </span>{" "}
                ({Math.round((activity.content.score / activity.content.totalQuestions) * 100)}%)
              </p>
            </div>
          )}

          {activity.type === "achievement" && (
            <div className="mt-2">
              <p>
                Earned the <span className="font-medium">{activity.content.achievement}</span> achievement!
              </p>
              <p className="text-sm text-muted-foreground mt-1">{activity.content.description}</p>
            </div>
          )}

          {activity.type === "study-milestone" && (
            <div className="mt-2">
              <p>
                Reached the <span className="font-medium">{activity.content.milestone}</span> milestone!
              </p>
              <p className="text-sm text-muted-foreground mt-1">{activity.content.description}</p>
            </div>
          )}

          {activity.type === "resource-shared" && (
            <div className="mt-2">
              <p>
                Shared a resource: <span className="font-medium">{activity.content.resourceTitle}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {activity.content.resourceType} -{" "}
                <a href={activity.content.resourceUrl} className="text-primary hover:underline">
                  View Resource
                </a>
              </p>
            </div>
          )}

          {activity.type === "streak" && (
            <div className="mt-2">
              <p>
                <span className="font-medium">{activity.content.streak}-Day Streak</span> {activity.content.description}
              </p>
            </div>
          )}

          <div className="flex items-center gap-4 mt-3">
            <Button variant="ghost" size="sm" className="gap-1 h-8 px-2" onClick={onLike}>
              <Heart className="h-4 w-4" />
              <span>{activity.likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 h-8 px-2">
              <MessageCircle className="h-4 w-4" />
              <span>{activity.comments}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 h-8 px-2">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Study Group Card Component
function StudyGroupCard({ group, onToggleJoin }: { group: any; onToggleJoin: () => void }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start gap-4">
        <UserAvatar user={{ name: group.name, image: group.avatar }} />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{group.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline">{group.category}</Badge>
                <p className="text-sm text-muted-foreground">{group.members} members</p>
              </div>
              {group.recentActivity && <p className="text-sm mt-2 text-primary">{group.recentActivity}</p>}
            </div>
            <Button variant={group.isJoined ? "outline" : "default"} size="sm" onClick={onToggleJoin}>
              {group.isJoined ? "Leave" : "Join"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
