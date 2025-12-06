import { AppSidebar } from "@/components/layout/app-sidebar"
import { ContactForm } from "@/components/contact/contact-form"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone, Clock } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

export default function ContactPage() {
  return (
        <ProtectedRoute>
    
    <div className="flex h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 space-y-8 max-w-6xl">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground text-balance">Get in Touch</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Have questions about energy optimization? We're here to help you make your campus more sustainable.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Form - Takes 2 columns */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <ContactForm />
                </CardContent>
              </Card>
            </div>

            {/* Contact Information - Takes 1 column */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Email</p>
                          <a
                            href="mailto:support@energymonitor.com"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            support@energymonitor.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Phone</p>
                          <a
                            href="tel:+1234567890"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            +1 (234) 567-890
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Address</p>
                          <p className="text-sm text-muted-foreground">
                            123 Energy Street
                            <br />
                            Smart City, SC 12345
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Business Hours</p>
                          <p className="text-sm text-muted-foreground">
                            Monday - Friday
                            <br />
                            9:00 AM - 6:00 PM EST
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Need Immediate Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    For urgent technical support or system alerts, please contact our 24/7 emergency line.
                  </p>
                  <a href="tel:+1234567899" className="text-sm font-medium text-primary hover:underline">
                    Emergency: +1 (234) 567-899
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
        </ProtectedRoute>
  )
}
