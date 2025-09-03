# BitnunEco - Sustainable Blockchain Platform

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

- Bootstrap, build, and test the repository:
  - `cargo install wasm-pack` -- takes 2 minutes. Install wasm-pack for Rust WebAssembly compilation.
  - `npm install --legacy-peer-deps` -- takes 18 seconds. Use legacy peer deps to resolve dependency conflicts.
  - `npm run check` -- takes 6 seconds. TypeScript checking (expect 2 type errors in gamification.tsx and nft-marketplace.tsx).
  - `npm run build` -- takes 3-4 seconds. NEVER CANCEL. Builds both frontend (Vite) and backend (esbuild).
- Run the development environment:
  - ALWAYS run the bootstrapping steps first.
  - `npm run dev` -- starts development server at http://localhost:5000. Server starts in ~1 second.
- Run the production environment:
  - `npm run start` -- starts production server using pre-built assets.
- Database operations:
  - `npm run db:push` -- applies schema changes to database using Drizzle. Requires DATABASE_URL environment variable.

## Validation

- ALWAYS manually validate any new code by testing the Action Mining system in the browser.
- ALWAYS run through at least one complete end-to-end scenario after making changes:
  1. Navigate to http://localhost:5000
  2. Click "Dashboard" in navigation
  3. Click "Click Mine" button and verify BTN tokens are earned
  4. Check browser console for blockchain transaction logs
  5. Verify action counter increases and rewards appear
- ALWAYS run `npm run check` before committing to identify TypeScript issues.
- The build succeeds despite TypeScript errors, but fix them when possible.

## Known Issues and Workarounds

- **Rust WASM Build**: The Rust WebAssembly modules (src/) have compilation errors and DO NOT BUILD. The application runs using pre-built JavaScript blockchain simulation instead. Do not attempt to build WASM modules unless specifically fixing Rust code.
- **wasm-pack**: Install required but may fail with network issues. Use `cargo install wasm-pack` instead of curl installer.
- **Dependency Conflicts**: Always use `npm install --legacy-peer-deps` due to @types/node version conflicts with Vite 7.x.
- **TypeScript Errors**: Two known errors in gamification.tsx (line 37) and nft-marketplace.tsx (line 83). Build still succeeds.
- **External Resources**: Font and Replit resources may fail to load due to network restrictions (expected).

## Project Structure

### Frontend Architecture
- **React 18 + TypeScript + Vite**: Modern SPA with hot reload
- **Tailwind CSS**: Utility-first styling with glassmorphism effects
- **Shadcn/ui + Radix UI**: Accessible component library
- **TanStack Query**: Server state management
- **Wouter**: Lightweight routing

### Backend Architecture  
- **Express.js + TypeScript**: RESTful API server
- **Drizzle ORM + PostgreSQL**: Type-safe database operations
- **Session-based Auth**: Secure authentication without JWT

### Blockchain Simulation
- **Browser-native**: No external blockchain required
- **Action Mining**: Users earn BTN tokens for clicks, scrolls, shares
- **AI Fraud Detection**: Behavioral analysis prevents bot activity
- **Real-time Updates**: Blockchain state updates live in browser

## Key Directories

```
/client/          - React frontend application
/server/          - Express.js backend API
/shared/          - Shared types and database schema
/src/             - Rust WASM modules (broken, do not build)
```

## Common Tasks

### Repository Root
```
ls /home/runner/work/BitnunEco/BitnunEco
.config .git .github .gitignore .local .replit Cargo.toml SECURITY.md 
client components.json drizzle.config.ts package-lock.json package.json 
postcss.config.js replit.md server shared src tailwind.config.js 
tailwind.config.ts tsconfig.json vite.config.ts
```

### Package.json Scripts
```json
{
  "dev": "NODE_ENV=development tsx server/index.ts",
  "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "start": "NODE_ENV=production node dist/index.js",
  "check": "tsc",
  "db:push": "drizzle-kit push"
}
```

### Main Application Features
- **Homepage**: Marketing site with hero section and feature overview
- **Dashboard**: Action mining interface with real-time blockchain data
- **NFT Marketplace**: Browse and trade digital assets
- **Wallet**: Manage BTN tokens and transaction history  
- **Gamification**: Achievements, leaderboards, and progression
- **Developer**: API documentation and SDK downloads

## Development Environment

- **Node.js**: 20.19.4 required
- **Package Manager**: npm (use --legacy-peer-deps flag)
- **Build Tools**: Vite (frontend), esbuild (backend), wasm-pack (Rust)
- **Database**: PostgreSQL with Drizzle ORM (optional for frontend work)
- **Deployment**: Replit platform optimized

## Testing Scenarios

After making changes, ALWAYS test these user workflows:

1. **Basic Navigation**: Visit homepage → Dashboard → other pages
2. **Action Mining**: Click "Click Mine" button, verify BTN rewards and blockchain logs
3. **Real-time Updates**: Confirm action counter increments and UI updates
4. **Responsive Design**: Test on mobile and desktop viewports
5. **Console Logs**: Check for blockchain transaction and AI analysis messages

## Technology Stack Summary

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Shadcn/ui
- **Backend**: Express.js, TypeScript, Drizzle ORM, PostgreSQL
- **Blockchain**: Browser-native simulation with WebAssembly architecture
- **Build**: npm scripts, Vite, esbuild, wasm-pack
- **Deployment**: Replit with Node.js 20 and PostgreSQL 16

Always prioritize working, validated changes over complex theoretical solutions. The application is fully functional without the Rust WASM modules.