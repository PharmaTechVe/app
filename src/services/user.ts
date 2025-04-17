import * as SecureStore from 'expo-secure-store';
import { api } from '../lib/sdkConfig';
import {
  ServiceResponse,
  UpdateUser,
  UserList,
  UserAddressResponse,
  CreateUserAddressRequest,
} from '../types/api.d';
import { extractErrorMessage } from '../utils/errorHandler';
import { decodeJWT } from '../helper/jwtHelper';

export const UserService = {
  getProfile: async (): Promise<ServiceResponse<UserList>> => {
    try {
      // Obtén el token JWT desde SecureStore
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Decodifica el JWT para obtener el userId
      const decoded = decodeJWT(token);
      if (!decoded || !decoded.userId) {
        throw new Error('No se pudo decodificar el token de autenticación');
      }

      const userId = decoded.userId;

      // Llama al método `getProfile` del SDK con el userId y el token JWT
      const response = await api.user.getProfile(userId, token);
      console.log('Profile Data:', response); // Verificar los datos del perfil
      return { success: true, data: response };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },

  updateProfile: async (
    userData: Partial<UpdateUser>,
  ): Promise<ServiceResponse<UserList>> => {
    try {
      // Obtén el token JWT desde SecureStore
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Decodifica el JWT para obtener el userId
      const decoded = decodeJWT(token);
      if (!decoded || !decoded.userId) {
        throw new Error('No se pudo decodificar el token de autenticación');
      }

      const userId = decoded.userId;

      // Llama al método `getProfile` del SDK con el userId y el token JWT
      const response = await api.user.update(userId, userData, token);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },

  getUserDirections: async (): Promise<
    ServiceResponse<UserAddressResponse[]>
  > => {
    try {
      // Obtén el token JWT desde SecureStore
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Decodifica el JWT para obtener el userId
      const decoded = decodeJWT(token);
      if (!decoded || !decoded.userId) {
        throw new Error('No se pudo decodificar el token de autenticación');
      }

      const userId = decoded.userId;
      const response = await api.userAdress.getListAddresses(userId, token);
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },

  getDirection: async (
    id: string,
  ): Promise<ServiceResponse<UserAddressResponse>> => {
    try {
      // Obtén el token JWT desde SecureStore
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Decodifica el JWT para obtener el userId
      const decoded = decodeJWT(token);
      if (!decoded || !decoded.userId) {
        throw new Error('No se pudo decodificar el token de autenticación');
      }

      const userId = decoded.userId;
      const response = await api.userAdress.getAddress(userId, id, token);
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },

  saveDirection: async (
    userAddress: CreateUserAddressRequest,
  ): Promise<ServiceResponse<CreateUserAddressRequest>> => {
    try {
      // Obtén el token JWT desde SecureStore
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Decodifica el JWT para obtener el userId
      const decoded = decodeJWT(token);
      if (!decoded || !decoded.userId) {
        throw new Error('No se pudo decodificar el token de autenticación');
      }

      const userId = decoded.userId;
      const response = await api.userAdress.createAddress(
        userId,
        userAddress,
        token,
      );
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },

  updateDirection: async (
    userAddress: CreateUserAddressRequest,
    id: string,
  ): Promise<ServiceResponse<CreateUserAddressRequest>> => {
    try {
      // Obtén el token JWT desde SecureStore
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Decodifica el JWT para obtener el userId
      const decoded = decodeJWT(token);
      if (!decoded || !decoded.userId) {
        throw new Error('No se pudo decodificar el token de autenticación');
      }

      const userId = decoded.userId;
      const response = await api.userAdress.update(
        userId,
        userAddress,
        id,
        token,
      );
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },
};
