import { Pagination, CategoryResponse } from '@pharmatech/sdk';
import { api } from '../lib/sdkConfig';
import { ServiceResponse } from '../types/api.d';
import { extractErrorMessage } from '../utils/errorHandler';

export const CategoryService = {
  getCategories: async (
    page: number,
    limit: number,
  ): Promise<ServiceResponse<Pagination<CategoryResponse>>> => {
    try {
      const categories = await api.category.findAll({
        page: page,
        limit: limit,
      });

      return { success: true, data: categories };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },

  getById: async (id: string): Promise<CategoryResponse> => {
    if (!id || typeof id !== 'string') {
      throw new Error('El ID proporcionado no es válido.');
    }

    try {
      const response = await api.category.getById(id);
      return response;
    } catch (error) {
      console.error('Error en CategoryService.getById:', error);
      throw new Error(extractErrorMessage(error));
    }
  },
};
