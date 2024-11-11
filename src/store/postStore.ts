import { create } from 'zustand';

export interface Post {
  id: string;
  userId: string;
  content: string;
  image?: string;
  createdAt: number;
  likes: string[];
  comments: {
    id: string;
    userId: string;
    content: string;
    createdAt: number;
  }[];
}

interface PostState {
  posts: Post[];
  addPost: (userId: string, content: string, image?: string) => void;
  deletePost: (postId: string) => void;
  likePost: (postId: string, userId: string) => void;
  unlikePost: (postId: string, userId: string) => void;
  addComment: (postId: string, userId: string, content: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  getPostsForUser: (userId: string) => Post[];
  getFriendsPosts: (userId: string, friendIds: string[]) => Post[];
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],

  addPost: (userId, content, image) => {
    const newPost: Post = {
      id: Date.now().toString(),
      userId,
      content,
      image,
      createdAt: Date.now(),
      likes: [],
      comments: [],
    };

    set((state) => ({
      posts: [newPost, ...state.posts],
    }));
  },

  deletePost: (postId) => {
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    }));
  },

  likePost: (postId, userId) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId && !post.likes.includes(userId)
          ? { ...post, likes: [...post.likes, userId] }
          : post
      ),
    }));
  },

  unlikePost: (postId, userId) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.likes.filter((id) => id !== userId) }
          : post
      ),
    }));
  },

  addComment: (postId, userId, content) => {
    const newComment = {
      id: Date.now().toString(),
      userId,
      content,
      createdAt: Date.now(),
    };

    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      ),
    }));
  },

  deleteComment: (postId, commentId) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.filter((comment) => comment.id !== commentId),
            }
          : post
      ),
    }));
  },

  getPostsForUser: (userId) => {
    return get().posts.filter((post) => post.userId === userId);
  },

  getFriendsPosts: (userId, friendIds) => {
    return get().posts
      .filter((post) => friendIds.includes(post.userId) || post.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
}));