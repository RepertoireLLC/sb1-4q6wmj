import { Palette } from 'lucide-react';
import { useState } from 'react';
import { useThemeStore, ThemeType } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';

interface ThemeSelectorProps {
  isOpen: boolean;
  onToggle: () => void;
}

const themes: { id: ThemeType; name: string; description: string }[] = [
  { 
    id: 'classicElegance', 
    name: 'Classic Elegance', 
    description: 'Timeless blue wireframe sphere with gentle pulses'
  },
  { 
    id: 'modernTech', 
    name: 'Modern Tech', 
    description: 'Dynamic cyan grid with rapid data flows'
  },
  { 
    id: 'executiveSuite', 
    name: 'Executive Suite', 
    description: 'Luxurious gold sphere with premium finish'
  },
  { 
    id: 'auroraNetwork', 
    name: 'Aurora Network', 
    description: 'Mesmerizing purple waves with particle effects'
  },
  { 
    id: 'minimalistZen', 
    name: 'Minimalist Zen', 
    description: 'Clean, subtle design with peaceful motion'
  },
  { 
    id: 'globalConnect', 
    name: 'Global Connect', 
    description: 'Earth-like sphere with orbiting connections'
  },
  { 
    id: 'futuristicMatrix', 
    name: 'Futuristic Matrix', 
    description: 'High-tech green grid with digital rain effect'
  },
  { 
    id: 'corporateHorizon', 
    name: 'Corporate Horizon', 
    description: 'Professional blue design with structured grid'
  },
  { 
    id: 'neoVintage', 
    name: 'Neo-Vintage', 
    description: 'Warm amber tones with classic aesthetics'
  },
  { 
    id: 'sleekMonochrome', 
    name: 'Sleek Monochrome', 
    description: 'Minimalist black & white with sharp contrasts'
  }
];

export function ThemeSelector({ isOpen, onToggle }: ThemeSelectorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { currentTheme, setTheme } = useThemeStore();
  const currentUser = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const { updateUserColor, setOnlineStatus } = useUserStore();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentUser) {
      const newColor = e.target.value;
      updateProfile({ color: newColor });
      updateUserColor(currentUser.id, newColor);
      setOnlineStatus(currentUser.id, true);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="p-2 text-white hover:text-white/80 transition-colors"
      >
        <Palette className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
          <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  setTheme(theme.id);
                  onToggle();
                }}
                className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors ${
                  currentTheme === theme.id
                    ? 'bg-white/20 text-white'
                    : 'text-white/80'
                }`}
              >
                <div className="font-medium">{theme.name}</div>
                <div className="text-sm text-white/60">{theme.description}</div>
              </button>
            ))}
          </div>
          
          <div className="border-t border-white/10">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full px-4 py-3 text-left text-white/80 hover:bg-white/10 transition-colors"
            >
              Change Node Color
            </button>
            {showColorPicker && (
              <div className="px-4 py-2 bg-white/5">
                <input
                  type="color"
                  value={currentUser?.color || '#ffffff'}
                  onChange={handleColorChange}
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}