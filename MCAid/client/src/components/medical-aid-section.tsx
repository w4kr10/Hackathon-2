import { Card, CardContent } from "@/components/ui/card";
import { Utensils, Baby, Globe, Shield, Home, Ribbon, Phone } from "lucide-react";

const medicalAidResources = [
  {
    title: "WIC Program",
    description: "Nutrition education, healthy food, and support for pregnant women, new mothers, and children under 5.",
    icon: Utensils,
    url: "https://www.fns.usda.gov/wic",
    color: "primary"
  },
  {
    title: "HRSA Healthy Start",
    description: "Community-based programs offering comprehensive services for pregnant women and their babies.",
    icon: Baby,
    url: "https://www.hrsa.gov/",
    color: "secondary"
  },
  {
    title: "Every Mother Counts",
    description: "Working to make maternal health safe and equitable for mothers everywhere.",
    icon: Globe,
    url: "https://everymothercounts.org/",
    color: "accent"
  },
  {
    title: "Medicaid & CHIP",
    description: "Health coverage programs for low-income families, pregnant women, and children.",
    icon: Shield,
    url: "https://www.healthcare.gov/medicaid-chip/",
    color: "primary"
  },
  {
    title: "MIECHV Program",
    description: "Home visiting services to improve health outcomes for pregnant women and young families.",
    icon: Home,
    url: "https://mchb.hrsa.gov/programs-impact/maternal-infant-early-childhood-home-visiting-miechv-program",
    color: "secondary"
  },
  {
    title: "March of Dimes",
    description: "Resources for preventing birth defects, premature birth, and supporting healthy families.",
    icon: Ribbon,
    url: "https://www.marchofdimes.org/",
    color: "accent"
  }
];

export default function MedicalAidSection() {
  return (
    <section id="medical-aid" className="scroll-mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-medical-aid-title">
          Connect to Trusted Medical Care
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-medical-aid-description">
          Access reliable healthcare resources and programs designed specifically for mothers and children. 
          Always consult with healthcare professionals for personalized medical advice.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medicalAidResources.map((resource, index) => {
          const IconComponent = resource.icon;
          return (
            <Card key={index} className="card-hover" data-testid={`card-medical-aid-${index}`}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 bg-${resource.color}/10 rounded-lg flex items-center justify-center mr-4`}>
                    <IconComponent className={`text-${resource.color}`} size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground" data-testid={`text-resource-title-${index}`}>
                    {resource.title}
                  </h3>
                </div>
                <p className="text-muted-foreground mb-4" data-testid={`text-resource-description-${index}`}>
                  {resource.description}
                </p>
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                  data-testid={`link-resource-${index}`}
                >
                  Learn More 
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Emergency Contact */}
      <Card className="bg-destructive/10 border border-destructive/20 mt-8">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Phone className="text-destructive mr-3" size={20} />
            <h3 className="text-lg font-semibold text-foreground" data-testid="text-emergency-title">
              Emergency Assistance
            </h3>
          </div>
          <p className="text-muted-foreground mb-3" data-testid="text-emergency-description">
            For immediate pregnancy and child health assistance:
          </p>
          <a 
            href="tel:1-800-311-2229" 
            className="text-destructive font-semibold text-lg hover:text-destructive/80"
            data-testid="link-emergency-hotline"
          >
            1-800-311-BABY (1-800-311-2229)
          </a>
        </CardContent>
      </Card>
    </section>
  );
}
