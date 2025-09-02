import { useState } from "react";
import { useAuth } from "@/lib/auth";
import AuthModal from "@/components/auth-modal";
import HeroSection from "@/components/hero-section";
import MedicalAidSection from "@/components/medical-aid-section";
import HealthGuidelines from "@/components/health-guidelines";
import NutritionSection from "@/components/nutrition-section";
import RecipesSection from "@/components/recipes-section";
import AiBotSection from "@/components/ai-bot-section";
import SubscriptionSection from "@/components/subscription-section";
import ConsultationSection from "@/components/consultation-section";
import { Heart, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleAuthClick = () => {
    if (user) {
      logout();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans leading-relaxed">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Heart className="text-primary-foreground" size={18} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Mother & Child Wellness Hub</h1>
                <p className="text-sm text-muted-foreground">Comprehensive family healthcare</p>
              </div>
            </div>
            
            <nav className="hidden lg:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('medical-aid')}
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-medical-aid"
              >
                Medical Aid
              </button>
              <button 
                onClick={() => scrollToSection('pregnancy-advice')}
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-pregnancy"
              >
                Pregnancy
              </button>
              <button 
                onClick={() => scrollToSection('postpartum-advice')}
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-postpartum"
              >
                Postpartum
              </button>
              <button 
                onClick={() => scrollToSection('child-nutrition')}
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-nutrition"
              >
                Nutrition
              </button>
              <button 
                onClick={() => scrollToSection('recipes')}
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-recipes"
              >
                Recipes
              </button>
              <button 
                onClick={() => scrollToSection('ai-bot')}
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-ai-assistant"
              >
                AI Assistant
              </button>
            </nav>
            
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleAuthClick}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-auth-toggle"
              >
                <User className="mr-2" size={16} />
                {user ? `Hi, ${user.name}` : 'Login'}
              </Button>
              <Button variant="ghost" className="lg:hidden p-2" data-testid="button-mobile-menu">
                <Menu size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <HeroSection />
        
        <div className="container mx-auto px-4 py-12 space-y-16">
          <MedicalAidSection />
          <HealthGuidelines />
          <NutritionSection />
          <RecipesSection />
          <AiBotSection />
          <SubscriptionSection />
          <ConsultationSection />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/20 border-t border-border mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Heart className="text-primary-foreground" size={14} />
                </div>
                <span className="font-bold text-foreground">Wellness Hub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Supporting mothers and children with trusted healthcare resources and professional guidance.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('medical-aid')} className="text-muted-foreground hover:text-primary transition-colors">Medical Aid</button></li>
                <li><button onClick={() => scrollToSection('pregnancy-advice')} className="text-muted-foreground hover:text-primary transition-colors">Pregnancy Care</button></li>
                <li><button onClick={() => scrollToSection('child-nutrition')} className="text-muted-foreground hover:text-primary transition-colors">Child Nutrition</button></li>
                <li><button onClick={() => scrollToSection('ai-bot')} className="text-muted-foreground hover:text-primary transition-colors">AI Assistant</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Emergency</h4>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">24/7 Pregnancy Support:</p>
                <a 
                  href="tel:1-800-311-2229" 
                  className="text-primary font-medium hover:text-primary/80"
                  data-testid="link-emergency-phone"
                >
                  1-800-311-BABY
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; 2025 Mother & Child Wellness Hub. Information sourced from reliable organizations like WHO, CDC, and medical professionals. 
              <strong> Not a substitute for professional medical advice.</strong>
            </p>
            <div className="flex justify-center space-x-6 mt-4">
              <a href="https://www.who.int/" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary">WHO Guidelines</a>
              <a href="https://www.cdc.gov/" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary">CDC Resources</a>
              <a href="https://www.acog.org/" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary">ACOG Standards</a>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
