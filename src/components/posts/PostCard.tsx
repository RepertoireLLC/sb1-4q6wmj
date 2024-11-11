import { useState } from 'react';
import { usePostStore, Post } from '../../store/postStore';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { useModalStore } from '../../store/modalStore';
import { Heart, MessageCircle, Trash2, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const currentUser = useAuthStore((state) => state.user);
  const users = useUserStore((state) => state.users);
  const { likePost, unlikePost, addComment, deletePost, deleteComment } = usePostStore();
  const setProfileUserId = useModalStore((state) => state.setProfileUserId);

  if (!currentUser) return null;

  const postUser = users.find((u) => u.id === post.userId);
  const isLiked = post.likes.includes(currentUser.id);
  const isOwnPost = post.userId === currentUser.id;

  const handleLike = () => {
    if (isLiked) {
      unlikePost(post.id, currentUser.id);
    } else {
      likePost(post.id, currentUser.id);
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(post.id, currentUser.id, newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="bg-white/5 rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setProfileUserId(post.userId)}
            className="flex items-center space-x-3"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: postUser?.color }}
            >
              <span className="text-white text-lg">
                {postUser?.name[0].toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-white font-medium">{postUser?.name}</span>
              <span className="text-sm text-white/60">
                {formatDistanceToNow(post.createdAt, { addSuffix: true })}
              </span>
            </div>
          </button>

          {isOwnPost && (
            <button
              onClick={() => deletePost(post.id)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        <p className="text-white/90 mb-4 whitespace-pre-wrap">{post.content}</p>

        {post.image && (
          <img
            src={post.image}
            alt="Post attachment"
            className="w-full rounded-lg mb-4"
          />
        )}

        <div className="flex items-center justify-between text-white/60">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked ? 'text-red-400' : 'hover:text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{post.likes.length}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 hover:text-white transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments.length}</span>
          </button>
        </div>
      </div>

      {showComments && (
        <div className="border-t border-white/10 p-4">
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
            {post.comments.map((comment) => {
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
                      onClick={() => deleteComment(post.id, comment.id)}
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
      )}
    </div>
  );
}