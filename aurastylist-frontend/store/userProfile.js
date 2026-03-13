import { create } from 'zustand';

export const useUserProfileStore = create((set) => ({
  profileImage: null,
  height: '',
  shoeSize: '',
  preferredFit: '',
  setProfileImage: (image) => set({ profileImage: image }),
  setDetails: (details) => set((state) => ({ ...state, ...details })),
}));
