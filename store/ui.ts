import { create } from "zustand";

export type CursorVariant = "default" | "hover" | "label";

type UIState = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;

  cursor: { variant: CursorVariant; label?: string };
  setCursor: (variant: CursorVariant, label?: string) => void;

  /** Subsidiary currently highlighted (hovered in the orbit / grid). */
  activeSubsidiary: string | null;
  setActiveSubsidiary: (slug: string | null) => void;
};

export const useUIStore = create<UIState>((set) => ({
  menuOpen: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),

  cursor: { variant: "default" },
  setCursor: (variant, label) => set({ cursor: { variant, label } }),

  activeSubsidiary: null,
  setActiveSubsidiary: (activeSubsidiary) => set({ activeSubsidiary }),
}));
