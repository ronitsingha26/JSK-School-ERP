import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Trophy, ChevronDown, ChevronUp, Download } from 'lucide-react';

const fade = { hidden:{opacity:0,y:10}, show:{opacity:1,y:0,transition:{duration:0.28}} };

const CLASS_DATA = [
  { cls:'Class I',   pass_pct:92, total:40 }, { cls:'Class II',  pass_pct:88, total:42 },
  { cls:'Class III', pass_pct:76, total:38 }, { cls:'Class IV',  pass_pct:85, total:41 },
  { cls:'Class V',   pass_pct:91, total:39 }, { cls:'Class VI',  pass_pct:72, total:43 },
  { cls:'Class VII', pass_pct:68, total:40 }, { cls:'Class VIII',pass_pct:80, total:38 },
  { cls:'Class IX',  pass_pct:87, total:36 }, { cls:'Class X',   pass_pct:95, total:35 },
];

const GRADE_DATA = [
  { name:'A+', value:42, color:'#2563eb' }, { name:'A',  value:58, color:'#10b981' },
  { name:'B+', value:71, color:'#0891b2' }, { name:'B',  value:63, color:'#f59e0b' },
  { name:'C',  value:48, color:'#f97316' }, { name:'D',  value:29, color:'#8b5cf6' },
  { name:'F',  value:29, color:'#ef4444' },
];

const SUBJECT_DATA = [
  { subject:'Mathematics',    avg:71.4, highest:98, lowest:12, pass_pct:88 },
  { subject:'English',        avg:68.2, highest:95, lowest:22, pass_pct:91 },
  { subject:'Hindi',          avg:65.8, highest:92, lowest:18, pass_pct:85 },
  { subject:'Science',        avg:62.1, highest:97, lowest:15, pass_pct:79 },
  { subject:'Social Science', avg:58.4, highest:91, lowest:11, pass_pct:74 },
];

const TOPPERS = [
  { rank:1,  name:'Mohit Kumar',   cls:'V-A',   total:478, pct:'95.6', grade:'A+' },
  { rank:2,  name:'Riya Kapoor',   cls:'VII-B', total:471, pct:'94.2', grade:'A+' },
  { rank:3,  name:'Sachin Verma',  cls:'IX-A',  total:465, pct:'93.0', grade:'A+' },
  { rank:4,  name:'Pooja Mishra',  cls:'X-A',   total:459, pct:'91.8', grade:'A+' },
  { rank:5,  name:'Amit Singh',    cls:'VIII-B',total:451, pct:'90.2', grade:'A+' },
  { rank:6,  name:'Divya Yadav',   cls:'VI-A',  total:442, pct:'88.4', grade:'A'  },
  { rank:7,  name:'Karan Patel',   cls:'IV-B',  total:438, pct:'87.6', grade:'A'  },
  { rank:8,  name:'Sunita Sharma', cls:'III-A', total:432, pct:'86.4', grade:'A'  },
  { rank:9,  name:'Rohan Gupta',   cls:'II-A',  total:428, pct:'85.6', grade:'A'  },
  { rank:10, name:'Neha Verma',    cls:'I-A',   total:422, pct:'84.4', grade:'A'  },
];

const FAIL_LIST = [
  { name:'Vijay Kumar',    cls:'VII-A',  failed:'Science, Social Science',   pct:'28.4' },
  { name:'Pradeep Singh',  cls:'III-B',  failed:'Mathematics',               pct:'31.2' },
  { name:'Anita Devi',     cls:'VI-A',   failed:'English, Hindi, Science',   pct:'24.8' },
];

const COLORS_BAR = (pct) => pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';

const COLORS = ['#2563eb','#8b5cf6','#10b981'];
const avatarBg = id => { const cs=[['#3b82f6','#1d4ed8'],['#8b5cf6','#6d28d9'],['#10b981','#059669'],['#f59e0b','#d97706'],['#ef4444','#dc2626']]; const [a,b]=cs[id%cs.length]; return `linear-gradient(135deg,${a},${b})`; };
const initials = n => n.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);

export default function ResultAnalysis() {
  const [classFilter,   setClassFilter]   = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [failOpen,      setFailOpen]      = useState(false);

  const total=320, appeared=318, passed=289, failed=29, distinction=142;

  return (
    <motion.div initial="hidden" animate="show" variants={{show:{transition:{staggerChildren:0.07}}}} style={{paddingBottom:40,minWidth:0}}>

      {/* HEADER */}
      <motion.div variants={fade} style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:16,marginBottom:24,flexWrap:'wrap'}}>
        <div>
          <h1 style={{fontSize:26,fontWeight:800,color:'#0f172a',margin:0,letterSpacing:'-0.5px'}}>Result Analysis</h1>
          <p style={{fontSize:14,color:'#94a3b8',marginTop:6,fontWeight:500}}>Half Yearly Examination 2025-26</p>
        </div>
        <div style={{display:'flex',gap:10}}>
          <select value={classFilter} onChange={e=>setClassFilter(e.target.value)}
            style={{height:40,border:'1.5px solid #e2e8f0',borderRadius:10,padding:'0 14px',fontSize:12,fontWeight:600,color:'#0f172a',outline:'none',fontFamily:'inherit',background:'#fff',cursor:'pointer'}}>
            <option value="">All Classes</option>
            {CLASS_DATA.map(c=><option key={c.cls} value={c.cls}>{c.cls}</option>)}
          </select>
          <select value={subjectFilter} onChange={e=>setSubjectFilter(e.target.value)}
            style={{height:40,border:'1.5px solid #e2e8f0',borderRadius:10,padding:'0 14px',fontSize:12,fontWeight:600,color:'#0f172a',outline:'none',fontFamily:'inherit',background:'#fff',cursor:'pointer'}}>
            <option value="">All Subjects</option>
            {SUBJECT_DATA.map(s=><option key={s.subject} value={s.subject}>{s.subject}</option>)}
          </select>
        </div>
      </motion.div>

      {/* SUMMARY CARDS */}
      <motion.div variants={fade} style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:14,marginBottom:24}}>
        {[
          {l:'Total Students', v:total,       c:'#2563eb', bg:'#eff6ff'},
          {l:'Appeared',       v:appeared,    c:'#7c3aed', bg:'#f5f3ff'},
          {l:'Passed',         v:`${passed} (${((passed/appeared)*100).toFixed(1)}%)`,  c:'#059669', bg:'#ecfdf5'},
          {l:'Failed',         v:`${failed} (${((failed/appeared)*100).toFixed(1)}%)`,  c:'#ef4444', bg:'#fef2f2'},
          {l:'Distinction ≥75%',v:distinction, c:'#d97706', bg:'#fffbeb'},
        ].map(s=>(
          <div key={s.l} style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:16,padding:'16px 18px',borderTop:`3px solid ${s.c}`}}>
            <div style={{fontSize:20,fontWeight:800,color:s.c,lineHeight:1.1}}>{s.v}</div>
            <div style={{fontSize:10,fontWeight:700,color:'#94a3b8',marginTop:6,textTransform:'uppercase',letterSpacing:'0.06em'}}>{s.l}</div>
          </div>
        ))}
      </motion.div>

      {/* CHARTS ROW */}
      <motion.div variants={fade} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:24}}>
        {/* Bar Chart */}
        <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:18,padding:'20px 22px',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
          <p style={{fontSize:14,fontWeight:800,color:'#0f172a',margin:'0 0 16px'}}>Class-wise Pass Percentage</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={CLASS_DATA} barSize={22}>
              <XAxis dataKey="cls" tick={{fontSize:10,fontWeight:600,fill:'#94a3b8'}} axisLine={false} tickLine={false}
                tickFormatter={v=>v.replace('Class ','')}/>
              <YAxis tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false} domain={[0,100]} tickFormatter={v=>`${v}%`}/>
              <Tooltip formatter={(v)=>[`${v}%`,'Pass Rate']} contentStyle={{borderRadius:10,border:'1px solid #e2e8f0',fontSize:12}}/>
              <Bar dataKey="pass_pct" radius={[6,6,0,0]}>
                {CLASS_DATA.map((d,i)=><Cell key={i} fill={COLORS_BAR(d.pass_pct)}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Pie Chart */}
        <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:18,padding:'20px 22px',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
          <p style={{fontSize:14,fontWeight:800,color:'#0f172a',margin:'0 0 16px'}}>Grade Distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={GRADE_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} paddingAngle={3}>
                {GRADE_DATA.map((d,i)=><Cell key={i} fill={d.color}/>)}
              </Pie>
              <Tooltip contentStyle={{borderRadius:10,border:'1px solid #e2e8f0',fontSize:12}}/>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:11,fontWeight:600}}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* SUBJECT-WISE ANALYSIS */}
      <motion.div variants={fade} style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:18,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,0.04)',marginBottom:24}}>
        <div style={{padding:'16px 22px',borderBottom:'1px solid #f1f5f9'}}>
          <p style={{fontSize:15,fontWeight:800,color:'#0f172a',margin:0}}>Average Marks by Subject</p>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#fafbfc',borderBottom:'1.5px solid #e2e8f0'}}>
                {['Subject','Avg Marks','Highest','Lowest','Pass %'].map(h=>(
                  <th key={h} style={{padding:'11px 16px',textAlign:'left',fontSize:10,fontWeight:800,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.06em'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SUBJECT_DATA.map((s,i)=>{
                const pctColor = parseFloat(s.pass_pct)>=85?'#059669':parseFloat(s.pass_pct)>=75?'#d97706':'#ef4444';
                const pctDot   = parseFloat(s.pass_pct)>=85?'🟢':parseFloat(s.pass_pct)>=75?'🟡':'🔴';
                return (
                  <tr key={s.subject} style={{borderBottom:'1px solid #f1f5f9',background:i%2===0?'#fff':'#fafbfc'}}
                    onMouseEnter={e=>e.currentTarget.style.background='#f0f4ff'}
                    onMouseLeave={e=>e.currentTarget.style.background=i%2===0?'#fff':'#fafbfc'}>
                    <td style={{padding:'14px 16px',fontSize:13,fontWeight:700,color:'#0f172a'}}>{s.subject}</td>
                    <td style={{padding:'14px 16px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <div style={{flex:1,maxWidth:100,height:6,borderRadius:99,background:'#e2e8f0',overflow:'hidden'}}>
                          <div style={{height:'100%',width:`${s.avg}%`,borderRadius:99,background:'#2563eb'}}/>
                        </div>
                        <span style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>{s.avg}/100</span>
                      </div>
                    </td>
                    <td style={{padding:'14px 16px',fontSize:13,fontWeight:700,color:'#059669'}}>{s.highest}</td>
                    <td style={{padding:'14px 16px',fontSize:13,fontWeight:700,color:'#ef4444'}}>{s.lowest}</td>
                    <td style={{padding:'14px 16px'}}>
                      <span style={{fontSize:12,fontWeight:800,color:pctColor}}>{pctDot} {s.pass_pct}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* TOPPERS LIST */}
      <motion.div variants={fade} style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:18,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,0.04)',marginBottom:24}}>
        <div style={{padding:'16px 22px',borderBottom:'1px solid #f1f5f9',display:'flex',alignItems:'center',gap:10}}>
          <Trophy size={18} color="#d97706"/>
          <p style={{fontSize:15,fontWeight:800,color:'#0f172a',margin:0}}>Top 10 Performers — Half Yearly 2025-26</p>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#fafbfc',borderBottom:'1.5px solid #e2e8f0'}}>
                {['Rank','Student','Class','Total Marks','Percentage','Grade'].map(h=>(
                  <th key={h} style={{padding:'11px 16px',textAlign:'left',fontSize:10,fontWeight:800,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.06em'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOPPERS.map((t,i)=>{
                const medal = t.rank===1?'🥇':t.rank===2?'🥈':t.rank===3?'🥉':null;
                return (
                  <tr key={t.rank} style={{borderBottom:'1px solid #f1f5f9',background:i<3?'#fffbeb':'transparent',transition:'background 0.15s'}}
                    onMouseEnter={e=>e.currentTarget.style.background='#fafbfe'}
                    onMouseLeave={e=>e.currentTarget.style.background=i<3?'#fffbeb':'transparent'}>
                    <td style={{padding:'13px 16px'}}>
                      {medal
                        ? <span style={{fontSize:20}}>{medal}</span>
                        : <span style={{fontSize:13,fontWeight:700,color:'#94a3b8',width:28,height:28,borderRadius:8,background:'#f1f5f9',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>{t.rank}</span>
                      }
                    </td>
                    <td style={{padding:'13px 16px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <div style={{width:34,height:34,borderRadius:'50%',background:avatarBg(t.rank),display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:11,fontWeight:800,flexShrink:0}}>
                          {initials(t.name)}
                        </div>
                        <span style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>{t.name}</span>
                      </div>
                    </td>
                    <td style={{padding:'13px 16px'}}>
                      <span style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:6,background:'#eff6ff',color:'#2563eb'}}>{t.cls}</span>
                    </td>
                    <td style={{padding:'13px 16px',fontSize:13,fontWeight:800,color:'#0f172a'}}>{t.total}/500</td>
                    <td style={{padding:'13px 16px',fontSize:13,fontWeight:800,color:'#2563eb'}}>{t.pct}%</td>
                    <td style={{padding:'13px 16px'}}>
                      <span style={{fontSize:12,fontWeight:900,color:'#059669',padding:'3px 10px',borderRadius:6,background:'#d1fae5'}}>{t.grade}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* FAIL ANALYSIS */}
      <motion.div variants={fade} style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:18,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
        <button onClick={()=>setFailOpen(!failOpen)} style={{width:'100%',padding:'16px 22px',background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',fontFamily:'inherit'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:32,height:32,borderRadius:9,background:'#fef2f2',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>⚠️</div>
            <p style={{fontSize:14,fontWeight:800,color:'#ef4444',margin:0}}>Students Who Failed ({FAIL_LIST.length})</p>
          </div>
          {failOpen ? <ChevronUp size={18} color="#64748b"/> : <ChevronDown size={18} color="#64748b"/>}
        </button>
        {failOpen && (
          <div>
            <div style={{overflowX:'auto',borderTop:'1px solid #f1f5f9'}}>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{background:'#fafbfc',borderBottom:'1.5px solid #e2e8f0'}}>
                    {['Student','Class','Subjects Failed','Total %'].map(h=>(
                      <th key={h} style={{padding:'10px 16px',textAlign:'left',fontSize:10,fontWeight:800,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.06em'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FAIL_LIST.map((f,i)=>(
                    <tr key={i} style={{borderBottom:'1px solid #f1f5f9',background:'#fffafa'}}
                      onMouseEnter={e=>e.currentTarget.style.background='#fef2f2'}
                      onMouseLeave={e=>e.currentTarget.style.background='#fffafa'}>
                      <td style={{padding:'12px 16px',fontSize:13,fontWeight:700,color:'#0f172a'}}>{f.name}</td>
                      <td style={{padding:'12px 16px'}}>
                        <span style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:6,background:'#f1f5f9',color:'#475569'}}>{f.cls}</span>
                      </td>
                      <td style={{padding:'12px 16px',fontSize:12,fontWeight:600,color:'#ef4444'}}>{f.failed}</td>
                      <td style={{padding:'12px 16px',fontSize:13,fontWeight:800,color:'#ef4444'}}>{f.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{padding:'12px 22px',borderTop:'1px solid #f1f5f9',display:'flex',justifyContent:'flex-end'}}>
              <button style={{display:'flex',alignItems:'center',gap:6,height:34,padding:'0 16px',borderRadius:9,border:'1.5px solid #ef4444',background:'#fff',fontSize:12,fontWeight:700,color:'#ef4444',cursor:'pointer',fontFamily:'inherit'}}>
                <Download size={13}/> Export Fail List PDF
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
