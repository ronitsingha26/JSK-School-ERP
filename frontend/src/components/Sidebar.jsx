import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, GraduationCap, Users, BookOpen, CalendarDays,
  CreditCard, Wallet, Receipt, Award, ShieldCheck, BarChart3,
  Building2, Bus, Library, Monitor, ShoppingBag, UserCog,
  Settings, Sparkles, ChevronRight, ChevronDown, AlertCircle,
  FileText, CircleDollarSign, ClipboardList, UserCheck,
  ArrowRight, Utensils, RefreshCw, FileSpreadsheet, PenTool,
  Pencil, BadgeIndianRupee
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

/*
  Menu structure — items can have `children` for dropdowns.
  `children` have their own { title, path, icon }.
*/
const menuSections = [
  {
    label: null,
    items: [
      { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, ready: true },
    ]
  },
  {
    label: 'Academic',
    items: [
      {
        title: 'Admission', icon: GraduationCap, ready: true,
        children: [
          { title: 'Form Sale',             path: '/admission/form-sale', icon: FileSpreadsheet },
          { title: 'Student Admission',     path: '/admission/new',       icon: UserCheck },
          { title: 'Edit Student',          path: '/admission',           icon: Pencil },
          { title: 'Map Boarding with Lunch', path: '/admission/boarding', icon: Utensils },
          { title: 'Transfer Students in New Year', path: '/admission/transfer', icon: RefreshCw },
        ],
      },
      {
        title: 'Examination', icon: BookOpen, ready: true,
        children: [
          { title: 'Dashboard',     path: '/examination',              icon: LayoutDashboard },
          { title: 'Create Exam',   path: '/examination/create',       icon: PenTool },
          { title: 'Marks Entry',   path: '/examination/marks',        icon: ClipboardList },
          { title: 'Marks Status',  path: '/examination/marks/status', icon: BarChart3 },
          { title: 'Report Cards',  path: '/examination/reportcard',   icon: FileText },
          { title: 'Result Analysis', path: '/examination/analysis',   icon: BarChart3 },
          { title: 'Admit Cards',   path: '/examination/admitcard',    icon: CreditCard },
        ],
      },
      { title: 'Routine',        path: '/routine',        icon: CalendarDays, ready: true },
      { title: 'Subject Master', path: '/subject-master', icon: BookOpen, ready: true },
      { title: 'Library Management', path: '/library',    icon: Library, ready: true },
    ]
  },
  {
    label: 'People',
    items: [
      { title: 'Teachers',       path: '/teacher',        icon: Users, ready: true },
      { title: 'Front Office',   path: '/front-office',   icon: Building2  },
      { title: 'Transportation', path: '/transportation', icon: Bus        },
    ]
  },
  {
    label: 'Finance',
    items: [
      {
        title: 'Fees Setup', icon: Wallet, ready: true,
        children: [
          { title: 'Fee Heads',          path: '/fees/setup',         icon: Wallet },
          { title: 'Fee Collection',     path: '/fees/collection',    icon: CreditCard },
          { title: 'Previous Year Dues', path: '/fees/previous-dues', icon: AlertCircle },
          { title: 'Demand Bill',        path: '/fees/demand-bill',   icon: FileText },
          { title: 'Other Fee Collection', path: '/fees/other',       icon: CircleDollarSign },
        ],
      },
      { title: 'Scholarship', path: '/scholarship', icon: Award   },
      { title: 'Payroll',     path: '/payroll',     icon: BadgeIndianRupee, ready: true },
      { title: 'Accounts',    path: '/account',     icon: Building2 },
    ]
  },
  {
    label: 'System',
    items: [
      { title: 'Master Setup',    path: '/master-setup',        icon: Settings    },
      { title: 'Permissions',     path: '/user-permissions',    icon: ShieldCheck },
      { title: 'Reports',         path: '/reports',             icon: BarChart3   },
      { title: 'LMS',             path: '/lms',                 icon: Monitor     },
      { title: 'Registration',    path: '/online-registration', icon: UserCog     },
      { title: 'Sale & Purchase', path: '/sale-purchase',       icon: ShoppingBag },
    ]
  }
];

export default function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();
  const { user } = useAuth();
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  /* ── Expand state for collapsible items ── */
  const [expanded, setExpanded] = useState({});

  /* Auto-expand parent if any child is active */
  useEffect(() => {
    const newExpanded = {};
    menuSections.forEach(section => {
      section.items.forEach(item => {
        if (item.children) {
          const anyActive = item.children.some(
            c => location.pathname === c.path || location.pathname.startsWith(c.path + '/')
          );
          if (anyActive) newExpanded[item.title] = true;
        }
      });
    });
    setExpanded(prev => ({ ...prev, ...newExpanded }));
  }, [location.pathname]);

  const toggleExpand = (title) => {
    setExpanded(prev => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-[2px]"
          onClick={onToggle}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* ── Logo ── */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Sparkles className="w-[18px] h-[18px] text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-bold text-white leading-tight truncate">JSK School ERP</p>
            <p className="text-[11px] font-medium mt-0.5" style={{ color: '#64748b' }}>Admin Console</p>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="sidebar-nav">
          {menuSections.map((section, sIdx) => (
            <div key={sIdx}>
              {section.label && (
                <p className="sidebar-section-label">{section.label}</p>
              )}
              <div>
                {section.items.map((navItem) => {
                  const Icon = navItem.icon;
                  const hasChildren = navItem.children && navItem.children.length > 0;
                  const isExpanded = expanded[navItem.title];

                  if (hasChildren) {
                    /* ── Parent with dropdown ── */
                    const anyChildActive = navItem.children.some(
                      c => location.pathname === c.path || location.pathname.startsWith(c.path + '/')
                    );

                    return (
                      <div key={navItem.title}>
                        {/* Parent toggle button */}
                        <button
                          onClick={() => toggleExpand(navItem.title)}
                          className="block w-full text-left"
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}
                        >
                          <div className={`sidebar-item ${anyChildActive ? 'active' : ''}`}>
                            <span className="sidebar-active-bar" />
                            <Icon className="sidebar-item-icon" />
                            <span className="flex-1 truncate">{navItem.title}</span>
                            {!navItem.ready && (
                              <span
                                className="text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0"
                                style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24' }}
                              >
                                SOON
                              </span>
                            )}
                            <ChevronDown
                              size={14}
                              style={{
                                flexShrink: 0,
                                transition: 'transform 0.25s ease',
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                opacity: 0.5,
                              }}
                            />
                          </div>
                        </button>

                        {/* Children */}
                        <div
                          style={{
                            overflow: 'hidden',
                            maxHeight: isExpanded ? `${navItem.children.length * 42}px` : '0px',
                            transition: 'max-height 0.3s ease, opacity 0.25s ease',
                            opacity: isExpanded ? 1 : 0,
                          }}
                        >
                          {navItem.children.map((child) => {
                            const ChildIcon = child.icon;
                            const isChildActive =
                              location.pathname === child.path ||
                              location.pathname.startsWith(child.path + '/');
                            return (
                              <NavLink key={child.path} to={child.path} className="block">
                                <div
                                  className={`sidebar-child-item ${isChildActive ? 'active' : ''}`}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '8px 10px 8px 38px',
                                    fontSize: 12,
                                    fontWeight: isChildActive ? 700 : 500,
                                    color: isChildActive ? '#fff' : 'rgba(255,255,255,0.65)',
                                    borderRadius: 10,
                                    margin: '2px 10px',
                                    transition: 'all 0.15s',
                                    background: isChildActive ? 'rgba(79,70,229,0.35)' : 'transparent',
                                    cursor: 'pointer',
                                  }}
                                  onMouseEnter={e => {
                                    if (!isChildActive) e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                    if (!isChildActive) e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
                                  }}
                                  onMouseLeave={e => {
                                    if (!isChildActive) e.currentTarget.style.background = 'transparent';
                                    if (!isChildActive) e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
                                  }}
                                >
                                  <ArrowRight size={12} style={{ flexShrink: 0, opacity: isChildActive ? 1 : 0.5 }} />
                                  <span style={{ lineHeight: 1.3, whiteSpace: 'normal', wordBreak: 'break-word', flex: 1 }}>
                                    {child.title}
                                  </span>
                                </div>
                              </NavLink>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  /* ── Regular item (no children) ── */
                  const isActive =
                    location.pathname === navItem.path ||
                    location.pathname.startsWith(navItem.path + '/');
                  return (
                    <NavLink key={navItem.path} to={navItem.path} className="block">
                      <div className={`sidebar-item ${isActive ? 'active' : ''}`}>
                        <span className="sidebar-active-bar" />
                        <Icon className="sidebar-item-icon" />
                        <span className="flex-1 truncate">{navItem.title}</span>
                        {!navItem.ready && (
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0"
                            style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24' }}
                          >
                            SOON
                          </span>
                        )}
                        {isActive && (
                          <ChevronRight className="w-3 h-3 shrink-0 opacity-50" />
                        )}
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ── User Footer ── */}
        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #818cf8)',
                boxShadow: '0 2px 8px rgba(79,70,229,0.4)',
              }}
            >
              <span className="text-white text-[12px] font-bold">{initials}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-white truncate leading-tight">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[11px] font-medium capitalize mt-0.5" style={{ color: '#64748b' }}>
                {user?.role || 'admin'}
              </p>
            </div>
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,0.5)' }}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
