import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown, Menu, LogOut, Settings, HelpCircle, X, User, CreditCard, GraduationCap, Bus, LayoutDashboard } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
// import api from '../utils/api'; // ← Uncomment when backend is ready

/* ── Breadcrumb labels ── */
const LABELS = {
  dashboard: 'Dashboard', admission: 'Admission', examination: 'Examination',
  routine: 'Routine', 'subject-master': 'Subject Master', teacher: 'Teachers',
  'front-office': 'Front Office', transportation: 'Transportation',
  fees: 'Fees',
  scholarship: 'Scholarship', payroll: 'Payroll', account: 'Accounts',
  'master-setup': 'Master Setup', 'user-permissions': 'Permissions',
  reports: 'Reports', library: 'Library', lms: 'LMS',
  'online-registration': 'Registration', 'sale-purchase': 'Sale & Purchase',
  /* Fees sub-routes */
  setup: 'Fees Setup', collection: 'Fees Collection',
  'previous-dues': 'Previous Year Dues', 'demand-bill': 'Demand Bill',
  other: 'Other Fee Collection',
  /* Examination sub-routes */
  create: 'Create Exam', marks: 'Marks Entry', status: 'Marks Status',
  reportcard: 'Report Cards', analysis: 'Result Analysis', admitcard: 'Admit Cards',
};

const MODULES_LIST = [
  { path: '/dashboard',          name: 'Dashboard' },
  { path: '/admission',          name: 'Admission' },
  { path: '/examination',               name: 'Examination'     },
  { path: '/examination/create',         name: 'Create Exam'     },
  { path: '/examination/marks',          name: 'Marks Entry'     },
  { path: '/examination/marks/status',   name: 'Marks Status'    },
  { path: '/examination/reportcard',     name: 'Report Cards'    },
  { path: '/examination/analysis',       name: 'Result Analysis' },
  { path: '/examination/admitcard',      name: 'Admit Cards'     },
  { path: '/routine',            name: 'Routine' },
  { path: '/subject-master',     name: 'Subject Master' },
  { path: '/teacher',            name: 'Teachers' },
  { path: '/front-office',       name: 'Front Office' },
  { path: '/transportation',     name: 'Transportation' },
  { path: '/fees/setup',         name: 'Fees Setup' },
  { path: '/fees/collection',    name: 'Fees Collection' },
  { path: '/fees/previous-dues', name: 'Previous Year Dues' },
  { path: '/fees/demand-bill',   name: 'Demand Bill' },
  { path: '/fees/other',         name: 'Other Fee Collection' },
  { path: '/scholarship',        name: 'Scholarship' },
  { path: '/payroll',            name: 'Payroll' },
  { path: '/account',            name: 'Accounts' },
  { path: '/master-setup',       name: 'Master Setup' },
  { path: '/user-permissions',   name: 'Permissions' },
  { path: '/reports',            name: 'Reports' },
  { path: '/library',            name: 'Library' },
  { path: '/lms',                name: 'LMS' },
  { path: '/online-registration',name: 'Registration' },
  { path: '/sale-purchase',      name: 'Sale & Purchase' },
];

function useBreadcrumb() {
  const { pathname } = useLocation();
  return pathname.split('/').filter(Boolean).map(s => LABELS[s] || s);
}

/* ── Avatar gradient based on initials ── */
const AVATAR_GRADIENT = 'linear-gradient(135deg, #4f46e5, #818cf8)';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  
  /* Search states */
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState({ modules: [], students: [] });
  
  const [notifHov, setNotifHov] = useState(false);
  const [helpHov, setHelpHov] = useState(false);
  const menuRef = useRef(null);
  const searchContainerRef = useRef(null);
  const breadcrumb = useBreadcrumb();

  /* Close dropdowns on outside click */
  useEffect(() => {
    const h = (e) => { 
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); 
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) setSearchFocused(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  /* ── Dummy student data for offline search ── */
  const DUMMY_STUDENTS = [
    { id: 1, first_name: 'Aaditya', last_name: 'Kumar', admission_no: 'JSK-2025-001', class: { class_name: 'I' }, section: { section_name: 'A' }, bus_facility: true },
    { id: 2, first_name: 'Priya', last_name: 'Sharma', admission_no: 'JSK-2025-002', class: { class_name: 'III' }, section: { section_name: 'B' }, bus_facility: false },
    { id: 3, first_name: 'Rahul', last_name: 'Verma', admission_no: 'JSK-2025-003', class: { class_name: 'V' }, section: { section_name: 'A' }, bus_facility: true },
    { id: 4, first_name: 'Sneha', last_name: 'Gupta', admission_no: 'JSK-2025-004', class: { class_name: 'II' }, section: { section_name: 'C' }, bus_facility: false },
    { id: 5, first_name: 'Vikash', last_name: 'Yadav', admission_no: 'JSK-2025-005', class: { class_name: 'IV' }, section: { section_name: 'A' }, bus_facility: true },
    { id: 6, first_name: 'Ananya', last_name: 'Singh', admission_no: 'JSK-2025-006', class: { class_name: 'VI' }, section: { section_name: 'B' }, bus_facility: false },
    { id: 7, first_name: 'Arjun', last_name: 'Patel', admission_no: 'JSK-2025-007', class: { class_name: 'VII' }, section: { section_name: 'A' }, bus_facility: true },
    { id: 8, first_name: 'Kavita', last_name: 'Devi', admission_no: 'JSK-2025-008', class: { class_name: 'VIII' }, section: { section_name: 'A' }, bus_facility: false },
    { id: 9, first_name: 'Rohit', last_name: 'Mishra', admission_no: 'JSK-2025-009', class: { class_name: 'IX' }, section: { section_name: 'B' }, bus_facility: true },
    { id: 10, first_name: 'Pooja', last_name: 'Kumari', admission_no: 'JSK-2025-010', class: { class_name: 'X' }, section: { section_name: 'A' }, bus_facility: false },
  ];

  /* Global Search Logic — Offline mode */
  useEffect(() => {
    if (!searchVal.trim()) {
      setSearchResults({ modules: [], students: [] });
      setIsSearching(false);
      return;
    }
    
    const delayDebounceFn = setTimeout(() => {
      setIsSearching(true);
      const q = searchVal.trim().toLowerCase();
      
      // Filter modules
      const matchedModules = MODULES_LIST.filter(m => m.name.toLowerCase().includes(q));
      
      // Filter local dummy students
      const matchedStudents = DUMMY_STUDENTS.filter(st =>
        `${st.first_name} ${st.last_name}`.toLowerCase().includes(q) ||
        st.admission_no.toLowerCase().includes(q)
      );
      
      setSearchResults({ modules: matchedModules.slice(0, 4), students: matchedStudents.slice(0, 5) });
      setIsSearching(false);
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [searchVal]);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      height: 68,
      background: 'rgba(255,255,255,0.88)',
      borderBottom: '1px solid #e2e8f0',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 14,
      boxShadow: '0 1px 0 #e2e8f0, 0 4px 20px rgba(15,23,42,0.05)',
    }}>

      {/* ── LEFT: Hamburger + Breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        {/* Mobile hamburger */}
        <button
          id="navbar-sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          style={{
            width: 38, height: 38, borderRadius: 10,
            background: '#fff', border: '1.5px solid #e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#64748b', flexShrink: 0,
          }}
          className="lg:hidden"
        >
          <Menu size={17} />
        </button>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#94a3b8' }} className="hidden md:flex">
          <span style={{ color: '#94a3b8', fontWeight: 700 }}>JSK ERP</span>
          {breadcrumb.map((seg, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ color: '#cbd5e1', fontWeight: 400 }}>/</span>
              <span style={{ color: i === breadcrumb.length - 1 ? '#0f172a' : '#94a3b8', fontWeight: i === breadcrumb.length - 1 ? 700 : 600 }}>
                {seg}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* ── CENTER: Search ── */}
      <div ref={searchContainerRef} style={{ flex: 1, maxWidth: 440, margin: '0 auto', position: 'relative' }} className="hidden lg:block">
        <Search
          size={15}
          style={{
            position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
            color: searchFocused ? '#4f46e5' : '#94a3b8', transition: 'color 0.15s', pointerEvents: 'none', zIndex: 10
          }}
        />
        <input
          id="navbar-search"
          type="text"
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          placeholder="Search students, fees, reports…"
          onFocus={() => setSearchFocused(true)}
          style={{
            width: '100%', height: 40,
            background: searchFocused ? '#fff' : '#f8fafc',
            border: `1.5px solid ${searchFocused ? '#4f46e5' : '#e2e8f0'}`,
            borderRadius: 11,
            padding: '0 40px 0 38px',
            fontSize: 13, fontWeight: 500,
            color: '#0f172a', outline: 'none',
            fontFamily: 'inherit',
            boxShadow: searchFocused ? '0 0 0 3px rgba(79,70,229,0.12)' : 'none',
            transition: 'all 0.18s',
            position: 'relative', zIndex: 5
          }}
        />
        {searchVal ? (
          <button
            onClick={() => { setSearchVal(''); searchContainerRef.current?.querySelector('input')?.focus(); }}
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: '#e2e8f0', border: 'none', borderRadius: '50%',
              width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#64748b', zIndex: 10
            }}
          >
            <X size={11} />
          </button>
        ) : (
          <span style={{
            position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)',
            fontSize: 10, fontWeight: 700, color: '#94a3b8',
            background: '#f1f5f9', border: '1px solid #e2e8f0',
            padding: '2px 6px', borderRadius: 6, letterSpacing: '0.04em', userSelect: 'none', zIndex: 10
          }}>⌘K</span>
        )}

        {/* ── Search Dropdown Results ── */}
        {searchFocused && searchVal.trim() && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16,
            boxShadow: '0 10px 40px rgba(15,23,42,0.1)', padding: 12, zIndex: 50,
            maxHeight: '70vh', overflowY: 'auto'
          }}>
            {isSearching && <div style={{ fontSize: 13, color: '#94a3b8', padding: '12px', textAlign: 'center', fontWeight: 600 }}>Searching...</div>}
            
            {!isSearching && searchResults.modules.length === 0 && searchResults.students.length === 0 && (
              <div style={{ fontSize: 13, color: '#94a3b8', padding: '12px', textAlign: 'center', fontWeight: 600 }}>No results found for "{searchVal}"</div>
            )}

            {/* Modules Section */}
            {!isSearching && searchResults.modules.length > 0 && (
              <div style={{ marginBottom: searchResults.students.length > 0 ? 16 : 0 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 12px 8px' }}>Modules</div>
                {searchResults.modules.map(mod => (
                  <div
                    key={mod.path}
                    onClick={() => { navigate(mod.path); setSearchFocused(false); setSearchVal(''); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                      borderRadius: 10, cursor: 'pointer', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <LayoutDashboard size={14} color="#3b82f6" />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{mod.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Students Section */}
            {!isSearching && searchResults.students.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 12px 8px' }}>Students</div>
                {searchResults.students.map(st => (
                  <div key={st.id} style={{ padding: '12px', borderRadius: 12, border: '1px solid #f1f5f9', marginBottom: 8, background: '#fafbfc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>
                          {st.first_name[0]}{st.last_name[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{st.first_name} {st.last_name}</div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginTop: 2 }}>
                            {st.admission_no} • Class {st.class?.class_name || '-'} {st.section?.section_name}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Quick Section Links for this Student */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      <StudentQuickLink icon={User} label="Profile" onClick={() => { navigate(`/admission/${st.id}`); setSearchFocused(false); setSearchVal(''); }} color="#3b82f6" bg="#eff6ff" />
                      <StudentQuickLink icon={CreditCard} label="Fees" onClick={() => { navigate(`/fees-collection?student_id=${st.id}`); setSearchFocused(false); setSearchVal(''); }} color="#10b981" bg="#ecfdf5" />
                      <StudentQuickLink icon={GraduationCap} label="Exams" onClick={() => { navigate(`/examination?student_id=${st.id}`); setSearchFocused(false); setSearchVal(''); }} color="#8b5cf6" bg="#f5f3ff" />
                      {st.bus_facility && (
                        <StudentQuickLink icon={Bus} label="Transport" onClick={() => { navigate(`/transportation?student_id=${st.id}`); setSearchFocused(false); setSearchVal(''); }} color="#06b6d4" bg="#ecfeff" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── RIGHT: Actions ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', flexShrink: 0 }}>

        {/* Notification Bell */}
        <button
          id="navbar-notifications"
          aria-label="Notifications"
          onMouseEnter={() => setNotifHov(true)}
          onMouseLeave={() => setNotifHov(false)}
          style={{
            width: 40, height: 40, borderRadius: 11,
            background: notifHov ? '#f1f5f9' : '#fff',
            border: '1.5px solid #e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#64748b', position: 'relative',
            transition: 'all 0.15s', boxShadow: notifHov ? '0 2px 8px rgba(15,23,42,0.07)' : 'none',
          }}
        >
          <Bell size={17} />
          {/* Notification dot */}
          <span style={{
            position: 'absolute', top: 9, right: 9,
            width: 8, height: 8, borderRadius: '50%',
            background: '#ef4444', border: '2px solid #fff',
          }} />
        </button>

        {/* Help */}
        <button
          id="navbar-help"
          aria-label="Help"
          onMouseEnter={() => setHelpHov(true)}
          onMouseLeave={() => setHelpHov(false)}
          style={{
            width: 40, height: 40, borderRadius: 11,
            background: helpHov ? '#f1f5f9' : '#fff',
            border: '1.5px solid #e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#64748b',
            transition: 'all 0.15s', boxShadow: helpHov ? '0 2px 8px rgba(15,23,42,0.07)' : 'none',
          }}
          className="hidden sm:flex"
        >
          <HelpCircle size={17} />
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: '#e2e8f0', margin: '0 2px' }} className="hidden sm:block" />

        {/* User Dropdown Trigger */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            id="navbar-user-menu"
            onClick={() => setShowMenu(!showMenu)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '5px 10px 5px 5px', borderRadius: 13,
              background: showMenu ? '#f1f5f9' : 'transparent',
              border: 'none', cursor: 'pointer', transition: 'background 0.15s',
            }}
          >
            {/* Avatar */}
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: AVATAR_GRADIENT,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(79,70,229,0.35)',
            }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 800, letterSpacing: '0.03em' }}>
                {initials}
              </span>
            </div>
            {/* Name + Role */}
            <div style={{ textAlign: 'left' }} className="hidden sm:block">
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                {user?.name || 'Admin'}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, marginTop: 2, textTransform: 'capitalize' }}>
                {user?.role || 'Administrator'}
              </div>
            </div>
            <ChevronDown
              size={15}
              style={{
                color: '#94a3b8', transition: 'transform 0.2s',
                transform: showMenu ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
              className="hidden sm:block"
            />
          </button>

          {/* ── Dropdown ── */}
          {showMenu && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 10px)',
              width: 240, background: '#fff',
              borderRadius: 18, border: '1px solid #e2e8f0',
              boxShadow: '0 8px 32px rgba(15,23,42,0.14), 0 2px 8px rgba(15,23,42,0.06)',
              overflow: 'hidden', zIndex: 50,
              animation: 'fadeInUp 0.18s ease-out',
            }}>
              {/* User Info */}
              <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                    background: AVATAR_GRADIENT,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(79,70,229,0.3)',
                  }}>
                    <span style={{ color: '#fff', fontSize: 14, fontWeight: 800 }}>{initials}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user?.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user?.email}
                    </div>
                  </div>
                </div>
                {/* Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, background: '#ecfdf5', borderRadius: 8, padding: '6px 10px' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a' }}>Active Session</span>
                </div>
              </div>

              {/* Menu Items */}
              <div style={{ padding: '8px' }}>
                <DropItem icon={Settings} label="Account Settings" />
                <DropItem icon={LogOut} label="Sign Out" danger onClick={handleLogout} />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ── Dropdown Item ── */
function DropItem({ icon: Icon, label, danger = false, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 12px', borderRadius: 11, border: 'none', cursor: 'pointer',
        fontSize: 13, fontWeight: 600, textAlign: 'left', marginBottom: 2,
        background: hov ? (danger ? '#fef2f2' : '#f8fafc') : 'transparent',
        color: danger ? (hov ? '#dc2626' : '#ef4444') : (hov ? '#0f172a' : '#475569'),
        transition: 'all 0.12s',
      }}
    >
      <Icon size={15} />
      {label}
    </button>
  );
}

/* ── Student Quick Link ── */
function StudentQuickLink({ icon: Icon, label, onClick, color, bg }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '5px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
        background: hov ? bg : '#fff',
        border: `1px solid ${hov ? bg : '#e2e8f0'}`,
        color: hov ? color : '#64748b',
        fontSize: 11, fontWeight: 700, transition: 'all 0.15s'
      }}
    >
      <Icon size={12} />
      {label}
    </button>
  );
}
