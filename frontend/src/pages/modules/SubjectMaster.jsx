import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, CheckCircle, FlaskConical, GraduationCap,
  Plus, LayoutGrid, List, ChevronDown, X, Pencil, Trash2, Eye,
  Calculator, Globe, Monitor, Palette, Trophy, Lightbulb, Scroll,
  BookPlus, AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  subjects as initialSubjects, classes, teachers,
  CATEGORY_COLORS, COLOR_SWATCHES, SUBJECT_ICON_OPTIONS,
} from '../../data/dummyData';

/* ── Icon map ── */
const ICON_MAP = { BookOpen, Calculator, FlaskConical, Globe, Monitor, Palette, Trophy, Lightbulb, Scroll };

const fade = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
const CATEGORIES = ['All Categories', 'Language', 'Science', 'Humanities', 'Technology', 'Arts', 'Sports', 'General'];

export default function SubjectMaster() {
  const [subjectsList, setSubjectsList] = useState(initialSubjects);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [viewMode, setViewMode] = useState('grid'); // grid | list
  const [modalOpen, setModalOpen] = useState(false);
  const [editSubject, setEditSubject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  /* ── Stats ── */
  const stats = useMemo(() => ({
    total: subjectsList.length,
    core: subjectsList.filter(s => s.isCore).length,
    practical: subjectsList.filter(s => s.hasPractical).length,
    classesCovered: classes.length,
  }), [subjectsList]);

  /* ── Filter ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return subjectsList.filter(s => {
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q);
      const matchCat = category === 'All Categories' || s.category === category;
      return matchSearch && matchCat;
    });
  }, [subjectsList, search, category]);

  /* ── CRUD ── */
  const handleSave = (subj) => {
    if (editSubject) {
      setSubjectsList(prev => prev.map(s => s.id === subj.id ? subj : s));
      toast.success('Subject updated successfully!');
    } else {
      const newId = Math.max(...subjectsList.map(s => s.id), 0) + 1;
      setSubjectsList(prev => [...prev, { ...subj, id: newId }]);
      toast.success('Subject added successfully!');
    }
    setModalOpen(false);
    setEditSubject(null);
  };

  const handleDelete = () => {
    setSubjectsList(prev => prev.filter(s => s.id !== deleteTarget.id));
    toast.success('Subject deleted successfully!');
    setDeleteTarget(null);
  };

  const openEdit = (subj) => { setEditSubject(subj); setModalOpen(true); };
  const openAdd = () => { setEditSubject(null); setModalOpen(true); };

  const selStyle = { height: 40, padding: '0 32px 0 12px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#475569', background: '#fff', outline: 'none', appearance: 'none', cursor: 'pointer', fontFamily: 'inherit' };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: .07 } } }} style={{ paddingBottom: 40, minWidth: 0 }}>

      {/* ═══ HEADER ═══ */}
      <motion.div variants={fade} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Subject Master</h1>
          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 6, fontWeight: 500 }}>Manage all subjects and class-wise mapping · 2025-26</p>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 14, padding: '11px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(37,99,235,0.3)', flexShrink: 0 }}>
          <BookPlus size={16} /> Add Subject
        </button>
      </motion.div>

      {/* ═══ STAT CARDS ═══ */}
      <motion.div variants={fade} style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Total Subjects', value: stats.total, icon: BookOpen, color: '#2563eb', bg: '#dbeafe', sub: 'Across all classes' },
          { label: 'Core Subjects', value: stats.core, icon: CheckCircle, color: '#059669', bg: '#d1fae5', sub: 'Compulsory' },
          { label: 'With Practical', value: stats.practical, icon: FlaskConical, color: '#7c3aed', bg: '#ede9fe', sub: 'Theory + Practical' },
          { label: 'Classes Covered', value: stats.classesCovered, icon: GraduationCap, color: '#ea580c', bg: '#ffedd5', sub: 'Nursery to Class X' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: '22px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 18, borderTop: `3px solid ${s.color}` }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={24} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
                <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 2 }}>{s.sub}</div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* ═══ FILTERS ═══ */}
      <motion.div variants={fade} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '14px 18px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.03)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 180 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search subjects..."
            style={{ width: '100%', height: 40, paddingLeft: 36, paddingRight: search ? 32 : 12, border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 500, color: '#1e293b', outline: 'none', background: '#f8fafc', fontFamily: 'inherit', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = '#2563eb'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
          {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#94a3b8', display: 'flex' }}><X size={14} /></button>}
        </div>

        {/* Category */}
        <div style={{ position: 'relative' }}>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...selStyle, minWidth: 160 }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 3 }}>
          <button onClick={() => setViewMode('grid')} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', background: viewMode === 'grid' ? '#fff' : 'transparent', color: viewMode === 'grid' ? '#0f172a' : '#94a3b8', boxShadow: viewMode === 'grid' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>
            <LayoutGrid size={14} /> Grid
          </button>
          <button onClick={() => setViewMode('list')} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', background: viewMode === 'list' ? '#fff' : 'transparent', color: viewMode === 'list' ? '#0f172a' : '#94a3b8', boxShadow: viewMode === 'list' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>
            <List size={14} /> List
          </button>
        </div>
      </motion.div>

      {/* ═══ GRID VIEW ═══ */}
      {viewMode === 'grid' && (
        <motion.div variants={fade} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {filtered.length === 0 ? (
            <div style={{ gridColumn: '1/-1', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: '60px 0', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><BookOpen size={26} color="#cbd5e1" /></div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#94a3b8', margin: 0 }}>No subjects found</p>
              <p style={{ fontSize: 13, color: '#cbd5e1', marginTop: 6 }}>Try clearing filters</p>
            </div>
          ) : filtered.map(subj => <SubjectCard key={subj.id} subj={subj} onEdit={() => openEdit(subj)} onDelete={() => setDeleteTarget(subj)} onToggleExpand={() => setExpandedId(expandedId === subj.id ? null : subj.id)} isExpanded={expandedId === subj.id} />)}
        </motion.div>
      )}

      {/* ═══ LIST VIEW ═══ */}
      {viewMode === 'list' && (
        <motion.div variants={fade} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 22px', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}><span style={{ color: '#0f172a' }}>{filtered.length}</span> subjects found</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {[['#', 44, 'center'], ['Subject', 220, 'left'], ['Code', 90, 'left'], ['Category', 120, 'left'], ['Classes', 110, 'left'], ['Marks', 120, 'left'], ['Type', 100, 'left'], ['Actions', 100, 'center']].map(([h, w, a]) => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: a, fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap', width: w }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding: '60px 0', textAlign: 'center' }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><BookOpen size={26} color="#cbd5e1" /></div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#94a3b8', margin: 0 }}>No subjects found</p>
                  </td></tr>
                ) : filtered.map((subj, idx) => {
                  const Icon = ICON_MAP[subj.icon] || BookOpen;
                  const catColor = CATEGORY_COLORS[subj.category] || CATEGORY_COLORS.General;
                  const marksStr = [subj.hasTheory ? `${subj.theoryMaxMarks}T` : null, subj.hasPractical ? `${subj.practicalMaxMarks}P` : null].filter(Boolean).join(' + ');
                  return (
                    <tr key={subj.id}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8faff'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      style={{ borderBottom: '1px solid #f8fafc', transition: 'background .12s' }}>
                      <td style={{ padding: '13px 14px', textAlign: 'center' }}><span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>{idx + 1}</span></td>
                      <td style={{ padding: '13px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                          <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${subj.color}18` }}>
                            <Icon size={17} color={subj.color} />
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap' }}>{subj.name}</div>
                            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{subj.description}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '13px 14px' }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#2563eb', background: '#eff6ff', padding: '5px 10px', borderRadius: 8, whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{subj.code}</span>
                      </td>
                      <td style={{ padding: '13px 14px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: catColor.bg, color: catColor.text, border: `1px solid ${catColor.border}` }}>{subj.category}</span>
                      </td>
                      <td style={{ padding: '13px 14px' }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>{subj.classIds.length} classes</span>
                      </td>
                      <td style={{ padding: '13px 14px' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{marksStr}</span>
                      </td>
                      <td style={{ padding: '13px 14px' }}>
                        {subj.isCore ? (
                          <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 8, background: '#dbeafe', color: '#2563eb' }}>CORE</span>
                        ) : (
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }}>ELECTIVE</span>
                        )}
                      </td>
                      <td style={{ padding: '13px 14px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                          {[
                            { I: Eye, c: '#2563eb', bg: '#eff6ff', fn: () => setExpandedId(expandedId === subj.id ? null : subj.id) },
                            { I: Pencil, c: '#d97706', bg: '#fffbeb', fn: () => openEdit(subj) },
                            { I: Trash2, c: '#dc2626', bg: '#fef2f2', fn: () => setDeleteTarget(subj) },
                          ].map(({ I, c, bg, fn }, i) => (
                            <button key={i} onClick={fn} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', transition: 'all .12s' }}
                              onMouseEnter={e => { e.currentTarget.style.background = bg; e.currentTarget.style.color = c; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#cbd5e1'; }}>
                              <I size={14} />
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* ═══ DETAIL PANEL (expanded) ═══ */}
      <AnimatePresence>
        {expandedId && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginTop: 16 }}>
            <SubjectDetail subj={subjectsList.find(s => s.id === expandedId)} onClose={() => setExpandedId(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ ADD/EDIT MODAL ═══ */}
      <AnimatePresence>
        {modalOpen && (
          <SubjectModal
            subject={editSubject}
            onSave={handleSave}
            onClose={() => { setModalOpen(false); setEditSubject(null); }}
          />
        )}
      </AnimatePresence>

      {/* ═══ DELETE MODAL ═══ */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}
            onClick={() => setDeleteTarget(null)}>
            <motion.div initial={{ scale: .9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .9, opacity: 0 }} transition={{ duration: .2, ease: [.16, 1, .3, 1] }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#fff', borderRadius: 24, padding: 32, width: '100%', maxWidth: 400, textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.15)' }}>
              <div style={{ width: 60, height: 60, borderRadius: 18, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <AlertTriangle size={28} color="#dc2626" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Delete Subject?</h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 24px', lineHeight: 1.7 }}>
                <strong style={{ color: '#1e293b' }}>{deleteTarget.name}</strong> ({deleteTarget.code})<br />
                will be permanently removed from all classes.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setDeleteTarget(null)} style={{ flex: 1, height: 44, borderRadius: 14, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 14, fontWeight: 700, color: '#475569', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleDelete} style={{ flex: 1, height: 44, borderRadius: 14, border: 'none', background: '#dc2626', fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer', boxShadow: '0 4px 14px rgba(220,38,38,0.3)' }}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


/* ════════════════════════════════════════════
   SUBJECT CARD (Grid View)
   ════════════════════════════════════════════ */
function SubjectCard({ subj, onEdit, onDelete, onToggleExpand, isExpanded }) {
  const [hov, setHov] = useState(false);
  const Icon = ICON_MAP[subj.icon] || BookOpen;
  const catColor = CATEGORY_COLORS[subj.category] || CATEGORY_COLORS.General;
  const classNames = subj.classIds.map(id => classes.find(c => c.id === id)?.name).filter(Boolean);

  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18,
        boxShadow: hov ? '0 8px 28px rgba(0,0,0,0.08)' : '0 1px 4px rgba(0,0,0,0.04)',
        overflow: 'hidden', transition: 'all 0.2s', transform: hov ? 'translateY(-2px)' : 'none',
        position: 'relative',
      }}
    >
      {/* Color bar */}
      <div style={{ height: 4, background: subj.color }} />

      <div style={{ padding: '20px 22px' }}>
        {/* Icon + Badge row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: `${subj.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={22} color={subj.color} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {subj.isCore ? (
              <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 8, background: '#dbeafe', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Core</span>
            ) : (
              <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Elective</span>
            )}
            <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: catColor.bg, color: catColor.text, border: `1px solid ${catColor.border}` }}>{subj.category}</span>
          </div>
        </div>

        {/* Name + Code */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>{subj.name}</h3>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: 6, fontFamily: 'monospace' }}>{subj.code}</span>
        </div>
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px', fontWeight: 500 }}>{subj.description}</p>

        {/* Marks */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          {subj.hasTheory && (
            <div style={{ flex: 1, background: '#f8fafc', borderRadius: 10, padding: '10px 12px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Theory</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>{subj.theoryMaxMarks} <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>marks</span></div>
            </div>
          )}
          {subj.hasPractical && (
            <div style={{ flex: 1, background: '#f8fafc', borderRadius: 10, padding: '10px 12px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Practical</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>{subj.practicalMaxMarks} <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>marks</span></div>
            </div>
          )}
          {!subj.hasTheory && !subj.hasPractical && (
            <div style={{ flex: 1, background: '#f8fafc', borderRadius: 10, padding: '10px 12px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>No marks configured</div>
            </div>
          )}
        </div>

        {/* Class pills */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Classes</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {classNames.slice(0, 5).map(cn => (
              <span key={cn} style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 6, background: '#f1f5f9', color: '#374151' }}>{cn}</span>
            ))}
            {classNames.length > 5 && (
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: `${subj.color}12`, color: subj.color }}>+{classNames.length - 5} more</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
          <button onClick={onToggleExpand} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 36, borderRadius: 10, border: '1.5px solid #e2e8f0', background: isExpanded ? '#eff6ff' : '#fff', fontSize: 12, fontWeight: 700, color: isExpanded ? '#2563eb' : '#64748b', cursor: 'pointer', transition: 'all 0.15s' }}>
            <Eye size={13} /> {isExpanded ? 'Hide' : 'View'}
          </button>
          <button onClick={onEdit} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 36, borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 12, fontWeight: 700, color: '#d97706', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#fffbeb'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
            <Pencil size={13} /> Edit
          </button>
          <button onClick={onDelete} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 36, borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 12, fontWeight: 700, color: '#dc2626', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}


/* ════════════════════════════════════════════
   SUBJECT DETAIL (Expanded Panel)
   ════════════════════════════════════════════ */
function SubjectDetail({ subj, onClose }) {
  if (!subj) return null;
  const Icon = ICON_MAP[subj.icon] || BookOpen;
  const assignedTeachers = teachers.filter(t => t.subjectIds.includes(subj.id));
  const classNames = subj.classIds.map(id => classes.find(c => c.id === id)).filter(Boolean);

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: `${subj.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={22} color={subj.color} />
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>{subj.name} <span style={{ fontSize: 12, fontWeight: 800, color: '#2563eb', background: '#eff6ff', padding: '3px 8px', borderRadius: 6, fontFamily: 'monospace', marginLeft: 8 }}>{subj.code}</span></h3>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{subj.description}</p>
          </div>
        </div>
        <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
          <X size={16} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Classes */}
        <div>
          <h4 style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Assigned Classes ({classNames.length})</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {classNames.map(cls => (
              <div key={cls.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px 14px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{cls.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Teachers */}
        <div>
          <h4 style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Teachers ({assignedTeachers.length})</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {assignedTeachers.length === 0 ? (
              <span style={{ fontSize: 12, color: '#cbd5e1' }}>No teachers assigned</span>
            ) : assignedTeachers.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px 14px' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontSize: 10, fontWeight: 800 }}>{t.avatar}</span>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>{t.empId}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ════════════════════════════════════════════
   SUBJECT MODAL (Add/Edit — Slide-in from right)
   ════════════════════════════════════════════ */
function SubjectModal({ subject, onSave, onClose }) {
  const isEdit = !!subject;
  const [form, setForm] = useState({
    name: subject?.name || '',
    code: subject?.code || '',
    category: subject?.category || 'Language',
    description: subject?.description || '',
    color: subject?.color || COLOR_SWATCHES[0],
    icon: subject?.icon || 'BookOpen',
    isCore: subject?.isCore ?? true,
    hasTheory: subject?.hasTheory ?? true,
    hasPractical: subject?.hasPractical ?? false,
    theoryMaxMarks: subject?.theoryMaxMarks ?? 100,
    practicalMaxMarks: subject?.practicalMaxMarks ?? 0,
    classIds: subject?.classIds || [],
  });

  const update = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleSubmit = () => {
    if (!form.name.trim() || !form.code.trim()) {
      toast.error('Subject name and code are required');
      return;
    }
    onSave({ ...subject, ...form, id: subject?.id });
  };

  const toggleClass = (classId) => {
    setForm(p => ({
      ...p,
      classIds: p.classIds.includes(classId)
        ? p.classIds.filter(id => id !== classId)
        : [...p.classIds, classId],
    }));
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, backdropFilter: 'blur(4px)' }}
      />

      {/* Slide-in panel */}
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: 480,
          background: '#fff', zIndex: 51, boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>{isEdit ? 'Edit Subject' : 'Add New Subject'}</h2>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            <X size={16} />
          </button>
        </div>

        {/* Form body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 100px' }}>
          {/* Name */}
          <FieldLabel label="Subject Name" required />
          <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Mathematics" style={inputStyle} />

          {/* Code */}
          <FieldLabel label="Subject Code" required />
          <input value={form.code} onChange={e => update('code', e.target.value.toUpperCase())} placeholder="e.g. MATH" style={inputStyle} />
          <p style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0 16px', fontWeight: 500 }}>Will appear on reports and marksheets</p>

          {/* Category */}
          <FieldLabel label="Category" required />
          <div style={{ position: 'relative', marginBottom: 18 }}>
            <select value={form.category} onChange={e => update('category', e.target.value)} style={{ ...inputStyle, appearance: 'none', paddingRight: 36, cursor: 'pointer' }}>
              {['Language', 'Science', 'Humanities', 'Technology', 'Arts', 'Sports', 'General'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
          </div>

          {/* Description */}
          <FieldLabel label="Description" />
          <textarea value={form.description} onChange={e => update('description', e.target.value)} placeholder="Brief description..." rows={2} style={{ ...inputStyle, resize: 'vertical', padding: '10px 14px', height: 'auto' }} />

          {/* Color */}
          <FieldLabel label="Subject Color" />
          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            {COLOR_SWATCHES.map(c => (
              <button key={c} onClick={() => update('color', c)} style={{
                width: 34, height: 34, borderRadius: 10, border: form.color === c ? '2.5px solid #0f172a' : '2px solid #e2e8f0',
                background: c, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
              }}>
                {form.color === c && <CheckCircle size={16} color="#fff" />}
              </button>
            ))}
          </div>

          {/* Icon */}
          <FieldLabel label="Subject Icon" />
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
            {SUBJECT_ICON_OPTIONS.map(iconName => {
              const Ic = ICON_MAP[iconName] || BookOpen;
              return (
                <button key={iconName} onClick={() => update('icon', iconName)} style={{
                  width: 40, height: 40, borderRadius: 10,
                  border: form.icon === iconName ? `2px solid ${form.color}` : '1.5px solid #e2e8f0',
                  background: form.icon === iconName ? `${form.color}12` : '#f8fafc',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                }}>
                  <Ic size={18} color={form.icon === iconName ? form.color : '#94a3b8'} />
                </button>
              );
            })}
          </div>

          {/* Type */}
          <FieldLabel label="Type" />
          <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
            {[{ v: true, l: 'Core Subject' }, { v: false, l: 'Elective Subject' }].map(opt => (
              <button key={String(opt.v)} onClick={() => update('isCore', opt.v)} style={{
                flex: 1, height: 42, borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                border: form.isCore === opt.v ? '2px solid #2563eb' : '1.5px solid #e2e8f0',
                background: form.isCore === opt.v ? '#eff6ff' : '#fff',
                color: form.isCore === opt.v ? '#2563eb' : '#64748b',
              }}>
                {form.isCore === opt.v ? '● ' : '○ '}{opt.l}
              </button>
            ))}
          </div>

          {/* Marks Config */}
          <div style={{ background: '#f8fafc', borderRadius: 14, padding: '18px 18px', border: '1px solid #f1f5f9', marginBottom: 22 }}>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>Marks Configuration</h4>

            {/* Theory */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>Has Theory Exam</span>
              <ToggleSwitch checked={form.hasTheory} onChange={(v) => update('hasTheory', v)} />
            </div>
            {form.hasTheory && (
              <div style={{ marginBottom: 14, paddingLeft: 12 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>Max Marks</label>
                <input type="number" value={form.theoryMaxMarks} onChange={e => update('theoryMaxMarks', Number(e.target.value))} style={{ ...inputStyle, width: 100, marginTop: 4 }} />
              </div>
            )}

            {/* Practical */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>Has Practical Exam</span>
              <ToggleSwitch checked={form.hasPractical} onChange={(v) => update('hasPractical', v)} />
            </div>
            {form.hasPractical && (
              <div style={{ paddingLeft: 12 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>Max Marks</label>
                <input type="number" value={form.practicalMaxMarks} onChange={e => update('practicalMaxMarks', Number(e.target.value))} style={{ ...inputStyle, width: 100, marginTop: 4 }} />
              </div>
            )}
          </div>

          {/* Class Mapping */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <FieldLabel label="Assign to Classes" style={{ marginBottom: 0 }} />
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setForm(p => ({ ...p, classIds: classes.map(c => c.id) }))} style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Select All</button>
                <button onClick={() => setForm(p => ({ ...p, classIds: [] }))} style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Clear All</button>
              </div>
            </div>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 10px', fontWeight: 500 }}>Select which classes study this subject</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {classes.map(cls => (
                <label key={cls.id} onClick={() => toggleClass(cls.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
                  border: form.classIds.includes(cls.id) ? '1.5px solid #2563eb' : '1.5px solid #e2e8f0',
                  background: form.classIds.includes(cls.id) ? '#eff6ff' : '#fff',
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 5,
                    border: form.classIds.includes(cls.id) ? '2px solid #2563eb' : '2px solid #cbd5e1',
                    background: form.classIds.includes(cls.id) ? '#2563eb' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {form.classIds.includes(cls.id) && <CheckCircle size={12} color="#fff" />}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: form.classIds.includes(cls.id) ? '#1e293b' : '#64748b' }}>{cls.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', gap: 12, flexShrink: 0, background: '#fff' }}>
          <button onClick={onClose} style={{ flex: 1, height: 46, borderRadius: 14, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 14, fontWeight: 700, color: '#475569', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} style={{ flex: 1, height: 46, borderRadius: 14, border: 'none', background: '#2563eb', fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer', boxShadow: '0 4px 16px rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            Save Subject →
          </button>
        </div>
      </motion.div>
    </>
  );
}


/* ══ Reusable Components ══ */

function FieldLabel({ label, required, style: s }) {
  return (
    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, ...s }}>
      {label}{required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
    </label>
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} style={{
      width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
      background: checked ? '#2563eb' : '#e2e8f0',
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, transition: 'left 0.2s',
        left: checked ? 23 : 3, boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

const inputStyle = {
  width: '100%', height: 42, padding: '0 14px',
  border: '1.5px solid #e2e8f0', borderRadius: 10,
  fontSize: 13, fontWeight: 500, color: '#1e293b',
  outline: 'none', background: '#fff', fontFamily: 'inherit',
  boxSizing: 'border-box', marginBottom: 16,
  transition: 'border-color 0.15s',
};
