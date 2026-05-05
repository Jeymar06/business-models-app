import { create } from 'zustand';

type AppStore = {
  sidebarOpen: boolean;
  selectedModelId: string | null;
  setSelectedModelId: (modelId: string | null) => void;
  toggleSidebar: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
  sidebarOpen: true,
  selectedModelId: null,
  setSelectedModelId: (selectedModelId) => set({ selectedModelId }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
