import { api } from '../lib/sdkConfig';
import {
  ServiceResponse,
  Pagination,
  ProductPresentation,
} from '../types/api.d';
import { extractErrorMessage } from '../utils/errorHandler';

export const ProductService = {
  getProducts: async (
    page: number,
    limit: number,
  ): Promise<ServiceResponse<Pagination<ProductPresentation>>> => {
    try {
      const products = await api.product.getProducts({
        page: page,
        limit: limit,
      });

      return { success: true, data: products };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },
};
