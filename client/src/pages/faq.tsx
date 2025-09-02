import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, MessageCircle } from "lucide-react";

export default function FAQ() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is Action Mining and how does it work?",
      answer: "Action Mining is Bitnun's innovative consensus mechanism that rewards users for legitimate interactions with the platform. Every click, page visit, form submission, and social share generates cryptographic proof of activity, which is validated by our AI-powered system and rewarded with BTN tokens. This creates a sustainable, engaging ecosystem where user participation directly contributes to network security."
    },
    {
      question: "How is Bitnun environmentally sustainable?",
      answer: "Bitnun operates as a carbon-negative blockchain through ultra-lightweight browser-based nodes powered by WASM and Rust. Our Action Mining consensus requires minimal computational power compared to traditional proof-of-work systems, reducing energy consumption by over 99%. Additionally, we partner with environmental organizations to offset carbon footprints and contribute to reforestation projects."
    },
    {
      question: "Do I need to download any software to participate?",
      answer: "No downloads, installations, or technical setup required! Bitnun runs entirely in your web browser using cutting-edge WebAssembly technology. Simply visit our platform, connect your wallet (or create one instantly), and start mining BTN tokens immediately. The platform is compatible with all modern browsers and works seamlessly across desktop, mobile, and tablet devices."
    },
    {
      question: "What are BTN tokens used for?",
      answer: "BTN tokens serve multiple purposes within the ecosystem: transaction fees for smart contracts and NFT trades, governance voting rights for platform decisions, staking for additional rewards, access to premium features and exclusive content, NFT minting and marketplace transactions, and developer API access credits. The 50/50 user-network reward split ensures fair distribution and sustainable growth."
    },
    {
      question: "How does the AI prevent fraud and bot activity?",
      answer: "Our AI system analyzes behavioral patterns, interaction timing, device fingerprinting, and network analysis to detect fraudulent activity. Machine learning models continuously adapt to new attack vectors while legitimate users enjoy seamless mining experiences. The system rewards natural, human-like interaction patterns while automatically filtering out bot activity and click farms."
    },
    {
      question: "Can I use Bitnun on mobile devices?",
      answer: "Yes! Bitnun is fully responsive and optimized for mobile devices. The platform works seamlessly on smartphones and tablets through mobile browsers, with touch-optimized interfaces for mining, NFT browsing, and wallet management. No app downloads required - just visit our website on any device."
    },
    {
      question: "How are BTN token rewards calculated?",
      answer: "BTN rewards are dynamically calculated based on action type, user behavior patterns, network activity, and AI-validated authenticity. Basic interactions like clicks earn smaller rewards (0.05 BTN), while complex actions like social sharing or task completion earn more (0.25-1.0 BTN). The adaptive AI system adjusts rewards to maintain ecosystem balance and prevent gaming."
    },
    {
      question: "What makes Bitnun different from other blockchains?",
      answer: "Bitnun is unique as the first browser-native, carbon-negative blockchain with Action Mining consensus. Unlike traditional blockchains requiring downloads or technical knowledge, Bitnun provides instant participation through web browsers. Our eco-friendly approach, gamified user experience, and AI-powered fraud prevention create a sustainable, accessible blockchain ecosystem for everyone."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="pt-20 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4" data-testid="title-faq">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to know about the Bitnun ecosystem
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="overflow-hidden" data-testid={`faq-item-${index}`}>
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-muted transition-all"
                data-testid={`faq-toggle-${index}`}
              >
                <span className="font-semibold" data-testid={`faq-question-${index}`}>
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`text-muted-foreground transition-transform ${
                    openFAQ === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              {openFAQ === index && (
                <CardContent className="px-6 pb-6 pt-0">
                  <p className="text-muted-foreground" data-testid={`faq-answer-${index}`}>
                    {faq.answer}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <div className="text-center mt-12">
          <Card className="inline-block" data-testid="card-contact-support">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">Our support team is here to help you get started</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button data-testid="button-contact-support">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
                <Button variant="outline" data-testid="button-join-discord">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Join Discord
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
