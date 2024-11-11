import { Search, UserPlus, UserCheck, UserX, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { useModalStore } from '../store/modalStore';
import { useAuthStore } from '../store/authStore';
import { useFriendStore } from '../store/friendStore';
import { useChatStore } from '../store/chatStore';
import { useMediaQuery } from '../hooks/useMediaQuery';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const users = useUserStore((state) => state.users);
  const registeredUsers = useAuthStore((state) => state.registeredUsers);
  const currentUser = useAuthStore((state) => state.user);
  const setProfileUserId = useModalStore((state) => state.setProfileUserId);
  const { sendFriendRequest, isFriend, hasPendingRequest } = useFriendStore();
  const setActiveChat = useChatStore((state) => state.setActiveChat);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Combine online users with registered users
  const allUsers = registeredUsers.map(regUser => {
    const onlineUser = users.find(u => u.id === regUser.id);
    return {
      ...regUser,
      online: !!onlineUser,
    };
  });

  const filteredUsers = allUsers.filter(user => 
    (user.name.toLowerCase().includes(query.toLowerCase()) ||
     user.email.toLowerCase().includes(query.toLowerCase()))
  );

  const handleAction = (userId: string, action: 'profile' | 'friend' | 'message') => {
    switch (action) {
      case 'profile':
        setProfileUserId(userId);
        break;
      case 'friend':
        if (currentUser) sendFriendRequest(currentUser.id, userId);
        break;
      case 'message':
        setActiveChat(userId);
        break;
    }
    setQuery('');
  };

  return (
    <div className={`${
      isMobile ? 'fixed top-20 left-4 right-4' : 'absolute top-4 left-8 w-80'
    } z-10`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users by name or email..."
          className="w-full px-4 py-3 pl-11 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all shadow-lg"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
      </div>

      <div className={`mt-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden ${
        isMobile ? 'max-h-[60vh]' : 'max-h-96'
      } overflow-y-auto shadow-xl ${query ? 'block' : 'hidden'}`}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div
              key={user.id}
              className="p-3 hover:bg-white/5 flex items-center justify-between border-b border-white/10 last:border-0 transition-colors"
            >
              <button
                onClick={() => handleAction(user.id, 'profile')}
                className="flex items-center space-x-3 flex-1"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-inner-lg relative"
                  style={{ backgroundColor: user.color }}
                >
                  <span className="text-white text-lg font-medium">
                    {user.name[0].toUpperCase()}
                  </span>
                  {user.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black" />
                  )}
                </div>
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{user.name}</span>
                    {user.id === currentUser?.id && (
                      <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full text-white/60">You</span>
                    )}
                  </div>
                  <span className="text-sm text-white/60">{user.email}</span>
                </div>
              </button>

              {user.id !== currentUser?.id && (
                <div className="flex items-center space-x-2">
                  {currentUser && !isFriend(currentUser.id, user.id) && !hasPendingRequest(currentUser.id, user.id) && (
                    <button
                      onClick={() => handleAction(user.id, 'friend')}
                      className="p-2 text-white/60 hover:text-white transition-colors"
                      title="Add Friend"
                    >
                      <UserPlus className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleAction(user.id, 'message')}
                    className="p-2 text-white/60 hover:text-white transition-colors"
                    title="Send Message"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-white/60">
            No users found
          </div>
        )}
      </div>
    </div>
  );
}