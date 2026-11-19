import React from 'react';
import { Activity, X } from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';
import { NAVIGATION_GROUPS } from './navigationConfig';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { activeRoute, setActiveRoute, alerts } = useHealthcare();
  const pendingAlerts = alerts.filter((a) => a.reviewStatus === 'Pending Review').length;

  const navContent = (
    <div className="flex h-full flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200/70 dark:border-slate-800 shrink-0">
        <button
          type="button"
          onClick={() => {
            setActiveRoute('overview');
            onCloseMobile();
          }}
          className="flex items-center gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-sky-600 rounded-lg"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-600 to-teal-600 text-white shadow-sm">
            <Activity className="w-4 h-4" aria-hidden="true" />
          </span>
          <span className="font-display text-[17px] font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            MediSense <span className="text-sky-600 dark:text-sky-400">AI</span>
          </span>
        </button>

        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav
        aria-label="Primary Healthcare Navigation"
        className="flex-1 overflow-y-auto px-3 py-4 space-y-5"
      >
        {NAVIGATION_GROUPS.map((group) => (
          <div key={group.section}>
            <div className="px-3 mb-1.5 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500">
              {group.section}
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeRoute === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveRoute(item.id);
                        onCloseMobile();
                      }}
                      aria-current={isActive ? 'page' : undefined}
                      className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap ${
                        isActive
                          ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive
                              ? 'text-sky-600 dark:text-sky-400'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                          aria-hidden="true"
                        />
                        <span className="truncate">{item.label}</span>
                      </span>
                      {item.id === 'ai-centre' && pendingAlerts > 0 && (
                        <span className="text-[11px] font-mono font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
                          {pendingAlerts}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-3.5 border-t border-slate-200/70 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
        <div className="font-semibold text-slate-700 dark:text-slate-300">
          Sahyadri MedNet India
        </div>
        <div>Synthetic demonstration workspace · Not for clinical diagnosis</div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {navContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10">{navContent}</div>
        </div>
      )}
    </>
  );
};
