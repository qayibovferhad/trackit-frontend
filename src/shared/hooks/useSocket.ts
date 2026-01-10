// src/shared/hooks/useSocket.ts
import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { ACCESS_TOKEN_KEY, setAccessToken } from '../lib/authStorage';
import axios from 'axios';

let socketInstance: Socket | null = null;
let pendingMessages: Array<{
  data: any;
  callback: (response: any) => void;
}> = [];
let currentConversationId: string | null = null;

const createSocketInstance = () => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  const socket = io('http://localhost:5500', {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5,
    timeout: 20000,
  });

  return socket;
};

const setupSocketListeners = (
  socket: Socket,
  onConnect: () => void,
  onDisconnect: () => void,
  onTokenExpired: () => void,
  onUnauthorized: () => void
) => {
  socket.on('connect', onConnect);
  socket.on('disconnect', onDisconnect);
  socket.on('token_expired', onTokenExpired);
  socket.on('unauthorized', onUnauthorized);

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });
};

const removeSocketListeners = (
  socket: Socket,
  onConnect: () => void,
  onDisconnect: () => void,
  onTokenExpired: () => void,
  onUnauthorized: () => void
) => {
  socket.off('connect', onConnect);
  socket.off('disconnect', onDisconnect);
  socket.off('token_expired', onTokenExpired);
  socket.off('unauthorized', onUnauthorized);
  socket.off('connect_error');
};

const resendPendingMessages = (socket: Socket) => {
  if (pendingMessages.length === 0) return;

  const messagesToSend = [...pendingMessages];
  pendingMessages = [];

  messagesToSend.forEach(({ data, callback }) => {
    socket.emit('sendMessage', data, callback);
  });
};

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const isRefreshing = useRef(false);
  const mountedRef = useRef(true);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    mountedRef.current = true;

    const onConnect = () => {
      if (!mountedRef.current) return;

      setIsConnected(true);

      if (currentConversationId && socketInstance) {
        socketInstance.emit('join', currentConversationId);
      }

      if (socketInstance && pendingMessages.length > 0) {
        setTimeout(() => {
          resendPendingMessages(socketInstance!);
        }, 500);
      }
    };

    const onDisconnect = () => {
      if (mountedRef.current) setIsConnected(false);
    };

    const onTokenExpired = async () => {
      if (isRefreshing.current) return;
      isRefreshing.current = true;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (data.access_token) {
          setAccessToken(data.access_token);

          const newSocket = createSocketInstance();
          socketInstance = newSocket;
          socketRef.current = newSocket;

          setupSocketListeners(newSocket, onConnect, onDisconnect, onTokenExpired, onUnauthorized);

          if (mountedRef.current) setSocket(newSocket);
        } else {
          window.location.href = '/login';
        }
      } catch (error) {
        window.location.href = '/login';
      } finally {
        isRefreshing.current = false;
      }
    };

    const onUnauthorized = () => {
      window.location.href = '/login';
    };

    if (!socketInstance) {
      socketInstance = createSocketInstance();
    }

    socketRef.current = socketInstance;
    setupSocketListeners(socketInstance, onConnect, onDisconnect, onTokenExpired, onUnauthorized);
    setSocket(socketInstance);

    if (socketInstance.connected) setIsConnected(true);

    return () => {
      mountedRef.current = false;
      if (socketInstance) {
        removeSocketListeners(socketInstance, onConnect, onDisconnect, onTokenExpired, onUnauthorized);
      }
    };
  }, []);

  const setCurrentConversation = useCallback((conversationId: string | null) => {
    currentConversationId = conversationId;
  }, []);

  return { socket, isConnected, setCurrentConversation };
};

export const addPendingMessage = (data: any, callback: (response: any) => void) => {
  pendingMessages.push({ data, callback });
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;
  }
  pendingMessages = [];
  currentConversationId = null;
};