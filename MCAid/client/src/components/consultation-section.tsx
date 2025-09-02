import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { Video, CalendarPlus, Clock, Shield, UserRound, FileText } from "lucide-react";

const consultationSchema = z.object({
  patientToken: z.string().min(1, "Patient token is required"),
  consultUrl: z.string().url().optional().or(z.literal("")),
  location: z.string().min(1, "Location is required"),
  providerId: z.string().optional(),
  metadata: z.string().optional(),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

const consultationFeatures = [
  {
    icon: Clock,
    title: "Same-Day Appointments",
    description: "Usually within 2-4 hours"
  },
  {
    icon: Shield,
    title: "HIPAA Compliant",
    description: "Secure & private consultations"
  },
  {
    icon: UserRound,
    title: "Certified Specialists",
    description: "Maternal & pediatric experts"
  },
  {
    icon: FileText,
    title: "Follow-up Care",
    description: "Ongoing support & records"
  }
];

export default function ConsultationSection() {
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      patientToken: "",
      consultUrl: "",
      location: "",
      providerId: "",
      metadata: "",
    },
  });

  const { data: consultations } = useQuery({
    queryKey: ["/api/consultations"],
    enabled: !!user,
  });

  const consultationMutation = useMutation({
    mutationFn: async (data: ConsultationFormData) => {
      if (!user) {
        throw new Error("Please login to request consultation");
      }
      if (!user.isSubscribed) {
        throw new Error("Subscription required for consultations");
      }
      const response = await apiRequest("POST", "/api/consultations", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Consultation request submitted successfully!",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to request consultation",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: ConsultationFormData) => {
    consultationMutation.mutate(data);
  };

  const canRequestConsultation = user && user.isSubscribed;

  return (
    <section id="consultation" className="scroll-mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-consultation-title">
          Request Medical Consultation
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-consultation-description">
          Book your telehealth appointment with our certified healthcare professionals. Available 24/7 for premium subscribers.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-sm">
          <CardContent className="p-8">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <Video className="text-primary" size={24} />
                <h3 className="text-xl font-semibold text-foreground" data-testid="text-consultation-form-title">
                  Schedule Your Consultation
                </h3>
              </div>
              <p className="text-muted-foreground" data-testid="text-consultation-availability">
                {canRequestConsultation ? "Fill out the form below to request your consultation" : "Available after subscription activation"}
              </p>
            </div>
            
            {!canRequestConsultation && (
              <div className="bg-muted/20 border border-border rounded-lg p-4 mb-6" data-testid="notice-subscription-required">
                <p className="text-muted-foreground text-center">
                  <Shield className="inline mr-2" size={16} />
                  Premium subscription required to access medical consultations.
                </p>
              </div>
            )}
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patient-token">Patient Record Token</Label>
                  <Input
                    id="patient-token"
                    placeholder="Enter your patient ID"
                    disabled={!canRequestConsultation}
                    {...form.register("patientToken")}
                    data-testid="input-patient-token"
                  />
                  {form.formState.errors.patientToken && (
                    <p className="text-sm text-destructive mt-1" data-testid="error-patient-token">
                      {form.formState.errors.patientToken.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="provider-id">Provider ID</Label>
                  <Input
                    id="provider-id"
                    placeholder="Preferred provider (optional)"
                    disabled={!canRequestConsultation}
                    {...form.register("providerId")}
                    data-testid="input-provider-id"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="consult-url">Consultation URL</Label>
                <Input
                  id="consult-url"
                  type="url"
                  placeholder="Video call link (will be provided if empty)"
                  disabled={!canRequestConsultation}
                  {...form.register("consultUrl")}
                  data-testid="input-consult-url"
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Your location (e.g., CA, NY)"
                  disabled={!canRequestConsultation}
                  {...form.register("location")}
                  data-testid="input-location"
                />
                {form.formState.errors.location && (
                  <p className="text-sm text-destructive mt-1" data-testid="error-location">
                    {form.formState.errors.location.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="metadata">Additional Information</Label>
                <Textarea
                  id="metadata"
                  placeholder="Describe your concerns, symptoms, or questions..."
                  rows={4}
                  disabled={!canRequestConsultation}
                  {...form.register("metadata")}
                  data-testid="input-metadata"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full py-4 font-semibold"
                disabled={!canRequestConsultation || consultationMutation.isPending}
                data-testid="button-request-consultation"
              >
                <CalendarPlus className="mr-2" size={16} />
                {consultationMutation.isPending ? "Submitting..." : "Request Consultation"}
              </Button>
            </form>
            
            {/* Consultation Features */}
            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="font-semibold text-foreground mb-4" data-testid="text-features-title">What to Expect:</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                {consultationFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3" data-testid={`feature-consultation-${index}`}>
                      <IconComponent className="text-primary mt-1 flex-shrink-0" size={16} />
                      <div>
                        <p className="font-medium text-foreground" data-testid={`text-feature-title-${index}`}>
                          {feature.title}
                        </p>
                        <p className="text-muted-foreground" data-testid={`text-feature-description-${index}`}>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
