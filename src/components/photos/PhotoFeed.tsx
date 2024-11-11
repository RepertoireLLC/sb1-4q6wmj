import { useState, useRef, useEffect } from 'react';
import { usePhotoStore, Photo, PhotoPrivacy } from '../../store/photoStore';
import { useAuthStore } from '../../store/authStore';
import { useFriendStore } from '../../store/friendStore';
import { useUserStore } from '../../store/userStore';
import { PhotoPost } from './PhotoPost';
import { CreatePhotoPost } from './CreatePhotoPost';
import { Plus, Filter, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PhotoFeed() {
  const [showCreate, setShowCreate] = useState(false);
  const [privacyFilter, setPrivacyFilter] = useState<PhotoPrivacy | 'all'>('all');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  
  const currentUser = useAuthStore((state) => state.user);
  const users = useUserStore((state) => state.users);
  const { friendRequests } = useFriendStore();
  const photos = usePhotoStore((state) => state.photos);

  useEffect(() => {
    const handleScroll = () => {
      if (feedRef.current) {
        setShowScrollTop(feedRef.current.scrollTop > 500);
      }
    };

    const feedElement = feedRef.current;
    if (feedElement) {
      feedElement.addEventListener('scroll', handleScroll);
      return () => feedElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    feedRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!currentUser) return null;

  const friendIds = friendRequests
    .filter(
      (request) =>
        request.status === 'accepted' &&
        (request.fromUserId === currentUser.id || request.toUserId === currentUser.id)
    )
    .map((request) =>
      request.fromUserId === currentUser.id ? request.toUserId : request.fromUserId
    );

  const filteredPhotos = photos
    .filter((photo) => {
      if (privacyFilter === 'all') {
        if (photo.userId === currentUser.id) return true;
        if (photo.privacy === 'public') return true;
        if (photo.privacy === 'friends' && friendIds.includes(photo.userId)) return true;
        return false;
      }
      return photo.privacy === privacyFilter;
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="w-[400px] bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-xl overflow-hidden">
      <div className="sticky top-0 z-10 bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Photo Feed</h2>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Post</span>
            </button>
          </div>

          <div className="relative">
            <select
              value={privacyFilter}
              onChange={(e) => setPrivacyFilter(e.target.value as PhotoPrivacy | 'all')}
              className="w-full appearance-none bg-white/10 text-white px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value="all">All Photos</option>
              <option value="public">Public Only</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private Only</option>
            </select>
            <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
          </div>
        </div>
      </div>

      <div 
        ref={feedRef}
        className="h-[calc(100vh-12rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
      >
        <div className="p-4 space-y-6">
          {filteredPhotos.map((photo) => (
            <PhotoPost
              key={photo.id}
              photo={photo}
              currentUser={currentUser}
              users={users}
            />
          ))}
          {filteredPhotos.length === 0 && (
            <div className="text-center text-white/60 py-8">
              No photos to display
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full shadow-lg transition-colors"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {showCreate && (
        <CreatePhotoPost onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}