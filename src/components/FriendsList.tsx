import { useState, useRef } from 'react';
import { Users, Search, MessageCircle, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useFriendStore } from '../store/friendStore';
import { useUserStore } from '../store/userStore';
import { useModalStore } from '../store/modalStore';
import { useChatStore } from '../store/chatStore';
import { useClickOutside } from '../hooks/useClickOutside';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface FriendsListProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function FriendsList({ isOpen, onToggle }: FriendsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const currentUser = useAuthStore((state) => state.user);
  const { friendRequests } = useFriendStore();
  const users = useUserStore((state) => state.users);
  const setProfileUserId = useModalStore((state) => state.setProfileUserId);
  const setActiveChat = useChatStore((state) => state.setActiveChat);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useClickOutside(modalRef, () => {
    if (isOpen) onToggle();
  });

  // ... rest of the existing code ...

  return (
    <>
      <button
        onClick={onToggle}
        className={`fixed ${
          isMobile ? 'bottom-20' : 'bottom-4'
        } right-4 z-10 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors shadow-lg border border-white/10`}
        title="Friends List"
      >
        <Users className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm z-50">
          <div 
            ref={modalRef} 
            className={`w-full ${
              isMobile ? 'h-full' : 'max-w-md'
            } bg-white/10 backdrop-blur-md rounded-xl shadow-xl overflow-hidden flex flex-col`}
          >
            {/* ... rest of the existing code ... */}
          </div>
        </div>
      )}
    </>
  );
}