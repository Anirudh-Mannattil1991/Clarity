import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PressureLevel, getPressureEmoji } from '@/types/clarity';

interface PressureMeterProps {
  level: PressureLevel;
}

const PressureMeter: React.FC<PressureMeterProps> = ({ level }) => {
  const labels = {
    low: 'Low Pressure',
    medium: 'Medium Pressure',
    high: 'High Pressure'
  };

  const colors = {
    low: 'bg-clarity-high/20 text-clarity-high border-clarity-high/50',
    medium: 'bg-clarity-medium/20 text-clarity-medium border-clarity-medium/50',
    high: 'bg-clarity-low/20 text-clarity-low border-clarity-low/50'
  };

  return (
    <Badge 
      variant="outline" 
      className={`text-xs px-2 py-0.5 ${colors[level]} border`}
    >
      <span className="mr-1">{getPressureEmoji(level)}</span>
      {labels[level]}
    </Badge>
  );
};

export default PressureMeter;
