import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { Bot, User, Send } from "lucide-react";

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AiBotSection() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!user) {
        throw new Error("Please login to use the AI assistant");
      }
      const response = await apiRequest("POST", "/api/chat", { message });
      return response.json();
    },
    onSuccess: (data, message) => {
      const newMessage: ChatMessage = {
        id: data.id || Date.now().toString(),
        message,
        response: data.response,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
      setChatInput("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = () => {
    const message = chatInput.trim();
    if (!message) return;
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to use the AI assistant",
        variant: "destructive"
      });
      return;
    }

    chatMutation.mutate(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <section id="ai-bot" className="scroll-mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-ai-bot-title">
          AI Nutrition Assistant
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-ai-bot-description">
          Get personalized nutrition advice and cooking tips for children under 5. Ask questions about feeding, recipes, and healthy development.
        </p>
      </div>
      
      <Card className="shadow-lg overflow-hidden max-w-4xl mx-auto">
        {/* Chat Header */}
        <div className="bg-primary text-primary-foreground px-6 py-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center mr-3">
              <Bot className="text-primary-foreground" size={20} />
            </div>
            <div>
              <h3 className="font-semibold" data-testid="text-chat-header-title">Nutrition AI Assistant</h3>
              <p className="text-sm opacity-90" data-testid="text-chat-header-subtitle">Powered by Hugging Face LLM</p>
            </div>
            <div className="ml-auto">
              <span className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs" data-testid="status-online">
                Online
              </span>
            </div>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4" data-testid="container-chat-messages">
          {/* Welcome Message */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="text-primary-foreground" size={16} />
            </div>
            <div className="bg-muted/30 rounded-lg p-4 max-w-xs" data-testid="message-welcome">
              <p className="text-sm text-foreground">
                Hi! I'm here to help with nutrition questions for children under 5. You can ask me about:
              </p>
              <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                <li>• Age-appropriate foods</li>
                <li>• Healthy recipes</li>
                <li>• Feeding schedules</li>
                <li>• Nutritional concerns</li>
              </ul>
            </div>
          </div>
          
          {/* Chat Messages */}
          {messages.map((msg, index) => (
            <div key={msg.id} className="space-y-4">
              {/* User Message */}
              <div className="flex items-start space-x-3 justify-end" data-testid={`message-user-${index}`}>
                <div className="bg-primary text-primary-foreground rounded-lg p-4 max-w-xs">
                  <p className="text-sm">{msg.message}</p>
                </div>
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="text-secondary-foreground" size={16} />
                </div>
              </div>
              
              {/* AI Response */}
              <div className="flex items-start space-x-3" data-testid={`message-ai-${index}`}>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="text-primary-foreground" size={16} />
                </div>
                <div className="bg-muted/30 rounded-lg p-4 max-w-md">
                  <p className="text-sm text-foreground">{msg.response}</p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {chatMutation.isPending && (
            <div className="flex items-start space-x-3" data-testid="message-loading">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="text-primary-foreground" size={16} />
              </div>
              <div className="bg-muted/30 rounded-lg p-4 max-w-md">
                <p className="text-sm text-foreground">Thinking...</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Chat Input */}
        <div className="border-t border-border p-6">
          <div className="flex space-x-3">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about nutrition, recipes, or feeding tips..."
              className="flex-1"
              disabled={chatMutation.isPending}
              data-testid="input-chat-message"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={chatMutation.isPending || !chatInput.trim()}
              data-testid="button-send-message"
            >
              <Send size={16} />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2" data-testid="text-ai-disclaimer">
            AI responses are for informational purposes only. Consult healthcare professionals for medical advice.
          </p>
        </div>
      </Card>
    </section>
  );
}
