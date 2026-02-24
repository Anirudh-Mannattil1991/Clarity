import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Task, EnergyLevel } from '@/types/clarity';
import { Check, Pencil, Trash2, GripVertical } from 'lucide-react';
import NextStepSuggestion from './NextStepSuggestion';
import ReframeCard from './ReframeCard';
import ActionPlanGenerator from './ActionPlanGenerator';
import PressureMeter from './PressureMeter';
import DelegationNudge from './DelegationNudge';

interface TaskItemProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  energyLevel?: EnergyLevel;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete, energyLevel }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onUpdate(task.id, { text: editText.trim() });
      setIsEditing(false);
    }
  };

  const handleToggleComplete = () => {
    onUpdate(task.id, { completed: !task.completed });
  };

  const handlePlanGenerated = (steps: string[]) => {
    onUpdate(task.id, { actionPlan: steps });
  };

  const showActionPlan = task.category === 'do_today' || task.category === 'schedule_soon';

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`group flex flex-col gap-2 p-3 bg-card rounded-2xl border-2 border-border hover:border-primary transition-all duration-200 cursor-move ${
        task.completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />

        <div className="flex-1 space-y-2">
          {isEditing ? (
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit();
                if (e.key === 'Escape') setIsEditing(false);
              }}
              onBlur={handleSaveEdit}
              autoFocus
              className="h-8"
            />
          ) : (
            <div className="space-y-1">
              <span
                className={`text-sm block ${task.completed ? 'line-through text-muted-foreground' : ''}`}
              >
                {task.text}
              </span>
              {task.pressureLevel && (
                <PressureMeter level={task.pressureLevel} />
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleComplete}
            className="h-8 w-8"
          >
            <Check className={`w-4 h-4 ${task.completed ? 'text-primary' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            className="h-8 w-8 hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {task.nextStep && <NextStepSuggestion nextStep={task.nextStep} />}
      {task.delegationNudge && <DelegationNudge nudge={task.delegationNudge} />}
      {task.reframe && <ReframeCard reframe={task.reframe} />}
      {showActionPlan && (
        <ActionPlanGenerator 
          taskText={task.text} 
          energyLevel={energyLevel}
          onPlanGenerated={handlePlanGenerated}
        />
      )}
    </div>
  );
};

export default TaskItem;
