import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Leaf, Menu, X } from "lucide-react";
import { useActionMining } from "@/hooks/use-action-mining";

export default function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { miningStatus } = useActionMining();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/nft-marketplace", label: "NFT Marketplace" },
    { path: "/wallet", label: "Wallet" },
    { path: "/gamification", label: "Gamification" },
    { path: "/developer", label: "Developer" },
    { path: "/roadmap", label: "Roadmap" },
    { path: "/faq", label: "FAQ" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-border">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer" data-testid="logo">
            <div className="w-8 h-8 eco-gradient rounded-lg flex items-center justify-center">
              <Leaf className="text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Bitnun</span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <Button
                variant={isActive(item.path) ? "default" : "ghost"}
                className={`px-4 py-2 transition-all ${
                  isActive(item.path) 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted"
                }`}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-muted px-3 py-1 rounded-lg" data-testid="mining-status">
            <div className="w-2 h-2 bg-primary rounded-full mining-pulse"></div>
            <span className="text-sm">{miningStatus}</span>
          </div>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-secondary transition-all"
            data-testid="button-connect-wallet"
          >
            Connect Wallet
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card glassmorphism" data-testid="mobile-menu">
          <div className="container mx-auto px-6 py-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive(item.path) ? "bg-primary text-primary-foreground" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-lg mb-3">
                <div className="w-2 h-2 bg-primary rounded-full mining-pulse"></div>
                <span className="text-sm">{miningStatus}</span>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-secondary">
                Connect Wallet
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
