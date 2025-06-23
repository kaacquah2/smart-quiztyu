"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Bell, 
  Heart, 
  MessageCircle, 
  Users, 
  Trophy, 
  BookOpen, 
  Sparkles, 
  X,
  UserPlus,
  UserMinus,
  AlertCircle,
  MapPin,
  Globe,
  Filter
} from "lucide-react"
import { format, subHours, subDays } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserAvatar } from "@/components/user-avatar"
import { useUserProfile } from "@/hooks/use-user-profile"
import { useUsers } from "@/hooks/use-users"
import { useSocial } from "@/hooks/use-social"
import { useOffline } from "@/hooks/use-offline"

export default function SocialPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [showNotifications, setShowNotifications] = useState(false)
  
  // Location-based filtering state
  const [locationSearch, setLocationSearch] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<string>("all")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [showLocationFilters, setShowLocationFilters] = useState(false)
  
  // Use real social data
  const { 
    activities, 
    leaderboard, 
    studyGroups, 
    loading, 
    error, 
    refreshData, 
    likeActivity, 
    createActivity, 
    toggleJoinGroup 
  } = useSocial(selectedFilter)

  // Use offline functionality
  const { isOnline, pendingCount } = useOffline()
  
  const { userProfile } = useUserProfile()
  
  // Use location-based filters for users
  const userFilters = {
    location: locationSearch || undefined,
    country: selectedCountry !== "all" ? selectedCountry : undefined,
    region: selectedRegion !== "all" ? selectedRegion : undefined,
    program: selectedFilter !== "all" ? selectedFilter : undefined,
  }
  
  const { users, loading: usersLoading, error: usersError, toggleFollow, refreshUsers } = useUsers(userFilters)

  // Mark activity as read
  const markActivityAsRead = (activityId: string) => {
    // This would typically update the activity in the database
    console.log("Marking activity as read:", activityId)
  }

  // Filter users based on search query (client-side filtering for name/username)
  const filteredUsers = (users || []).filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.program.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get new activities count
  const newActivities = activities.filter(activity => activity.isNew).length

  // Get unique countries and regions from users for filter options
  const uniqueCountries = Array.from(new Set((users || []).map(user => user.location.country).filter(Boolean))).filter((country): country is string => country !== null && country !== undefined)
  const uniqueRegions = Array.from(new Set((users || []).map(user => user.location.region).filter(Boolean))).filter((region): region is string => region !== null && region !== undefined)

  // Format location display
  const formatLocation = (user: any) => {
    const parts = []
    if (user.location.city) parts.push(user.location.city)
    if (user.location.region) parts.push(user.location.region)
    if (user.location.country) parts.push(user.location.country)
    return parts.length > 0 ? parts.join(", ") : "Location not specified"
  }

  if (loading) {
    return (
      <>
        <DashboardHeader />
        <DashboardShell>
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Social Learning</h1>
                <p className="text-muted-foreground">Connect with classmates and track your progress together</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 w-full bg-muted animate-pulse rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DashboardShell>
      </>
    )
  }

  if (error) {
    return (
      <>
        <DashboardHeader />
        <DashboardShell>
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h2 className="text-2xl font-bold">Error Loading Social Data</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={refreshData}>Try Again</Button>
          </div>
        </DashboardShell>
      </>
    )
  }

  return (
    <>
      <DashboardHeader />
      <DashboardShell>
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Social Learning</h1>
              <p className="text-muted-foreground">Connect with classmates and track your progress together</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowNotifications(true)}
                className="relative"
              >
                <Bell className="h-4 w-4" />
                {newActivities > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    {newActivities}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Offline Status Indicator */}
          {!isOnline && (
            <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    You're currently offline. Social features will sync when connection is restored.
                    {pendingCount > 0 && ` (${pendingCount} items pending sync)`}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="feed" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 p-2">
              <TabsTrigger value="feed" className="px-4 py-2">Activity Feed</TabsTrigger>
              <TabsTrigger value="leaderboard" className="px-4 py-2">Leaderboard</TabsTrigger>
              <TabsTrigger value="groups" className="px-4 py-2">Study Groups</TabsTrigger>
              <TabsTrigger value="users" className="px-4 py-2">Find Users</TabsTrigger>
            </TabsList>

            {/* Activity Feed Tab */}
            <TabsContent value="feed" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {/* User Profile Card */}
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Your Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={{ name: userProfile?.name || "User", image: userProfile?.image }} />
                      <div>
                        <p className="font-medium">{userProfile?.name || "User"}</p>
                        <p className="text-sm text-muted-foreground">@{userProfile?.name ? userProfile.name.toLowerCase().replace(/\s+/g, '') : "user"}</p>
                      </div>
                    </div>

                    {/* Location Display */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Location</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {userProfile?.location?.city && userProfile?.location?.country 
                            ? `${userProfile.location.city}, ${userProfile.location.country}`
                            : "Location not set"
                          }
                        </span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-xs"
                        onClick={() => {
                          // This would typically open a modal or navigate to settings
                          alert("Location settings would open here. In a real app, this would navigate to a settings page or open a modal.")
                        }}
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        Update Location
                      </Button>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Friends</h3>
                      <div className="flex -space-x-2">
                        {(users || []).slice(0, 5).map((user) => (
                          <UserAvatar
                            key={user.id}
                            user={{ name: user.name, image: user.avatar || undefined }}
                            size="sm"
                            className="border-2 border-background"
                          />
                        ))}
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs">
                          +{Math.max(0, (users || []).length - 5)}
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

                {/* Enhanced Activity Feed */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Activity Feed
                        </CardTitle>
                        <CardDescription>See what your classmates are up to</CardDescription>
                      </div>
                      {newActivities > 0 && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          {newActivities} new
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-4">
                        {activities.map((activity) => (
                          <ActivityCard
                            key={activity.id}
                            activity={activity}
                            onLike={() => likeActivity(activity.id)}
                            onMarkAsRead={() => markActivityAsRead(activity.id)}
                            isRealTimeEnabled={true}
                          />
                        ))}
                        {activities.length === 0 && (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">No activities yet. Be the first to share your progress!</p>
                            <Button 
                              variant="outline" 
                              className="mt-2"
                              onClick={() => createActivity("quiz-completed", {
                                quizTitle: "Sample Quiz",
                                score: 85,
                                totalQuestions: 10
                              })}
                            >
                              Share Your First Activity
                            </Button>
                          </div>
                        )}
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
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Leaderboard
                  </CardTitle>
                  <CardDescription>Top performers this semester</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboard.map((entry) => (
                      <div key={entry.id} className="flex items-center gap-4 p-4 rounded-lg border">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                          {entry.rank}
                        </div>
                        <div className="flex items-center gap-3 flex-1">
                          <UserAvatar user={{ name: entry.user.name, image: entry.user.avatar || undefined }} />
                          <div className="flex-1">
                            <p className="font-medium">{entry.user.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {entry.user.program} • {entry.quizzesTaken} quizzes
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{entry.score}</p>
                          <p className="text-sm text-muted-foreground">{entry.avgScore}% avg</p>
                        </div>
                      </div>
                    ))}
                    {leaderboard.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No leaderboard data available yet.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Study Groups Tab */}
            <TabsContent value="groups" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {studyGroups.map((group) => (
                  <Card key={group.id}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          <CardDescription>{group.category}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        {group.description || "No description available"}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span>{group.members} members</span>
                        <span className="text-muted-foreground">{group.recentActivity}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant={group.isJoined ? "outline" : "default"}
                        className="w-full"
                        onClick={() => toggleJoinGroup(group.id)}
                      >
                        {group.isJoined ? (
                          <>
                            <UserMinus className="h-4 w-4 mr-2" />
                            Leave Group
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Join Group
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                {studyGroups.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">No study groups available yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Find Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Find Users
                  </CardTitle>
                  <CardDescription>Connect with other students from around the world</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Search and Basic Filters */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search users by name or username..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                      />
                      <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by program" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Programs</SelectItem>
                          <SelectItem value="computer-science">Computer Science</SelectItem>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowLocationFilters(!showLocationFilters)}
                        className="flex-shrink-0"
                      >
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Location-based Filters */}
                    {showLocationFilters && (
                      <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <h4 className="font-medium">Location Filters</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Search Location</label>
                            <Input
                              placeholder="City, region, or country..."
                              value={locationSearch}
                              onChange={(e) => setLocationSearch(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium mb-2 block">Country</label>
                            <Select value={String(selectedCountry)} onValueChange={setSelectedCountry}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Countries</SelectItem>
                                {uniqueCountries.map((country) => (
                                  <SelectItem key={country} value={country}>
                                    {country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium mb-2 block">Region</label>
                            <Select value={selectedRegion || "all"} onValueChange={setSelectedRegion}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select region" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Regions</SelectItem>
                                {uniqueRegions.map((region) => (
                                  <SelectItem key={region} value={region}>
                                    {region}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setLocationSearch("")
                              setSelectedCountry("all")
                              setSelectedRegion("all")
                            }}
                          >
                            Clear Location Filters
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={refreshUsers}
                          >
                            Refresh Results
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Results Count */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        {usersLoading ? "Loading..." : `${filteredUsers.length} user${filteredUsers.length !== 1 ? 's' : ''} found`}
                      </span>
                      {(locationSearch || selectedCountry !== "all" || (selectedRegion && selectedRegion !== "all")) && (
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          Location filtered
                        </span>
                      )}
                    </div>

                    {/* Users List */}
                    {usersLoading ? (
                      <div className="space-y-4">
                        {Array(3).fill(0).map((_, i) => (
                          <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
                            <div className="w-12 h-12 bg-muted animate-pulse rounded-full" />
                            <div className="flex-1 space-y-2">
                              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                              <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                            </div>
                            <div className="w-20 h-8 bg-muted animate-pulse rounded" />
                          </div>
                        ))}
                      </div>
                    ) : usersError ? (
                      <div className="text-center py-8">
                        <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
                        <p className="text-destructive">Error loading users: {usersError}</p>
                        <Button variant="outline" className="mt-2" onClick={refreshUsers}>
                          Try Again
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredUsers.map((user) => (
                          <div key={user.id} className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-sm transition-shadow">
                            <UserAvatar user={{ name: user.name, image: user.avatar || undefined }} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">@{user.username}</p>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {user.program} • Year {user.year}
                              </p>
                              
                              {/* Location Display */}
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                                <MapPin className="h-3 w-3" />
                                <span>{formatLocation(user)}</span>
                              </div>
                              
                              <div className="flex gap-4 text-xs text-muted-foreground">
                                <span>{user.stats.quizzesTaken} quizzes</span>
                                <span>{user.stats.avgScore}% avg</span>
                                <span>{user.stats.streak} day streak</span>
                              </div>
                            </div>
                            <Button
                              variant={user.isFollowing ? "outline" : "default"}
                              size="sm"
                              onClick={() => toggleFollow(user.id)}
                            >
                              {user.isFollowing ? "Following" : "Follow"}
                            </Button>
                          </div>
                        ))}
                        {filteredUsers.length === 0 && (
                          <div className="text-center py-8">
                            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground mb-2">No users found matching your criteria.</p>
                            <div className="flex gap-2 justify-center">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSearchQuery("")
                                  setLocationSearch("")
                                  setSelectedCountry("all")
                                  setSelectedRegion("all")
                                  setSelectedFilter("all")
                                }}
                              >
                                Clear All Filters
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={refreshUsers}
                              >
                                Refresh
                              </Button>
                            </div>
                          </div>
                        )}
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

// Enhanced Activity Card Component
function ActivityCard({ 
  activity, 
  onLike, 
  onMarkAsRead, 
  isRealTimeEnabled 
}: { 
  activity: any; 
  onLike: () => void; 
  onMarkAsRead: () => void;
  isRealTimeEnabled: boolean;
}) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return format(date, 'MMM d')
    }
  }

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      activity.isNew ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800' : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <UserAvatar user={{ name: activity.user.name, image: activity.user.avatar || undefined }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium">{activity.user.name}</p>
              <p className="text-sm text-muted-foreground">@{activity.user.username}</p>
              {activity.isNew && (
                <Badge variant="secondary" className="text-xs">
                  New
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{formatTime(activity.timestamp)}</p>
            
            <div className="mt-2 space-y-2">
              {activity.type === "quiz-completed" && (
                <div>
                  <p className="text-sm">
                    Completed the <span className="font-medium">{activity.content.quizTitle}</span> quiz with a score of{" "}
                    <span className="font-medium text-green-600">
                      {activity.content.score}/{activity.content.totalQuestions}
                    </span>
                    {" "}({Math.round((activity.content.score / activity.content.totalQuestions) * 100)}%)
                  </p>
                </div>
              )}
              
              {activity.type === "achievement" && (
                <div>
                  <p className="text-sm">
                    Earned the <span className="font-medium">{activity.content.achievement}</span> achievement!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{activity.content.description}</p>
                </div>
              )}
              
              {activity.type === "study-milestone" && (
                <div>
                  <p className="text-sm">
                    Reached the <span className="font-medium">{activity.content.milestone}</span> milestone!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{activity.content.description}</p>
                </div>
              )}
              
              {activity.type === "resource-shared" && (
                <div>
                  <p className="text-sm">
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
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{activity.content.streak}-Day Streak</span> {activity.content.description}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 mt-3">
              <Button variant="ghost" size="sm" onClick={onLike} className="gap-1">
                <Heart className="h-3 w-3" />
                <span>{activity.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1">
                <MessageCircle className="h-3 w-3" />
                <span>{activity.comments}</span>
              </Button>
            </div>
          </div>
          
          {activity.isNew && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAsRead}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
