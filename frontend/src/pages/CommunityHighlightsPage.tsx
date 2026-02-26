import { Users, Award, TrendingUp, Heart, Star, Trophy, Target, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SmokySectionTransition } from '@/components/SmokySectionTransition';
import { PageHead } from '@/components/PageHead';

export default function CommunityHighlightsPage() {
  const achievements = [
    {
      title: 'Community Growth Milestone',
      description: 'Reached 10,000+ active community members across all platforms',
      date: 'December 2025',
      icon: Users,
      metric: '10,000+',
      category: 'Growth',
    },
    {
      title: 'Governance Participation Record',
      description: '85% voter turnout on latest governance proposal - highest in DeFi',
      date: 'November 2025',
      icon: Trophy,
      metric: '85%',
      category: 'Governance',
    },
    {
      title: 'Community Contribution Awards',
      description: 'Recognized 50+ outstanding community contributors with RBS rewards',
      date: 'October 2025',
      icon: Award,
      metric: '50+',
      category: 'Recognition',
    },
    {
      title: 'Educational Content Milestone',
      description: 'Published 100+ educational resources created by community members',
      date: 'September 2025',
      icon: Star,
      metric: '100+',
      category: 'Education',
    },
  ];

  const featuredMembers = [
    {
      name: 'Alex Chen',
      role: 'Community Moderator',
      contribution: 'Led 20+ community AMAs and created comprehensive onboarding guides',
      impact: 'Helped onboard 2,000+ new members',
    },
    {
      name: 'Sarah Martinez',
      role: 'Technical Contributor',
      contribution: 'Developed community tools and analytics dashboards',
      impact: 'Improved community engagement by 40%',
    },
    {
      name: 'David Kim',
      role: 'Content Creator',
      contribution: 'Produced 50+ educational videos and tutorials',
      impact: 'Reached 100,000+ views across platforms',
    },
    {
      name: 'Emma Thompson',
      role: 'Governance Lead',
      contribution: 'Facilitated 15+ successful governance proposals',
      impact: 'Increased voter participation by 60%',
    },
  ];

  const initiatives = [
    {
      title: 'Community Ambassador Program',
      description: 'Global network of ambassadors representing RBS in 30+ countries',
      participants: '150+',
      icon: Target,
    },
    {
      title: 'Developer Grants Program',
      description: 'Funding innovative projects built on RBS ecosystem',
      participants: '25+',
      icon: Zap,
    },
    {
      title: 'Educational Workshops',
      description: 'Monthly workshops covering DeFi, governance, and technical topics',
      participants: '500+',
      icon: Star,
    },
    {
      title: 'Community Rewards Pool',
      description: 'Distributing rewards to active contributors and participants',
      participants: '1,000+',
      icon: Heart,
    },
  ];

  const stats = [
    { label: 'Total Members', value: '10,000+', icon: Users },
    { label: 'Active Contributors', value: '1,500+', icon: TrendingUp },
    { label: 'Governance Proposals', value: '50+', icon: Trophy },
    { label: 'Community Events', value: '100+', icon: Award },
  ];

  return (
    <>
      <PageHead 
        title="Community Highlights" 
        description="Celebrating the achievements, contributions, and success stories of our vibrant RBS community"
      />
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SmokySectionTransition>
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 mb-8">
                  <Users className="h-10 w-10 text-gold" />
                </div>
                <h1 className="text-5xl md:text-7xl font-poppins font-bold mb-6 leading-tight metallic-text-hero">
                  Community Highlights
                </h1>
                <p className="text-xl metallic-text-secondary font-inter max-w-3xl mx-auto leading-relaxed">
                  Celebrating the achievements, contributions, and success stories of our vibrant RBS community
                </p>
              </div>
            </SmokySectionTransition>

            <SmokySectionTransition delay={100}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="glass-card-gold p-6 text-center glow-border transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-gold/20"
                  >
                    <stat.icon className="h-8 w-8 text-gold mx-auto mb-3" />
                    <p className="text-3xl font-poppins font-bold text-gold mb-2">{stat.value}</p>
                    <p className="text-sm metallic-text-secondary font-inter">{stat.label}</p>
                  </div>
                ))}
              </div>
            </SmokySectionTransition>

            <SmokySectionTransition delay={200}>
              <div className="mb-16">
                <h2 className="text-4xl font-poppins font-bold text-gold mb-8 text-center">
                  Major Achievements
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="glass-card p-6 glow-border transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-gold/20"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 flex-shrink-0">
                          <achievement.icon className="h-6 w-6 text-gold" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-gold border-gold/30">
                              {achievement.category}
                            </Badge>
                            <span className="text-xs metallic-text-secondary font-inter">{achievement.date}</span>
                          </div>
                          <h3 className="text-xl font-poppins font-bold text-gold mb-2">
                            {achievement.title}
                          </h3>
                        </div>
                      </div>
                      <p className="metallic-text-secondary font-inter leading-relaxed mb-4">
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-400" />
                        <span className="text-2xl font-jetbrains font-bold text-green-400">
                          {achievement.metric}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SmokySectionTransition>

            <SmokySectionTransition delay={300}>
              <div className="mb-16">
                <h2 className="text-4xl font-poppins font-bold text-gold mb-8 text-center">
                  Featured Community Members
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredMembers.map((member, index) => (
                    <div
                      key={index}
                      className="glass-card-gold p-6 glow-border transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-gold/20"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-16 w-16 rounded-full bg-gold/20 flex items-center justify-center border-2 border-gold/40">
                          <span className="text-2xl font-poppins font-bold text-gold">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-poppins font-bold text-gold">{member.name}</h3>
                          <p className="text-sm metallic-text-secondary font-inter">{member.role}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs metallic-text-secondary font-inter mb-1">Contribution</p>
                          <p className="metallic-text-secondary font-inter leading-relaxed">
                            {member.contribution}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs metallic-text-secondary font-inter mb-1">Impact</p>
                          <p className="text-gold font-inter font-semibold">{member.impact}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SmokySectionTransition>

            <SmokySectionTransition delay={400}>
              <div className="mb-16">
                <h2 className="text-4xl font-poppins font-bold text-gold mb-8 text-center">
                  Active Community Initiatives
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {initiatives.map((initiative, index) => (
                    <div
                      key={index}
                      className="glass-card p-6 glow-border transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-gold/20"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30 flex-shrink-0">
                          <initiative.icon className="h-6 w-6 text-gold" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-poppins font-bold text-gold mb-2">
                            {initiative.title}
                          </h3>
                          <p className="metallic-text-secondary font-inter leading-relaxed mb-3">
                            {initiative.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gold" />
                            <span className="text-sm font-jetbrains text-gold">
                              {initiative.participants} participants
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SmokySectionTransition>

            <SmokySectionTransition delay={500}>
              <div className="glass-card-gold p-8 text-center glow-border">
                <Heart className="h-12 w-12 text-gold mx-auto mb-4" />
                <h3 className="text-2xl font-poppins font-bold text-gold mb-4">
                  Join Our Community
                </h3>
                <p className="metallic-text-secondary font-inter leading-relaxed max-w-2xl mx-auto mb-6">
                  Be part of the RBS revolution. Contribute, participate, and help shape the future of
                  decentralized finance. All opinions about RBS will be taken from the RBS community to
                  ensure it remains fairly community-driven.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://t.me/RBSuperior"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gold hover:bg-gold/90 text-black font-poppins font-bold rounded-lg transition-all duration-300 metallic-button"
                  >
                    Join Telegram
                  </a>
                  <a
                    href="https://whatsapp.com/channel/0029VbB6FHV59PwWv9wIE93P"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white border-2 border-gold/30 hover:border-gold text-gold font-poppins font-bold rounded-lg transition-all duration-300"
                  >
                    Join WhatsApp
                  </a>
                </div>
              </div>
            </SmokySectionTransition>
          </div>
        </div>
      </div>
    </>
  );
}
