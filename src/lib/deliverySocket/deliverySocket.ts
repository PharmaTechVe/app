import io, { Socket } from 'socket.io-client';
import { SOCKET_URL } from '../socketUrl';
import * as SecureStore from 'expo-secure-store';

let socket: Socket | null = null;

export const initializeSocket = async (): Promise<Socket> => {
  if (socket) return socket;

  const token = await SecureStore.getItemAsync('auth_token');
  if (!token) {
    console.error('Token de autenticación no encontrado');
    throw new Error('Token de autenticación no encontrado');
  }

  console.log('Inicializando WebSocket con URL:', SOCKET_URL);
  console.log('Enviando token JWT:', token);

  socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ['polling'], // Asegurarnos de que ambos transportes estén habilitados
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
  });

  socket.on('connect', () => {
    console.log('WebSocket conectado exitosamente');
  });

  socket.on('connect_error', (error) => {
    console.error('Error de conexión al WebSocket:', error);
  });

  socket.on('disconnect', (reason) => {
    console.warn('WebSocket desconectado. Razón:', reason);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log('Desconectando WebSocket');
    socket.disconnect();
    socket = null;
  }
};
