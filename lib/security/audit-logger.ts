export interface AuditLog {
  id: string
  timestamp: Date
  userId: string
  userName: string
  action: string
  resource: string
  details: string
  ipAddress: string
  userAgent: string
  status: "success" | "failure"
  severity: "low" | "medium" | "high" | "critical"
}

export interface SecurityEvent {
  id: string
  timestamp: Date
  eventType: "login" | "logout" | "failed_login" | "permission_denied" | "data_access" | "data_export" | "config_change"
  userId: string
  details: string
  riskLevel: "low" | "medium" | "high" | "critical"
}

class AuditLogger {
  private logs: AuditLog[] = []
  private securityEvents: SecurityEvent[] = []

  logAction(log: Omit<AuditLog, "id" | "timestamp">): void {
    const auditLog: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...log,
    }
    this.logs.push(auditLog)

    // Check for security concerns
    this.analyzeForSecurityThreats(auditLog)
  }

  logSecurityEvent(event: Omit<SecurityEvent, "id" | "timestamp">): void {
    const securityEvent: SecurityEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...event,
    }
    this.securityEvents.push(securityEvent)
  }

  private analyzeForSecurityThreats(log: AuditLog): void {
    // Detect multiple failed attempts
    const recentFailures = this.logs.filter(
      (l) => l.userId === log.userId && l.status === "failure" && Date.now() - l.timestamp.getTime() < 300000, // 5 minutes
    )

    if (recentFailures.length >= 3) {
      this.logSecurityEvent({
        eventType: "failed_login",
        userId: log.userId,
        details: `Multiple failed attempts detected: ${recentFailures.length}`,
        riskLevel: "high",
      })
    }
  }

  getAuditLogs(filters?: {
    userId?: string
    action?: string
    startDate?: Date
    endDate?: Date
    severity?: string
  }): AuditLog[] {
    let filtered = [...this.logs]

    if (filters?.userId) {
      filtered = filtered.filter((log) => log.userId === filters.userId)
    }
    if (filters?.action) {
      filtered = filtered.filter((log) => log.action.includes(filters.action))
    }
    if (filters?.startDate) {
      filtered = filtered.filter((log) => log.timestamp >= filters.startDate!)
    }
    if (filters?.endDate) {
      filtered = filtered.filter((log) => log.timestamp <= filters.endDate!)
    }
    if (filters?.severity) {
      filtered = filtered.filter((log) => log.severity === filters.severity)
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  getSecurityEvents(riskLevel?: string): SecurityEvent[] {
    let events = [...this.securityEvents]
    if (riskLevel) {
      events = events.filter((e) => e.riskLevel === riskLevel)
    }
    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  exportLogs(format: "json" | "csv"): string {
    if (format === "json") {
      return JSON.stringify(this.logs, null, 2)
    } else {
      const headers = "ID,Timestamp,User ID,User Name,Action,Resource,Status,Severity\n"
      const rows = this.logs
        .map(
          (log) =>
            `${log.id},${log.timestamp.toISOString()},${log.userId},${log.userName},${log.action},${log.resource},${log.status},${log.severity}`,
        )
        .join("\n")
      return headers + rows
    }
  }
}

export const auditLogger = new AuditLogger()
