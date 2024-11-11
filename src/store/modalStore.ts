import { create } from 'zustand';

interface ModalState {
  profileUserId: string | null;
  aboutVisible: boolean;
  setProfileUserId: (userId: string | null) => void;
  setAboutVisible: (visible: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  profileUserId: null,
  aboutVisible: false,
  setProfileUserId: (userId) => set({ profileUserId: userId }),
  setAboutVisible: (visible) => set({ aboutVisible: visible }),
}));