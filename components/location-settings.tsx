"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Save, CheckCircle, Loader2 } from "lucide-react"
import { CONFIG } from "@/lib/config"

interface LocationData {
  city?: string | null
  country?: string | null
  region?: string | null
  timezone?: string | null
  coordinates?: {
    lat: number
    lng: number
  } | null
}

export function LocationSettings() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [location, setLocation] = useState<LocationData>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchLocation = async () => {
      if (!session?.user?.id) return

      try {
        const response = await fetch('/api/users/location')
        if (response.ok) {
          const data = await response.json()
          setLocation(data)
        }
      } catch (error) {
        console.error("Error fetching location:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLocation()
  }, [session?.user?.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) return

    setSaving(true)
    try {
      const response = await fetch('/api/users/location', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(location),
      })

      if (response.ok) {
        setSuccess(true)
        toast({
          title: "Success",
          description: "Your location has been updated successfully",
        })
        
        // Reset success state after configured duration
        setTimeout(() => setSuccess(false), CONFIG.PERFORMANCE.SUCCESS_MESSAGE_DURATION)
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to update location")
      }
    } catch (error) {
      console.error("Error updating location:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update location",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof LocationData, value: string) => {
    setLocation(prev => ({
      ...prev,
      [field]: value || null
    }))
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location Settings
          </CardTitle>
          <CardDescription>Update your location to help others find you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading location information...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Location Settings
        </CardTitle>
        <CardDescription>
          Update your location to help other students find you and connect with people in your area
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="Enter your city"
                value={location.city || ""}
                onChange={(e) => handleInputChange("city", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                placeholder="Enter your country"
                value={location.country || ""}
                onChange={(e) => handleInputChange("country", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">Region/State</Label>
              <Input
                id="region"
                placeholder="Enter your region or state"
                value={location.region || ""}
                onChange={(e) => handleInputChange("region", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                placeholder="e.g., America/New_York"
                value={location.timezone || ""}
                onChange={(e) => handleInputChange("timezone", e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={saving || !location.city || !location.country}
              className="flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Location
                </>
              )}
            </Button>
            
            {location.city && location.country && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>
                  {location.city}, {location.country}
                  {location.region && `, ${location.region}`}
                </span>
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            <p>💡 Your location helps other students find you and discover study partners in your area.</p>
            <p>📍 Only your city, country, and region are visible to other users. Exact coordinates are kept private.</p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 