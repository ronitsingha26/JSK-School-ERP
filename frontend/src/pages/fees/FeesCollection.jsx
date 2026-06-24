import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Calendar, AlertCircle, Receipt, Search, X,
  ArrowUpRight, Users, CreditCard, Printer, Download,
  Percent, Bus, Home, Clock, StickyNote, Zap, CheckCircle2, Phone, Loader, Check
} from 'lucide-react';

const STUDENTS = [
  { id:1, admission_no:'JSK20250001', name:'Aaditya Kumar',  father:'Rajesh Kumar',  cls:'I – A',  mobile:'9876543210', bus:'Route 1', hostel:false },
  { id:2, admission_no:'JSK20250002', name:'Priya Sharma',   father:'Suresh Sharma', cls:'III – B',mobile:'9123456780', bus:null,      hostel:false },
  { id:3, admission_no:'JSK20250003', name:'Rahul Verma',    father:'Anil Verma',    cls:'V – A',  mobile:'8899001122', bus:'Route 3', hostel:false },
  { id:4, admission_no:'JSK20250004', name:'Sneha Gupta',    father:'Vikram Gupta',  cls:'II – C', mobile:'9012345678', bus:null,      hostel:true },
  { id:5, admission_no:'JSK20250005', name:'Vikash Yadav',   father:'Mohan Yadav',   cls:'IV – A', mobile:'9988776655', bus:'Route 2', hostel:false },
  { id:6, admission_no:'JSK20250006', name:'Anjali Singh',   father:'Deepak Singh',  cls:'VI – B', mobile:'8877665544', bus:null,      hostel:false },
  { id:7, admission_no:'JSK20250007', name:'Rohit Mishra',   father:'Sunil Mishra',  cls:'VII – A',mobile:'7766554433', bus:'Route 1', hostel:true },
  { id:8, admission_no:'JSK20250008', name:'Kavita Patel',   father:'Rajan Patel',   cls:'VIII–C', mobile:'6655443322', bus:null,      hostel:false },
];

const MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];
const MONTH_STATUS = { Apr:'paid', May:'paid', Jun:'pending', Jul:'pending', Aug:'future', Sep:'future', Oct:'future', Nov:'future', Dec:'future', Jan:'future', Feb:'future', Mar:'future' };
const MONTH_DUE = { Jun:2500, Jul:2500 };

const FEE_DATA = [
  { head:'Tuition Fee',  amount:2500, paid:2500, due:0,    month:'Apr 2025', status:'Paid',    receipt:'REC-001' },
  { head:'Tuition Fee',  amount:2500, paid:2500, due:0,    month:'May 2025', status:'Paid',    receipt:'REC-012' },
  { head:'Tuition Fee',  amount:2500, paid:0,    due:2500, month:'Jun 2025', status:'Pending', receipt:'-' },
  { head:'Exam Fee',     amount:500,  paid:500,  due:0,    month:'Apr 2025', status:'Paid',    receipt:'REC-002' },
  { head:'Transport Fee',amount:1200, paid:1200, due:0,    month:'Apr 2025', status:'Paid',    receipt:'REC-003' },
  { head:'Transport Fee',amount:1200, paid:600,  due:600,  month:'May 2025', status:'Partial', receipt:'REC-015' },
  { head:'Library Fee',  amount:600,  paid:0,    due:600,  month:'2025-26',  status:'Pending', receipt:'-' },
];

const COLORS = [
  ['#3b82f6','#1d4ed8'],['#8b5cf6','#6d28d9'],['#10b981','#059669'],
  ['#f59e0b','#d97706'],['#ef4444','#dc2626'],['#06b6d4','#0891b2'],
  ['#6366f1','#4f46e5'],['#84cc16','#65a30d'],
];

const fade = { hidden:{opacity:0,y:10}, show:{opacity:1,y:0,transition:{duration:0.3}} };

export default function FeesCollection() {
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');

  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setFocused(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const q = search.toLowerCase().trim();
  const results = STUDENTS.filter(s => {
    // Search text match
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.admission_no.toLowerCase().includes(q) || s.mobile.includes(q) || s.father.toLowerCase().includes(q);
    
    // Parse class and section from 'I – A' format
    const [c, sec] = s.cls.split(' – ').map(str => str ? str.trim() : '');
    
    // Exact match for class filter
    const matchClass = !classFilter || c === classFilter;
    
    // Exact match for section filter
    const matchSection = !sectionFilter || sec === sectionFilter;
    
    return matchSearch && matchClass && matchSection;
  }).slice(0, 5);

  const selectStudent = (s) => { setSelected(s); setSearch(s.name); setFocused(false); };

  const initials = (n) => n.split(' ').map(w => w[0]).join('').toUpperCase();
  const avatarBg = (id) => { const [a,b] = COLORS[id % COLORS.length]; return `linear-gradient(135deg,${a},${b})`; };

  const statusColor = (s) => {
    if (s === 'Paid')    return { c:'#059669', bg:'#ecfdf5', dot:'#10b981' };
    if (s === 'Partial') return { c:'#d97706', bg:'#fffbeb', dot:'#f59e0b' };
    return { c:'#ef4444', bg:'#fef2f2', dot:'#ef4444' };
  };

  const totalPaid = FEE_DATA.reduce((s,f) => s + f.paid, 0);
  const totalDue  = FEE_DATA.reduce((s,f) => s + f.due, 0);

  return (
    <motion.div initial="hidden" animate="show" variants={{ show:{transition:{staggerChildren:.07}} }} style={{ paddingBottom:40, minWidth:0 }}>

      {/* HEADER */}
      <motion.div variants={fade} style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:800, color:'#0f172a', margin:0, letterSpacing:'-0.5px' }}>Fee Collection</h1>
          <p style={{ fontSize:14, color:'#94a3b8', marginTop:6, fontWeight:500 }}>Collect and manage student fees · Academic Year 2025-26</p>
        </div>
      </motion.div>

      {/* STAT CARDS */}
      <motion.div variants={fade} style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        {[
          { label:"Today's Collection", value:'₹84,500', icon:TrendingUp, color:'#059669', bg:'#ecfdf5', sub:'↑ +₹12,500 from yesterday', subColor:'#059669' },
          { label:'This Month',         value:'₹3,24,000', icon:Calendar,   color:'#2563eb', bg:'#eff6ff' },
          { label:'Pending Dues',       value:'₹2,35,000', icon:AlertCircle,color:'#d97706', bg:'#fffbeb', sub:'32 students', subColor:'#d97706' },
          { label:'Receipts Today',     value:'156',       icon:Receipt,    color:'#7c3aed', bg:'#f5f3ff' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:18, padding:'20px 22px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)', borderTop:`3px solid ${s.color}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom: s.sub ? 10 : 0 }}>
                <div style={{ width:48, height:48, borderRadius:13, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={22} color={s.color}/>
                </div>
                <div>
                  <div style={{ fontSize:26, fontWeight:800, color:'#0f172a', lineHeight:1 }}>{s.value}</div>
                  <div style={{ fontSize:10, fontWeight:700, color:'#94a3b8', marginTop:5, textTransform:'uppercase', letterSpacing:'0.07em' }}>{s.label}</div>
                </div>
              </div>
              {s.sub && (
                <div style={{ fontSize:11, fontWeight:700, color:s.subColor, display:'flex', alignItems:'center', gap:4, marginTop:2 }}>
                  {s.label === "Today's Collection" && <ArrowUpRight size={12}/>}
                  {s.label === 'Pending Dues' && <Users size={12}/>}
                  {s.sub}
                </div>
              )}
            </div>
          );
        })}
      </motion.div>

      {/* SEARCH & FILTERS */}
      <motion.div variants={fade} ref={ref} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:18, padding:'22px 24px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)', marginBottom:24, position:'relative' }}>
        <p style={{ fontSize:13, fontWeight:700, color:'#475569', margin:'0 0 10px' }}>Search & Filter Students</p>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' }}>
          {/* Main Search */}
          <div style={{ position:'relative', flex:1, minWidth:250 }}>
            <Search size={18} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color: focused ? '#2563eb' : '#94a3b8', transition:'color 0.15s', pointerEvents:'none', zIndex:2 }}/>
            <input value={search}
              onChange={e => { setSearch(e.target.value); if (selected) setSelected(null); }}
              onFocus={() => setFocused(true)}
              placeholder="Type admission no, student name, or mobile number..."
              style={{ width:'100%', height:48, paddingLeft:44, paddingRight:40, border:`1.5px solid ${focused ? '#2563eb' : '#e2e8f0'}`, borderRadius:14, fontSize:14, fontWeight:500, color:'#0f172a', outline:'none', fontFamily:'inherit', boxShadow: focused ? '0 0 0 3px rgba(37,99,235,0.1)' : 'none', transition:'all 0.18s', boxSizing:'border-box' }}
            />
            {search && (
              <button onClick={() => { setSearch(''); setSelected(null); }} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'#e2e8f0', border:'none', borderRadius:'50%', width:20, height:20, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#64748b', zIndex:2 }}>
                <X size={12}/>
              </button>
            )}
          </div>
          {/* Filters */}
          <div style={{ display:'flex', gap:8 }}>
            <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} style={{ height:48, border:'1.5px solid #e2e8f0', borderRadius:14, padding:'0 14px', fontSize:13, fontWeight:600, color:'#0f172a', outline:'none', fontFamily:'inherit', background:'#fff', minWidth:110 }}>
              <option value="">All Years</option>
              <option value="2025-26">Year: 25-26</option>
              <option value="2024-25">Year: 24-25</option>
            </select>
            <select value={classFilter} onChange={e => setClassFilter(e.target.value)} style={{ height:48, border:'1.5px solid #e2e8f0', borderRadius:14, padding:'0 14px', fontSize:13, fontWeight:600, color:'#0f172a', outline:'none', fontFamily:'inherit', background:'#fff', minWidth:110 }}>
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
            <select value={sectionFilter} onChange={e => setSectionFilter(e.target.value)} style={{ height:48, border:'1.5px solid #e2e8f0', borderRadius:14, padding:'0 14px', fontSize:13, fontWeight:600, color:'#0f172a', outline:'none', fontFamily:'inherit', background:'#fff', minWidth:110 }}>
              <option value="">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
              <option value="D">Section D</option>
            </select>
          </div>
        </div>

        {/* Dropdown results */}
        {focused && results.length > 0 && !selected && (
          <div style={{ position:'absolute', left:24, right:24, top:'calc(100% - 6px)', background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, boxShadow:'0 10px 40px rgba(15,23,42,0.1)', padding:8, zIndex:50 }}>
            {results.map(s => (
              <div key={s.id} onClick={() => selectStudent(s)}
                style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:10, cursor:'pointer', transition:'background 0.12s' }}
                onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:avatarBg(s.id), display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12, fontWeight:800, flexShrink:0 }}>{initials(s.name)}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:'#0f172a' }}>{s.name}</div>
                  <div style={{ fontSize:11, fontWeight:500, color:'#94a3b8', marginTop:1 }}>{s.admission_no} · {s.cls} · {s.father}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {focused && q && results.length === 0 && !selected && (
          <div style={{ position:'absolute', left:24, right:24, top:'calc(100% - 6px)', background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, boxShadow:'0 10px 40px rgba(15,23,42,0.1)', padding:'20px', textAlign:'center', zIndex:50 }}>
            <p style={{ fontSize:13, fontWeight:600, color:'#94a3b8', margin:0 }}>No students found for "{search}"</p>
          </div>
        )}
      </motion.div>

      {/* EMPTY STATE — shown when no student is selected */}
      {!selected && (
        <motion.div variants={fade} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:18, padding:'48px 32px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)', textAlign:'center' }}>
          <div style={{ width:72, height:72, borderRadius:18, background:'linear-gradient(135deg,#eff6ff,#dbeafe)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            <Search size={32} color="#2563eb" strokeWidth={1.5}/>
          </div>
          <h3 style={{ fontSize:18, fontWeight:800, color:'#0f172a', margin:'0 0 6px' }}>Search a Student to Begin</h3>
          <p style={{ fontSize:13, color:'#94a3b8', margin:'0 0 24px', maxWidth:380, marginLeft:'auto', marginRight:'auto', lineHeight:1.6 }}>
            Enter admission number, student name, or mobile number in the search box above to load their fee details and start collection.
          </p>
          <div style={{ display:'flex', justifyContent:'center', gap:24, flexWrap:'wrap' }}>
            {[
              { step:'1', text:'Search student above' },
              { step:'2', text:'Select months to pay' },
              { step:'3', text:'Enter amount & collect' },
            ].map(s => (
              <div key={s.step} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:28, height:28, borderRadius:8, background:'#2563eb', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12, fontWeight:800 }}>{s.step}</div>
                <span style={{ fontSize:12, fontWeight:600, color:'#475569' }}>{s.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* SELECTED STUDENT DETAIL */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.3 }}>

            {/* ── STUDENT INFO CARD (blue left border) ── */}
            <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderLeft:'4px solid #2563eb', borderRadius:18, padding:'22px 28px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)', marginBottom:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16 }}>
                {/* Left: Avatar + Info */}
                <div style={{ display:'flex', gap:16 }}>
                  <div style={{ width:56, height:56, borderRadius:14, background:avatarBg(selected.id), display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:19, fontWeight:800, flexShrink:0 }}>{initials(selected.name)}</div>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                      <h2 style={{ fontSize:20, fontWeight:800, color:'#0f172a', margin:0 }}>{selected.name}</h2>
                      <span style={{ fontSize:11, fontWeight:800, padding:'3px 10px', borderRadius:6, background:'#fef2f2', color:'#ef4444' }}>Due: ₹{totalDue.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:16, fontSize:12, fontWeight:600, color:'#64748b' }}>
                      <span>📋 {selected.admission_no}</span>
                      <span>🎓 Class {selected.cls}</span>
                      <span>👨 {selected.father}</span>
                      <span style={{ display:'flex', alignItems:'center', gap:3 }}><Phone size={11}/> {selected.mobile}</span>
                      {selected.bus && <span style={{ display:'flex', alignItems:'center', gap:3 }}><Bus size={11} color='#2563eb'/> {selected.bus}</span>}
                      <span style={{ display:'flex', alignItems:'center', gap:3 }}><Home size={11} color={selected.hostel ? '#059669' : '#94a3b8'}/> {selected.hostel ? 'Hostel' : 'Day Scholar'}</span>
                    </div>
                  </div>
                </div>
                {/* Right: Summary pills */}
                <div style={{ display:'flex', gap:8 }}>
                  <SummaryPill label="Total Paid" value={`₹${totalPaid.toLocaleString('en-IN')}`} color="#059669" bg="#ecfdf5"/>
                  <SummaryPill label="Total Due" value={`₹${totalDue.toLocaleString('en-IN')}`} color="#ef4444" bg="#fef2f2"/>
                </div>
              </div>
              {/* Action buttons */}
              <div style={{ display:'flex', gap:6, marginTop:16, paddingTop:14, borderTop:'1px solid #f1f5f9', flexWrap:'wrap' }}>
                <ActionBtn icon={Percent}    label="Discount" />
                <ActionBtn icon={Bus}        label="Bus Fee" />
                <ActionBtn icon={Zap}        label="Extra Charge" />
                <ActionBtn icon={Clock}      label="History" />
                <ActionBtn icon={StickyNote} label="Note" />
              </div>
            </div>

            {/* ── MONTH PICKER ── */}
            <MonthPicker />

            {/* ── 2-COLUMN PAYMENT LAYOUT ── */}
            <div style={{ display:'grid', gridTemplateColumns:'58% 42%', gap:20, alignItems:'start' }}>
              <FeeBreakdownTable />
              <PaymentPanel onSuccess={(data) => setSuccessData(data)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS MODAL */}
      {successData && !showReceipt && (
        <SuccessModal data={successData} student={selected}
          onPrint={() => setShowReceipt(true)}
          onAnother={() => { setSuccessData(null); setSelected(null); setSearch(''); }}
        />
      )}

      {/* RECEIPT PREVIEW */}
      {showReceipt && (
        <ReceiptPreview data={successData} student={selected}
          onClose={() => { setShowReceipt(false); setSuccessData(null); setSelected(null); setSearch(''); }}
        />
      )}
    </motion.div>
  );
}

function SummaryPill({ label, value, color, bg }) {
  return (
    <div style={{ background:bg, borderRadius:12, padding:'10px 18px', textAlign:'center' }}>
      <div style={{ fontSize:18, fontWeight:800, color, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:10, fontWeight:700, color:'#94a3b8', marginTop:4, textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</div>
    </div>
  );
}

/* ── Action Button ── */
function ActionBtn({ icon: Icon, label }) {
  const [hov, setHov] = useState(false);
  return (
    <button onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 14px', borderRadius:9, border:`1.5px solid ${hov ? '#2563eb' : '#e2e8f0'}`, background: hov ? '#eff6ff' : '#fff', fontSize:11, fontWeight:700, color: hov ? '#2563eb' : '#64748b', cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}>
      <Icon size={13}/> {label}
    </button>
  );
}

/* ── Month Picker ── */
function MonthPicker() {
  const [selectedMonths, setSelectedMonths] = useState(['Jun']);
  const curMonth = 'Jun'; // simulate current month

  const toggle = (m) => {
    const st = MONTH_STATUS[m];
    if (st === 'paid' || st === 'future') return;
    setSelectedMonths(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  };

  return (
    <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:18, padding:'20px 24px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)', marginBottom:20 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <p style={{ fontSize:13, fontWeight:700, color:'#475569', margin:0 }}>Select Months for Collection</p>
        <div style={{ display:'flex', gap:12, fontSize:11, fontWeight:600, color:'#94a3b8' }}>
          <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:8, height:8, borderRadius:'50%', background:'#10b981' }}/> Paid</span>
          <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:8, height:8, borderRadius:'50%', background:'#2563eb' }}/> Pending</span>
          <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:8, height:8, borderRadius:'50%', background:'#cbd5e1' }}/> Future</span>
        </div>
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
        {MONTHS.map(m => {
          const st = MONTH_STATUS[m];
          const sel = selectedMonths.includes(m);
          const isPaid = st === 'paid';
          const isFuture = st === 'future';
          const due = MONTH_DUE[m];

          let bg = '#fff', border = '#e2e8f0', color = '#475569';
          if (isPaid)        { bg = '#ecfdf5'; border = '#10b981'; color = '#059669'; }
          else if (sel)      { bg = '#eff6ff'; border = '#2563eb'; color = '#2563eb'; }
          else if (isFuture) { bg = '#f8fafc'; border = '#e2e8f0'; color = '#cbd5e1'; }

          return (
            <div key={m} onClick={() => toggle(m)}
              style={{
                width:72, padding:'10px 0', borderRadius:12, textAlign:'center',
                border:`1.5px solid ${border}`, background:bg,
                cursor: isFuture ? 'not-allowed' : isPaid ? 'default' : 'pointer',
                opacity: isFuture ? 0.5 : 1, transition:'all 0.18s',
              }}>
              {isPaid && <CheckCircle2 size={14} color="#10b981" style={{ margin:'0 auto 3px', display:'block' }}/>}
              <div style={{ fontSize:13, fontWeight:800, color }}>{m}</div>
              {!isPaid && !isFuture && due && (
                <div style={{ fontSize:10, fontWeight:700, color:'#ef4444', marginTop:2 }}>₹{due.toLocaleString('en-IN')}</div>
              )}
              {isPaid && <div style={{ fontSize:10, fontWeight:600, color:'#94a3b8', marginTop:2 }}>Paid</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── BREAKDOWN DATA ── */
const BREAKDOWN = [
  { id:1, month:'Jun 2025', head:'Tuition Fee',  amount:2500, discount:0, paidPrev:0, payable:2500 },
  { id:2, month:'Jun 2025', head:'Transport Fee', amount:1200, discount:0, paidPrev:0, payable:1200 },
  { id:3, month:'Jun 2025', head:'Computer Fee',  amount:400,  discount:0, paidPrev:0, payable:400 },
  { id:4, month:'Jul 2025', head:'Tuition Fee',  amount:2500, discount:250, paidPrev:0, payable:2250 },
  { id:5, month:'Jul 2025', head:'Transport Fee', amount:1200, discount:0, paidPrev:0, payable:1200 },
  { id:6, month:'Jul 2025', head:'Computer Fee',  amount:400,  discount:0, paidPrev:0, payable:400 },
];

/* ═══════ FEE BREAKDOWN TABLE (LEFT) ═══════ */
function FeeBreakdownTable() {
  const [checked, setChecked] = useState(BREAKDOWN.map(b => b.id));
  const allChecked = checked.length === BREAKDOWN.length;
  const toggleAll = () => setChecked(allChecked ? [] : BREAKDOWN.map(b => b.id));
  const toggleOne = (id) => setChecked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const totalPayable = BREAKDOWN.filter(b => checked.includes(b.id)).reduce((s, b) => s + b.payable, 0);

  const thS = { padding:'12px 10px', textAlign:'left', fontSize:10, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap' };
  const tdS = { padding:'12px 10px', fontSize:12, fontWeight:600 };
  const cbxS = (on) => ({ width:16, height:16, borderRadius:4, border:`2px solid ${on ? '#2563eb' : '#cbd5e1'}`, background: on ? '#2563eb' : '#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, transition:'all 0.12s' });

  return (
    <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:18, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
      <div style={{ padding:'16px 18px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <p style={{ fontSize:13, fontWeight:700, color:'#475569', margin:0 }}>Fee Breakdown</p>
        <div style={{ display:'flex', gap:6 }}>
          <button style={{ display:'flex', alignItems:'center', gap:4, height:30, padding:'0 12px', border:'1.5px solid #e2e8f0', borderRadius:8, background:'#fff', fontSize:11, fontWeight:700, color:'#475569', cursor:'pointer', fontFamily:'inherit' }}><Printer size={12}/> Print</button>
          <button style={{ display:'flex', alignItems:'center', gap:4, height:30, padding:'0 12px', border:'1.5px solid #e2e8f0', borderRadius:8, background:'#fff', fontSize:11, fontWeight:700, color:'#475569', cursor:'pointer', fontFamily:'inherit' }}><Download size={12}/> Export</button>
        </div>
      </div>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', color:'#475569' }}>
          <thead>
            <tr style={{ background:'#fafbfc', borderBottom:'1.5px solid #e2e8f0' }}>
              <th style={thS}><div onClick={toggleAll} style={cbxS(allChecked)}>{allChecked && <CheckCircle2 size={10} color="#fff"/>}</div></th>
              <th style={thS}>Month</th><th style={thS}>Fee Head</th><th style={thS}>Amount</th>
              <th style={thS}>Discount</th><th style={thS}>Paid Prev</th><th style={thS}>Payable</th>
            </tr>
          </thead>
          <tbody>
            {BREAKDOWN.map(b => {
              const on = checked.includes(b.id);
              return (
                <tr key={b.id} style={{ borderBottom:'1px solid #f1f5f9', background: on ? '#fafbfe' : 'transparent', transition:'background 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.background=on ? '#f0f4ff' : '#fafbfc'}
                    onMouseLeave={e => e.currentTarget.style.background=on ? '#fafbfe' : 'transparent'}>
                  <td style={tdS}><div onClick={() => toggleOne(b.id)} style={cbxS(on)}>{on && <CheckCircle2 size={10} color="#fff"/>}</div></td>
                  <td style={tdS}><span style={{ fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:5, background:'#f1f5f9', color:'#475569' }}>{b.month}</span></td>
                  <td style={{ ...tdS, fontWeight:700, color:'#0f172a' }}>{b.head}</td>
                  <td style={tdS}>₹{b.amount.toLocaleString('en-IN')}</td>
                  <td style={{ ...tdS, color: b.discount > 0 ? '#059669' : '#94a3b8' }}>{b.discount > 0 ? `-₹${b.discount}` : '–'}</td>
                  <td style={{ ...tdS, color:'#94a3b8' }}>{b.paidPrev > 0 ? `₹${b.paidPrev}` : '–'}</td>
                  <td style={{ ...tdS, fontWeight:800, color:'#0f172a' }}>₹{b.payable.toLocaleString('en-IN')}</td>
                </tr>
              );
            })}
          </tbody>
          {/* Sticky total */}
          <tfoot>
            <tr style={{ background:'#eff6ff', borderTop:'2px solid #2563eb' }}>
              <td colSpan={6} style={{ padding:'14px 10px', fontSize:13, fontWeight:800, color:'#1e40af', textAlign:'right' }}>Total Payable</td>
              <td style={{ padding:'14px 10px', fontSize:16, fontWeight:900, color:'#2563eb' }}>₹{totalPayable.toLocaleString('en-IN')}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

/* ═══════ PAYMENT PANEL (RIGHT) ═══════ */
function PaymentPanel({ onSuccess }) {
  const [lateFine, setLateFine] = useState(false);
  const [manualBill, setManualBill] = useState(false);
  const [slipNo, setSlipNo] = useState('');
  const [paidAmt, setPaidAmt] = useState('');
  const [payDate, setPayDate] = useState(new Date().toISOString().slice(0, 10));
  const [payMode, setPayMode] = useState('Cash');
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);

  const payable = 7950; // from breakdown total
  const fineAmt = lateFine ? 35 : 0;
  const grandTotal = payable + fineAmt;
  const paid = parseInt(paidAmt) || 0;
  const remaining = grandTotal - paid;

  const inputS = { width:'100%', height:40, border:'1.5px solid #e2e8f0', borderRadius:10, padding:'0 12px', fontSize:13, fontWeight:600, color:'#0f172a', outline:'none', fontFamily:'inherit', boxSizing:'border-box' };
  const labelS = { fontSize:11, fontWeight:700, color:'#64748b', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.05em' };

  const Toggle = ({ on, onToggle }) => (
    <div onClick={onToggle} style={{ width:40, height:22, borderRadius:99, background: on ? '#2563eb' : '#cbd5e1', cursor:'pointer', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
      <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left: on ? 21 : 3, transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.15)' }}/>
    </div>
  );

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess && onSuccess({ receipt:'REC-' + Math.floor(1000+Math.random()*9000), amount:paid, date:payDate, mode:payMode, slipNo, grandTotal });
    }, 1500);
  };

  return (
    <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:18, padding:'22px 22px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)', position:'sticky', top:20 }}>
      <p style={{ fontSize:14, fontWeight:800, color:'#0f172a', margin:'0 0 16px' }}>Payment Details</p>

      {/* Toggles */}
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:18 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:12, fontWeight:600, color:'#475569' }}>Apply Late Fine</span>
          <Toggle on={lateFine} onToggle={() => setLateFine(!lateFine)} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:12, fontWeight:600, color:'#475569' }}>Manual Bill No</span>
          <Toggle on={manualBill} onToggle={() => setManualBill(!manualBill)} />
        </div>
      </div>

      {/* Slip No */}
      {manualBill && (
        <div style={{ marginBottom:14 }}>
          <label style={labelS}>Slip / Bill No</label>
          <input value={slipNo} onChange={e => setSlipNo(e.target.value)} placeholder="Enter bill number" style={inputS}/>
        </div>
      )}

      {/* Amount Summary */}
      <div style={{ background:'#f8fafc', borderRadius:12, padding:'14px 16px', marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, fontWeight:600, color:'#64748b', marginBottom:6 }}>
          <span>Fee Amount</span><span>₹{payable.toLocaleString('en-IN')}</span>
        </div>
        {lateFine && (
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, fontWeight:600, color:'#d97706', marginBottom:6 }}>
            <span>Late Fine</span><span>+₹{fineAmt}</span>
          </div>
        )}
        <div style={{ borderTop:'1.5px solid #e2e8f0', paddingTop:8, marginTop:4, display:'flex', justifyContent:'space-between' }}>
          <span style={{ fontSize:14, fontWeight:800, color:'#0f172a' }}>Total Payable</span>
          <span style={{ fontSize:18, fontWeight:900, color:'#2563eb' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Paid + Remaining */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
        <div>
          <label style={labelS}>Paid Amount</label>
          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
            <span style={{ fontSize:14, fontWeight:700, color:'#94a3b8' }}>₹</span>
            <input type="number" value={paidAmt} onChange={e => setPaidAmt(e.target.value)} placeholder="0" style={{ ...inputS, flex:1 }}/>
          </div>
        </div>
        <div>
          <label style={labelS}>Remaining</label>
          <div style={{ height:40, borderRadius:10, background: remaining > 0 ? '#fef2f2' : '#ecfdf5', border:`1.5px solid ${remaining > 0 ? '#fecaca' : '#a7f3d0'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color: remaining > 0 ? '#ef4444' : '#059669' }}>
            ₹{Math.abs(remaining).toLocaleString('en-IN')}{remaining < 0 ? ' (Excess)' : ''}
          </div>
        </div>
      </div>

      {/* Date */}
      <div style={{ marginBottom:14 }}>
        <label style={labelS}>Payment Date</label>
        <input type="date" value={payDate} onChange={e => setPayDate(e.target.value)} style={inputS}/>
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
      <div style={{ marginBottom:18 }}>
        <label style={labelS}>Remark (Optional)</label>
        <textarea value={remark} onChange={e => setRemark(e.target.value)} rows={2} placeholder="Add a note..."
          style={{ ...inputS, height:'auto', padding:'10px 12px', resize:'vertical', minHeight:60 }}/>
      </div>

      {/* PAY BUTTON */}
      <button onClick={handlePay} disabled={!paid || loading}
        style={{
          width:'100%', height:48, borderRadius:14, border:'none', fontSize:15, fontWeight:800,
          background: (!paid || loading) ? '#94a3b8' : '#059669', color:'#fff',
          cursor: (!paid || loading) ? 'not-allowed' : 'pointer',
          boxShadow: paid && !loading ? '0 4px 16px rgba(5,150,105,0.35)' : 'none',
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          fontFamily:'inherit', transition:'all 0.2s',
        }}>
        {loading ? <><Loader size={16} style={{ animation:'spin 1s linear infinite' }}/> Recording...</> : <><CreditCard size={16}/> Pay ₹{paid ? paid.toLocaleString('en-IN') : '0'}</>}
      </button>
    </div>
  );
}

/* ═══════ SUCCESS MODAL ═══════ */
function SuccessModal({ data, student, onPrint, onAnother }) {
  const infoItems = [
    { label:'Student', value: student?.name },
    { label:'Amount', value: `₹${data.amount?.toLocaleString('en-IN')}` },
    { label:'Class', value: student?.cls },
    { label:'Date', value: data.date },
    { label:'Mode', value: data.mode },
    { label:'Slip No', value: data.slipNo || data.receipt },
  ];
  return (
    <div style={{ position:'fixed', inset:0, zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(15,23,42,0.55)', backdropFilter:'blur(6px)' }}>
      <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ type:'spring', stiffness:300, damping:25 }}
        style={{ background:'#fff', borderRadius:24, padding:'40px 36px', width:440, boxShadow:'0 24px 64px rgba(0,0,0,0.18)', textAlign:'center' }}>
        {/* Animated checkmark */}
        <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.15, type:'spring', stiffness:400, damping:15 }}
          style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#10b981,#059669)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px', boxShadow:'0 8px 30px rgba(16,185,129,0.35)' }}>
          <Check size={36} color="#fff" strokeWidth={3}/>
        </motion.div>
        <h2 style={{ fontSize:22, fontWeight:800, color:'#0f172a', margin:'0 0 6px' }}>Payment Recorded!</h2>
        <p style={{ fontSize:14, fontWeight:500, color:'#94a3b8', margin:'0 0 20px' }}>Receipt No: <strong style={{ color:'#2563eb' }}>{data.receipt}</strong></p>

        {/* Info grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:24, textAlign:'left' }}>
          {infoItems.map(i => (
            <div key={i.label} style={{ background:'#f8fafc', borderRadius:10, padding:'10px 12px' }}>
              <div style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:3 }}>{i.label}</div>
              <div style={{ fontSize:13, fontWeight:700, color:'#0f172a' }}>{i.value || '–'}</div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onPrint} style={{ flex:1, height:44, borderRadius:12, border:'1.5px solid #e2e8f0', background:'#fff', fontSize:13, fontWeight:700, color:'#475569', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
            <Printer size={15}/> Print Receipt
          </button>
          <button onClick={onAnother} style={{ flex:1, height:44, borderRadius:12, border:'none', background:'#2563eb', fontSize:13, fontWeight:700, color:'#fff', cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 12px rgba(37,99,235,0.3)', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
            <CreditCard size={15}/> Collect Another
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════ RECEIPT PREVIEW ═══════ */
function ReceiptPreview({ data, student, onClose }) {
  const rows = BREAKDOWN.slice(0,4);
  const total = data?.amount || 0;

  const numToWords = (n) => {
    const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
    const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
    if (n === 0) return 'Zero';
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? ' ' + ones[n%10] : '');
    if (n < 1000) return ones[Math.floor(n/100)] + ' Hundred' + (n%100 ? ' and ' + numToWords(n%100) : '');
    if (n < 100000) return numToWords(Math.floor(n/1000)) + ' Thousand' + (n%1000 ? ' ' + numToWords(n%1000) : '');
    return numToWords(Math.floor(n/100000)) + ' Lakh' + (n%100000 ? ' ' + numToWords(n%100000) : '');
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(15,23,42,0.55)', backdropFilter:'blur(6px)' }}>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        style={{ background:'#fff', borderRadius:20, width:600, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 24px 64px rgba(0,0,0,0.18)' }}>

        {/* Toolbar */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 24px', borderBottom:'1px solid #f1f5f9' }}>
          <p style={{ fontSize:14, fontWeight:700, color:'#475569', margin:0 }}>Receipt Preview</p>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => window.print()} style={{ display:'flex', alignItems:'center', gap:5, height:32, padding:'0 14px', background:'#2563eb', border:'none', borderRadius:8, fontSize:12, fontWeight:700, color:'#fff', cursor:'pointer', fontFamily:'inherit' }}><Printer size={12}/> Print</button>
            <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, border:'1px solid #e2e8f0', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#64748b' }}><X size={14}/></button>
          </div>
        </div>

        {/* Receipt body */}
        <div style={{ padding:'28px 32px' }}>
          {/* Letterhead */}
          <div style={{ textAlign:'center', marginBottom:20, paddingBottom:16, borderBottom:'2px solid #0f172a' }}>
            <div style={{ width:48, height:48, borderRadius:12, background:'linear-gradient(135deg,#2563eb,#1d4ed8)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 8px', color:'#fff', fontSize:18, fontWeight:900 }}>J</div>
            <h2 style={{ fontSize:18, fontWeight:800, color:'#0f172a', margin:'0 0 2px' }}>JSK Educational Institute</h2>
            <p style={{ fontSize:11, color:'#64748b', margin:0, fontWeight:500 }}>123 Education Road, Knowledge City · Ph: 9876543210</p>
          </div>

          {/* Receipt title */}
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
            <div>
              <p style={{ fontSize:16, fontWeight:800, color:'#0f172a', margin:'0 0 4px' }}>Fee Receipt</p>
              <p style={{ fontSize:12, fontWeight:600, color:'#64748b', margin:0 }}>Academic Year 2025-26</p>
            </div>
            <div style={{ textAlign:'right' }}>
              <p style={{ fontSize:12, fontWeight:700, color:'#2563eb', margin:'0 0 4px' }}>Receipt #{data?.receipt}</p>
              <p style={{ fontSize:12, fontWeight:500, color:'#64748b', margin:0 }}>Date: {data?.date}</p>
            </div>
          </div>

          {/* Student info */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:20, background:'#f8fafc', borderRadius:10, padding:'12px 14px' }}>
            <div><span style={{ fontSize:10, fontWeight:700, color:'#94a3b8' }}>STUDENT</span><p style={{ fontSize:13, fontWeight:700, color:'#0f172a', margin:'2px 0 0' }}>{student?.name}</p></div>
            <div><span style={{ fontSize:10, fontWeight:700, color:'#94a3b8' }}>ADM NO</span><p style={{ fontSize:13, fontWeight:700, color:'#0f172a', margin:'2px 0 0' }}>{student?.admission_no}</p></div>
            <div><span style={{ fontSize:10, fontWeight:700, color:'#94a3b8' }}>CLASS</span><p style={{ fontSize:13, fontWeight:700, color:'#0f172a', margin:'2px 0 0' }}>{student?.cls}</p></div>
            <div><span style={{ fontSize:10, fontWeight:700, color:'#94a3b8' }}>PAYMENT MODE</span><p style={{ fontSize:13, fontWeight:700, color:'#0f172a', margin:'2px 0 0' }}>{data?.mode}</p></div>
          </div>

          {/* Fee rows */}
          <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:16, fontSize:12 }}>
            <thead>
              <tr style={{ borderBottom:'2px solid #0f172a' }}>
                <th style={{ padding:'8px 6px', textAlign:'left', fontWeight:800, color:'#0f172a' }}>#</th>
                <th style={{ padding:'8px 6px', textAlign:'left', fontWeight:800, color:'#0f172a' }}>Fee Head</th>
                <th style={{ padding:'8px 6px', textAlign:'left', fontWeight:800, color:'#0f172a' }}>Month</th>
                <th style={{ padding:'8px 6px', textAlign:'right', fontWeight:800, color:'#0f172a' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r,i) => (
                <tr key={i} style={{ borderBottom:'1px solid #e2e8f0' }}>
                  <td style={{ padding:'8px 6px', color:'#64748b' }}>{i+1}</td>
                  <td style={{ padding:'8px 6px', fontWeight:600, color:'#0f172a' }}>{r.head}</td>
                  <td style={{ padding:'8px 6px', color:'#64748b' }}>{r.month}</td>
                  <td style={{ padding:'8px 6px', textAlign:'right', fontWeight:700 }}>₹{r.payable.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop:'2px solid #0f172a' }}>
                <td colSpan={3} style={{ padding:'10px 6px', fontWeight:800, fontSize:14, color:'#0f172a' }}>Total</td>
                <td style={{ padding:'10px 6px', textAlign:'right', fontWeight:900, fontSize:16, color:'#2563eb' }}>₹{total.toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>

          {/* Amount in words */}
          <div style={{ background:'#eff6ff', borderRadius:8, padding:'10px 14px', marginBottom:24 }}>
            <p style={{ fontSize:11, fontWeight:700, color:'#64748b', margin:'0 0 2px' }}>AMOUNT IN WORDS</p>
            <p style={{ fontSize:13, fontWeight:700, color:'#1e40af', margin:0 }}>Rupees {numToWords(total)} Only</p>
          </div>

          {/* Signature */}
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:40 }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ width:140, borderTop:'1.5px solid #0f172a', paddingTop:6 }}>
                <p style={{ fontSize:11, fontWeight:600, color:'#64748b', margin:0 }}>Student / Parent</p>
              </div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ width:140, borderTop:'1.5px solid #0f172a', paddingTop:6 }}>
                <p style={{ fontSize:11, fontWeight:600, color:'#64748b', margin:0 }}>Authorized Signatory</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
