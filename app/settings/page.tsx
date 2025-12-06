"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { LogOut, User, Building2, Users, Zap, TrendingDown, Download  } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/layout/app-sidebar"

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <AppSidebar />

        <main className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
            </div>
<div className="justify-between flex-row">
    <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{user?.name}</div>
                    <div className="text-sm text-muted-foreground">{user?.email}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Role: {user?.role.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

   <Card>
              <CardHeader>
                <CardTitle>Session</CardTitle>
                <CardDescription>Manage your login session</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
</div>
          

             {/* Tabs */}
            <Tabs defaultValue="sites" className="space-y-4">
              <TabsList>
                <TabsTrigger value="sites">Sites</TabsTrigger>
                <TabsTrigger value="users">Users & Roles</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

                <TabsContent value="sites" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Site Management</CardTitle>
                    <CardDescription>Configure and monitor all sites</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "Main Office", location: "Mumbai", devices: 23, users: 12, status: "online" },
                        { name: "Warehouse", location: "Pune", devices: 18, users: 8, status: "online" },
                        { name: "Retail Store", location: "Delhi", devices: 6, users: 4, status: "online" },
                      ].map((site) => (
                        <div key={site.name} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Building2 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <div className="font-semibold">{site.name}</div>
                              <div className="text-sm text-muted-foreground">{site.location}</div>
                              <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                                <span>{site.devices} devices</span>
                                <span>{site.users} users</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="default">{site.status}</Badge>
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage users and permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "John Doe", email: "john@example.com", role: "Admin", sites: ["All"] },
                        { name: "Jane Smith", email: "jane@example.com", role: "Manager", sites: ["Main Office"] },
                        { name: "Bob Wilson", email: "bob@example.com", role: "Analyst", sites: ["Warehouse"] },
                        { name: "Alice Brown", email: "alice@example.com", role: "User", sites: ["Retail Store"] },
                      ].map((user) => (
                        <div key={user.email} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="font-semibold text-primary">{user.name[0]}</span>
                            </div>
                            <div>
                              <div className="font-semibold">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <Badge variant="outline">{user.role}</Badge>
                              <div className="text-xs text-muted-foreground mt-1">{user.sites.join(", ")}</div>
                            </div>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>System Settings</CardTitle>
                    <CardDescription>Configure global system preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Data Retention</h4>
                      <p className="text-sm text-muted-foreground">
                        Raw readings are stored for 90 days, aggregated data for 2 years
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Alert Thresholds</h4>
                      <p className="text-sm text-muted-foreground">
                        Global anomaly detection sensitivity: Medium (score ≥ 0.7)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">API Access</h4>
                      <p className="text-sm text-muted-foreground">3 active API keys • Last used 2 hours ago</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Privacy & Security</h4>
                      <p className="text-sm text-muted-foreground">
                        PII data TTL: 30 days • Geolocation data TTL: 7 days
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
