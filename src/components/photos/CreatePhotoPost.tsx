import { useState, useRef } from 'react';
import { usePhotoStore, PhotoPrivacy } from '../../store/photoStore';
import { useAuthStore } from '../../store/authStore';
import { Image, X, Globe, Users, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { compressImage } from '../../utils/imageUtils';

interface CreatePhotoPostProps {
  onClose: () => void;
}

export function CreatePhotoPost({ onClose }: CreatePhotoPostProps) {
  const [caption, setCaption] = useState('');
  const [privacy, setPrivacy] = useState<PhotoPrivacy>('public');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addPhoto } = usePhotoStore();
  const currentUser = useAuthStore((state) => state.user);

  if (!currentUser) return null;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await compressImage(file);
        setImagePreview(compressedImage);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imagePreview) {
      addPhoto(currentUser.id, imagePreview, caption, privacy);
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-white/10 backdrop-blur-md rounded-xl shadow-xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/10 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Create Photo Post</h3>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Post preview"
                  className="w-full rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-12 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-colors"
              >
                <Image className="w-8 h-8 mb-2" />
                <span>Choose a photo to share</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 resize-none"
              rows={3}
            />

            <div className="flex items-center space-x-4">
              <label className="text-white/80">Privacy:</label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPrivacy('public')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
                    privacy === 'public'
                      ? 'bg-white/20 text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>Public</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPrivacy('friends')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
                    privacy === 'friends'
                      ? 'bg-white/20 text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Friends</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPrivacy('private')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
                    privacy === 'private'
                      ? 'bg-white/20 text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Private</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-white/10 flex-shrink-0">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!imagePreview}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Share Photo
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}