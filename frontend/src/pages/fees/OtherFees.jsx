import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CreditCard, Receipt, Check, Search, Loader, X, FileText, AlertCircle, IndianRupee } from 'lucide-react';

const FEE_TYPES = [
  { id:'reg',  name:'Registration Fee', defaultAmt:500,  color:'#2563eb', bg:'#eff6ff' },
  { id:'exam', name:'Exam Fee',         defaultAmt:300,  color:'#7c3aed', bg:'#f5f3ff' },
  { id:'lib',  name:'Library Fine',     defaultAmt:50,   color:'#d97706', bg:'#fffbeb' },
  { id:'cert', name:'Certificate Fee',  defaultAmt:200,  color:'#059669', bg:'#ecfdf5' },
  { id:'misc', name:'Miscellaneous',    defaultAmt:0,    color:'#64748b', bg:'#f8fafc' },
  { id:'unif', name:'Uniform Fee',      defaultAmt:1200, color:'#ef4444', bg:'#fef2f2' },
];

const RECENT = [
  { id:1, student:'Aaditya Kumar', cls:'I – A',   type:'Registration Fee', amount:500,  date:'2025-05-15', mode:'Cash',   receipt:'REC-4521' },
  { id:2, student:'Priya Sharma',  cls:'III – B', type:'Library Fine',     amount:100,  date:'2025-05-15', mode:'Online', receipt:'REC-4520' },
  { id:3, student:'Rohit Mishra',  cls:'VII – A', type:'Exam Fee',         amount:300,  date:'2025-05-14', mode:'Cash',   receipt:'REC-4519' },
  { id:4, student:'Sneha Gupta',   cls:'II – C',  type:'Certificate Fee',  amount:200,  date:'2025-05-14', mode:'Online', receipt:'REC-4518' },
];

const COLORS = [['#3b82f6','#1d4ed8'],['#8b5cf6','#6d28d9'],['#10b981','#059669'],['#f59e0b','#d97706']];
const fade = { hidden:{opacity:0,y:10}, show:{opacity:1,y:0,transition:{duration:0.3}} };

export default function OtherFees() {
  const [showModal, setShowModal] = useState(false);
  const [feeType, setFeeType] = useState('');
  const [customName, setCustomName] = useState('');
  const [amount, setAmount] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [payMode, setPayMode] = useState('Cash');
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const [recentSearch, setRecentSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  const filteredRecent = RECENT.filter(r => {
    const q = recentSearch.toLowerCase();
    const matchSearch = !q || r.student.toLowerCase().includes(q) || r.receipt.toLowerCase().includes(q);
    
    const [c, sec] = r.cls.split(' – ').map(str => str ? str.trim() : '');
    const matchClass = !selectedClass || c === selectedClass;
    const matchSection = !selectedSection || sec === selectedSection;
    
    return matchSearch && matchClass && matchSection;
  });

  const selectedFee = FEE_TYPES.find(f => f.id === feeType);
  const handleFeeSelect = (id) => {
    setFeeType(id);
    const fee = FEE_TYPES.find(f => f.id === id);
    if (fee && fee.defaultAmt > 0) setAmount(String(fee.defaultAmt));
    else setAmount('');
  };

  const handlePay = () => {
    if (!amount || !studentSearch) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess({ receipt:'REC-' + Math.floor(1000+Math.random()*9000), amount:parseInt(amount), type: selectedFee?.name || customName || 'Misc' });
    }, 1500);
  };

  const resetForm = () => {
    setFeeType(''); setCustomName(''); setAmount(''); setStudentSearch(''); setRemark(''); setSuccess(null); setShowModal(false);
  };

  const initials = n => n.split(' ').map(w => w[0]).join('').toUpperCase();
  const avatarBg = id => { const [a,b] = COLORS[id % COLORS.length]; return `linear-gradient(135deg,${a},${b})`; };

  const todayTotal = RECENT.filter(r => r.date === '2025-05-15').reduce((s,r) => s + r.amount, 0);

  const inputS = { width:'100%', height:42, border:'1.5px solid #e2e8f0', borderRadius:10, padding:'0 14px', fontSize:13, fontWeight:600, color:'#0f172a', outline:'none', fontFamily:'inherit', boxSizing:'border-box' };
  const labelS = { fontSize:11, fontWeight:700, color:'#64748b', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.05em' };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show:{transition:{staggerChildren:.07}} }} style={{ paddingBottom:40 }}>
      {/* Header */}
      <motion.div variants={fade} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:800, color:'#0f172a', margin:0, letterSpacing:'-0.5px' }}>Other Fee Collection</h1>
          <p style={{ fontSize:14, color:'#94a3b8', marginTop:6, fontWeight:500 }}>Collect ad-hoc fees — Registration, Fines, Certificates, and Miscellaneous charges</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display:'flex', alignItems:'center', gap:6, height:42, padding:'0 20px', background:'#2563eb', color:'#fff', border:'none', borderRadius:12, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 12px rgba(37,99,235,0.3)' }}>
          <Plus size={16}/> Collect Fee
        </button>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={fade} style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
        {[
          { label:"Today's Other Fees", value:`₹${todayTotal.toLocaleString('en-IN')}`, icon:IndianRupee, color:'#059669', bg:'#ecfdf5' },
          { label:'Receipts Today', value: RECENT.filter(r => r.date === '2025-05-15').length, icon:Receipt, color:'#2563eb', bg:'#eff6ff' },
          { label:'Fee Types Active', value:FEE_TYPES.length, icon:FileText, color:'#7c3aed', bg:'#f5f3ff' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:18, padding:'20px 22px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)', borderTop:`3px solid ${s.color}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:48, height:48, borderRadius:13, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon size={22} color={s.color}/></div>
                <div>
                  <div style={{ fontSize:26, fontWeight:800, color:'#0f172a', lineHeight:1 }}>{s.value}</div>
                  <div style={{ fontSize:10, fontWeight:700, color:'#94a3b8', marginTop:5, textTransform:'uppercase', letterSpacing:'0.07em' }}>{s.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Quick Fee Type Grid */}
      <motion.div variants={fade} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:18, padding:'22px 24px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)', marginBottom:20 }}>
        <p style={{ fontSize:14, fontWeight:800, color:'#0f172a', margin:'0 0 14px' }}>Quick Collect</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          {FEE_TYPES.map(f => (
            <button key={f.id} onClick={() => { handleFeeSelect(f.id); setShowModal(true); }}
              style={{ display:'flex', alignItems:'center', gap:12, padding:'16px 18px', background:f.bg, border:`1.5px solid transparent`, borderRadius:14, cursor:'pointer', fontFamily:'inherit', textAlign:'left', transition:'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = f.color}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>
              <div style={{ width:40, height:40, borderRadius:10, background:f.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <CreditCard size={18} color="#fff"/>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:'#0f172a' }}>{f.name}</div>
                {f.defaultAmt > 0 && <div style={{ fontSize:11, fontWeight:600, color:'#64748b', marginTop:2 }}>₹{f.defaultAmt}</div>}
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Recent Transactions & Filters */}
      <motion.div variants={fade} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:18, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12, borderBottom:'1.5px solid #e2e8f0' }}>
          <p style={{ fontSize:14, fontWeight:800, color:'#0f172a', margin:0 }}>Recent Transactions</p>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <div style={{ position:'relative', minWidth:180 }}>
              <Search size={14} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#94a3b8', pointerEvents:'none' }}/>
              <input value={recentSearch} onChange={e => setRecentSearch(e.target.value)} placeholder="Search student..."
                style={{ width:'100%', height:36, paddingLeft:32, border:'1.5px solid #e2e8f0', borderRadius:8, fontSize:12, fontWeight:500, color:'#0f172a', outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}/>
            </div>
            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
              style={{ height:36, border:'1.5px solid #e2e8f0', borderRadius:8, padding:'0 10px', fontSize:12, fontWeight:600, color:'#0f172a', outline:'none', fontFamily:'inherit', background:'#fff', minWidth:100 }}>
              <option value="">All Classes</option>
              <option value="Nursery">Nursery</option>
              <option value="LKG">LKG</option>
              <option value="UKG">UKG</option>
              <option value="I">Class I</option>
              <option value="II">Class II</option>
              <option value="III">Class III</option>
              <option value="IV">Class IV</option>
              <option value="V">Class V</option>
            </select>
            <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)}
              style={{ height:36, border:'1.5px solid #e2e8f0', borderRadius:8, padding:'0 10px', fontSize:12, fontWeight:600, color:'#0f172a', outline:'none', fontFamily:'inherit', background:'#fff', minWidth:100 }}>
              <option value="">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13, fontWeight:500, color:'#475569' }}>
            <thead>
              <tr style={{ background:'#fafbfc', borderBottom:'1.5px solid #e2e8f0' }}>
                {['#','Student','Class','Fee Type','Amount','Date','Mode','Receipt'].map(h => (
                  <th key={h} style={{ padding:'14px 16px', textAlign:'left', fontSize:11, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRecent.map((r, i) => (
                <tr key={r.id} style={{ borderBottom:'1px solid #f1f5f9', transition:'background 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#fafbfc'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'14px 16px', color:'#94a3b8', fontWeight:700 }}>{i+1}</td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:30, height:30, borderRadius:'50%', background:avatarBg(r.id), display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:10, fontWeight:800, flexShrink:0 }}>{initials(r.student)}</div>
                      <span style={{ fontWeight:700, color:'#0f172a' }}>{r.student}</span>
                    </div>
                  </td>
                  <td style={{ padding:'14px 16px' }}><span style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:6, background:'#f8fafc', color:'#64748b' }}>{r.cls}</span></td>
                  <td style={{ padding:'14px 16px' }}><span style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:6, background:'#f1f5f9', color:'#475569' }}>{r.type}</span></td>
                  <td style={{ padding:'14px 16px', fontWeight:800, color:'#0f172a' }}>₹{r.amount.toLocaleString('en-IN')}</td>
                  <td style={{ padding:'14px 16px', fontSize:12 }}>{r.date}</td>
                  <td style={{ padding:'14px 16px' }}>
                    <span style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:6, background: r.mode==='Cash' ? '#ecfdf5' : '#eff6ff', color: r.mode==='Cash' ? '#059669' : '#2563eb' }}>{r.mode}</span>
                  </td>
                  <td style={{ padding:'14px 16px', fontWeight:600, color:'#2563eb', fontSize:12 }}>{r.receipt}</td>
                </tr>
              ))}
              {filteredRecent.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding:40, textAlign:'center', color:'#94a3b8', fontWeight:600 }}>No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── COLLECTION MODAL ── */}
      <AnimatePresence>
        {showModal && (
          <div style={{ position:'fixed', inset:0, zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(15,23,42,0.55)', backdropFilter:'blur(6px)' }}>
            <motion.div initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.92 }}
              style={{ background:'#fff', borderRadius:24, width:480, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 24px 64px rgba(0,0,0,0.18)', padding:'28px 28px' }}>

              {!success ? (
                <>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                    <h2 style={{ fontSize:18, fontWeight:800, color:'#0f172a', margin:0 }}>Collect Other Fee</h2>
                    <button onClick={resetForm} style={{ width:30, height:30, borderRadius:8, border:'1px solid #e2e8f0', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#64748b' }}><X size={14}/></button>
                  </div>

                  {/* Student */}
                  <div style={{ marginBottom:14 }}>
                    <label style={labelS}>Student Name or Admission No</label>
                    <div style={{ position:'relative' }}>
                      <Search size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#94a3b8', pointerEvents:'none' }}/>
                      <input value={studentSearch} onChange={e => setStudentSearch(e.target.value)} placeholder="Search student..." style={{ ...inputS, paddingLeft:36 }}/>
                    </div>
                  </div>

                  {/* Fee Type */}
                  <div style={{ marginBottom:14 }}>
                    <label style={labelS}>Fee Type</label>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                      {FEE_TYPES.map(f => (
                        <button key={f.id} onClick={() => handleFeeSelect(f.id)}
                          style={{ padding:'7px 14px', borderRadius:8, border:`1.5px solid ${feeType === f.id ? f.color : '#e2e8f0'}`, background: feeType === f.id ? f.bg : '#fff', fontSize:11, fontWeight:700, color: feeType === f.id ? f.color : '#64748b', cursor:'pointer', fontFamily:'inherit', transition:'all 0.12s' }}>
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {feeType === 'misc' && (
                    <div style={{ marginBottom:14 }}>
                      <label style={labelS}>Custom Fee Name</label>
                      <input value={customName} onChange={e => setCustomName(e.target.value)} placeholder="Enter fee name" style={inputS}/>
                    </div>
                  )}

                  {/* Amount */}
                  <div style={{ marginBottom:14 }}>
                    <label style={labelS}>Amount</label>
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
                  <button onClick={handlePay} disabled={!amount || !studentSearch || loading}
                    style={{
                      width:'100%', height:48, borderRadius:14, border:'none', fontSize:15, fontWeight:800,
                      background: (!amount || !studentSearch || loading) ? '#94a3b8' : '#059669', color:'#fff',
                      cursor: (!amount || !studentSearch || loading) ? 'not-allowed' : 'pointer',
                      boxShadow: (amount && studentSearch && !loading) ? '0 4px 16px rgba(5,150,105,0.35)' : 'none',
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
                    {[{ l:'Fee Type', v:success.type },{ l:'Amount', v:`₹${success.amount}` },{ l:'Student', v:studentSearch },{ l:'Mode', v:payMode }].map(i => (
                      <div key={i.l} style={{ background:'#f8fafc', borderRadius:10, padding:'10px 12px' }}>
                        <div style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:2 }}>{i.l}</div>
                        <div style={{ fontSize:13, fontWeight:700, color:'#0f172a' }}>{i.v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:'flex', gap:10 }}>
                    <button onClick={resetForm} style={{ flex:1, height:42, borderRadius:12, border:'1.5px solid #e2e8f0', background:'#fff', fontSize:13, fontWeight:700, color:'#475569', cursor:'pointer', fontFamily:'inherit' }}>Close</button>
                    <button onClick={() => { setSuccess(null); setAmount(''); setStudentSearch(''); setRemark(''); }} style={{ flex:1, height:42, borderRadius:12, border:'none', background:'#2563eb', fontSize:13, fontWeight:700, color:'#fff', cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 12px rgba(37,99,235,0.3)' }}>Collect Another</button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
