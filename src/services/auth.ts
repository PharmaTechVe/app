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

      const { accessToken } = await api.auth.login({
        email: email.trim(),
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
        email: email.trim(),
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
};
