
import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Zap, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TimerDisplay({ 
  session, 
  timeRemaining, 
  onStart, 
  onPause, 
  onReset, 
  isActive,
  participants = []
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!session) return 0;
    const totalTime = session.status === 'work' ? session.work_duration :
                     session.status === 'short_break' ? session.short_break_duration :
                     session.long_break_duration;
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  const getStatusColor = () => {
    if (!session) return 'from-slate-400 to-slate-500';
    return session.status === 'work' ? 'from-emerald-500 to-emerald-600' :
           session.status.includes('break') ? 'from-amber-500 to-amber-600' :
           'from-slate-400 to-slate-500';
  };

  const getStatusIcon = () => {
    if (!session) return <Timer className="w-6 h-6" />;
    return session.status === 'work' ? <Zap className="w-6 h-6" /> :
           session.status.includes('break') ? <Coffee className="w-6 h-6" /> :
           <Timer className="w-6 h-6" />;
  };

  const getStatusText = () => {
    if (!session) return 'Ready to Focus';
    return session.status === 'work' ? 'Focus Time' :
           session.status === 'short_break' ? 'Short Break' :
           session.status === 'long_break' ? 'Long Break' :
           'Paused';
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Timer Circle */}
      <div className="relative">
        <svg className="w-80 h-80 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Circle */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="rgba(148, 163, 184, 0.1)"
            strokeWidth="2"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - getProgress() / 100) }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={session?.status === 'work' ? '#10B981' : '#F59E0B'} />
              <stop offset="100%" stopColor={session?.status === 'work' ? '#059669' : '#D97706'} />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Timer Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div 
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${getStatusColor()} flex items-center justify-center text-white shadow-lg mb-4`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {getStatusIcon()}
          </motion.div>
          
          <div className="text-center">
            <motion.div 
              className="text-5xl font-light text-slate-900 tracking-wider mb-2"
              key={timeRemaining}
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {formatTime(timeRemaining)}
            </motion.div>
            <div className="text-lg font-medium text-slate-600">
              {getStatusText()}
            </div>
            <div className="text-sm text-slate-400 mt-1">
              Cycle {session?.current_cycle || 1}
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center space-x-4">
        {!isActive ? (
          <Button 
            onClick={onStart}
            size="lg"
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Focus
          </Button>
        ) : (
          <Button 
            onClick={onPause}
            size="lg"
            variant="outline"
            className="border-2 border-slate-300 hover:border-slate-400 px-8 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Pause className="w-5 h-5 mr-2" />
            Pause
          </Button>
        )}
        
        <Button 
          onClick={onReset}
          size="lg"
          variant="ghost"
          className="text-slate-600 hover:text-slate-900 px-6 py-3 rounded-2xl hover:bg-slate-100 transition-all duration-200"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset
        </Button>
      </div>

      {/* Participants */}
      {participants.length > 0 && (
        <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20">
          <div className="flex -space-x-2">
            {participants.slice(0, 5).map((participant, index) => (
              <div
                key={participant}
                className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white shadow-sm"
                title={participant}
              >
                {participant.charAt(0).toUpperCase()}
              </div>
            ))}
            {participants.length > 5 && (
              <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center text-slate-600 text-xs font-medium border-2 border-white shadow-sm">
                +{participants.length - 5}
              </div>
            )}
          </div>
          <span className="text-sm text-slate-600 font-medium">
            {participants.length} focusing together
          </span>
        </div>
      )}
    </div>
  );
}
