import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SOCIAL_LINKS } from "@/constants/socialLinks";
import { Quote, Shield, Star, TrendingUp, Users, Zap } from "lucide-react";

export default function TestimonialsPage() {
  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Early Adopter & Community Leader",
      avatar: "AT",
      rating: 5,
      text: "RBS represents the future of community-driven crypto projects. The transparency, governance model, and deflationary mechanics are unmatched. Being part of this journey from the beginning has been incredible.",
      category: "Community",
    },
    {
      name: "Sarah Chen",
      role: "DeFi Investor",
      avatar: "SC",
      rating: 5,
      text: "The neural mesh technology and institutional-grade security give me confidence in RBS as a long-term investment. The fixed supply and burn mechanism create real scarcity that supports value appreciation.",
      category: "Investment",
    },
    {
      name: "Marcus Rodriguez",
      role: "Blockchain Developer",
      avatar: "MR",
      rating: 5,
      text: "From a technical perspective, RBS is impressive. The sub-second finality, distributed node network, and quantum-resistant roadmap show serious engineering. This is built for the future.",
      category: "Technology",
    },
    {
      name: "Emily Watson",
      role: "Governance Participant",
      avatar: "EW",
      rating: 5,
      text: "Having a real voice in the project's direction through governance is what sets RBS apart. Every major decision goes through community voting, and that's true decentralization in action.",
      category: "Governance",
    },
    {
      name: "David Kim",
      role: "Token Holder",
      avatar: "DK",
      rating: 5,
      text: "The staking rewards and ecosystem benefits make RBS more than just a token to hold. The team delivers on promises, and the roadmap is clear and achievable. Excited for 2030 launch!",
      category: "Utility",
    },
    {
      name: "Lisa Martinez",
      role: "Crypto Analyst",
      avatar: "LM",
      rating: 5,
      text: "RBS combines the best of institutional crypto with community governance. The tokenomics are sound, the technology is cutting-edge, and the team is transparent. This is how crypto should be done.",
      category: "Analysis",
    },
  ];

  const stats = [
    {
      icon: Users,
      label: "Community Members",
      value: "12,847+",
      color: "text-gold",
    },
    {
      icon: TrendingUp,
      label: "Token Holders",
      value: "8,934+",
      color: "text-green-600",
    },
    {
      icon: Shield,
      label: "Security Score",
      value: "99.9%",
      color: "text-blue-600",
    },
    {
      icon: Zap,
      label: "Satisfaction Rate",
      value: "98.5%",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8 animate-pulse">
              <Quote className="h-10 w-10 text-gold" />
            </div>
            <h1 className="text-5xl md:text-7xl font-poppins font-bold mb-8 leading-tight metallic-text-hero">
              Community Testimonials
            </h1>
            <p className="text-xl md:text-2xl metallic-text-secondary font-inter max-w-3xl mx-auto leading-relaxed">
              Hear from our community members about their RBS experience and
              vision for the future
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 animate-fade-in-up animation-delay-200">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-gray-200 shadow-sm-gold p-8 text-center glow-border transition-all duration-700 hover:scale-105"
              >
                <div className="flex justify-center mb-4">
                  <div className="h-14 w-14 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                    <stat.icon className={`h-7 w-7 ${stat.color}`} />
                  </div>
                </div>
                <p
                  className={`text-4xl font-poppins font-bold ${stat.color} mb-2`}
                >
                  {stat.value}
                </p>
                <p className="text-sm metallic-text-secondary font-inter">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-20 animate-fade-in-up animation-delay-300">
            <Carousel className="w-full">
              <CarouselContent>
                {testimonials.map((testimonial) => (
                  <CarouselItem
                    key={testimonial.name}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-4 h-full">
                      <div className="bg-white border border-gray-200 shadow-sm p-8 h-full flex flex-col glow-border transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-gold/20">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gold/40 to-gold/15 border-2 border-gold/60 flex items-center justify-center flex-shrink-0">
                            <span className="text-gold font-poppins font-bold text-lg">
                              {testimonial.avatar}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-poppins font-bold text-gold truncate">
                              {testimonial.name}
                            </h3>
                            <p className="text-sm metallic-text-secondary font-inter truncate">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-1 mb-6">
                          {Array.from(
                            { length: testimonial.rating },
                            (_, i) => `star-${testimonial.name}-${i}`,
                          ).map((starKey) => (
                            <Star
                              key={starKey}
                              className="h-5 w-5 text-gold fill-gold"
                            />
                          ))}
                        </div>

                        <p className="metallic-text-secondary font-inter leading-relaxed mb-6 flex-1">
                          "{testimonial.text}"
                        </p>

                        <div className="pt-4 border-t border-gold/20">
                          <span className="inline-block px-4 py-2 bg-gold/10 border border-gold/30 rounded-full text-xs font-inter text-gold">
                            {testimonial.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="border-gold/30 text-gold hover:bg-gold/10" />
              <CarouselNext className="border-gold/30 text-gold hover:bg-gold/10" />
            </Carousel>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm-gold p-12 text-center glow-border animate-fade-in-up animation-delay-400">
            <h2 className="text-4xl font-poppins font-bold text-gold mb-6">
              Join Our Growing Community
            </h2>
            <p className="text-xl metallic-text-secondary font-inter mb-8 max-w-2xl mx-auto leading-relaxed">
              Be part of the RBS revolution. Connect with thousands of community
              members, participate in governance, and shape the future of
              professional crypto tokens.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={SOCIAL_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gold hover:bg-gold/90 text-black font-poppins font-bold rounded-lg transition-all duration-700 metallic-button hover:scale-105"
              >
                Join Telegram
              </a>
              <a
                href={SOCIAL_LINKS.whatsappChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white border-2 border-gold/30 hover:border-gold text-gold font-poppins font-bold rounded-lg transition-all duration-700 hover:scale-105"
              >
                Join WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
