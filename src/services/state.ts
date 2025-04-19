import { api } from '../lib/sdkConfig';
import {
  ServiceResponse,
  Pagination,
  State,
  CityResponse,
} from '../types/api.d';
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

  getState: async (id: string): Promise<ServiceResponse<State>> => {
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
  ): Promise<ServiceResponse<Pagination<CityResponse>>> => {
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

  getCity: async (id: string): Promise<ServiceResponse<CityResponse>> => {
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
