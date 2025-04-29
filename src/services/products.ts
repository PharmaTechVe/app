import { api } from '../lib/sdkConfig';
import * as SecureStore from 'expo-secure-store';
import {
  Pagination,
  ProductPresentation,
  GenericProductResponse,
  ProductPresentationResponse,
  ProductImage,
  ManufacturerResponse,
  ProductPaginationRequest,
  ProductPresentationDetailResponse,
  PresentationResponse,
} from '@pharmatech/sdk';
import { ServiceResponse } from '../types/api';
import { extractErrorMessage } from '../utils/errorHandler';

export const ProductService = {
  getProducts: async (
    page: number,
    limit: number,
    params?: ProductPaginationRequest,
  ): Promise<ServiceResponse<Pagination<ProductPresentation>>> => {
    try {
      const products = await api.product.getProducts({
        page: page,
        limit: limit,
        ...params,
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
  getPresentations: async (
    page: number,
    limit: number,
  ): Promise<ServiceResponse<Pagination<PresentationResponse>>> => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      const presentations = await api.presentation.findAll({ page, limit });

      return { success: true, data: presentations };
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

  getBrands: async (
    page: number,
    limit: number,
  ): Promise<ServiceResponse<Pagination<ManufacturerResponse>>> => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await api.manufacturer.findAll({ page, limit });

      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },
};
