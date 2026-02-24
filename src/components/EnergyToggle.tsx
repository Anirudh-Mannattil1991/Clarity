import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnergyLevel } from '@/types/clarity';
import { Zap } from 'lucide-react';

interface EnergyToggleProps {
  value: EnergyLevel;
  onChange: (level: EnergyLevel) => void;
}

const EnergyToggle: React.FC<EnergyToggleProps> = ({ value, onChange }) => {
  const levels: { value: EnergyLevel; label: string; emoji: string }[] = [
    { value: 'low', label: 'Low', emoji: '🌙' },
    { value: 'medium', label: 'Medium', emoji: '☀️' },
    { value: 'high', label: 'High', emoji: '⚡' }
  ];

  return (
    <div className="flex flex-col items-center gap-3 mb-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Zap className="w-4 h-4" />
        <span>How's your energy today?</span>
      </div>
      <div className="flex gap-2">
        {levels.map((level) => (
          <Button
            key={level.value}
            variant={value === level.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(level.value)}
            className="rounded-full gap-1"
          >
            <span>{level.emoji}</span>
            <span>{level.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default EnergyToggle;
