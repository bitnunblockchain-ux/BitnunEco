import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Leaf, MousePointer, Share2, CheckSquare, Cpu, Gamepad2, Code } from "lucide-react";

interface StatsResponse {
  activeMiners: string;
  carbonSaved: string;
  transactionsToday: string;
  totalActions: number;
  topMiners: any[];
}

export default function Home() {
  const { data: stats } = useQuery<StatsResponse>({
    queryKey: ["/api/stats"],
  });

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted to-card opacity-90"></div>
        {/* Floating particles effect overlay */}
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              radial-gradient(2px 2px at 20px 30px, rgba(16, 185, 129, 0.3), transparent), 
              radial-gradient(2px 2px at 40px 70px, rgba(6, 182, 212, 0.2), transparent), 
              radial-gradient(1px 1px at 90px 40px, rgba(34, 197, 94, 0.3), transparent)
            `
          }}
        ></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  The Future of
                  <span className="eco-gradient bg-clip-text text-transparent"> Sustainable</span>
                  <br />Blockchain
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Participate in the world's first browser-native, eco-friendly blockchain ecosystem. 
                  Earn BTN tokens through Action Mining while contributing to a carbon-negative future.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button 
                    size="lg" 
                    className="bg-primary text-primary-foreground hover:bg-secondary transition-all transform hover:scale-105 mining-glow"
                    data-testid="button-start-mining"
                  >
                    Start Mining Now
                  </Button>
                </Link>
                <Link href="/faq">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-border text-foreground hover:bg-muted transition-all"
                    data-testid="button-learn-more"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center" data-testid="stat-active-miners">
                  <div className="text-2xl font-bold text-primary">{stats?.activeMiners || "2.4M+"}</div>
                  <div className="text-sm text-muted-foreground">Active Miners</div>
                </div>
                <div className="text-center" data-testid="stat-carbon-saved">
                  <div className="text-2xl font-bold text-accent">{stats?.carbonSaved || "150K"}</div>
                  <div className="text-sm text-muted-foreground">CO2 Saved (tons)</div>
                </div>
                <div className="text-center" data-testid="stat-transactions">
                  <div className="text-2xl font-bold text-secondary">{stats?.transactionsToday || "45.2K"}</div>
                  <div className="text-sm text-muted-foreground">Transactions Today</div>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Interactive blockchain visualization */}
              <Card className="glassmorphism" data-testid="card-network-activity">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Live Network Activity</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full mining-pulse"></div>
                        <span className="text-sm text-muted-foreground">Real-time</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-muted rounded-lg p-4 text-center" data-testid="mining-type-click">
                        <MousePointer className="text-primary text-xl mb-2 mx-auto" />
                        <div className="text-sm text-muted-foreground">Click Mining</div>
                        <div className="text-lg font-bold">+0.05 BTN</div>
                      </div>
                      <div className="bg-muted rounded-lg p-4 text-center" data-testid="mining-type-share">
                        <Share2 className="text-accent text-xl mb-2 mx-auto" />
                        <div className="text-sm text-muted-foreground">Social Shares</div>
                        <div className="text-lg font-bold">+0.25 BTN</div>
                      </div>
                      <div className="bg-muted rounded-lg p-4 text-center" data-testid="mining-type-task">
                        <CheckSquare className="text-secondary text-xl mb-2 mx-auto" />
                        <div className="text-sm text-muted-foreground">Task Complete</div>
                        <div className="text-lg font-bold">+1.0 BTN</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Your Mining Progress</span>
                        <span className="text-primary font-medium">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                      <div className="text-xs text-muted-foreground">Next reward in 22 actions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Revolutionary Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the next generation of blockchain technology with zero setup, instant rewards, and sustainable practices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="stats-card" data-testid="feature-action-mining">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Leaf className="text-primary-foreground text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Action Mining</h3>
                <p className="text-muted-foreground">
                  Every click, share, and interaction generates cryptographic proof and rewards you with BTN tokens instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="stats-card" data-testid="feature-browser-native">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                  <Cpu className="text-accent-foreground text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Browser-Native</h3>
                <p className="text-muted-foreground">
                  No downloads, installations, or technical setup. Start mining and trading NFTs directly in your browser.
                </p>
              </CardContent>
            </Card>

            <Card className="stats-card" data-testid="feature-carbon-negative">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                  <Leaf className="text-secondary-foreground text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Carbon Negative</h3>
                <p className="text-muted-foreground">
                  Ultra-lightweight nodes powered by WASM and Rust ensure minimal energy consumption and maximum sustainability.
                </p>
              </CardContent>
            </Card>

            <Card className="stats-card" data-testid="feature-ai-powered">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Cpu className="text-primary-foreground text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Powered</h3>
                <p className="text-muted-foreground">
                  Smart consensus mechanism with fraud detection, predictive analytics, and adaptive reward optimization.
                </p>
              </CardContent>
            </Card>

            <Card className="stats-card" data-testid="feature-gamified">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                  <Gamepad2 className="text-accent-foreground text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Gamified Experience</h3>
                <p className="text-muted-foreground">
                  Earn achievements, climb leaderboards, and unlock exclusive NFT rewards through engaging challenges.
                </p>
              </CardContent>
            </Card>

            <Card className="stats-card" data-testid="feature-developer-friendly">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                  <Code className="text-secondary-foreground text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Developer Friendly</h3>
                <p className="text-muted-foreground">
                  Modular architecture with comprehensive APIs, SDKs, and documentation for seamless integration.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
