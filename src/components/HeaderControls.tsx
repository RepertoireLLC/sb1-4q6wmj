import { useAuthStore } from '../store/authStore';
import { ProfileIcon } from './ProfileIcon';
import { ThemeSelector } from './ThemeSelector';
import { FriendRequests } from './FriendRequests';
import { useDropdownStore } from '../store/dropdownStore';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Menu, X, ImagePlus } from 'lucide-react';
import { useState, useRef } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';
import { CreatePhotoPost } from './photos/CreatePhotoPost';

export function HeaderControls() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { activeDropdown, setActiveDropdown } = useDropdownStore();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPhotoPost, setShowPhotoPost] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    setActiveDropdown(null);
  });

  if (!isAuthenticated) return null;

  const handleDropdownClick = (dropdown: 'theme' | 'requests' | 'profile') => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const MobileMenu = () => (
    <div className="fixed inset-x-0 top-0 h-16 bg-black/50 backdrop-blur-md z-50">
      <div className="p-4 flex justify-end gap-4">
        <button
          onClick={() => setShowPhotoPost(true)}
          className="text-white hover:text-white/80 transition-colors"
        >
          <ImagePlus className="w-6 h-6" />
        </button>
        <ThemeSelector 
          isOpen={activeDropdown === 'theme'} 
          onToggle={() => handleDropdownClick('theme')} 
        />
        <FriendRequests 
          isOpen={activeDropdown === 'requests'} 
          onToggle={() => handleDropdownClick('requests')} 
        />
        <ProfileIcon 
          isOpen={activeDropdown === 'profile'} 
          onToggle={() => handleDropdownClick('profile')} 
        />
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed top-4 right-4 z-10 p-2 bg-white/10 backdrop-blur-md rounded-lg text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
        {isMobileMenuOpen && <MobileMenu />}
        {showPhotoPost && <CreatePhotoPost onClose={() => setShowPhotoPost(false)} />}
      </>
    );
  }

  return (
    <div className="absolute top-4 right-8 z-10" ref={dropdownRef}>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowPhotoPost(true)}
          className="p-2 text-white hover:text-white/80 transition-colors flex items-center gap-2"
          title="Create Photo Post"
        >
          <ImagePlus className="w-5 h-5" />
        </button>
        <div className="relative">
          <ThemeSelector 
            isOpen={activeDropdown === 'theme'} 
            onToggle={() => handleDropdownClick('theme')} 
          />
        </div>
        <div className="relative">
          <FriendRequests 
            isOpen={activeDropdown === 'requests'} 
            onToggle={() => handleDropdownClick('requests')} 
          />
        </div>
        <div className="relative">
          <ProfileIcon 
            isOpen={activeDropdown === 'profile'} 
            onToggle={() => handleDropdownClick('profile')} 
          />
        </div>
      </div>
      {showPhotoPost && <CreatePhotoPost onClose={() => setShowPhotoPost(false)} />}
    </div>
  );
}