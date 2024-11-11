import { useEffect } from 'react';
import { Scene } from './components/Scene';
import { SearchBar } from './components/SearchBar';
import { AuthModal } from './components/auth/AuthModal';
import { ProfileModal } from './components/profile/ProfileModal';
import { FriendRequests } from './components/FriendRequests';
import { ChatWindow } from './components/chat/ChatWindow';
import { ThemeSelector } from './components/ThemeSelector';
import { ProfileIcon } from './components/ProfileIcon';
import { useAuthStore } from './store/authStore';
import { useModalStore } from './store/modalStore';
import { useChatStore } from './store/chatStore';
import { useSocketStore } from './store/socketStore';
import { useThemeStore } from './store/themeStore';
import { HeaderControls } from './components/HeaderControls';
import { AboutModal } from './components/AboutModal';
import { PostList } from './components/posts/PostList';
import { PhotoFeed } from './components/photos/PhotoFeed';
import { useMediaQuery } from './hooks/useMediaQuery';

export function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const profileUserId = useModalStore((state) => state.profileUserId);
  const setProfileUserId = useModalStore((state) => state.setProfileUserId);
  const activeChat = useChatStore((state) => state.activeChat);
  const setActiveChat = useChatStore((state) => state.setActiveChat);
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const connect = useSocketStore((state) => state.connect);
  const disconnect = useSocketStore((state) => state.disconnect);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (isAuthenticated) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [isAuthenticated, connect, disconnect]);

  const getBackgroundClass = () => {
    switch (currentTheme) {
      case 'classicElegance':
        return 'bg-gradient-radial from-blue-900 via-blue-800/90 to-gray-900';
      case 'modernTech':
        return 'bg-gradient-radial from-sky-900 via-gray-900/95 to-black';
      case 'executiveSuite':
        return 'bg-gradient-radial from-yellow-900 via-amber-900/90 to-gray-900';
      case 'auroraNetwork':
        return 'bg-gradient-radial from-purple-900 via-pink-900/90 to-indigo-900';
      case 'minimalistZen':
        return 'bg-gradient-radial from-slate-200 via-gray-100/95 to-white';
      case 'globalConnect':
        return 'bg-gradient-radial from-emerald-900 via-green-800/90 to-gray-900';
      case 'futuristicMatrix':
        return 'bg-gradient-radial from-green-900 via-emerald-800/95 to-black';
      case 'corporateHorizon':
        return 'bg-gradient-radial from-blue-800 via-indigo-900/90 to-gray-900';
      case 'neoVintage':
        return 'bg-gradient-radial from-amber-900 via-orange-800/90 to-gray-900';
      case 'sleekMonochrome':
        return 'bg-gradient-radial from-gray-900 via-neutral-900/95 to-black';
      default:
        return 'bg-gradient-radial from-slate-900 via-slate-800/90 to-slate-950';
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setProfileUserId(null);
      setActiveChat(null);
    }
  };

  return (
    <div 
      className={`relative w-full h-screen ${getBackgroundClass()} transition-colors duration-1000`}
      onClick={handleBackgroundClick}
    >
      {isAuthenticated ? (
        <>
          <HeaderControls />
          <SearchBar />
          <Scene />
          <AboutModal />
          {!isMobile && (
            <div className="fixed right-4 top-20 bottom-4 flex gap-4">
              <PhotoFeed />
              <PostList />
            </div>
          )}
          {profileUserId && (
            <ProfileModal
              userId={profileUserId}
              onClose={() => setProfileUserId(null)}
            />
          )}
          {activeChat && (
            <ChatWindow
              userId={activeChat}
              onClose={() => setActiveChat(null)}
            />
          )}
        </>
      ) : (
        <AuthModal />
      )}
    </div>
  );
}