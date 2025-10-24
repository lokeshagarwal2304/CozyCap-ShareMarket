import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    if (this.socket) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  onMarketUpdate(callback) {
    if (!this.socket) {
      this.connect();
    }
    this.socket.on('marketUpdate', callback);
  }

  offMarketUpdate(callback) {
    if (this.socket) {
      this.socket.off('marketUpdate', callback);
    }
  }

  subscribeToStock(symbol) {
    if (!this.socket) {
      this.connect();
    }
    this.socket.emit('subscribeToStock', symbol);
  }

  unsubscribeFromStock(symbol) {
    if (this.socket) {
      this.socket.emit('unsubscribeFromStock', symbol);
    }
  }

  isConnected() {
    return this.connected && this.socket && this.socket.connected;
  }
}

const socketService = new SocketService();

export default socketService;
