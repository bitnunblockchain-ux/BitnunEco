import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Book, MessageCircle, HeadphonesIcon } from "lucide-react";

export default function Developer() {
  return (
    <div className="pt-20 py-20">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="title-developer">Developer Portal</h1>
          <p className="text-muted-foreground">Build on Bitnun with our comprehensive APIs and development tools</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* API Documentation */}
          <div className="lg:col-span-3 space-y-6">
            <Card data-testid="card-quick-start">
              <CardHeader>
                <CardTitle>Quick Start Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium mb-2">1. Initialize Bitnun SDK</h3>
                    <div className="bg-background rounded-lg p-3 font-mono text-sm overflow-x-auto">
                      <code className="text-primary">
                        npm install @bitnun/sdk<br/>
                        import {'{ BitnunClient }'} from '@bitnun/sdk'<br/>
                        const client = new BitnunClient({'{ apiKey: \'your_key\' }'})
                      </code>
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium mb-2">2. Start Action Mining</h3>
                    <div className="bg-background rounded-lg p-3 font-mono text-sm overflow-x-auto">
                      <code className="text-accent">
                        client.startMining({'{'}<br/>
                        &nbsp;&nbsp;actions: ['click', 'scroll', 'share'],<br/>
                        &nbsp;&nbsp;rewardRate: 'adaptive'<br/>
                        {'}'})
                      </code>
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium mb-2">3. Mint NFT</h3>
                    <div className="bg-background rounded-lg p-3 font-mono text-sm overflow-x-auto">
                      <code className="text-secondary">
                        const nft = await client.mintNFT({'{'}<br/>
                        &nbsp;&nbsp;metadata: {'{ name: \'Eco Art\', image: url }'},<br/>
                        &nbsp;&nbsp;carbonOffset: true<br/>
                        {'}'})
                      </code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Endpoints */}
            <Card data-testid="card-api-endpoints">
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-mono">GET</span>
                      <span className="font-mono text-sm">/api/v1/mining/stats</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Get mining statistics</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs font-mono">POST</span>
                      <span className="font-mono text-sm">/api/v1/nft/mint</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Mint new NFT</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-mono">GET</span>
                      <span className="font-mono text-sm">/api/v1/wallet/balance</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Check BTN balance</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Developer Tools */}
          <div className="space-y-6">
            {/* SDK Downloads */}
            <Card data-testid="card-sdk-downloads">
              <CardHeader>
                <CardTitle className="text-lg">SDKs & Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-between" data-testid="button-javascript-sdk">
                    <span className="flex items-center">
                      <div className="w-4 h-4 bg-primary rounded mr-3"></div>
                      JavaScript SDK
                    </span>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" className="w-full justify-between" data-testid="button-rust-sdk">
                    <span className="flex items-center">
                      <div className="w-4 h-4 bg-accent rounded mr-3"></div>
                      Rust SDK
                    </span>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" className="w-full justify-between" data-testid="button-python-sdk">
                    <span className="flex items-center">
                      <div className="w-4 h-4 bg-secondary rounded mr-3"></div>
                      Python SDK
                    </span>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Developer Stats */}
            <Card data-testid="card-developer-stats">
              <CardHeader>
                <CardTitle className="text-lg">Developer Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary" data-testid="stat-apps-built">1,247</div>
                    <div className="text-sm text-muted-foreground">Apps Built</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent" data-testid="stat-api-calls">2.4M</div>
                    <div className="text-sm text-muted-foreground">API Calls/Day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary" data-testid="stat-developers">5,623</div>
                    <div className="text-sm text-muted-foreground">Active Developers</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card data-testid="card-support">
              <CardHeader>
                <CardTitle className="text-lg">Get Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" data-testid="button-documentation">
                    <Book className="mr-2 h-4 w-4" />
                    Documentation
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="button-discord">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Discord Community
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="button-support-ticket">
                    <HeadphonesIcon className="mr-2 h-4 w-4" />
                    Support Ticket
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
