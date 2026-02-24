import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { supabase } from '@/db/supabase';
import { EnergyLevel } from '@/types/clarity';

interface ActionPlanGeneratorProps {
  taskText: string;
  energyLevel?: EnergyLevel;
  onPlanGenerated?: (steps: string[]) => void;
}

const ActionPlanGenerator: React.FC<ActionPlanGeneratorProps> = ({ 
  taskText, 
  energyLevel = 'medium',
  onPlanGenerated 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionPlan, setActionPlan] = useState<string[] | null>(null);

  const handleGeneratePlan = async () => {
    if (actionPlan) {
      setIsExpanded(!isExpanded);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke<{ steps: string[] }>('generate-action-plan', {
        body: { taskText, energyLevel }
      });

      if (error) {
        const errorMsg = await error?.context?.text?.();
        console.error('Edge function error:', errorMsg || error?.message);
        throw new Error(errorMsg || 'Failed to generate action plan');
      }

      if (data && data.steps) {
        setActionPlan(data.steps);
        setIsExpanded(true);
        onPlanGenerated?.(data.steps);
      }
    } catch (error) {
      console.error('Error generating action plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-2 border-t border-border pt-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleGeneratePlan}
        disabled={isLoading}
        className="w-full justify-between text-xs h-auto py-1 px-2 hover:bg-accent/50"
      >
        <span className="flex items-center gap-1 text-primary">
          <Sparkles className="w-3 h-3" />
          {actionPlan ? 'Simple Plan' : 'Generate Simple Plan'}
        </span>
        {isLoading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : isExpanded ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </Button>
      {isExpanded && actionPlan && (
        <div className="mt-2 p-3 bg-primary/5 rounded-lg space-y-2 animate-slide-up">
          <p className="text-xs font-medium text-primary mb-2">✨ Action Plan</p>
          {actionPlan.map((step, index) => (
            <div key={index} className="text-xs text-foreground pl-2 border-l-2 border-primary/30">
              {step}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionPlanGenerator;
