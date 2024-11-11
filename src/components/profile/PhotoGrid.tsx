import { useState } from 'react';
import { usePhotoStore, Photo } from '../../store/photoStore';
import { ImagePlus, X, ZoomIn } from 'lucide-react';
import { compressImage } from '../../utils/imageUtils';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoGridProps {
  userId: string;
  isEditing: boolean;
}

export function PhotoGrid({ userId, isEditing }: PhotoGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const { photos, addPhoto, removePhoto } = usePhotoStore();
  const userPhotos = usePhotoStore((state) => state.getUserPhotos(userId));

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    for (const file of files) {
      try {
        const compressedImage = await compressImage(file);
        addPhoto(userId, compressedImage);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">Photos</h3>
        {isEditing && userPhotos.length < 9 && (
          <label className="cursor-pointer p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center gap-2">
            <ImagePlus className="w-4 h-4" />
            <span>Add Photos</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {userPhotos.map((photo) => (
          <div key={photo.id} className="relative group aspect-square">
            <img
              src={photo.url}
              alt={photo.caption || 'User photo'}
              className="w-full h-full object-cover rounded-lg cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <button
                onClick={() => setSelectedPhoto(photo)}
                className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              {isEditing && (
                <button
                  onClick={() => removePhoto(photo.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500/80 rounded-full text-white hover:bg-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption || 'Full size photo'}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}