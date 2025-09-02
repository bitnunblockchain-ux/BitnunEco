import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useActionMining } from "@/hooks/use-action-mining";
import { Shield, Zap, TrendingUp, Activity, Database, Brain } from "lucide-react";

export function BlockchainDashboard() {
  const { blockchainStats, aiStats, userReputation } = useActionMining();

  const reputationColor = userReputation >= 0.8 ? "text-green-400" : 
                         userReputation >= 0.6 ? "text-yellow-400" : "text-red-400";

  const reputationBadge = userReputation >= 0.8 ? "Trusted" : 
                         userReputation >= 0.6 ? "Verified" : "Suspicious";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Card className="bg-card/50 backdrop-blur-sm border-green-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Blockchain Status</CardTitle>
          <Database className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Blocks:</span>
              <Badge variant="secondary">{blockchainStats?.totalBlocks || 0}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Transactions:</span>
              <Badge variant="secondary">{blockchainStats?.totalTransactions || 0}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Mining Difficulty:</span>
              <Badge variant="outline">{blockchainStats?.miningDifficulty || 2}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Carbon Saved:</span>
              <Badge className="bg-green-500/20 text-green-400">
                {blockchainStats?.carbonOffset || 0}g CO₂
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-blue-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI Consensus</CardTitle>
          <Brain className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Users Analyzed:</span>
              <Badge variant="secondary">{aiStats?.totalUsersAnalyzed || 0}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Actions Processed:</span>
              <Badge variant="secondary">{aiStats?.totalActionsProcessed || 0}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Fraud Rate:</span>
              <Badge variant="destructive">
                {((aiStats?.currentFraudRate || 0.05) * 100).toFixed(1)}%
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Avg Authenticity:</span>
              <Badge className="bg-blue-500/20 text-blue-400">
                {((aiStats?.averageAuthenticity || 0.85) * 100).toFixed(0)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-purple-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Your Reputation</CardTitle>
          <Shield className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-2xl font-bold ${reputationColor}`}>
                {(userReputation * 100).toFixed(0)}%
              </span>
              <Badge 
                variant={userReputation >= 0.8 ? "default" : userReputation >= 0.6 ? "secondary" : "destructive"}
              >
                {reputationBadge}
              </Badge>
            </div>
            <Progress 
              value={userReputation * 100} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {userReputation >= 0.8 
                ? "Excellent behavior - maximum rewards!"
                : userReputation >= 0.6 
                  ? "Good behavior - keep it up!"
                  : "Suspicious activity detected - rewards reduced"
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ProofOfActionCard() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-yellow-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-400" />
          Proof-of-Action Mining
        </CardTitle>
        <CardDescription>
          Browser-native blockchain with AI-powered consensus
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground">Consensus:</span>
              <Badge className="w-full justify-center bg-yellow-500/20 text-yellow-400">
                Proof-of-Action
              </Badge>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Security:</span>
              <Badge className="w-full justify-center bg-green-500/20 text-green-400">
                AI-Powered
              </Badge>
            </div>
          </div>
          
          <div className="pt-2 border-t border-border/50">
            <h4 className="font-medium mb-2 flex items-center gap-1">
              <Activity className="h-4 w-4" />
              Features
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Carbon-negative blockchain</li>
              <li>• Real-time fraud detection</li>
              <li>• Adaptive reward optimization</li>
              <li>• Browser-native execution</li>
              <li>• Zero installation required</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}