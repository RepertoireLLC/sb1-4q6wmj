import { Clock } from 'lucide-react';

interface ActivityTimelineProps {
  userId: string;
  privacy: 'public' | 'friends' | 'private';
}

export function ActivityTimeline({ userId, privacy }: ActivityTimelineProps) {
  if (privacy === 'private') return null;

  // Placeholder - replace with actual activity data in a real implementation
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-white/10 rounded-full">
            <Clock className="w-4 h-4 text-white/60" />
          </div>
          <div>
            <p className="text-white">Joined the platform</p>
            <p className="text-sm text-white/60">Just now</p>
          </div>
        </div>
      </div>
    </div>
  );
}