import { Card } from "@/components/ui/card";
import { Baby, UserCheck, Users, Lightbulb } from "lucide-react";

const nutritionData = [
  {
    ageGroup: "0-6 months",
    icon: Baby,
    iconColor: "text-primary",
    guidelines: "Exclusive breastfeeding to save lives and promote optimal health and development."
  },
  {
    ageGroup: "6-23 months", 
    icon: UserCheck,
    iconColor: "text-secondary",
    guidelines: "Continue breastfeeding while introducing nutrient-dense complementary foods from various food groups."
  },
  {
    ageGroup: "Under 5 overall",
    icon: Users,
    iconColor: "text-accent",
    guidelines: "Prevent wasting with balanced diets including fruits, vegetables, grains, proteins, and dairy products."
  },
  {
    ageGroup: "General tips",
    icon: Lightbulb,
    iconColor: "text-primary",
    guidelines: "Feed frequently with variety; monitor growth patterns and watch for signs of malnutrition."
  }
];

export default function NutritionSection() {
  return (
    <section id="child-nutrition" className="scroll-mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-nutrition-title">
          Nutrition Guidelines for Children Under 5
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-nutrition-description">
          Age-appropriate nutrition recommendations to support healthy growth and development during critical early years.
        </p>
      </div>
      
      <Card className="overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full" data-testid="table-nutrition-guidelines">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-foreground">Age Group</th>
                <th className="text-left py-4 px-6 font-semibold text-foreground">Nutrition Guidelines</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {nutritionData.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <tr key={index} className="hover:bg-muted/10 transition-colors" data-testid={`row-nutrition-${index}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <IconComponent className={`${item.iconColor} mr-3`} size={20} />
                        <span className="font-medium text-foreground" data-testid={`text-age-group-${index}`}>
                          {item.ageGroup}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground" data-testid={`text-guidelines-${index}`}>
                      {item.guidelines}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}
