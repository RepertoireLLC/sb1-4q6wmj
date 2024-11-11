import { useState, useRef } from 'react';
import { usePostStore } from '../../store/postStore';
import { useAuthStore } from '../../store/authStore';
import { Image, X, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface CreatePostProps {
  onClose: () => void;
}

export function CreatePost({ onClose }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addPost } = usePostStore();
  const currentUser = useAuthStore((state) => state.user);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser && content.trim()) {
      addPost(currentUser.id, content.trim(), imagePreview || undefined);
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-white/10 backdrop-blur-md rounded-xl shadow-xl"
      >
        <div className="p-4 border-b border-white/10">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Create Post</h3>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 resize-none"
            rows={4}
          />

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
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-12 border-2 border-dashed border-white/10 rounded-lg text-white/60 hover:text-white hover:border-white/30 transition-colors"
            >
              <Image className="w-8 h-8 mx-auto mb-2" />
              <span>Add an image</span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Post</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}