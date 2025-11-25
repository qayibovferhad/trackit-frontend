// src/shared/hooks/useSocket.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ACCESS_TOKEN_KEY, setAccessToken } from '../lib/authStorage';
import axios from 'axios';

// Singleton socket instance
let socketInstance: Socket | null = null;

const getSocketInstance = (forceNew=false) => {

      if (forceNew && socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
  if (!socketInstance) {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    
    socketInstance = io('http://localhost:5500', {
      auth: {
        token,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance?.id);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socketInstance.on('token_expired', async () => {
      
            try {
                // Refresh token ilə yeni access token alın
                const {data} = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                if (data.access_token) {
                    const { accessToken } = data
                    setAccessToken(accessToken)
                    getSocketInstance(true); 
                } else {
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error('Error refreshing token:', error);
                window.location.href = '/login';
            }
        });

      socketInstance.on('unauthorized', () => {
          console.error('Unauthorized, redirecting to login...');
          window.location.href = '/login';
      });
  }

  return socketInstance;
};

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = getSocketInstance();
    console.log(socket,'socket');
    
    setSocket(socket);
    
    // Connection state-ini izlə
    if (socket.connected) {
      setIsConnected(true);
    }

    const onConnect = () => {
      console.log('Connected!');
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log('Disconnected!');
      setIsConnected(false);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return { socket, isConnected };
};