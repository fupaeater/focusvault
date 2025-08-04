import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, Clock, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SessionSelector({ 
  sessions, 
  onCreateSession, 
  onJoinSession,
  currentUser 
}) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');

  const handleCreateSession = () => {
    if (newSessionName.trim()) {
      onCreateSession(newSessionName.trim());
      setNewSessionName('');
      setShowCreateDialog(false);
    }
  };

  const formatTimeRemaining = (session) => {
    const minutes = Math.floor(session.time_remaining / 60);
    const seconds = session.time_remaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status) => {
    return status === 'work' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
           status.includes('break') ? 'bg-amber-100 text-amber-700 border-amber-200' :
           status === 'paused' ? 'bg-slate-100 text-slate-700 border-slate-200' :
           'bg-blue-100 text-blue-700 border-blue-200';
  };

  const getStatusText = (status) => {
    return status === 'work' ? 'Focus Time' :
           status === 'short_break' ? 'Short Break' :
           status === 'long_break' ? 'Long Break' :
           status === 'paused' ? 'Paused' :
           'Waiting to Start';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-stone-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl flex items-center justify-center shadow-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-slate-900 mb-4"
          >
            Focus Together
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto"
          >
            Join a collaborative Pomodoro session and stay synchronized with your team's focus cycles
          </motion.p>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 text-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Session
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Focus Session</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Enter session name..."
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateSession()}
                  className="text-lg border-0 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl"
                  autoFocus
                />
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateSession} className="bg-emerald-600 hover:bg-emerald-700">
                    Create Session
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <Card className="glass-effect border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-slate-900 truncate">
                        {session.name}
                      </CardTitle>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}>
                        {getStatusText(session.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Users className="w-4 h-4" />
                        <span>{session.active_participants?.length || 0} participants</span>
                      </div>
                      {session.status !== 'waiting' && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-4 h-4" />
                          <span className="font-mono">{formatTimeRemaining(session)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Cycle:</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (session.current_cycle / 4) * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{session.current_cycle}/4</span>
                    </div>

                    {session.active_participants?.length > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                          {session.active_participants.slice(0, 3).map((participant, i) => (
                            <div
                              key={participant}
                              className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white shadow-sm"
                              title={participant}
                            >
                              {participant.charAt(0).toUpperCase()}
                            </div>
                          ))}
                          {session.active_participants.length > 3 && (
                            <div className="w-6 h-6 bg-slate-300 rounded-full flex items-center justify-center text-slate-600 text-xs font-medium border-2 border-white shadow-sm">
                              +{session.active_participants.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={() => onJoinSession(session.id)}
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group-hover:shadow-xl"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Join Session
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {sessions.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No Active Sessions</h3>
            <p className="text-slate-500">Create the first session to get started!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}