import { api } from '../lib/sdkConfig';
import { ServiceResponse, Pagination, Inventory } from '../types/api.d';
import { extractErrorMessage } from '../utils/errorHandler';

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
};
