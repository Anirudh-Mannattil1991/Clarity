import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskItem from './TaskItem';
import { Task, CategoryConfig, Category, EnergyLevel } from '@/types/clarity';

interface CategoryCardProps {
  config: CategoryConfig;
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskMove: (taskId: string, newCategory: Category) => void;
  energyLevel?: EnergyLevel;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  config,
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onTaskMove,
  energyLevel
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('ring-2', 'ring-primary');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('ring-2', 'ring-primary');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('ring-2', 'ring-primary');
    
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onTaskMove(taskId, config.id);
    }
  };

  return (
    <Card
      className="rounded-3xl shadow-card hover:shadow-hover transition-all duration-300 border-2"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardHeader className={`${config.colorClass} rounded-t-3xl`}>
        <CardTitle className="flex items-center gap-3 text-xl">
          <span className="text-2xl">{config.emoji}</span>
          <div>
            <div className="font-bold">{config.label}</div>
            <div className="text-sm font-normal opacity-90">{config.description}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3 min-h-[200px]">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No tasks yet. Drag items here.
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={onTaskUpdate}
              onDelete={onTaskDelete}
              energyLevel={energyLevel}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
