# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

CozyCap-ShareMarket is a full-stack stock trading simulator for the Indian stock market. It's a monorepo with separate backend (Node.js/Express) and frontend (React/Vite) applications that communicate via REST API and WebSocket (Socket.io) for real-time market updates.

## Development Commands

### Backend (from `/backend`)
- **Start dev server**: `npm run dev` (uses nodemon for hot reload)
- **Start production**: `npm start`
- **Seed market data**: `npm run seed` (populates MongoDB with mock Indian stock data)

### Frontend (from `/frontend`)
- **Start dev server**: `npm run dev` (runs on port 5173)
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`
- **Lint code**: `npm run lint` (ESLint with React plugins)

### Full Application Setup
1. Set up environment: Copy `backend/.env.example` to `backend/.env` and configure MongoDB URI and JWT secret
2. Install dependencies: Run `npm install` in both `/backend` and `/frontend` directories
3. Start MongoDB (must be running on localhost:27017 or configure MongoDB Atlas URI)
4. Seed market data: `cd backend && npm run seed`
5. Start backend: `cd backend && npm run dev`
6. Start frontend (in new terminal): `cd frontend && npm run dev`
7. Access application at http://localhost:5173

**Windows Note**: Use PowerShell or CMD. For sequential commands, use `;` in PowerShell instead of `&&` (e.g., `cd backend; npm run seed`)

## Architecture

### Backend Architecture

**Core Pattern**: MVC (Model-View-Controller) with JWT authentication and Socket.io for real-time updates

**Models** (`backend/models/`):
- **User**: Authentication, references DematAccount
- **DematAccount**: User's trading account with cash balance, holdings array, and portfolio metrics
  - Includes `calculatePortfolioMetrics()` method that computes P&L across all holdings
  - Holdings are embedded subdocuments with average price calculation
- **Order**: Trade history (BUY/SELL) with status tracking
- **MarketData**: Stock information with real-time price updates
- **Watchlist**: User's tracked stocks

**Controllers** (`backend/controllers/`):
- **authController**: Registration, login, JWT generation
- **tradingController**: Buy/sell stocks, manage demat account, holdings, orders, add funds
  - Buy operation: validates balance → creates order → updates holdings (merges existing or adds new) → recalculates portfolio
  - Sell operation: validates quantity → creates order → updates/removes holdings → recalculates portfolio
- **marketController**: Fetch market data, stock details, search

**Real-time Market Updates** (`backend/utils/marketDataUpdater.js`):
- Runs on interval (default 3000ms, configurable via MARKET_UPDATE_INTERVAL env var)
- Updates all active stock prices with random fluctuations (-2% to +2%)
- Broadcasts updates via Socket.io to all connected clients
- Automatically updates all user holdings with new market prices
- Updates day high/low, volume, and change percentages

**Authentication** (`backend/middleware/auth.js`):
- JWT-based with Bearer tokens
- `protect` middleware: verifies token, populates `req.user` with User object (password excluded, dematAccount populated)
- Token expiry: 30 days

**Routes** (`backend/routes/`):
- `/api/auth`: register, login
- `/api/demat`: protected routes for account, buy, sell, holdings, orders, add-funds
- `/api/market`: market data, stock search, details

**Socket.io Events**:
- `connection`: client connects
- `subscribeToStock(symbol)`: join room for specific stock updates
- `unsubscribeFromStock(symbol)`: leave room
- `marketUpdate`: server broadcasts price updates to all clients

### Frontend Architecture

**Tech Stack**: React 18 + Vite + TailwindCSS + Zustand (state management)

**Directory Structure** (`frontend/src/`):
- `components/`: Reusable UI components
- `pages/`: Route-level components
- `services/`: API calls (axios), Socket.io client
- `store/`: Zustand stores for global state
- `hooks/`: Custom React hooks
- `utils/`: Helper functions

**Key Features**:
- Real-time stock price updates via Socket.io
- Charts using recharts library
- Icons from lucide-react
- Toast notifications with react-hot-toast
- Client-side routing with react-router-dom

**API Configuration**:
- Vite proxy configured: `/api/*` → `http://localhost:5000` (see `vite.config.js`)
- Socket.io connects to backend server (PORT 5000 by default)

## Data Flow

### Trading Flow
1. User places order (buy/sell) via frontend
2. Request sent to protected route with JWT token
3. Backend validates: auth → balance/quantity → market data fetch
4. Order created with COMPLETED status (instant execution for simulator)
5. DematAccount holdings array updated (average price calculated for buys)
6. Portfolio metrics recalculated via `calculatePortfolioMetrics()`
7. Response sent back with updated account state

### Real-time Price Updates
1. `startMarketDataUpdates(io)` runs on backend startup
2. Every 3 seconds (configurable): updates all MarketData documents with random price changes
3. Updates all DematAccount holdings with new prices
4. Broadcasts update via Socket.io `marketUpdate` event
5. Frontend receives update and updates UI without page refresh

### Portfolio Calculations
Holdings profit/loss calculated in DematAccount model:
- `investedValue = quantity × averagePrice`
- `currentValue = quantity × currentPrice`
- `profitLoss = currentValue - investedValue`
- `profitLossPercentage = (profitLoss / investedValue) × 100`
- Total portfolio = sum of all holdings + cash balance

## Important Patterns

### Average Price Calculation (Buy Orders)
When buying stocks multiple times, average price is calculated:
```
newAvgPrice = (existingAvgPrice × existingQty + newPrice × newQty) / totalQty
```
This is critical for accurate P&L calculations.

### Account Number Generation
DematAccount pre-save hook generates unique account numbers: `COZY{timestamp}{random}`

### Password Security
User model uses bcrypt (salt rounds: 10) with pre-save hook. Password excluded from JSON responses via custom `toJSON()` method.

### Error Handling
- Custom middleware in `backend/middleware/errorHandler.js`
- Controllers use try-catch with 500 status for server errors
- Validation errors return 400, not found returns 404

## Environment Variables

Required in `backend/.env`:
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing (must be changed in production)
- `DEMO_ACCOUNT_BALANCE`: Initial balance for new accounts (default: 100000)
- `MARKET_UPDATE_INTERVAL`: Price update frequency in ms (default: 3000)
- `NODE_ENV`: development/production
- `CLIENT_URL`: Frontend URL for CORS (default: http://localhost:5173)

## Code Quality

**Linting**: Frontend uses ESLint with React plugins. Run `npm run lint` from frontend directory before committing.

**Testing**: No test framework is currently configured. When adding tests:
- Check for existing test configuration files first
- Backend: Consider Jest or Mocha for unit/integration tests
- Frontend: Consider Vitest (integrates with Vite) or Jest with React Testing Library

## Database

MongoDB with Mongoose ODM. Collections:
- `users`: User accounts
- `demataccounts`: Trading accounts with embedded holdings
- `orders`: Trade history
- `marketdatas`: Stock information
- `watchlists`: User watchlists

Indexes defined in Order model for performance:
- `{ user: 1, createdAt: -1 }`
- `{ dematAccount: 1, orderStatus: 1 }`

## Market Data

Seeds 35+ Indian stocks across sectors:
- Technology (TCS, INFY, WIPRO, HCLTECH, TECHM)
- Banking (HDFCBANK, ICICIBANK, SBIN, AXISBANK, KOTAKBANK)
- Automotive (TATAMOTORS, MARUTI, M&M, BAJAJ-AUTO, HEROMOTOCO)
- Pharma (SUNPHARMA, DRREDDY, CIPLA, DIVISLAB)
- FMCG (HINDUNILVR, ITC, NESTLEIND, BRITANNIA)
- Energy (RELIANCE, ONGC, BPCL, IOC)
- Telecom (BHARTIARTL, RJIO)
- Metals (TATASTEEL, HINDALCO, JSWSTEEL)
- Real Estate (DLF, GODREJPROP)
- Consumer Electronics (VOLTAS, HAVELLS)

Run `npm run seed` from backend directory to populate or refresh market data.
