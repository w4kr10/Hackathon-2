import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

const pregnancyGuidelines = [
  "Schedule at least 8 contacts with healthcare providers, including a minimum of 4 antenatal visits.",
  "Get an early ultrasound before 24 weeks for accurate gestational age assessment.",
  "Take multiple micronutrient supplements as recommended by your healthcare provider.",
  "Focus on proper nutrition, maternal assessments, and preventive measures like tetanus vaccination."
];

const postpartumGuidelines = [
  "Receive care within 24 hours of birth and stay at least 24 hours in a health facility.",
  "Schedule follow-up checkups at 3 days, 1-2 weeks, and 6 weeks postpartum.",
  "Focus on breastfeeding support, monitoring for complications, and emotional well-being.",
  "Address both maternal and newborn needs with routine health evaluations."
];

export default function HealthGuidelines() {
  return (
    <section className="grid lg:grid-cols-2 gap-8">
      {/* Pregnancy Advice */}
      <Card id="pregnancy-advice" className="scroll-mt-20">
        <CardContent className="p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                <path d="M12 6c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                <path d="M12 14c-2.33 0-7 1.17-7 3.5v1.5h14v-1.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground" data-testid="text-pregnancy-title">
              Optimal Practices During Pregnancy
            </h2>
          </div>
          
          <p className="text-muted-foreground mb-6" data-testid="text-pregnancy-description">
            Follow these evidence-based recommendations for a healthy pregnancy journey.
          </p>
          
          <div className="space-y-4">
            {pregnancyGuidelines.map((guideline, index) => (
              <div key={index} className="flex items-start space-x-3" data-testid={`item-pregnancy-guideline-${index}`}>
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="text-primary-foreground" size={12} />
                </div>
                <p className="text-foreground">{guideline}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Postpartum Advice */}
      <Card id="postpartum-advice" className="scroll-mt-20">
        <CardContent className="p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground" data-testid="text-postpartum-title">
              Optimal Practices After Pregnancy
            </h2>
          </div>
          
          <p className="text-muted-foreground mb-6" data-testid="text-postpartum-description">
            Postpartum care is crucial for both mother and baby health during recovery.
          </p>
          
          <div className="space-y-4">
            {postpartumGuidelines.map((guideline, index) => (
              <div key={index} className="flex items-start space-x-3" data-testid={`item-postpartum-guideline-${index}`}>
                <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="text-secondary-foreground" size={12} />
                </div>
                <p className="text-foreground">{guideline}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
