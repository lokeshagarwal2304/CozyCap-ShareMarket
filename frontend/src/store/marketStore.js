import { create } from 'zustand';
import { marketAPI } from '../services/api';

const useMarketStore = create((set, get) => ({
  stocks: [],
  selectedStock: null,
  topGainers: [],
  topLosers: [],
  watchlist: [],
  loading: false,
  error: null,

  fetchAllStocks: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await marketAPI.getAllStocks();
      set({ stocks: data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch stocks', loading: false });
    }
  },

  fetchStockBySymbol: async (symbol) => {
    set({ loading: true, error: null });
    try {
      const { data } = await marketAPI.getStockBySymbol(symbol);
      set({ selectedStock: data, loading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch stock', loading: false });
    }
  },

  fetchTopMovers: async () => {
    try {
      const { data } = await marketAPI.getTopMovers(5);
      set({ topGainers: data.gainers, topLosers: data.losers });
    } catch (error) {
      console.error('Failed to fetch top movers:', error);
    }
  },

  fetchWatchlist: async () => {
    try {
      const { data } = await marketAPI.getWatchlist();
      set({ watchlist: data });
    } catch (error) {
      console.error('Failed to fetch watchlist:', error);
    }
  },

  addToWatchlist: async (symbol) => {
    try {
      await marketAPI.addToWatchlist(symbol);
      await get().fetchWatchlist();
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add to watchlist');
    }
  },

  removeFromWatchlist: async (symbol) => {
    try {
      await marketAPI.removeFromWatchlist(symbol);
      await get().fetchWatchlist();
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove from watchlist');
    }
  },

  updateStockPrice: (updates) => {
    const { stocks } = get();
    const updatedStocks = stocks.map(stock => {
      const update = updates.find(u => u.symbol === stock.symbol);
      return update ? { ...stock, ...update } : stock;
    });
    set({ stocks: updatedStocks });

    // Update selected stock if it matches
    const { selectedStock } = get();
    if (selectedStock) {
      const update = updates.find(u => u.symbol === selectedStock.symbol);
      if (update) {
        set({ selectedStock: { ...selectedStock, ...update } });
      }
    }
  },
}));

export default useMarketStore;
