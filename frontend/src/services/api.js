import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
};

// Market APIs
export const marketAPI = {
  getAllStocks: () => API.get('/market/stocks'),
  getStockBySymbol: (symbol) => API.get(`/market/stocks/${symbol}`),
  getTopGainers: (limit = 10) => API.get(`/market/top-gainers?limit=${limit}`),
  getTopLosers: (limit = 10) => API.get(`/market/top-losers?limit=${limit}`),
  getTopMovers: (limit = 10) => API.get(`/market/top-movers?limit=${limit}`),
  searchStocks: (query) => API.get(`/market/search?q=${query}`),
  getWatchlist: () => API.get('/market/watchlist'),
  addToWatchlist: (symbol) => API.post('/market/watchlist', { symbol }),
  removeFromWatchlist: (symbol) => API.delete(`/market/watchlist/${symbol}`),
};

// Trading APIs
export const tradingAPI = {
  getDematAccount: () => API.get('/demat'),
  buyStock: (data) => API.post('/demat/buy', data),
  sellStock: (data) => API.post('/demat/sell', data),
  getOrders: () => API.get('/demat/orders'),
  getHoldings: () => API.get('/demat/holdings'),
  addFunds: (amount) => API.post('/demat/add-funds', { amount }),
};

export default API;
