import { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';

interface InterestTagsProps {
  userId: string;
  isEditing: boolean;
}

export function InterestTags({ userId, isEditing }: InterestTagsProps) {
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');

  const handleAddInterest = () => {
    if (newInterest.trim() && interests.length < 5) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-white">Interests</h3>
        {isEditing && interests.length < 5 && (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add interest"
              className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white placeholder-white/50"
            />
            <button
              onClick={handleAddInterest}
              className="p-1 bg-white/10 rounded hover:bg-white/20"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {interests.map((interest, index) => (
          <div
            key={index}
            className="flex items-center space-x-1 px-3 py-1 bg-white/10 rounded-full"
          >
            <Tag className="w-4 h-4 text-white/60" />
            <span className="text-white">{interest}</span>
            {isEditing && (
              <button
                onClick={() => handleRemoveInterest(index)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        {interests.length === 0 && (
          <p className="text-white/60 text-sm">No interests added yet</p>
        )}
      </div>
    </div>
  );
}