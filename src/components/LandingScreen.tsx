import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import EnergyToggle from './EnergyToggle';
import { EnergyLevel } from '@/types/clarity';

interface LandingScreenProps {
  onSubmit: (thoughts: string, energyLevel: EnergyLevel) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onSubmit }) => {
  const [thoughts, setThoughts] = useState('');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('medium');
  const maxChars = 1000;

  const handleSubmit = () => {
    if (thoughts.trim().length > 0) {
      onSubmit(thoughts, energyLevel);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 animate-fade-in">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight gradient-text">
            Clear your mind in 30 seconds.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
            Dump what's stressing you out. We'll help you sort it.
          </p>
        </div>

        <EnergyToggle value={energyLevel} onChange={setEnergyLevel} />

        <div className="space-y-4">
          <div className="relative">
            <Textarea
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value.slice(0, maxChars))}
              onKeyDown={handleKeyDown}
              placeholder="Math exam on Friday, reply to Sarah, finish group project, clean room…"
              className="min-h-[200px] text-base md:text-lg resize-none rounded-3xl border-2 focus:border-primary transition-all duration-300 shadow-card"
              maxLength={maxChars}
            />
            <div className="absolute bottom-4 right-4 text-sm text-muted-foreground">
              {thoughts.length} / {maxChars}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={thoughts.trim().length === 0}
            size="lg"
            className="w-full rounded-full text-lg h-14 shadow-hover hover:shadow-card transition-all duration-300"
          >
            Sort My Thoughts
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Press <kbd className="px-2 py-1 bg-muted rounded">⌘</kbd> + <kbd className="px-2 py-1 bg-muted rounded">Enter</kbd> to submit
        </p>
      </div>
    </div>
  );
};

export default LandingScreen;
