import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Timer, Users, Settings, Home } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-stone-50">
      <style>
        {`
          :root {
            --primary-forest: #1B4332;
            --primary-sage: #2D5A3D;
            --accent-amber: #F59E0B;
            --accent-warm: #FCD34D;
            --neutral-cloud: #F8FAFC;
            --neutral-stone: #64748B;
            --neutral-charcoal: #334155;
          }
          
          .glass-effect {
            backdrop-filter: blur(20px);
            background: rgba(255, 255, 255, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .focus-glow {
            box-shadow: 0 0 0 3px rgba(27, 67, 50, 0.1);
          }
          
          .break-glow {
            box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
          }
        `}
      </style>
      
      {/* Top Navigation */}
      <nav className="glass-effect border-b-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Timer className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">FocusSync</h1>
                <p className="text-xs text-slate-500 font-medium">Collaborative Focus Sessions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Link
                to={createPageUrl("Home")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  currentPageName === "Home"
                    ? "bg-emerald-100 text-emerald-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Home className="w-4 h-4 inline mr-2" />
                Sessions
              </Link>
              <Link
                to={createPageUrl("Settings")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  currentPageName === "Settings"
                    ? "bg-emerald-100 text-emerald-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Settings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}