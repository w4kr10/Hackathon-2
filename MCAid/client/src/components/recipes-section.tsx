import { Card, CardContent } from "@/components/ui/card";
import { Apple, Pizza, ChefHat, Baby, UserCheck, Users } from "lucide-react";

const recipes = [
  {
    title: "Veggie Mac and Cheese",
    description: "Mix cooked pasta with cheese and pureed vegetables like broccoli or carrots for hidden nutrition.",
    icon: "🧀",
    kidTip: "Let them stir ingredients and help measure portions.",
    tipIcon: UserCheck,
    tipColor: "accent"
  },
  {
    title: "Apple Nachos",
    description: "Slice fresh apples and top with yogurt, chopped nuts, and dried fruit for a fun snack.",
    icon: "🍎",
    kidTip: "Perfect for toddlers to practice assembly and topping placement.",
    tipIcon: Baby,
    tipColor: "primary"
  },
  {
    title: "Crunchy Chicken Nuggets",
    description: "Bake chicken pieces with whole-grain coating for a healthier version of this kid favorite.",
    icon: "🍗",
    kidTip: "Involve kids in dipping chicken and coating with breadcrumbs.",
    tipIcon: UserCheck,
    tipColor: "secondary"
  },
  {
    title: "Pita Pizzas",
    description: "Top pita bread with tomato sauce, vegetables, and cheese, then bake until melted.",
    icon: "🍕",
    kidTip: "Kids love adding their own toppings and creating patterns.",
    tipIcon: Users,
    tipColor: "accent"
  }
];

const cookingTips = [
  {
    ageGroup: "Toddlers (2-3)",
    icon: Baby,
    color: "primary",
    tip: "Simple tasks like adding ingredients and stirring in large bowls."
  },
  {
    ageGroup: "Preschoolers (4-5)",
    icon: UserCheck,
    color: "secondary",
    tip: "Measuring, pouring, and using safe kitchen tools with supervision."
  },
  {
    ageGroup: "All Ages",
    icon: Users,
    color: "accent",
    tip: "Start simple, build skills gradually, and make it fun!"
  }
];

export default function RecipesSection() {
  return (
    <section id="recipes" className="scroll-mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-recipes-title">
          Healthy Recipes & Cooking Tips
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-recipes-description">
          Simple, nutritious recipes that kids can help prepare. Building healthy eating habits while creating family memories.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {recipes.map((recipe, index) => {
          const TipIcon = recipe.tipIcon;
          return (
            <Card key={index} className="card-hover" data-testid={`card-recipe-${index}`}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">{recipe.icon}</span>
                  <h3 className="text-xl font-semibold text-foreground" data-testid={`text-recipe-title-${index}`}>
                    {recipe.title}
                  </h3>
                </div>
                <p className="text-muted-foreground mb-4" data-testid={`text-recipe-description-${index}`}>
                  {recipe.description}
                </p>
                <div className={`bg-${recipe.tipColor}/10 border border-${recipe.tipColor}/20 rounded-lg p-3`}>
                  <p className="text-sm text-accent-foreground" data-testid={`text-recipe-tip-${index}`}>
                    <TipIcon className="inline mr-2" size={16} />
                    <strong>Kid Tip:</strong> {recipe.kidTip}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Cooking Tips Section */}
      <Card className="bg-primary/5 border border-primary/20 mt-8">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4" data-testid="text-cooking-tips-title">
            <ChefHat className="inline text-primary mr-3" size={20} />
            Age-Appropriate Cooking Tips
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {cookingTips.map((tip, index) => {
              const IconComponent = tip.icon;
              return (
                <div key={index} className="text-center" data-testid={`tip-age-group-${index}`}>
                  <div className={`w-12 h-12 bg-${tip.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <IconComponent className={`text-${tip.color}-foreground`} size={20} />
                  </div>
                  <h4 className="font-medium text-foreground mb-2" data-testid={`text-tip-age-${index}`}>
                    {tip.ageGroup}
                  </h4>
                  <p className="text-sm text-muted-foreground" data-testid={`text-tip-description-${index}`}>
                    {tip.tip}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
