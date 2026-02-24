import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import CategoryCard from './CategoryCard';
import ExportButton from './ExportButton';
import ClarityIndexDisplay from './ClarityIndexDisplay';
import MoodBadge from './MoodBadge';
import EncouragementBanner from './EncouragementBanner';
import BreathReset from './BreathReset';
import { Task, CATEGORY_CONFIGS, Category, EnergyLevel } from '@/types/clarity';
import { RotateCcw, BarChart3 } from 'lucide-react';

interface ResultsScreenProps {
  tasks: Task[];
  onReset: () => void;
  onUpdateTasks: (tasks: Task[]) => void;
  clarityBefore: number;
  clarityAfter: number;
  mood: string;
  encouragement: string;
  energyLevel: EnergyLevel;
  onNavigateToDashboard: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ 
  tasks, 
  onReset, 
  onUpdateTasks,
  clarityBefore,
  clarityAfter,
  mood,
  encouragement,
  energyLevel,
  onNavigateToDashboard
}) => {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [currentClarityScore, setCurrentClarityScore] = useState(clarityAfter);

  useEffect(() => {
    calculateClarityScore(localTasks);
  }, [localTasks]);

  const calculateClarityScore = (taskList: Task[]) => {
    const totalTasks = taskList.length;
    if (totalTasks === 0) {
      setCurrentClarityScore(clarityAfter);
      return;
    }

    const completedTasks = taskList.filter(t => t.completed).length;
    const completionRate = completedTasks / totalTasks;

    const urgentTasks = taskList.filter(t => t.category === 'do_today' && !t.completed).length;
    const urgencyPenalty = urgentTasks * 3;

    const baseScore = clarityAfter;
    const completionBonus = Math.round(completionRate * 20);
    const newScore = Math.min(100, Math.max(0, baseScore + completionBonus - urgencyPenalty));

    setCurrentClarityScore(newScore);
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = localTasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    setLocalTasks(updatedTasks);
    onUpdateTasks(updatedTasks);
  };

  const handleTaskDelete = (taskId: string) => {
    const updatedTasks = localTasks.filter(task => task.id !== taskId);
    setLocalTasks(updatedTasks);
    onUpdateTasks(updatedTasks);
  };

  const handleTaskMove = (taskId: string, newCategory: Category) => {
    handleTaskUpdate(taskId, { category: newCategory });
  };

  return (
    <div className="min-h-screen px-4 py-6 md:py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-3 animate-fade-in">
          <h2 className="text-2xl md:text-4xl font-bold gradient-text">
            Your Clarity Dashboard
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Drag tasks between categories or click to edit
          </p>
        </div>

        <EncouragementBanner message={encouragement} />

        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <ClarityIndexDisplay before={clarityBefore} after={currentClarityScore} />
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <MoodBadge mood={mood} />
            <BreathReset />
          </div>
        </div>

        <div id="results-container" className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-float-in">
          {CATEGORY_CONFIGS.map((config, index) => {
            const categoryTasks = localTasks.filter(task => task.category === config.id);
            return (
              <div
                key={config.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className="animate-slide-up"
              >
                <CategoryCard
                  config={config}
                  tasks={categoryTasks}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskDelete={handleTaskDelete}
                  onTaskMove={handleTaskMove}
                  energyLevel={energyLevel}
                />
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
          <ExportButton />
          <Button
            onClick={onNavigateToDashboard}
            variant="outline"
            size="lg"
            className="rounded-full gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            View Weekly Progress
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            size="lg"
            className="rounded-full gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Start Over
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
