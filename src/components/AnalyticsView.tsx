import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart2, TrendingUp, Calendar, Award, Clock, Brain, ChevronDown, BookOpen } from 'lucide-react';
import { UserProfile, StudyLog, Deck } from '../types';
import { db, collection, query, where, getDocs, orderBy, limit } from '../firebase';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface AnalyticsViewProps {
  userProfile: UserProfile | null;
}

export default function AnalyticsView({ userProfile }: AnalyticsViewProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [studyLogs, setStudyLogs] = useState<StudyLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalyticsData() {
      if (!userProfile) return;
      
      setLoading(true);
      try {
        // Fetch study logs
        const logsRef = collection(db, 'users', userProfile.uid, 'studyLogs');
        
        // Calculate date range
        const now = new Date();
        const startDate = new Date();
        if (timeRange === 'week') startDate.setDate(now.getDate() - 7);
        else if (timeRange === 'month') startDate.setMonth(now.getMonth() - 1);
        else if (timeRange === 'year') startDate.setFullYear(now.getFullYear() - 1);
        
        const q = query(
          logsRef, 
          where('date', '>=', startDate.toISOString().split('T')[0]),
          orderBy('date', 'asc')
        );
        
        const querySnapshot = await getDocs(q);
        const logs: StudyLog[] = [];
        querySnapshot.forEach((doc) => {
          logs.push({ id: doc.id, ...doc.data() } as StudyLog);
        });
        
        setStudyLogs(logs);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalyticsData();
  }, [userProfile, timeRange]);

  // Process data for charts
  const activityData = studyLogs.map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    cards: log.cardsReviewed,
    xp: log.xpEarned
  }));

  // Calculate totals
  const totalCards = studyLogs.reduce((sum, log) => sum + log.cardsReviewed, 0);
  const totalXP = studyLogs.reduce((sum, log) => sum + log.xpEarned, 0);
  
  // Difficulty distribution
  const totalForgot = studyLogs.reduce((sum, log) => sum + (log.forgotCount || 0), 0);
  const totalDoubtful = studyLogs.reduce((sum, log) => sum + (log.doubtfulCount || 0), 0);
  const totalKnew = studyLogs.reduce((sum, log) => sum + (log.knewCount || 0), 0);
  
  const difficultyData = [
    { name: 'Forgot', value: totalForgot, color: '#ef4444' }, // red-500
    { name: 'Doubtful', value: totalDoubtful, color: '#f59e0b' }, // amber-500
    { name: 'Knew it', value: totalKnew, color: '#10b981' }, // emerald-500
  ].filter(item => item.value > 0);

  const retentionRate = totalCards > 0 
    ? Math.round(((totalKnew + (totalDoubtful * 0.5)) / totalCards) * 100) 
    : 0;

  if (loading && studyLogs.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-parchment/50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-parchment/50">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-coffee mb-2">Your Learning Progress</h1>
            <p className="text-coffee/70">Track your knowledge growth and study habits over time.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-earth/20">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range 
                    ? 'bg-coffee text-parchment shadow-sm' 
                    : 'text-coffee/70 hover:bg-earth/30'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Cards Reviewed" 
            value={totalCards.toString()} 
            subtitle={`In the last ${timeRange}`}
            icon={<BookOpen className="text-gold" size={24} />}
            trend="+12%"
          />
          <MetricCard 
            title="Retention Rate" 
            value={`${retentionRate}%`} 
            subtitle="Based on recent reviews"
            icon={<Brain className="text-emerald-500" size={24} />}
            trend="+5%"
          />
          <MetricCard 
            title="Current Streak" 
            value={`${userProfile?.streak || 0} Days`} 
            subtitle="Keep it up!"
            icon={<TrendingUp className="text-orange-500" size={24} />}
          />
          <MetricCard 
            title="Total XP Earned" 
            value={totalXP.toString()} 
            subtitle={`In the last ${timeRange}`}
            icon={<Award className="text-purple-500" size={24} />}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Line Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-earth/20">
            <h3 className="text-lg font-bold text-coffee mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-gold" />
              Study Activity
            </h3>
            <div className="h-72">
              {activityData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#78716c', fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis 
                      yAxisId="left"
                      tick={{ fill: '#78716c', fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      dx={-10}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      tick={{ fill: '#78716c', fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      dx={10}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ stroke: '#d6d3d1', strokeWidth: 1, strokeDasharray: '3 3' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      name="Cards Reviewed"
                      dataKey="cards" 
                      stroke="#8b5a2b" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#8b5a2b', strokeWidth: 0 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      name="XP Earned"
                      dataKey="xp" 
                      stroke="#d4af37" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#d4af37', strokeWidth: 0 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-coffee/50">
                  No study data available for this period.
                </div>
              )}
            </div>
          </div>

          {/* Difficulty Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-earth/20">
            <h3 className="text-lg font-bold text-coffee mb-6 flex items-center gap-2">
              <Brain size={20} className="text-gold" />
              Recall Performance
            </h3>
            <div className="h-64">
              {difficultyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={difficultyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {difficultyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#4a3f35' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-coffee/50">
                  No review data available.
                </div>
              )}
            </div>
            {difficultyData.length > 0 && (
              <div className="mt-4 text-sm text-center text-coffee/70">
                Breakdown of how well you remembered cards during reviews.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon, trend }: { title: string, value: string, subtitle: string, icon: React.ReactNode, trend?: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-earth/20 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-earth/20 rounded-xl">
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <h4 className="text-coffee/60 text-sm font-medium mb-1">{title}</h4>
      <div className="text-3xl font-bold text-coffee mb-1">{value}</div>
      <p className="text-xs text-coffee/50 mt-auto">{subtitle}</p>
    </div>
  );
}
