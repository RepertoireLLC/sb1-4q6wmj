import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PhotoPrivacy = 'public' | 'private' | 'friends';

export interface Photo {
  id: string;
  userId: string;
  url: string;
  caption?: string;
  privacy: PhotoPrivacy;
  createdAt: number;
  likes: string[];
  comments: {
    id: string;
    userId: string;
    content: string;
    createdAt: number;
  }[];
}

interface PhotoState {
  photos: Photo[];
  addPhoto: (userId: string, url: string, caption?: string, privacy?: PhotoPrivacy) => void;
  removePhoto: (photoId: string) => void;
  updatePhotoPrivacy: (photoId: string, privacy: PhotoPrivacy) => void;
  getUserPhotos: (userId: string) => Photo[];
  getFeedPhotos: (userId: string, friendIds: string[]) => Photo[];
  likePhoto: (photoId: string, userId: string) => void;
  unlikePhoto: (photoId: string, userId: string) => void;
  addComment: (photoId: string, userId: string, content: string) => void;
  removeComment: (photoId: string, commentId: string) => void;
}

export const usePhotoStore = create<PhotoState>()(
  persist(
    (set, get) => ({
      photos: [],

      addPhoto: (userId, url, caption, privacy = 'public') => {
        const newPhoto: Photo = {
          id: `photo_${Date.now()}`,
          userId,
          url,
          caption,
          privacy,
          createdAt: Date.now(),
          likes: [],
          comments: [],
        };

        set((state) => ({
          photos: [newPhoto, ...state.photos],
        }));
      },

      removePhoto: (photoId) => {
        set((state) => ({
          photos: state.photos.filter((photo) => photo.id !== photoId),
        }));
      },

      updatePhotoPrivacy: (photoId, privacy) => {
        set((state) => ({
          photos: state.photos.map((photo) =>
            photo.id === photoId ? { ...photo, privacy } : photo
          ),
        }));
      },

      getUserPhotos: (userId) => {
        return get().photos.filter((photo) => photo.userId === userId);
      },

      getFeedPhotos: (userId, friendIds) => {
        return get().photos
          .filter((photo) => {
            if (photo.userId === userId) return true;
            if (photo.privacy === 'public') return true;
            if (photo.privacy === 'friends' && friendIds.includes(photo.userId)) return true;
            return false;
          })
          .sort((a, b) => b.createdAt - a.createdAt);
      },

      likePhoto: (photoId, userId) => {
        set((state) => ({
          photos: state.photos.map((photo) =>
            photo.id === photoId && !photo.likes.includes(userId)
              ? { ...photo, likes: [...photo.likes, userId] }
              : photo
          ),
        }));
      },

      unlikePhoto: (photoId, userId) => {
        set((state) => ({
          photos: state.photos.map((photo) =>
            photo.id === photoId
              ? { ...photo, likes: photo.likes.filter((id) => id !== userId) }
              : photo
          ),
        }));
      },

      addComment: (photoId, userId, content) => {
        const newComment = {
          id: `comment_${Date.now()}`,
          userId,
          content,
          createdAt: Date.now(),
        };

        set((state) => ({
          photos: state.photos.map((photo) =>
            photo.id === photoId
              ? { ...photo, comments: [...photo.comments, newComment] }
              : photo
          ),
        }));
      },

      removeComment: (photoId, commentId) => {
        set((state) => ({
          photos: state.photos.map((photo) =>
            photo.id === photoId
              ? {
                  ...photo,
                  comments: photo.comments.filter((comment) => comment.id !== commentId),
                }
              : photo
          ),
        }));
      },
    }),
    {
      name: 'photo-storage',
    }
  )
);