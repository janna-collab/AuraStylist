import { create } from 'zustand';

export const useStylingRequestStore = create((set) => ({
  venue: '',
  aesthetic: '',
  dressType: '',
  priceRange: '',
  referenceImage: null,
  setDetails: (details) => set((state) => ({ ...state, ...details })),
}));
