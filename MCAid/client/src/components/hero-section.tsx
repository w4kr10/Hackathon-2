import { Button } from "@/components/ui/button";
import { Stethoscope, Bot } from "lucide-react";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="hero-gradient text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="text-hero-title">
            Supporting Every Step of Your Motherhood Journey
          </h2>
          <p className="text-xl mb-8 opacity-90" data-testid="text-hero-description">
            Connecting pregnant mothers, new parents, and children under 5 to trusted medical care, expert advice, and comprehensive nutrition guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => scrollToSection('medical-aid')}
              className="bg-card text-primary hover:bg-card/90 transition-colors"
              data-testid="button-find-medical-care"
            >
              <Stethoscope className="mr-2" size={16} />
              Find Medical Care
            </Button>
            <Button 
              onClick={() => scrollToSection('ai-bot')}
              variant="outline"
              className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors"
              data-testid="button-ask-ai-assistant"
            >
              <Bot className="mr-2" size={16} />
              Ask AI Assistant
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
