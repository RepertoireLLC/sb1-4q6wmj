import { create } from 'zustand';

type DropdownType = 'friends' | 'theme' | 'requests' | 'profile' | null;

interface DropdownState {
  activeDropdown: DropdownType;
  setActiveDropdown: (dropdown: DropdownType) => void;
  closeAll: () => void;
}

export const useDropdownStore = create<DropdownState>((set) => ({
  activeDropdown: null,
  setActiveDropdown: (dropdown) => set({ activeDropdown: dropdown }),
  closeAll: () => set({ activeDropdown: null }),
}));