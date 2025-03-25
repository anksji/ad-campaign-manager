import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  Campaign,
  CreateCampaignDto,
  UpdateCampaignDto,
  CampaignFilter,
} from "@/types/compaign.types";
import { CampaignService } from "@/services/api/compaign/campaign.api.service";

interface CampaignState {
  // Data
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  filter: CampaignFilter;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // UI States
  isLoading: boolean;
  error: string | null;
  formOpen: boolean;
  deleteDialogOpen: boolean;

  // Actions
  fetchCampaigns: (params?: { page?: number; limit?: number }) => Promise<void>;
  searchCampaigns: (filter: CampaignFilter) => Promise<void>;
  getCampaign: (id: string) => Promise<void>;
  createCampaign: (data: CreateCampaignDto) => Promise<boolean>;
  updateCampaign: (data: UpdateCampaignDto) => Promise<boolean>;
  deleteCampaign: (id: string) => Promise<boolean>;

  // UI Actions
  setFilter: (filter: CampaignFilter) => void;
  clearFilter: () => void;
  openForm: (campaign?: Campaign) => void;
  closeForm: () => void;
  openDeleteDialog: (campaign: Campaign) => void;
  closeDeleteDialog: () => void;
  clearSelectedCampaign: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export const useCampaignStore = create<CampaignState>()(
  devtools((set, get) => ({
    // Initial state
    campaigns: [],
    selectedCampaign: null,
    filter: { title: "", type: "", status: "" },
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    isLoading: false,
    error: null,
    formOpen: false,
    deleteDialogOpen: false,

    // Data fetching actions
    fetchCampaigns: async (params = {}) => {
      try {
        set({ isLoading: true, error: null });
        const { page, limit } = params;
        const filter = get().filter;

        const result = await CampaignService.getCampaigns({
          page: page || get().pagination.page,
          limit: limit || get().pagination.limit,
          title: filter.title,
          type: filter.type || undefined,
          status: filter.status || undefined,
        });

        set({
          campaigns: Array.isArray(result.data) ? result.data : [],
          pagination: {
            page: result.meta.page || 1,
            limit: result.meta.limit || 10,
            total: result.meta.total || 0,
            totalPages: result.meta.totalPages || 1,
          },
          isLoading: false,
        });
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch campaigns",
          isLoading: false,
          campaigns: [],
        });
      }
    },

    searchCampaigns: async (filter: CampaignFilter) => {
      try {
        set({ isLoading: true, error: null, filter });

        const page = 1;
        const limit = get().pagination.limit;

        const result = await CampaignService.getCampaigns({
          page,
          limit,
          title: filter.title,
          type: filter.type || undefined,
          status: filter.status || undefined,
        });

        set({
          campaigns: Array.isArray(result.data) ? result.data : [],
          pagination: {
            page: result.meta.page || 1,
            limit: result.meta.limit || 10,
            total: result.meta.total || 0,
            totalPages: result.meta.totalPages || 1,
          },
          isLoading: false,
        });
      } catch (error) {
        console.error("Error searching campaigns:", error);
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to search campaigns",
          isLoading: false,
        });
      }
    },

    createCampaign: async (data: CreateCampaignDto) => {
      try {
        set({ isLoading: true, error: null });
        const newCampaign = await CampaignService.createCampaign(data);

        set((state) => {
          // Ensure campaigns is an array
          const currentCampaigns = Array.isArray(state.campaigns)
            ? state.campaigns
            : [];
          return {
            campaigns: [newCampaign, ...currentCampaigns],
            isLoading: false,
            formOpen: false,
            pagination: {
              ...state.pagination,
              total: state.pagination.total + 1,
              totalPages: Math.ceil(
                (state.pagination.total + 1) / state.pagination.limit
              ),
            },
          };
        });
        return true;
      } catch (error) {
        console.error("Error creating campaign:", error);
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to create campaign",
          isLoading: false,
        });
        return false;
      }
    },

    updateCampaign: async (data: UpdateCampaignDto) => {
      try {
        set({ isLoading: true, error: null });
        const updatedCampaign = await CampaignService.updateCampaign(
          data.id,
          data
        );

        set((state) => {
          // Ensure campaigns is an array
          const currentCampaigns = Array.isArray(state.campaigns)
            ? state.campaigns
            : [];
          return {
            campaigns: currentCampaigns.map((c) =>
              c.id === updatedCampaign.id ? updatedCampaign : c
            ),
            isLoading: false,
            formOpen: false,
            selectedCampaign: null,
          };
        });
        return true;
      } catch (error) {
        console.error("Error updating campaign:", error);
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to update campaign",
          isLoading: false,
        });
        return false;
      }
    },

    deleteCampaign: async (id: string) => {
      try {
        set({ isLoading: true, error: null });
        await CampaignService.deleteCampaign(id);

        set((state) => {
          // Ensure campaigns is an array
          const currentCampaigns = Array.isArray(state.campaigns)
            ? state.campaigns
            : [];
          const newTotal = Math.max(0, state.pagination.total - 1);

          return {
            campaigns: currentCampaigns.filter((c) => c.id !== id),
            isLoading: false,
            deleteDialogOpen: false,
            selectedCampaign: null,
            pagination: {
              ...state.pagination,
              total: newTotal,
              totalPages: Math.ceil(newTotal / state.pagination.limit),
            },
          };
        });
        return true;
      } catch (error) {
        console.error("Error deleting campaign:", error);
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to delete campaign",
          isLoading: false,
        });
        return false;
      }
    },

    // UI state actions
    setFilter: (filter: CampaignFilter) => {
      set({ filter });
    },

    clearFilter: () => {
      set({ filter: { title: "", type: "", status: "" } });
    },

    openForm: (campaign?: Campaign) => {
      set({
        formOpen: true,
        selectedCampaign: campaign || null,
      });
    },

    closeForm: () => {
      set({
        formOpen: false,
        selectedCampaign: null,
      });
    },

    openDeleteDialog: (campaign: Campaign) => {
      set({
        deleteDialogOpen: true,
        selectedCampaign: campaign,
      });
    },

    closeDeleteDialog: () => {
      set({
        deleteDialogOpen: false,
      });
    },

    clearSelectedCampaign: () => {
      set({ selectedCampaign: null });
    },

    setPage: (page: number) => {
      set((state) => ({
        pagination: {
          ...state.pagination,
          page,
        },
      }));
      get().fetchCampaigns({ page });
    },

    setLimit: (limit: number) => {
      set((state) => ({
        pagination: {
          ...state.pagination,
          limit,
          // Reset to first page when changing limit
          page: 1,
        },
      }));
      get().fetchCampaigns({ limit, page: 1 });
    },
  }))
);
