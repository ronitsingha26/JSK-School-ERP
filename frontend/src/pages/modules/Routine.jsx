import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, Users, BookOpen, Printer, Pencil, Save, X,
  ChevronDown, Check, RotateCcw, Settings, ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  classes, sections, subjects, teachers, periods as initialPeriods,
  timetableData as initialTimetableData,
  getSubject, getTeacher, getSectionsForClass, getSubjectsForClass,
  getTeachersForSubject, DAYS,
} from '../../data/dummyData';

const fade = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

/* ── Get current day name ── */
const getCurrentDay = () => {
  const d = new Date().getDay();
  return DAYS[d === 0 ? 5 : d - 1]; // Sun→Sat, Mon=0
};

/* ── Get short date for day column header ── */
const getDayDate = (dayIdx) => {
  const today = new Date();
  const currentDayIdx = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const diff = dayIdx - currentDayIdx;
  const d = new Date(today);
  d.setDate(d.getDate() + diff);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};

export default function Routine() {
  const [selectedClassId, setSelectedClassId] = useState(4); // Class I
  const [selectedSectionId, setSelectedSectionId] = useState(1); // Section A
  const [viewMode, setViewMode] = useState('class'); // class | teacher
  const [selectedTeacherId, setSelectedTeacherId] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [timetable, setTimetable] = useState(initialTimetableData);
  const [periodsList, setPeriodsList] = useState(initialPeriods);
  const [editCell, setEditCell] = useState(null); // { day, periodId }
  const [editCellSubject, setEditCellSubject] = useState('');
  const [editCellTeacher, setEditCellTeacher] = useState('');
  const [showPeriodConfig, setShowPeriodConfig] = useState(false);

  const printRef = useRef(null);
  const currentDay = getCurrentDay();

  /* ── Available sections for selected class ── */
  const availableSections = useMemo(() => getSectionsForClass(selectedClassId), [selectedClassId]);

  /* ── Auto-select first section when class changes ── */
  const handleClassChange = (classId) => {
    setSelectedClassId(classId);
    const secs = getSectionsForClass(classId);
    if (secs.length > 0) setSelectedSectionId(secs[0].id);
    else setSelectedSectionId(null);
  };

  /* ── Get timetable key ── */
  const ttKey = `${selectedClassId}-${selectedSectionId}`;
  const currentTT = timetable[ttKey] || {};

  /* ── Stats ── */
  const classPeriods = periodsList.filter(p => p.type === 'class');
  const stats = [
    { label: 'Periods Per Day', value: classPeriods.length, icon: CalendarDays, color: '#2563eb', bg: '#dbeafe', sub: 'Mon to Sat' },
    { label: 'Teachers Assigned', value: teachers.length, icon: Users, color: '#059669', bg: '#d1fae5', sub: 'All active' },
    { label: 'Subjects Scheduled', value: subjects.length, icon: BookOpen, color: '#7c3aed', bg: '#ede9fe', sub: 'Across all classes' },
  ];

  /* ── Handle cell edit ── */
  const openCellEdit = (day, periodId) => {
    if (!isEditing) return;
    const cell = currentTT[day]?.[periodId];
    setEditCell({ day, periodId });
    setEditCellSubject(cell?.subjectId ? String(cell.subjectId) : '');
    setEditCellTeacher(cell?.teacherId ? String(cell.teacherId) : '');
  };

  const assignCell = () => {
    if (!editCellSubject) { toast.error('Select a subject'); return; }
    if (!editCellTeacher) { toast.error('Select a teacher'); return; }
    setTimetable(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (!updated[ttKey]) updated[ttKey] = {};
      if (!updated[ttKey][editCell.day]) updated[ttKey][editCell.day] = {};
      updated[ttKey][editCell.day][editCell.periodId] = {
        subjectId: Number(editCellSubject),
        teacherId: Number(editCellTeacher),
      };
      return updated;
    });
    setEditCell(null);
    toast.success('Period assigned!');
  };

  const clearCell = () => {
    setTimetable(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (updated[ttKey]?.[editCell.day]?.[editCell.periodId]) {
        delete updated[ttKey][editCell.day][editCell.periodId];
      }
      return updated;
    });
    setEditCell(null);
    toast.success('Period cleared');
  };

  /* ── Save / Discard editing ── */
  const saveEdits = () => {
    setIsEditing(false);
    setEditCell(null);
    toast.success('Timetable updated successfully!');
  };
  const discardEdits = () => {
    setTimetable(initialTimetableData);
    setIsEditing(false);
    setEditCell(null);
    toast('Changes discarded', { icon: '↩️' });
  };

  /* ── Print ── */
  const handlePrint = () => {
    window.print();
  };

  /* ── Class name display ── */
  const className = classes.find(c => c.id === selectedClassId)?.name || '';
  const sectionName = sections.find(s => s.id === selectedSectionId)?.name || '';

  /* ── Teacher View: build teacher's timetable ── */
  const teacherTT = useMemo(() => {
    if (viewMode !== 'teacher') return {};
    const result = {};
    DAYS.forEach(day => { result[day] = {}; });
    // Scan all class-section timetables
    Object.entries(timetable).forEach(([key, dayData]) => {
      const [clsId, secId] = key.split('-').map(Number);
      const cls = classes.find(c => c.id === clsId);
      const sec = sections.find(s => s.id === secId);
      if (!cls || !sec) return;
      Object.entries(dayData).forEach(([day, periods]) => {
        Object.entries(periods).forEach(([periodId, cell]) => {
          if (cell.teacherId === selectedTeacherId) {
            result[day][periodId] = {
              ...cell,
              className: cls.name,
              sectionName: sec.name,
            };
          }
        });
      });
    });
    return result;
  }, [viewMode, selectedTeacherId, timetable]);

  const selStyle = { height: 40, padding: '0 32px 0 12px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#475569', background: '#fff', outline: 'none', appearance: 'none', cursor: 'pointer', fontFamily: 'inherit' };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: .07 } } }} style={{ paddingBottom: 40, minWidth: 0 }}>

      {/* ═══ HEADER ═══ */}
      <motion.div variants={fade} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Routine & Timetable</h1>
          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 6, fontWeight: 500 }}>Class-wise weekly schedule · Academic Year 2025-26</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <button onClick={handlePrint} className="no-print" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 20px', borderRadius: 14, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 700, color: '#475569', cursor: 'pointer', transition: 'all 0.15s' }}>
            <Printer size={15} /> Print
          </button>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="no-print" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 14, padding: '11px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(37,99,235,0.3)' }}>
              <Pencil size={15} /> Edit Timetable
            </button>
          ) : (
            <>
              <button onClick={discardEdits} className="no-print" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 20px', borderRadius: 14, border: '1.5px solid #fca5a5', background: '#fef2f2', fontSize: 13, fontWeight: 700, color: '#dc2626', cursor: 'pointer' }}>
                <RotateCcw size={14} /> Discard
              </button>
              <button onClick={saveEdits} className="no-print" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 14, padding: '11px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(22,163,74,0.3)' }}>
                <Save size={15} /> Save Changes
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* ═══ STAT CARDS ═══ */}
      <motion.div variants={fade} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 20 }}>
        {stats.map(s => {
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

      {/* ═══ SELECTOR BAR ═══ */}
      <motion.div variants={fade} className="no-print" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '14px 18px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.03)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}>View Timetable For:</span>

        {viewMode === 'class' && (
          <>
            {/* Class */}
            <div style={{ position: 'relative' }}>
              <select value={selectedClassId} onChange={e => handleClassChange(Number(e.target.value))} style={{ ...selStyle, minWidth: 140 }}>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
            </div>

            {/* Section */}
            <div style={{ position: 'relative' }}>
              <select value={selectedSectionId || ''} onChange={e => setSelectedSectionId(Number(e.target.value))} style={{ ...selStyle, minWidth: 110 }}>
                {availableSections.length === 0 && <option value="">No sections</option>}
                {availableSections.map(s => <option key={s.id} value={s.id}>Section {s.name}</option>)}
              </select>
              <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
            </div>
          </>
        )}

        {viewMode === 'teacher' && (
          <div style={{ position: 'relative' }}>
            <select value={selectedTeacherId} onChange={e => setSelectedTeacherId(Number(e.target.value))} style={{ ...selStyle, minWidth: 180 }}>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
          </div>
        )}

        {/* View toggle */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 3 }}>
          <button onClick={() => setViewMode('class')} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', background: viewMode === 'class' ? '#fff' : 'transparent', color: viewMode === 'class' ? '#0f172a' : '#94a3b8', boxShadow: viewMode === 'class' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>
            <CalendarDays size={14} /> Class View
          </button>
          <button onClick={() => setViewMode('teacher')} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', background: viewMode === 'teacher' ? '#fff' : 'transparent', color: viewMode === 'teacher' ? '#0f172a' : '#94a3b8', boxShadow: viewMode === 'teacher' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>
            <Users size={14} /> Teacher View
          </button>
        </div>
      </motion.div>

      {/* ═══ TIMETABLE HEADING ═══ */}
      <motion.div variants={fade} style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
          {viewMode === 'class'
            ? `${className} – ${sectionName} · Academic Year 2025-26`
            : `${teachers.find(t => t.id === selectedTeacherId)?.name}'s Schedule · Academic Year 2025-26`
          }
          {isEditing && <span style={{ fontSize: 11, fontWeight: 800, color: '#d97706', background: '#fffbeb', padding: '3px 10px', borderRadius: 8, marginLeft: 10 }}>✏️ EDITING</span>}
        </p>
      </motion.div>

      {/* ═══ TIMETABLE GRID ═══ */}
      <motion.div ref={printRef} variants={fade} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>

        {/* Print header (hidden on screen) */}
        <div className="print-only" style={{ display: 'none', textAlign: 'center', padding: '20px 0 10px' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>JSK Educational Foundation</h2>
          <p style={{ fontSize: 14, color: '#64748b', margin: '4px 0 0' }}>
            {viewMode === 'class' ? `${className} – ${sectionName} Timetable` : `${teachers.find(t => t.id === selectedTeacherId)?.name}'s Schedule`} | Academic Year 2025-26
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
            <thead>
              <tr>
                <th style={{ width: 130, padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                  Period / Time
                </th>
                {DAYS.map((day, idx) => (
                  <th key={day} style={{
                    padding: '14px 12px', textAlign: 'center', fontSize: 12, fontWeight: 700, borderBottom: '1px solid #e2e8f0',
                    background: day === currentDay ? '#eff6ff' : '#f8fafc',
                    color: day === currentDay ? '#2563eb' : '#64748b',
                  }}>
                    <div>{day.slice(0, 3).toUpperCase()}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, marginTop: 2, color: day === currentDay ? '#2563eb' : '#94a3b8' }}>{getDayDate(idx)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periodsList.map((period) => {
                /* Break rows */
                if (period.isBreak) {
                  const breakStyles = {
                    assembly: { bg: '#fffbeb', color: '#92400e', emoji: '🏫', border: '#fde68a' },
                    break: period.name.toLowerCase().includes('lunch')
                      ? { bg: '#ecfdf5', color: '#065f46', emoji: '🍱', border: '#a7f3d0' }
                      : { bg: '#fff7ed', color: '#9a3412', emoji: '☕', border: '#fed7aa' },
                  };
                  const bs = breakStyles[period.type] || breakStyles.break;
                  return (
                    <tr key={period.id}>
                      <td colSpan={7} style={{ padding: '10px 0', textAlign: 'center', background: bs.bg, borderBottom: `1px solid ${bs.border}` }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: bs.color }}>
                          {bs.emoji} {period.name} — {period.startTime} to {period.endTime}
                        </span>
                      </td>
                    </tr>
                  );
                }

                /* Class period rows */
                return (
                  <tr key={period.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {/* Period info column */}
                    <td style={{ padding: '12px 16px', borderRight: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{period.name}</div>
                      <div style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8', marginTop: 2 }}>{period.startTime} – {period.endTime}</div>
                    </td>

                    {/* Day cells */}
                    {DAYS.map(day => {
                      const cellData = viewMode === 'class'
                        ? currentTT[day]?.[period.id]
                        : teacherTT[day]?.[period.id];

                      const subj = cellData ? getSubject(cellData.subjectId) : null;
                      const teacher = cellData ? getTeacher(cellData.teacherId) : null;
                      const isCurrentDay = day === currentDay;
                      const isCellEditing = editCell?.day === day && editCell?.periodId === period.id;

                      if (cellData && subj) {
                        return (
                          <td key={day}
                            onClick={() => openCellEdit(day, period.id)}
                            style={{
                              padding: 6, position: 'relative',
                              background: isCurrentDay ? '#fafbff' : 'transparent',
                              cursor: isEditing ? 'pointer' : 'default',
                            }}
                          >
                            <div style={{
                              padding: '10px 12px', borderRadius: 10,
                              borderLeft: `3px solid ${subj.color}`,
                              background: `${subj.color}08`,
                              transition: 'all 0.15s',
                              minHeight: 56,
                            }}
                              onMouseEnter={e => { if (isEditing) e.currentTarget.style.background = `${subj.color}15`; }}
                              onMouseLeave={e => { e.currentTarget.style.background = `${subj.color}08`; }}
                            >
                              {viewMode === 'teacher' && cellData.className && (
                                <div style={{ fontSize: 10, fontWeight: 700, color: '#7c3aed', marginBottom: 3 }}>
                                  {cellData.className} – {cellData.sectionName}
                                </div>
                              )}
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{subj.name}</div>
                              {viewMode === 'class' && teacher && (
                                <div style={{ fontSize: 11, fontWeight: 500, color: '#64748b', marginTop: 3 }}>{teacher.name}</div>
                              )}
                              <span style={{ display: 'inline-block', fontSize: 9, fontWeight: 800, color: subj.color, background: `${subj.color}15`, padding: '2px 6px', borderRadius: 4, marginTop: 4, fontFamily: 'monospace' }}>{subj.code}</span>
                            </div>

                            {/* Edit popover */}
                            {isCellEditing && <CellEditPopover
                              classId={selectedClassId}
                              subjectVal={editCellSubject}
                              teacherVal={editCellTeacher}
                              onSubjectChange={setEditCellSubject}
                              onTeacherChange={setEditCellTeacher}
                              onAssign={assignCell}
                              onClear={clearCell}
                              onClose={() => setEditCell(null)}
                            />}
                          </td>
                        );
                      }

                      /* Free period */
                      return (
                        <td key={day}
                          onClick={() => openCellEdit(day, period.id)}
                          style={{
                            padding: 6, position: 'relative',
                            background: isCurrentDay ? '#fafbff' : 'transparent',
                            cursor: isEditing ? 'pointer' : 'default',
                          }}
                        >
                          <div style={{
                            padding: '10px 12px', borderRadius: 10, border: '1.5px dashed #e2e8f0',
                            background: '#f8fafc', minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s',
                          }}
                            onMouseEnter={e => { if (isEditing) { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.background = '#eff6ff'; } }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                          >
                            <span style={{ fontSize: 11, fontWeight: 600, color: '#cbd5e1' }}>
                              {isEditing ? '+ Assign' : 'Free Period'}
                            </span>
                          </div>

                          {isCellEditing && <CellEditPopover
                            classId={selectedClassId}
                            subjectVal={editCellSubject}
                            teacherVal={editCellTeacher}
                            onSubjectChange={setEditCellSubject}
                            onTeacherChange={setEditCellTeacher}
                            onAssign={assignCell}
                            onClear={clearCell}
                            onClose={() => setEditCell(null)}
                          />}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Print footer */}
        <div className="print-only" style={{ display: 'none', textAlign: 'center', padding: '12px 0', borderTop: '1px solid #e2e8f0', fontSize: 11, color: '#94a3b8' }}>
          Generated on: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
        </div>
      </motion.div>

      {/* ═══ COLOR LEGEND ═══ */}
      <motion.div variants={fade} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '16px 20px', marginTop: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 10 }}>Subject Color Guide:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {subjects.map(subj => (
            <div key={subj.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: subj.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>{subj.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ═══ PERIOD CONFIGURATION ═══ */}
      <motion.div variants={fade} className="no-print" style={{ marginTop: 16 }}>
        <button onClick={() => setShowPeriodConfig(!showPeriodConfig)} style={{
          display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '14px 20px',
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: showPeriodConfig ? '16px 16px 0 0' : 16,
          fontSize: 13, fontWeight: 700, color: '#475569', cursor: 'pointer', transition: 'all 0.15s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        }}>
          <Settings size={15} />
          Period Configuration
          <ChevronRight size={14} style={{ marginLeft: 'auto', transform: showPeriodConfig ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
        </button>

        <AnimatePresence>
          {showPeriodConfig && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ background: '#fff', border: '1px solid #e2e8f0', borderTop: 'none', borderRadius: '0 0 16px 16px', overflow: 'hidden' }}
            >
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      {[['#', 50, 'center'], ['Period', 160, 'left'], ['Start Time', 120, 'left'], ['End Time', 120, 'left'], ['Duration', 100, 'center'], ['Type', 100, 'center']].map(([h, w, a]) => (
                        <th key={h} style={{ padding: '11px 14px', textAlign: a, fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', width: w }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {periodsList.map((p, idx) => {
                      const typeColor = p.type === 'class' ? { bg: '#dbeafe', text: '#2563eb' }
                        : p.type === 'assembly' ? { bg: '#fef3c7', text: '#d97706' }
                        : { bg: '#ffedd5', text: '#ea580c' };

                      // Calculate duration
                      const [sh, sm] = p.startTime.split(':').map(Number);
                      const [eh, em] = p.endTime.split(':').map(Number);
                      const dur = (eh * 60 + em) - (sh * 60 + sm);

                      return (
                        <tr key={p.id}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8faff'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          style={{ borderBottom: '1px solid #f8fafc', transition: 'background .12s' }}>
                          <td style={{ padding: '12px 14px', textAlign: 'center' }}><span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>{idx + 1}</span></td>
                          <td style={{ padding: '12px 14px' }}><span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{p.name}</span></td>
                          <td style={{ padding: '12px 14px' }}><span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{p.startTime}</span></td>
                          <td style={{ padding: '12px 14px' }}><span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{p.endTime}</span></td>
                          <td style={{ padding: '12px 14px', textAlign: 'center' }}><span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>{dur} min</span></td>
                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 8, background: typeColor.bg, color: typeColor.text, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{p.type}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ PRINT STYLES ═══ */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          [class*="sidebar"], header, nav, .navbar { display: none !important; }
          #main-content-area { margin-left: 0 !important; }
          main { padding: 0 !important; }
          table { font-size: 11px; }
          td, th { padding: 6px 8px !important; }
        }
      `}</style>
    </motion.div>
  );
}


/* ════════════════════════════════════════════
   CELL EDIT POPOVER
   ════════════════════════════════════════════ */
function CellEditPopover({ classId, subjectVal, teacherVal, onSubjectChange, onTeacherChange, onAssign, onClear, onClose }) {
  const availableSubjects = getSubjectsForClass(classId);
  const availableTeachers = subjectVal ? getTeachersForSubject(Number(subjectVal)) : [];

  return (
    <div onClick={e => e.stopPropagation()} style={{
      position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
      width: 260, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14,
      boxShadow: '0 8px 32px rgba(15,23,42,0.14)', padding: 14, zIndex: 40,
      animation: 'fadeInUp 0.15s ease-out',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>Assign Period</span>
        <button onClick={onClose} style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}><X size={12} /></button>
      </div>

      {/* Subject */}
      <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>Subject</label>
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <select value={subjectVal} onChange={e => { onSubjectChange(e.target.value); onTeacherChange(''); }}
          style={{ width: '100%', height: 36, padding: '0 28px 0 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#1e293b', outline: 'none', background: '#fff', fontFamily: 'inherit', appearance: 'none', cursor: 'pointer' }}>
          <option value="">Select subject...</option>
          {availableSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <ChevronDown size={12} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
      </div>

      {/* Teacher */}
      <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>Teacher</label>
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <select value={teacherVal} onChange={e => onTeacherChange(e.target.value)}
          disabled={!subjectVal}
          style={{ width: '100%', height: 36, padding: '0 28px 0 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#1e293b', outline: 'none', background: subjectVal ? '#fff' : '#f8fafc', fontFamily: 'inherit', appearance: 'none', cursor: subjectVal ? 'pointer' : 'not-allowed', opacity: subjectVal ? 1 : 0.5 }}>
          <option value="">Select teacher...</option>
          {availableTeachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <ChevronDown size={12} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onAssign} style={{ flex: 1, height: 34, borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <Check size={13} /> Assign
        </button>
        <button onClick={onClear} style={{ height: 34, padding: '0 14px', borderRadius: 8, border: '1.5px solid #fca5a5', background: '#fef2f2', color: '#dc2626', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          Clear
        </button>
      </div>
    </div>
  );
}
