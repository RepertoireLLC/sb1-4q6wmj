import { Bell } from 'lucide-react';
import { useState } from 'react';
import { useFriendStore } from '../store/friendStore';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { useClickOutside } from '../hooks/useClickOutside';

interface FriendRequestsProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function FriendRequests({ isOpen, onToggle }: FriendRequestsProps) {
  const modalRef = useState<HTMLDivElement | null>(null);
  const currentUser = useAuthStore((state) => state.user);
  const users = useUserStore((state) => state.users);
  const { friendRequests, acceptFriendRequest, rejectFriendRequest } = useFriendStore();

  useClickOutside(modalRef, () => {
    if (isOpen) onToggle();
  });

  if (!currentUser) return null;

  const pendingRequests = friendRequests.filter(
    (request) =>
      request.status === 'pending' && request.toUserId === currentUser.id
  );

  return (
    <>
      <button
        onClick={onToggle}
        className="relative p-2 text-white hover:text-white/80 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {pendingRequests.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
            {pendingRequests.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white font-medium">Friend Requests</h3>
          </div>

          {pendingRequests.length > 0 ? (
            <div className="divide-y divide-white/10">
              {pendingRequests.map((request) => {
                const fromUser = users.find((u) => u.id === request.fromUserId);
                if (!fromUser) return null;

                return (
                  <div
                    key={request.id}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-full"
                        style={{ backgroundColor: fromUser.color }}
                      />
                      <span className="text-white">{fromUser.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => acceptFriendRequest(request.id)}
                        className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded hover:bg-emerald-500/30 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => rejectFriendRequest(request.id)}
                        className="px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-white/50 text-center">
              No pending friend requests
            </div>
          )}
        </div>
      )}
    </>
  );
}