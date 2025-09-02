import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { Stethoscope, Check, CreditCard } from "lucide-react";

const subscriptionFeatures = [
  "24/7 Telehealth Consultations",
  "Certified Maternal Health Specialists",
  "Pediatric Care for Children Under 5",
  "Personalized Health Records",
  "Priority AI Assistant Support"
];

export default function SubscriptionSection() {
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: subscriptionStatus } = useQuery({
    queryKey: ["/api/subscription/status"],
    enabled: !!user,
  });

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("Please login to subscribe");
      }
      const response = await apiRequest("POST", "/api/subscription/create", {
        amount: 9.99,
        currency: "USD"
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Subscription created! Redirecting to payment...",
      });
      // In a real implementation, redirect to IntaSend checkout
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, '_blank');
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create subscription",
        variant: "destructive"
      });
    }
  });

  const handleSubscribe = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to subscribe to premium features",
        variant: "destructive"
      });
      return;
    }

    subscribeMutation.mutate();
  };

  const isSubscribed = user?.isSubscribed || (subscriptionStatus && typeof subscriptionStatus === 'object' && 'isActive' in subscriptionStatus && subscriptionStatus.isActive);

  return (
    <section id="subscription" className="scroll-mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-subscription-title">
          Unlock Premium Healthcare Features
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-subscription-description">
          Get access to personalized telehealth consultations with certified healthcare professionals specializing in maternal and child health.
        </p>
      </div>
      
      <div className="max-w-md mx-auto">
        <Card className={`border-2 shadow-lg ${isSubscribed ? 'border-accent bg-accent/5' : 'border-primary'}`}>
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2" data-testid="text-plan-title">
                {isSubscribed ? "Premium Care Plan - Active" : "Premium Care Plan"}
              </h3>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-4xl font-bold text-primary" data-testid="text-plan-price">$9.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              {subscriptionFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3" data-testid={`feature-${index}`}>
                  <Check className="text-primary flex-shrink-0" size={16} />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
            
            {isSubscribed ? (
              <div className="text-center">
                <div className="bg-accent text-accent-foreground py-4 rounded-lg font-semibold mb-4" data-testid="status-subscribed">
                  <Check className="inline mr-2" size={16} />
                  You're subscribed!
                </div>
                <p className="text-sm text-muted-foreground" data-testid="text-subscription-active">
                  Enjoy all premium features and priority support.
                </p>
              </div>
            ) : (
              <Button 
                onClick={handleSubscribe}
                className="w-full py-4 font-semibold"
                disabled={subscribeMutation.isPending}
                data-testid="button-subscribe"
              >
                <CreditCard className="mr-2" size={16} />
                {subscribeMutation.isPending ? "Processing..." : "Subscribe Now"}
              </Button>
            )}
            
            <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-muted-foreground">
              <span>Secure payments via</span>
              <span>💳 Visa</span>
              <span>💳 Mastercard</span>
              <span>📱 M-Pesa</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
