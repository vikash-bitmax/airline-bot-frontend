import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5050';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      auth: { token },
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('[Socket] Connected to Simulator Server:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      console.warn('[Socket] Disconnected from Simulator Server:', reason);
    });

    this.socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
    });

    return this.socket;
  }

  joinRun(runId) {
    if (this.socket && runId) {
      this.socket.emit('join:run', { runId });
    }
  }

  leaveRun(runId) {
    if (this.socket && runId) {
      this.socket.emit('leave:run', { runId });
    }
  }

  joinConversation(conversationId) {
    if (this.socket && conversationId) {
      this.socket.emit('join:conversation', { conversationId });
    }
  }

  leaveConversation(conversationId) {
    if (this.socket && conversationId) {
      this.socket.emit('leave:conversation', { conversationId });
    }
  }

  on(event, callback) {
    if (!this.socket) {
      this.connect();
    }
    this.socket.on(event, callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

export const socketService = new SocketService();
export default socketService;
