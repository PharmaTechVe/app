import { api } from '../lib/sdkConfig';
import { Pagination, StateResponse, CityResponse } from '@pharmatech/sdk';
import { extractErrorMessage } from '../utils/errorHandler';

export const StateService = {
  getStates: async (
    page: number,
    limit: number,
  ): Promise<{
    success: boolean;
    data?: Pagination<StateResponse>;
    error?: string;
  }> => {
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

  getState: async (
    id: string,
  ): Promise<{ success: boolean; data?: StateResponse; error?: string }> => {
    try {
      const state = await api.state.getById(id);
      return { success: true, data: state };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },

  getCities: async (
    page: number,
    limit: number,
    stateId: string,
  ): Promise<{
    success: boolean;
    data?: Pagination<CityResponse>;
    error?: string;
  }> => {
    try {
      const cities = await api.city.findAll({
        page: page,
        limit: limit,
        stateId: stateId,
      });

      return { success: true, data: cities };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },

  getCity: async (
    id: string,
  ): Promise<{ success: boolean; data?: CityResponse; error?: string }> => {
    try {
      const city = await api.city.getById(id);
      return { success: true, data: city };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },
};
