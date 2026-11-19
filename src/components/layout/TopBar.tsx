import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { DateRangeOption, useHealthcare } from '../../context/HealthcareContext';
import { DEPARTMENTS } from '../../data/healthcareData';
import type { DepartmentName } from '../../types/healthcare';
import { ALL_NAV_ITEMS } from './navigationConfig';

interface TopBarProps {
  onOpenMobileNav: () => void;
}

const DATE_RANGES: DateRangeOption[] = ['Today', 'Last 7 Days', 'Last 30 Days', 'This Quarter'];

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileNav }) => {
  const {
    activeRoute,
    setActiveRoute,
    theme,
    toggleTheme,
    selectedDepartment,
    setSelectedDepartment,
    selectedDateRange,
    setSelectedDateRange,
    patients,
    diagnosticCases,
    labReports,
    imagingCases,
    openPatientDetail,
    alerts,
    notificationsOpen,
    setNotificationsOpen,
  } = useHealthcare();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentNav = ALL_NAV_ITEMS.find((n) => n.id === activeRoute);
  const unreadAlerts = alerts.filter((a) => a.reviewStatus === 'Pending Review').length;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setSearchFocused(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    return {
      patients: patients
        .filter(
          (p) =>
            p.id.toLowerCase().includes(q) ||
            p.name.toLowerCase().includes(q) ||
            p.primaryCondition.toLowerCase().includes(q) ||
            p.department.toLowerCase().includes(q)
        )
        .slice(0, 5),
      diagnostics: diagnosticCases
        .filter(
          (d) =>
            d.id.toLowerCase().includes(q) ||
            d.patientName.toLowerCase().includes(q) ||
            d.predictedCondition.toLowerCase().includes(q)
        )
        .slice(0, 3),
      labs: labReports
        .filter(
          (l) =>
            l.id.toLowerCase().includes(q) ||
            l.testName.toLowerCase().includes(q) ||
            l.patientName.toLowerCase().includes(q)
        )
        .slice(0, 3),
      imaging: imagingCases
        .filter(
          (im) =>
            im.id.toLowerCase().includes(q) ||
            im.modality.toLowerCase().includes(q) ||
            im.patientName.toLowerCase().includes(q)
        )
        .slice(0, 3),
    };
  }, [searchQuery, patients, diagnosticCases, labReports, imagingCases]);

  const hasResults =
    searchResults &&
    (searchResults.patients.length > 0 ||
      searchResults.diagnostics.length > 0 ||
      searchResults.labs.length > 0 ||
      searchResults.imaging.length > 0);

  return (
    <header className="sticky top-0 z-20 h-13 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200/80 dark:border-slate-800 px-4 lg:px-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block min-w-0">
          <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 truncate">
            {currentNav?.section} / {currentNav?.label}
          </div>
          <div className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
            {currentNav?.label}
          </div>
        </div>
      </div>

      {/* Global Search */}
      <div ref={containerRef} className="relative flex-1 max-w-md">
        <div className="relative flex items-center">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none"
            aria-hidden="true"
          />
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onFocus={() => setSearchFocused(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchFocused(true);
            }}
            placeholder="Search patients, PAT-10284, tests, scans..."
            aria-label="Global clinical search"
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 pl-9 pr-7 md:pr-14 py-1.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 focus:outline-none"
          />
          {searchQuery ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden md:inline-block absolute right-2.5 text-[11px] font-mono text-slate-400 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 bg-white dark:bg-slate-900">
              ⌘K
            </kbd>
          )}
        </div>

        {searchFocused && searchQuery.trim().length > 0 && (
          <div className="absolute left-0 right-0 top-11 z-40 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl max-h-96 overflow-y-auto p-2">
            {!hasResults ? (
              <div className="px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
                No matching synthetic records found for "{searchQuery}".
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.patients.length > 0 && (
                  <div>
                    <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400">
                      Patients
                    </div>
                    {searchResults.patients.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          openPatientDetail(p.id);
                          setSearchFocused(false);
                        }}
                        className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
                      >
                        <div>
                          <span className="font-mono font-semibold text-sky-700 dark:text-sky-400 mr-2">
                            {p.id}
                          </span>{' '}
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {p.name}
                          </span>{' '}
                          <span className="text-slate-500 dark:text-slate-400 ml-2">
                            · {p.department}
                          </span>
                        </div>{' '}
                        <span className="text-[11px] text-slate-400">{p.city}</span>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.diagnostics.length > 0 && (
                  <div>
                    <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400">
                      Predictive Diagnostics
                    </div>
                    {searchResults.diagnostics.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          setActiveRoute('predictive-diagnostics');
                          setSearchFocused(false);
                        }}
                        className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
                      >
                        <div>
                          <span className="font-mono font-semibold text-teal-700 dark:text-teal-400 mr-2">
                            {d.id}
                          </span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {d.patientName}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 ml-2">
                            · {d.predictedCondition}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.labs.length > 0 && (
                  <div>
                    <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400">
                      Laboratory Reports
                    </div>
                    {searchResults.labs.map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => {
                          setActiveRoute('laboratory-intelligence');
                          setSearchFocused(false);
                        }}
                        className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
                      >
                        <div>
                          <span className="font-mono font-semibold text-indigo-700 dark:text-indigo-400 mr-2">
                            {l.id}
                          </span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {l.testName}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 ml-2">
                            · {l.patientName}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.imaging.length > 0 && (
                  <div>
                    <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400">
                      Medical Imaging
                    </div>
                    {searchResults.imaging.map((im) => (
                      <button
                        key={im.id}
                        type="button"
                        onClick={() => {
                          setActiveRoute('medical-imaging');
                          setSearchFocused(false);
                        }}
                        className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
                      >
                        <div>
                          <span className="font-mono font-semibold text-sky-700 dark:text-sky-400 mr-2">
                            {im.id}
                          </span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {im.modality} · {im.bodyRegion}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 ml-2">
                            · {im.patientName}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Utilities */}
      <div className="flex items-center gap-2.5 shrink-0">
        <label className="sr-only" htmlFor="global-dept-filter">
          Filter by department
        </label>
        <select
          id="global-dept-filter"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value as DepartmentName | 'All')}
          className="hidden xl:block rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-sky-500"
        >
          <option value="All">All Departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="global-date-filter">
          Select date window
        </label>
        <select
          id="global-date-filter"
          value={selectedDateRange}
          onChange={(e) => setSelectedDateRange(e.target.value as DateRangeOption)}
          className="hidden md:block rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-sky-500"
        >
          {DATE_RANGES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          aria-label={`Open notifications (${unreadAlerts} pending)`}
          className="relative p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadAlerts > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-mono font-bold text-white">
              {unreadAlerts}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveRoute('user-management')}
          className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800 text-left hover:opacity-90"
        >
          <img
            src="/src/assets/images/doctor_profile_avatar_1795087304237.jpg"
            alt="Dr. Arun Patel"
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
          <div className="leading-tight">
            <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
              Dr. Arun Patel
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Senior Cardiologist
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};
