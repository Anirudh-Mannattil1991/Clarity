export type Category = 'do_today' | 'schedule_soon' | 'delegate' | 'let_go';

export type AppState = 'landing' | 'processing' | 'results' | 'dashboard';

export type PressureLevel = 'low' | 'medium' | 'high';

export type EnergyLevel = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  text: string;
  category: Category;
  completed: boolean;
  nextStep?: string;
  reframe?: string;
  pressureLevel?: PressureLevel;
  actionPlan?: string[];
  delegationNudge?: string;
}

export interface CategorizedTasks {
  do_today: string[];
  schedule_soon: string[];
  delegate: string[];
  let_go: string[];
}

export interface EnhancedAIResponse {
  do_today: Array<{ 
    task: string; 
    next_step: string;
    pressure_level: PressureLevel;
  }>;
  schedule_soon: Array<{ 
    task: string; 
    next_step: string;
    pressure_level: PressureLevel;
  }>;
  delegate: Array<{ 
    task: string; 
    next_step: string;
    delegation_nudge: string;
  }>;
  let_go: Array<{ 
    task: string; 
    next_step: string; 
    reframe: string;
  }>;
  dominant_mood: string;
  clarity_index_before: number;
  clarity_index_after: number;
  encouragement: string;
}

export interface ClaritySession {
  id: string;
  created_at: string;
  original_thoughts: string;
  clarity_index_before: number;
  clarity_index_after: number;
  dominant_mood: string;
  task_count_do_today: number;
  task_count_schedule_soon: number;
  task_count_delegate: number;
  task_count_let_go: number;
}

export interface WeeklyStats {
  total_sessions: number;
  average_clarity_before: number;
  average_clarity_after: number;
  average_improvement: number;
  most_common_category: string;
  most_common_mood: string;
}

export interface CategoryConfig {
  id: Category;
  label: string;
  emoji: string;
  colorClass: string;
  description: string;
}

export const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    id: 'do_today',
    label: 'Do Today',
    emoji: '🔵',
    colorClass: 'bg-do-today text-do-today-foreground',
    description: 'Urgent and actionable within 24 hours'
  },
  {
    id: 'schedule_soon',
    label: 'Schedule Soon',
    emoji: '🌊',
    colorClass: 'bg-schedule-soon text-schedule-soon-foreground',
    description: 'Important but not urgent'
  },
  {
    id: 'delegate',
    label: 'Delegate / Ask for Help',
    emoji: '🤝',
    colorClass: 'bg-delegate text-delegate-foreground',
    description: 'Requires another person'
  },
  {
    id: 'let_go',
    label: 'Let It Go',
    emoji: '☁️',
    colorClass: 'bg-let-go text-let-go-foreground',
    description: 'Not urgent or not in your control'
  }
];

export const getMoodEmoji = (mood: string): string => {
  const moodMap: Record<string, string> = {
    anxious: '😰',
    calm: '😌',
    overwhelmed: '😵',
    focused: '🎯',
    stressed: '😓',
    hopeful: '🌟',
    uncertain: '🤔',
    motivated: '💪',
    tired: '😴',
    neutral: '😐'
  };
  return moodMap[mood.toLowerCase()] || '💭';
};

export const getClarityColor = (index: number): string => {
  if (index < 40) return 'text-clarity-low';
  if (index < 70) return 'text-clarity-medium';
  return 'text-clarity-high';
};

export const getClarityLabel = (index: number): string => {
  if (index < 40) return 'High overwhelm detected';
  if (index < 70) return 'Moderate clarity';
  return 'Strong clarity';
};

export const getPressureColor = (level: PressureLevel): string => {
  const colors = {
    low: 'bg-clarity-high/20 text-clarity-high border-clarity-high',
    medium: 'bg-clarity-medium/20 text-clarity-medium border-clarity-medium',
    high: 'bg-clarity-low/20 text-clarity-low border-clarity-low'
  };
  return colors[level];
};

export const getPressureEmoji = (level: PressureLevel): string => {
  const emojis = {
    low: '🔵',
    medium: '🟡',
    high: '🔴'
  };
  return emojis[level];
};
