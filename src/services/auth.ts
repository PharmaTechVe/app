import { api } from '../lib/sdkConfig';
import * as SecureStore from 'expo-secure-store';
import { ServiceResponse, UserGender, SignUpResponse } from '../types/api.d';
import { validateEmail } from '../utils/validators';
import { extractErrorMessage } from '../utils/errorHandler';

export const AuthService = {
  login: async (email: string, password: string): Promise<ServiceResponse> => {
    try {
      if (!validateEmail(email)) {
        return { success: false, error: 'Correo electrónico inválido' };
      }

      const normalizedEmail = email.toLowerCase();
      const { accessToken } = await api.auth.login({
        email: normalizedEmail.trim(),
        password: password.trim(),
      });

      await SecureStore.setItemAsync('auth_token', accessToken);
      return { success: true, data: undefined };
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
      return {
        success: false,
        error: extractErrorMessage(error),
      };
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

      const token = (await SecureStore.getItemAsync('reset_token')) || '';
      await api.auth.updatePassword(newPassword.trim(), token);

      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },
};
