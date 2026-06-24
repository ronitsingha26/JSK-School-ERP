import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus, Search, Download, RefreshCw, Eye, Pencil, Trash2,
  ChevronLeft, ChevronRight, Users, UserCheck, CalendarPlus,
  Bus, ChevronDown, X, AlertTriangle, FileSpreadsheet, FileText
} from 'lucide-react';
import * as XLSX from 'xlsx';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const SAMPLE = [
  { id:1, admission_no:'JSK20250001', first_name:'Aaditya',  last_name:'Kumar',  father_name:'Rajesh Kumar',  mobile:'9876543210', email:'aaditya@mail.com',  status:'Active',   bus_facility:true,  class:{class_name:'I'},    section:{section_name:'A'} },
  { id:2, admission_no:'JSK20250002', first_name:'Priya',    last_name:'Sharma',  father_name:'Suresh Sharma', mobile:'9123456780', email:'priya@mail.com',    status:'Active',   bus_facility:false, class:{class_name:'III'},  section:{section_name:'B'} },
  { id:3, admission_no:'JSK20250003', first_name:'Rahul',    last_name:'Verma',   father_name:'Anil Verma',    mobile:'8899001122', email:'rahul@mail.com',    status:'Active',   bus_facility:true,  class:{class_name:'V'},    section:{section_name:'A'} },
  { id:4, admission_no:'JSK20250004', first_name:'Sneha',    last_name:'Gupta',   father_name:'Vikram Gupta',  mobile:'9012345678', email:'sneha@mail.com',    status:'Inactive', bus_facility:false, class:{class_name:'II'},   section:{section_name:'C'} },
  { id:5, admission_no:'JSK20250005', first_name:'Vikash',   last_name:'Yadav',   father_name:'Mohan Yadav',   mobile:'9988776655', email:'vikash@mail.com',   status:'Active',   bus_facility:true,  class:{class_name:'IV'},   section:{section_name:'A'} },
  { id:6, admission_no:'JSK20250006', first_name:'Anjali',   last_name:'Singh',   father_name:'Deepak Singh',  mobile:'8877665544', email:'anjali@mail.com',   status:'Active',   bus_facility:false, class:{class_name:'VI'},   section:{section_name:'B'} },
  { id:7, admission_no:'JSK20250007', first_name:'Rohit',    last_name:'Mishra',  father_name:'Sunil Mishra',  mobile:'7766554433', email:'rohit@mail.com',    status:'Active',   bus_facility:true,  class:{class_name:'VII'},  section:{section_name:'A'} },
  { id:8, admission_no:'JSK20250008', first_name:'Kavita',   last_name:'Patel',   father_name:'Rajan Patel',   mobile:'6655443322', email:'kavita@mail.com',   status:'Active',   bus_facility:false, class:{class_name:'VIII'}, section:{section_name:'C'} },
  { id:9, admission_no:'JSK20250009', first_name:'Amit',     last_name:'Tiwari',  father_name:'Ramesh Tiwari', mobile:'9900112233', email:'amit@mail.com',     status:'Active',   bus_facility:true,  class:{class_name:'IX'},   section:{section_name:'A'} },
  { id:10,admission_no:'JSK20250010', first_name:'Neha',     last_name:'Jha',     father_name:'Sanjay Jha',    mobile:'8811223344', email:'neha@mail.com',     status:'Active',   bus_facility:false, class:{class_name:'X'},    section:{section_name:'B'} },
];

const AVATAR_COLORS = [
  ['#3b82f6','#1d4ed8'],['#8b5cf6','#6d28d9'],['#10b981','#059669'],
  ['#f59e0b','#d97706'],['#ef4444','#dc2626'],['#06b6d4','#0891b2'],
  ['#6366f1','#4f46e5'],['#84cc16','#65a30d'],['#ec4899','#db2777'],['#14b8a6','#0d9488'],
];

const CLASSES  = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
const SECTIONS = ['A','B','C','D','E'];
const LIMIT    = 10;

const fade = { hidden:{opacity:0,y:10}, show:{opacity:1,y:0,transition:{duration:0.3}} };

export default function AdmissionList() {
  const navigate = useNavigate();
  const [search,  setSearch]  = useState('');
  const [cls,     setCls]     = useState('');
  const [sec,     setSec]     = useState('');
  const [status,  setStatus]  = useState('');
  const [page,    setPage]    = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [allStudents, setAllStudents] = useState(SAMPLE);
  const [showExport, setShowExport] = useState(false);
  const exportRef = useRef(null);

  /* Close export dropdown on outside click */
  useEffect(() => {
    const h = (e) => { if (exportRef.current && !exportRef.current.contains(e.target)) setShowExport(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  /* ── CLIENT-SIDE FILTER (works on sample data instantly) ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allStudents.filter(s => {
      const matchSearch = !q || [s.first_name, s.last_name, s.admission_no, s.mobile, s.father_name]
        .some(v => v?.toLowerCase().includes(q));
      const matchClass   = !cls    || s.class?.class_name   === cls;
      const matchSection = !sec    || s.section?.section_name === sec;
      const matchStatus  = !status || s.status === status;
      return matchSearch && matchClass && matchSection && matchStatus;
    });
  }, [allStudents, search, cls, sec, status]);

  const total  = filtered.length;
  const pages  = Math.max(1, Math.ceil(total / LIMIT));
  const paged  = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  const reset = () => { setSearch(''); setCls(''); setSec(''); setStatus(''); setPage(1); };
  const changeFilter = (fn) => { fn(); setPage(1); };

  /* ── Build flat row for export ── */
  const buildRows = (list) => list.map((s, i) => ({
    '#':             i + 1,
    'Admission No':  s.admission_no,
    'First Name':    s.first_name,
    'Last Name':     s.last_name,
    'Father Name':   s.father_name,
    'Mobile':        s.mobile,
    'Email':         s.email || '',
    'Class':         s.class?.class_name || '',
    'Section':       s.section?.section_name || '',
    'Bus Facility':  s.bus_facility ? 'Yes' : 'No',
    'Status':        s.status,
  }));

  /* ── CSV Export ── */
  const exportCSV = () => {
    const rows = buildRows(filtered);
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(','),
      ...rows.map(r => headers.map(h => `"${String(r[h]).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'JSK_Admissions.csv'; a.click();
    URL.revokeObjectURL(url);
    setShowExport(false);
    toast.success('Exported as CSV!');
  };

  /* ── Excel Export ── */
  const exportExcel = () => {
    const rows = buildRows(filtered);
    const ws   = XLSX.utils.json_to_sheet(rows);
    /* Column widths */
    ws['!cols'] = [6,16,14,14,20,14,22,8,8,12,10].map(w => ({ wch: w }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Admissions');
    XLSX.writeFile(wb, 'JSK_Admissions.xlsx');
    setShowExport(false);
    toast.success('Exported as Excel!');
  };

  const stats = useMemo(() => ({
    total:  allStudents.length,
    month:  allStudents.filter(s => s.id >= allStudents.length - 2).length + 24,
    active: allStudents.filter(s => s.status === 'Active').length,
  }), [allStudents]);

  const initials = s => `${s.first_name?.[0]||''}${s.last_name?.[0]||''}`.toUpperCase();
  const avatarStyle = id => {
    const [a,b] = AVATAR_COLORS[id % AVATAR_COLORS.length];
    return { background:`linear-gradient(135deg,${a},${b})` };
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admission/${deleteTarget.id}`);
      setAllStudents(p => p.filter(s => s.id !== deleteTarget.id));
      toast.success('Student deleted');
    } catch { toast.error('Delete failed'); }
    setDeleteTarget(null);
  };

  /* ── SELECT STYLE ── */
  const selStyle = { height:40, padding:'0 32px 0 12px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:13, fontWeight:600, color:'#475569', background:'#fff', outline:'none', appearance:'none', cursor:'pointer', fontFamily:'inherit' };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show:{ transition:{ staggerChildren:.07 } } }} style={{ paddingBottom:40, minWidth:0 }}>

      {/* HEADER */}
      <motion.div variants={fade} style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:800, color:'#0f172a', margin:0, letterSpacing:'-0.5px' }}>Student Admissions</h1>
          <p style={{ fontSize:14, color:'#94a3b8', marginTop:6, fontWeight:500 }}>Manage all student records · Academic Year 2025–26</p>
        </div>
        <button onClick={() => navigate('/admission/new')} style={{ display:'flex', alignItems:'center', gap:8, background:'#2563eb', color:'#fff', border:'none', borderRadius:14, padding:'11px 22px', fontSize:13, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', boxShadow:'0 4px 16px rgba(37,99,235,0.3)', flexShrink:0 }}>
          <UserPlus size={16}/> New Admission
        </button>
      </motion.div>

      {/* STATS */}
      <motion.div variants={fade} style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:20 }}>
        {[
          { label:'Total Students',  value:stats.total,    icon:Users,        color:'#2563eb', bg:'#eff6ff' },
          { label:'New This Month',  value:`+${stats.month}`, icon:CalendarPlus, color:'#7c3aed', bg:'#f5f3ff' },
          { label:'Active Students', value:stats.active,   icon:UserCheck,    color:'#059669', bg:'#ecfdf5' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:18, padding:'22px 24px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)', display:'flex', alignItems:'center', gap:18, borderTop:`3px solid ${s.color}` }}>
              <div style={{ width:52, height:52, borderRadius:14, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon size={24} color={s.color}/>
              </div>
              <div>
                <div style={{ fontSize:30, fontWeight:800, color:'#0f172a', lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:11, fontWeight:700, color:'#94a3b8', marginTop:6, textTransform:'uppercase', letterSpacing:'0.07em' }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* FILTERS */}
      <motion.div variants={fade} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:'14px 18px', marginBottom:16, boxShadow:'0 1px 4px rgba(0,0,0,0.03)', display:'flex', flexWrap:'wrap', alignItems:'center', gap:10 }}>
        {/* Search */}
        <div style={{ position:'relative', flex:'1 1 220px', minWidth:180 }}>
          <Search size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }}/>
          <input
            value={search}
            onChange={e => changeFilter(() => setSearch(e.target.value))}
            placeholder="Name, admission no, mobile, father…"
            style={{ width:'100%', height:40, paddingLeft:36, paddingRight:search?32:12, border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:13, fontWeight:500, color:'#1e293b', outline:'none', background:'#f8fafc', fontFamily:'inherit', boxSizing:'border-box' }}
            onFocus={e => e.target.style.borderColor='#2563eb'}
            onBlur={e => e.target.style.borderColor='#e2e8f0'}
          />
          {search && <button onClick={() => changeFilter(() => setSearch(''))} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', padding:0, color:'#94a3b8', display:'flex' }}><X size={14}/></button>}
        </div>

        {/* Class */}
        <div style={{ position:'relative' }}>
          <select value={cls} onChange={e => changeFilter(() => setCls(e.target.value))} style={{ ...selStyle, minWidth:120 }}>
            <option value="">All Classes</option>
            {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
          </select>
          <ChevronDown size={13} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', color:'#94a3b8', pointerEvents:'none' }}/>
        </div>

        {/* Section */}
        <div style={{ position:'relative' }}>
          <select value={sec} onChange={e => changeFilter(() => setSec(e.target.value))} style={{ ...selStyle, minWidth:110 }}>
            <option value="">All Sections</option>
            {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
          </select>
          <ChevronDown size={13} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', color:'#94a3b8', pointerEvents:'none' }}/>
        </div>

        {/* Status */}
        <div style={{ position:'relative' }}>
          <select value={status} onChange={e => changeFilter(() => setStatus(e.target.value))} style={{ ...selStyle, minWidth:120 }}>
            <option value="">All Status</option>
            <option value="Active">✅ Active</option>
            <option value="Inactive">⛔ Inactive</option>
          </select>
          <ChevronDown size={13} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', color:'#94a3b8', pointerEvents:'none' }}/>
        </div>

        <div style={{ width:1, height:28, background:'#e2e8f0' }}/>

        {/* Export Dropdown */}
        <div ref={exportRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowExport(p => !p)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              height: 40, padding: '0 16px',
              border: `1.5px solid ${showExport ? '#2563eb' : '#e2e8f0'}`,
              borderRadius: 10, fontSize: 13, fontWeight: 700,
              color: showExport ? '#2563eb' : '#475569',
              background: showExport ? '#eff6ff' : '#f8fafc',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            <Download size={14} />
            Export
            <ChevronDown size={13} style={{ transform: showExport ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>

          {/* Dropdown */}
          {showExport && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: '#fff', border: '1px solid #e2e8f0',
              borderRadius: 14, boxShadow: '0 8px 28px rgba(15,23,42,0.13)',
              padding: 6, zIndex: 50, minWidth: 190,
              animation: 'fadeInUp 0.15s ease-out',
            }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 10px 6px' }}>
                Export {filtered.length} students
              </p>
              <ExportItem
                icon={FileText}
                label="Export as CSV"
                sub="Comma-separated values"
                iconColor="#16a34a"
                iconBg="#ecfdf5"
                onClick={exportCSV}
              />
              <ExportItem
                icon={FileSpreadsheet}
                label="Export as Excel"
                sub="Microsoft Excel (.xlsx)"
                iconColor="#2563eb"
                iconBg="#eff6ff"
                onClick={exportExcel}
              />
            </div>
          )}
        </div>

        <button onClick={reset} style={{ display:'flex', alignItems:'center', gap:5, height:40, padding:'0 12px', border:'none', borderRadius:10, fontSize:13, fontWeight:600, color:'#64748b', background:'transparent', cursor:'pointer', fontFamily:'inherit' }}>
          <RefreshCw size={13}/> Reset
        </button>
      </motion.div>

      {/* TABLE */}
      <motion.div variants={fade} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:18, boxShadow:'0 1px 4px rgba(0,0,0,0.04)', overflow:'hidden' }}>
        {/* Bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 22px', borderBottom:'1px solid #f1f5f9' }}>
          <span style={{ fontSize:13, fontWeight:700, color:'#64748b' }}>
            <span style={{ color:'#0f172a' }}>{total}</span> students {(search||cls||sec||status)?'(filtered)':'found'}
          </span>
          <span style={{ fontSize:12, fontWeight:600, color:'#94a3b8' }}>Page {page} of {pages}</span>
        </div>

        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:900 }}>
            <thead>
              <tr style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
                {[['#',44,'center'],['Student',210,'left'],['Adm No',130,'left'],['Class',100,'left'],['Father Name',150,'left'],['Mobile',130,'left'],['Bus',70,'center'],['Status',90,'left'],['Actions',100,'center']].map(([h,w,a])=>(
                  <th key={h} style={{ padding:'11px 14px', textAlign:a, fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.08em', whiteSpace:'nowrap', width:w }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={9} style={{ padding:'60px 0', textAlign:'center' }}>
                  <div style={{ width:56, height:56, borderRadius:16, background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}><Users size={26} color="#cbd5e1"/></div>
                  <p style={{ fontSize:15, fontWeight:700, color:'#94a3b8', margin:0 }}>No students found</p>
                  <p style={{ fontSize:13, color:'#cbd5e1', marginTop:6 }}>Try clearing filters</p>
                  <button onClick={reset} style={{ marginTop:14, padding:'8px 20px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:13, fontWeight:600, color:'#2563eb', background:'#eff6ff', cursor:'pointer' }}>Clear Filters</button>
                </td></tr>
              ) : paged.map((s, idx) => (
                <tr key={s.id}
                  onMouseEnter={e=>e.currentTarget.style.background='#f8faff'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  style={{ borderBottom:'1px solid #f8fafc', transition:'background .12s' }}>
                  <td style={{ padding:'13px 14px', textAlign:'center' }}>
                    <span style={{ fontSize:12, fontWeight:700, color:'#e2e8f0' }}>{(page-1)*LIMIT+idx+1}</span>
                  </td>
                  <td style={{ padding:'13px 14px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:11 }}>
                      <div style={{ width:38, height:38, borderRadius:'50%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', ...avatarStyle(s.id) }}>
                        <span style={{ color:'#fff', fontSize:12, fontWeight:800 }}>{initials(s)}</span>
                      </div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:'#1e293b', whiteSpace:'nowrap' }}>{s.first_name} {s.last_name}</div>
                        <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>{s.email||'—'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'13px 14px' }}>
                    <span style={{ fontSize:12, fontWeight:800, color:'#2563eb', background:'#eff6ff', padding:'5px 10px', borderRadius:8, whiteSpace:'nowrap', cursor:'pointer' }}
                      onClick={()=>navigate(`/admission/${s.id}`)}>
                      {s.admission_no}
                    </span>
                  </td>
                  <td style={{ padding:'13px 14px' }}>
                    {s.class&&s.section ? (
                      <span style={{ fontSize:12, fontWeight:700, color:'#7c3aed', background:'#f5f3ff', border:'1px solid #ddd6fe', padding:'4px 10px', borderRadius:8, whiteSpace:'nowrap' }}>
                        {s.class.class_name} – {s.section.section_name}
                      </span>
                    ) : <span style={{ color:'#cbd5e1' }}>—</span>}
                  </td>
                  <td style={{ padding:'13px 14px' }}>
                    <span style={{ fontSize:13, fontWeight:500, color:'#475569', whiteSpace:'nowrap' }}>{s.father_name}</span>
                  </td>
                  <td style={{ padding:'13px 14px' }}>
                    <span style={{ fontSize:13, fontWeight:600, color:'#334155', whiteSpace:'nowrap' }}>{s.mobile}</span>
                  </td>
                  <td style={{ padding:'13px 14px', textAlign:'center' }}>
                    <span style={{ fontSize:11, fontWeight:800, padding:'4px 9px', borderRadius:8, display:'inline-flex', alignItems:'center', gap:4, background:s.bus_facility?'#ecfdf5':'#f8fafc', color:s.bus_facility?'#059669':'#94a3b8' }}>
                      <Bus size={11}/> {s.bus_facility?'YES':'NO'}
                    </span>
                  </td>
                  <td style={{ padding:'13px 14px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:s.status==='Active'?'#22c55e':'#e2e8f0', flexShrink:0 }}/>
                      <span style={{ fontSize:13, fontWeight:700, color:s.status==='Active'?'#16a34a':'#94a3b8' }}>{s.status}</span>
                    </div>
                  </td>
                  <td style={{ padding:'13px 14px', textAlign:'center' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:3 }}>
                      {[{I:Eye,c:'#2563eb',bg:'#eff6ff',fn:()=>navigate(`/admission/${s.id}`)},{I:Pencil,c:'#d97706',bg:'#fffbeb',fn:()=>navigate(`/admission/${s.id}/edit`)},{I:Trash2,c:'#dc2626',bg:'#fef2f2',fn:()=>setDeleteTarget(s)}].map(({I,c,bg,fn},i)=>(
                        <button key={i} onClick={fn} style={{ width:30, height:30, borderRadius:8, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#cbd5e1', transition:'all .12s' }}
                          onMouseEnter={e=>{e.currentTarget.style.background=bg;e.currentTarget.style.color=c;}}
                          onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#cbd5e1';}}><I size={14}/></button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 22px', borderTop:'1px solid #f1f5f9', background:'#fafbfc' }}>
          <span style={{ fontSize:13, fontWeight:600, color:'#64748b' }}>
            Showing <strong style={{ color:'#0f172a' }}>{Math.min((page-1)*LIMIT+1,total)}–{Math.min(page*LIMIT,total)}</strong> of <strong style={{ color:'#0f172a' }}>{total}</strong>
          </span>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ width:34,height:34,borderRadius:10,border:'1.5px solid #e2e8f0',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',cursor:page===1?'not-allowed':'pointer',opacity:page===1?.4:1 }}>
              <ChevronLeft size={15} color="#475569"/>
            </button>
            {[...Array(Math.min(5,pages))].map((_,i)=>{
              const n=i+1;
              return <button key={n} onClick={()=>setPage(n)} style={{ width:34,height:34,borderRadius:10,border:page===n?'none':'1.5px solid #e2e8f0',background:page===n?'#2563eb':'#fff',color:page===n?'#fff':'#475569',fontSize:13,fontWeight:700,cursor:'pointer',boxShadow:page===n?'0 2px 8px rgba(37,99,235,0.3)':'none' }}>{n}</button>;
            })}
            <button onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages} style={{ width:34,height:34,borderRadius:10,border:'1.5px solid #e2e8f0',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',cursor:page===pages?'not-allowed':'pointer',opacity:page===pages?.4:1 }}>
              <ChevronRight size={15} color="#475569"/>
            </button>
          </div>
        </div>
      </motion.div>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',padding:16,backdropFilter:'blur(4px)' }}
            onClick={()=>setDeleteTarget(null)}>
            <motion.div initial={{scale:.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.9,opacity:0}} transition={{duration:.2,ease:[.16,1,.3,1]}}
              onClick={e=>e.stopPropagation()}
              style={{ background:'#fff',borderRadius:24,padding:32,width:'100%',maxWidth:400,textAlign:'center',boxShadow:'0 24px 60px rgba(0,0,0,0.15)' }}>
              <div style={{ width:60,height:60,borderRadius:18,background:'#fef2f2',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px' }}>
                <AlertTriangle size={28} color="#dc2626"/>
              </div>
              <h3 style={{ fontSize:18,fontWeight:800,color:'#0f172a',margin:'0 0 8px' }}>Delete Student?</h3>
              <p style={{ fontSize:13,color:'#64748b',margin:'0 0 24px',lineHeight:1.7 }}>
                <strong style={{ color:'#1e293b' }}>{deleteTarget.first_name} {deleteTarget.last_name}</strong><br/>
                ({deleteTarget.admission_no}) will be permanently removed.
              </p>
              <div style={{ display:'flex',gap:12 }}>
                <button onClick={()=>setDeleteTarget(null)} style={{ flex:1,height:44,borderRadius:14,border:'1.5px solid #e2e8f0',background:'#fff',fontSize:14,fontWeight:700,color:'#475569',cursor:'pointer' }}>Cancel</button>
                <button onClick={handleDelete} style={{ flex:1,height:44,borderRadius:14,border:'none',background:'#dc2626',fontSize:14,fontWeight:700,color:'#fff',cursor:'pointer',boxShadow:'0 4px 14px rgba(220,38,38,0.3)' }}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Export Dropdown Item ── */
function ExportItem({ icon: Icon, label, sub, iconColor, iconBg, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 11,
        padding: '9px 10px', borderRadius: 10, border: 'none',
        background: hov ? '#f8fafc' : 'transparent',
        cursor: 'pointer', textAlign: 'left', transition: 'background 0.12s',
        marginBottom: 2,
      }}
    >
      <div style={{ width: 34, height: 34, borderRadius: 9, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={16} color={iconColor} />
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{label}</div>
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{sub}</div>
      </div>
    </button>
  );
}
