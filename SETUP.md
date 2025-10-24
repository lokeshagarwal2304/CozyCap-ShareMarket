# CozyCap ShareMarket - Setup Guide

## Quick Setup

### Option 1: Using MongoDB Atlas (Cloud - Recommended for Quick Start)

1. **Create a free MongoDB Atlas account**:
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Create a free cluster (M0 Sandbox - Free forever)

2. **Get your connection string**:
   - In Atlas dashboard, click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)

3. **Update backend/.env**:
   ```
   MONGODB_URI=your_connection_string_here
   ```
   Replace `<password>` with your actual password and `<dbname>` with `cozycap`

4. **Seed the database**:
   ```powershell
   cd backend
   npm run seed
   ```

5. **Start the backend**:
   ```powershell
   npm run dev
   ```

6. **In a new terminal, start the frontend**:
   ```powershell
   cd frontend
   npm run dev
   ```

7. **Access the application**:
   - Open http://localhost:5173 in your browser

### Option 2: Using Local MongoDB

1. **Install MongoDB Community Edition**:
   - Download from: https://www.mongodb.com/try/download/community
   - Run the installer (use default settings)

2. **Start MongoDB**:
   - MongoDB should start automatically as a service
   - Or manually run: `mongod`

3. **The backend/.env is already configured for local MongoDB**:
   ```
   MONGODB_URI=mongodb://localhost:27017/cozycap
   ```

4. **Follow steps 4-7 from Option 1 above**

## Default Account

After seeding, you can register a new account. Each account gets:
- ₹1,00,000 demo cash balance
- Empty portfolio
- Empty watchlist

## Available Scripts

### Backend (from `/backend` directory)
- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run seed` - Seed market data

### Frontend (from `/frontend` directory)
- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

✅ User authentication (Register/Login)
✅ Real-time stock price updates via WebSocket
✅ Buy/Sell stocks
✅ Portfolio management with P&L tracking
✅ Order history
✅ Watchlist
✅ Market overview with top gainers/losers
✅ 35+ Indian stocks across sectors

## Tech Stack

**Backend**: Node.js, Express, MongoDB, Socket.io, JWT
**Frontend**: React 18, Vite, TailwindCSS, Zustand, Socket.io-client

## Troubleshooting

### MongoDB Connection Error
- **Local MongoDB**: Ensure MongoDB service is running
- **Atlas**: Check connection string and network access settings in Atlas dashboard

### Port Already in Use
- Backend (5000): Change `PORT` in `backend/.env`
- Frontend (5173): Vite will automatically try next available port

### Dependencies Issues
```powershell
# Backend
cd backend
Remove-Item -Recurse -Force node_modules
npm install

# Frontend
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
```

## Development Tips

1. **Real-time Updates**: Stock prices update every 3 seconds automatically
2. **Demo Mode**: This is a simulator - no real money involved
3. **Demat Account**: Automatically created on registration
4. **Market Data**: Pre-seeded with 35+ Indian stocks

## Next Steps

1. Register a new account
2. Explore the market
3. Add stocks to watchlist
4. Buy your first stock
5. Watch your portfolio grow (or shrink!)

Happy Trading! 📈
