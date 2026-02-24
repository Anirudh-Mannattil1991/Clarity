import React, { useState } from 'react';
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReframeCardProps {
  reframe: string;
}

const ReframeCard: React.FC<ReframeCardProps> = ({ reframe }) => {
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
          <MessageCircle className="w-3 h-3" />
          Reframe
        </span>
        {isExpanded ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </Button>
      {isExpanded && (
        <div className="mt-2 p-2 bg-accent/30 rounded-lg text-xs text-foreground italic animate-slide-up">
          💬 {reframe}
        </div>
      )}
    </div>
  );
};

export default ReframeCard;
