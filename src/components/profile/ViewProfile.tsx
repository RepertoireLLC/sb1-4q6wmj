import { UserPlus, MessageCircle, UserCheck, UserX, Globe, Users, Lock, Link, MapPin } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { useFriendStore } from '../../store/friendStore';
import { useChatStore } from '../../store/chatStore';
import { ProfileStats } from './ProfileStats';
import { ActivityTimeline } from './ActivityTimeline';
import { InterestTags } from './InterestTags';
import { ProfileBanner } from './ProfileBanner';
import { PhotoGrid } from './PhotoGrid';

interface ViewProfileProps {
  userId: string;
  onClose: () => void;
  onEdit?: () => void;
}

export function ViewProfile({ userId, onClose, onEdit }: ViewProfileProps) {
  const user = useUserStore((state) => state.users.find(u => u.id === userId));
  const currentUser = useAuthStore((state) => state.user);
  const { sendFriendRequest, isFriend, hasPendingRequest } = useFriendStore();
  const setActiveChat = useChatStore((state) => state.setActiveChat);

  if (!user || !currentUser) return null;

  const isOwnProfile = currentUser.id === userId;
  const areFriends = isFriend(currentUser.id, userId);
  const hasPending = hasPendingRequest(currentUser.id, userId);

  const handleFriendRequest = () => {
    if (!hasPending) {
      sendFriendRequest(currentUser.id, userId);
    }
  };

  const handleMessage = () => {
    setActiveChat(userId);
    onClose();
  };

  return (
    <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-xl shadow-xl">
      <ProfileBanner user={user} isOwnProfile={isOwnProfile} onUpdate={() => {}} />
      
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start space-x-4">
            <div className="relative -mt-16">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-black/20"
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-black/20"
                  style={{ backgroundColor: user.color }}
                >
                  <span className="text-white text-3xl">
                    {user.name[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            <div className="pt-2">
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              
              <div className="flex items-center gap-2 mt-1">
                <span className={user.online ? 'text-emerald-400' : 'text-white/60'}>
                  {user.online ? 'Online' : 'Offline'}
                </span>
                {user.online && (
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                )}
              </div>

              {user.location && (
                <div className="flex items-center gap-2 mt-2 text-white/80">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
              )}

              {user.website && (
                <div className="flex items-center gap-2 mt-2 text-white/80">
                  <Link className="w-4 h-4" />
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    {user.website}
                  </a>
                </div>
              )}
            </div>
          </div>
          
          {isOwnProfile && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {user.bio && (
          <div className="mt-6">
            <p className="text-white/80 whitespace-pre-wrap">{user.bio}</p>
          </div>
        )}

        <ProfileStats userId={userId} privacy="public" />
        <InterestTags userId={userId} isEditing={false} />
        <PhotoGrid userId={userId} isEditing={false} />
        <ActivityTimeline userId={userId} privacy="public" />

        {!isOwnProfile && (
          <div className="flex space-x-4 mt-6">
            {areFriends ? (
              <button className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-emerald-500/20 text-emerald-300 rounded-lg cursor-default">
                <UserCheck className="w-5 h-5" />
                <span>Friends</span>
              </button>
            ) : hasPending ? (
              <button className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-amber-500/20 text-amber-300 rounded-lg cursor-default">
                <UserX className="w-5 h-5" />
                <span>Request Pending</span>
              </button>
            ) : (
              <button
                onClick={handleFriendRequest}
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                <UserPlus className="w-5 h-5" />
                <span>Add Friend</span>
              </button>
            )}
            <button
              onClick={handleMessage}
              className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Message</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}