import React, { useMemo, useState } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, Download, Plus, Search, X } from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';
import { DEPARTMENTS, DOCTORS_BY_DEPT, HOSPITALS, INDIAN_CITIES } from '../../data/healthcareData';
import type { DepartmentName, PatientRecord, RiskClassification } from '../../types/healthcare';
import {
  classifyRiskLevel,
  computeRiskScore,
  filterPatients,
  PatientSortKey,
  sortPatients,
} from '../../utils/clinicalLogic';
import { downloadCsvFile } from '../../utils/exportCsv';
import { DisclaimerBanner } from '../ui/DisclaimerBanner';
import { StatusLabel } from '../ui/StatusLabel';

const PAGE_SIZE = 12;

export const PatientManagementView: React.FC = () => {
  const { patients, addPatient, selectedDepartment, openPatientDetail } = useHealthcare();

  const [query, setQuery] = useState('');
  const [localDept, setLocalDept] = useState<DepartmentName | 'All'>('All');
  const [riskFilter, setRiskFilter] = useState<RiskClassification | 'All'>('All');
  const [cityFilter, setCityFilter] = useState<string>('All');
  const [sortKey, setSortKey] = useState<PatientSortKey>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add patient form state
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('45');
  const [newGender, setNewGender] = useState<'Male' | 'Female'>('Female');
  const [newDept, setNewDept] = useState<DepartmentName>('Cardiology');
  const [newCity, setNewCity] = useState<string>('Mumbai');
  const [newCondition, setNewCondition] = useState('');
  const [formError, setFormError] = useState('');

  const effectiveDept = localDept !== 'All' ? localDept : selectedDepartment;

  const filteredAndSorted = useMemo(() => {
    const filtered = filterPatients(patients, {
      query,
      department: effectiveDept,
      riskLevel: riskFilter,
      city: cityFilter,
    });
    return sortPatients(filtered, sortKey, sortDir);
  }, [patients, query, effectiveDept, riskFilter, cityFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredAndSorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const toggleSort = (key: PatientSortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'riskScore' ? 'desc' : 'asc');
    }
  };

  const handleExportCsv = () => {
    downloadCsvFile(
      'medisense-patients-synthetic.csv',
      ['Patient ID', 'Name', 'Age', 'Gender', 'City', 'Hospital', 'Department', 'Condition', 'BP', 'HR', 'SpO2', 'Risk Level', 'Risk Score', 'Last Exam'],
      filteredAndSorted.map((p) => [
        p.id,
        p.name,
        p.age,
        p.gender,
        p.city,
        p.hospital,
        p.department,
        p.primaryCondition,
        `${p.vitals.bpSystolic}/${p.vitals.bpDiastolic}`,
        p.vitals.heartRate,
        `${p.vitals.spo2}%`,
        p.riskLevel,
        p.riskScore,
        p.lastExamination,
      ])
    );
  };

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCondition.trim()) {
      setFormError('Patient full name and primary presenting condition are required.');
      return;
    }
    const ageNum = Number(newAge);
    if (!Number.isFinite(ageNum) || ageNum < 1 || ageNum > 110) {
      setFormError('Please enter a valid patient age between 1 and 110.');
      return;
    }

    const hospitalObj = HOSPITALS.find((h) => h.city === newCity) ?? HOSPITALS[0];
    const vitals = {
      bpSystolic: 128,
      bpDiastolic: 82,
      heartRate: 78,
      spo2: 98,
      temperatureC: 36.8,
      respiratoryRate: 16,
      recordedAt: 'Just now (Synthetic)',
    };
    const score = computeRiskScore({ age: ageNum, vitals, comorbidityCount: 1 });
    const nextId = `PAT-${10201 + patients.length + 1}`;
    const newRecord: PatientRecord = {
      id: nextId,
      name: newName.trim(),
      age: ageNum,
      gender: newGender,
      city: hospitalObj.city,
      hospital: hospitalObj.name,
      department: newDept,
      primaryCondition: newCondition.trim(),
      medicalHistory: ['Newly Registered Synthetic Profile'],
      medications: ['Pending Clinician Reconciliation'],
      allergies: ['None Documented'],
      vitals,
      riskScore: score,
      riskLevel: classifyRiskLevel(score),
      status: 'Active Outpatient',
      lastExamination: '2026-11-19',
      nextFollowUp: '2026-11-27',
      attendingDoctor: DOCTORS_BY_DEPT[newDept][0],
      engagementScore: 88,
      phone: '+91 98200 00000',
      bloodGroup: 'O+',
      timeline: [
        {
          id: `TL-${nextId}`,
          date: '2026-11-19 09:00',
          type: 'Consultation',
          title: 'Initial Synthetic Intake Registration',
          clinician: DOCTORS_BY_DEPT[newDept][0],
          notes: `Registered for ${newCondition.trim()} in ${newDept}.`,
        },
      ],
    };

    addPatient(newRecord);
    setShowAddModal(false);
    setNewName('');
    setNewCondition('');
    setFormError('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Patient Management & Records
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Searchable, sortable registry of {patients.length} synthetic Indian patient profiles across 6 regional hospital hubs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV ({filteredAndSorted.length})
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 px-3.5 py-2 text-xs font-semibold text-white whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Synthetic Patient
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by PAT ID, patient name, condition, hospital..."
            aria-label="Search patients"
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
          />
        </div>

        <select
          aria-label="Filter patients by department"
          value={localDept}
          onChange={(e) => {
            setLocalDept(e.target.value as DepartmentName | 'All');
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200"
        >
          <option value="All">All Departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter patients by risk level"
          value={riskFilter}
          onChange={(e) => {
            setRiskFilter(e.target.value as RiskClassification | 'All');
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200"
        >
          <option value="All">All Risk Levels</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Moderate">Moderate</option>
          <option value="Low">Low</option>
        </select>

        <select
          aria-label="Filter patients by city"
          value={cityFilter}
          onChange={(e) => {
            setCityFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200"
        >
          <option value="All">All Cities</option>
          {INDIAN_CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4 font-semibold">
                  <button
                    type="button"
                    onClick={() => toggleSort('id')}
                    className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                  >
                    Patient ID <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3 font-semibold">
                  <button
                    type="button"
                    onClick={() => toggleSort('name')}
                    className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                  >
                    Name & Demographics <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3 font-semibold">
                  <button
                    type="button"
                    onClick={() => toggleSort('department')}
                    className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                  >
                    Department & Facility <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3 font-semibold">Primary Condition</th>
                <th className="py-3 px-3 font-semibold">Vitals (BP / SpO2)</th>
                <th className="py-3 px-3 font-semibold">
                  <button
                    type="button"
                    onClick={() => toggleSort('riskScore')}
                    className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                  >
                    Risk <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4 text-right font-semibold">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    No synthetic patient records match the current filters.
                  </td>
                </tr>
              ) : (
                pageItems.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-semibold text-sky-700 dark:text-sky-400">
                      {p.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-900 dark:text-slate-100">{p.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {p.age}y · {p.gender} · {p.city}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{p.department}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {p.hospital}
                      </div>
                    </td>
                    <td className="py-3 px-3 max-w-[200px] truncate text-slate-700 dark:text-slate-300">
                      {p.primaryCondition}
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {p.vitals.bpSystolic}/{p.vitals.bpDiastolic} · {p.vitals.spo2}%
                    </td>
                    <td className="py-3 px-3">
                      <StatusLabel label={`${p.riskLevel} (${p.riskScore})`} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openPatientDetail(p.id)}
                        className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline whitespace-nowrap"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="tabular-nums">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filteredAndSorted.length)} of{' '}
            {filteredAndSorted.length} synthetic patients
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Prev
            </button>
            <span className="font-mono tabular-nums">
              Page {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Synthetic Patient Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Register Synthetic Demonstration Patient"
        >
          <div
            className="fixed inset-0 bg-slate-950/45"
            onClick={() => setShowAddModal(false)}
            aria-hidden="true"
          />
          <form
            onSubmit={handleCreatePatient}
            className="relative z-10 w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-50">
                Add Synthetic Patient Record
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                aria-label="Close modal"
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 px-3 py-2 text-xs text-rose-700 dark:text-rose-300">
                {formError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <label className="block space-y-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">Full Name</span>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Meera Krishnan"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Age</span>
                  <input
                    type="number"
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Gender</span>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as 'Male' | 'Female')}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Department</span>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value as DepartmentName)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">City Hub</span>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
                  >
                    {INDIAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block space-y-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Primary Presenting Condition
                </span>
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="e.g., Hypertension Review"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
                />
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-sky-600 hover:bg-sky-700 px-4 py-2 text-xs font-semibold text-white"
              >
                Save Synthetic Record
              </button>
            </div>
          </form>
        </div>
      )}

      <DisclaimerBanner
        message="All patient names, contact details, and clinical indicators shown above are simulated synthetic demonstration records."
      />
    </div>
  );
};
