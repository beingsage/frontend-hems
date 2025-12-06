"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, Home, Plus, Check } from "lucide-react"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [siteName, setSiteName] = useState("")
  const [siteType, setSiteType] = useState("home")
  const [rooms, setRooms] = useState<string[]>(["Living Room", "Kitchen", "Bedroom"])
  const [newRoom, setNewRoom] = useState("")
  const { completeOnboarding } = useAuth()
  const router = useRouter()

  const handleAddRoom = () => {
    if (newRoom.trim()) {
      setRooms([...rooms, newRoom.trim()])
      setNewRoom("")
    }
  }

  const handleComplete = () => {
    completeOnboarding()
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EnergyMonitor</span>
          </div>
          <CardTitle>Welcome! Let's set up your monitoring</CardTitle>
          <CardDescription>Step {step} of 3</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Tell us about your site</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  placeholder="My Home"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteType">Site Type</Label>
                <Select value={siteType} onValueChange={setSiteType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="campus">Campus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setStep(2)} className="w-full">
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Add rooms or zones</h3>
                <p className="text-sm text-muted-foreground">We'll organize your devices by location</p>
              </div>

              <div className="space-y-2">
                {rooms.map((room, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1">{room}</span>
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input placeholder="Add a room..." value={newRoom} onChange={(e) => setNewRoom(e.target.value)} />
                <Button onClick={handleAddRoom} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">You're all set!</h3>
                <p className="text-sm text-muted-foreground">
                  We've set up your dashboard with simulated devices. You can add real devices later from the Devices
                  page.
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="font-medium">Site configured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="font-medium">{rooms.length} rooms added</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="font-medium">Demo devices ready</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={handleComplete} className="flex-1">
                  Go to Dashboard
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
