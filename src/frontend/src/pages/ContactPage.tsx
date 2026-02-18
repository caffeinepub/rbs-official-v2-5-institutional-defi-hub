import { Mail, MessageSquare, Send } from 'lucide-react';
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

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    const emailBody = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0ASubject: ${formData.subject}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;
    const mailtoLink = `mailto:design.crafters.official@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${emailBody}`;

    window.location.href = mailtoLink;

    setTimeout(() => {
      toast.success('Email client opened. Please send your message.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 mex-fade-in">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
              <Mail className="h-10 w-10 text-gold" />
            </div>
            <h1 className="text-5xl md:text-7xl font-poppins font-bold text-gold mb-6 tracking-tight leading-tight">
              Contact Us
            </h1>
            <p className="text-xl metallic-text-secondary font-inter max-w-2xl mx-auto leading-relaxed">
              Get in touch with the RBS team. We're here to answer your questions and discuss
              partnership opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6 mex-fade-up">
              <div className="glass-card-gold p-10 glow-border">
                <h2 className="text-3xl font-poppins font-bold text-gold mb-8 tracking-tight">
                  Direct Channels
                </h2>

                <div className="space-y-4">
                  <a
                    href={SOCIAL_LINKS.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-6 glass-card hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10 transition-all duration-300 group"
                  >
                    <div className="h-14 w-14 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 group-hover:bg-gold/20 transition-colors">
                      <SiTelegram className="h-7 w-7 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-poppins font-bold text-gold mb-1 text-xl">Telegram</h3>
                      <p className="metallic-text-secondary text-base font-inter">Join our community</p>
                    </div>
                  </a>

                  <a
                    href={SOCIAL_LINKS.whatsappChannel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-6 glass-card hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10 transition-all duration-300 group"
                  >
                    <div className="h-14 w-14 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 group-hover:bg-gold/20 transition-colors">
                      <SiWhatsapp className="h-7 w-7 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-poppins font-bold text-gold mb-1 text-xl">WhatsApp</h3>
                      <p className="metallic-text-secondary text-base font-inter">Community channel</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="glass-card-gold p-10 glow-border">
                <div className="flex items-start gap-4">
                  <MessageSquare className="h-10 w-10 text-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-2xl font-poppins font-bold text-gold mb-4 tracking-tight">
                      Response Time
                    </h3>
                    <p className="metallic-text-secondary font-inter leading-relaxed text-lg">
                      Our team typically responds within 24-48 hours. For urgent inquiries, please
                      reach out via Telegram or WhatsApp for faster response times.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mex-fade-up">
              <div className="glass-card p-10 glow-border">
                <div className="flex items-center gap-3 mb-8">
                  <Mail className="h-7 w-7 text-gold" />
                  <h2 className="text-3xl font-poppins font-bold text-gold tracking-tight">Send a Message</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="metallic-text font-inter text-lg mb-2 block">
                      Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-2 bg-white/40 border-gold/30 metallic-text focus:border-gold h-14 text-lg"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="metallic-text font-inter text-lg mb-2 block">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-2 bg-white/40 border-gold/30 metallic-text focus:border-gold h-14 text-lg"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className="metallic-text font-inter text-lg mb-2 block">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="mt-2 bg-white/40 border-gold/30 metallic-text focus:border-gold h-14 text-lg"
                      placeholder="What is this regarding?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="metallic-text font-inter text-lg mb-2 block">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="mt-2 bg-white/40 border-gold/30 metallic-text focus:border-gold min-h-[150px] text-lg"
                      placeholder="Your message..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gold hover:bg-gold/90 text-black font-poppins font-bold metallic-button text-lg py-7"
                  >
                    {isSubmitting ? (
                      'Opening Email Client...'
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-sm metallic-text-secondary font-inter mt-6 text-center">
                  Email will be sent to: design.crafters.official@gmail.com
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-10 text-center mex-fade-up glow-border">
            <h3 className="text-3xl font-poppins font-bold text-gold mb-6 tracking-tight">
              Partnership Inquiries
            </h3>
            <p className="metallic-text-secondary font-inter leading-relaxed max-w-3xl mx-auto text-lg">
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
