import React from 'react';
import { getClarityColor, getClarityLabel } from '@/types/clarity';

interface ClarityIndexDisplayProps {
  before: number;
  after: number;
  showImprovement?: boolean;
}

const ClarityIndexDisplay: React.FC<ClarityIndexDisplayProps> = ({ 
  before, 
  after, 
  showImprovement = true 
}) => {
  const improvement = after - before;
  const circumference = 2 * Math.PI * 45;

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-6 bg-card rounded-3xl shadow-card">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-muted"
            />
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (before / 100) * circumference}
              className={`${getClarityColor(before)} transition-all duration-1000 ease-out`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${getClarityColor(before)}`}>
              {before}
            </span>
            <span className="text-xs text-muted-foreground">Before</span>
          </div>
        </div>
        <p className="text-sm text-center text-muted-foreground max-w-[120px]">
          {getClarityLabel(before)}
        </p>
      </div>

      {showImprovement && (
        <>
          <div className="flex items-center">
            <div className="text-2xl text-primary animate-pulse">→</div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-muted"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (after / 100) * circumference}
                  className={`${getClarityColor(after)} transition-all duration-1000 ease-out delay-300`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${getClarityColor(after)}`}>
                  {after}
                </span>
                <span className="text-xs text-muted-foreground">After</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground max-w-[120px]">
                {getClarityLabel(after)}
              </p>
              {improvement > 0 && (
                <p className="text-xs text-clarity-high font-medium mt-1">
                  +{improvement} improvement
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClarityIndexDisplay;
