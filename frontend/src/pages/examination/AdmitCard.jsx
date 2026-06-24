import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, ChevronLeft, ChevronRight } from 'lucide-react';

const EXAMS    = [{ id:2, name:'Half Yearly 2025-26' }, { id:1, name:'Unit Test 1' }];
const CLASSES  = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];
const SECTIONS = ['A','B','C'];

const STUDENTS = [
  { id:1, name:'Aaditya Kumar',  admission_no:'JSK20250001', roll:'05', cls:'I',  sec:'A', father:'Rajesh Kumar'  },
  { id:2, name:'Priya Sharma',   admission_no:'JSK20250002', roll:'12', cls:'I',  sec:'A', father:'Suresh Sharma' },
  { id:3, name:'Rahul Verma',    admission_no:'JSK20250003', roll:'18', cls:'I',  sec:'A', father:'Anil Verma'    },
];

const SCHEDULE = [
  { date:'12 May 2026', subject:'English',        time:'10:00 AM', venue:'Hall A' },
  { date:'13 May 2026', subject:'Hindi',          time:'10:00 AM', venue:'Hall A' },
  { date:'14 May 2026', subject:'Mathematics',    time:'10:00 AM', venue:'Hall B' },
  { date:'15 May 2026', subject:'Science',        time:'10:00 AM', venue:'Hall A' },
  { date:'16 May 2026', subject:'Social Science', time:'10:00 AM', venue:'Hall C' },
];

const INSTRUCTIONS = [
  'Carry this card to exam hall — entry denied without it.',
  'No electronic devices allowed in the examination hall.',
  'Report 15 minutes before the examination starts.',
  'Write your Roll No. and Adm. No. on the answer sheet.',
  'Any malpractice will lead to cancellation of examination.',
];

const fade = { hidden:{opacity:0,y:10}, show:{opacity:1,y:0,transition:{duration:0.28}} };
const selectStyle = {height:44,border:'1.5px solid #e2e8f0',borderRadius:12,padding:'0 14px',fontSize:13,fontWeight:600,color:'#0f172a',outline:'none',fontFamily:'inherit',background:'#fff',cursor:'pointer'};

export default function AdmitCard() {
  const [selExam,    setSelExam]    = useState('');
  const [selClass,   setSelClass]   = useState('');
  const [selSection, setSelSection] = useState('');
  const [studentIdx, setStudentIdx] = useState(0);

  const ready   = selExam && selClass && selSection;
  const student = STUDENTS[studentIdx];
  const examObj = EXAMS.find(e=>e.id===parseInt(selExam));

  return (
    <motion.div initial="hidden" animate="show" variants={{show:{transition:{staggerChildren:0.07}}}} style={{paddingBottom:40,minWidth:0}}>

      {/* HEADER */}
      <motion.div variants={fade} style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:16,marginBottom:24}}>
        <div>
          <h1 style={{fontSize:26,fontWeight:800,color:'#0f172a',margin:0,letterSpacing:'-0.5px'}}>Admit Card Generation</h1>
          <p style={{fontSize:14,color:'#94a3b8',marginTop:6,fontWeight:500}}>Generate and print admit cards for students</p>
        </div>
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
            <button onClick={()=>window.print()}
              style={{height:44,padding:'0 22px',borderRadius:12,border:'none',background:'#2563eb',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit',boxShadow:'0 4px 12px rgba(37,99,235,0.3)',display:'flex',alignItems:'center',gap:8}}>
              <Printer size={15}/> Print All Admit Cards (Class {selClass}-{selSection})
            </button>
          )}
        </div>
      </motion.div>

      {/* STUDENT NAV */}
      <AnimatePresence>
        {ready && (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,background:'#fff',border:'1px solid #e2e8f0',borderRadius:14,padding:'12px 20px'}}>
              <button onClick={()=>window.print()} style={{display:'flex',alignItems:'center',gap:6,height:36,padding:'0 16px',borderRadius:9,border:'1.5px solid #2563eb',background:'#eff6ff',fontSize:12,fontWeight:700,color:'#2563eb',cursor:'pointer',fontFamily:'inherit'}}>
                <Printer size={13}/> Print This Card
              </button>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <button onClick={()=>setStudentIdx(i=>Math.max(i-1,0))} disabled={studentIdx===0}
                  style={{width:34,height:34,borderRadius:9,border:'1.5px solid #e2e8f0',background:studentIdx===0?'#f8fafc':'#fff',cursor:studentIdx===0?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <ChevronLeft size={18} color={studentIdx===0?'#cbd5e1':'#475569'}/>
                </button>
                <span style={{fontSize:13,fontWeight:700,color:'#475569'}}>Student {studentIdx+1} of {STUDENTS.length}</span>
                <button onClick={()=>setStudentIdx(i=>Math.min(i+1,STUDENTS.length-1))} disabled={studentIdx===STUDENTS.length-1}
                  style={{width:34,height:34,borderRadius:9,border:'1.5px solid #e2e8f0',background:studentIdx===STUDENTS.length-1?'#f8fafc':'#fff',cursor:studentIdx===STUDENTS.length-1?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <ChevronRight size={18} color={studentIdx===STUDENTS.length-1?'#cbd5e1':'#475569'}/>
                </button>
              </div>
            </div>

            {/* ADMIT CARD */}
            <div style={{background:'#fff',border:'2px solid #0f172a',borderRadius:8,maxWidth:600,margin:'0 auto',overflow:'hidden',fontFamily:'Inter,sans-serif'}}>

              {/* Header */}
              <div style={{background:'#0f172a',color:'#fff',padding:'18px 24px',display:'flex',alignItems:'center',gap:16}}>
                <div style={{width:52,height:52,borderRadius:12,background:'linear-gradient(135deg,#2563eb,#1d4ed8)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:22,fontWeight:900,flexShrink:0}}>J</div>
                <div>
                  <div style={{fontSize:15,fontWeight:900,letterSpacing:'0.04em',textTransform:'uppercase'}}>JSK Educational Foundation</div>
                  <div style={{fontSize:11,fontWeight:500,color:'#94a3b8',marginTop:2}}>Pratapganj, Bihar</div>
                </div>
              </div>
              <div style={{background:'#2563eb',color:'#fff',textAlign:'center',padding:'8px',fontSize:13,fontWeight:900,letterSpacing:'0.12em',textTransform:'uppercase'}}>
                ADMIT CARD — {examObj?.name}
              </div>

              {/* Student Info */}
              <div style={{padding:'16px 20px',display:'flex',gap:20,borderBottom:'1.5px solid #0f172a'}}>
                {/* Photo placeholder */}
                <div style={{width:80,height:96,borderRadius:8,border:'2px solid #e2e8f0',background:'linear-gradient(135deg,#eff6ff,#dbeafe)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <span style={{fontSize:24,fontWeight:900,color:'#2563eb'}}>{student.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</span>
                </div>
                <div style={{flex:1}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px 20px',fontSize:12}}>
                    {[
                      {l:'Name',       v:student.name},
                      {l:'Adm. No.',   v:student.admission_no},
                      {l:'Father',     v:student.father},
                      {l:'Class',      v:`${student.cls} – ${student.sec}`},
                      {l:'Roll No.',   v:student.roll},
                      {l:'Exam',       v:examObj?.name},
                    ].map(r=>(
                      <div key={r.l}>
                        <span style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em'}}>{r.l}</span>
                        <div style={{fontSize:12,fontWeight:700,color:'#0f172a',marginTop:1}}>{r.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Exam Schedule */}
              <div style={{padding:'14px 20px',borderBottom:'1.5px solid #0f172a'}}>
                <p style={{fontSize:12,fontWeight:800,color:'#0f172a',margin:'0 0 10px',textTransform:'uppercase',letterSpacing:'0.06em'}}>Examination Schedule</p>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
                  <thead>
                    <tr style={{background:'#f8fafc',borderBottom:'1.5px solid #e2e8f0'}}>
                      {['Date','Subject','Time','Venue'].map(h=>(
                        <th key={h} style={{padding:'7px 10px',textAlign:'left',fontWeight:800,color:'#64748b',textTransform:'uppercase',letterSpacing:'0.05em'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SCHEDULE.map((row,i)=>(
                      <tr key={i} style={{borderBottom:'1px solid #f1f5f9',background:i%2===0?'#fff':'#fafbfc'}}>
                        <td style={{padding:'8px 10px',fontWeight:700,color:'#0f172a'}}>{row.date}</td>
                        <td style={{padding:'8px 10px',fontWeight:700,color:'#2563eb'}}>{row.subject}</td>
                        <td style={{padding:'8px 10px',fontWeight:600,color:'#475569'}}>{row.time}</td>
                        <td style={{padding:'8px 10px',fontWeight:600,color:'#475569'}}>{row.venue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Instructions */}
              <div style={{padding:'12px 20px',borderBottom:'1.5px solid #0f172a',background:'#fffbeb'}}>
                <p style={{fontSize:11,fontWeight:800,color:'#92400e',margin:'0 0 8px',textTransform:'uppercase',letterSpacing:'0.06em'}}>⚠️ Instructions</p>
                <ul style={{margin:0,paddingLeft:16}}>
                  {INSTRUCTIONS.map((inst,i)=>(
                    <li key={i} style={{fontSize:11,fontWeight:500,color:'#78350f',marginBottom:4,lineHeight:1.5}}>{inst}</li>
                  ))}
                </ul>
              </div>

              {/* Signatures */}
              <div style={{padding:'16px 20px',display:'flex',justifyContent:'space-between'}}>
                {["Student's Signature","Invigilator's Signature","Principal's Signature"].map(s=>(
                  <div key={s} style={{textAlign:'center'}}>
                    <div style={{width:130,borderTop:'1.5px solid #0f172a',paddingTop:6}}>
                      <span style={{fontSize:9,fontWeight:600,color:'#64748b'}}>{s}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{background:'#f8fafc',textAlign:'center',padding:'7px',borderTop:'1px solid #e2e8f0'}}>
                <span style={{fontSize:9,fontWeight:600,color:'#94a3b8'}}>© 2026 JSK Foundation | JSK School ERP | This card is non-transferable</span>
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
          <p style={{fontSize:13,color:'#94a3b8',margin:0,lineHeight:1.6}}>Choose an exam, class and section to generate admit cards.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
