import { create } from 'zustand';

export type ThemeType = 
  | 'classicElegance'
  | 'modernTech'
  | 'executiveSuite'
  | 'auroraNetwork'
  | 'minimalistZen'
  | 'globalConnect'
  | 'futuristicMatrix'
  | 'corporateHorizon'
  | 'neoVintage'
  | 'sleekMonochrome';

interface ThemeState {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  currentTheme: 'classicElegance',
  setTheme: (theme) => set({ currentTheme: theme }),
}));