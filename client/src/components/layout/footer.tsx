import { Leaf } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12" data-testid="footer">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2" data-testid="footer-logo">
              <div className="w-8 h-8 eco-gradient rounded-lg flex items-center justify-center">
                <Leaf className="text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Bitnun</span>
            </div>
            <p className="text-muted-foreground">
              Building the future of sustainable blockchain technology, one action at a time.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="social-twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="social-discord"
              >
                <i className="fab fa-discord"></i>
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="social-github"
              >
                <i className="fab fa-github"></i>
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="social-medium"
              >
                <i className="fab fa-medium"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/dashboard">
                  <span className="hover:text-primary transition-colors cursor-pointer" data-testid="footer-link-dashboard">
                    Dashboard
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/nft-marketplace">
                  <span className="hover:text-primary transition-colors cursor-pointer" data-testid="footer-link-nft">
                    NFT Marketplace
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/wallet">
                  <span className="hover:text-primary transition-colors cursor-pointer" data-testid="footer-link-wallet">
                    Wallet
                  </span>
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="footer-link-staking">
                  Staking
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Developers</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/developer">
                  <span className="hover:text-primary transition-colors cursor-pointer" data-testid="footer-link-docs">
                    Documentation
                  </span>
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="footer-link-api">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="footer-link-sdks">
                  SDKs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="footer-link-github">
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/faq">
                  <span className="hover:text-primary transition-colors cursor-pointer" data-testid="footer-link-help">
                    Help Center
                  </span>
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="footer-link-community">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="footer-link-bounty">
                  Bug Bounty
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="footer-link-contact">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 mt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-muted-foreground text-sm" data-testid="copyright">
            © 2024 Bitnun. All rights reserved. Carbon-negative blockchain platform.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
              data-testid="footer-link-privacy"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
              data-testid="footer-link-terms"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
              data-testid="footer-link-cookies"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
