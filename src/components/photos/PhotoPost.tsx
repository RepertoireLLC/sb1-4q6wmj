import { useState } from 'react';
import { Photo } from '../../store/photoStore';
import { usePhotoStore } from '../../store/photoStore';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Trash2, Globe, Users, Lock, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoPostProps {
  photo: Photo;
  currentUser: any;
  users: any[];
}

export function PhotoPost({ photo, currentUser, users }: PhotoPostProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { likePhoto, unlikePhoto, addComment, removeComment, removePhoto } = usePhotoStore();

  const photoUser = users.find((u) => u.id === photo.userId);
  const isLiked = photo.likes.includes(currentUser.id);
  const isOwnPhoto = photo.userId === currentUser.id;

  const getPrivacyIcon = () => {
    switch (photo.privacy) {
      case 'public': return <Globe className="w-4 h-4" />;
      case 'friends': return <Users className="w-4 h-4" />;
      case 'private': return <Lock className="w-4 h-4" />;
    }
  };

  const handleLike = () => {
    if (isLiked) {
      unlikePhoto(photo.id, currentUser.id);
    } else {
      likePhoto(photo.id, currentUser.id);
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(photo.id, currentUser.id, newComment.trim());
      setNewComment('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/10 rounded-xl overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: photoUser?.color }}
            >
              <span className="text-white text-lg">
                {photoUser?.name[0].toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{photoUser?.name}</span>
                <div className="text-white/60">{getPrivacyIcon()}</div>
              </div>
              <span className="text-sm text-white/60">
                {formatDistanceToNow(photo.createdAt, { addSuffix: true })}
              </span>
            </div>
          </div>

          {isOwnPhoto && (
            <button
              onClick={() => removePhoto(photo.id)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {photo.caption && (
          <p className="text-white/90 mb-4">{photo.caption}</p>
        )}

        <img
          src={photo.url}
          alt={photo.caption || 'Photo post'}
          className="w-full rounded-lg mb-4"
        />

        <div className="flex items-center justify-between text-white/60">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked ? 'text-red-400' : 'hover:text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{photo.likes.length}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 hover:text-white transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{photo.comments.length}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10"
          >
            <div className="p-4">
              <form onSubmit={handleComment} className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="p-2 bg-white/10 rounded-lg text-white/60 hover:bg-white/20 hover:text-white disabled:opacity-50 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>

              <div className="space-y-4">
                {photo.comments.map((comment) => {
                  const commentUser = users.find((u) => u.id === comment.userId);
                  return (
                    <div key={comment.id} className="flex space-x-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: commentUser?.color }}
                      >
                        <span className="text-white text-sm">
                          {commentUser?.name[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">
                            {commentUser?.name}
                          </span>
                          <span className="text-sm text-white/60">
                            {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-white/80 mt-1">{comment.content}</p>
                      </div>
                      {comment.userId === currentUser.id && (
                        <button
                          onClick={() => removeComment(photo.id, comment.id)}
                          className="text-white/40 hover:text-white/60 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}