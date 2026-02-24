import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NextStepSuggestionProps {
  nextStep: string;
}

const NextStepSuggestion: React.FC<NextStepSuggestionProps> = ({ nextStep }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-2 border-t border-border pt-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between text-xs h-auto py-1 px-2 hover:bg-accent/50"
      >
        <span className="flex items-center gap-1 text-primary">
          <Sparkles className="w-3 h-3" />
          Next Gentle Step
        </span>
        {isExpanded ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </Button>
      {isExpanded && (
        <div className="mt-2 p-2 bg-accent/30 rounded-lg text-xs text-foreground animate-slide-up">
          {nextStep}
        </div>
      )}
    </div>
  );
};

export default NextStepSuggestion;
