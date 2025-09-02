import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ArrowUp, ArrowDown, Wallet as WalletIcon, ShoppingCart, Gift, ArrowRightLeft, Shield, Bell, Download } from "lucide-react";
import type { User, Transaction } from "@shared/schema";

interface UserStatsResponse {
  user: User;
  recentActions: any[];
  achievements: any[];
  transactions: Transaction[];
}

export default function Wallet() {
  const { data: userStats, isLoading } = useQuery<UserStatsResponse>({
    queryKey: ["/api/user/default-user/stats"],
  });

  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: ["/api/user/default-user/transactions"],
  });

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading wallet...</p>
        </div>
      </div>
    );
  }

  const user = userStats?.user;
  const usdValue = user?.btnBalance ? (user.btnBalance * 0.5).toFixed(2) : "0.00";

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "mining":
        return <ArrowDown className="text-primary" />;
      case "purchase":
        return <ShoppingCart className="text-accent" />;
      case "bonus":
        return <Gift className="text-secondary" />;
      default:
        return <ArrowDown className="text-primary" />;
    }
  };

  const getTransactionColor = (type: string, amount: number) => {
    if (amount > 0) return "text-primary";
    return "text-destructive";
  };

  return (
    <div className="pt-20 py-20">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="title-wallet">BTN Wallet</h1>
          <p className="text-muted-foreground">Manage your BTN tokens and transaction history</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Wallet Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Card */}
            <Card className="mining-glow" data-testid="card-balance">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                    <WalletIcon className="text-primary-foreground text-2xl" />
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2" data-testid="text-total-balance">
                      {user?.btnBalance || 0} BTN
                    </div>
                    <div className="text-muted-foreground">Total Balance</div>
                  </div>
                  <div className="text-primary text-lg font-medium" data-testid="text-usd-value">
                    ≈ ${usdValue} USD
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card data-testid="card-transaction-history">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Transaction History</CardTitle>
                  <Button variant="ghost" size="sm" data-testid="button-export">
                    <Download className="mr-1 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions?.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <div className="font-medium" data-testid={`transaction-description-${transaction.id}`}>
                            {transaction.description}
                          </div>
                          <div className="text-sm text-muted-foreground" data-testid={`transaction-date-${transaction.id}`}>
                            {new Date(transaction.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${getTransactionColor(transaction.type, transaction.amount)}`}>
                          {transaction.amount > 0 ? '+' : ''}{(transaction.amount / 100).toFixed(2)} BTN
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">{transaction.type}</div>
                      </div>
                    </div>
                  ))}
                  {!transactions?.length && (
                    <div className="text-center py-8 text-muted-foreground">
                      <WalletIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No transactions yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Wallet Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card data-testid="card-quick-actions">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" data-testid="button-send-btn">
                    <ArrowUp className="mr-2 h-4 w-4" />
                    Send BTN
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="button-receive-btn">
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Receive BTN
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="button-swap-tokens">
                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                    Swap Tokens
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Staking Rewards */}
            <Card data-testid="card-staking-rewards">
              <CardHeader>
                <CardTitle className="text-lg">Staking Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Card className="bg-muted">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Staked Amount</span>
                        <span className="text-sm text-primary" data-testid="text-staked-amount">500.0 BTN</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">APY</span>
                        <span className="text-sm text-accent" data-testid="text-apy">12.5%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Earned</span>
                        <span className="text-sm text-secondary" data-testid="text-staking-earned">+6.25 BTN</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Button className="w-full" data-testid="button-claim-rewards">
                    Claim Rewards
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Wallet Settings */}
            <Card data-testid="card-wallet-settings">
              <CardHeader>
                <CardTitle className="text-lg">Wallet Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-between" data-testid="button-security">
                    <span className="flex items-center">
                      <Shield className="mr-3 h-4 w-4 text-primary" />
                      Security
                    </span>
                    <ArrowDown className="h-4 w-4 text-muted-foreground rotate-[-90deg]" />
                  </Button>
                  <Button variant="ghost" className="w-full justify-between" data-testid="button-notifications">
                    <span className="flex items-center">
                      <Bell className="mr-3 h-4 w-4 text-accent" />
                      Notifications
                    </span>
                    <ArrowDown className="h-4 w-4 text-muted-foreground rotate-[-90deg]" />
                  </Button>
                  <Button variant="ghost" className="w-full justify-between" data-testid="button-backup-wallet">
                    <span className="flex items-center">
                      <Download className="mr-3 h-4 w-4 text-secondary" />
                      Backup Wallet
                    </span>
                    <ArrowDown className="h-4 w-4 text-muted-foreground rotate-[-90deg]" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
