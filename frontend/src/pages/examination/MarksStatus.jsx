import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CLASSES  = ['Class I','Class II','Class III','Class IV','Class V'];
const SUBJECTS = ['English','Hindi','Mathematics','Science','Social Science'];

const GRID = {
  'Class I':   { English:'submitted', Hindi:'submitted', Mathematics:'submitted', Science:'pending',   'Social Science':'pending'   },
  'Class II':  { English:'submitted', Hindi:'submitted', Mathematics:'submitted', Science:'submitted', 'Social Science':'submitted' },
  'Class III': { English:'pending',   Hindi:'pending',   Mathematics:'pending',   Science:'pending',   'Social Science':'not_started'},
  'Class IV':  { English:'submitted', Hindi:'submitted', Mathematics:'pending',   Science:'pending',   'Social Science':'not_started'},
  'Class V':   { English:'submitted', Hindi:'submitted', Mathematics:'submitted', Science:'submitted', 'Social Science':'pending'   },
};

const STATUS = {
  submitted:   { icon:'✅', color:'#059669', bg:'#ecfdf5', label:'Submitted'  },
  pending:     { icon:'⏳', color:'#d97706', bg:'#fffbeb', label:'Pending'    },
  not_started: { icon:'🔒', color:'#94a3b8', bg:'#f1f5f9', label:'Not Started'},
};

const fade = { hidden:{opacity:0,y:10}, show:{opacity:1,y:0,transition:{duration:0.28}} };

export default function MarksStatus() {
  const navigate = useNavigate();

  let total=0, submitted=0, pending=0, notStarted=0;
  Object.values(GRID).forEach(row => {
    Object.values(row).forEach(v => {
      total++;
      if (v==='submitted') submitted++;
      else if (v==='pending') pending++;
      else notStarted++;
    });
  });
  const pct = Math.round((submitted/total)*100);

  const summaryCards = [
    { label:'Total Combinations', value:total,      color:'#2563eb' },
    { label:'Submitted',          value:submitted,   color:'#059669' },
    { label:'Pending',            value:pending,     color:'#d97706' },
    { label:'Not Started',        value:notStarted,  color:'#94a3b8' },
  ];

  return (
    <motion.div initial="hidden" animate="show" variants={{show:{transition:{staggerChildren:0.07}}}} style={{paddingBottom:40,minWidth:0}}>

      <motion.div variants={fade} style={{marginBottom:24}}>
        <h1 style={{fontSize:26,fontWeight:800,color:'#0f172a',margin:0,letterSpacing:'-0.5px'}}>Marks Entry Status</h1>
        <p style={{fontSize:14,color:'#94a3b8',marginTop:6,fontWeight:500}}>Half Yearly Examination 2025-26 — Track completion</p>
      </motion.div>

      <motion.div variants={fade} style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:20}}>
        {summaryCards.map(s=>(
          <div key={s.label} style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:16,padding:'18px 20px',borderTop:`3px solid ${s.color}`}}>
            <div style={{fontSize:28,fontWeight:800,color:s.color,lineHeight:1}}>{s.value}</div>
            <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginTop:6,textTransform:'uppercase',letterSpacing:'0.06em'}}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={fade} style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:16,padding:'18px 22px',marginBottom:20}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <p style={{fontSize:13,fontWeight:700,color:'#475569',margin:0}}>Overall Completion</p>
          <span style={{fontSize:16,fontWeight:800,color:'#2563eb'}}>{pct}%</span>
        </div>
        <div style={{height:12,borderRadius:99,background:'#e2e8f0',overflow:'hidden'}}>
          <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.8,ease:'easeOut'}}
            style={{height:'100%',borderRadius:99,background:'linear-gradient(90deg,#2563eb,#06b6d4)'}}/>
        </div>
      </motion.div>

      <motion.div variants={fade} style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:18,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
        <div style={{padding:'16px 22px',borderBottom:'1px solid #f1f5f9'}}>
          <p style={{fontSize:15,fontWeight:800,color:'#0f172a',margin:0}}>Class-wise Entry Status</p>
          <p style={{fontSize:12,fontWeight:500,color:'#94a3b8',margin:'4px 0 0'}}>Click ⏳ or 🔒 to open marks entry for that subject</p>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#fafbfc',borderBottom:'1.5px solid #e2e8f0'}}>
                <th style={{padding:'11px 18px',textAlign:'left',fontSize:10,fontWeight:800,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.06em',minWidth:120}}>Class</th>
                {SUBJECTS.map(s=>(
                  <th key={s} style={{padding:'11px 14px',textAlign:'center',fontSize:10,fontWeight:800,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.06em',whiteSpace:'nowrap'}}>{s}</th>
                ))}
                <th style={{padding:'11px 14px',textAlign:'center',fontSize:10,fontWeight:800,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.06em'}}>Status</th>
              </tr>
            </thead>
            <tbody>
              {CLASSES.map(cls=>{
                const row = GRID[cls];
                const allSub = Object.values(row).every(v=>v==='submitted');
                const anySub = Object.values(row).some(v=>v==='submitted');
                const rowLabel = allSub ? 'Complete' : anySub ? 'Partial' : 'Pending';
                const rowColor = allSub ? '#059669'  : anySub ? '#d97706' : '#ef4444';
                const rowBg    = allSub ? '#ecfdf5'  : anySub ? '#fffbeb' : '#fef2f2';
                return (
                  <tr key={cls} style={{borderBottom:'1px solid #f1f5f9'}}
                    onMouseEnter={e=>e.currentTarget.style.background='#fafbfe'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{padding:'14px 18px',fontSize:13,fontWeight:700,color:'#0f172a'}}>{cls}</td>
                    {SUBJECTS.map(sub=>{
                      const st = row[sub] || 'not_started';
                      const cfg = STATUS[st];
                      const clickable = st !== 'submitted';
                      return (
                        <td key={sub} style={{padding:'12px 14px',textAlign:'center'}}>
                          <div
                            title={cfg.label}
                            onClick={()=>{ if(clickable) navigate('/examination/marks'); }}
                            style={{width:36,height:36,borderRadius:10,background:cfg.bg,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto',fontSize:16,cursor:clickable?'pointer':'default',border:`1px solid ${cfg.color}33`,transition:'transform 0.15s'}}
                            onMouseEnter={e=>{ if(clickable) e.currentTarget.style.transform='scale(1.1)'; }}
                            onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
                          >
                            {cfg.icon}
                          </div>
                        </td>
                      );
                    })}
                    <td style={{padding:'12px 14px',textAlign:'center'}}>
                      <span style={{fontSize:11,fontWeight:700,padding:'4px 12px',borderRadius:99,background:rowBg,color:rowColor}}>{rowLabel}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{padding:'14px 22px',borderTop:'1px solid #f1f5f9',display:'flex',gap:20}}>
          {Object.entries(STATUS).map(([k,v])=>(
            <span key={k} style={{display:'flex',alignItems:'center',gap:6,fontSize:11,fontWeight:700,color:'#64748b'}}>
              <span style={{fontSize:14}}>{v.icon}</span> {v.label}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
