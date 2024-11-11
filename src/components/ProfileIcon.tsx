import { User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useModalStore } from '../store/modalStore';
import { usePhotoStore } from '../store/photoStore';

interface ProfileIconProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ProfileIcon({ isOpen, onToggle }: ProfileIconProps) {
  const currentUser = useAuthStore((state) => state.user);
  const { setProfileUserId } = useModalStore();
  const userPhotos = usePhotoStore((state) => 
    currentUser ? state.getUserPhotos(currentUser.id) : []
  );

  if (!currentUser) return null;

  const profilePicture = currentUser.profilePicture || userPhotos[0]?.url;

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="p-2 text-white hover:text-white/80 transition-colors flex items-center space-x-2"
      >
        {profilePicture ? (
          <img
            src={profilePicture}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: currentUser.color }}
          >
            <span className="text-white text-sm font-medium">
              {currentUser.name[0].toUpperCase()}
            </span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
          <button
            onClick={() => {
              setProfileUserId(currentUser.id);
              onToggle();
            }}
            className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors"
          >
            View Profile
          </button>
          <button
            onClick={() => {
              setProfileUserId(currentUser.id);
              onToggle();
            }}
            className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}