import { api } from '../lib/sdkConfig';
import * as SecureStore from 'expo-secure-store';
import { ServiceResponse, UserGender, SignUpResponse } from '../types/api.d';
import { validateEmail } from '../utils/validators';
import { extractErrorMessage } from '../utils/errorHandler';
import { decodeJWT } from '../helper/jwtHelper';
import { store } from '../redux/store';
import { setUserId } from '../redux/slices/cartSlice';
import { UserService } from './user';

export const AuthService = {
  login: async (
    email: string,
    password: string,
  ): Promise<ServiceResponse<{ isValidated: boolean }>> => {
    try {
      if (!validateEmail(email)) {
        return { success: false, error: 'Correo electrónico inválido' };
      }

      const normalizedEmail = email.toLowerCase();
      const { accessToken } = await api.auth.login({
        email: normalizedEmail.trim(),
        password: password.trim(),
      });

      // Guardar el token en SecureStore
      await SecureStore.setItemAsync('auth_token', accessToken);

      await SecureStore.deleteItemAsync('user_data');

      const decoded = decodeJWT(accessToken);
      store.dispatch(setUserId(decoded?.userId || null));

      // Obtener el perfil del usuario para verificar el estado de isValidated
      const profileResponse = await UserService.getProfile();
      if (!profileResponse.success) {
        return {
          success: false,
          error: 'Error al obtener el perfil del usuario',
        };
      }

      const isValidated = profileResponse.data?.isValidated || false;

      // Si el usuario no está validado, enviar automáticamente el OTP
      if (!isValidated) {
        const resendResponse = await AuthService.resendOtp();
        if (!resendResponse.success) {
          return {
            success: false,
            error: 'Error al enviar el OTP. Inténtalo nuevamente.',
          };
        }
      }

      return { success: true, data: { isValidated } };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },

  register: async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    documentId: string,
    phoneNumber: string,
    birthDate: string,
    gender: string,
  ): Promise<ServiceResponse<SignUpResponse>> => {
    try {
      if (!validateEmail(email)) {
        return { success: false, error: 'Correo electrónico inválido' };
      }

      const normalizedEmail = email.toLowerCase();

      let mappedGender: UserGender;
      if (gender.toLowerCase() === 'male') {
        mappedGender = UserGender.MALE;
      } else if (gender.toLowerCase() === 'female') {
        mappedGender = UserGender.FEMALE;
      } else {
        return {
          success: false,
          error: "Género inválido. Solo se aceptan 'male' o 'female'.",
        };
      }

      const response = await api.auth.signUp({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail.trim(),
        password: password.trim(),
        documentId: documentId.trim(),
        phoneNumber: phoneNumber.trim(),
        birthDate: birthDate,
        gender: mappedGender,
      });

      // Saving user data in SecureStore
      await SecureStore.setItemAsync(
        'user_data',
        JSON.stringify({
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
        }),
      );

      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },

  forgotPassword: async (email: string): Promise<ServiceResponse> => {
    try {
      if (!validateEmail(email)) {
        return { success: false, error: 'Correo inválido' };
      }

      const normalizedEmail = email.toLowerCase();
      await api.auth.forgotPassword(normalizedEmail.trim());
      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },

  resetPassword: async (otp: string): Promise<ServiceResponse<string>> => {
    try {
      if (!/^\d{6}$/.test(otp)) {
        return { success: false, error: 'Código debe tener 6 dígitos' };
      }

      const { accessToken } = await api.auth.resetPassword(otp.trim());
      await SecureStore.setItemAsync('reset_token', accessToken);

      return { success: true, data: accessToken };
    } catch (error) {
      // Manejar errores específicos del backend
      const errorMessage = extractErrorMessage(error);
      if (errorMessage.includes('invalid')) {
        return {
          success: false,
          error: 'El código ingresado es incorrecto o ha expirado.',
        };
      }
      return { success: false, error: errorMessage };
    }
  },

  updatePassword: async (
    newPassword: string,
    confirmPassword: string,
  ): Promise<ServiceResponse> => {
    try {
      if (newPassword !== confirmPassword) {
        return { success: false, error: 'Las contraseñas no coinciden' };
      }

      const token = (await SecureStore.getItemAsync('reset_token')) || ''; // Obtener el reset_token
      if (!token) {
        return { success: false, error: 'Token de recuperación no encontrado' };
      }

      // Realizar la solicitud sobrescribiendo el header Authorization
      await api.client['client'].patch(
        '/auth/password',
        {
          password: newPassword.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sobrescribir el header con el reset_token
          },
        },
      );

      // Logout silencioso para limpiar la sesión
      await AuthService.logout();

      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string,
  ): Promise<ServiceResponse> => {
    try {
      // Obtener el token de autenticación almacenado
      const token = (await SecureStore.getItemAsync('auth_token')) || '';
      if (!token) {
        return {
          success: false,
          error: 'Token de autenticación no encontrado',
        };
      }

      // Llamar al endpoint updateCurrentPassword del SDK
      await api.auth.updateCurrentPassword(
        currentPassword.trim(),
        newPassword.trim(),
        token,
      );

      return { success: true, data: undefined };
    } catch (error) {
      // Manejar errores específicos del backend
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },

  logout: async (): Promise<void> => {
    try {
      // Eliminar el token del SecureStore
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('reset_token');

      // Eliminar los interceptores configurados en el cliente HTTP
      const interceptors = api.client['client'].interceptors.request;
      interceptors.handlers = []; // Limpia todos los interceptores configurados

      store.dispatch(setUserId(null)); // Limpia el carrito al cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  },

  validateOtp: async (otp: string): Promise<ServiceResponse> => {
    try {
      if (!/^\d{6}$/.test(otp)) {
        return { success: false, error: 'El código debe tener 6 dígitos' };
      }

      const token = (await SecureStore.getItemAsync('auth_token')) || '';

      if (!token) {
        return {
          success: false,
          error: 'Token de autenticación no encontrado',
        };
      }

      await api.auth.validateOtp(otp.trim(), token);

      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },

  resendOtp: async (): Promise<ServiceResponse> => {
    try {
      const token = (await SecureStore.getItemAsync('auth_token')) || '';

      if (!token) {
        return {
          success: false,
          error: 'Token de autenticación no encontrado',
        };
      }

      await api.auth.resendOtp(token);

      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },

  validateSession: async (): Promise<{
    isValid: boolean;
    userRole?: string;
  }> => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) return { isValid: false };

      const decoded = decodeJWT(token);
      if (!decoded || !decoded.userId) return { isValid: false };

      const profileResponse = await UserService.getProfile();
      if (profileResponse.success) {
        return { isValid: true, userRole: profileResponse.data.role };
      }

      return { isValid: false };
    } catch (error) {
      console.error('Error al validar la sesión:', error);
      return { isValid: false };
    }
  },
};
