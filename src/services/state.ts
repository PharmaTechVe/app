import { api } from '../lib/sdkConfig';
import { ServiceResponse, Pagination, State } from '../types/api.d';
import { extractErrorMessage } from '../utils/errorHandler';

export const StateService = {
  getStates: async (
    page: number,
    limit: number,
  ): Promise<ServiceResponse<Pagination<State>>> => {
    try {
      const states = await api.state.findAll({
        page: page,
        limit: limit,
      });

      return { success: true, data: states };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },
};
