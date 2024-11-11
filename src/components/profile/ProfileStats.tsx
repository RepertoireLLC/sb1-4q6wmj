import { Users, Image, MessageSquare } from 'lucide-react';
import { useFriendStore } from '../../store/friendStore';

interface ProfileStatsProps {
  userId: string;
  privacy: 'public' | 'friends' | 'private';
}

export function ProfileStats({ userId, privacy }: ProfileStatsProps) {
  const friendCount = useFriendStore((state) => 
    state.friendRequests.filter(req => 
      (req.fromUserId === userId || req.toUserId === userId) && 
      req.status === 'accepted'
    ).length
  );

  // Placeholder stats - replace with actual data in a real implementation
  const stats = [
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Friends',
      value: friendCount
    },
    {
      icon: <Image className="w-5 h-5" />,
      label: 'Photos',
      value: 0
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: 'Posts',
      value: 0
    }
  ];

  if (privacy === 'private') return null;

  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center p-4 bg-white/5 rounded-lg"
        >
          <div className="text-white/60 mb-2">{stat.icon}</div>
          <div className="text-2xl font-bold text-white">{stat.value}</div>
          <div className="text-sm text-white/60">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}