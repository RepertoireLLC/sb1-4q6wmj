import { useState, useRef } from 'react';
import { ViewProfile } from './ViewProfile';
import { EditProfile } from './EditProfile';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface ProfileModalProps {
  userId: string;
  onClose: () => void;
}

export function ProfileModal({ userId, onClose }: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useClickOutside(modalRef, onClose);

  return (
    <div className={`fixed inset-0 flex items-start justify-center ${isMobile ? 'p-0' : 'p-4'} bg-black/50 backdrop-blur-sm z-50 overflow-y-auto`}>
      <div 
        ref={modalRef} 
        onClick={e => e.stopPropagation()}
        className={`${isMobile ? 'w-full min-h-screen' : 'mt-8'}`}
      >
        {isEditing ? (
          <EditProfile
            userId={userId}
            onClose={() => setIsEditing(false)}
            onSave={() => setIsEditing(false)}
          />
        ) : (
          <ViewProfile
            userId={userId}
            onClose={onClose}
            onEdit={() => setIsEditing(true)}
          />
        )}
      </div>
    </div>
  );
}