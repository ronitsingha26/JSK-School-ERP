import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Plus, ChevronDown, ChevronUp,
  Save, Zap, Calendar, Settings, Trash2, Copy
} from 'lucide-react';

const fade = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const ALL_CLASSES = ['Nursery','LKG','UKG','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];

const SUBJECTS_DEFAULT = ['English','Hindi','Mathematics','Science','Social Science'];

const EXAM_TYPES = [
  { value: 'unit_test',   label: 'Unit Test'   },
  { value: 'half_yearly', label: 'Half Yearly' },
  { value: 'annual',      label: 'Annual'      },
  { value: 'pre_board',   label: 'Pre-Board'   },
  { value: 'custom',      label: 'Custom'      },
];

const DEFAULT_GRADES = [
  { grade: 'A+', min: 90,  max: 100, points: 10, remarks: 'Outstanding' },
  { grade: 'A',  min: 80,  max: 89,  points: 9,  remarks: 'Excellent'   },
  { grade: 'B+', min: 70,  max: 79,  points: 8,  remarks: 'Very Good'   },
  { grade: 'B',  min: 60,  max: 69,  points: 7,  remarks: 'Good'        },
  { grade: 'C',  min: 50,  max: 59,  points: 6,  remarks: 'Average'     },
  { grade: 'D',  min: 33,  max: 49,  points: 5,  remarks: 'Below Avg'   },
  { grade: 'F',  min: 0,   max: 32,  points: 0,  remarks: 'Fail'        },
];

function buildDefaultSchedule(subjects) {
  return subjects.map(sub => ({
    subject: sub, date: '', time: '10:00 AM', max_theory: 100, max_practical: 0, pass_marks: 33,
  }));
}

const TIMES = ['08:00 AM','09:00 AM','10:00 AM','11:00 AM','12:00 PM','01:00 PM','02:00 PM','03:00 PM'];

export default function ExamCreate() {
  const navigate = useNavigate();

  // Basic Details
  const [form, setForm] = useState({
    name: '', academic_year: '2025-26', exam_type: 'half_yearly',
    start_date: '', end_date: '', result_date: '', description: '',
  });
  const [selectedClasses, setSelectedClasses] = useState(['I','II','III','IV','V','VI','VII','VIII','IX','X']);

  // Subject Schedule (per class)
  const [activeClassTab, setActiveClassTab] = useState('I');
  // classSchedules: { [className]: subjectRow[] }
  const [classSchedules, setClassSchedules] = useState(() => {
    const init = {};
    ALL_CLASSES.forEach(c => { init[c] = buildDefaultSchedule(SUBJECTS_DEFAULT); });
    return init;
  });
  const [copyToAll, setCopyToAll] = useState(false);

  // Grade Config
  const [gradeOpen, setGradeOpen] = useState(false);
  const [grades, setGrades] = useState(DEFAULT_GRADES);

  const [saving, setSaving] = useState(false);

  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const toggleClass = (cls) => {
    setSelectedClasses(prev => {
      if (prev.includes(cls)) {
        const next = prev.filter(c => c !== cls);
        if (activeClassTab === cls && next.length) setActiveClassTab(next[0]);
        return next;
      }
      if (!prev.includes(cls)) setActiveClassTab(cls);
      return [...prev, cls];
    });
  };

  const updateScheduleRow = (cls, rowIdx, field, value) => {
    setClassSchedules(prev => {
      const updated = prev[cls].map((r, i) => i === rowIdx ? { ...r, [field]: value } : r);
      if (copyToAll) {
        const all = { ...prev };
        selectedClasses.forEach(c => { all[c] = prev[c].map((r, i) => i === rowIdx ? { ...r, [field]: value } : r); });
        return all;
      }
      return { ...prev, [cls]: updated };
    });
  };

  const addSubjectRow = (cls) => {
    setClassSchedules(prev => ({
      ...prev,
      [cls]: [...(prev[cls] || []), { subject: '', date: '', time: '10:00 AM', max_theory: 100, max_practical: 0, pass_marks: 33 }]
    }));
  };

  const removeSubjectRow = (cls, rowIdx) => {
    setClassSchedules(prev => ({
      ...prev,
      [cls]: prev[cls].filter((_, i) => i !== rowIdx)
    }));
  };

  const updateGrade = (idx, field, value) => {
    setGrades(prev => prev.map((g, i) => i === idx ? { ...g, [field]: value } : g));
  };

  const addGradeRow = () => {
    setGrades(prev => [...prev, { grade: '', min: 0, max: 0, points: 0, remarks: '' }]);
  };

  const removeGradeRow = (idx) => {
    setGrades(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = (status) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      navigate('/examination');
    }, 1200);
  };

  const inputS = {
    width: '100%', height: 44, border: '1.5px solid #e2e8f0', borderRadius: 12,
    padding: '0 14px', fontSize: 14, fontWeight: 500, color: '#0f172a',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', background: '#fff',
  };
  const labelS = {
    fontSize: 12, fontWeight: 700, color: '#475569', display: 'block',
    marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em',
  };
  const sectionTitle = (title, sub) => (
    <div style={{ marginBottom: 20, paddingBottom: 14, borderBottom: '1.5px solid #f1f5f9' }}>
      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>{title}</h3>
      {sub && <p style={{ fontSize: 12, fontWeight: 500, color: '#94a3b8', margin: '4px 0 0' }}>{sub}</p>}
    </div>
  );

  const thS = { padding: '10px 12px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', background: '#fafbfc' };
  const tdS = { padding: '8px 12px', borderBottom: '1px solid #f1f5f9' };
  const cellInput = {
    height: 34, border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '0 10px',
    fontSize: 12, fontWeight: 600, color: '#0f172a', outline: 'none',
    fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', background: '#fff',
  };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.07 } } }} style={{ paddingBottom: 80, minWidth: 0 }}>

      {/* HEADER */}
      <motion.div variants={fade} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <button
          onClick={() => navigate('/examination')}
          style={{ width: 38, height: 38, borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
        >
          <ArrowLeft size={18} color="#64748b" />
        </button>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>Create New Examination</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4, fontWeight: 500 }}>Set up exam details and subject schedule</p>
        </div>
      </motion.div>

      {/* ══ SECTION 1 — BASIC DETAILS ══ */}
      <motion.div variants={fade} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: '28px 28px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: 20 }}>
        {sectionTitle('Basic Details', 'Fill in the exam name, type, and date range')}

        {/* Row 1: Name */}
        <div style={{ marginBottom: 18 }}>
          <label style={labelS}>Exam Name <span style={{ color: '#ef4444' }}>*</span></label>
          <input value={form.name} onChange={e => upd('name', e.target.value)} placeholder="e.g. Half Yearly Examination 2025-26" style={inputS} />
        </div>

        {/* Row 2: Academic Year + Exam Type */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
          <div>
            <label style={labelS}>Academic Year <span style={{ color: '#ef4444' }}>*</span></label>
            <select value={form.academic_year} onChange={e => upd('academic_year', e.target.value)} style={{ ...inputS, cursor: 'pointer' }}>
              <option value="2025-26">2025-26</option>
              <option value="2024-25">2024-25</option>
              <option value="2026-27">2026-27</option>
            </select>
          </div>
          <div>
            <label style={labelS}>Exam Type <span style={{ color: '#ef4444' }}>*</span></label>
            <select value={form.exam_type} onChange={e => upd('exam_type', e.target.value)} style={{ ...inputS, cursor: 'pointer' }}>
              {EXAM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>

        {/* Row 3: Start + End Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
          <div>
            <label style={labelS}>Start Date <span style={{ color: '#ef4444' }}>*</span></label>
            <input type="date" value={form.start_date} onChange={e => upd('start_date', e.target.value)} style={inputS} />
          </div>
          <div>
            <label style={labelS}>End Date <span style={{ color: '#ef4444' }}>*</span></label>
            <input type="date" value={form.end_date} onChange={e => upd('end_date', e.target.value)} style={inputS} />
          </div>
        </div>

        {/* Row 4: Classes Multi-select */}
        <div style={{ marginBottom: 18 }}>
          <label style={labelS}>Apply To (Classes) <span style={{ color: '#ef4444' }}>*</span></label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_CLASSES.map(cls => {
              const sel = selectedClasses.includes(cls);
              return (
                <button
                  key={cls} onClick={() => toggleClass(cls)}
                  style={{
                    padding: '7px 16px', borderRadius: 99, border: `2px solid ${sel ? '#2563eb' : '#e2e8f0'}`,
                    background: sel ? '#2563eb' : '#fff', color: sel ? '#fff' : '#475569',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                >
                  {cls}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 5: Result Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
          <div>
            <label style={labelS}>Result Declaration Date</label>
            <input type="date" value={form.result_date} onChange={e => upd('result_date', e.target.value)} style={inputS} />
          </div>
        </div>

        {/* Row 6: Description */}
        <div>
          <label style={labelS}>Description (Optional)</label>
          <textarea
            value={form.description} onChange={e => upd('description', e.target.value)}
            rows={2} placeholder="Add any notes about this exam..."
            style={{ ...inputS, height: 'auto', padding: '10px 14px', resize: 'vertical', minHeight: 64 }}
          />
        </div>
      </motion.div>

      {/* ══ SECTION 2 — SUBJECT SCHEDULE ══ */}
      <motion.div variants={fade} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: '28px 28px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: 20 }}>
        {sectionTitle('Subject-wise Schedule', 'Set date, time and max marks for each subject per class')}

        {selectedClasses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>
            Select at least one class above to configure the schedule.
          </div>
        ) : (
          <>
            {/* Class Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {selectedClasses.map(cls => (
                <button
                  key={cls} onClick={() => setActiveClassTab(cls)}
                  style={{
                    padding: '7px 16px', borderRadius: 99,
                    border: `2px solid ${activeClassTab === cls ? '#2563eb' : '#e2e8f0'}`,
                    background: activeClassTab === cls ? '#eff6ff' : '#fff',
                    color: activeClassTab === cls ? '#2563eb' : '#64748b',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                >
                  Class {cls}
                </button>
              ))}
            </div>

            {/* Copy to all checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div
                onClick={() => setCopyToAll(!copyToAll)}
                style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${copyToAll ? '#2563eb' : '#cbd5e1'}`, background: copyToAll ? '#2563eb' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.12s', flexShrink: 0 }}
              >
                {copyToAll && <span style={{ color: '#fff', fontSize: 11, fontWeight: 900, lineHeight: 1 }}>✓</span>}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#475569', cursor: 'pointer' }} onClick={() => setCopyToAll(!copyToAll)}>
                <Copy size={12} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                Copy schedule to all selected classes
              </span>
            </div>

            {/* Subject Schedule Table */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #e2e8f0' }}>
                    <th style={thS}>Subject</th>
                    <th style={thS}>Exam Date</th>
                    <th style={thS}>Time</th>
                    <th style={thS}>Max Theory</th>
                    <th style={thS}>Max Practical</th>
                    <th style={thS}>Pass Marks</th>
                    <th style={thS}></th>
                  </tr>
                </thead>
                <tbody>
                  {(classSchedules[activeClassTab] || []).map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                      <td style={tdS}>
                        <input value={row.subject} placeholder="e.g. Science" onChange={e => updateScheduleRow(activeClassTab, i, 'subject', e.target.value)} style={{ ...cellInput, width: 140, fontWeight: 700 }} />
                      </td>
                      <td style={tdS}>
                        <input type="date" value={row.date} onChange={e => updateScheduleRow(activeClassTab, i, 'date', e.target.value)} style={{ ...cellInput, width: 140 }} />
                      </td>
                      <td style={tdS}>
                        <select value={row.time} onChange={e => updateScheduleRow(activeClassTab, i, 'time', e.target.value)} style={{ ...cellInput, width: 120, cursor: 'pointer' }}>
                          {TIMES.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </td>
                      <td style={tdS}>
                        <input type="number" value={row.max_theory} min={0} onChange={e => updateScheduleRow(activeClassTab, i, 'max_theory', e.target.value)} style={{ ...cellInput, width: 80 }} />
                      </td>
                      <td style={tdS}>
                        <input type="number" value={row.max_practical} min={0} onChange={e => updateScheduleRow(activeClassTab, i, 'max_practical', e.target.value)} style={{ ...cellInput, width: 80 }} />
                      </td>
                      <td style={tdS}>
                        <input type="number" value={row.pass_marks} min={0} onChange={e => updateScheduleRow(activeClassTab, i, 'pass_marks', e.target.value)} style={{ ...cellInput, width: 80 }} />
                      </td>
                      <td style={tdS}>
                        <button onClick={() => removeSubjectRow(activeClassTab, i)} style={{ width: 28, height: 28, borderRadius: 7, border: '1.5px solid #fecaca', background: '#fef2f2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Trash2 size={12} color="#ef4444" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => addSubjectRow(activeClassTab)}
              style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1.5px dashed #cbd5e1', background: '#fff', fontSize: 12, fontWeight: 700, color: '#64748b', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <Plus size={13} /> Add Subject
            </button>
          </>
        )}
      </motion.div>

      {/* ══ SECTION 3 — GRADE CONFIGURATION ══ */}
      <motion.div variants={fade} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: 24 }}>
        {/* Collapsible header */}
        <button
          onClick={() => setGradeOpen(!gradeOpen)}
          style={{ width: '100%', padding: '22px 28px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'inherit' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings size={18} color="#64748b" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>Grade Configuration</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#94a3b8', marginTop: 2 }}>Configure grade boundaries and points</div>
            </div>
          </div>
          {gradeOpen ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
        </button>

        <AnimatePresence>
          {gradeOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden', borderTop: '1px solid #f1f5f9', padding: '0 28px 24px' }}
            >
              <div style={{ marginTop: 20, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#fafbfc', borderBottom: '1.5px solid #e2e8f0' }}>
                      {['GRADE','MIN MARKS','MAX MARKS','GRADE POINTS','REMARKS',''].map(h => (
                        <th key={h} style={thS}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((g, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={tdS}><input value={g.grade}   onChange={e => updateGrade(i,'grade',e.target.value)}   style={{ ...cellInput, width: 60, fontWeight: 800 }} /></td>
                        <td style={tdS}><input type="number" value={g.min} onChange={e => updateGrade(i,'min',e.target.value)} style={{ ...cellInput, width: 80 }} /></td>
                        <td style={tdS}><input type="number" value={g.max} onChange={e => updateGrade(i,'max',e.target.value)} style={{ ...cellInput, width: 80 }} /></td>
                        <td style={tdS}><input type="number" value={g.points} onChange={e => updateGrade(i,'points',e.target.value)} style={{ ...cellInput, width: 80 }} /></td>
                        <td style={tdS}><input value={g.remarks} onChange={e => updateGrade(i,'remarks',e.target.value)} style={{ ...cellInput, width: 120 }} /></td>
                        <td style={tdS}>
                          <button onClick={() => removeGradeRow(i)} style={{ width: 28, height: 28, borderRadius: 7, border: '1.5px solid #fecaca', background: '#fef2f2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={12} color="#ef4444" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={addGradeRow}
                style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1.5px dashed #cbd5e1', background: '#fff', fontSize: 12, fontWeight: 700, color: '#64748b', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <Plus size={13} /> Add Grade Row
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ══ BOTTOM ACTION BAR ══ */}
      <motion.div variants={fade} style={{ position: 'fixed', bottom: 0, left: 260, right: 0, background: '#fff', borderTop: '1px solid #e2e8f0', padding: '16px 32px', display: 'flex', justifyContent: 'flex-end', gap: 12, zIndex: 50 }}>
        <button
          onClick={() => navigate('/examination')}
          style={{ height: 44, padding: '0 22px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 14, fontWeight: 700, color: '#64748b', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Cancel
        </button>
        <button
          onClick={() => handleSave('draft')}
          style={{ height: 44, padding: '0 22px', borderRadius: 12, border: '1.5px solid #2563eb', background: '#fff', fontSize: 14, fontWeight: 700, color: '#2563eb', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Save size={16} /> Save as Draft
        </button>
        <button
          onClick={() => handleSave('active')}
          disabled={saving}
          style={{ height: 44, padding: '0 24px', borderRadius: 12, border: 'none', background: saving ? '#94a3b8' : '#2563eb', fontSize: 14, fontWeight: 700, color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(37,99,235,0.35)', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}
        >
          {saving ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span> Saving...</> : <><Zap size={16} /> Save & Activate</>}
        </button>
      </motion.div>
    </motion.div>
  );
}
