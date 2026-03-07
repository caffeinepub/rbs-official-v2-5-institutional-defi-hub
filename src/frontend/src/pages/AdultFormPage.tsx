import { PageHead } from "@/components/PageHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { openWhatsApp } from "@/utils/whatsapp";
import { Loader2, Send, UserCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdultFormPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    country: "",
    email: "",
    phone: "",
    idNumber: "",
    purpose: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!formData.dateOfBirth) {
      toast.error("Please enter your date of birth");
      return;
    }
    if (!formData.country.trim()) {
      toast.error("Please enter your country");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!formData.idNumber.trim()) {
      toast.error("Please enter your ID number");
      return;
    }
    if (!formData.purpose.trim()) {
      toast.error("Please describe your purpose");
      return;
    }

    // Validate age (must be 18+)
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const isAdult = age > 18 || (age === 18 && monthDiff >= 0);

    if (!isAdult) {
      toast.error("You must be 18 years or older to submit this form");
      return;
    }

    setIsSubmitting(true);

    try {
      // Open WhatsApp with prefilled message
      openWhatsApp("RBS Adult Verification Form", {
        "Full Name": formData.fullName,
        "Date of Birth": formData.dateOfBirth,
        Country: formData.country,
        Email: formData.email,
        Phone: formData.phone,
        "ID Number": formData.idNumber,
        Purpose: formData.purpose,
      });

      toast.success("Form submitted successfully!", {
        description: "WhatsApp opened with your information.",
      });

      // Reset form
      setFormData({
        fullName: "",
        dateOfBirth: "",
        country: "",
        email: "",
        phone: "",
        idNumber: "",
        purpose: "",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to open WhatsApp. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHead
        title="Adult Verification Form"
        description="Submit your adult verification information for RBS services"
      />
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 mex-fade-in">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-6">
                <UserCheck className="h-10 w-10 text-gold" />
              </div>
              <h1 className="text-5xl md:text-6xl font-poppins font-bold text-gold mb-4 tracking-tight leading-tight">
                Adult Verification Form
              </h1>
              <p className="text-xl metallic-text-secondary font-inter max-w-2xl mx-auto leading-relaxed">
                Please provide your information for age verification and
                identity confirmation
              </p>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm-gold p-10 md:p-12 glow-border mex-fade-up">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label
                    htmlFor="fullName"
                    className="metallic-text font-inter text-lg mb-2 block"
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    disabled={isSubmitting}
                    className="bg-white/40 border-2 border-gold/30 metallic-text focus:border-gold h-14 text-lg"
                    placeholder="Enter your full legal name"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="dateOfBirth"
                    className="metallic-text font-inter text-lg mb-2 block"
                  >
                    Date of Birth *
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    disabled={isSubmitting}
                    className="bg-white/40 border-2 border-gold/30 metallic-text focus:border-gold h-14 text-lg"
                    required
                  />
                  <p className="text-sm metallic-text-secondary mt-2">
                    You must be 18 years or older
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="country"
                    className="metallic-text font-inter text-lg mb-2 block"
                  >
                    Country *
                  </Label>
                  <Input
                    id="country"
                    type="text"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    disabled={isSubmitting}
                    className="bg-white/40 border-2 border-gold/30 metallic-text focus:border-gold h-14 text-lg"
                    placeholder="Enter your country of residence"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="metallic-text font-inter text-lg mb-2 block"
                  >
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={isSubmitting}
                    className="bg-white/40 border-2 border-gold/30 metallic-text focus:border-gold h-14 text-lg"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="phone"
                    className="metallic-text font-inter text-lg mb-2 block"
                  >
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    disabled={isSubmitting}
                    className="bg-white/40 border-2 border-gold/30 metallic-text focus:border-gold h-14 text-lg"
                    placeholder="+1 234 567 8900"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="idNumber"
                    className="metallic-text font-inter text-lg mb-2 block"
                  >
                    ID Number *
                  </Label>
                  <Input
                    id="idNumber"
                    type="text"
                    value={formData.idNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, idNumber: e.target.value })
                    }
                    disabled={isSubmitting}
                    className="bg-white/40 border-2 border-gold/30 metallic-text focus:border-gold h-14 text-lg"
                    placeholder="Government-issued ID number"
                    required
                  />
                  <p className="text-sm metallic-text-secondary mt-2">
                    Passport, driver's license, or national ID number
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="purpose"
                    className="metallic-text font-inter text-lg mb-2 block"
                  >
                    Purpose of Verification *
                  </Label>
                  <Textarea
                    id="purpose"
                    value={formData.purpose}
                    onChange={(e) =>
                      setFormData({ ...formData, purpose: e.target.value })
                    }
                    disabled={isSubmitting}
                    className="bg-white/40 border-2 border-gold/30 metallic-text focus:border-gold min-h-[120px] text-lg"
                    placeholder="Please describe why you need adult verification..."
                    required
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gold hover:bg-gold/90 text-black font-poppins font-bold metallic-button text-lg py-7 mex-hover-lift"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Submit Verification
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-sm metallic-text-secondary text-center mt-6">
                  Your information will be sent via WhatsApp for secure
                  verification. All data is handled confidentially.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
