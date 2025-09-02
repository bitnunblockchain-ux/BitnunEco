import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Star, Users } from "lucide-react";
import type { User, Achievement } from "@shared/schema";

interface UserStatsResponse {
  user: User;
  recentActions: any[];
  achievements: Achievement[];
  transactions: any[];
}

export default function Gamification() {
  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery<User[]>({
    queryKey: ["/api/leaderboard"],
  });

  const { data: userStats } = useQuery<UserStatsResponse>({
    queryKey: ["/api/user/default-user/stats"],
  });

  if (leaderboardLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading gamification hub...</p>
        </div>
      </div>
    );
  }

  const user = userStats?.user;
  const achievements = userStats?.achievements || [];
  const experienceProgress = user ? ((user.experience % 1000) / 1000) * 100 : 0;

  return (
    <div className="pt-20 py-20">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="title-gamification">Gamification Hub</h1>
          <p className="text-muted-foreground">Compete, achieve, and earn rewards in the Bitnun ecosystem</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Leaderboards */}
          <div className="lg:col-span-2">
            <Card data-testid="card-leaderboard">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Global Leaderboard</CardTitle>
                  <div className="flex space-x-2">
                    <Button size="sm" data-testid="button-daily">Daily</Button>
                    <Button variant="outline" size="sm" data-testid="button-weekly">Weekly</Button>
                    <Button variant="outline" size="sm" data-testid="button-all-time">All Time</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard?.slice(0, 10).map((leaderUser, index) => (
                    <div 
                      key={leaderUser.id} 
                      className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                        leaderUser.id === user?.id ? 'bg-primary/10 border border-primary' : 'bg-muted hover:bg-input'
                      }`}
                      data-testid={`leaderboard-entry-${index}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                          index === 0 ? 'bg-primary text-primary-foreground' :
                          index === 1 ? 'bg-secondary text-secondary-foreground' :
                          index === 2 ? 'bg-accent text-accent-foreground' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          <span>{index + 1}</span>
                        </div>
                        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                          <span className="font-bold text-accent-foreground">
                            {leaderUser.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium" data-testid={`leaderboard-username-${index}`}>
                            {leaderUser.id === user?.id ? "You" : leaderUser.username}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Level {leaderUser.level} • {leaderUser.title}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary" data-testid={`leaderboard-balance-${index}`}>
                          {leaderUser.btnBalance} BTN
                        </div>
                        <div className="text-sm text-muted-foreground">Total Balance</div>
                      </div>
                    </div>
                  ))}
                  {!leaderboard?.length && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No leaderboard data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements & Challenges */}
          <div className="space-y-6">
            {/* Current Level */}
            <Card data-testid="card-user-progress">
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-accent-foreground" data-testid="text-user-level">
                      {user?.level || 1}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold" data-testid="text-user-title">{user?.title || "New Miner"}</div>
                    <div className="text-sm text-muted-foreground">Level {user?.level || 1}</div>
                  </div>
                  <div className="w-full">
                    <Progress value={experienceProgress} className="mb-2" />
                    <div className="text-xs text-muted-foreground" data-testid="text-experience-progress">
                      {user?.experience || 0} / {((user?.level || 1) * 1000)} XP to next level
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card data-testid="card-achievements">
              <CardHeader>
                <CardTitle className="text-lg">Latest Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3 p-2 bg-primary/10 rounded-lg">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Star className="text-primary-foreground text-sm" />
                      </div>
                      <div>
                        <div className="text-sm font-medium" data-testid={`achievement-name-${achievement.id}`}>
                          {achievement.name}
                        </div>
                        <div className="text-xs text-muted-foreground" data-testid={`achievement-description-${achievement.id}`}>
                          {achievement.description}
                        </div>
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

            {/* Daily Challenges */}
            <Card data-testid="card-daily-challenges">
              <CardHeader>
                <CardTitle className="text-lg">Daily Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Complete 100 actions</span>
                      <span className="text-xs text-primary">73/100</span>
                    </div>
                    <Progress value={73} className="h-1.5" />
                    <div className="text-xs text-muted-foreground">Reward: +5 BTN</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Share 3 posts</span>
                      <span className="text-xs text-accent">2/3</span>
                    </div>
                    <Progress value={67} className="h-1.5" />
                    <div className="text-xs text-muted-foreground">Reward: +10 BTN</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
