import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Search, AlertCircle, IndianRupee, Users, CreditCard, Download, Filter, X, Check, Loader } from 'lucide-react';

const DUES_DATA = [
  { id:1, name:'Aaditya Kumar',   admNo:'JSK20240012', cls:'I – A',   year:'2024-25', due:8500,  lastPaid:'2024-12-15' },
  { id:2, name:'Priya Sharma',    admNo:'JSK20240034', cls:'III – B', year:'2024-25', due:12400, lastPaid:'2025-01-08' },
  { id:3, name:'Rohit Mishra',    admNo:'JSK20230056', cls:'VII – A', year:'2023-24', due:5200,  lastPaid:'2024-03-20' },
  { id:4, name:'Sneha Gupta',     admNo:'JSK20240078', cls:'II – C',  year:'2024-25', due:3600,  lastPaid:'2025-02-14' },
  { id:5, name:'Vikash Yadav',    admNo:'JSK20230045', cls:'IV – A',  year:'2023-24', due:15800, lastPaid:'2024-06-10' },
  { id:6, name:'Anjali Singh',    admNo:'JSK20240091', cls:'VI – B',  year:'2024-25', due:7200,  lastPaid:'2024-11-28' },
  { id:7, name:'Kavita Patel',    admNo:'JSK20230023', cls:'VIII–C',  year:'2023-24', due:4500,  lastPaid:'2024-02-05' },
  { id:8, name:'Rahul Verma',     admNo:'JSK20240067', cls:'V – A',   year:'2024-25', due:9800,  lastPaid:'2025-01-22' },
];

const COLORS = [['#3b82f6','#1d4ed8'],['#8b5cf6','#6d28d9'],['#10b981','#059669'],['#f59e0b','#d97706'],['#ef4444','#dc2626'],['#06b6d4','#0891b2'],['#6366f1','#4f46e5'],['#84cc16','#65a30d']];
const fade = { hidden:{opacity:0,y:10}, show:{opacity:1,y:0,transition:{duration:0.3}} };

export default function PreviousDues() {
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');

  const filtered = DUES_DATA.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !q || d.name.toLowerCase().includes(q) || d.admNo.toLowerCase().includes(q);
    const matchYear = !yearFilter || d.year === yearFilter;
    
    // Parse class and section from 'I – A' format
    const [c, sec] = d.cls.split(' – ').map(str => str ? str.trim() : '');
    
    const matchClass = !classFilter || c === classFilter;
    const matchSection = !sectionFilter || sec === sectionFilter;
    
    return matchSearch && matchYear && matchClass && matchSection;
  });

  const totalDue = filtered.reduce((s, d) => s + d.due, 0);
  const initials = n => n.split(' ').map(w => w[0]).join('').toUpperCase();
  const avatarBg = id => { const [a,b] = COLORS[id % COLORS.length]; return `linear-gradient(135deg,${a},${b})`; };

  // Collection Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [amount, setAmount] = useState('');
  const [payMode, setPayMode] = useState('Cash');
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const openCollect = (student) => {
    setSelectedStudent(student);
    setAmount(String(student.due));
    setPayMode('Cash');
    setRemark('');
    setSuccess(null);
    setShowModal(true);
  };

  const handlePay = () => {
    if (!amount || !selectedStudent) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess({ 
        receipt: 'REC-' + Math.floor(1000 + Math.random() * 9000), 
        amount: parseInt(amount), 
        type: `Previous Dues (${selectedStudent.year})` 
      });
    }, 1500);
  };

  const resetForm = () => {
    setSelectedStudent(null); setAmount(''); setRemark(''); setSuccess(null); setShowModal(false);
  };

  const exportToCSV = () => {
    const headers = ['Admission No', 'Student Name', 'Class', 'Due Year', 'Due Amount', 'Last Paid'];
    const rows = filtered.map(d => [d.admNo, d.name, d.cls, d.year, d.due, d.lastPaid]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(v => `"${v}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Previous_Dues_Report_${new Date().getTime()}.csv`;
    link.click();
  };

  const inputS = { width:'100%', height:42, border:'1.5px solid #e2e8f0', borderRadius:10, padding:'0 14px', fontSize:13, fontWeight:600, color:'#0f172a', outline:'none', fontFamily:'inherit', boxSizing:'border-box' };
  const labelS = { fontSize:11, fontWeight:700, color:'#64748b', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.05em' };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show:{transition:{staggerChildren:.07}} }} style={{ paddingBottom:40 }}>
      {/* Header */}
      <motion.div variants={fade} style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:26, fontWeight:800, color:'#0f172a', margin:0, letterSpacing:'-0.5px' }}>Previous Year Dues</h1>
        <p style={{ fontSize:14, color:'#94a3b8', marginTop:6, fontWeight:500 }}>Track and collect outstanding fees from previous academic years</p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={fade} style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
        {[
          { label:'Total Outstanding', value:`₹${totalDue.toLocaleString('en-IN')}`, icon:AlertCircle, color:'#ef4444', bg:'#fef2f2' },
          { label:'Students with Dues', value:filtered.length, icon:Users, color:'#d97706', bg:'#fffbeb' },
          { label:'Oldest Due Year', value:'2023-24', icon:Clock, color:'#7c3aed', bg:'#f5f3ff' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:18, padding:'20px 22px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)', borderTop:`3px solid ${s.color}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:48, height:48, borderRadius:13, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={22} color={s.color}/>
                </div>
                <div>
                  <div style={{ fontSize:26, fontWeight:800, color:'#0f172a', lineHeight:1 }}>{s.value}</div>
                  <div style={{ fontSize:10, fontWeight:700, color:'#94a3b8', marginTop:5, textTransform:'uppercase', letterSpacing:'0.07em' }}>{s.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Filters */}
      <motion.div variants={fade} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:18, padding:'16px 20px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)', marginBottom:20, display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <Search size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#94a3b8', pointerEvents:'none' }}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student name or admission no..."
            style={{ width:'100%', height:40, paddingLeft:36, border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:13, fontWeight:500, color:'#0f172a', outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}/>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <Filter size={14} color="#94a3b8"/>
          <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}
            style={{ height:40, border:'1.5px solid #e2e8f0', borderRadius:10, padding:'0 12px', fontSize:13, fontWeight:600, color:'#0f172a', outline:'none', fontFamily:'inherit', background:'#fff', minWidth:110 }}>
            <option value="">All Years</option>
            <option value="2024-25">2024-25</option>
            <option value="2023-24">2023-24</option>
          </select>
          <select value={classFilter} onChange={e => setClassFilter(e.target.value)}
            style={{ height:40, border:'1.5px solid #e2e8f0', borderRadius:10, padding:'0 12px', fontSize:13, fontWeight:600, color:'#0f172a', outline:'none', fontFamily:'inherit', background:'#fff', minWidth:110 }}>
            <option value="">All Classes</option>
            <option value="Nursery">Nursery</option>
            <option value="LKG">LKG</option>
            <option value="UKG">UKG</option>
            <option value="I">Class I</option>
            <option value="II">Class II</option>
            <option value="III">Class III</option>
            <option value="IV">Class IV</option>
            <option value="V">Class V</option>
            <option value="VI">Class VI</option>
            <option value="VII">Class VII</option>
            <option value="VIII">Class VIII</option>
            <option value="IX">Class IX</option>
            <option value="X">Class X</option>
            <option value="XI">Class XI</option>
            <option value="XII">Class XII</option>
          </select>
          <select value={sectionFilter} onChange={e => setSectionFilter(e.target.value)}
            style={{ height:40, border:'1.5px solid #e2e8f0', borderRadius:10, padding:'0 12px', fontSize:13, fontWeight:600, color:'#0f172a', outline:'none', fontFamily:'inherit', background:'#fff', minWidth:110 }}>
            <option value="">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
            <option value="D">Section D</option>
          </select>
        </div>
        <button onClick={exportToCSV} style={{ display:'flex', alignItems:'center', gap:5, height:40, padding:'0 16px', border:'1.5px solid #e2e8f0', borderRadius:10, background:'#fff', fontSize:12, fontWeight:700, color:'#475569', cursor:'pointer', fontFamily:'inherit' }}><Download size={14}/> Export</button>
      </motion.div>

      {/* Table */}
      <motion.div variants={fade} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:18, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13, fontWeight:500, color:'#475569' }}>
            <thead>
              <tr style={{ background:'#fafbfc', borderBottom:'1.5px solid #e2e8f0' }}>
                {['#','Student','Admission No','Class','Year','Due Amount','Last Paid','Action'].map(h => (
                  <th key={h} style={{ padding:'14px 16px', textAlign:'left', fontSize:11, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={d.id} style={{ borderBottom:'1px solid #f1f5f9', transition:'background 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#fafbfc'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'14px 16px', color:'#94a3b8', fontWeight:700 }}>{i+1}</td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:34, height:34, borderRadius:'50%', background:avatarBg(d.id), display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, fontWeight:800, flexShrink:0 }}>{initials(d.name)}</div>
                      <span style={{ fontWeight:700, color:'#0f172a' }}>{d.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:'14px 16px', fontWeight:600, color:'#2563eb', fontSize:12 }}>{d.admNo}</td>
                  <td style={{ padding:'14px 16px' }}><span style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:6, background:'#f1f5f9', color:'#475569' }}>{d.cls}</span></td>
                  <td style={{ padding:'14px 16px' }}><span style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:6, background:'#fef2f2', color:'#ef4444' }}>{d.year}</span></td>
                  <td style={{ padding:'14px 16px', fontWeight:800, color:'#ef4444', fontSize:14 }}>₹{d.due.toLocaleString('en-IN')}</td>
                  <td style={{ padding:'14px 16px', fontSize:12, color:'#64748b' }}>{d.lastPaid}</td>
                  <td style={{ padding:'14px 16px' }}>
                    <button onClick={() => openCollect(d)} style={{ display:'flex', alignItems:'center', gap:4, padding:'7px 14px', background:'#2563eb', color:'#fff', border:'none', borderRadius:8, fontSize:11, fontWeight:700, cursor:'pointer', boxShadow:'0 2px 6px rgba(37,99,235,0.25)' }}>
                      <CreditCard size={12}/> Collect
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding:40, textAlign:'center', color:'#94a3b8', fontWeight:600 }}>No outstanding dues found</td></tr>
              )}
            </tbody>
            <tfoot>
              <tr style={{ background:'#fef2f2', borderTop:'2px solid #ef4444' }}>
                <td colSpan={5} style={{ padding:'14px 16px', fontSize:13, fontWeight:800, color:'#991b1b', textAlign:'right' }}>Total Outstanding</td>
                <td colSpan={3} style={{ padding:'14px 16px', fontSize:16, fontWeight:900, color:'#ef4444' }}>₹{totalDue.toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </motion.div>

      {/* ── COLLECTION MODAL ── */}
      <AnimatePresence>
        {showModal && selectedStudent && (
          <div style={{ position:'fixed', inset:0, zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(15,23,42,0.55)', backdropFilter:'blur(6px)' }}>
            <motion.div initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.92 }}
              style={{ background:'#fff', borderRadius:24, width:480, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 24px 64px rgba(0,0,0,0.18)', padding:'28px 28px' }}>

              {!success ? (
                <>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                    <h2 style={{ fontSize:18, fontWeight:800, color:'#0f172a', margin:0 }}>Collect Previous Due</h2>
                    <button onClick={resetForm} style={{ width:30, height:30, borderRadius:8, border:'1px solid #e2e8f0', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#64748b' }}><X size={14}/></button>
                  </div>

                  {/* Student Info */}
                  <div style={{ display:'flex', gap:14, padding:'16px', background:'#f8fafc', borderRadius:14, marginBottom:20 }}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background:avatarBg(selectedStudent.id), display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:14, fontWeight:800, flexShrink:0 }}>{initials(selectedStudent.name)}</div>
                    <div>
                      <div style={{ fontSize:15, fontWeight:700, color:'#0f172a' }}>{selectedStudent.name}</div>
                      <div style={{ fontSize:12, fontWeight:500, color:'#64748b', marginTop:2 }}>{selectedStudent.admNo} · {selectedStudent.cls}</div>
                    </div>
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:20 }}>
                    <div>
                      <label style={labelS}>Due Year</label>
                      <div style={{ ...inputS, background:'#f1f5f9', display:'flex', alignItems:'center', color:'#475569' }}>{selectedStudent.year}</div>
                    </div>
                    <div>
                      <label style={labelS}>Total Due Amount</label>
                      <div style={{ ...inputS, background:'#fef2f2', display:'flex', alignItems:'center', color:'#ef4444', borderColor:'#fca5a5' }}>₹{selectedStudent.due}</div>
                    </div>
                  </div>

                  {/* Amount to Pay */}
                  <div style={{ marginBottom:14 }}>
                    <label style={labelS}>Amount Paying Now</label>
                    <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                      <span style={{ fontSize:16, fontWeight:700, color:'#94a3b8' }}>₹</span>
                      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" style={{ ...inputS, flex:1 }}/>
                    </div>
                  </div>

                  {/* Payment Mode */}
                  <div style={{ marginBottom:14 }}>
                    <label style={labelS}>Payment Mode</label>
                    <div style={{ display:'flex', gap:0, background:'#f1f5f9', borderRadius:10, padding:3 }}>
                      {['Cash','Online','Cheque'].map(m => (
                        <button key={m} onClick={() => setPayMode(m)} style={{
                          flex:1, padding:'9px 0', borderRadius:8, border:'none', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit',
                          background: payMode === m ? '#2563eb' : 'transparent', color: payMode === m ? '#fff' : '#64748b',
                          boxShadow: payMode === m ? '0 2px 6px rgba(37,99,235,0.25)' : 'none', transition:'all 0.15s',
                        }}>{m}</button>
                      ))}
                    </div>
                  </div>

                  {/* Remark */}
                  <div style={{ marginBottom:20 }}>
                    <label style={labelS}>Remark (Optional)</label>
                    <textarea value={remark} onChange={e => setRemark(e.target.value)} rows={2} placeholder="Add a note..." style={{ ...inputS, height:'auto', padding:'10px 14px', resize:'vertical', minHeight:50 }}/>
                  </div>

                  {/* Pay */}
                  <button onClick={handlePay} disabled={!amount || loading}
                    style={{
                      width:'100%', height:48, borderRadius:14, border:'none', fontSize:15, fontWeight:800,
                      background: (!amount || loading) ? '#94a3b8' : '#059669', color:'#fff',
                      cursor: (!amount || loading) ? 'not-allowed' : 'pointer',
                      boxShadow: (amount && !loading) ? '0 4px 16px rgba(5,150,105,0.35)' : 'none',
                      display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:'inherit', transition:'all 0.2s',
                    }}>
                    {loading ? <><Loader size={16} style={{ animation:'spin 1s linear infinite' }}/> Recording...</> : <><CreditCard size={16}/> Pay ₹{amount || '0'}</>}
                  </button>
                </>
              ) : (
                /* Success State */
                <div style={{ textAlign:'center', padding:'10px 0' }}>
                  <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:400, damping:15 }}
                    style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,#10b981,#059669)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'0 8px 30px rgba(16,185,129,0.35)' }}>
                    <Check size={30} color="#fff" strokeWidth={3}/>
                  </motion.div>
                  <h2 style={{ fontSize:20, fontWeight:800, color:'#0f172a', margin:'0 0 4px' }}>Payment Recorded!</h2>
                  <p style={{ fontSize:13, color:'#94a3b8', margin:'0 0 16px' }}>Receipt: <strong style={{ color:'#2563eb' }}>{success.receipt}</strong></p>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20, textAlign:'left' }}>
                    {[{ l:'Student', v:selectedStudent.name },{ l:'Due Year', v:selectedStudent.year },{ l:'Amount Paid', v:`₹${success.amount}` },{ l:'Mode', v:payMode }].map(i => (
                      <div key={i.l} style={{ background:'#f8fafc', borderRadius:10, padding:'10px 12px' }}>
                        <div style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:2 }}>{i.l}</div>
                        <div style={{ fontSize:13, fontWeight:700, color:'#0f172a' }}>{i.v}</div>
                      </div>
                    ))}
                  </div>
                  <button onClick={resetForm} style={{ width:'100%', height:42, borderRadius:12, border:'none', background:'#2563eb', fontSize:13, fontWeight:700, color:'#fff', cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 12px rgba(37,99,235,0.3)' }}>Close Window</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
