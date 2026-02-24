import React, { useState } from 'react';
import LandingScreen from '@/components/LandingScreen';
import ProcessingScreen from '@/components/ProcessingScreen';
import ResultsScreen from '@/components/ResultsScreen';
import WeeklyDashboard from '@/components/WeeklyDashboard';
import ThemeToggle from '@/components/ThemeToggle';
import { AppState, Task, EnhancedAIResponse, EnergyLevel } from '@/types/clarity';
import { supabase } from '@/db/supabase';
import { toast } from 'sonner';

const ClarityPage: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clarityBefore, setClarityBefore] = useState(0);
  const [clarityAfter, setClarityAfter] = useState(0);
  const [mood, setMood] = useState('');
  const [encouragement, setEncouragement] = useState('');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('medium');
  const [originalThoughts, setOriginalThoughts] = useState('');

  const handleSubmitThoughts = async (thoughts: string, energy: EnergyLevel) => {
    setAppState('processing');
    setOriginalThoughts(thoughts);
    setEnergyLevel(energy);

    try {
      const { data, error } = await supabase.functions.invoke<EnhancedAIResponse>('categorize-thoughts', {
        body: { thoughts, energyLevel: energy }
      });

      if (error) {
        const errorMsg = await error?.context?.text?.();
        console.error('Edge function error:', errorMsg || error?.message);
        throw new Error(errorMsg || 'Failed to categorize thoughts');
      }

      if (!data) {
        throw new Error('No data received from AI');
      }

      const newTasks: Task[] = [
        ...data.do_today.map(item => ({
          id: crypto.randomUUID(),
          text: item.task,
          category: 'do_today' as const,
          completed: false,
          nextStep: item.next_step,
          pressureLevel: item.pressure_level
        })),
        ...data.schedule_soon.map(item => ({
          id: crypto.randomUUID(),
          text: item.task,
          category: 'schedule_soon' as const,
          completed: false,
          nextStep: item.next_step,
          pressureLevel: item.pressure_level
        })),
        ...data.delegate.map(item => ({
          id: crypto.randomUUID(),
          text: item.task,
          category: 'delegate' as const,
          completed: false,
          nextStep: item.next_step,
          delegationNudge: item.delegation_nudge
        })),
        ...data.let_go.map(item => ({
          id: crypto.randomUUID(),
          text: item.task,
          category: 'let_go' as const,
          completed: false,
          nextStep: item.next_step,
          reframe: item.reframe
        }))
      ];

      setTasks(newTasks);
      setClarityBefore(data.clarity_index_before);
      setClarityAfter(data.clarity_index_after);
      setMood(data.dominant_mood);
      setEncouragement(data.encouragement);

      // Store session in database (fire and forget, don't block on errors)
      supabase.from('clarity_sessions').insert({
        original_thoughts: thoughts,
        clarity_index_before: data.clarity_index_before,
        clarity_index_after: data.clarity_index_after,
        dominant_mood: data.dominant_mood || 'neutral',
        task_count_do_today: data.do_today.length,
        task_count_schedule_soon: data.schedule_soon.length,
        task_count_delegate: data.delegate.length,
        task_count_let_go: data.let_go.length
      } as never).then(({ error: insertError }) => {
        if (insertError) {
          console.error('Failed to store session:', insertError);
        }
      });

      setAppState('results');
      toast.success('Your thoughts have been organized!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong. Let\'s try again.');
      setAppState('landing');
    }
  };

  const handleReset = () => {
    setAppState('landing');
    setTasks([]);
    setClarityBefore(0);
    setClarityAfter(0);
    setMood('');
    setEncouragement('');
    setEnergyLevel('medium');
    setOriginalThoughts('');
  };

  const handleUpdateTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

  const handleNavigateToDashboard = () => {
    setAppState('dashboard');
  };

  const handleBackFromDashboard = () => {
    if (tasks.length > 0) {
      setAppState('results');
    } else {
      setAppState('landing');
    }
  };

  return (
    <>
      <ThemeToggle />
      {appState === 'landing' && <LandingScreen onSubmit={handleSubmitThoughts} />}
      {appState === 'processing' && <ProcessingScreen />}
      {appState === 'results' && (
        <ResultsScreen
          tasks={tasks}
          onReset={handleReset}
          onUpdateTasks={handleUpdateTasks}
          clarityBefore={clarityBefore}
          clarityAfter={clarityAfter}
          mood={mood}
          encouragement={encouragement}
          energyLevel={energyLevel}
          onNavigateToDashboard={handleNavigateToDashboard}
        />
      )}
      {appState === 'dashboard' && (
        <WeeklyDashboard onBack={handleBackFromDashboard} />
      )}
    </>
  );
};

export default ClarityPage;
