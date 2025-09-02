# Bitnun - Sustainable Blockchain Platform

## Overview

Bitnun is an innovative browser-native, carbon-negative blockchain platform that introduces "Action Mining" - a novel consensus mechanism where users earn BTN tokens through legitimate interactions like clicks, scrolls, shares, and form submissions. The platform features a comprehensive ecosystem including NFT marketplace, wallet functionality, gamification elements, and developer tools, all running entirely in web browsers using WebAssembly technology without requiring any downloads or installations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern component-based UI built with React 18 and TypeScript for type safety
- **Vite Build System**: Fast development server with hot module replacement and optimized production builds
- **Wouter Routing**: Lightweight client-side routing library for single-page application navigation
- **Tailwind CSS**: Utility-first CSS framework with custom design system variables for consistent theming
- **Shadcn/ui Components**: Pre-built accessible UI components with Radix UI primitives and custom styling
- **Responsive Design**: Mobile-first approach with glassmorphism effects and smooth animations

### State Management
- **TanStack Query**: Server state management with caching, background updates, and optimistic updates
- **React Context**: Local state management for action mining functionality and UI state
- **Custom Hooks**: Encapsulated business logic for action mining, mobile detection, and toast notifications

### Backend Architecture
- **Express.js Server**: RESTful API server with middleware for logging, JSON parsing, and error handling
- **TypeScript**: Full-stack type safety with shared types between client and server
- **Modular Route Structure**: Organized API endpoints for users, actions, NFTs, transactions, and achievements
- **Storage Abstraction**: Interface-based storage layer supporting both in-memory and database implementations

### Data Storage Solutions
- **Drizzle ORM**: Type-safe database interactions with PostgreSQL support
- **Neon Database**: Serverless PostgreSQL for production deployments
- **Schema Definition**: Comprehensive database schema with users, actions, NFTs, transactions, and achievements tables
- **Migration System**: Version-controlled database schema changes with Drizzle Kit

### Action Mining System
- **Real-time Tracking**: Browser-based action detection and reward calculation
- **Anti-fraud Measures**: Behavioral pattern analysis and interaction timing validation
- **Reward Distribution**: Dynamic BTN token allocation based on action types and user behavior
- **Progress Persistence**: User actions and rewards stored in database with real-time updates

### Authentication and Security
- **Session-based Authentication**: Secure session management with HTTP-only cookies
- **Input Validation**: Zod schema validation for all API inputs and database operations
- **CORS Configuration**: Cross-origin resource sharing setup for secure browser-server communication
- **Environment Variables**: Sensitive configuration managed through environment variables

### UI/UX Design System
- **Dark Theme**: Modern dark-themed interface with green accent colors reflecting sustainability focus
- **Custom Animations**: Mining-specific animations including glow effects and pulsing indicators
- **Accessibility**: Screen reader support and keyboard navigation throughout the application
- **Component Library**: Reusable UI components with consistent styling and behavior patterns

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL database hosting with automatic scaling and backup
- **Drizzle ORM**: TypeScript ORM for database queries, migrations, and schema management

### Frontend Libraries
- **React Ecosystem**: Core React library with hooks, context, and component patterns
- **Radix UI**: Accessible component primitives for complex UI elements like dialogs, dropdowns, and navigation
- **TanStack Query**: Advanced server state management with caching and synchronization
- **Tailwind CSS**: Utility-first styling with PostCSS processing and custom configuration

### Development Tools
- **Vite**: Modern build tool with fast HMR and optimized bundling for production
- **TypeScript**: Static type checking across the entire application stack
- **ESBuild**: Fast JavaScript bundler for server-side code compilation
- **Replit Integration**: Development environment plugins for enhanced coding experience

### Utility Libraries
- **Date-fns**: Date manipulation and formatting utilities
- **Clsx/Tailwind-merge**: Conditional CSS class composition and conflict resolution
- **Zod**: Runtime type validation and schema definition
- **Lucide React**: Consistent icon library with tree-shaking support

### Browser Technologies
- **WebAssembly (WASM)**: Browser-native blockchain node execution without installations
- **Service Workers**: Background processing for offline functionality and caching
- **Local Storage**: Client-side data persistence for user preferences and temporary state
- **Web APIs**: Modern browser APIs for enhanced user experience and functionality