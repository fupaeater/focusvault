import React, { useState, useEffect, useCallback } from 'react';
import { PomodoroSession } from '@/entities/PomodoroSession';
import { CollaborativeTask } from '@/entities/CollaborativeTask';
import { User } from '@/entities/User';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TimerDisplay from '../components/timer/TimerDisplay';
import TaskBoard from '../components/tasks/TaskBoard';

export default function Session() {
  const [session, setSession] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('id');

  useEffect(() => {
    if (!sessionId) {
      navigate(createPageUrl('Home'));
      return;
    }
    
    loadSessionData();
  }, [sessionId]);

  useEffect(() => {
    let interval;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            handleCycleComplete();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const loadSessionData = async () => {
    try {
      const [user, sessionData, tasksList] = await Promise.all([
        User.me(),
        PomodoroSession.get(sessionId),
        CollaborativeTask.filter({ session_id: sessionId }, '-created_date')
      ]);
      
      setCurrentUser(user);
      setSession(sessionData);
      setTasks(tasksList);
      setTimeRemaining(sessionData.time_remaining);
      setIsActive(sessionData.status !== 'waiting' && sessionData.status !== 'paused');
    } catch (error) {
      console.error('Error loading session:', error);
      navigate(createPageUrl('Home'));
    } finally {
      setLoading(false);
    }
  };

  const handleCycleComplete = async () => {
    if (!session) return;
    
    setIsActive(false);
    
    let newStatus;
    let newTimeRemaining;
    let newCycle = session.current_cycle;
    
    if (session.status === 'work') {
      if (session.current_cycle % 4 === 0) {
        newStatus = 'long_break';
        newTimeRemaining = session.long_break_duration;
      } else {
        newStatus = 'short_break';
        newTimeRemaining = session.short_break_duration;
      }
    } else {
      newStatus = 'work';
      newTimeRemaining = session.work_duration;
      if (session.status === 'short_break' || session.status === 'long_break') {
        newCycle += 1;
      }
    }
    
    const updatedSession = await PomodoroSession.update(sessionId, {
      status: newStatus,
      current_cycle: newCycle,
      time_remaining: newTimeRemaining,
      last_updated: new Date().toISOString()
    });
    
    setSession(updatedSession);
    setTimeRemaining(newTimeRemaining);
  };

  const handleStart = async () => {
    if (!session) return;
    
    const updatedSession = await PomodoroSession.update(sessionId, {
      status: session.status === 'waiting' ? 'work' : session.status,
      last_updated: new Date().toISOString()
    });
    
    setSession(updatedSession);
    setIsActive(true);
  };

  const handlePause = async () => {
    if (!session) return;
    
    const updatedSession = await PomodoroSession.update(sessionId, {
      status: 'paused',
      time_remaining: timeRemaining,
      last_updated: new Date().toISOString()
    });
    
    setSession(updatedSession);
    setIsActive(false);
  };

  const handleReset = async () => {
    if (!session) return;
    
    const updatedSession = await PomodoroSession.update(sessionId, {
      status: 'waiting',
      current_cycle: 1,
      time_remaining: session.work_duration,
      last_updated: new Date().toISOString()
    });
    
    setSession(updatedSession);
    setTimeRemaining(session.work_duration);
    setIsActive(false);
  };

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await CollaborativeTask.create({
        ...taskData,
        session_id: sessionId
      });
      setTasks(prev => [newTask, ...prev]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const updatedTask = await CollaborativeTask.update(taskId, {
        completed: true,
        completed_by: currentUser.email
      });
      
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-stone-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Session Not Found</h2>
          <Button onClick={() => navigate(createPageUrl('Home'))}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-stone-50">
      {/* Header */}
      <div className="glass-effect border-b-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(createPageUrl('Home'))}
                className="rounded-xl hover:bg-slate-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{session.name}</h1>
                <p className="text-sm text-slate-600">Focus Session</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl hover:bg-slate-100"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* Timer Section */}
          <div className="flex items-center justify-center">
            <TimerDisplay
              session={session}
              timeRemaining={timeRemaining}
              onStart={handleStart}
              onPause={handlePause}
              onReset={handleReset}
              isActive={isActive}
              participants={session.active_participants || []}
            />
          </div>

          {/* Tasks Section */}
          <div className="space-y-6">
            <TaskBoard
              tasks={tasks}
              onAddTask={handleAddTask}
              onCompleteTask={handleCompleteTask}
              currentUser={currentUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
}