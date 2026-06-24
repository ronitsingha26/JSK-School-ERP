import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Upload, Download, Save, CheckCircle, AlertTriangle, X } from 'lucide-react';

const EXAMS    = [{ id: 2, name: 'Half Yearly 2025-26' }, { id: 1, name: 'Unit Test 1' }];
const CLASSES  = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];
const SECTIONS = ['A','B','C'];
const SUBJECTS = ['English','Hindi','Mathematics','Science','Social Science'];

const STUDENTS = [
  { id:1, name:'Aaditya Kumar',   admission_no:'JSK20250001', roll:'01' },
  { id:2, name:'Priya Sharma',    admission_no:'JSK20250002', roll:'02' },
  { id:3, name:'Rahul Verma',     admission_no:'JSK20250003', roll:'03' },
  { id:4, name:'Sneha Gupta',     admission_no:'JSK20250004', roll:'04' },
  { id:5, name:'Vikash Yadav',    admission_no:'JSK20250005', roll:'05' },
  { id:6, name:'Anjali Singh',    admission_no:'JSK20250006', roll:'06' },
  { id:7, name:'Rohit Mishra',    admission_no:'JSK20250007', roll:'07' },
  { id:8, name:'Kavita Patel',    admission_no:'JSK20250008', roll:'08' },
];

const COLORS = [
  ['#3b82f6','#1d4ed8'],['#8b5cf6','#6d28d9'],['#10b981','#059669'],
  ['#f59e0b','#d97706'],['#ef4444','#dc2626'],['#06b6d4','#0891b2'],
  ['#6366f1','#4f46e5'],['#84cc16','#65a30d'],
];
const avatarBg = id => { const [a,b]=COLORS[id%COLORS.length]; return `linear-gradient(135deg,${a},${b})`; };
const initials = n => n.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);

const fade = { hidden:{opacity:0,y:10}, show:{opacity:1,y:0,transition:{duration:0.28}} };

export default function MarksEntry() {
  const [selExam,    setSelExam]    = useState('');
  const [selClass,   setSelClass]   = useState('');
  const [selSection, setSelSection] = useState('');
  const [selSubject, setSelSubject] = useState('');
  const [marks,      setMarks]      = useState({});       // { studentId: { theory, absent } }
  const [saveStatus, setSaveStatus] = useState('idle');   // idle | saving | saved
  const [showSubmit, setShowSubmit] = useState(false);

  const MAX_MARKS  = 100;
  const PASS_MARKS = 33;
  const tableReady = selExam && selClass && selSection && selSubject;

  const entered  = STUDENTS.filter(s => marks[s.id]?.theory !== undefined && marks[s.id]?.theory !== '' && !marks[s.id]?.absent).length;
  const absent   = STUDENTS.filter(s => marks[s.id]?.absent).length;
  const pending  = STUDENTS.length - entered - absent;
  const allDone  = pending === 0;

  const setMark = (sid, field, val) => {
    setMarks(p => ({ ...p, [sid]: { ...p[sid], [field]: val } }));
    setSaveStatus('idle');
  };

  const toggleAbsent = sid => {
    setMarks(p => ({
      ...p,
      [sid]: { ...p[sid], absent: !p[sid]?.absent, theory: '' },
    }));
  };

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 1000);
  };

  const getTheory = sid => marks[sid]?.theory ?? '';
  const isAbsent  = sid => marks[sid]?.absent || false;
  const total     = sid => {
    const t = parseFloat(marks[sid]?.theory);
    if (isAbsent(sid)) return 'AB';
    if (isNaN(t) || marks[sid]?.theory === '') return '—';
    return t;
  };
  const isPassing = sid => {
    const t = parseFloat(marks[sid]?.theory);
    return !isNaN(t) && t >= PASS_MARKS;
  };
  const isOver = sid => {
    const t = parseFloat(marks[sid]?.theory);
    return !isNaN(t) && t > MAX_MARKS;
  };

  const selectStyle = { height:44, border:'1.5px solid #e2e8f0', borderRadius:12, padding:'0 14px', fontSize:13, fontWeight:600, color:'#0f172a', outline:'none', fontFamily:'inherit', background:'#fff', cursor:'pointer' };

  return (
    <motion.div initial="hidden" animate="show" variants={{show:{transition:{staggerChildren:0.06}}}} style={{paddingBottom:80,minWidth:0}}>

      {/* HEADER */}
      <motion.div variants={fade} style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16,marginBottom:24}}>
        <div>
          <h1 style={{fontSize:26,fontWeight:800,color:'#0f172a',margin:0,letterSpacing:'-0.5px'}}>Marks Entry</h1>
          <p style={{fontSize:14,color:'#94a3b8',marginTop:6,fontWeight:500}}>
            {selExam ? EXAMS.find(e=>e.id===parseInt(selExam))?.name : 'Select exam to begin entering marks'}
          </p>
        </div>
        {/* Auto-save indicator */}
        <div style={{display:'flex',alignItems:'center',gap:8,fontSize:12,fontWeight:700}}>
          {saveStatus==='saving' && <><span style={{width:8,height:8,borderRadius:'50%',background:'#f59e0b',display:'inline-block'}}/>Saving...</>}
          {saveStatus==='saved'  && <><span style={{width:8,height:8,borderRadius:'50%',background:'#10b981',display:'inline-block'}}/>All changes saved</>}
          {saveStatus==='idle'   && <><span style={{width:8,height:8,borderRadius:'50%',background:'#cbd5e1',display:'inline-block'}}/>Not saved</>}
        </div>
      </motion.div>

      {/* STEP SELECTOR */}
      <motion.div variants={fade} style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:18,padding:'22px 24px',boxShadow:'0 1px 4px rgba(0,0,0,0.04)',marginBottom:20}}>
        <p style={{fontSize:13,fontWeight:700,color:'#475569',margin:'0 0 14px'}}>Select Exam · Class · Subject</p>
        <div style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'center'}}>
          {/* Step 1 */}
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
            <span style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em'}}>Step 1 — Exam</span>
            <select value={selExam} onChange={e=>{setSelExam(e.target.value);setSelClass('');setSelSection('');setSelSubject('');}} style={{...selectStyle,minWidth:200}}>
              <option value="">Select Exam</option>
              {EXAMS.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          {/* Step 2 */}
          {selExam && (
            <>
              <div style={{display:'flex',flexDirection:'column',gap:4}}>
                <span style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em'}}>Step 2 — Class</span>
                <select value={selClass} onChange={e=>{setSelClass(e.target.value);setSelSection('');setSelSubject('');}} style={{...selectStyle,minWidth:130}}>
                  <option value="">Select Class</option>
                  {CLASSES.map(c=><option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:4}}>
                <span style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em'}}>Section</span>
                <select value={selSection} onChange={e=>{setSelSection(e.target.value);setSelSubject('');}} style={{...selectStyle,minWidth:130}}>
                  <option value="">Select Section</option>
                  {SECTIONS.map(s=><option key={s} value={s}>Section {s}</option>)}
                </select>
              </div>
            </>
          )}
          {/* Step 3 */}
          {selClass && selSection && (
            <div style={{display:'flex',flexDirection:'column',gap:4}}>
              <span style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em'}}>Step 3 — Subject</span>
              <select value={selSubject} onChange={e=>setSelSubject(e.target.value)} style={{...selectStyle,minWidth:170}}>
                <option value="">Select Subject</option>
                {SUBJECTS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}
        </div>
        {/* Chips */}
        {(selExam || selClass || selSubject) && (
          <div style={{display:'flex',gap:8,marginTop:12,flexWrap:'wrap'}}>
            {selExam    && <Chip label={EXAMS.find(e=>e.id===parseInt(selExam))?.name} onClear={()=>{setSelExam('');setSelClass('');setSelSection('');setSelSubject('');}}/>}
            {selClass && selSection && <Chip label={`Class ${selClass}-${selSection}`} onClear={()=>{setSelClass('');setSelSection('');setSelSubject('');}}/>}
            {selSubject && <Chip label={selSubject} onClear={()=>setSelSubject('')}/>}
          </div>
        )}
      </motion.div>

      {/* STATS ROW */}
      <AnimatePresence>
        {tableReady && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:16}}>
            {[
              {label:'Total Students', value:STUDENTS.length, color:'#2563eb', bg:'#eff6ff'},
              {label:'Marks Entered',  value:entered,          color:'#059669', bg:'#ecfdf5'},
              {label:'Absent',         value:absent,           color:'#d97706', bg:'#fffbeb'},
            ].map(s=>(
              <div key={s.label} style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:14,padding:'14px 18px',display:'flex',alignItems:'center',gap:14}}>
                <div style={{width:40,height:40,borderRadius:10,background:s.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:800,color:s.color}}>{s.value}</div>
                <div style={{fontSize:12,fontWeight:700,color:'#475569'}}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MARKS TABLE */}
      <AnimatePresence>
        {tableReady && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:18,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
            {/* Table Header bar */}
            <div style={{padding:'16px 22px',borderBottom:'1.5px solid #f1f5f9',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
              <div>
                <p style={{fontSize:14,fontWeight:800,color:'#0f172a',margin:0}}>
                  Class {selClass}-{selSection} &nbsp;|&nbsp; {selSubject} &nbsp;|&nbsp; {EXAMS.find(e=>e.id===parseInt(selExam))?.name}
                </p>
                <p style={{fontSize:12,fontWeight:600,color:'#94a3b8',margin:'4px 0 0'}}>Max Marks: {MAX_MARKS} &nbsp;|&nbsp; Pass Marks: {PASS_MARKS}</p>
              </div>
              <div style={{display:'flex',gap:8}}>
                <ToolBtn icon={Upload} label="Import Excel"/>
                <ToolBtn icon={Download} label="Export Template"/>
              </div>
            </div>

            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{background:'#fafbfc',borderBottom:'1.5px solid #e2e8f0'}}>
                    {['#','Student','Theory /100','Practical','Total','Absent'].map(h=>(
                      <th key={h} style={{padding:'11px 14px',textAlign:'left',fontSize:10,fontWeight:800,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {STUDENTS.map((s,i)=>{
                    const ab   = isAbsent(s.id);
                    const tot  = total(s.id);
                    const pass = !ab && typeof tot === 'number' && tot >= PASS_MARKS;
                    const fail = !ab && typeof tot === 'number' && tot < PASS_MARKS;
                    const over = isOver(s.id);

                    return (
                      <tr key={s.id} style={{
                        borderBottom:'1px solid #f1f5f9',
                        background: ab ? '#f8fafc' : (fail && typeof tot==='number' ? '#fff5f5' : 'transparent'),
                        opacity: ab ? 0.65 : 1,
                        transition:'background 0.15s',
                      }}>
                        <td style={{padding:'12px 14px',fontSize:13,fontWeight:600,color:'#94a3b8'}}>{i+1}</td>
                        {/* Student */}
                        <td style={{padding:'12px 14px'}}>
                          <div style={{display:'flex',alignItems:'center',gap:10}}>
                            <div style={{width:34,height:34,borderRadius:'50%',background:avatarBg(s.id),display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:11,fontWeight:800,flexShrink:0}}>{initials(s.name)}</div>
                            <div>
                              <div style={{fontSize:13,fontWeight:700,color:ab?'#94a3b8':'#0f172a'}}>{s.name}</div>
                              <div style={{fontSize:10,fontWeight:600,color:'#94a3b8'}}>{s.admission_no} · Roll {s.roll}</div>
                            </div>
                          </div>
                        </td>
                        {/* Theory Input */}
                        <td style={{padding:'12px 14px'}}>
                          <input
                            type="number" min={0} max={MAX_MARKS}
                            value={getTheory(s.id)}
                            disabled={ab}
                            onChange={e=>setMark(s.id,'theory',e.target.value)}
                            onKeyDown={e=>{ if(e.key==='Tab'&&!e.shiftKey){ e.preventDefault(); document.getElementById(`theory-${STUDENTS[i+1]?.id}`)?.focus(); } }}
                            id={`theory-${s.id}`}
                            placeholder="—"
                            style={{
                              width:90,height:36,border:`2px solid ${over?'#ef4444':pass?'#10b981':fail?'#ef4444':'#e2e8f0'}`,
                              borderRadius:9,padding:'0 10px',fontSize:13,fontWeight:700,
                              color:'#0f172a',outline:'none',fontFamily:'inherit',
                              background: ab ? '#f1f5f9' : '#fff',
                              cursor: ab ? 'not-allowed' : 'text',
                            }}
                          />
                          {over && <span style={{display:'block',fontSize:10,color:'#ef4444',fontWeight:700,marginTop:2}}>Exceeds max!</span>}
                        </td>
                        {/* Practical */}
                        <td style={{padding:'12px 14px'}}>
                          <span style={{fontSize:12,fontWeight:600,color:'#cbd5e1',padding:'4px 10px',borderRadius:6,background:'#f8fafc'}}>N/A</span>
                        </td>
                        {/* Total */}
                        <td style={{padding:'12px 14px'}}>
                          {ab ? (
                            <span style={{fontSize:12,fontWeight:800,color:'#d97706',background:'#fff7ed',padding:'3px 10px',borderRadius:6}}>AB</span>
                          ) : typeof tot==='number' ? (
                            <span style={{fontSize:14,fontWeight:800,color:pass?'#059669':'#ef4444',display:'flex',alignItems:'center',gap:4}}>
                              {tot} {pass ? '✅' : '❌'}
                            </span>
                          ) : (
                            <span style={{fontSize:13,color:'#cbd5e1'}}>—</span>
                          )}
                        </td>
                        {/* Absent */}
                        <td style={{padding:'12px 14px'}}>
                          <div
                            onClick={()=>toggleAbsent(s.id)}
                            style={{width:20,height:20,borderRadius:5,border:`2px solid ${ab?'#d97706':'#cbd5e1'}`,background:ab?'#d97706':'#fff',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all 0.12s'}}
                          >
                            {ab && <span style={{color:'#fff',fontSize:12,lineHeight:1,fontWeight:900}}>✓</span>}
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
      </AnimatePresence>

      {/* EMPTY STATE */}
      {!tableReady && (
        <motion.div variants={fade} style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:18,padding:'60px 32px',textAlign:'center',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
          <div style={{width:64,height:64,borderRadius:16,background:'linear-gradient(135deg,#eff6ff,#dbeafe)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>
            <Search size={28} color="#2563eb" strokeWidth={1.5}/>
          </div>
          <h3 style={{fontSize:17,fontWeight:800,color:'#0f172a',margin:'0 0 6px'}}>Select Exam, Class & Subject</h3>
          <p style={{fontSize:13,color:'#94a3b8',margin:0,maxWidth:340,marginLeft:'auto',marginRight:'auto',lineHeight:1.6}}>
            Use the step selector above to choose an exam, class/section, and subject to load the marks entry sheet.
          </p>
        </motion.div>
      )}

      {/* STICKY BOTTOM ACTION BAR */}
      {tableReady && (
        <div style={{position:'fixed',bottom:0,left:260,right:0,background:'#fff',borderTop:'1px solid #e2e8f0',padding:'14px 32px',display:'flex',justifyContent:'space-between',alignItems:'center',zIndex:50}}>
          <p style={{fontSize:13,fontWeight:600,color:'#475569',margin:0}}>
            <strong style={{color:'#0f172a'}}>{entered}</strong> of {STUDENTS.length} students marked &nbsp;·&nbsp;
            <strong style={{color:'#d97706'}}>{absent}</strong> absent &nbsp;·&nbsp;
            <strong style={{color:'#ef4444'}}>{pending}</strong> pending
          </p>
          <div style={{display:'flex',gap:10}}>
            <button onClick={handleSave} style={{height:42,padding:'0 22px',borderRadius:11,border:'1.5px solid #2563eb',background:'#fff',fontSize:13,fontWeight:700,color:'#2563eb',cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',gap:6}}>
              <Save size={15}/> Save Progress
            </button>
            <button
              onClick={()=>setShowSubmit(true)}
              disabled={!allDone}
              style={{height:42,padding:'0 22px',borderRadius:11,border:'none',background:allDone?'#2563eb':'#94a3b8',fontSize:13,fontWeight:700,color:'#fff',cursor:allDone?'pointer':'not-allowed',fontFamily:'inherit',boxShadow:allDone?'0 4px 12px rgba(37,99,235,0.3)':'none',display:'flex',alignItems:'center',gap:6,transition:'all 0.2s'}}
            >
              <CheckCircle size={15}/> Submit Final
            </button>
          </div>
        </div>
      )}

      {/* SUBMIT MODAL */}
      <AnimatePresence>
        {showSubmit && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:'fixed',inset:0,zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(15,23,42,0.5)',backdropFilter:'blur(4px)'}}>
            <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.9,opacity:0}} style={{background:'#fff',borderRadius:20,padding:'32px 36px',width:420,boxShadow:'0 24px 64px rgba(0,0,0,0.18)',textAlign:'center'}}>
              <div style={{width:56,height:56,borderRadius:'50%',background:'#fff7ed',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
                <AlertTriangle size={28} color="#d97706"/>
              </div>
              <h3 style={{fontSize:18,fontWeight:800,color:'#0f172a',margin:'0 0 8px'}}>Submit Marks for {selSubject}?</h3>
              <p style={{fontSize:13,color:'#64748b',margin:'0 0 6px'}}>Class {selClass}-{selSection}</p>
              <p style={{fontSize:13,color:'#64748b',margin:'0 0 24px',lineHeight:1.6}}>
                Once submitted, marks cannot be edited without admin approval.
              </p>
              <div style={{display:'flex',gap:10}}>
                <button onClick={()=>setShowSubmit(false)} style={{flex:1,height:42,borderRadius:10,border:'1.5px solid #e2e8f0',background:'#fff',fontSize:13,fontWeight:700,color:'#475569',cursor:'pointer',fontFamily:'inherit'}}>Cancel</button>
                <button onClick={()=>{setShowSubmit(false);setSaveStatus('saved');}} style={{flex:1,height:42,borderRadius:10,border:'none',background:'#ef4444',fontSize:13,fontWeight:700,color:'#fff',cursor:'pointer',fontFamily:'inherit',boxShadow:'0 4px 12px rgba(239,68,68,0.3)'}}>Yes, Submit Marks</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Chip({ label, onClear }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:6,padding:'4px 12px',borderRadius:99,background:'#eff6ff',border:'1px solid #bfdbfe'}}>
      <span style={{fontSize:12,fontWeight:700,color:'#2563eb'}}>{label}</span>
      <button onClick={onClear} style={{width:16,height:16,borderRadius:'50%',border:'none',background:'#bfdbfe',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>
        <X size={10} color="#2563eb"/>
      </button>
    </div>
  );
}

function ToolBtn({ icon: Icon, label }) {
  const [hov, setHov] = useState(false);
  return (
    <button onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{display:'flex',alignItems:'center',gap:6,height:34,padding:'0 14px',borderRadius:9,border:`1.5px solid ${hov?'#2563eb':'#e2e8f0'}`,background:hov?'#eff6ff':'#fff',fontSize:12,fontWeight:700,color:hov?'#2563eb':'#64748b',cursor:'pointer',fontFamily:'inherit',transition:'all 0.15s'}}>
      <Icon size={13}/> {label}
    </button>
  );
}
