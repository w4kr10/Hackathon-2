# Hackathon-2

MCAid- Mother & Child Wellness Hub
Overview
This is a full-stack web application focused on supporting pregnant mothers, new parents, and families with children under 5. The platform provides comprehensive healthcare resources including medical aid connections, telehealth consultations, AI-powered nutrition assistance, health guidelines, and subscription-based premium services. The application features a modern React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration.
User Preferences

Preferred communication style: Simple, everyday language.
System Architecture
Frontend Architecture

    Framework: React with TypeScript and Vite for development/build tooling
    UI Library: shadcn/ui components built on Radix UI primitives
    Styling: Tailwind CSS with custom design tokens and CSS variables
    State Management: React Query (TanStack Query) for server state management
    Routing: Wouter for lightweight client-side routing
    Form Handling: React Hook Form with Zod validation schemas

Backend Architecture

    Runtime: Node.js with Express.js framework
    Language: TypeScript with ES modules
    Database ORM: Drizzle ORM for type-safe database operations
    Authentication: JWT-based authentication with bcrypt password hashing
    Session Management: Express sessions with PostgreSQL storage
    API Design: RESTful API endpoints with JSON responses

Database Design

    Primary Database: PostgreSQL with Neon serverless adapter
    Schema Management: Drizzle Kit for migrations and schema definitions
    Key Tables:
        Users with subscription status and authentication data
        Subscriptions for premium service management
        Consultations for telehealth appointment tracking
        Chat messages for AI assistant interaction history

Authentication & Authorization

    User Registration/Login: Email/password with JWT token generation
    Token Management: Bearer token authentication for protected routes
    Password Security: bcrypt hashing with salt rounds
    Session Persistence: Local storage token management on frontend

External Dependencies

    Database: Neon PostgreSQL serverless database
    Payment Processing: IntaSend integration for subscription payments
    AI Services: Hugging Face API for nutrition chatbot functionality
    UI Components: Radix UI primitives for accessible component foundation
    Development Tools: Vite for frontend bundling, esbuild for backend bundling
    Monitoring: Replit-specific development tools and error tracking

WEBSITE UI
<img width="1171" height="826" alt="MCAid1" src="https://github.com/user-attachments/assets/b2f44ba1-fe8b-425c-8057-ccedf34fa553" />

PITCH DECK

https://www.canva.com/design/DAGxzoqXFS8/Y7LQ_2Lx0MTwznMJzxhRAQ/edit?utm_content=DAGxzoqXFS8&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton


