import { useState } from 'react';
import { usePostStore } from '../../store/postStore';
import { useFriendStore } from '../../store/friendStore';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { PostCard } from './PostCard';
import { CreatePost } from './CreatePost';
import { motion, AnimatePresence } from 'framer-motion';

export function PostList() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const currentUser = useAuthStore((state) => state.user);
  const users = useUserStore((state) => state.users);
  const { friendRequests } = useFriendStore();
  const { posts, getFriendsPosts } = usePostStore();

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

  const friendsPosts = getFriendsPosts(currentUser.id, friendIds);

  return (
    <div className="fixed right-4 top-20 bottom-4 w-80 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 shadow-xl overflow-hidden z-10">
      <div className="p-4 border-b border-white/10 sticky top-0 bg-white/10 backdrop-blur-md">
        <button
          onClick={() => setShowCreatePost(true)}
          className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-left"
        >
          What's on your mind?
        </button>
      </div>

      <div className="overflow-y-auto h-[calc(100%-5rem)] p-4 space-y-4">
        <AnimatePresence>
          {friendsPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showCreatePost && (
          <CreatePost onClose={() => setShowCreatePost(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}