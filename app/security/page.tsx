"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Users, FileText, Download, Trash2, AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import { auditLogger } from "@/lib/security/audit-logger"
import { rbacManager } from "@/lib/security/rbac"
import { dataPrivacyManager } from "@/lib/security/data-privacy"

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState("audit")
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Get audit logs
  const auditLogs = auditLogger.getAuditLogs().slice(0, 20)
  const securityEvents = auditLogger.getSecurityEvents()

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const loadedUsers = await rbacManager.getAllUsers()
        setUsers(loadedUsers)
      } catch (error) {
        console.error("Error loading users:", error)
        setUsers([])
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Mock export requests
  const exportRequests = [
    { id: "1", type: "Energy Data", status: "completed", date: "2025-01-03" },
    { id: "2", type: "Device Logs", status: "processing", date: "2025-01-04" },
  ]

  const handleExportLogs = (format: "json" | "csv") => {
    const data = auditLogger.exportLogs(format)
    const blob = new Blob([data], { type: format === "json" ? "application/json" : "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-logs-${Date.now()}.${format}`
    a.click()
  }

  const handleRequestExport = () => {
    dataPrivacyManager.requestDataExport("user_1", ["energy_data", "device_logs"], "json")
    alert("Data export requested successfully!")
  }

  return (
        <ProtectedRoute>
    
    <div className="flex h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Security & Compliance</h1>
            <p className="text-muted-foreground">Manage security, audit logs, user permissions, and data privacy</p>
          </div>

          {/* Security Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Shield className="h-5 w-5 text-green-500" />
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Secure
                </Badge>
              </div>
              <div className="text-2xl font-bold">98.5%</div>
              <div className="text-sm text-muted-foreground">Security Score</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                  {securityEvents.filter((e) => e.riskLevel === "high").length}
                </Badge>
              </div>
              <div className="text-2xl font-bold">{securityEvents.length}</div>
              <div className="text-sm text-muted-foreground">Security Events</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-5 w-5 text-blue-500" />
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                  Active
                </Badge>
              </div>
              <div className="text-2xl font-bold">{users.filter((u) => u.status === "active").length}</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <FileText className="h-5 w-5 text-purple-500" />
                <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                  Today
                </Badge>
              </div>
              <div className="text-2xl font-bold">{auditLogs.length}</div>
              <div className="text-sm text-muted-foreground">Audit Logs</div>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="audit">Audit Logs</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="privacy">Data Privacy</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>

            <TabsContent value="audit">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Audit Trail</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleExportLogs("json")}>
                      <Download className="h-4 w-4 mr-2" />
                      Export JSON
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExportLogs("csv")}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-2 w-2 rounded-full ${log.status === "success" ? "bg-green-500" : "bg-red-500"}`}
                        />
                        <div>
                          <div className="font-medium">{log.action}</div>
                          <div className="text-sm text-muted-foreground">
                            {log.userName} • {log.resource}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant="outline"
                          className={
                            log.severity === "critical"
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : log.severity === "high"
                                ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                                : log.severity === "medium"
                                  ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                  : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          }
                        >
                          {log.severity}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{log.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">User Permissions</h2>

                <div className="space-y-3">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {user.role}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            user.status === "active"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                          }
                        >
                          {user.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <div className="grid gap-6">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Data Export Requests</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Request a copy of your data in compliance with GDPR and data privacy regulations
                  </p>

                  <Button onClick={handleRequestExport} className="mb-6">
                    <Download className="h-4 w-4 mr-2" />
                    Request Data Export
                  </Button>

                  <div className="space-y-3">
                    {exportRequests.map((req) => (
                      <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{req.type}</div>
                          <div className="text-sm text-muted-foreground">Requested on {req.date}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          {req.status === "completed" ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-500" />
                          )}
                          <Badge variant="outline">{req.status}</Badge>
                          {req.status === "completed" && (
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Data Deletion</h2>
                  <p className="text-sm text-muted-foreground mb-6">Request permanent deletion of your personal data</p>

                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Request Data Deletion
                  </Button>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="compliance">
              <div className="grid gap-6">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Compliance Status</h2>

                  <div className="space-y-4">
                    {[
                      { name: "GDPR Compliance", status: "compliant", score: 98 },
                      { name: "ISO 27001", status: "compliant", score: 95 },
                      { name: "SOC 2 Type II", status: "in-progress", score: 87 },
                      { name: "HIPAA", status: "compliant", score: 92 },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">Score: {item.score}%</div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            item.status === "compliant"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Certifications</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {["ISO 27001", "SOC 2", "GDPR", "CCPA"].map((cert) => (
                      <div key={cert} className="p-4 border rounded-lg text-center">
                        <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <div className="font-medium">{cert}</div>
                        <div className="text-sm text-muted-foreground">Certified</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
        </ProtectedRoute> 
  )
}
