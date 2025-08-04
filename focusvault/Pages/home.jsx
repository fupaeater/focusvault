import React, { useState, useEffect } from 'react';
import { PomodoroSession } from '@/entities/PomodoroSession';
import { User } from '@/entities/User';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SessionSelector from '../components/session/SessionSelector';

export default function Home() {
  const [sessions, setSessions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [user, sessionsList] = await Promise.all([
        User.me(),
        PomodoroSession.list('-updated_date')
      ]);
      setCurrentUser(user);
      setSessions(sessionsList);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (sessionName) => {
    try {
      const newSession = await PomodoroSession.create({
        name: sessionName,
        status: 'waiting',
        current_cycle: 1,
        time_remaining: 1500, // 25 minutes
        active_participants: [currentUser.email]
      });
      
      navigate(createPageUrl(`Session?id=${newSession.id}`));
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const handleJoinSession = async (sessionId) => {
    try {
      const session = await PomodoroSession.get(sessionId);
      const updatedParticipants = [...(session.active_participants || [])];
      
      if (!updatedParticipants.includes(currentUser.email)) {
        updatedParticipants.push(currentUser.email);
        await PomodoroSession.update(sessionId, {
          active_participants: updatedParticipants
        });
      }
      
      navigate(createPageUrl(`Session?id=${sessionId}`));
    } catch (error) {
      console.error('Error joining session:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-stone-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <SessionSelector
      sessions={sessions}
      onCreateSession={handleCreateSession}
      onJoinSession={handleJoinSession}
      currentUser={currentUser}
    />
  );
}