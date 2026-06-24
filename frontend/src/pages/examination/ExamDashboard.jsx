import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList, CheckCircle, Clock, Calendar, Plus,
  Search, Eye, Edit2, BarChart2, Trash2, ArrowRight,
  Zap, AlertCircle
} from 'lucide-react';

/* ── Sample Data (replace with API calls) ── */
const SAMPLE_EXAMS = [
  {
    id: 1,
    name: 'Unit Test 1',
    academic_year: '2025-26',
    exam_type: 'unit_test',
    start_date: '2026-02-10',
    end_date: '2026-02-14',
    apply_to_classes: ['I','II','III','IV','V','VI','VII','VIII','IX','X'],
    subjects_count: 5,
    marks_done: 10,
    marks_total: 10,
    status: 'completed',
    result: 'declared',
  },
  {
    id: 2,
    name: 'Half Yearly Exam',
    academic_year: '2025-26',
    exam_type: 'half_yearly',
    start_date: '2026-05-12',
    end_date: '2026-05-20',
    apply_to_classes: ['I','II','III','IV','V','VI','VII','VIII','IX','X'],
    subjects_count: 5,
    marks_done: 8,
    marks_total: 10,
    status: 'active',
    result: 'pending',
  },
  {
    id: 3,
    name: 'Unit Test 2',
    academic_year: '2025-26',
    exam_type: 'unit_test',
    start_date: '2026-08-01',
    end_date: '2026-08-05',
    apply_to_classes: ['I','II','III','IV','V','VI','VII','VIII','IX','X'],
    subjects_count: 5,
    marks_done: 0,
    marks_total: 10,
    status: 'upcoming',
    result: 'none',
  },
  {
    id: 4,
    name: 'Annual Exam',
    academic_year: '2025-26',
    exam_type: 'annual',
    start_date: '2026-11-15',
    end_date: '2026-11-25',
    apply_to_classes: ['I','II','III','IV','V','VI','VII','VIII','IX','X'],
    subjects_count: 5,
    marks_done: 0,
    marks_total: 10,
    status: 'upcoming',
    result: 'none',
  },
];

const fade = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const STATUS_CONFIG = {
  active:    { label: 'ONGOING',   color: '#059669', bg: '#ecfdf5', dot: true },
  completed: { label: 'COMPLETED', color: '#64748b', bg: '#f1f5f9', dot: false },
  upcoming:  { label: 'UPCOMING',  color: '#2563eb', bg: '#eff6ff', dot: false },
  draft:     { label: 'DRAFT',     color: '#d97706', bg: '#fffbeb', dot: false },
};

const TYPE_LABEL = {
  unit_test:   'Unit Test',
  half_yearly: 'Half Yearly',
  annual:      'Annual',
  pre_board:   'Pre-Board',
  custom:      'Custom',
};

const COLORS = [
  ['#3b82f6','#1d4ed8'], ['#8b5cf6','#6d28d9'], ['#10b981','#059669'],
  ['#f59e0b','#d97706'], ['#ef4444','#dc2626'], ['#06b6d4','#0891b2'],
];

const avatarBg = (id) => {
  const [a, b] = COLORS[id % COLORS.length];
  return `linear-gradient(135deg,${a},${b})`;
};

const initials = (name) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

export default function ExamDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [exams]  = useState(SAMPLE_EXAMS);
  const [hoverRow, setHoverRow] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const ongoing   = exams.find(e => e.status === 'active');
  const completed = exams.filter(e => e.status === 'completed').length;
  const upcoming  = exams.filter(e => e.status === 'upcoming').length;

  const filtered = exams.filter(e =>
    !search ||
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    TYPE_LABEL[e.exam_type].toLowerCase().includes(search.toLowerCase())
  );

  const fmtDate = (d) => {
    if (!d) return '—';
    const dt = new Date(d);
    return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const statsCards = [
    { label: 'TOTAL EXAMS',    value: exams.length, icon: ClipboardList, color: '#2563eb', bg: '#dbeafe', sub: 'Academic Year 2025-26' },
    { label: 'COMPLETED EXAMS', value: completed,   icon: CheckCircle,   color: '#059669', bg: '#d1fae5', sub: 'Results declared' },
    { label: 'ONGOING EXAM',    value: exams.filter(e => e.status === 'active').length, icon: Clock, color: '#d97706', bg: '#fef3c7', sub: ongoing ? `${ongoing.name} — ends ${fmtDate(ongoing.end_date)}` : 'None active' },
    { label: 'UPCOMING EXAM',   value: upcoming,    icon: Calendar,      color: '#7c3aed', bg: '#ede9fe', sub: 'Annual — starts 15 Nov' },
  ];

  return (
    <motion.div
      initial="hidden" animate="show"
      variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      style={{ paddingBottom: 40, minWidth: 0 }}
    >
      {/* ── HEADER ── */}
      <motion.div variants={fade} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>
            Examination Management
          </h1>
          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 6, fontWeight: 500 }}>
            Schedule exams, enter marks, and generate report cards · 2025-26
          </p>
        </div>
        <button
          onClick={() => navigate('/examination/create')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            height: 44, padding: '0 20px', borderRadius: 12, border: 'none',
            background: '#2563eb', color: '#fff', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
            boxShadow: '0 4px 14px rgba(37,99,235,0.35)', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.transform = 'none'; }}
        >
          <Plus size={18} /> Create Exam
        </button>
      </motion.div>

      {/* ── STAT CARDS ── */}
      <motion.div variants={fade} style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {statsCards.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18,
              padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              borderTop: `3px solid ${s.color}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
                <div style={{ width: 48, height: 48, borderRadius: 13, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={22} color={s.color} />
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', marginTop: 5, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginTop: 4, paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>{s.sub}</div>
            </div>
          );
        })}
      </motion.div>

      {/* ── ONGOING EXAM BANNER ── */}
      <AnimatePresence>
        {ongoing && (
          <motion.div
            variants={fade}
            style={{
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderLeft: '4px solid #10b981', borderRadius: 16,
              padding: '18px 24px', marginBottom: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Pulsing green dot */}
              <div style={{ position: 'relative', width: 12, height: 12, flexShrink: 0 }}>
                <div style={{
                  width: 12, height: 12, borderRadius: '50%', background: '#10b981',
                  animation: 'examPulse 1.5s ease-in-out infinite',
                }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: '#10b981', color: '#fff', letterSpacing: '0.05em' }}>LIVE</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#065f46' }}>{ongoing.name} {ongoing.academic_year}</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#047857', margin: 0 }}>
                  {fmtDate(ongoing.start_date)} – {fmtDate(ongoing.end_date)} &nbsp;|&nbsp; Classes {ongoing.apply_to_classes[0]} to {ongoing.apply_to_classes[ongoing.apply_to_classes.length - 1]}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/examination/marks')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                height: 40, padding: '0 18px', borderRadius: 10, border: 'none',
                background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
                boxShadow: '0 2px 10px rgba(37,99,235,0.3)',
              }}
            >
              Enter Marks <ArrowRight size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── EXAMS TABLE ── */}
      <motion.div variants={fade} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        {/* Table Header */}
        <div style={{ padding: '18px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>All Examinations</p>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search exams..."
              style={{ height: 38, paddingLeft: 36, paddingRight: 14, border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 500, color: '#0f172a', outline: 'none', fontFamily: 'inherit', width: 220 }}
            />
          </div>
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div style={{ padding: '60px 32px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <ClipboardList size={28} color="#94a3b8" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>No exams created yet</h3>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 20px' }}>Create your first exam to get started.</p>
            <button onClick={() => navigate('/examination/create')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 10, border: 'none', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              <Plus size={15} /> Create Exam
            </button>
          </div>
        )}

        {/* Table */}
        {filtered.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafbfc', borderBottom: '1.5px solid #e2e8f0' }}>
                  {['#','EXAM NAME','CLASSES','DATE RANGE','MARKS ENTRY','RESULTS','STATUS','ACTIONS'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((exam, idx) => {
                  const sc = STATUS_CONFIG[exam.status] || STATUS_CONFIG.draft;
                  const isHovered = hoverRow === exam.id;
                  const pct = exam.marks_total > 0 ? Math.round((exam.marks_done / exam.marks_total) * 100) : 0;

                  return (
                    <tr
                      key={exam.id}
                      onMouseEnter={() => setHoverRow(exam.id)}
                      onMouseLeave={() => setHoverRow(null)}
                      style={{ borderBottom: '1px solid #f1f5f9', background: isHovered ? '#fafbfe' : 'transparent', transition: 'background 0.15s', cursor: 'default' }}
                    >
                      {/* # */}
                      <td style={{ padding: '14px 14px', fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>{idx + 1}</td>

                      {/* EXAM NAME */}
                      <td style={{ padding: '14px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: avatarBg(exam.id), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                            {initials(exam.name)}
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{exam.name}</div>
                            <div style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8', marginTop: 2 }}>Academic Year {exam.academic_year}</div>
                          </div>
                        </div>
                      </td>

                      {/* CLASSES */}
                      <td style={{ padding: '14px 14px' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: '#f1f5f9', color: '#475569' }}>
                          {exam.apply_to_classes[0]} – {exam.apply_to_classes[exam.apply_to_classes.length - 1]}
                        </span>
                      </td>

                      {/* DATE RANGE */}
                      <td style={{ padding: '14px 14px', fontSize: 13, fontWeight: 600, color: '#475569', whiteSpace: 'nowrap' }}>
                        {fmtDate(exam.start_date)} – {fmtDate(exam.end_date)}
                      </td>

                      {/* MARKS ENTRY */}
                      <td style={{ padding: '14px 14px', minWidth: 140 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 5 }}>{exam.marks_done}/{exam.marks_total} classes done</div>
                        <div style={{ height: 6, borderRadius: 99, background: '#e2e8f0', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, borderRadius: 99, background: pct === 100 ? '#10b981' : '#2563eb', transition: 'width 0.4s' }} />
                        </div>
                      </td>

                      {/* RESULTS */}
                      <td style={{ padding: '14px 14px' }}>
                        {exam.result === 'declared' && (
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99, background: '#d1fae5', color: '#059669' }}>Declared</span>
                        )}
                        {exam.result === 'pending' && (
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99, background: '#fff7ed', color: '#d97706' }}>Pending</span>
                        )}
                        {exam.result === 'none' && (
                          <span style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 600 }}>—</span>
                        )}
                      </td>

                      {/* STATUS */}
                      <td style={{ padding: '14px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: sc.bg, border: `1px solid ${sc.color}22`, borderRadius: 99, padding: '4px 12px', width: 'fit-content' }}>
                          {sc.dot && (
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: sc.color, display: 'inline-block', animation: 'examPulse 1.5s ease-in-out infinite' }} />
                          )}
                          <span style={{ fontSize: 10, fontWeight: 800, color: sc.color, letterSpacing: '0.05em' }}>{sc.label}</span>
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td style={{ padding: '14px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: isHovered ? 1 : 0, transition: 'opacity 0.15s' }}>
                          <ActionIcon icon={Eye}     tip="View"        color="#2563eb" onClick={() => navigate(`/examination/${exam.id}`)} />
                          <ActionIcon icon={Edit2}   tip="Edit"        color="#7c3aed" onClick={() => navigate(`/examination/${exam.id}/edit`)} />
                          <ActionIcon icon={BarChart2} tip="Marks Entry" color="#059669" onClick={() => navigate('/examination/marks')} />
                          <ActionIcon icon={Trash2}  tip="Delete"      color="#ef4444" onClick={() => setDeleteId(exam.id)} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: '12px 22px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', margin: 0 }}>Showing {filtered.length} of {exams.length} exams</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <QuickLink label="Marks Entry" icon={Edit2} onClick={() => navigate('/examination/marks')} />
            <QuickLink label="Report Cards" icon={ClipboardList} onClick={() => navigate('/examination/reportcard')} />
            <QuickLink label="Analysis" icon={BarChart2} onClick={() => navigate('/examination/analysis')} />
          </div>
        </div>
      </motion.div>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: '#fff', borderRadius: 20, padding: '32px 36px', width: 400, boxShadow: '0 24px 64px rgba(0,0,0,0.18)', textAlign: 'center' }}
            >
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <AlertCircle size={28} color="#ef4444" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Delete Exam?</h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 24px' }}>This action cannot be undone. Only draft exams can be deleted.</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setDeleteId(null)} style={{ flex: 1, height: 42, borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 700, color: '#475569', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                <button onClick={() => setDeleteId(null)} style={{ flex: 1, height: 42, borderRadius: 10, border: 'none', background: '#ef4444', fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes examPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </motion.div>
  );
}

function ActionIcon({ icon: Icon, tip, color, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={tip} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 30, height: 30, borderRadius: 8, border: '1.5px solid',
        borderColor: hov ? color : '#e2e8f0',
        background: hov ? `${color}10` : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      <Icon size={14} color={hov ? color : '#94a3b8'} />
    </button>
  );
}

function QuickLink({ label, icon: Icon, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        height: 30, padding: '0 12px', borderRadius: 8,
        border: `1.5px solid ${hov ? '#2563eb' : '#e2e8f0'}`,
        background: hov ? '#eff6ff' : '#fff',
        fontSize: 11, fontWeight: 700, color: hov ? '#2563eb' : '#64748b',
        cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
      }}
    >
      <Icon size={12} /> {label}
    </button>
  );
}
