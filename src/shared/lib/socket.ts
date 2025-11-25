// src/shared/hooks/useSocket.ts
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Token-i localStorage-dən və ya cookie-dən götürün
    const token = localStorage.getItem('accessToken');

    if (!socketRef.current) {
      socketRef.current = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5500', {
        auth: {
          token, // Token-i auth ilə göndərin
        },
        // Və ya headers ilə:
        // extraHeaders: {
        //   Authorization: `Bearer ${token}`
        // },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected:', socketRef.current?.id);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return socketRef.current;
};