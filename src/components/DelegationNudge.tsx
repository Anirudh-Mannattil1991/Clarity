import React from 'react';
import { MessageCircle } from 'lucide-react';

interface DelegationNudgeProps {
  nudge: string;
}

const DelegationNudge: React.FC<DelegationNudgeProps> = ({ nudge }) => {
  return (
    <div className="mt-2 p-2 bg-delegate/10 rounded-lg border-l-2 border-delegate">
      <div className="flex items-start gap-2">
        <MessageCircle className="w-3 h-3 text-delegate mt-0.5 flex-shrink-0" />
        <p className="text-xs text-foreground">{nudge}</p>
      </div>
    </div>
  );
};

export default DelegationNudge;
