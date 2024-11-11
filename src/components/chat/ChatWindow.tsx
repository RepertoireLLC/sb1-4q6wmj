import { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface ChatWindowProps {
  userId: string;
  onClose: () => void;
}

export function ChatWindow({ userId, onClose }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const currentUser = useAuthStore((state) => state.user);
  const otherUser = useUserStore((state) => state.users.find(u => u.id === userId));
  const { sendMessage, getMessagesForChat } = useChatStore();
  const isMobile = useMediaQuery('(max-width: 768px)');

  useClickOutside(chatWindowRef, onClose);

  // ... rest of the existing code ...

  return (
    <div 
      ref={chatWindowRef} 
      className={`fixed ${
        isMobile 
          ? 'inset-0 bg-black/90' 
          : 'bottom-4 right-4 w-80 bg-white/10 backdrop-blur-md rounded-xl'
      } shadow-xl flex flex-col overflow-hidden z-50`}
    >
      {/* ... rest of the existing code ... */}
    </div>
  );
}