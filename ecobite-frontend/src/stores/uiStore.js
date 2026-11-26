import { create } from "zustand";

export const useUiStore = create((set) => ({
  // UI flags
  cartDrawerOpen: false,

  // Open / close actions for the cart drawer
  openCartDrawer: () => set({ cartDrawerOpen: true }),
  closeCartDrawer: () => set({ cartDrawerOpen: false }),
}));

// Public helpers that can be called from any CTA
export const showCart = () => {
  useUiStore.getState().openCartDrawer();
};

export const hideCart = () => {
  useUiStore.getState().closeCartDrawer();
};
