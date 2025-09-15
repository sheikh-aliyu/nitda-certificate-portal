import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CheckCircle, Shield, Award, Search } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import api from "@/services/api";

const Landing = () => {
  const [certificateId, setCertificateId] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!certificateId.trim()) {
      setError("Please enter a certificate ID");
      return;
    }

    setError("");
    setVerificationResult(null);
    setLoading(true);

    try {
      const result = await api.verifyCertificate(certificateId);
      setVerificationResult(result);
    } catch (err: any) {
      setError(err.message || "Failed to verify certificate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                Digital Certificates in One Place
              </h1>
              <p className="text-lg text-gray-600">
                Access, verify, and manage your NITDA certificates seamlessly. Our secure platform ensures your achievements are always at your fingertips.
              </p>
            </div>

            {/* Certificate Verification Form */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <Search className="w-5 h-5 text-green-800" />
                <h3 className="font-semibold text-gray-800">Verify Certificate</h3>
              </div>
              <div className="flex space-x-3">
                <Input
                  placeholder="Enter your certificate ID"
                  className="flex-1 h-12"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                  disabled={loading}
                />
                <Button
                  className="bg-green-800 hover:bg-green-900 text-white px-8 h-12"
                  onClick={handleVerify}
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify"}
                </Button>
              </div>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {verificationResult && (
                <div className="mt-4 p-4 border rounded-lg">
                  {verificationResult.isValid ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <CheckCircle className="w-5 h-5" />
                        <span>Certificate is Valid</span>
                      </div>
                      <p><strong>Recipient:</strong> {verificationResult.certificate.recipientName}</p>
                      <p><strong>Course:</strong> {verificationResult.certificate.courseName}</p>
                    </div>
                  ) : (
                    <p className="text-red-600 font-semibold">{verificationResult.message}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-green-800" /><span>Instant Verification</span></div>
              <div className="flex items-center space-x-2"><Shield className="w-5 h-5 text-green-800" /><span>Secure Storage</span></div>
              <div className="flex items-center space-x-2"><Award className="w-5 h-5 text-green-800" /><span>Official Certificates</span></div>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="flex justify-center">
            <img src="/certport.png" alt="Certificate Illustration" className="w-full max-w-lg" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 px-6 py-12 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-gray-300">
              <a href="#" className="hover:text-white">Home</a><br/>
              <a href="#" className="hover:text-white">Verify Certificate</a><br/>
              <a href="#" className="hover:text-white">About</a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2 text-gray-300">
              <p>certificates@nitda.gov.ng</p>
              <p>+234 907 234 5678</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Address</h4>
            <div className="text-gray-300">
              <p>NITDA Headquarters</p>
              <p>Abuja, Nigeria</p>
            </div>
          </div>
        </div>
        <div className="border-t border-green-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>Copyright © {new Date().getFullYear()} NITDA | All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;