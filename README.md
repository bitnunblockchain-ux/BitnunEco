# BitnunEco

A TypeScript-based web application ready for deployment on [Vercel](https://vercel.com/).

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Set up environment variables:**
   Copy `.env.example` to `.env.local` and fill in the values.

3. **Run locally:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Deployment

### Deploy to Vercel

1. **Quick Deploy:**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect the configuration from `vercel.json`
   - The app will be deployed with the serverless API endpoints

2. **Manual Deploy with Vercel CLI:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

3. **Environment Variables:**
   - Set up environment variables in the Vercel dashboard
   - See `.env.example` for required variables

### Configuration

The project includes:
- **Frontend**: React app built with Vite → deployed as static files
- **Backend**: Express API → deployed as Vercel serverless functions
- **API Routes**: Available at `/api/*` endpoints

All API routes are automatically available:
- `/api/user/:id` - Get user data
- `/api/leaderboard` - Get user leaderboard
- `/api/actions` - Action mining endpoints
- `/api/nfts` - NFT marketplace endpoints
- `/api/transactions` - Transaction history
- `/api/achievements` - User achievements
- `/api/stats` - Global statistics

## Environment Variables

See `.env.example` for required variables.

## License

Specify your license here.
