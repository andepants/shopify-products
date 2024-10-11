import { create } from 'zustand'

export const useProductStore = create((set) => ({
  product: null, // Initial state for the product
  setProduct: (newProduct: any) => set({ product: newProduct }), // Action to set a new product
  clearProduct: () => set({ product: null }), // Action to clear the product
}))