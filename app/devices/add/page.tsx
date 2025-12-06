"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AddDeviceForm } from "@/components/devices/add-device-form"

export default function AddDevicePage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">
          {/* Back Button */}
          <div className="border-b border-border bg-card px-6 py-3">
            <Link href="/devices">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Devices
              </Button>
            </Link>
          </div>

          {/* Content */}
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Add New Device</h1>
            <AddDeviceForm />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}