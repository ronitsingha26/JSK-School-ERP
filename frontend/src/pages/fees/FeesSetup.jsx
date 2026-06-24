import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Receipt, GraduationCap, CheckCircle2, Plus, Pencil, Trash2,
  AlertTriangle, Search, Calendar, Percent, Clock, ChevronDown
} from 'lucide-react';

/* ── Sample Data ── */
const FEE_HEADS = [
  { id:1, name:'Tuition Fee',    monthly:2500, yearly:30000, type:'Monthly',  mandatory:true },
  { id:2, name:'Exam Fee',       monthly:0,    yearly:1500,  type:'Per Exam', mandatory:true },
  { id:3, name:'Library Fee',    monthly:0,    yearly:600,   type:'Yearly',   mandatory:true },
  { id:4, name:'Lab Fee',        monthly:0,    yearly:1200,  type:'Yearly',   mandatory:false },
  { id:5, name:'Sports Fee',     monthly:0,    yearly:800,   type:'Yearly',   mandatory:true },
  { id:6, name:'Computer Fee',   monthly:400,  yearly:4800,  type:'Monthly',  mandatory:false },
];
const LATE_RULES = [
  { id:1, name:'Standard Late Fine', days:10, amount:50, type:'Fixed',      status:'Active' },
  { id:2, name:'Extended Grace',     days:15, amount:2,  type:'Percentage', status:'Active' },
  { id:3, name:'Strict Policy',      days:5,  amount:100,type:'Fixed',      status:'Inactive' },
];
const DISCOUNTS = [
  { id:1, name:'Sibling Discount',              type:'Percentage', value:10,  applicable:'Tuition Fee', students:8,  status:'Active',   color:['#3b82f6','#1d4ed8'] },
  { id:2, name:'Merit Scholarship',             type:'Percentage', value:25,  applicable:'All Fees',    students:5,  status:'Active',   color:['#8b5cf6','#6d28d9'] },
  { id:3, name:'Staff Ward Discount',           type:'Percentage', value:50,  applicable:'Tuition Fee', students:12, status:'Active',   color:['#10b981','#059669'] },
  { id:4, name:'State Government Scholarship',  type:'Fixed',      value:5000,applicable:'All Fees',    students:3,  status:'Active',   color:['#f59e0b','#d97706'] },
  { id:5, name:'Minority Discount',             type:'Percentage', value:15,  applicable:'Tuition Fee', students:6,  status:'Inactive', color:['#ef4444','#dc2626'] },
  { id:6, name:'Early Bird Discount',           type:'Percentage', value:5,   applicable:'Yearly Fees', students:0,  status:'Inactive', color:['#06b6d4','#0891b2'] },
];
const CLASSES = ['Nursery','LKG','UKG','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
const TABS = ['Fee Structure', 'Late Fine Rules', 'Discount Types'];

const fade = { hidden:{opacity:0,y:10}, show:{opacity:1,y:0,transition:{duration:0.3}} };

export default function FeesSetup() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedClass, setSelectedClass] = useState('');
  const [academicYear, setAcademicYear] = useState('2025-26');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [yearOpen, setYearOpen] = useState(false);

  const selStyle = { height:40, padding:'0 32px 0 12px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:13, fontWeight:600, color:'#475569', background:'#fff', outline:'none', appearance:'none', cursor:'pointer', fontFamily:'inherit' };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show:{transition:{staggerChildren:.07}} }} style={{ paddingBottom:40, minWidth:0 }}>

      {/* ── HEADER ── */}
      <motion.div variants={fade} style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:800, color:'#0f172a', margin:0, letterSpacing:'-0.5px' }}>Fee Structure Setup</h1>
          <p style={{ fontSize:14, color:'#94a3b8', marginTop:6, fontWeight:500 }}>Configure fee heads, class-wise amounts, and rules · Academic Year {academicYear}</p>
        </div>
        <div style={{ position:'relative' }}>
          <button onClick={() => setYearOpen(!yearOpen)} style={{ display:'flex', alignItems:'center', gap:8, background:'#eff6ff', color:'#2563eb', border:'1.5px solid #bfdbfe', borderRadius:99, padding:'9px 18px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
            <Calendar size={15}/> {academicYear} <ChevronDown size={14} style={{ transition:'transform 0.2s', transform: yearOpen ? 'rotate(180deg)' : 'none' }}/>
          </button>
          {yearOpen && (
            <div style={{ position:'absolute', top:'calc(100% + 6px)', right:0, background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, boxShadow:'0 8px 30px rgba(15,23,42,0.1)', padding:6, zIndex:20, minWidth:140 }}>
              {['2024-25','2025-26','2026-27'].map(y => (
                <div key={y} onClick={() => { setAcademicYear(y); setYearOpen(false); }}
                  style={{ padding:'9px 14px', borderRadius:8, fontSize:13, fontWeight:600, color: y === academicYear ? '#2563eb' : '#475569', background: y === academicYear ? '#eff6ff' : 'transparent', cursor:'pointer' }}
                  onMouseEnter={e => { if(y !== academicYear) e.currentTarget.style.background='#f8fafc'; }}
                  onMouseLeave={e => { if(y !== academicYear) e.currentTarget.style.background='transparent'; }}
                >{y}</div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* ── TABS ── */}
      <motion.div variants={fade} style={{ display:'flex', gap:6, marginBottom:20, background:'#f1f5f9', padding:4, borderRadius:14, width:'fit-content' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setActiveTab(i)} style={{
            padding:'9px 20px', borderRadius:10, border:'none', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit',
            background: activeTab === i ? '#2563eb' : 'transparent',
            color: activeTab === i ? '#fff' : '#64748b',
            boxShadow: activeTab === i ? '0 2px 8px rgba(37,99,235,0.3)' : 'none',
            transition: 'all 0.18s',
          }}>{t}</button>
        ))}
      </motion.div>

      {/* ── STAT CARDS ── */}
      <motion.div variants={fade} style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:20 }}>
        {[
          { label:'Fee Heads Active', value: FEE_HEADS.length,  icon: Receipt,       color:'#2563eb', bg:'#eff6ff' },
          { label:'Classes Configured', value: CLASSES.length,  icon: GraduationCap, color:'#7c3aed', bg:'#f5f3ff' },
          { label:'Active Session',   value: academicYear,      icon: CheckCircle2,  color:'#059669', bg:'#ecfdf5' },
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

      {/* ── FILTER CARD ── */}
      <motion.div variants={fade} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:18, padding:'18px 24px', marginBottom:20, boxShadow:'0 1px 4px rgba(0,0,0,0.04)', display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={selStyle}>
          <option value="">Select Class</option>
          {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={academicYear} onChange={e => setAcademicYear(e.target.value)} style={selStyle}>
          <option value="2024-25">2024-25</option>
          <option value="2025-26">2025-26</option>
          <option value="2026-27">2026-27</option>
        </select>
        <button style={{ display:'flex', alignItems:'center', gap:8, height:40, padding:'0 20px', background:'#2563eb', color:'#fff', border:'none', borderRadius:10, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 2px 8px rgba(37,99,235,0.25)' }}>
          <Search size={14}/> Load Structure
        </button>
      </motion.div>

      {/* ── TAB CONTENT ── */}
      {activeTab === 0 && <FeeStructureTab selectedClass={selectedClass} onDelete={setDeleteTarget} />}
      {activeTab === 1 && <LateFineTab />}
      {activeTab === 2 && <DiscountTab onDelete={setDeleteTarget} />}

      {/* ── DELETE MODAL ── */}
      {deleteTarget && (
        <div style={{ position:'fixed', inset:0, zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(15,23,42,0.5)', backdropFilter:'blur(4px)' }}>
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} style={{ background:'#fff', borderRadius:20, padding:32, width:400, boxShadow:'0 20px 60px rgba(0,0,0,0.15)', textAlign:'center' }}>
            <div style={{ width:56, height:56, borderRadius:'50%', background:'#fef2f2', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <AlertTriangle size={28} color="#ef4444"/>
            </div>
            <h3 style={{ fontSize:18, fontWeight:800, color:'#0f172a', margin:'0 0 8px' }}>Delete "{deleteTarget.name}"?</h3>
            <p style={{ fontSize:14, color:'#64748b', margin:'0 0 24px', fontWeight:500 }}>This action cannot be undone.</p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <button onClick={() => setDeleteTarget(null)} style={{ padding:'10px 24px', borderRadius:12, border:'1.5px solid #e2e8f0', background:'#fff', fontSize:13, fontWeight:700, color:'#475569', cursor:'pointer' }}>Cancel</button>
              <button onClick={() => setDeleteTarget(null)} style={{ padding:'10px 24px', borderRadius:12, border:'none', background:'#ef4444', fontSize:13, fontWeight:700, color:'#fff', cursor:'pointer', boxShadow:'0 4px 12px rgba(239,68,68,0.3)' }}>Delete</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

function FeeStructureTab({ selectedClass, onDelete }) {
  const [heads, setHeads] = useState(FEE_HEADS.map(h => ({ ...h })));
  const [editingId, setEditingId] = useState(null);
  const [modal, setModal] = useState(null); // null | 'add' | head obj
  const [copyFrom, setCopyFrom] = useState('');
  const [formData, setFormData] = useState({ name:'', description:'', amount:0, active:true });

  const updateAmount = (id, val) => {
    const v = parseInt(val) || 0;
    setHeads(prev => prev.map(h => h.id === id ? { ...h, monthly: v, yearly: v * 12 } : h));
  };

  const openEdit = (h) => { setFormData({ name:h.name, description:'', amount:h.monthly, active:h.mandatory }); setModal(h); };
  const openAdd = () => { setFormData({ name:'', description:'', amount:0, active:true }); setModal('add'); };

  const cls = selectedClass || 'I';

  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.25 }}>
      {/* Section header */}
      <div style={{ marginBottom:14 }}>
        <h3 style={{ fontSize:16, fontWeight:800, color:'#0f172a', margin:0 }}>Fee Structure — Class {cls} | Academic Year 2025-26</h3>
        <p style={{ fontSize:13, color:'#94a3b8', marginTop:4, fontWeight:500 }}>Set monthly amount for each fee head</p>
      </div>

      {/* Table */}
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:18, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)', marginBottom:14 }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13, fontWeight:500, color:'#475569' }}>
            <thead>
              <tr style={{ background:'#fafbfc', borderBottom:'1.5px solid #e2e8f0' }}>
                {['#','Fee Head','Monthly Amount','Annual Amount','Status','Actions'].map(h => (
                  <th key={h} style={{ padding:'14px 16px', textAlign:'left', fontSize:11, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heads.map((h, i) => (
                <tr key={h.id} style={{ borderBottom:'1px solid #f1f5f9', transition:'background 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#fafbfc'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'14px 16px', color:'#94a3b8', fontWeight:700 }}>{i+1}</td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#3b82f6,#1d4ed8)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <Receipt size={15} color="#fff"/>
                      </div>
                      <span style={{ fontWeight:700, color:'#0f172a' }}>{h.name}</span>
                    </div>
                  </td>
                  {/* Monthly - inline editable */}
                  <td style={{ padding:'14px 12px' }}>
                    {editingId === h.id ? (
                      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                        <span style={{ fontSize:14, fontWeight:700, color:'#94a3b8' }}>₹</span>
                        <input autoFocus value={h.monthly} onChange={e => updateAmount(h.id, e.target.value)}
                          onBlur={() => setEditingId(null)} onKeyDown={e => e.key === 'Enter' && setEditingId(null)}
                          style={{ width:90, height:32, border:'1.5px solid #2563eb', borderRadius:8, padding:'0 8px', fontSize:13, fontWeight:700, color:'#0f172a', outline:'none', fontFamily:'inherit', background:'#eff6ff' }}
                        />
                      </div>
                    ) : (
                      <div style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer' }} onClick={() => setEditingId(h.id)}>
                        <span style={{ fontWeight:700, color:'#0f172a' }}>₹{h.monthly.toLocaleString('en-IN')}</span>
                        <Pencil size={12} color="#94a3b8"/>
                      </div>
                    )}
                  </td>
                  {/* Annual - auto calc */}
                  <td style={{ padding:'14px 16px', fontWeight:600, color:'#94a3b8' }}>₹{(h.monthly * 12).toLocaleString('en-IN')}</td>
                  {/* Status */}
                  <td style={{ padding:'14px 16px' }}>
                    {h.monthly > 0 ? (
                      <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:12, fontWeight:700, color:'#059669' }}>
                        <span style={{ width:7, height:7, borderRadius:'50%', background:'#10b981' }}/> Active
                      </span>
                    ) : (
                      <span style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:6, background:'#fffbeb', color:'#d97706' }}>Not Set</span>
                    )}
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', gap:4 }}>
                      <button onClick={() => openEdit(h)} style={{ width:32, height:32, borderRadius:8, border:'1px solid #e2e8f0', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#3b82f6' }}><Pencil size={14}/></button>
                      <button onClick={() => onDelete(h)} style={{ width:32, height:32, borderRadius:8, border:'1px solid #e2e8f0', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#ef4444' }}><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom actions */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <button onClick={openAdd} style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 18px', border:'1.5px solid #e2e8f0', borderRadius:12, background:'#fff', fontSize:13, fontWeight:700, color:'#475569', cursor:'pointer' }}>
          <Plus size={14}/> Add Fee Head
        </button>
        <button style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 20px', background:'#2563eb', color:'#fff', border:'none', borderRadius:12, fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:'0 2px 8px rgba(37,99,235,0.25)' }}>
          <CheckCircle2 size={14}/> Save All Changes
        </button>
      </div>

      {/* Copy structure helper */}
      <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:14, padding:'16px 20px', display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
        <span style={{ fontSize:13, fontWeight:600, color:'#1e40af' }}>📋 Copy structure from</span>
        <select value={copyFrom} onChange={e => setCopyFrom(e.target.value)} style={{ height:34, padding:'0 28px 0 10px', border:'1.5px solid #bfdbfe', borderRadius:8, fontSize:12, fontWeight:600, color:'#1e40af', background:'#fff', outline:'none', appearance:'none', cursor:'pointer', fontFamily:'inherit' }}>
          <option value="">Select Class</option>
          {CLASSES.filter(c => c !== cls).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{ fontSize:13, fontWeight:600, color:'#1e40af' }}>→ Class {cls}</span>
        <button disabled={!copyFrom} style={{ padding:'7px 14px', borderRadius:8, border:'none', background: copyFrom ? '#2563eb' : '#94a3b8', color:'#fff', fontSize:12, fontWeight:700, cursor: copyFrom ? 'pointer' : 'not-allowed', opacity: copyFrom ? 1 : 0.5 }}>Copy</button>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div style={{ position:'fixed', inset:0, zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(15,23,42,0.5)', backdropFilter:'blur(4px)' }}>
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} style={{ background:'#fff', borderRadius:20, padding:32, width:440, boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize:18, fontWeight:800, color:'#0f172a', margin:'0 0 20px' }}>{modal === 'add' ? 'Add Fee Head' : 'Edit Fee Head'}</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:'#64748b', display:'block', marginBottom:6 }}>Fee Head Name</label>
                <input value={formData.name} onChange={e => setFormData(p => ({...p, name:e.target.value}))}
                  style={{ width:'100%', height:40, border:'1.5px solid #e2e8f0', borderRadius:10, padding:'0 12px', fontSize:13, fontWeight:600, color:'#0f172a', outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}/>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:'#64748b', display:'block', marginBottom:6 }}>Description</label>
                <input value={formData.description} onChange={e => setFormData(p => ({...p, description:e.target.value}))}
                  placeholder="Optional description"
                  style={{ width:'100%', height:40, border:'1.5px solid #e2e8f0', borderRadius:10, padding:'0 12px', fontSize:13, fontWeight:500, color:'#0f172a', outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}/>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:'#64748b', display:'block', marginBottom:6 }}>Default Monthly Amount</label>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ fontSize:16, fontWeight:700, color:'#94a3b8' }}>₹</span>
                  <input type="number" value={formData.amount} onChange={e => setFormData(p => ({...p, amount:parseInt(e.target.value)||0}))}
                    style={{ flex:1, height:40, border:'1.5px solid #e2e8f0', borderRadius:10, padding:'0 12px', fontSize:13, fontWeight:700, color:'#0f172a', outline:'none', fontFamily:'inherit' }}/>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0' }}>
                <span style={{ fontSize:13, fontWeight:700, color:'#475569' }}>Active</span>
                <div onClick={() => setFormData(p => ({...p, active:!p.active}))} style={{ width:44, height:24, borderRadius:99, background: formData.active ? '#2563eb' : '#cbd5e1', cursor:'pointer', position:'relative', transition:'background 0.2s' }}>
                  <div style={{ width:18, height:18, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left: formData.active ? 23 : 3, transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.15)' }}/>
                </div>
              </div>
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:20 }}>
              <button onClick={() => setModal(null)} style={{ padding:'10px 24px', borderRadius:12, border:'1.5px solid #e2e8f0', background:'#fff', fontSize:13, fontWeight:700, color:'#475569', cursor:'pointer' }}>Cancel</button>
              <button onClick={() => setModal(null)} style={{ padding:'10px 24px', borderRadius:12, border:'none', background:'#2563eb', fontSize:13, fontWeight:700, color:'#fff', cursor:'pointer', boxShadow:'0 4px 12px rgba(37,99,235,0.3)' }}>Save</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   TAB 2: Late Fine Rules Table
   ═══════════════════════════════════════════════════ */
function LateFineTab() {
  const [dueDay, setDueDay] = useState(10);
  const [fineType, setFineType] = useState('perday');
  const [fineAmt, setFineAmt] = useState(5);
  const [grace, setGrace] = useState(3);
  const [maxFine, setMaxFine] = useState(500);
  const [applyTo, setApplyTo] = useState('all');

  const latedays = 10;
  const effectiveDays = Math.max(0, latedays - grace);
  const calculated = fineType === 'perday' ? effectiveDays * fineAmt : fineAmt;
  const finalFine = Math.min(calculated, maxFine);

  const inputStyle = { width:'100%', height:40, border:'1.5px solid #e2e8f0', borderRadius:10, padding:'0 12px', fontSize:13, fontWeight:600, color:'#0f172a', outline:'none', fontFamily:'inherit', boxSizing:'border-box' };
  const radioStyle = (active) => ({ display:'flex', alignItems:'center', gap:8, padding:'10px 16px', borderRadius:10, border:`1.5px solid ${active ? '#2563eb' : '#e2e8f0'}`, background: active ? '#eff6ff' : '#fff', cursor:'pointer', fontSize:13, fontWeight:600, color: active ? '#2563eb' : '#475569', transition:'all 0.15s' });

  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.25 }}>
      {/* Header card */}
      <div style={{ background:'#fffbeb', border:'1px solid #fde68a', borderRadius:14, padding:'16px 20px', display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <AlertTriangle size={18} color="#d97706"/>
        <div>
          <p style={{ fontSize:14, fontWeight:700, color:'#92400e', margin:0 }}>Late Fine Configuration</p>
          <p style={{ fontSize:12, fontWeight:500, color:'#a16207', margin:'2px 0 0' }}>Fine is applied when fee is collected after the due date</p>
        </div>
      </div>

      {/* Config card */}
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:18, padding:'28px 28px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)', marginBottom:20 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24 }}>
          {/* Due date */}
          <div>
            <label style={{ fontSize:12, fontWeight:700, color:'#64748b', display:'block', marginBottom:6 }}>Due Date (Day of Month)</label>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:13, fontWeight:500, color:'#64748b' }}>Every month</span>
              <input type="number" min={1} max={28} value={dueDay} onChange={e => setDueDay(parseInt(e.target.value)||1)} style={{ ...inputStyle, width:70, textAlign:'center' }}/>
              <span style={{ fontSize:13, fontWeight:500, color:'#64748b' }}>day</span>
            </div>
          </div>
          {/* Grace period */}
          <div>
            <label style={{ fontSize:12, fontWeight:700, color:'#64748b', display:'block', marginBottom:6 }}>Grace Period (Days)</label>
            <input type="number" value={grace} onChange={e => setGrace(parseInt(e.target.value)||0)} style={inputStyle}/>
          </div>
        </div>

        {/* Fine type radio */}
        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:12, fontWeight:700, color:'#64748b', display:'block', marginBottom:8 }}>Fine Type</label>
          <div style={{ display:'flex', gap:10 }}>
            <div style={radioStyle(fineType === 'perday')} onClick={() => setFineType('perday')}>
              <div style={{ width:16, height:16, borderRadius:'50%', border:`2px solid ${fineType === 'perday' ? '#2563eb' : '#cbd5e1'}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {fineType === 'perday' && <div style={{ width:8, height:8, borderRadius:'50%', background:'#2563eb' }}/>}
              </div>
              Per Day Fine
            </div>
            <div style={radioStyle(fineType === 'fixed')} onClick={() => setFineType('fixed')}>
              <div style={{ width:16, height:16, borderRadius:'50%', border:`2px solid ${fineType === 'fixed' ? '#2563eb' : '#cbd5e1'}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {fineType === 'fixed' && <div style={{ width:8, height:8, borderRadius:'50%', background:'#2563eb' }}/>}
              </div>
              Fixed Fine
            </div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24 }}>
          <div>
            <label style={{ fontSize:12, fontWeight:700, color:'#64748b', display:'block', marginBottom:6 }}>{fineType === 'perday' ? 'Per Day Fine Amount' : 'Fixed Fine Amount'}</label>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:14, fontWeight:700, color:'#94a3b8' }}>₹</span>
              <input type="number" value={fineAmt} onChange={e => setFineAmt(parseInt(e.target.value)||0)} style={{ ...inputStyle, flex:1 }}/>
            </div>
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:700, color:'#64748b', display:'block', marginBottom:6 }}>Max Fine Cap</label>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:14, fontWeight:700, color:'#94a3b8' }}>₹</span>
              <input type="number" value={maxFine} onChange={e => setMaxFine(parseInt(e.target.value)||0)} style={{ ...inputStyle, flex:1 }}/>
            </div>
          </div>
        </div>

        {/* Apply to */}
        <div>
          <label style={{ fontSize:12, fontWeight:700, color:'#64748b', display:'block', marginBottom:8 }}>Apply To</label>
          <div style={{ display:'flex', gap:10 }}>
            <div style={radioStyle(applyTo === 'all')} onClick={() => setApplyTo('all')}>
              <div style={{ width:16, height:16, borderRadius:'50%', border:`2px solid ${applyTo === 'all' ? '#2563eb' : '#cbd5e1'}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {applyTo === 'all' && <div style={{ width:8, height:8, borderRadius:'50%', background:'#2563eb' }}/>}
              </div>
              All Classes
            </div>
            <div style={radioStyle(applyTo === 'perclass')} onClick={() => setApplyTo('perclass')}>
              <div style={{ width:16, height:16, borderRadius:'50%', border:`2px solid ${applyTo === 'perclass' ? '#2563eb' : '#cbd5e1'}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {applyTo === 'perclass' && <div style={{ width:8, height:8, borderRadius:'50%', background:'#2563eb' }}/>}
              </div>
              Per Class
            </div>
          </div>
        </div>
      </div>

      {/* Live preview */}
      <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:14, padding:'18px 22px', marginBottom:20 }}>
        <p style={{ fontSize:13, fontWeight:700, color:'#1e40af', margin:'0 0 6px' }}>📊 Live Calculation Preview</p>
        <p style={{ fontSize:14, fontWeight:500, color:'#1e3a5f', margin:0, lineHeight:1.7 }}>
          If fee due on <strong>{dueDay}th</strong> and paid on <strong>{dueDay + latedays}th</strong> → <strong>{latedays} days late</strong>
          {grace > 0 && <> – {grace} grace = <strong>{effectiveDays} effective days</strong></>}
          {fineType === 'perday' ? <> × ₹{fineAmt} = </> : <> → fixed ₹{fineAmt} = </>}
          <strong style={{ color:'#dc2626' }}>₹{finalFine} fine</strong>
          {calculated > maxFine && <span style={{ color:'#94a3b8' }}> (capped from ₹{calculated})</span>}
        </p>
      </div>

      {/* Save */}
      <button style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 24px', background:'#2563eb', color:'#fff', border:'none', borderRadius:14, fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 16px rgba(37,99,235,0.3)' }}>
        <CheckCircle2 size={15}/> Save Fine Rules
      </button>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   TAB 3: Discount Types Table
   ═══════════════════════════════════════════════════ */
function DiscountTab({ onDelete }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name:'', type:'Percentage', value:0, feeHeads:['Tuition Fee'] });
  const feeHeadOptions = ['Tuition Fee','Exam Fee','Library Fee','Lab Fee','Sports Fee','Computer Fee','Transport Fee'];

  const openAdd = () => { setForm({ name:'', type:'Percentage', value:0, feeHeads:['Tuition Fee'] }); setModal('add'); };
  const openEdit = (d) => { setForm({ name:d.name, type:d.type, value:d.value, feeHeads:[d.applicable] }); setModal(d); };
  const toggleHead = (h) => setForm(p => ({ ...p, feeHeads: p.feeHeads.includes(h) ? p.feeHeads.filter(x => x !== h) : [...p.feeHeads, h] }));

  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.25 }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div>
          <h3 style={{ fontSize:16, fontWeight:800, color:'#0f172a', margin:0 }}>Discount & Concession Types</h3>
          <p style={{ fontSize:13, color:'#94a3b8', marginTop:4, fontWeight:500 }}>{DISCOUNTS.length} discount types configured</p>
        </div>
        <button onClick={openAdd} style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 20px', background:'#2563eb', color:'#fff', border:'none', borderRadius:12, fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:'0 2px 8px rgba(37,99,235,0.25)' }}>
          <Plus size={14}/> Add Discount Type
        </button>
      </div>

      {/* Card Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>
        {DISCOUNTS.map(d => (
          <div key={d.id} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:18, padding:'22px 24px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)', transition:'box-shadow 0.15s' }}
               onMouseEnter={e => e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'}
               onMouseLeave={e => e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.04)'}>
            {/* Top row */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:42, height:42, borderRadius:12, background:`linear-gradient(135deg,${d.color[0]},${d.color[1]})`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Percent size={18} color="#fff"/>
                </div>
                <div>
                  <p style={{ fontSize:15, fontWeight:800, color:'#0f172a', margin:0 }}>{d.name}</p>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:700, color: d.status === 'Active' ? '#059669' : '#94a3b8', marginTop:3 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background: d.status === 'Active' ? '#10b981' : '#cbd5e1' }}/> {d.status}
                  </span>
                </div>
              </div>
              <div style={{ display:'flex', gap:4 }}>
                <button onClick={() => openEdit(d)} style={{ width:30, height:30, borderRadius:8, border:'1px solid #e2e8f0', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#3b82f6' }}><Pencil size={13}/></button>
                <button onClick={() => onDelete(d)} style={{ width:30, height:30, borderRadius:8, border:'1px solid #e2e8f0', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#ef4444' }}><Trash2 size={13}/></button>
              </div>
            </div>
            {/* Details */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <DetailItem label="Type" value={d.type} />
              <DetailItem label="Value" value={d.type === 'Percentage' ? `${d.value}%` : `₹${d.value.toLocaleString('en-IN')}`} bold color={d.color[0]} />
              <DetailItem label="Applicable" value={d.applicable} />
              <DetailItem label="Students" value={d.students} />
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div style={{ position:'fixed', inset:0, zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(15,23,42,0.5)', backdropFilter:'blur(4px)' }}>
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} style={{ background:'#fff', borderRadius:20, padding:32, width:480, boxShadow:'0 20px 60px rgba(0,0,0,0.15)', maxHeight:'85vh', overflowY:'auto' }}>
            <h3 style={{ fontSize:18, fontWeight:800, color:'#0f172a', margin:'0 0 20px' }}>{modal === 'add' ? 'Add Discount Type' : 'Edit Discount Type'}</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {/* Name */}
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:'#64748b', display:'block', marginBottom:6 }}>Discount Name</label>
                <input value={form.name} onChange={e => setForm(p => ({...p, name:e.target.value}))}
                  style={{ width:'100%', height:40, border:'1.5px solid #e2e8f0', borderRadius:10, padding:'0 12px', fontSize:13, fontWeight:600, color:'#0f172a', outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}/>
              </div>
              {/* Type toggle */}
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:'#64748b', display:'block', marginBottom:8 }}>Discount Type</label>
                <div style={{ display:'flex', gap:0, background:'#f1f5f9', borderRadius:10, padding:3, width:'fit-content' }}>
                  {['Percentage','Fixed'].map(t => (
                    <button key={t} onClick={() => setForm(p => ({...p, type:t}))} style={{
                      padding:'8px 20px', borderRadius:8, border:'none', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit',
                      background: form.type === t ? '#2563eb' : 'transparent', color: form.type === t ? '#fff' : '#64748b',
                      boxShadow: form.type === t ? '0 2px 6px rgba(37,99,235,0.25)' : 'none', transition:'all 0.15s',
                    }}>{t === 'Percentage' ? '% Percentage' : '₹ Fixed Amount'}</button>
                  ))}
                </div>
              </div>
              {/* Value */}
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:'#64748b', display:'block', marginBottom:6 }}>Value</label>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ fontSize:14, fontWeight:700, color:'#94a3b8' }}>{form.type === 'Percentage' ? '%' : '₹'}</span>
                  <input type="number" value={form.value} onChange={e => setForm(p => ({...p, value:parseInt(e.target.value)||0}))}
                    style={{ flex:1, height:40, border:'1.5px solid #e2e8f0', borderRadius:10, padding:'0 12px', fontSize:13, fontWeight:700, color:'#0f172a', outline:'none', fontFamily:'inherit' }}/>
                </div>
              </div>
              {/* Fee heads multi-select */}
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:'#64748b', display:'block', marginBottom:8 }}>Applicable Fee Heads</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {feeHeadOptions.map(h => {
                    const checked = form.feeHeads.includes(h);
                    return (
                      <div key={h} onClick={() => toggleHead(h)} style={{
                        display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:10, cursor:'pointer',
                        border:`1.5px solid ${checked ? '#2563eb' : '#e2e8f0'}`, background: checked ? '#eff6ff' : '#fff',
                        fontSize:12, fontWeight:600, color: checked ? '#2563eb' : '#475569', transition:'all 0.15s',
                      }}>
                        <div style={{ width:16, height:16, borderRadius:4, border:`2px solid ${checked ? '#2563eb' : '#cbd5e1'}`, background: checked ? '#2563eb' : '#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          {checked && <CheckCircle2 size={10} color="#fff"/>}
                        </div>
                        {h}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Footer */}
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:24, borderTop:'1px solid #f1f5f9', paddingTop:20 }}>
              <button onClick={() => setModal(null)} style={{ padding:'10px 24px', borderRadius:12, border:'1.5px solid #e2e8f0', background:'#fff', fontSize:13, fontWeight:700, color:'#475569', cursor:'pointer' }}>Cancel</button>
              <button onClick={() => setModal(null)} style={{ padding:'10px 24px', borderRadius:12, border:'none', background:'#2563eb', fontSize:13, fontWeight:700, color:'#fff', cursor:'pointer', boxShadow:'0 4px 12px rgba(37,99,235,0.3)' }}>Save</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

/* ── Detail Item helper ── */
function DetailItem({ label, value, bold, color }) {
  return (
    <div>
      <p style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em', margin:'0 0 3px' }}>{label}</p>
      <p style={{ fontSize:13, fontWeight: bold ? 800 : 600, color: color || '#0f172a', margin:0 }}>{value}</p>
    </div>
  );
}
