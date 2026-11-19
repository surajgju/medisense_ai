import React, { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';
import { downloadCsvFile } from '../../utils/exportCsv';
import { StatusLabel } from '../ui/StatusLabel';

export const AgentExecutionHistoryView: React.FC = () => {
  const { executions, agents } = useHealthcare();
  const [agentFilter, setAgentFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filtered = useMemo(() => {
    return executions.filter((e) => {
      if (agentFilter !== 'All' && e.agentName !== agentFilter) return false;
      if (statusFilter !== 'All' && e.status !== statusFilter) return false;
      return true;
    });
  }, [executions, agentFilter, statusFilter]);

  const handleExport = () => {
    downloadCsvFile(
      'medisense-agent-executions.csv',
      ['Execution ID', 'Agent', 'Task Type', 'Target', 'Department', 'Started At', 'Duration (ms)', 'Status', 'Summary'],
      filtered.map((e) => [
        e.id,
        e.agentName,
        e.taskType,
        e.targetEntity,
        e.department,
        e.startedAt,
        e.durationMs,
        e.status,
        e.outputSummary,
      ])
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Agent Execution History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Detailed audit log of {executions.length} simulated healthcare agent execution runs.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Download className="w-3.5 h-3.5" />
          Export Execution CSV
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          aria-label="Filter by AI agent"
          value={agentFilter}
          onChange={(e) => setAgentFilter(e.target.value)}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200"
        >
          <option value="All">All 8 Agents</option>
          {agents.map((a) => (
            <option key={a.id} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by execution status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200"
        >
          <option value="All">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Flagged for Review">Flagged for Review</option>
        </select>
      </div>

      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4 font-semibold">Execution ID</th>
                <th className="py-3 px-3 font-semibold">Agent</th>
                <th className="py-3 px-3 font-semibold">Task Type</th>
                <th className="py-3 px-3 font-semibold">Target</th>
                <th className="py-3 px-3 font-semibold">Started</th>
                <th className="py-3 px-3 font-semibold text-right">Latency</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-semibold text-sky-700 dark:text-sky-400">
                    {e.id}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-100">
                    {e.agentName}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{e.taskType}</td>
                  <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">
                    {e.targetEntity}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">{e.startedAt}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {e.durationMs} ms
                  </td>
                  <td className="py-3 px-3">
                    <StatusLabel label={e.status} />
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate text-slate-600 dark:text-slate-400">
                    {e.outputSummary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
