import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Users, UserCheck, UserX, BookOpen, Search, ChevronDown,
  LayoutList, LayoutGrid, UserPlus, Eye, Pencil, Trash2,
  Phone, ChevronLeft, ChevronRight, X, Download, RefreshCw,
  AlertTriangle, Building2
} from 'lucide-react';
import {
  teachersData, subjects, classes,
  departments, designations,
  getDepartment, getDesignation
} from '../../data/dummyData';

// ── Helpers ────────────────────────────────────────────────
const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

const StatusPill = ({ status, employment }) => {
  const map = {
    active:    { bg: '#d1fae5', color: '#065f46', dot: '#10b981', label: 'Active'    },
    'on-leave':{ bg: '#fef3c7', color: '#92400e', dot: '#f59e0b', label: 'On Leave'  },
    inactive:  { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444', label: 'Inactive'  },
  };
  const s = map[status] || map.inactive;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        background: s.bg, color: s.color,
        fontSize: 11, fontWeight: 600, borderRadius: 999,
        padding: '3px 10px', whiteSpace: 'nowrap'
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
        {s.label}
      </span>
      {employment === 'Contract' && (
        <span style={{
          fontSize: 10, fontWeight: 600, color: '#6b7280',
          border: '1px solid #d1d5db', borderRadius: 4, padding: '1px 6px'
        }}>CONTRACT</span>
      )}
    </div>
  );
};

const Avatar = ({ initials, color, size = 40 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%', flexShrink: 0,
    background: color + '33', color, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: size * 0.35, fontWeight: 700
  }}>{initials}</div>
);

// ── Skeleton Row ──────────────────────────────────────────
const SkeletonRow = () => (
  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
    {[60, 220, 100, 110, 110, 140, 110, 90, 80].map((w, i) => (
      <td key={i} style={{ padding: '14px 16px' }}>
        <div style={{
          width: w, height: 14, borderRadius: 6,
          background: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)',
          backgroundSize: '400% 100%', animation: 'shimmer 1.5s infinite'
        }} />
      </td>
    ))}
  </tr>
);

// ── Teacher Card (Grid View) ───────────────────────────────
const TeacherCard = ({ teacher, onView, onEdit, onDelete }) => {
  const dept = getDepartment(teacher.departmentId);
  const desig = getDesignation(teacher.designationId);
  const teacherSubjects = subjects.filter(s => teacher.subjectIds.includes(s.id));
  const teacherClasses = classes.filter(c => teacher.classIds.includes(c.id));
  const [hovered, setHovered] = useState(false);

  const joinFormatted = teacher.joinDate
    ? new Date(teacher.joinDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : '—';

  const classRange = teacherClasses.length
    ? `${teacherClasses[0].name} – ${teacherClasses[teacherClasses.length - 1].name}`
    : '—';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', borderRadius: 16, overflow: 'hidden',
        boxShadow: hovered ? '0 8px 25px rgba(0,0,0,0.10)' : '0 1px 4px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        transition: 'all 200ms ease',
        border: '1px solid #f1f5f9',
      }}
    >
      {/* Dept color bar */}
      <div style={{ height: 4, background: dept?.color || '#e2e8f0' }} />
      <div style={{ padding: 16 }}>
        {/* Row 1 */}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <Avatar initials={teacher.avatar} color={teacher.avatarColor} size={52} />
          <div style={{ marginLeft: 'auto' }}>
            <StatusPill status={teacher.status} employment={teacher.employmentType} />
          </div>
        </div>
        {/* Row 2 */}
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{teacher.name}</div>
          <span style={{
            display: 'inline-block', marginTop: 4,
            background: '#dbeafe', color: '#1e40af',
            fontSize: 11, fontWeight: 700, borderRadius: 999,
            padding: '2px 8px', fontFamily: 'monospace'
          }}>{teacher.empId}</span>
        </div>
        {/* Row 3 */}
        <div style={{ marginTop: 4, fontSize: 13, color: '#64748b' }}>{desig?.name || '—'}</div>
        <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '12px 0' }} />
        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { icon: '📚', label: teacherSubjects.slice(0, 2).map(s => s.name).join(', ') || '—' },
            { icon: '🏫', label: classRange },
            { icon: '📅', label: `Joined: ${joinFormatted}` },
            { icon: '🏢', label: dept?.name || '—' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#374151' }}>
              <span>{row.icon}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.label}</span>
            </div>
          ))}
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '12px 0' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151' }}>
          <Phone size={12} style={{ color: '#94a3b8' }} />
          {teacher.mobile}
        </div>
        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={() => onView(teacher.id)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            border: '1px solid #1e40af', color: '#1e40af', background: '#fff',
            borderRadius: 8, padding: '7px 0', fontSize: 12, fontWeight: 600, cursor: 'pointer'
          }}>
            <Eye size={13} /> View Profile
          </button>
          <button onClick={() => onEdit(teacher.id)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            border: '1px solid #e2e8f0', color: '#374151', background: '#fff',
            borderRadius: 8, padding: '7px 0', fontSize: 12, fontWeight: 600, cursor: 'pointer'
          }}>
            <Pencil size={13} /> Edit
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────
export default function Teacher() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('list');
  const [loading, setLoading] = useState(true);
  const [teacherList, setTeacherList] = useState(teachersData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ department: '', designation: '', status: '', employment: '' });
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const exportRef = useRef(null);

  // Skeleton loading on mount
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  // Close export dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) setShowExportMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Filtered list ──
  const filtered = teacherList.filter(t => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      t.name.toLowerCase().includes(q) ||
      t.empId.toLowerCase().includes(q) ||
      t.mobile.includes(q) ||
      t.email.toLowerCase().includes(q);
    const dept = getDepartment(t.departmentId);
    const desig = getDesignation(t.designationId);
    const matchDept  = !filters.department   || dept?.name === filters.department;
    const matchDesig = !filters.designation  || desig?.short === filters.designation;
    const matchStatus = !filters.status      || t.status === filters.status;
    const matchEmp   = !filters.employment   || t.employmentType === filters.employment;
    return matchSearch && matchDept && matchDesig && matchStatus && matchEmp;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setFilters({ department: '', designation: '', status: '', employment: '' });
  };

  // ── Stat values ──
  const totalStaff    = teacherList.length;
  const activeToday   = teacherList.filter(t => t.status === 'active').length;
  const onLeave       = teacherList.filter(t => t.status === 'on-leave');
  const subjectsCovered = subjects.length;

  const handleDelete = () => {
    setTeacherList(prev => prev.filter(t => t.id !== deleteTarget.id));
    toast.success(`${deleteTarget.name} ka record delete ho gaya!`);
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // ── Input / Select shared style ──
  const inputStyle = {
    border: '1px solid #e2e8f0', borderRadius: 10, background: '#f8fafc',
    padding: '8px 12px', fontSize: 13, color: '#374151',
    outline: 'none', cursor: 'pointer',
  };

  return (
    <div style={{ padding: '24px 28px', background: '#f8fafc', minHeight: '100vh' }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .row-hover:hover { background: #f8fafc !important; }
        .action-btn { opacity: 0; transition: opacity 150ms; }
        tr:hover .action-btn { opacity: 1; }
        .icon-btn { display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;border:1px solid #e2e8f0;background:#fff;cursor:pointer;transition:all 150ms; }
        .icon-btn:hover.view { border-color:#bfdbfe;background:#eff6ff;color:#1e40af; }
        .icon-btn:hover.edit { border-color:#fde68a;background:#fffbeb;color:#d97706; }
        .icon-btn:hover.del  { border-color:#fecaca;background:#fef2f2;color:#dc2626; }
      `}</style>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>Teacher Management</h1>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 2 }}>
            Manage all staff records, subjects &amp; timetables · 2025-26
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* View Toggle */}
          {['list','grid'].map(mode => (
            <button key={mode} onClick={() => setViewMode(mode)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: 8, cursor: 'pointer',
              border: `1px solid ${viewMode === mode ? '#1e40af' : '#e2e8f0'}`,
              background: viewMode === mode ? '#eff6ff' : '#fff',
              color: viewMode === mode ? '#1e40af' : '#64748b',
              transition: 'all 150ms',
            }}>
              {mode === 'list' ? <LayoutList size={16} /> : <LayoutGrid size={16} />}
            </button>
          ))}
          {/* Add Teacher */}
          <button onClick={() => navigate('/teacher/new')} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#1e40af', color: '#fff', border: 'none',
            padding: '9px 16px', borderRadius: 10, fontWeight: 600,
            fontSize: 14, cursor: 'pointer', transition: 'background 150ms',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
            onMouseLeave={e => e.currentTarget.style.background = '#1e40af'}
          >
            <UserPlus size={16} /> Add Teacher
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { icon: Users,     iconBg: '#dbeafe', iconColor: '#3b82f6', border: '#3b82f6', num: totalStaff,    label: 'TOTAL STAFF',      sub: 'All departments combined' },
          { icon: UserCheck, iconBg: '#d1fae5', iconColor: '#10b981', border: '#10b981', num: activeToday,   label: 'ACTIVE TODAY',     sub: '↑ Present & working' },
          { icon: UserX,     iconBg: '#fef3c7', iconColor: '#f59e0b', border: '#f59e0b', num: onLeave.length, label: 'ON LEAVE',        sub: onLeave.map(t => t.firstName).join(', ') || 'None' },
          { icon: BookOpen,  iconBg: '#ede9fe', iconColor: '#8b5cf6', border: '#8b5cf6', num: subjectsCovered, label: 'SUBJECTS COVERED', sub: 'Across all classes' },
        ].map(({ icon: Icon, iconBg, iconColor, border, num, label, sub }) => (
          <div key={label} style={{
            background: '#fff', borderRadius: 16, padding: '20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            borderTop: `4px solid ${border}`, position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{num}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{sub}</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} style={{ color: iconColor }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Bar ── */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', minWidth: 260 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search name, Emp ID, mobile..."
              style={{ ...inputStyle, paddingLeft: 34, width: '100%' }}
            />
          </div>

          {/* Department */}
          <select value={filters.department} onChange={e => setFilters(f => ({ ...f, department: e.target.value }))} style={{ ...inputStyle, minWidth: 160 }}>
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>

          {/* Designation */}
          <select value={filters.designation} onChange={e => setFilters(f => ({ ...f, designation: e.target.value }))} style={{ ...inputStyle, minWidth: 170 }}>
            <option value="">All Designations</option>
            {designations.map(d => <option key={d.id} value={d.short}>{d.short}</option>)}
          </select>

          {/* Status */}
          <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} style={{ ...inputStyle, minWidth: 140 }}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="on-leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Employment */}
          <select value={filters.employment} onChange={e => setFilters(f => ({ ...f, employment: e.target.value }))} style={{ ...inputStyle, minWidth: 150 }}>
            <option value="">All Types</option>
            <option value="Permanent">Permanent</option>
            <option value="Contract">Contract</option>
            <option value="Part Time">Part Time</option>
          </select>

          {/* Right side */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Export */}
            <div style={{ position: 'relative' }} ref={exportRef}>
              <button onClick={() => setShowExportMenu(v => !v)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                border: '1px solid #e2e8f0', background: '#fff', color: '#374151',
                padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer'
              }}>
                <Download size={14} /> Export <ChevronDown size={13} />
              </button>
              {showExportMenu && (
                <div style={{
                  position: 'absolute', top: '110%', right: 0, background: '#fff',
                  border: '1px solid #e2e8f0', borderRadius: 10, padding: '6px 0',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 50, minWidth: 160
                }}>
                  {[['📄','Export PDF'], ['📊','Export Excel']].map(([icon, label]) => (
                    <div key={label} onClick={() => { toast.success(`${label.replace('Export ','')} exported!`); setShowExportMenu(false); }}
                      style={{ padding: '9px 16px', fontSize: 13, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >{icon} {label}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Reset */}
            <button onClick={resetFilters} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', color: '#3b82f6',
              fontSize: 13, fontWeight: 500, cursor: 'pointer'
            }}>
              <RefreshCw size={12} /> Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* ── LIST VIEW ── */}
      {viewMode === 'list' && (
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['#', 'TEACHER', 'EMP ID', 'DESIGNATION', 'DEPT', 'SUBJECTS', 'MOBILE', 'STATUS', 'ACTIONS'].map(col => (
                  <th key={col} style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontSize: 11, fontWeight: 700, color: '#94a3b8',
                    letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap'
                  }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? [1, 2, 3].map(i => <SkeletonRow key={i} />)
                : filtered.length === 0
                  ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '60px 0' }}>
                        <Users size={48} style={{ color: '#d1d5db', display: 'block', margin: '0 auto 12px' }} />
                        <div style={{ fontSize: 16, fontWeight: 600, color: '#374151' }}>No teachers found</div>
                        <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Try changing your search or filter criteria</div>
                        <button onClick={resetFilters} style={{
                          marginTop: 14, padding: '8px 18px', borderRadius: 8,
                          border: '1px solid #3b82f6', color: '#3b82f6', background: '#fff',
                          fontSize: 13, fontWeight: 600, cursor: 'pointer'
                        }}>Reset Filters</button>
                      </td>
                    </tr>
                  )
                  : filtered.map((teacher, idx) => {
                    const dept = getDepartment(teacher.departmentId);
                    const desig = getDesignation(teacher.designationId);
                    const teacherSubjects = subjects.filter(s => teacher.subjectIds.includes(s.id));
                    const extraSubjects = teacherSubjects.length - 2;

                    return (
                      <tr key={teacher.id} className="row-hover" style={{
                        borderBottom: '1px solid #f1f5f9', transition: 'background 150ms', minHeight: 64
                      }}>
                        {/* # */}
                        <td style={{ padding: '14px 16px', fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{idx + 1}</td>

                        {/* Teacher */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Avatar initials={teacher.avatar} color={teacher.avatarColor} size={40} />
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{teacher.name}</div>
                              <div style={{ fontSize: 12, color: '#64748b' }}>{teacher.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* EMP ID */}
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            background: '#dbeafe', color: '#1e40af',
                            fontSize: 12, fontWeight: 700, borderRadius: 999,
                            padding: '3px 10px', fontFamily: 'monospace', whiteSpace: 'nowrap'
                          }}>{teacher.empId}</span>
                        </td>

                        {/* Designation */}
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            border: '1px solid #e2e8f0', color: '#374151',
                            fontSize: 11, borderRadius: 999, padding: '3px 8px', whiteSpace: 'nowrap'
                          }}>{desig?.short || '—'}</span>
                        </td>

                        {/* Dept */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: dept?.color || '#94a3b8', flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: '#374151', whiteSpace: 'nowrap' }}>{dept?.name || '—'}</span>
                          </div>
                        </td>

                        {/* Subjects */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {teacherSubjects.slice(0, 2).map(s => (
                              <span key={s.id} style={{
                                background: '#f1f5f9', color: '#374151',
                                fontSize: 11, borderRadius: 999, padding: '2px 8px', whiteSpace: 'nowrap'
                              }}>{s.name}</span>
                            ))}
                            {extraSubjects > 0 && (
                              <span style={{
                                background: '#eff6ff', color: '#1e40af',
                                fontSize: 11, borderRadius: 999, padding: '2px 8px',
                                border: '1px solid #bfdbfe'
                              }}>+{extraSubjects}</span>
                            )}
                          </div>
                        </td>

                        {/* Mobile */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151' }}>
                            <Phone size={12} style={{ color: '#94a3b8' }} />
                            {teacher.mobile}
                          </div>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '14px 16px' }}>
                          <StatusPill status={teacher.status} employment={teacher.employmentType} />
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '14px 16px' }}>
                          <div className="action-btn" style={{ display: 'flex', gap: 6 }}>
                            <button className="icon-btn view" title="View" onClick={() => navigate(`/teacher/${teacher.id}`)}>
                              <Eye size={14} style={{ color: '#64748b' }} />
                            </button>
                            <button className="icon-btn edit" title="Edit" onClick={() => navigate(`/teacher/edit/${teacher.id}`)}>
                              <Pencil size={14} style={{ color: '#64748b' }} />
                            </button>
                            <button className="icon-btn del" title="Delete" onClick={() => { setDeleteTarget(teacher); setShowDeleteModal(true); }}>
                              <Trash2 size={14} style={{ color: '#64748b' }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>

          {/* Pagination */}
          {!loading && filtered.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>Showing 1–{filtered.length} of {filtered.length} teachers</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {[<ChevronLeft size={14} />, '1', <ChevronRight size={14} />].map((item, i) => (
                  <button key={i} style={{
                    width: 32, height: 32, borderRadius: 6, border: '1px solid #e2e8f0',
                    background: item === '1' ? '#eff6ff' : '#fff',
                    color: item === '1' ? '#1e40af' : '#64748b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer'
                  }}>{item}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {viewMode === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {loading
            ? [1, 2, 3, 4].map(i => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ height: 4, background: '#f1f5f9' }} />
                <div style={{ padding: 16 }}>
                  {[80, 120, 80, 140, 100].map((w, j) => (
                    <div key={j} style={{
                      width: w, height: 12, borderRadius: 6, marginBottom: 12,
                      background: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)',
                      backgroundSize: '400% 100%', animation: 'shimmer 1.5s infinite'
                    }} />
                  ))}
                </div>
              </div>
            ))
            : filtered.length === 0
              ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0' }}>
                  <Users size={48} style={{ color: '#d1d5db', display: 'block', margin: '0 auto 12px' }} />
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#374151' }}>No teachers found</div>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Try changing your search or filter criteria</div>
                  <button onClick={resetFilters} style={{
                    marginTop: 14, padding: '8px 18px', borderRadius: 8,
                    border: '1px solid #3b82f6', color: '#3b82f6', background: '#fff',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer'
                  }}>Reset Filters</button>
                </div>
              )
              : filtered.map(teacher => (
                <TeacherCard
                  key={teacher.id}
                  teacher={teacher}
                  onView={(id) => navigate(`/teacher/${id}`)}
                  onEdit={(id) => navigate(`/teacher/edit/${id}`)}
                  onDelete={(t) => { setDeleteTarget(t); setShowDeleteModal(true); }}
                />
              ))
          }
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {showDeleteModal && deleteTarget && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{
            background: '#fff', borderRadius: 20, padding: 32, maxWidth: 420, width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)', textAlign: 'center'
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: '#fee2e2', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 16px'
            }}>
              <AlertTriangle size={28} style={{ color: '#dc2626' }} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Delete Teacher Record?</h3>
            <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 6px' }}>
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>?
            </p>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }} style={{
                flex: 1, padding: '10px 0', borderRadius: 10, border: '1px solid #e2e8f0',
                background: '#fff', color: '#374151', fontWeight: 600, fontSize: 14, cursor: 'pointer'
              }}>Cancel</button>
              <button onClick={handleDelete} style={{
                flex: 1, padding: '10px 0', borderRadius: 10, border: 'none',
                background: '#dc2626', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer'
              }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
