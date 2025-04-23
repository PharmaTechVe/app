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
};
