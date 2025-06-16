# Sustainability Challenges Platform

## Overview

This is a full-stack web application for managing environmental sustainability challenges. The platform allows users to create, view, edit, and delete eco-friendly challenges with features like user authentication, categorization, and difficulty levels. Built with modern web technologies including React, Express, and PostgreSQL.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based authentication with localStorage persistence
- **API**: RESTful API design with structured error handling
- **Development**: Hot reload with tsx, production builds with esbuild

## Key Components

### Authentication System
- JWT token-based authentication
- Protected routes using middleware
- Persistent sessions via localStorage
- Context-based auth state management

### Challenge Management
- CRUD operations for sustainability challenges
- Category-based organization (Water, Energy, Transport, etc.)
- Difficulty levels (Easy, Medium, Hard)
- Point scoring and time estimation

### Data Models
- User: id, username, email, password
- Challenge: id, title, description, category, difficulty, points, time, status, timestamps

### UI Architecture
- Responsive layout with mobile-first design
- Sidebar navigation with collapsible mobile menu
- Toast notifications for user feedback
- Loading states and error handling
- Form validation with real-time feedback

## Data Flow

1. **Authentication Flow**: User logs in → JWT token stored → Protected routes accessible
2. **Challenge CRUD**: Form submission → API validation → Database operation → UI update
3. **Data Fetching**: React Query manages server state, caching, and background updates
4. **Real-time Updates**: Mutations trigger cache invalidation for immediate UI updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for Neon database
- **drizzle-orm**: Type-safe database ORM
- **jsonwebtoken**: JWT token generation and verification
- **@tanstack/react-query**: Server state management
- **@hookform/resolvers**: Form validation integration
- **wouter**: Lightweight React router

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives (40+ components)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

## Deployment Strategy

### Development
- **Environment**: Node.js 20 with hot reload
- **Database**: Neon PostgreSQL with connection pooling
- **Port Configuration**: Frontend on 5000, backend serves static files
- **Development Tools**: Replit integration with automatic builds

### Production
- **Build Process**: Vite builds frontend, esbuild bundles backend
- **Static Serving**: Express serves built React app
- **Database**: PostgreSQL with Drizzle schema migrations
- **Environment Variables**: JWT secrets, database URLs

### Replit Configuration
- **Autoscale Deployment**: Configured for production scaling
- **Port Mapping**: Internal 5000 → External 80
- **Build Commands**: npm run build → dist directory
- **Start Command**: npm run start for production

## Changelog
```
Changelog:
- June 16, 2025. Initial setup
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```