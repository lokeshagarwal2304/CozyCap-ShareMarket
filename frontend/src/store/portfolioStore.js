import { create } from 'zustand';
import { tradingAPI } from '../services/api';

const usePortfolioStore = create((set, get) => ({
  dematAccount: null,
  holdings: [],
  orders: [],
  loading: false,
  error: null,

  fetchDematAccount: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await tradingAPI.getDematAccount();
      set({ dematAccount: data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch account', loading: false });
    }
  },

  fetchHoldings: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await tradingAPI.getHoldings();
      set({ 
        holdings: data.holdings, 
        dematAccount: { ...get().dematAccount, ...data.summary },
        loading: false 
      });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch holdings', loading: false });
    }
  },

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await tradingAPI.getOrders();
      set({ orders: data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch orders', loading: false });
    }
  },

  buyStock: async (orderData) => {
    try {
      const { data } = await tradingAPI.buyStock(orderData);
      set({ dematAccount: data.dematAccount });
      await get().fetchHoldings();
      await get().fetchOrders();
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to buy stock');
    }
  },

  sellStock: async (orderData) => {
    try {
      const { data } = await tradingAPI.sellStock(orderData);
      set({ dematAccount: data.dematAccount });
      await get().fetchHoldings();
      await get().fetchOrders();
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to sell stock');
    }
  },

  addFunds: async (amount) => {
    try {
      const { data } = await tradingAPI.addFunds(amount);
      set({ 
        dematAccount: { 
          ...get().dematAccount, 
          cashBalance: data.cashBalance,
          portfolioValue: data.portfolioValue 
        } 
      });
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add funds');
    }
  },
}));

export default usePortfolioStore;
