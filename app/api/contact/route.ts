import { type NextRequest, NextResponse } from "next/server"
import { auditLogger } from "@/lib/security/audit-logger"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, subject, message } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 })
    }

    // Log contact submission
    auditLogger.logAction({
      userId: "guest",
      userName: `${firstName} ${lastName}`,
      action: "POST /api/contact",
      resource: "contact-form",
      details: `Subject: ${subject}`,
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
      status: "success",
      severity: "low",
    })

    // In a real app, you would send an email or save to database
    console.log("[v0] Contact form submission:", { firstName, lastName, email, subject, message })

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully!",
    })
  } catch (error) {
    console.error("[v0] Error processing contact form:", error)
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 })
  }
}
