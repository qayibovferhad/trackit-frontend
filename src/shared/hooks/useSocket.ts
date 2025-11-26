// src/shared/hooks/useSocket.ts - Düzəldilmiş versiya
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
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
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
    console.error('Socket connection error:', error);
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
  console.log(`Resending ${pendingMessages.length} pending messages`);
  
  const messagesToSend = [...pendingMessages];
  pendingMessages = [];
  
  messagesToSend.forEach(({ data, callback }) => {
    console.log('Resending message:', data);
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
      console.log('Socket connected:', socketInstance?.id);
      if (mountedRef.current) {
        setIsConnected(true);
        
        // Əgər conversation-da idisə, yenidən otağa qoşul
        if (currentConversationId && socketInstance) {
          console.log('Rejoining room after reconnect:', currentConversationId);
          socketInstance.emit('join', currentConversationId);
        }
        
        // Token refresh edildikdən sonra pending messages göndər
        if (socketInstance && pendingMessages.length > 0) {
          setTimeout(() => {
            resendPendingMessages(socketInstance);
          }, 500);
        }
      }
    };

    const onDisconnect = () => {
      console.log('Socket disconnected');
      if (mountedRef.current) {
        setIsConnected(false);
      }
    };

    const onTokenExpired = async () => {
      console.log('Token expired, refreshing...');
      
      if (isRefreshing.current) {
        console.log('Token refresh already in progress');
        return;
      }

      isRefreshing.current = true;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        console.log('Token refresh response:', data);
        
        if (data.access_token) {
          setAccessToken(data.access_token);
          
          // Köhnə socket-i təmizlə
          if (socketInstance) {
            removeSocketListeners(socketInstance, onConnect, onDisconnect, onTokenExpired, onUnauthorized);
            socketInstance.disconnect();
            socketInstance = null;
          }
          
          // Yeni socket yarat
          const newSocket = createSocketInstance();
          socketInstance = newSocket;
          socketRef.current = newSocket;
          
          // Yeni event listener-lər əlavə et
          setupSocketListeners(newSocket, onConnect, onDisconnect, onTokenExpired, onUnauthorized);
          
          // State-i update et
          if (mountedRef.current) {
            setSocket(newSocket);
          }
          
          console.log('Socket refreshed successfully, pending messages will be sent on connect');
        } else {
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
        window.location.href = '/login';
      } finally {
        isRefreshing.current = false;
      }
    };

    const onUnauthorized = () => {
      console.error('Unauthorized, redirecting to login...');
      window.location.href = '/login';
    };

    // Socket-i yarat və ya mövcud olanı götür
    if (!socketInstance) {
      socketInstance = createSocketInstance();
    }
    
    socketRef.current = socketInstance;
    setupSocketListeners(socketInstance, onConnect, onDisconnect, onTokenExpired, onUnauthorized);
    setSocket(socketInstance);

    if (socketInstance.connected) {
      setIsConnected(true);
    }

    return () => {
      mountedRef.current = false;
      if (socketInstance) {
        removeSocketListeners(socketInstance, onConnect, onDisconnect, onTokenExpired, onUnauthorized);
      }
    };
  }, []);

  // Current conversation ID-ni set et
  const setCurrentConversation = useCallback((conversationId: string | null) => {
    currentConversationId = conversationId;
  }, []);

  return { socket, isConnected, setCurrentConversation };
};

// Pending message əlavə etmək üçün helper
export const addPendingMessage = (data: any, callback: (response: any) => void) => {
  pendingMessages.push({ data, callback });
  console.log(`Added message to pending queue. Total pending: ${pendingMessages.length}`);
};

// App unmount olanda socket-i təmizlə
export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;
  }
  pendingMessages = [];
  currentConversationId = null;
};