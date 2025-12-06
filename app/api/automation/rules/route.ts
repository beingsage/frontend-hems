import { type NextRequest, NextResponse } from "next/server"
import { ruleEngine } from "@/lib/automation/rule-engine"
import { auditLogger } from "@/lib/security/audit-logger"

export async function GET() {
  try {
    const rules = ruleEngine.getAllRules()
    return NextResponse.json({
      success: true,
      data: rules,
    })
  } catch (error) {
    console.error("[v0] Error fetching rules:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch rules" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ruleId, ruleData } = body

    let result

    switch (action) {
      case "create":
        result = ruleEngine.addRule(ruleData)
        break
      case "toggle":
        result = ruleEngine.toggleRule(ruleId)
        break
      case "delete":
        result = ruleEngine.deleteRule(ruleId)
        break
      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }

    // Log action
    auditLogger.logAction({
      userId: "user_1",
      userName: "Admin User",
      action: `POST /api/automation/rules - ${action}`,
      resource: `rule:${ruleId || "new"}`,
      details: JSON.stringify(ruleData || {}),
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
      status: "success",
      severity: "medium",
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("[v0] Error managing rule:", error)
    return NextResponse.json({ success: false, error: "Failed to manage rule" }, { status: 500 })
  }
}
