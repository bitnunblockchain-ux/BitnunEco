import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ActionMiningProvider } from "@/hooks/use-action-mining";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import MiningCounter from "@/components/action-mining/mining-counter";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import NFTMarketplace from "@/pages/nft-marketplace";
import Wallet from "@/pages/wallet";
import Gamification from "@/pages/gamification";
import Developer from "@/pages/developer";
import Roadmap from "@/pages/roadmap";
import FAQ from "@/pages/faq";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/nft-marketplace" component={NFTMarketplace} />
      <Route path="/wallet" component={Wallet} />
      <Route path="/gamification" component={Gamification} />
      <Route path="/developer" component={Developer} />
      <Route path="/roadmap" component={Roadmap} />
      <Route path="/faq" component={FAQ} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ActionMiningProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main>
              <Router />
            </main>
            <Footer />
            <MiningCounter />
          </div>
          <Toaster />
        </ActionMiningProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
