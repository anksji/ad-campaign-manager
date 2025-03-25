import {
  Campaign,
  CreateCampaignDto,
  UpdateCampaignDto,
  CampaignFilter,
} from "@/types/compaign.types";
import { api } from "@/services/api/api.config";
import { API_ENDPOINTS } from "@/services/endpoints";

export const CampaignService = {
  /**
   * Get all campaigns with optional filtering and pagination
   * @param params Optional filter and pagination parameters
   * @returns Array of campaigns with pagination metadata
   */
  async getCampaigns(params?: {
    page?: number;
    limit?: number;
    title?: string;
    type?: string;
    status?: string;
  }): Promise<{ data: Campaign[]; meta: any }> {
    try {
      // Clean up empty params
      const cleanParams: Record<string, string | number> = {};

      // Only add non-empty values to the params
      if (params?.page) cleanParams.page = params.page;
      if (params?.limit) cleanParams.limit = params.limit;
      if (params?.title && params.title.trim() !== "")
        cleanParams.title = params.title;
      if (params?.type && params.type.trim() !== "")
        cleanParams.type = params.type;
      if (params?.status && params.status.trim() !== "")
        cleanParams.status = params.status;

      const response = await api.get(API_ENDPOINTS.campaigns, {
        params: cleanParams,
      });

      const responseData = response.data.data || response.data;
      const meta = response.data.meta || {
        page: 1,
        limit: 10,
        total: responseData.length,
      };

      return {
        data: Array.isArray(responseData) ? responseData : [],
        meta,
      };
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      throw error;
    }
  },

  /**
   * Create new campaign
   * @param campaignData Campaign data to create
   * @returns Created campaign
   */
  async createCampaign(campaignData: CreateCampaignDto): Promise<Campaign> {
    try {
      const response = await api.post(API_ENDPOINTS.campaigns, campaignData);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error creating campaign:", error);
      throw error;
    }
  },

  /**
   * Update campaign
   * @param id Campaign ID to update
   * @param campaignData Updated campaign data
   * @returns Updated campaign
   */
  async updateCampaign(
    id: string,
    campaignData: Omit<UpdateCampaignDto, "id">
  ): Promise<Campaign> {
    try {
      const response = await api.put(
        `${API_ENDPOINTS.campaigns}/${id}`,
        campaignData
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error updating campaign ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete campaign
   * @param id Campaign ID to delete
   */
  async deleteCampaign(id: string): Promise<void> {
    try {
      await api.delete(`${API_ENDPOINTS.campaigns}/${id}`);
    } catch (error) {
      console.error(`Error deleting campaign ${id}:`, error);
      throw error;
    }
  },
};
