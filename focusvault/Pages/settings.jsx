import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Clock, User as UserIcon, Bell, Palette } from 'lucide-react';

export default function Settings() {
  const [currentUser, setCurrentUser] = useState(null);
  const [settings, setSettings] = useState({
    work_duration: 25,
    short_break_duration: 5,
    long_break_duration: 15,
    notification_sound: true,
    auto_start_breaks: false,
    theme: 'default'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      if (user.pomodoro_settings) {
        setSettings({ ...settings, ...user.pomodoro_settings });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await User.updateMyUserData({
        pomodoro_settings: settings
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-stone-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-stone-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Settings</h1>
          <p className="text-slate-600">Customize your focus experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Timer Settings */}
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-emerald-600" />
                </div>
                Timer Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="work_duration">Work Duration (minutes)</Label>
                <Input
                  id="work_duration"
                  type="number"
                  min="1"
                  max="60"
                  value={settings.work_duration}
                  onChange={(e) => handleInputChange('work_duration', parseInt(e.target.value))}
                  className="border-0 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="short_break_duration">Short Break Duration (minutes)</Label>
                <Input
                  id="short_break_duration"
                  type="number"
                  min="1"
                  max="30"
                  value={settings.short_break_duration}
                  onChange={(e) => handleInputChange('short_break_duration', parseInt(e.target.value))}
                  className="border-0 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="long_break_duration">Long Break Duration (minutes)</Label>
                <Input
                  id="long_break_duration"
                  type="number"
                  min="1"
                  max="60"
                  value={settings.long_break_duration}
                  onChange={(e) => handleInputChange('long_break_duration', parseInt(e.target.value))}
                  className="border-0 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl"
                />
              </div>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                </div>
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Name</Label>
                <div className="p-3 bg-slate-50 rounded-xl text-slate-700">
                  {currentUser?.full_name || 'Anonymous User'}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="p-3 bg-slate-50 rounded-xl text-slate-700">
                  {currentUser?.email || 'No email'}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Role</Label>
                <div className="p-3 bg-slate-50 rounded-xl text-slate-700 capitalize">
                  {currentUser?.role || 'User'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={handleSaveSettings}
            disabled={saving}
            size="lg"
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}