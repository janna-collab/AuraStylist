import { create } from 'zustand';

export const useUserProfileStore = create((set) => ({
  profileImage: null,
  height: '',
  shoeSize: '',
  preferredFit: '',
  bodyAnalysis: null,
  styleReport: null,
  styleOutfits: [],
  setProfileImage: (image) => set({ profileImage: image }),
  setDetails: (details) => set((state) => ({ ...state, ...details })),
  setBodyAnalysis: (analysis) => set({ bodyAnalysis: analysis }),
  setStyleReport: (report) => set({ styleReport: report }),
  setStyleOutfits: (outfits) => set({ styleOutfits: outfits }),
}));
