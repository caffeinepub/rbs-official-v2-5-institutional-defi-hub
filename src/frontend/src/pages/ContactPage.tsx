import { Mail, MessageSquare, Send, Loader2 } from 'lucide-react';
import { SiTelegram, SiWhatsapp } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
import { SOCIAL_LINKS } from '@/constants/socialLinks';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    if (!formData.subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }

    if (!formData.message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsSubmitting(true);

    const emailBody = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0ASubject: ${formData.subject}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;
    const mailtoLink = `mailto:design.crafters.official@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${emailBody}`;

    window.location.href = mailtoLink;

    setTimeout(() => {
      toast.success('Email client opened successfully');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-12 pb-16 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 border-2 border-primary/30 mb-8">
              <Mail className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight leading-tight">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get in touch with the RBS team. We're here to answer your questions and discuss
              partnership opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6 animate-fade-in-up animation-delay-200">
              <div className="card p-10">
                <h2 className="text-3xl font-bold text-foreground mb-8 tracking-tight">
                  Direct Channels
                </h2>

                <div className="space-y-4">
                  <a
                    href={SOCIAL_LINKS.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-6 card hover:border-primary/40 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/30 group-hover:bg-primary/20 transition-colors">
                      <SiTelegram className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1 text-xl">Telegram</h3>
                      <p className="text-muted-foreground text-base">Join our community</p>
                    </div>
                  </a>

                  <a
                    href={SOCIAL_LINKS.whatsappChannel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-6 card hover:border-primary/40 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/30 group-hover:bg-primary/20 transition-colors">
                      <SiWhatsapp className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1 text-xl">WhatsApp</h3>
                      <p className="text-muted-foreground text-base">Direct messaging</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="card p-10">
                <div className="flex items-start gap-4">
                  <MessageSquare className="h-10 w-10 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 tracking-tight">
                      Response Time
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      Our team typically responds within 24-48 hours. For urgent inquiries, please
                      reach out via Telegram or WhatsApp for faster response times.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-fade-in-up animation-delay-400">
              <div className="card p-10">
                <div className="flex items-center gap-3 mb-8">
                  <Mail className="h-7 w-7 text-primary" />
                  <h2 className="text-3xl font-bold text-foreground tracking-tight">Send a Message</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-foreground text-lg mb-2 block">
                      Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-2 h-14 text-lg"
                      placeholder="Your full name"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-foreground text-lg mb-2 block">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-2 h-14 text-lg"
                      placeholder="your.email@example.com"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-foreground text-lg mb-2 block">
                      Subject <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="mt-2 h-14 text-lg"
                      placeholder="What is this regarding?"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-foreground text-lg mb-2 block">
                      Message <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="mt-2 min-h-[150px] text-lg"
                      placeholder="Your message..."
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-7"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Opening Email Client...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-sm text-muted-foreground mt-6 text-center">
                  Email will be sent to: design.crafters.official@gmail.com
                </p>
              </div>
            </div>
          </div>

          <div className="card p-10 text-center animate-fade-in-up animation-delay-600">
            <h3 className="text-3xl font-bold text-foreground mb-6 tracking-tight">
              Partnership Inquiries
            </h3>
            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto text-lg">
              For partnership opportunities, institutional inquiries, or media requests, please
              include detailed information in your message. Our business development team will
              review and respond to qualified inquiries promptly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
