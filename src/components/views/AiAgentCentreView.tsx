import React from 'react';
import { Bot, Pause, Play, RefreshCw } from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';
import { ChartCard } from '../ui/ChartCard';
import { DisclaimerBanner } from '../ui/DisclaimerBanner';
import { StatusLabel } from '../ui/StatusLabel';

export const AiAgentCentreView: React.FC = () => {
  const { agents, executions, toggleAgentStatus, runAgentSimulation, setActiveRoute } =
    useHealthcare();

  const totalTasks = agents.reduce((s, a) => s + a.tasksProcessed, 0);
  const activeCount = agents.filter((a) => a.status === 'Active').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            AI Healthcare Agent Centre
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Simulated orchestration monitor for 8 specialised clinical and operational workflow agents ({activeCount} active ·{' '}
            <span className="font-mono tabular-nums">{totalTasks.toLocaleString()}</span> total tasks).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveRoute('agent-execution-history')}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Full Execution History ({executions.length})
        </button>
      </div>

      <DisclaimerBanner
        title="Simulated Agent Orchestration"
        message="Agent statuses, workloads, and execution records are simulated workflow demonstrations. No live external medical AI models or hospital systems are connected."
      />

      {/* 8 Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {agents.map((agent) => (
          <article
            key={agent.id}
            className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col justify-between space-y-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-sky-700 dark:text-sky-400">
                  <Bot className="w-3.5 h-3.5" />
                  {agent.id}
                </span>
                <StatusLabel label={agent.status} />
              </div>

              <h2 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
                {agent.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {agent.description}
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-100 dark:border-slate-800 py-2.5">
                <div>
                  <span className="text-slate-400 block text-[11px]">Tasks Processed</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                    {agent.tasksProcessed.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Success Rate</span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {agent.successRate}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Avg Execution</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                    {agent.avgExecutionMs} ms
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Last Execution</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {agent.lastExecution}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">Current Workload</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                    {agent.currentWorkloadPct}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      agent.currentWorkloadPct >= 75 ? 'bg-amber-500' : 'bg-sky-600'
                    }`}
                    style={{ width: `${agent.currentWorkloadPct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => runAgentSimulation(agent.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-sky-600 hover:bg-sky-700 py-1.5 text-xs font-semibold text-white transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Run Cycle
                </button>
                <button
                  type="button"
                  onClick={() => toggleAgentStatus(agent.id)}
                  aria-label={agent.status === 'Paused' ? `Resume ${agent.name}` : `Pause ${agent.name}`}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {agent.status === 'Paused' ? (
                    <Play className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Pause className="w-3.5 h-3.5 text-amber-600" />
                  )}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Activity Timeline */}
      <ChartCard
        title="Simulated Agent Activity Timeline"
        subtitle="Chronological log of recent agent tasks and advisory outputs"
        action={
          <button
            type="button"
            onClick={() => setActiveRoute('agent-execution-history')}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
          >
            View All Logs
          </button>
        }
      >
        <ol className="space-y-3 border-l border-slate-200 dark:border-slate-800 ml-2 pl-4">
          {executions.slice(0, 8).map((exe) => (
            <li key={exe.id} className="text-xs space-y-0.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-sky-700 dark:text-sky-400">
                    {exe.id}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {exe.agentName}
                  </span>
                  <span className="text-slate-400">· {exe.taskType}</span>
                </div>
                <div className="flex items-center gap-3">
                  <StatusLabel label={exe.status} />
                  <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                    {exe.startedAt} ({exe.durationMs} ms)
                  </span>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400">{exe.outputSummary}</p>
            </li>
          ))}
        </ol>
      </ChartCard>
    </div>
  );
};
