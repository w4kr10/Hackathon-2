import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";
import { insertUserSchema, loginSchema, insertConsultationSchema } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || "";
const FLUTTERWAVE_PUBLIC_KEY = process.env.FLUTTERWAVE_PUBLIC_KEY || "";
const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY || "";

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
      
      res.status(201).json({
        message: "User created successfully",
        token,
        user: { id: user.id, email: user.email, name: user.name, isSubscribed: user.isSubscribed }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const loginData = loginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByEmail(loginData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(loginData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({
        message: "Login successful",
        token,
        user: { id: user.id, email: user.email, name: user.name, isSubscribed: user.isSubscribed }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Invalid login data" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    const user = req.user;
    res.json({
      user: { id: user.id, email: user.email, name: user.name, isSubscribed: user.isSubscribed }
    });
  });

  // AI Chat routes
  app.post("/api/chat", authenticateToken, async (req: any, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // Call Hugging Face API for nutrition advice
      let aiResponse = "I'm here to help with nutrition questions for children under 5. Please ask me about feeding schedules, healthy recipes, age-appropriate foods, or any nutrition concerns.";
      
      if (HUGGINGFACE_API_KEY) {
        try {
          // Use a more appropriate model for conversational AI and nutrition advice
          const response = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputs: `You are a helpful nutrition assistant specializing in food and nutrition advice for pregnant mothers and children under 5 years old. Please provide evidence-based, safe, and practical advice. Always remind users to consult healthcare professionals for medical concerns.

Question: ${message}

Answer:`,
              parameters: {
                max_new_tokens: 150,
                temperature: 0.7,
                do_sample: true,
                top_p: 0.9,
                return_full_text: false
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0 && data[0].generated_text) {
              aiResponse = data[0].generated_text.trim();
            } else if (data.generated_text) {
              aiResponse = data.generated_text.trim();
            }
          } else {
            console.error("Hugging Face API error:", response.status, await response.text());
          }
        } catch (error) {
          console.error("Hugging Face API error:", error);
        }
      }

      // Save chat message
      const chatMessage = await storage.createChatMessage({
        userId: req.user.id,
        message,
        response: aiResponse
      });

      res.json({ response: aiResponse, id: chatMessage.id });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  app.get("/api/chat/history", authenticateToken, async (req: any, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const messages = await storage.getUserChatHistory(req.user.id, limit);
      res.json({ messages });
    } catch (error) {
      console.error("Chat history error:", error);
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });

  // Subscription routes
  app.post("/api/subscription/create", authenticateToken, async (req: any, res) => {
    try {
      const { amount = 9.99, currency = "USD" } = req.body;
      
      // Create Flutterwave payment using their API
      const flutterwavePayload = {
        tx_ref: `subscription_${req.user.id}_${Date.now()}`,
        amount: amount,
        currency: currency,
        redirect_url: `${process.env.NODE_ENV === 'production' ? 'https://' : 'http://localhost:5000'}/subscription/success`,
        payment_options: "card,mobilemoney,ussd,banktransfer",
        customer: {
          email: req.user.email,
          name: req.user.name || "Customer"
        },
        customizations: {
          title: "Mother & Child Wellness Hub",
          description: "Premium Subscription - $9.99/month",
          logo: ""
        }
      };

      const flutterwaveResponse = await fetch("https://api.flutterwave.com/v3/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${FLUTTERWAVE_SECRET_KEY}`
        },
        body: JSON.stringify(flutterwavePayload)
      });

      if (!flutterwaveResponse.ok) {
        const errorData = await flutterwaveResponse.json();
        console.error("Flutterwave API error:", errorData);
        throw new Error("Failed to create payment checkout");
      }

      const flutterwaveData = await flutterwaveResponse.json();
      
      // Create subscription record with pending status
      const subscription = await storage.createSubscription({
        userId: req.user.id,
        status: "pending",
        amount: amount.toString(),
        currency,
        paymentProvider: "flutterwave",
        externalId: flutterwaveData.data.tx_ref || `flw_${Date.now()}`,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      });

      res.json({
        message: "Payment checkout created successfully",
        subscription,
        checkoutUrl: flutterwaveData.data.link,
        paymentId: flutterwaveData.data.tx_ref
      });
    } catch (error) {
      console.error("Subscription error:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  app.get("/api/subscription/status", authenticateToken, async (req: any, res) => {
    try {
      const subscription = await storage.getActiveSubscription(req.user.id);
      res.json({ subscription, isActive: !!subscription && subscription.status === 'active' });
    } catch (error) {
      console.error("Subscription status error:", error);
      res.status(500).json({ message: "Failed to get subscription status" });
    }
  });

  // Consultation routes
  app.post("/api/consultations", authenticateToken, async (req: any, res) => {
    try {
      const consultationData = insertConsultationSchema.parse(req.body);
      
      // Check if user is subscribed
      if (!req.user.isSubscribed) {
        return res.status(403).json({ message: "Subscription required for consultations" });
      }

      const consultation = await storage.createConsultation({
        ...consultationData,
        userId: req.user.id
      });

      res.status(201).json({
        message: "Consultation request created successfully",
        consultation
      });
    } catch (error) {
      console.error("Consultation error:", error);
      res.status(400).json({ message: "Invalid consultation data" });
    }
  });

  app.get("/api/consultations", authenticateToken, async (req: any, res) => {
    try {
      const consultations = await storage.getUserConsultations(req.user.id);
      res.json({ consultations });
    } catch (error) {
      console.error("Consultations fetch error:", error);
      res.status(500).json({ message: "Failed to fetch consultations" });
    }
  });

  // Flutterwave webhook endpoint
  app.post("/api/webhooks/flutterwave", async (req, res) => {
    try {
      const { status, tx_ref, transaction_id, amount, currency } = req.body;
      
      console.log("Flutterwave webhook received:", { status, tx_ref, transaction_id });
      
      if (status === 'successful') {
        // Payment successful - activate subscription
        // Extract user ID from tx_ref (format: subscription_userId_timestamp)
        const txRefParts = tx_ref?.split('_');
        if (txRefParts && txRefParts.length >= 2 && txRefParts[0] === 'subscription') {
          const userId = txRefParts[1];
          
          // Find and update subscription
          const subscription = await storage.getActiveSubscription(userId);
          if (subscription && subscription.externalId === tx_ref) {
            await storage.updateSubscriptionStatus(subscription.id, "active");
            await storage.updateUserSubscription(userId, true);
            console.log(`Activated subscription for user ${userId}`);
          }
        }
      } else if (status === 'failed' || status === 'cancelled') {
        // Payment failed - update subscription status
        const txRefParts = tx_ref?.split('_');
        if (txRefParts && txRefParts.length >= 2 && txRefParts[0] === 'subscription') {
          const userId = txRefParts[1];
          const subscription = await storage.getActiveSubscription(userId);
          if (subscription && subscription.externalId === tx_ref) {
            await storage.updateSubscriptionStatus(subscription.id, "failed");
            console.log(`Failed subscription for user ${userId}`);
          }
        }
      }
      
      res.status(200).json({ message: "Webhook processed successfully" });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
