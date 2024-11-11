import { useRef } from 'react';
import { Camera } from 'lucide-react';
import { compressImage } from '../../utils/imageUtils';

interface ProfileBannerProps {
  user: {
    id: string;
    name: string;
    color: string;
    bannerImage?: string;
  };
  isOwnProfile: boolean;
  onUpdate: (updates: { bannerImage?: string }) => void;
}

export function ProfileBanner({ user, isOwnProfile, onUpdate }: ProfileBannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await compressImage(file);
        onUpdate({ bannerImage: compressedImage });
      } catch (error) {
        console.error('Error processing banner image:', error);
      }
    }
  };

  return (
    <div className="relative h-48 rounded-t-xl overflow-hidden">
      {user.bannerImage ? (
        <img
          src={user.bannerImage}
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className="w-full h-full"
          style={{
            background: `linear-gradient(to right, ${user.color}66, ${user.color}99)`,
          }}
        />
      )}
      
      {isOwnProfile && (
        <>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-lg text-white hover:bg-black/60 transition-colors"
          >
            <Camera className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleBannerChange}
            className="hidden"
          />
        </>
      )}
    </div>
  );
}