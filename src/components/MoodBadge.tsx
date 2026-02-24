import React from 'react';
import { getMoodEmoji } from '@/types/clarity';
import { Badge } from '@/components/ui/badge';

interface MoodBadgeProps {
  mood: string;
}

const MoodBadge: React.FC<MoodBadgeProps> = ({ mood }) => {
  const emoji = getMoodEmoji(mood);
  const displayMood = mood.charAt(0).toUpperCase() + mood.slice(1);

  return (
    <Badge variant="secondary" className="text-sm px-4 py-2 rounded-full">
      <span className="mr-2">{emoji}</span>
      Detected tone: {displayMood}
    </Badge>
  );
};

export default MoodBadge;
