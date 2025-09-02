import { Card, CardContent } from "@/components/ui/card";
import { Check, Settings, Clock, Eye } from "lucide-react";

export default function Roadmap() {
  const phases = [
    {
      phase: 1,
      title: "MVP Launch",
      status: "completed",
      period: "Q1 2024",
      description: "Core platform infrastructure with browser-native mining capabilities",
      features: [
        "Action Mining implementation",
        "Basic wallet functionality", 
        "WASM node deployment",
        "Initial BTN tokenomics"
      ],
      icon: Check,
      color: "primary"
    },
    {
      phase: 2,
      title: "NFT & Gamification",
      status: "in-progress",
      period: "Q2 2024",
      description: "Enhanced marketplace with gamified user experience",
      features: [
        "Advanced NFT marketplace",
        "Achievement system",
        "Leaderboards & rankings",
        "Creator monetization tools"
      ],
      icon: Settings,
      color: "accent"
    },
    {
      phase: 3,
      title: "AI Integration",
      status: "upcoming",
      period: "Q3 2024", 
      description: "Advanced AI consensus and fraud detection systems",
      features: [
        "Proof-of-Action consensus",
        "AI fraud detection",
        "Predictive analytics",
        "Adaptive reward optimization"
      ],
      icon: Clock,
      color: "secondary"
    },
    {
      phase: 4,
      title: "AR/VR Expansion",
      status: "future",
      period: "Q4 2024",
      description: "Immersive metaverse integration and virtual reality experiences",
      features: [
        "AR/VR compatibility",
        "Metaverse integration", 
        "3D virtual environments",
        "Cross-reality mining"
      ],
      icon: Eye,
      color: "muted"
    }
  ];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return "COMPLETED";
      case "in-progress": return "IN PROGRESS";
      case "upcoming": return "UPCOMING";
      case "future": return "FUTURE";
      default: return status.toUpperCase();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-primary bg-primary/10";
      case "in-progress": return "text-accent bg-accent/10";
      case "upcoming": return "text-secondary bg-secondary/10";
      case "future": return "text-muted-foreground bg-muted/10";
      default: return "text-muted-foreground bg-muted/10";
    }
  };

  return (
    <div className="pt-20 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4" data-testid="title-roadmap">Development Roadmap</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our journey to revolutionize blockchain technology with sustainability and accessibility at its core
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-border h-full hidden md:block"></div>

          <div className="space-y-12">
            {phases.map((phase, index) => (
              <div 
                key={phase.phase}
                className={`flex flex-col md:flex-row items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
                data-testid={`roadmap-phase-${phase.phase}`}
              >
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'} mb-4 md:mb-0`}>
                  <Card className={`${index % 2 === 0 ? 'ml-auto' : 'mr-auto'} md:max-w-md`}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          phase.status === 'completed' ? 'bg-primary' :
                          phase.status === 'in-progress' ? 'bg-accent mining-pulse' :
                          phase.status === 'upcoming' ? 'bg-secondary' :
                          'bg-muted'
                        }`}>
                          <phase.icon className={`text-sm ${
                            phase.status === 'future' ? 'text-muted-foreground' : 'text-white'
                          }`} />
                        </div>
                        <span className={`text-sm font-medium ${getStatusColor(phase.status)} px-2 py-1 rounded-full`}>
                          {getStatusLabel(phase.status)}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2" data-testid={`phase-title-${phase.phase}`}>
                        Phase {phase.phase}: {phase.title}
                      </h3>
                      <p className="text-muted-foreground mb-4" data-testid={`phase-description-${phase.phase}`}>
                        {phase.description}
                      </p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        {phase.features.map((feature, featureIndex) => (
                          <li key={featureIndex} data-testid={`phase-${phase.phase}-feature-${featureIndex}`}>
                            {phase.status === 'completed' ? '✓' : 
                             phase.status === 'in-progress' && featureIndex < 2 ? '✓' :
                             phase.status === 'in-progress' && featureIndex === 2 ? '🔄' :
                             phase.status === 'upcoming' ? '⏳' : '⭐'} {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className={`hidden md:flex w-12 h-12 rounded-full items-center justify-center relative z-10 ${
                  phase.status === 'completed' ? 'bg-primary' :
                  phase.status === 'in-progress' ? 'bg-accent mining-pulse' :
                  phase.status === 'upcoming' ? 'bg-secondary' :
                  'bg-muted'
                }`}>
                  <span className={`font-bold ${
                    phase.status === 'future' ? 'text-muted-foreground' : 'text-white'
                  }`}>
                    {phase.phase}
                  </span>
                </div>
                
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8'}`}>
                  <div className={`text-center ${index % 2 === 1 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="text-sm text-muted-foreground" data-testid={`phase-period-${phase.phase}`}>
                      {phase.period}
                    </div>
                    <div className={`text-lg font-semibold ${
                      phase.status === 'completed' ? 'text-primary' :
                      phase.status === 'in-progress' ? 'text-accent' :
                      phase.status === 'upcoming' ? 'text-secondary' :
                      'text-muted-foreground'
                    }`} data-testid={`phase-status-${phase.phase}`}>
                      {phase.status === 'completed' ? 'Launch Complete' :
                       phase.status === 'in-progress' ? '75% Complete' :
                       phase.status === 'upcoming' ? 'Planning' :
                       'Vision'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
