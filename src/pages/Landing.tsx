import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CheckCircle, Shield, Award, Search } from "lucide-react";
import Header from "@/components/Header";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-nitda" />
                <span className="text-nitda font-medium">Secure & Verified</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  Digital Certificates{" "}
                  <span className="text-nitda">in One Place</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Access, verify, and manage your NITDA certificates seamlessly.
                  Our secure platform ensures your achievements are always at your
                  fingertips.
                </p>
              </div>

              {/* Certificate Verification Form */}
              <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-6">
                  <Card className="p-6 bg-white border border-border">
                    <div className="flex items-center space-x-2 mb-4">
                      <Search className="w-5 h-5 text-nitda" />
                      <h3 className="font-semibold text-card-foreground">
                        Verify Certificate
                      </h3>
                    </div>

                    <div className="flex space-x-3">
                      <Input
                        placeholder="Enter your certificate ID"
                        className="flex-1"
                      />
                      <Button className="bg-nitda hover:bg-nitda-dark text-white px-8">
                        Verify
                      </Button>
                    </div>
                  </Card>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-nitda" />
                    <span>Instant Verification</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-nitda" />
                    <span>Secure Storage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-nitda" />
                    <span>Official Certificates</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image Section */}
            <div className="flex justify-center lg:justify-end">
              <img
                src="/certport.png"
                alt="Certificate Illustration"
                className="w-full max-w-md lg:max-w-lg" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-nitda px-6 py-12 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <p className="text-nitda-light hover:text-white cursor-pointer transition-colors">About NITDA</p>
                <p className="text-nitda-light hover:text-white cursor-pointer transition-colors">Login</p>
                <p className="text-nitda-light hover:text-white cursor-pointer transition-colors">Support</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <div className="space-y-2">
                <p className="text-nitda-light">certificates@nitda.gov.ng</p>
                <p className="text-nitda-light">+234........</p>
                <div className="text-nitda-light">
                  <p><a href="https://www.google.com/maps/search/?api=1&query=NITDA+Headquarters,+Abuja,+Nigeria" target="_blank">NITDA</a></p>
                  <p>Headquarters</p>
                  <p>Abuja, Nigeria</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-nitda-dark mt-8 pt-6 text-center">
            <p className="text-nitda-light">
              Copyright © 2025 NITDA | All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;