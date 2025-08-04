import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Clock, AlertCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TaskBoard({ 
  tasks, 
  onAddTask, 
  onCompleteTask, 
  currentUser 
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    estimated_pomodoros: 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.title.trim()) {
      onAddTask(newTask);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        estimated_pomodoros: 1
      });
      setShowAddForm(false);
    }
  };

  const getPriorityColor = (priority) => {
    return priority === 'high' ? 'bg-red-100 text-red-700 border-red-200' :
           priority === 'medium' ? 'bg-amber-100 text-amber-700 border-amber-200' :
           'bg-blue-100 text-blue-700 border-blue-200';
  };

  const getPriorityIcon = (priority) => {
    return priority === 'high' ? <AlertCircle className="w-3 h-3" /> :
           priority === 'medium' ? <Clock className="w-3 h-3" /> :
           <Clock className="w-3 h-3" />;
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Shared Tasks</h3>
          <p className="text-slate-600 mt-1">Collaborate on your focus goals</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Add Task Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="glass-effect border-0 shadow-xl">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        placeholder="What needs to be done?"
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        className="text-lg border-0 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl"
                        autoFocus
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Textarea
                        placeholder="Add details... (optional)"
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                        className="border-0 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl h-24"
                      />
                    </div>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask({...newTask, priority: value})}
                    >
                      <SelectTrigger className="border-0 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={newTask.estimated_pomodoros.toString()}
                      onValueChange={(value) => setNewTask({...newTask, estimated_pomodoros: parseInt(value)})}
                    >
                      <SelectTrigger className="border-0 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} Pomodoro{num > 1 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowAddForm(false)}
                      className="rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                    >
                      Add Task
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
            In Progress ({pendingTasks.length})
          </h4>
          <div className="space-y-3">
            <AnimatePresence>
              {pendingTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  layout
                >
                  <Card className="glass-effect border-0 shadow-sm hover:shadow-md transition-all duration-200 group">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <button
                              onClick={() => onCompleteTask(task.id)}
                              className="w-6 h-6 border-2 border-slate-300 rounded-full hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 flex items-center justify-center group-hover:border-emerald-400"
                            >
                              <Check className="w-3 h-3 text-emerald-600 opacity-0 group-hover:opacity-50" />
                            </button>
                            <h5 className="font-semibold text-slate-900 flex-1">{task.title}</h5>
                          </div>
                          {task.description && (
                            <p className="text-slate-600 text-sm mb-3 ml-9">{task.description}</p>
                          )}
                          <div className="flex items-center gap-2 ml-9">
                            <Badge variant="outline" className={`${getPriorityColor(task.priority)} border text-xs`}>
                              {getPriorityIcon(task.priority)}
                              <span className="ml-1">{task.priority}</span>
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {task.estimated_pomodoros} pomodoro{task.estimated_pomodoros > 1 ? 's' : ''}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <User className="w-3 h-3" />
                          {task.created_by?.split('@')[0] || 'Unknown'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {pendingTasks.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No pending tasks. Add one to get started!</p>
              </div>
            )}
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
            Completed ({completedTasks.length})
          </h4>
          <div className="space-y-3">
            <AnimatePresence>
              {completedTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  layout
                >
                  <Card className="glass-effect border-0 shadow-sm opacity-75">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <h5 className="font-semibold text-slate-600 line-through flex-1">{task.title}</h5>
                          </div>
                          {task.description && (
                            <p className="text-slate-500 text-sm mb-3 ml-9 line-through">{task.description}</p>
                          )}
                          <div className="flex items-center gap-2 ml-9">
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                              <Check className="w-3 h-3 mr-1" />
                              completed
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <User className="w-3 h-3" />
                          {task.completed_by?.split('@')[0] || 'Unknown'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {completedTasks.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <Check className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No completed tasks yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}