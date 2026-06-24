import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Printer, Download, BarChart2 } from 'lucide-react';

const EXAMS   = [{ id:2, name:'Half Yearly 2025-26' }, { id:1, name:'Unit Test 1' }];
const CLASSES  = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];
const SECTIONS = ['A','B','C'];

const STUDENTS = [
  { id:1, name:'Aaditya Kumar',  admission_no:'JSK20250001', roll:'05', father:'Rajesh Kumar',  cls:'I', sec:'A' },
  { id:2, name:'Priya Sharma',   admission_no:'JSK20250002', roll:'12', father:'Suresh Sharma', cls:'I', sec:'A' },
  { id:3, name:'Rahul Verma',    admission_no:'JSK20250003', roll:'18', father:'Anil Verma',    cls:'I', sec:'A' },
  { id:4, name:'Sneha Gupta',    admission_no:'JSK20250004', roll:'22', father:'Vikram Gupta',  cls:'I', sec:'A' },
];

const MARKS_DATA = {
  1: [
    { subject:'English',        max:100, theory:82, practical:0, grade:'A',  remarks:'Excellent'  },
    { subject:'Hindi',          max:100, theory:78, practical:0, grade:'B+', remarks:'Very Good'   },
    { subject:'Mathematics',    max:100, theory:91, practical:0, grade:'A+', remarks:'Outstanding' },
    { subject:'Science',        max:100, theory:74, practical:0, grade:'B+', remarks:'Very Good'   },
    { subject:'Social Science', max:100, theory:69, practical:0, grade:'B',  remarks:'Good'        },
  ],
  2: [
    { subject:'English',        max:100, theory:65, practical:0, grade:'B',  remarks:'Good'       },
    { subject:'Hindi',          max:100, theory:71, practical:0, grade:'B+', remarks:'Very Good'  },
    { subject:'Mathematics',    max:100, theory:88, practical:0, grade:'A',  remarks:'Excellent'  },
    { subject:'Science',        max:100, theory:59, practical:0, grade:'C',  remarks:'Average'    },
    { subject:'Social Science', max:100, theory:62, practical:0, grade:'B',  remarks:'Good'       },
  ],
};

const fade = { hidden:{opacity:0,y:10}, show:{opacity:1,y:0,transition:{duration:0.28}} };
const GRADE_COLORS = { 'A+':'#059669','A':'#2563eb','B+':'#7c3aed','B':'#0891b2','C':'#d97706','D':'#ea580c','F':'#ef4444' };

export default function ReportCard() {
  const [selExam,    setSelExam]    = useState('');
  const [selClass,   setSelClass]   = useState('');
  const [selSection, setSelSection] = useState('');
  const [studentIdx, setStudentIdx] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef(null);

  const student  = STUDENTS[studentIdx];
  const subjects = MARKS_DATA[student?.id] || MARKS_DATA[1];
  const totalObt = subjects.reduce((s,r)=>s+r.theory,0);
  const totalMax = subjects.reduce((s,r)=>s+r.max,0);
  const pct      = ((totalObt/totalMax)*100).toFixed(2);
  const grade    = totalObt/totalMax>=0.9?'A+':totalObt/totalMax>=0.8?'A':totalObt/totalMax>=0.7?'B+':totalObt/totalMax>=0.6?'B':totalObt/totalMax>=0.5?'C':totalObt/totalMax>=0.33?'D':'F';
  const isPassed = subjects.every(s=>s.theory>=33);

  const selectStyle = {height:44,border:'1.5px solid #e2e8f0',borderRadius:12,padding:'0 14px',fontSize:13,fontWeight:600,color:'#0f172a',outline:'none',fontFamily:'inherit',background:'#fff',cursor:'pointer'};

  const goNext = () => setStudentIdx(i => Math.min(i+1, STUDENTS.length-1));
  const goPrev = () => setStudentIdx(i => Math.max(i-1, 0));

  const ready = selExam && selClass && selSection;

  return (
    <motion.div initial="hidden" animate="show" variants={{show:{transition:{staggerChildren:0.07}}}} style={{paddingBottom:40,minWidth:0}}>

      {/* HEADER */}
      <motion.div variants={fade} style={{marginBottom:24}}>
        <h1 style={{fontSize:26,fontWeight:800,color:'#0f172a',margin:0,letterSpacing:'-0.5px'}}>Report Cards</h1>
        <p style={{fontSize:14,color:'#94a3b8',marginTop:6,fontWeight:500}}>Preview and print student progress report cards</p>
      </motion.div>

      {/* SELECTOR */}
      <motion.div variants={fade} style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:18,padding:'22px 24px',boxShadow:'0 1px 4px rgba(0,0,0,0.04)',marginBottom:20}}>
        <p style={{fontSize:13,fontWeight:700,color:'#475569',margin:'0 0 14px'}}>Select Exam · Class · Section</p>
        <div style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'flex-end'}}>
          <div>
            <label style={{fontSize:11,fontWeight:700,color:'#64748b',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.05em'}}>Exam</label>
            <select value={selExam} onChange={e=>setSelExam(e.target.value)} style={{...selectStyle,minWidth:200}}>
              <option value="">Select Exam</option>
              {EXAMS.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontSize:11,fontWeight:700,color:'#64748b',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.05em'}}>Class</label>
            <select value={selClass} onChange={e=>setSelClass(e.target.value)} style={{...selectStyle,minWidth:130}}>
              <option value="">Select Class</option>
              {CLASSES.map(c=><option key={c} value={c}>Class {c}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontSize:11,fontWeight:700,color:'#64748b',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.05em'}}>Section</label>
            <select value={selSection} onChange={e=>setSelSection(e.target.value)} style={{...selectStyle,minWidth:130}}>
              <option value="">Select Section</option>
              {SECTIONS.map(s=><option key={s} value={s}>Section {s}</option>)}
            </select>
          </div>
          {ready && (
            <button onClick={()=>setShowPreview(true)}
              style={{height:44,padding:'0 20px',borderRadius:12,border:'none',background:'#2563eb',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit',boxShadow:'0 4px 12px rgba(37,99,235,0.3)',display:'flex',alignItems:'center',gap:6}}>
              <Printer size={15}/> Generate All Report Cards
            </button>
          )}
        </div>
      </motion.div>

      {/* REPORT CARD PREVIEW */}
      <AnimatePresence>
        {ready && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
            {/* Navigation Bar */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,background:'#fff',border:'1px solid #e2e8f0',borderRadius:14,padding:'12px 20px'}}>
              <div style={{display:'flex',gap:8}}>
                <NavBtn icon={Printer}   label="Print This Card"       onClick={()=>window.print()} />
                <NavBtn icon={Download}  label="Download PDF"          onClick={()=>{}} />
                <NavBtn icon={BarChart2} label="View Analysis"         onClick={()=>{}} blue />
              </div>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <button onClick={goPrev} disabled={studentIdx===0}
                  style={{width:34,height:34,borderRadius:9,border:'1.5px solid #e2e8f0',background:studentIdx===0?'#f8fafc':'#fff',cursor:studentIdx===0?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <ChevronLeft size={18} color={studentIdx===0?'#cbd5e1':'#475569'}/>
                </button>
                <span style={{fontSize:13,fontWeight:700,color:'#475569'}}>Student {studentIdx+1} of {STUDENTS.length}</span>
                <button onClick={goNext} disabled={studentIdx===STUDENTS.length-1}
                  style={{width:34,height:34,borderRadius:9,border:'1.5px solid #e2e8f0',background:studentIdx===STUDENTS.length-1?'#f8fafc':'#fff',cursor:studentIdx===STUDENTS.length-1?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <ChevronRight size={18} color={studentIdx===STUDENTS.length-1?'#cbd5e1':'#475569'}/>
                </button>
              </div>
            </div>

            {/* THE REPORT CARD */}
            <div ref={printRef} style={{background:'#fff',border:'2px solid #0f172a',borderRadius:4,maxWidth:680,margin:'0 auto',overflow:'hidden',fontFamily:'Inter,sans-serif'}}>

              {/* School Header */}
              <div style={{background:'#0f172a',color:'#fff',textAlign:'center',padding:'20px 24px'}}>
                <div style={{fontSize:18,fontWeight:900,letterSpacing:'0.05em',textTransform:'uppercase'}}>JSK Educational & Social</div>
                <div style={{fontSize:16,fontWeight:700,marginTop:2}}>Welfare Foundation</div>
                <div style={{fontSize:11,fontWeight:500,marginTop:4,color:'#94a3b8'}}>Pratapganj, Bihar</div>
              </div>
              <div style={{background:'#2563eb',color:'#fff',textAlign:'center',padding:'10px',fontSize:14,fontWeight:800,letterSpacing:'0.1em',textTransform:'uppercase'}}>
                Student Progress Report Card
              </div>

              {/* Student Info */}
              <div style={{padding:'16px 20px',borderBottom:'2px solid #0f172a'}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px 24px',fontSize:13}}>
                  {[
                    {l:'Name',        v:`${student.name}`},
                    {l:'Adm. No.',    v:student.admission_no},
                    {l:'Class',       v:`${student.cls} – ${student.sec}`},
                    {l:'Roll No.',    v:student.roll},
                    {l:"Father's Name", v:student.father},
                    {l:'Session',     v:'2025-26'},
                    {l:'Exam',        v:EXAMS.find(e=>e.id===parseInt(selExam))?.name},
                    {l:'Date',        v:'May 2026'},
                  ].map(r=>(
                    <div key={r.l} style={{display:'flex',gap:6}}>
                      <span style={{fontWeight:700,color:'#475569',minWidth:100}}>{r.l}:</span>
                      <span style={{fontWeight:600,color:'#0f172a'}}>{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Marks Table */}
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                <thead>
                  <tr style={{background:'#f1f5f9',borderBottom:'2px solid #0f172a'}}>
                    {['Subject','Max','Theory','Practical','Total','Grade','Remarks'].map(h=>(
                      <th key={h} style={{padding:'9px 10px',textAlign:h==='Max'||h==='Theory'||h==='Practical'||h==='Total'?'center':'left',fontWeight:800,color:'#0f172a',fontSize:11,borderRight:'1px solid #e2e8f0'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((row,i)=>{
                    const gc = GRADE_COLORS[row.grade] || '#475569';
                    return (
                      <tr key={row.subject} style={{borderBottom:'1px solid #e2e8f0',background:i%2===0?'#fff':'#fafbfc'}}>
                        <td style={{padding:'9px 10px',fontWeight:700,color:'#0f172a',borderRight:'1px solid #e2e8f0'}}>{row.subject}</td>
                        <td style={{padding:'9px 10px',textAlign:'center',fontWeight:600,color:'#64748b',borderRight:'1px solid #e2e8f0'}}>{row.max}</td>
                        <td style={{padding:'9px 10px',textAlign:'center',fontWeight:700,color:'#0f172a',borderRight:'1px solid #e2e8f0'}}>{row.theory}</td>
                        <td style={{padding:'9px 10px',textAlign:'center',fontWeight:600,color:'#94a3b8',borderRight:'1px solid #e2e8f0'}}>{row.practical||'—'}</td>
                        <td style={{padding:'9px 10px',textAlign:'center',fontWeight:800,color:'#0f172a',borderRight:'1px solid #e2e8f0'}}>{row.theory}</td>
                        <td style={{padding:'9px 10px',textAlign:'center',borderRight:'1px solid #e2e8f0'}}>
                          <span style={{fontWeight:900,color:gc,fontSize:13}}>{row.grade}</span>
                        </td>
                        <td style={{padding:'9px 10px',fontWeight:600,color:'#475569'}}>{row.remarks}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{background:'#0f172a',color:'#fff'}}>
                    <td colSpan={4} style={{padding:'10px',fontWeight:800,fontSize:13}}>Grand Total</td>
                    <td style={{padding:'10px',textAlign:'center',fontWeight:900,fontSize:15}}>{totalObt}/{totalMax}</td>
                    <td style={{padding:'10px',textAlign:'center',fontWeight:900,color: GRADE_COLORS[grade]||'#fff'}}>{grade}</td>
                    <td style={{padding:'10px',fontWeight:700,color:'#94a3b8',fontSize:11}}>Percentage: {pct}%</td>
                  </tr>
                </tfoot>
              </table>

              {/* Summary Row */}
              <div style={{padding:'12px 20px',borderTop:'2px solid #0f172a',borderBottom:'1px solid #e2e8f0',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
                <span style={{fontSize:12,fontWeight:700,color:'#475569'}}>Total: <strong style={{color:'#0f172a'}}>{totalObt}/{totalMax}</strong></span>
                <span style={{fontSize:12,fontWeight:700,color:'#475569'}}>Percentage: <strong style={{color:'#2563eb'}}>{pct}%</strong></span>
                <span style={{fontSize:12,fontWeight:700,color:'#475569'}}>Grade: <strong style={{color:GRADE_COLORS[grade]||'#0f172a'}}>{grade}</strong></span>
                <span style={{fontSize:12,fontWeight:700,color:'#475569'}}>Rank: <strong style={{color:'#0f172a'}}>4th in Class</strong></span>
                <span style={{padding:'3px 12px',borderRadius:99,background:isPassed?'#d1fae5':'#fef2f2',color:isPassed?'#059669':'#ef4444',fontSize:12,fontWeight:800}}>
                  {isPassed ? '✅ PASS' : '❌ FAIL'}
                </span>
              </div>

              {/* Mini Bar Chart */}
              <div style={{padding:'14px 20px',borderBottom:'1px solid #e2e8f0'}}>
                <p style={{fontSize:11,fontWeight:800,color:'#475569',margin:'0 0 10px',textTransform:'uppercase',letterSpacing:'0.06em'}}>Performance Chart</p>
                {subjects.map(s=>(
                  <div key={s.subject} style={{display:'flex',alignItems:'center',gap:10,marginBottom:7}}>
                    <span style={{fontSize:11,fontWeight:700,color:'#475569',width:100,flexShrink:0}}>{s.subject.slice(0,8)}</span>
                    <div style={{flex:1,height:14,borderRadius:99,background:'#f1f5f9',overflow:'hidden'}}>
                      <motion.div initial={{width:0}} animate={{width:`${s.theory}%`}} transition={{duration:0.7,ease:'easeOut'}}
                        style={{height:'100%',borderRadius:99,background:s.theory>=75?'#2563eb':s.theory>=50?'#f59e0b':'#ef4444'}}/>
                    </div>
                    <span style={{fontSize:11,fontWeight:800,color:'#0f172a',width:28,textAlign:'right'}}>{s.theory}</span>
                  </div>
                ))}
              </div>

              {/* Remarks & Signatures */}
              <div style={{padding:'14px 20px',borderBottom:'1px solid #e2e8f0'}}>
                <p style={{fontSize:11,fontWeight:800,color:'#475569',margin:'0 0 6px',textTransform:'uppercase',letterSpacing:'0.06em'}}>Class Teacher's Remarks</p>
                <p style={{fontSize:12,fontWeight:500,color:'#0f172a',fontStyle:'italic',margin:0,lineHeight:1.6}}>
                  "Shows great enthusiasm in learning. Keep up the good work and focus on areas that need improvement."
                </p>
              </div>
              <div style={{padding:'20px',display:'flex',justifyContent:'space-between'}}>
                {['Class Teacher','Principal','Parent Signature'].map(s=>(
                  <div key={s} style={{textAlign:'center'}}>
                    <div style={{width:120,borderTop:'1.5px solid #0f172a',paddingTop:6}}>
                      <span style={{fontSize:10,fontWeight:600,color:'#64748b'}}>{s}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{background:'#f8fafc',textAlign:'center',padding:'8px',borderTop:'1px solid #e2e8f0'}}>
                <span style={{fontSize:10,fontWeight:600,color:'#94a3b8'}}>© 2026 JSK Foundation | JSK School ERP &nbsp;|&nbsp; Next Exam: Annual Examination | Nov 2026</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!ready && (
        <motion.div variants={fade} style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:18,padding:'60px 32px',textAlign:'center',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
          <div style={{width:64,height:64,borderRadius:16,background:'linear-gradient(135deg,#eff6ff,#dbeafe)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>
            <Printer size={28} color="#2563eb" strokeWidth={1.5}/>
          </div>
          <h3 style={{fontSize:17,fontWeight:800,color:'#0f172a',margin:'0 0 6px'}}>Select Exam & Class</h3>
          <p style={{fontSize:13,color:'#94a3b8',margin:0,lineHeight:1.6}}>Choose an exam, class and section to preview report cards.</p>
        </motion.div>
      )}
    </motion.div>
  );
}

function NavBtn({ icon: Icon, label, onClick, blue }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{display:'flex',alignItems:'center',gap:6,height:36,padding:'0 14px',borderRadius:9,border:`1.5px solid ${hov||(blue)?'#2563eb':'#e2e8f0'}`,background:hov||blue?'#eff6ff':'#fff',fontSize:12,fontWeight:700,color:hov||blue?'#2563eb':'#64748b',cursor:'pointer',fontFamily:'inherit',transition:'all 0.15s'}}>
      <Icon size={13}/> {label}
    </button>
  );
}
