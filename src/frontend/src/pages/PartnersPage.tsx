import { PageHead } from "@/components/PageHead";
import { SmokySectionTransition } from "@/components/SmokySectionTransition";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code, Globe, Handshake, Users } from "lucide-react";
import React from "react";

const partnerCategories = [
  {
    icon: Handshake,
    title: "Strategic Partners",
    description: "Leading organizations collaborating on RBS ecosystem growth",
    partners: [
      { name: "Blockchain Alliance", role: "Strategic Advisor" },
      { name: "DeFi Consortium", role: "Integration Partner" },
      { name: "Crypto Ventures", role: "Investment Partner" },
    ],
  },
  {
    icon: Code,
    title: "Technology Partners",
    description: "Technical collaborators enhancing RBS infrastructure",
    partners: [
      { name: "Internet Computer", role: "Infrastructure Provider" },
      { name: "Oracle Networks", role: "Data Provider" },
      { name: "Security Labs", role: "Audit Partner" },
    ],
  },
  {
    icon: Users,
    title: "Community Partners",
    description: "Organizations supporting RBS community initiatives",
    partners: [
      { name: "Crypto Education Hub", role: "Education Partner" },
      { name: "Developer Guild", role: "Developer Community" },
      { name: "Blockchain Events", role: "Event Partner" },
    ],
  },
];

export default function PartnersPage() {
  return (
    <>
      <PageHead
        title="Partners & Ecosystem | RBS"
        description="Our strategic partners and ecosystem collaborators"
      />
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 py-12 px-4">
        <SmokySectionTransition>
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                Partners & Ecosystem
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Building the future of decentralized finance together with
                industry leaders
              </p>
            </div>

            <div className="space-y-8">
              {partnerCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <SmokySectionTransition
                    key={category.title}
                    delay={100 * (index + 1)}
                  >
                    <Card className="bg-white border border-gray-200 shadow-sm border-gold/20">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-gold/10">
                            <Icon className="h-6 w-6 text-gold" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl">
                              {category.title}
                            </CardTitle>
                            <CardDescription className="text-base mt-1">
                              {category.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                          {category.partners.map((partner) => (
                            <div
                              key={partner.name}
                              className="p-4 rounded-lg bg-muted/50 border border-border hover:border-gold/30 transition-all duration-300"
                            >
                              <h3 className="font-semibold text-lg mb-1">
                                {partner.name}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {partner.role}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </SmokySectionTransition>
                );
              })}
            </div>

            <SmokySectionTransition delay={400}>
              <Card className="bg-white border border-gray-200 shadow-sm border-gold/20">
                <CardHeader>
                  <CardTitle>Partnership Benefits</CardTitle>
                  <CardDescription>
                    What our partners gain from collaboration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Globe className="h-5 w-5 text-gold" />
                        Global Reach
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Access to RBS's growing global community and network
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Code className="h-5 w-5 text-gold" />
                        Technical Integration
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Seamless integration with RBS infrastructure and tools
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Users className="h-5 w-5 text-gold" />
                        Community Support
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Collaborative support from RBS community and team
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Handshake className="h-5 w-5 text-gold" />
                        Strategic Alignment
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Aligned vision for the future of decentralized finance
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SmokySectionTransition>
          </div>
        </SmokySectionTransition>
      </div>
    </>
  );
}
