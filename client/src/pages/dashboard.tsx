import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { useActionMining } from "@/hooks/use-action-mining";
import { Coins, MousePointer, Trophy, Leaf, Star, Share2, CheckSquare, Gift, Users, Settings, Database, Brain, Shield } from "lucide-react";
import { BlockchainDashboard, ProofOfActionCard } from "@/components/blockchain/blockchain-dashboard";
import type { User, Action, Achievement } from "@shared/schema";

interface UserStatsResponse {
  user: User;
  recentActions: Action[];
  achievements: Achievement[];
  transactions: any[];
}

export default function Dashboard() {
  const { incrementActions, actionCount } = useActionMining();
  
  const { data: userStats, isLoading } = useQuery<UserStatsResponse>({
    queryKey: ["/api/user/default-user/stats"],
  });

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const user = userStats?.user;
  const recentActions = userStats?.recentActions || [];
  const achievements = userStats?.achievements || [];

  const handleMiningAction = (type: string, reward: number = 5) => {
    incrementActions(type, reward);
  };

  return (
    <div>
      <div className="pt-20 py-20">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" data-testid="title-dashboard">Mining Dashboard</h1>
            <p className="text-muted-foreground">Track your mining progress, rewards, and ecosystem participation</p>
          </div>
          {/* Blockchain Dashboard */}
          <BlockchainDashboard />
          {/* Mining Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="stats-card" data-testid="card-btn-balance">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Coins className="text-primary-foreground" />
                  </div>
                  <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">+12.5%</span>
                </div>
                <div className="text-2xl font-bold mb-1">{user?.btnBalance || 0}</div>
                <div className="text-sm text-muted-foreground">BTN Balance</div>
              </CardContent>
            </Card>
            <Card className="stats-card" data-testid="card-actions-today">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                    <MousePointer className="text-accent-foreground" />
                  </div>
                  <span className="text-xs text-accent bg-accent/10 px-2 py-1 rounded-full">Today</span>
                </div>
                <div className="text-2xl font-bold mb-1">{actionCount}</div>
                <div className="text-sm text-muted-foreground">Actions Mined</div>
              </CardContent>
            </Card>
            <Card className="stats-card" data-testid="card-rank">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <Trophy className="text-secondary-foreground" />
                  </div>
                  <span className="text-xs text-secondary bg-secondary/10 px-2 py-1 rounded-full">#{user?.rank || 47}</span>
                </div>
                <div className="text-2xl font-bold mb-1">Top 50</div>
                <div className="text-sm text-muted-foreground">Global Rank</div>
              </CardContent>
            </Card>
            <Card className="stats-card" data-testid="card-carbon-saved">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Leaf className="text-primary-foreground" />
                  </div>
                  <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">Saved</span>
                </div>
                <div className="text-2xl font-bold mb-1">{((user?.carbonSaved || 0) / 1000).toFixed(1)} kg</div>
                <div className="text-sm text-muted-foreground">CO2 Prevented</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Mining Activity */}
            <div className="lg:col-span-2">
              <Card data-testid="card-mining-activity">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Mining Activity</CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mining-pulse"></div>
                      <span className="text-sm text-muted-foreground">Live</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Action Mining Interface */}
                  <div className="space-y-4 mb-6">
                    <Card className="bg-muted">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Current Mining Session</span>
                          <span className="text-sm text-primary">+{(actionCount * 0.05).toFixed(2)} BTN earned</span>
                        </div>
                        <Progress value={Math.min((actionCount % 100), 100)} className="mb-2" />
                        <div className="text-xs text-muted-foreground">
                          Session: Active • Next bonus in {100 - (actionCount % 100)} actions
                        </div>
                      </CardContent>
                    </Card>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        onClick={() => handleMiningAction("click", 5)}
                        className="mining-action bg-primary/10 hover:bg-primary/20 border border-primary/30 h-auto p-4 flex-col gap-2 transition-all transform hover:scale-105"
                        variant="outline"
                        data-testid="button-click-mine"
                      >
                        <MousePointer className="text-primary text-2xl" />
                        <div className="font-medium">Click Mine</div>
                        <div className="text-xs text-muted-foreground">+0.05 BTN per click</div>
                      </Button>
                      <Button
                        onClick={() => handleMiningAction("share", 25)}
                        className="mining-action bg-accent/10 hover:bg-accent/20 border border-accent/30 h-auto p-4 flex-col gap-2 transition-all transform hover:scale-105"
                        variant="outline"
                        data-testid="button-share-earn"
                      >
                        <Share2 className="text-accent text-2xl" />
                        <div className="font-medium">Share & Earn</div>
                        <div className="text-xs text-muted-foreground">+0.25 BTN per share</div>
                      </Button>
                    </div>
                  </div>
                  {/* Recent Activity */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-muted-foreground text-sm">Recent Mining Actions</h3>
                    {recentActions.length > 0 ? (
                      recentActions.map((action, index) => (
                        <div key={action.id || index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                              <MousePointer className="text-primary text-xs" />
                            </div>
                            <span className="text-sm">{action.type} mining</span>
                          </div>
                          <div className="text-sm font-medium text-primary">+{((action.reward || 0) / 100).toFixed(2)} BTN</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <MousePointer className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Start mining to see your activity here</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Side Panel */}
            <div className="space-y-6">
              {/* Proof-of-Action Info */}
              <ProofOfActionCard />
              {/* Achievements */}
              <Card data-testid="card-achievements">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievements.slice(0, 2).map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-2 bg-primary/10 rounded-lg">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Star className="text-primary-foreground text-sm" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{achievement.name}</div>
                          <div className="text-xs text-muted-foreground">{achievement.description}</div>
                        </div>
                      </div>
                    ))}
                    {achievements.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Complete actions to earn achievements</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              {/* Quick Actions */}
              <Card data-testid="card-quick-actions">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full" onClick={() => handleMiningAction("daily_bonus", 100)} data-testid="button-daily-bonus">
                      <Gift className="mr-2 h-4 w-4" />
                      Claim Daily Bonus
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="button-invite-friends">
                      <Users className="mr-2 h-4 w-4" />
                      Invite Friends
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="button-mining-settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Mining Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
