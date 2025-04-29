import { api } from '../lib/sdkConfig';
import { Pagination, BranchResponse } from '@pharmatech/sdk';
import { extractErrorMessage } from '../utils/errorHandler';

type FindAllParams = {
  page?: number;
  limit?: number;
  q?: string;
  stateId?: string;
};

export const BranchService = {
  findAll: async ({
    page = 1,
    limit = 100,
    q,
    stateId,
  }: FindAllParams): Promise<Pagination<BranchResponse>> => {
    try {
      const response = await api.branch.findAll({ page, limit, q, stateId });

      return response;
    } catch (error) {
      console.error('Error en BranchService.findAll:', error);
      throw new Error(extractErrorMessage(error));
    }
  },
};
