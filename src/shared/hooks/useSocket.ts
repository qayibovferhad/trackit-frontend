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

    if (error.message === "TOKEN_EXPIRED") {
      onTokenExpired()
    }
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
  const isLoggedOut = useRef(false);
  const mountedRef = useRef(true);
  const socketRef = useRef<Socket | null>(null);

  const hardLogout = useCallback(() => {
    if (isLoggedOut.current) return;

    isLoggedOut.current = true;

    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
    }

    socketInstance = null;
    pendingMessages = [];
    currentConversationId = null;

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.location.replace('/login');
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    /* ---------- CONNECT ---------- */
    const onConnect = () => {
      if (!mountedRef.current || isLoggedOut.current) return;

      setIsConnected(true);

      if (currentConversationId && socketRef.current) {
        socketRef.current.emit('join', currentConversationId);
      }

      if (pendingMessages.length && socketRef.current) {
        const queue = [...pendingMessages];
        pendingMessages = [];
        queue.forEach(({ data, callback }) =>
          socketRef.current!.emit('sendMessage', data, callback)
        );
      }
    };

    /* ---------- DISCONNECT ---------- */
    const onDisconnect = () => {
      if (mountedRef.current) setIsConnected(false);
    };

    /* ---------- TOKEN EXPIRED ---------- */
    const onTokenExpired = async () => {
      if (isRefreshing.current || isLoggedOut.current) return;

      isRefreshing.current = true;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (!data?.access_token) {
          hardLogout();
          return;
        }

        setAccessToken(data.access_token);

        if (socketRef.current) {
          socketRef.current.removeAllListeners();
          socketRef.current.disconnect();
        }

        const newSocket = createSocketInstance();
        socketInstance = newSocket;
        socketRef.current = newSocket;

        attachListeners(newSocket);

        if (mountedRef.current) setSocket(newSocket);
      } catch {
        hardLogout();
      } finally {
        isRefreshing.current = false;
      }
    };

    /* ---------- UNAUTHORIZED ---------- */
    const onUnauthorized = () => {
      hardLogout();
    };

    /* ---------- LISTENERS ---------- */
    const attachListeners = (s: Socket) => {
      s.on('connect', onConnect);
      s.on('disconnect', onDisconnect);
      s.on('token_expired', onTokenExpired);
      s.on('unauthorized', onUnauthorized);

      s.on('connect_error', (err) => {
        console.log('err',err,);
        console.log(isRefreshing,'isRefreshing');
        console.log(isLoggedOut,'isRefreshing');
        
        if (
          err.message === 'TOKEN_EXPIRED' &&
          !isRefreshing.current &&
          !isLoggedOut.current
        ) {
          onTokenExpired();
        }
      });
    };

    const detachListeners = (s: Socket) => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      s.off('token_expired', onTokenExpired);
      s.off('unauthorized', onUnauthorized);
      s.off('connect_error');
    };

    /* ---------- INIT ---------- */
    if (!socketInstance) {
      socketInstance = createSocketInstance();
    }

    socketRef.current = socketInstance;
    attachListeners(socketInstance);
    setSocket(socketInstance);

    if (socketInstance.connected) setIsConnected(true);

    /* ---------- CLEANUP ---------- */
    return () => {
      mountedRef.current = false;
      if (socketRef.current) {
        detachListeners(socketRef.current);
      }
    };
  }, [hardLogout]);


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