import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, Calendar, Heart, BarChart, Eye } from 'lucide-react';
import { supabase } from '@/db/supabase';
import { ClaritySession, WeeklyStats, CATEGORY_CONFIGS, getMoodEmoji } from '@/types/clarity';
import { Skeleton } from '@/components/ui/skeleton';

interface WeeklyDashboardProps {
  onBack: () => void;
}

const WeeklyDashboard: React.FC<WeeklyDashboardProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [recentSessions, setRecentSessions] = useState<ClaritySession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ClaritySession | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadWeeklyData();
  }, []);

  const loadWeeklyData = async () => {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data: sessions, error } = await supabase
        .from('clarity_sessions')
        .select('*')
        .gte('created_at', oneWeekAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (sessions && sessions.length > 0) {
        const typedSessions = sessions as ClaritySession[];
        const totalSessions = typedSessions.length;
        const avgBefore = Math.round(
          typedSessions.reduce((sum, s) => sum + s.clarity_index_before, 0) / totalSessions
        );
        const avgAfter = Math.round(
          typedSessions.reduce((sum, s) => sum + s.clarity_index_after, 0) / totalSessions
        );

        const categoryCounts = {
          do_today: typedSessions.reduce((sum, s) => sum + s.task_count_do_today, 0),
          schedule_soon: typedSessions.reduce((sum, s) => sum + s.task_count_schedule_soon, 0),
          delegate: typedSessions.reduce((sum, s) => sum + s.task_count_delegate, 0),
          let_go: typedSessions.reduce((sum, s) => sum + s.task_count_let_go, 0),
        };

        const mostCommonCategory = Object.entries(categoryCounts).reduce((a, b) =>
          b[1] > a[1] ? b : a
        )[0];

        const moodCounts: Record<string, number> = {};
        typedSessions.forEach(s => {
          if (s.dominant_mood) {
            moodCounts[s.dominant_mood] = (moodCounts[s.dominant_mood] || 0) + 1;
          }
        });
        const mostCommonMood = Object.entries(moodCounts).reduce((a, b) =>
          b[1] > a[1] ? b : a, ['neutral', 0]
        )[0];

        setStats({
          total_sessions: totalSessions,
          average_clarity_before: avgBefore,
          average_clarity_after: avgAfter,
          average_improvement: avgAfter - avgBefore,
          most_common_category: mostCommonCategory,
          most_common_mood: mostCommonMood,
        });

        setRecentSessions(typedSessions);
      }
    } catch (error) {
      console.error('Error loading weekly data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (categoryId: string) => {
    return CATEGORY_CONFIGS.find(c => c.id === categoryId)?.label || categoryId;
  };

  const handleSessionClick = (session: ClaritySession) => {
    setSelectedSession(session);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-12 w-64 bg-muted" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-40 bg-muted" />
            <Skeleton className="h-40 bg-muted" />
            <Skeleton className="h-40 bg-muted" />
            <Skeleton className="h-40 bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!stats || stats.total_sessions === 0) {
    return (
      <div className="min-h-screen px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">No Data Yet</h2>
            <p className="text-muted-foreground">
              Complete your first clarity session to see your weekly progress.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 md:py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="ghost"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">
            Your Weekly Progress
          </h2>
          <p className="text-muted-foreground">
            Insights from the past 7 days
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-3xl shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-primary" />
                Sessions This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{stats.total_sessions}</p>
              <p className="text-sm text-muted-foreground mt-2">
                You've been clearer this week
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-clarity-high" />
                Average Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-clarity-high">
                +{stats.average_improvement}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {stats.average_clarity_before} → {stats.average_clarity_after} clarity index
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart className="w-5 h-5 text-primary" />
                Most Common Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {getCategoryLabel(stats.most_common_category)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Your primary focus area
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="w-5 h-5 text-primary" />
                Dominant Mood
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground capitalize">
                {stats.most_common_mood}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Your typical emotional state
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-3xl shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSessions.slice(0, 5).map((session) => (
              <button
                key={session.id}
                onClick={() => handleSessionClick(session)}
                className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors cursor-pointer group"
              >
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">
                    {new Date(session.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {getMoodEmoji(session.dominant_mood)} {session.dominant_mood}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {session.clarity_index_before} → {session.clarity_index_after}
                    </p>
                    <p className="text-xs text-clarity-high">
                      +{session.clarity_index_after - session.clarity_index_before}
                    </p>
                  </div>
                  <Eye className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-text">Session Details</DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="text-lg font-medium">
                    {new Date(selectedSession.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  <span className="mr-2">{getMoodEmoji(selectedSession.dominant_mood)}</span>
                  {selectedSession.dominant_mood}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="rounded-2xl">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-1">Clarity Before</p>
                    <p className="text-3xl font-bold text-clarity-low">
                      {selectedSession.clarity_index_before}
                    </p>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-1">Clarity After</p>
                    <p className="text-3xl font-bold text-clarity-high">
                      {selectedSession.clarity_index_after}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-3">Task Distribution</p>
                <div className="grid grid-cols-2 gap-3">
                  {CATEGORY_CONFIGS.map((config) => {
                    const count = selectedSession[`task_count_${config.id}` as keyof ClaritySession] as number;
                    return (
                      <div
                        key={config.id}
                        className={`p-3 rounded-xl ${config.colorClass} flex items-center justify-between`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{config.emoji}</span>
                          <span className="text-sm font-medium">{config.label}</span>
                        </div>
                        <span className="text-xl font-bold">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Original Thoughts</p>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-sm whitespace-pre-wrap">{selectedSession.original_thoughts}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setDialogOpen(false)} className="rounded-full">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeeklyDashboard;
