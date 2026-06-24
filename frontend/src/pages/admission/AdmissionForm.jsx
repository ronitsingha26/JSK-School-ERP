import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, ChevronRight, CheckCircle2, Printer, UserPlus, User, Sparkles } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const STEPS = ['Personal Info','Academic Info','Contact Info','Documents'];

const F = {
  BLOOD:['A+','A-','B+','B-','AB+','AB-','O+','O-'],
  RELIGION:['Hindu','Muslim','Christian','Sikh','Buddhist','Jain','Other'],
  CATEGORY:['General','OBC','SC','ST','Other'],
  CLASS:['Nursery','KG','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'],
  SECTION:['A','B','C','D','E'],
  ROUTE:['Route 1 – East','Route 2 – West','Route 3 – North','Route 4 – South'],
  AY:['2025-26','2026-27','2024-25','2023-24'],
  CASTE:['Hindu','Muslim','Christian','Sikh','Buddhist','Other'],
};

const INIT = {
  first_name:'',last_name:'',father_name:'',mother_name:'',dob:'',gender:'',
  blood_group:'',religion:'',category:'',caste:'',nationality:'Indian',
  aadhar_no:'',
  academic_year_id:'',class_id:'',section_id:'',
  admission_date:new Date().toISOString().slice(0,10),
  roll_number:'',auto_roll:true,previous_school:'',previous_class:'',
  scholarship:false,scholarship_type:'',
  bus_facility:false,bus_route:'',hostel_facility:false,
  mobile:'',alternate_mobile:'',parent_email:'',email:'',
  address:'',landmark:'',city:'',state:'',pin_code:'',
  emergency_contact_name:'',emergency_contact_number:'',
  photo:'',aadhar_doc:'',birth_cert:'',tc:'',marksheet:'',
};

const inp = { width:'100%', height:42, padding:'0 14px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:13, fontWeight:500, color:'#1e293b', background:'#f8fafc', outline:'none', fontFamily:'inherit', boxSizing:'border-box' };
const sel = { ...inp, appearance:'none', cursor:'pointer', paddingRight:36 };
const lbl = { display:'block', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 };

const Inp = ({ label, req, ...p }) => (
  <div>
    <label style={lbl}>{label}{req&&<span style={{color:'#ef4444',marginLeft:2}}>*</span>}</label>
    <input style={inp} {...p}
      onFocus={e=>e.target.style.borderColor='#2563eb'}
      onBlur={e=>e.target.style.borderColor='#e2e8f0'}/>
  </div>
);

const Sel = ({ label, req, options, placeholder, ...p }) => (
  <div style={{position:'relative'}}>
    <label style={lbl}>{label}{req&&<span style={{color:'#ef4444',marginLeft:2}}>*</span>}</label>
    <select style={sel} {...p}>
      <option value="">{placeholder||`Select ${label}`}</option>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
    <span style={{position:'absolute',right:12,bottom:12,color:'#94a3b8',pointerEvents:'none',fontSize:10}}>▼</span>
  </div>
);

const Toggle = ({ label, sub, on, onChange }) => (
  <div onClick={onChange} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', background:'#f8fafc', border:'1.5px solid #e2e8f0', borderRadius:12, cursor:'pointer' }}>
    <div>
      <p style={{fontSize:13,fontWeight:700,color:'#1e293b',margin:0}}>{label}</p>
      {sub&&<p style={{fontSize:11,color:'#94a3b8',margin:'3px 0 0'}}>{sub}</p>}
    </div>
    <div style={{ width:44,height:24,borderRadius:99,background:on?'#2563eb':'#e2e8f0',position:'relative',transition:'background .2s',flexShrink:0 }}>
      <div style={{ position:'absolute',top:3,left:on?20:3,width:18,height:18,borderRadius:'50%',background:'#fff',boxShadow:'0 1px 4px rgba(0,0,0,0.2)',transition:'left .2s' }}/>
    </div>
  </div>
);

const grid2 = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 };
const grid3 = { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 };

export default function AdmissionForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INIT);
  const [admNo, setAdmNo] = useState('JSK20260001');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(()=>{ api.get('/admission/next-no').then(r=>setAdmNo(r.data?.admission_no)).catch(()=>{}); },[]);
  const s = (k,v) => setForm(f=>({...f,[k]:v}));

  const submit = async () => {
    setBusy(true);
    try {
      const { data } = await api.post('/admission', form);
      setDone({ no: data.student?.admission_no||admNo, id: data.student?.id });
      toast.success('Admission successful!');
    } catch(e){ toast.error(e.response?.data?.message||'Failed'); }
    finally { setBusy(false); }
  };

  /* ─── STEP 1: Personal ─── */
  const S1 = () => (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div style={grid2}>
        <Inp label="First Name" req value={form.first_name} onChange={e=>s('first_name',e.target.value)} placeholder="First name"/>
        <Inp label="Last Name" req value={form.last_name} onChange={e=>s('last_name',e.target.value)} placeholder="Last name"/>
      </div>
      <div style={grid2}>
        <Inp label="Father Name" req value={form.father_name} onChange={e=>s('father_name',e.target.value)} placeholder="Father's full name"/>
        <Inp label="Mother Name" value={form.mother_name} onChange={e=>s('mother_name',e.target.value)} placeholder="Mother's full name"/>
      </div>
      <div style={grid3}>
        <Inp label="Date of Birth" req type="date" value={form.dob} onChange={e=>s('dob',e.target.value)}/>
        <div>
          <label style={lbl}>Gender <span style={{color:'#ef4444'}}>*</span></label>
          <div style={{display:'flex',gap:8}}>
            {['Male','Female','Other'].map(g=>(
              <button key={g} type="button" onClick={()=>s('gender',g)} style={{ flex:1,height:42,borderRadius:10,fontSize:13,fontWeight:700,border:'1.5px solid',borderColor:form.gender===g?'#2563eb':'#e2e8f0',background:form.gender===g?'#2563eb':'#fff',color:form.gender===g?'#fff':'#64748b',cursor:'pointer',transition:'all .15s' }}>{g}</button>
            ))}
          </div>
        </div>
        <Sel label="Blood Group" value={form.blood_group} onChange={e=>s('blood_group',e.target.value)} options={F.BLOOD}/>
      </div>
      <div style={grid3}>
        <Sel label="Religion" value={form.religion} onChange={e=>s('religion',e.target.value)} options={F.RELIGION}/>
        <Sel label="Category" value={form.category} onChange={e=>s('category',e.target.value)} options={F.CATEGORY}/>
        <Inp label="Nationality" value={form.nationality} onChange={e=>s('nationality',e.target.value)}/>
      </div>
      <div style={grid2}>
        <Inp label="Aadhar Number" value={form.aadhar_no} onChange={e=>s('aadhar_no',e.target.value)} placeholder="12-digit Aadhar" maxLength={12}/>
        <Sel label="Caste / Sub-caste" value={form.caste} onChange={e=>s('caste',e.target.value)} options={F.CASTE}/>
      </div>
    </div>
  );

  /* ─── STEP 2: Academic ─── */
  const S2 = () => (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div style={{ padding:'18px 22px', background:'linear-gradient(135deg,#1d4ed8,#7c3aed)', borderRadius:16, display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ width:48,height:48,borderRadius:12,background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center' }}>
          <Sparkles size={22} color="#fff"/>
        </div>
        <div>
          <p style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.7)',textTransform:'uppercase',letterSpacing:'0.1em',margin:0}}>Auto-Generated Admission No</p>
          <p style={{fontSize:26,fontWeight:800,color:'#fff',margin:'4px 0 0',letterSpacing:2}}>{admNo}</p>
        </div>
      </div>
      <div style={grid3}>
        <Sel label="Academic Year" req value={form.academic_year_id} onChange={e=>s('academic_year_id',e.target.value)} options={F.AY}/>
        <Sel label="Class" req value={form.class_id} onChange={e=>s('class_id',e.target.value)} options={F.CLASS}/>
        <Sel label="Section" req value={form.section_id} onChange={e=>s('section_id',e.target.value)} options={F.SECTION}/>
      </div>
      <div style={grid3}>
        <Inp label="Admission Date" req type="date" value={form.admission_date} onChange={e=>s('admission_date',e.target.value)}/>
        <div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
            <label style={lbl}>Roll Number</label>
            <label style={{display:'flex',alignItems:'center',gap:6,cursor:'pointer'}} onClick={()=>s('auto_roll',!form.auto_roll)}>
              <div style={{width:32,height:18,borderRadius:99,background:form.auto_roll?'#2563eb':'#e2e8f0',position:'relative',transition:'background .2s'}}>
                <div style={{position:'absolute',top:2,left:form.auto_roll?15:2,width:14,height:14,borderRadius:'50%',background:'#fff',boxShadow:'0 1px 3px rgba(0,0,0,0.2)',transition:'left .2s'}}/>
              </div>
              <span style={{fontSize:11,fontWeight:700,color:'#64748b'}}>Auto</span>
            </label>
          </div>
          <input style={{...inp,background:form.auto_roll?'#f1f5f9':'#f8fafc',color:form.auto_roll?'#94a3b8':'#1e293b'}} value={form.auto_roll?'Auto-generated':form.roll_number} onChange={e=>s('roll_number',e.target.value)} disabled={form.auto_roll}/>
        </div>
        <div/>
      </div>
      <div style={grid2}>
        <Inp label="Previous School" value={form.previous_school} onChange={e=>s('previous_school',e.target.value)} placeholder="School name"/>
        <Inp label="Previous Class" value={form.previous_class} onChange={e=>s('previous_class',e.target.value)} placeholder="e.g. KG, VII"/>
      </div>
      <div style={grid2}>
        <Toggle label="Bus Facility" sub="School transport" on={form.bus_facility} onChange={()=>s('bus_facility',!form.bus_facility)}/>
        <Toggle label="Hostel Facility" sub="Boarding accommodation" on={form.hostel_facility} onChange={()=>s('hostel_facility',!form.hostel_facility)}/>
      </div>
      {form.bus_facility && <Sel label="Bus Route" value={form.bus_route} onChange={e=>s('bus_route',e.target.value)} options={F.ROUTE}/>}
      <Toggle label="Scholarship" sub="Student is on scholarship" on={form.scholarship} onChange={()=>s('scholarship',!form.scholarship)}/>
      {form.scholarship && <Inp label="Scholarship Type" value={form.scholarship_type} onChange={e=>s('scholarship_type',e.target.value)} placeholder="e.g. Merit, Government, Minority"/>}
    </div>
  );

  /* ─── STEP 3: Contact ─── */
  const S3 = () => (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div style={grid2}>
        <Inp label="Student Mobile" req type="tel" value={form.mobile} onChange={e=>s('mobile',e.target.value)} placeholder="10-digit mobile" maxLength={10}/>
        <Inp label="Alternate Mobile" type="tel" value={form.alternate_mobile} onChange={e=>s('alternate_mobile',e.target.value)} placeholder="Optional"/>
      </div>
      <div style={grid2}>
        <Inp label="Parent Email" type="email" value={form.parent_email} onChange={e=>s('parent_email',e.target.value)} placeholder="parent@email.com"/>
        <Inp label="Student Email" type="email" value={form.email} onChange={e=>s('email',e.target.value)} placeholder="student@email.com"/>
      </div>
      <div>
        <label style={lbl}>Full Address</label>
        <textarea value={form.address} onChange={e=>s('address',e.target.value)} rows={3} placeholder="House no, street, locality…"
          style={{width:'100%',padding:'12px 14px',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:13,fontWeight:500,color:'#1e293b',background:'#f8fafc',outline:'none',fontFamily:'inherit',boxSizing:'border-box',resize:'vertical'}}
          onFocus={e=>e.target.style.borderColor='#2563eb'} onBlur={e=>e.target.style.borderColor='#e2e8f0'}/>
      </div>
      <Inp label="Landmark" value={form.landmark} onChange={e=>s('landmark',e.target.value)} placeholder="Near school / market / temple"/>
      <div style={grid3}>
        <Inp label="City" value={form.city} onChange={e=>s('city',e.target.value)} placeholder="City"/>
        <Inp label="State" value={form.state} onChange={e=>s('state',e.target.value)} placeholder="State"/>
        <Inp label="PIN Code" value={form.pin_code} onChange={e=>s('pin_code',e.target.value)} placeholder="6-digit PIN" maxLength={6}/>
      </div>
      <div style={{padding:'16px',background:'#fff7ed',border:'1.5px solid #fed7aa',borderRadius:12}}>
        <p style={{fontSize:12,fontWeight:800,color:'#c2410c',margin:'0 0 12px',textTransform:'uppercase',letterSpacing:'0.06em'}}>🚨 Emergency Contact</p>
        <div style={grid2}>
          <Inp label="Contact Name" value={form.emergency_contact_name} onChange={e=>s('emergency_contact_name',e.target.value)} placeholder="Parent / Guardian name"/>
          <Inp label="Contact Number" type="tel" value={form.emergency_contact_number} onChange={e=>s('emergency_contact_number',e.target.value)} placeholder="Phone number"/>
        </div>
      </div>
    </div>
  );

  /* ─── STEP 4: Documents ─── */
  const DOCS = [
    {key:'photo',      label:'Student Photo',       emoji:'🧑‍🎓', hint:'JPG/PNG · max 2MB'},
    {key:'aadhar_doc', label:'Aadhar Card',          emoji:'🪪',   hint:'JPG/PDF · max 2MB'},
    {key:'birth_cert', label:'Birth Certificate',    emoji:'📄',   hint:'JPG/PDF · max 2MB'},
    {key:'tc',         label:'Transfer Certificate', emoji:'📋',   hint:'JPG/PDF · max 2MB'},
    {key:'marksheet',  label:'Previous Marksheet',   emoji:'📊',   hint:'JPG/PDF · max 2MB'},
  ];
  const S4 = () => (
    <div>
      <p style={{fontSize:13,color:'#64748b',marginBottom:20}}>Upload clear, readable copies. Files are stored securely.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))',gap:16}}>
        {DOCS.map(d=>(
          <label key={d.key} style={{cursor:'pointer',display:'block'}}>
            <input type="file" accept="image/*,.pdf" style={{display:'none'}} onChange={e=>{if(e.target.files?.[0])s(d.key,e.target.files[0].name);}}/>
            <div style={{ border:`2px dashed ${form[d.key]?'#22c55e':'#e2e8f0'}`, borderRadius:16, padding:'20px 12px', textAlign:'center', background:form[d.key]?'#f0fdf4':'#fafbfc', transition:'all .2s' }}>
              <div style={{fontSize:36,marginBottom:10}}>{d.emoji}</div>
              <p style={{fontSize:12,fontWeight:700,color:'#334155',margin:'0 0 4px'}}>{d.label}</p>
              <p style={{fontSize:10,color:'#94a3b8',margin:'0 0 12px'}}>{d.hint}</p>
              {form[d.key]
                ? <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:4,color:'#16a34a',fontSize:11,fontWeight:700}}><CheckCircle2 size={13}/>Uploaded</div>
                : <div style={{padding:'6px 12px',background:'#eff6ff',color:'#2563eb',borderRadius:8,fontSize:11,fontWeight:700,display:'inline-block'}}>Choose File</div>
              }
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  const CONTENT = [S1,S2,S3,S4];
  const Content = CONTENT[step];

  return (
    <div style={{maxWidth:860,margin:'0 auto',paddingBottom:60}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:28}}>
        <button onClick={()=>navigate('/admission')} style={{width:42,height:42,borderRadius:12,border:'1.5px solid #e2e8f0',background:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <ArrowLeft size={18} color="#475569"/>
        </button>
        <div>
          <h1 style={{fontSize:22,fontWeight:800,color:'#0f172a',margin:0,letterSpacing:'-0.3px'}}>New Student Admission</h1>
          <p style={{fontSize:13,color:'#94a3b8',margin:'4px 0 0'}}>Step {step+1} of 4 — {STEPS[step]}</p>
        </div>
      </div>

      {/* Step Progress */}
      <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:20,padding:'24px 28px',marginBottom:20,boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
        <div style={{display:'flex',alignItems:'center'}}>
          {STEPS.map((label,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',flex:1}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0}}>
                <div style={{ width:42,height:42,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:step>i?'#22c55e':step===i?'#2563eb':'#f1f5f9',boxShadow:step>=i?'0 4px 12px rgba(37,99,235,0.2)':'none',transition:'all .3s' }}>
                  {step>i ? <Check size={18} color="#fff"/> : <span style={{fontSize:14,fontWeight:800,color:step===i?'#fff':'#94a3b8'}}>{i+1}</span>}
                </div>
                <span style={{fontSize:11,fontWeight:700,color:step===i?'#2563eb':step>i?'#16a34a':'#94a3b8',marginTop:8,whiteSpace:'nowrap'}}>{label}</span>
              </div>
              {i<STEPS.length-1&&<div style={{flex:1,height:2,background:step>i?'#22c55e':'#e2e8f0',margin:'0 12px 20px',borderRadius:99,transition:'background .3s'}}/>}
            </div>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:20,boxShadow:'0 1px 4px rgba(0,0,0,0.04)',overflow:'hidden'}}>
        <div style={{padding:'18px 28px',borderBottom:'1px solid #f1f5f9',background:'#fafbfc',display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:34,height:34,borderRadius:10,background:'#eff6ff',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <User size={16} color="#2563eb"/>
          </div>
          <div>
            <p style={{fontSize:14,fontWeight:800,color:'#1e293b',margin:0}}>{STEPS[step]}</p>
            <p style={{fontSize:12,color:'#94a3b8',margin:'2px 0 0'}}>Fill all required fields marked with *</p>
          </div>
        </div>
        <div style={{padding:28}}>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-16}} transition={{duration:0.2}}>
              <Content/>
            </motion.div>
          </AnimatePresence>
        </div>
        <div style={{padding:'16px 28px',borderTop:'1px solid #f1f5f9',background:'#fafbfc',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <button onClick={()=>step>0?setStep(s=>s-1):navigate('/admission')} style={{display:'flex',alignItems:'center',gap:8,height:44,padding:'0 20px',borderRadius:12,border:'1.5px solid #e2e8f0',background:'#fff',fontSize:13,fontWeight:700,color:'#475569',cursor:'pointer'}}>
            <ArrowLeft size={15}/> {step===0?'Cancel':'Previous'}
          </button>
          {step<3
            ? <button onClick={()=>setStep(s=>s+1)} style={{display:'flex',alignItems:'center',gap:8,height:44,padding:'0 28px',borderRadius:12,border:'none',background:'#2563eb',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',boxShadow:'0 4px 14px rgba(37,99,235,0.3)'}}>
                Next <ChevronRight size={15}/>
              </button>
            : <button onClick={submit} disabled={busy} style={{display:'flex',alignItems:'center',gap:8,height:44,padding:'0 28px',borderRadius:12,border:'none',background:busy?'#6b7280':'#059669',color:'#fff',fontSize:13,fontWeight:700,cursor:busy?'not-allowed':'pointer',boxShadow:'0 4px 14px rgba(5,150,105,0.3)'}}>
                {busy?'Submitting…':'Submit Admission'} <Check size={15}/>
              </button>
          }
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {done&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',padding:16,backdropFilter:'blur(6px)'}}>
            <motion.div initial={{scale:.85,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:.3,ease:[.16,1,.3,1]}} style={{background:'#fff',borderRadius:28,padding:36,width:'100%',maxWidth:420,textAlign:'center',boxShadow:'0 32px 80px rgba(0,0,0,0.18)'}}>
              <div style={{width:72,height:72,borderRadius:'50%',background:'#f0fdf4',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',boxShadow:'0 0 0 12px #f0fdf4'}}>
                <CheckCircle2 size={36} color="#22c55e"/>
              </div>
              <h2 style={{fontSize:22,fontWeight:800,color:'#0f172a',margin:'0 0 8px'}}>Admission Successful!</h2>
              <p style={{fontSize:14,color:'#64748b',margin:'0 0 20px'}}>Student admitted to JSK School ERP</p>
              <div style={{background:'linear-gradient(135deg,#eff6ff,#f5f3ff)',border:'1px solid #ddd6fe',borderRadius:16,padding:'18px 24px',marginBottom:24}}>
                <p style={{fontSize:11,fontWeight:700,color:'#7c3aed',textTransform:'uppercase',letterSpacing:'0.1em',margin:'0 0 6px'}}>Admission Number</p>
                <p style={{fontSize:30,fontWeight:800,color:'#1d4ed8',margin:0,letterSpacing:3}}>{done.no}</p>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
                <button style={{height:42,borderRadius:12,border:'1.5px solid #e2e8f0',background:'#fff',fontSize:12,fontWeight:700,color:'#475569',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}><Printer size={14}/>Print</button>
                <button onClick={()=>{setDone(null);setForm(INIT);setStep(0);}} style={{height:42,borderRadius:12,border:'1.5px solid #e2e8f0',background:'#fff',fontSize:12,fontWeight:700,color:'#475569',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}><UserPlus size={14}/>New</button>
                <button onClick={()=>done.id?navigate(`/admission/${done.id}`):navigate('/admission')} style={{height:42,borderRadius:12,border:'none',background:'#2563eb',fontSize:12,fontWeight:700,color:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}><User size={14}/>View</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
