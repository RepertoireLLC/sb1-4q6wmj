import { Camera, X, Globe, Users, Lock } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { useState, useRef } from 'react';
import { PhotoGrid } from './PhotoGrid';
import { compressImage } from '../../utils/imageUtils';
import { usePhotoStore } from '../../store/photoStore';

interface EditProfileProps {
  userId: string;
  onClose: () => void;
  onSave: () => void;
}

export function EditProfile({ userId, onClose, onSave }: EditProfileProps) {
  const user = useUserStore((state) => state.users.find(u => u.id === userId));
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const addPhoto = usePhotoStore((state) => state.addPhoto);
  
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editLocation, setEditLocation] = useState(user?.location || '');
  const [editWebsite, setEditWebsite] = useState(user?.website || '');
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await compressImage(file);
        updateProfile({ profilePicture: compressedImage });
        // Also add to photo store as the first photo
        addPhoto(userId, compressedImage, 'Profile Picture');
      } catch (error) {
        console.error('Error processing profile picture:', error);
      }
    }
  };

  const handleSave = () => {
    updateProfile({
      name: editName.trim() || user.name,
      bio: editBio.trim(),
      location: editLocation.trim(),
      website: editWebsite.trim(),
    });
    onSave();
  };

  const getPrivacyIcon = () => {
    switch (privacy) {
      case 'public': return <Globe className="w-4 h-4" />;
      case 'friends': return <Users className="w-4 h-4" />;
      case 'private': return <Lock className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-xl shadow-xl">
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start space-x-4">
            <div className="relative">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-black/20"
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-black/20"
                  style={{ backgroundColor: user.color }}
                >
                  <span className="text-white text-3xl">
                    {user.name[0].toUpperCase()}
                  </span>
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </div>
          </div>
          
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-white/80 mb-2">Display Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2">Bio</label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white resize-none"
              rows={4}
              placeholder="Write something about yourself..."
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2">Location</label>
            <input
              type="text"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
              placeholder="Your location"
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2">Website</label>
            <input
              type="url"
              value={editWebsite}
              onChange={(e) => setEditWebsite(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
              placeholder="https://example.com"
            />
          </div>

          <PhotoGrid userId={userId} isEditing={true} />

          <div>
            <label className="block text-white/80 mb-2">Profile Privacy</label>
            <div className="flex items-center space-x-2 p-4 bg-white/5 rounded-lg">
              {getPrivacyIcon()}
              <select
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value as typeof privacy)}
                className="bg-white/10 text-white border border-white/20 rounded px-2 py-1"
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSave}
              className="flex-1 py-3 px-4 bg-emerald-500/20 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}