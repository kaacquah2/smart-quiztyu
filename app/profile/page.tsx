"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2, Upload } from "lucide-react"
import { UserAvatar } from "@/components/user-avatar"
import { useUserProfile } from "@/hooks/use-user-profile"
import { toast } from "sonner"

export default function ProfilePage() {
  const { userProfile, loading, updateUserProfile } = useUserProfile()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [program, setProgram] = useState("computer-science")
  const [year, setYear] = useState("1")
  const [semester, setSemester] = useState("1")
  const [darkModeEmails, setDarkModeEmails] = useState(true)
  const [quizReminders, setQuizReminders] = useState(true)
  const [resourceNotifications, setResourceNotifications] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Update form fields when user profile data loads
  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.name || "")
      setEmail(userProfile.email || "")
    }
  }, [userProfile])

  const handleSavePersonalInfo = async () => {
    if (!userProfile) return

    setIsSaving(true)
    try {
      await updateUserProfile({
        name: fullName,
        email: email,
      })
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <DashboardHeader />
        <DashboardShell>
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading profile...</div>
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
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 p-2">
              <TabsTrigger value="personal" className="px-4 py-2">Personal Info</TabsTrigger>
              <TabsTrigger value="academic" className="px-4 py-2">Academic Details</TabsTrigger>
              <TabsTrigger value="preferences" className="px-4 py-2">Preferences</TabsTrigger>
              <TabsTrigger value="security" className="px-4 py-2">Security</TabsTrigger>
            </TabsList>

            {/* Personal Info Tab */}
            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>Update your profile picture</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                  <UserAvatar
                    user={{ name: fullName || userProfile?.name, image: userProfile?.image }}
                    size="xl"
                    className="border"
                    fallbackText={fullName ? fullName.substring(0, 2).toUpperCase() : "U"}
                  />
                  <div className="flex flex-col gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Allowed file types: JPG, PNG, GIF</p>
                      <p className="text-sm text-muted-foreground">Maximum file size: 2MB</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" className="gap-1">
                        <Upload className="h-4 w-4" /> Upload new image
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Trash2 className="h-4 w-4" /> Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input 
                        id="displayName" 
                        placeholder="How others will see you" 
                        defaultValue={fullName ? fullName.split(' ')[0] : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (optional)</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Tell us a bit about yourself"
                      defaultValue="Computer Science student interested in AI and machine learning."
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSavePersonalInfo} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Academic Details Tab */}
            <TabsContent value="academic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Information</CardTitle>
                  <CardDescription>Update your academic details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="program">Program</Label>
                      <Select value={program} onValueChange={setProgram}>
                        <SelectTrigger id="program">
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="computer-science">BSc. Computer Science</SelectItem>
                          <SelectItem value="electrical-engineering">
                            BSc. Electrical and Electronic Engineering
                          </SelectItem>
                          <SelectItem value="business-admin">BSc. Business Administration</SelectItem>
                          <SelectItem value="civil-engineering">BSc. Civil Engineering</SelectItem>
                          <SelectItem value="nursing">BSc. Nursing</SelectItem>
                          <SelectItem value="agriculture">BSc. Agriculture</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input id="studentId" placeholder="e.g., 202312345" defaultValue="202201234" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Current Year</Label>
                      <Select value={year} onValueChange={setYear}>
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
                      <Label htmlFor="semester">Current Semester</Label>
                      <Select value={semester} onValueChange={setSemester}>
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
                  <div className="space-y-2">
                    <Label htmlFor="interests">Academic Interests</Label>
                    <textarea
                      id="interests"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="What subjects are you most interested in?"
                      defaultValue="Artificial Intelligence, Machine Learning, Data Structures"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Learning Goals</CardTitle>
                  <CardDescription>Set your academic goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Complete Programming Fundamentals</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Master basic programming concepts and syntax
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>60%</span>
                        </div>
                        <div className="h-2 mt-1 bg-muted rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: "60%" }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Learn Data Structures</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Understand and implement common data structures
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>25%</span>
                        </div>
                        <div className="h-2 mt-1 bg-muted rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: "25%" }}></div>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Add New Goal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Control how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about your activity</p>
                    </div>
                    <Switch checked={darkModeEmails} onCheckedChange={setDarkModeEmails} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Quiz Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get reminders about upcoming quizzes</p>
                    </div>
                    <Switch checked={quizReminders} onCheckedChange={setQuizReminders} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">New Resource Notifications</Label>
                      <p className="text-sm text-muted-foreground">Be notified when new resources are available</p>
                    </div>
                    <Switch checked={resourceNotifications} onCheckedChange={setResourceNotifications} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>App Settings</CardTitle>
                  <CardDescription>Customize your app experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quizTimeScale">Quiz Timing Preference</Label>
                    <Select defaultValue="1">
                      <SelectTrigger id="quizTimeScale">
                        <SelectValue placeholder="Select timing preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5">Extended Time (50% more)</SelectItem>
                        <SelectItem value="0.75">Extended Time (25% more)</SelectItem>
                        <SelectItem value="1">Standard Time</SelectItem>
                        <SelectItem value="1.25">Faster Pace (25% less)</SelectItem>
                        <SelectItem value="1.5">Faster Pace (50% less)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Update Password</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Account Management</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4 bg-muted/50">
                    <h3 className="font-medium">Download Your Data</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Download a copy of all your data, including quiz results, and learning resources
                    </p>
                    <Button variant="outline" className="mt-2">
                      Request Data Export
                    </Button>
                  </div>
                  <div className="rounded-lg border border-destructive p-4 bg-destructive/5">
                    <h3 className="font-medium text-destructive">Delete Account</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Permanently delete your account and all associated data
                    </p>
                    <Button variant="destructive" className="mt-2">
                      Delete Account
                    </Button>
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
