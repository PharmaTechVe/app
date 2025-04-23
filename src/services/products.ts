import { api } from '../lib/sdkConfig';
import {
  Pagination,
  ProductPresentation,
  GenericProductResponse,
  ProductPresentationResponse,
  ProductImage,
  ProductPresentationDetailResponse,
} from '@pharmatech/sdk';
import { ServiceResponse } from '../types/api';
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

  getPresentation: async (
    productId: string,
    presentationId: string,
  ): Promise<ServiceResponse<ProductPresentationDetailResponse>> => {
    try {
      const presentation = await api.productPresentation.getByPresentationId(
        productId,
        presentationId,
      );

      return { success: true, data: presentation };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },

  getGenericProduct: async (
    id: string,
  ): Promise<ServiceResponse<GenericProductResponse>> => {
    try {
      const product = await api.genericProduct.getById(id);
      console.log(product);
      return { success: true, data: product };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },

  getProductPresentations: async (
    id: string,
  ): Promise<ServiceResponse<ProductPresentationResponse[]>> => {
    try {
      const presentation = await api.productPresentation.getByProductId(id);

      return { success: true, data: presentation };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },

  getProductImages: async (
    id: string,
  ): Promise<ServiceResponse<ProductImage[]>> => {
    try {
      const images = await api.productImage.getByProductId(id);

      return { success: true, data: images };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },
};
