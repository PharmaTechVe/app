import { api } from '../lib/sdkConfig';
import { ServiceResponse, Inventory } from '../types/api.d';
import { Pagination, InventoryResponse } from '@pharmatech/sdk';
import { extractErrorMessage } from '../utils/errorHandler';

type GetBranchInventoryParams = {
  page?: number;
  limit?: number;
  branchId: string;
};

export const InventoryService = {
  getPresentationInventory: async (
    page: number,
    limit: number,
    presentationId: string,
  ): Promise<ServiceResponse<Pagination<Inventory>>> => {
    try {
      const inventory = await api.inventory.findAll({
        page: page,
        limit: limit,
        productPresentationId: presentationId,
      });

      return { success: true, data: inventory };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },

  getBranchInventory: async ({
    page = 1,
    limit = 10,
    branchId,
  }: GetBranchInventoryParams): Promise<Pagination<InventoryResponse>> => {
    try {
      const response = await api.inventory.findAll({ page, limit, branchId });
      return response;
    } catch (error) {
      console.error('Error en InventoryService.getBranchInventory:', error);
      throw new Error(extractErrorMessage(error));
    }
  },
};
