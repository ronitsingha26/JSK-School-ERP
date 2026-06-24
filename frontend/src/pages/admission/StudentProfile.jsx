import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Pencil, Printer, UserX, Phone, Cake, Droplets,
  Bus, MapPin, Mail, User, BookOpen, Wallet, FileText,
  Download, CheckCircle2, Clock, GraduationCap, AlertCircle,
  Shield, Home, Hash, Calendar, Globe, Heart
} from 'lucide-react';
import api from '../../utils/api';

const TABS = [
  { label: 'Personal Details', icon: User },
  { label: 'Academic History', icon: BookOpen },
  { label: 'Fee Ledger',       icon: Wallet },
  { label: 'Documents',        icon: FileText },
];

const SAMPLE = {
  id:1, admission_no:'JSK20250001',
  first_name:'Aaditya', last_name:'Kumar',
  father_name:'Rajesh Kumar', mother_name:'Sunita Devi',
  dob:'2018-04-15', gender:'Male', blood_group:'B+',
  religion:'Hindu', category:'General', nationality:'Indian',
  aadhar_no:'1234 5678 9012',
  academic_year_id:'2025-26', admission_date:'2025-04-01',
  roll_number:'05', previous_school:'Sunrise Primary School', previous_class:'KG',
  bus_facility:true, bus_route:'Route 1 – East Zone', hostel_facility:false,
  mobile:'9876543210', alternate_mobile:'9123456780',
  email:'aaditya.kumar@gmail.com', parent_email:'rajesh.kumar@gmail.com',
  address:'Village Pratapganj, Near Post Office', landmark:'Near State Bank',
  city:'Patna', state:'Bihar', pin_code:'800001',
  emergency_contact_name:'Rajesh Kumar', emergency_contact_number:'9876543210',
  status:'Active', scholarship:false,
  class:{ class_name:'I' }, section:{ section_name:'A' }, academicYear:{ year_name:'2025-26' },
};

const FEES = [
  { receipt:'REC-10345', date:'2026-05-15', head:'Tuition Fee',   amount:2500, mode:'Cash',   status:'Paid'    },
  { receipt:'REC-10210', date:'2026-04-12', head:'Tuition Fee',   amount:2500, mode:'Online', status:'Paid'    },
  { receipt:'REC-10089', date:'2026-03-10', head:'Transport Fee', amount:800,  mode:'Cash',   status:'Paid'    },
  { receipt:'REC-09954', date:'2026-02-08', head:'Tuition Fee',   amount:2500, mode:'Online', status:'Paid'    },
  { receipt:'REC-09801', date:'2026-01-15', head:'Annual Charge', amount:4200, mode:'Cash',   status:'Pending' },
];

const DOCS = [
  { key:'photo',      label:'Student Photo',       emoji:'🧑‍🎓', uploaded:true  },
  { key:'aadhar',     label:'Aadhar Card',          emoji:'🪪',   uploaded:true  },
  { key:'birth_cert', label:'Birth Certificate',    emoji:'📄',   uploaded:true  },
  { key:'tc',         label:'Transfer Certificate', emoji:'📋',   uploaded:false },
  { key:'marksheet',  label:'Previous Marksheet',   emoji:'📊',   uploaded:false },
];

const AVATAR_COLORS = [
  ['#3b82f6','#1d4ed8'],['#8b5cf6','#6d28d9'],['#10b981','#059669'],
  ['#f59e0b','#d97706'],['#ef4444','#dc2626'],['#06b6d4','#0891b2'],
];

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(SAMPLE);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    api.get(`/admission/${id}`).then(r => { if(r.data) setStudent(r.data); }).catch(() => {});
  }, [id]);

  const initials = `${student.first_name?.[0]||''}${student.last_name?.[0]||''}`.toUpperCase();
  const [c1,c2] = AVATAR_COLORS[(student.id||1) % AVATAR_COLORS.length];
  const fullName = `${student.first_name} ${student.last_name}`;
  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—';
  const totalPaid = FEES.filter(f=>f.status==='Paid').reduce((a,f)=>a+f.amount,0);

  /* ── reusable info row ── */
  const Row = ({ icon:Icon, color, label, value }) => (
    <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'12px 0', borderBottom:'1px solid #f1f5f9' }}>
      <div style={{ width:32, height:32, borderRadius:8, background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
        <Icon size={14} color={color||'#94a3b8'}/>
      </div>
      <div>
        <p style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.08em', margin:0 }}>{label}</p>
        <p style={{ fontSize:13, fontWeight:600, color:'#1e293b', margin:'4px 0 0', lineHeight:1.4 }}>{value||'—'}</p>
      </div>
    </div>
  );

  /* ── 2-column detail grid ── */
  const Grid2 = ({ items }) => (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', border:'1px solid #e2e8f0', borderRadius:14, overflow:'hidden' }}>
      {items.map(([l,v],i) => (
        <div key={i} style={{ padding:'14px 18px', borderBottom: i < items.length-2 ? '1px solid #f1f5f9' : 'none', borderRight: i%2===0 ? '1px solid #f1f5f9' : 'none', background: i%4<2 ? '#fff' : '#fafbfc' }}>
          <p style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 6px' }}>{l}</p>
          <p style={{ fontSize:13, fontWeight:600, color:'#1e293b', margin:0, lineHeight:1.5 }}>{v||'—'}</p>
        </div>
      ))}
    </div>
  );

  const SectionTitle = ({ icon:Icon, label, color }) => (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
      <div style={{ width:30, height:30, borderRadius:8, background: color+'15', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Icon size={14} color={color}/>
      </div>
      <h3 style={{ fontSize:13, fontWeight:800, color:'#0f172a', margin:0 }}>{label}</h3>
    </div>
  );

  return (
    <div style={{ maxWidth:'100%', paddingBottom:48 }}>

      {/* Back Nav */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24 }}>
        <button onClick={() => navigate('/admission')} style={{ width:40, height:40, borderRadius:12, border:'1.5px solid #e2e8f0', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <ArrowLeft size={17} color="#475569"/>
        </button>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800, color:'#0f172a', margin:0, letterSpacing:'-0.3px' }}>Student Profile</h1>
          <p style={{ fontSize:12, color:'#94a3b8', margin:'3px 0 0', fontWeight:500 }}>
            Admission No: <span style={{ fontWeight:800, color:'#2563eb' }}>{student.admission_no}</span>
          </p>
        </div>
      </div>

      <div style={{ display:'flex', gap:22, alignItems:'flex-start', flexWrap:'wrap' }}>

        {/* ═══════════════════ LEFT PANEL ═══════════════════ */}
        <motion.div
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}
          style={{ width:272, flexShrink:0 }}
        >
          {/* Profile Card */}
          <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:20, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', marginBottom:16 }}>
            {/* Banner */}
            <div style={{ height:90, background:`linear-gradient(135deg, ${c1}, ${c2})`, position:'relative' }}>
              <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 70% 40%, rgba(255,255,255,0.15) 0%, transparent 60%)' }}/>
            </div>

            <div style={{ padding:'0 20px 24px', marginTop:-38 }}>
              {/* Avatar */}
              <div style={{ position:'relative', marginBottom:14 }}>
                <div style={{ width:76, height:76, borderRadius:18, background:`linear-gradient(135deg, ${c1}, ${c2})`, display:'flex', alignItems:'center', justifyContent:'center', border:'4px solid #fff', boxShadow:'0 4px 16px rgba(0,0,0,0.12)' }}>
                  <span style={{ fontSize:26, fontWeight:800, color:'#fff' }}>{initials}</span>
                </div>
                <div style={{ position:'absolute', bottom:2, right:2, width:16, height:16, borderRadius:'50%', background: student.status==='Active'?'#22c55e':'#e2e8f0', border:'2.5px solid #fff' }}/>
              </div>

              {/* Name & badges */}
              <h2 style={{ fontSize:17, fontWeight:800, color:'#0f172a', margin:'0 0 8px', lineHeight:1.3 }}>{fullName}</h2>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:20 }}>
                <span style={{ fontSize:10, fontWeight:800, color:'#2563eb', background:'#eff6ff', border:'1px solid #bfdbfe', padding:'4px 10px', borderRadius:8 }}>{student.admission_no}</span>
                {student.class&&student.section&&(
                  <span style={{ fontSize:10, fontWeight:800, color:'#7c3aed', background:'#f5f3ff', border:'1px solid #ddd6fe', padding:'4px 10px', borderRadius:8 }}>
                    Class {student.class.class_name}–{student.section.section_name}
                  </span>
                )}
                <span style={{ fontSize:10, fontWeight:800, padding:'4px 10px', borderRadius:8, border:'1px solid', ...(student.status==='Active' ? { color:'#16a34a', background:'#f0fdf4', borderColor:'#bbf7d0' } : { color:'#dc2626', background:'#fef2f2', borderColor:'#fecaca' }) }}>
                  {student.status}
                </span>
              </div>

              {/* Quick info rows */}
              <div style={{ marginBottom:20 }}>
                <Row icon={Phone}   color="#2563eb" label="Mobile"      value={student.mobile}/>
                <Row icon={Cake}    color="#7c3aed" label="Date of Birth" value={fmtDate(student.dob)}/>
                <Row icon={Droplets}color="#dc2626" label="Blood Group" value={student.blood_group}/>
                <Row icon={Bus}     color="#059669" label="Transport"   value={student.bus_facility ? student.bus_route : 'Not enrolled'}/>
                <Row icon={MapPin}  color="#d97706" label="City"        value={student.city && student.state ? `${student.city}, ${student.state}` : null}/>
              </div>

              {/* Actions */}
              <button onClick={() => navigate(`/admission/${id}/edit`)} style={{ width:'100%', height:42, borderRadius:12, border:'none', background:'#2563eb', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:10, boxShadow:'0 3px 10px rgba(37,99,235,0.28)' }}>
                <Pencil size={14}/> Edit Profile
              </button>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                <button style={{ height:38, borderRadius:10, border:'1.5px solid #e2e8f0', background:'#fff', fontSize:12, fontWeight:700, color:'#475569', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                  <Printer size={13}/> Print
                </button>
                <button style={{ height:38, borderRadius:10, border:'1.5px solid #fee2e2', background:'#fef2f2', fontSize:12, fontWeight:700, color:'#dc2626', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                  <UserX size={13}/> Deactivate
                </button>
              </div>
            </div>
          </div>

          {/* Student Meta Card */}
          <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:'18px 20px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
            <p style={{ fontSize:11, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 14px' }}>Student Info</p>
            {[['Gender',student.gender],['Category',student.category],['Religion',student.religion],['Nationality',student.nationality],['Aadhar No',student.aadhar_no]].map(([l,v])=>(
              <div key={l} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #f8fafc' }}>
                <span style={{ fontSize:12, color:'#64748b', fontWeight:600 }}>{l}</span>
                <span style={{ fontSize:12, fontWeight:700, color:'#1e293b' }}>{v||'—'}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ═══════════════════ RIGHT PANEL ═══════════════════ */}
        <motion.div
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35, delay:0.06 }}
          style={{ flex:1, minWidth:0 }}
        >
          <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:20, boxShadow:'0 2px 12px rgba(0,0,0,0.06)', overflow:'hidden' }}>

            {/* Tab Bar */}
            <div style={{ display:'flex', borderBottom:'1px solid #e2e8f0', background:'#fafbfc', overflowX:'auto' }}>
              {TABS.map((t,i) => {
                const Icon = t.icon;
                return (
                  <button key={t.label} onClick={() => setTab(i)} style={{ flex:1, minWidth:130, display:'flex', alignItems:'center', justifyContent:'center', gap:7, padding:'15px 12px', fontSize:12, fontWeight:700, border:'none', borderBottom:`2.5px solid ${tab===i?'#2563eb':'transparent'}`, background: tab===i?'#eff6ff':'transparent', color: tab===i?'#2563eb':'#64748b', cursor:'pointer', transition:'all .18s', whiteSpace:'nowrap' }}>
                    <Icon size={14}/> {t.label}
                  </button>
                );
              })}
            </div>

            <div style={{ padding:28 }}>

              {/* ── TAB 1: Personal Details ── */}
              {tab===0 && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{ display:'flex', flexDirection:'column', gap:24 }}>
                  <div>
                    <SectionTitle icon={User} label="Personal Information" color="#2563eb"/>
                    <Grid2 items={[
                      ['Father Name', student.father_name],
                      ['Mother Name', student.mother_name],
                      ['Date of Birth', fmtDate(student.dob)],
                      ['Gender', student.gender],
                      ['Blood Group', student.blood_group],
                      ['Religion', student.religion],
                      ['Category', student.category],
                      ['Nationality', student.nationality],
                    ]}/>
                  </div>
                  <div>
                    <SectionTitle icon={MapPin} label="Contact & Address" color="#7c3aed"/>
                    <Grid2 items={[
                      ['Mobile', student.mobile],
                      ['Alternate Mobile', student.alternate_mobile],
                      ['Email', student.email],
                      ['Parent Email', student.parent_email],
                      ['Address', student.address],
                      ['Landmark', student.landmark],
                      ['City', student.city],
                      ['State', student.state],
                      ['PIN Code', student.pin_code],
                      ['Emergency Contact', student.emergency_contact_name ? `${student.emergency_contact_name} · ${student.emergency_contact_number}` : '—'],
                    ]}/>
                  </div>
                </motion.div>
              )}

              {/* ── TAB 2: Academic History ── */}
              {tab===1 && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{ display:'flex', flexDirection:'column', gap:24 }}>
                  <div>
                    <SectionTitle icon={GraduationCap} label="Academic Information" color="#059669"/>
                    <Grid2 items={[
                      ['Academic Year', student.academicYear?.year_name || student.academic_year_id],
                      ['Admission Date', fmtDate(student.admission_date)],
                      ['Class', student.class?.class_name],
                      ['Section', student.section?.section_name],
                      ['Roll Number', student.roll_number],
                      ['Admission No', student.admission_no],
                      ['Previous School', student.previous_school],
                      ['Previous Class', student.previous_class],
                      ['Bus Facility', student.bus_facility ? `Yes – ${student.bus_route}` : 'No'],
                      ['Hostel Facility', student.hostel_facility ? 'Yes' : 'No'],
                    ]}/>
                  </div>

                  {/* Class progression */}
                  <div>
                    <SectionTitle icon={BookOpen} label="Class Progression" color="#7c3aed"/>
                    <div style={{ display:'flex', alignItems:'center', gap:16, padding:'18px 20px', background:'linear-gradient(135deg,#eff6ff,#f5f3ff)', border:'1px solid #ddd6fe', borderRadius:14 }}>
                      <div style={{ width:48,height:48,borderRadius:14,background:'#2563eb',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 12px rgba(37,99,235,0.3)' }}>
                        <GraduationCap size={22} color="#fff"/>
                      </div>
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:15, fontWeight:800, color:'#0f172a', margin:0 }}>
                          Class {student.class?.class_name} – Section {student.section?.section_name}
                        </p>
                        <p style={{ fontSize:12, color:'#64748b', margin:'4px 0 0' }}>
                          {student.academicYear?.year_name || student.academic_year_id} · Roll No. {student.roll_number||'—'}
                        </p>
                      </div>
                      <span style={{ fontSize:11, fontWeight:800, color:'#fff', background:'#2563eb', padding:'6px 14px', borderRadius:10, boxShadow:'0 2px 8px rgba(37,99,235,0.3)' }}>Current</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── TAB 3: Fee Ledger ── */}
              {tab===2 && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{ display:'flex', flexDirection:'column', gap:20 }}>
                  {/* Summary */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
                    {[
                      { label:'Total Paid', value:`₹${totalPaid.toLocaleString('en-IN')}`, color:'#059669', bg:'#f0fdf4', border:'#bbf7d0' },
                      { label:'Pending',    value:'₹4,200',                                 color:'#dc2626', bg:'#fef2f2', border:'#fecaca' },
                      { label:'Total Fees', value:`₹${(totalPaid+4200).toLocaleString('en-IN')}`, color:'#2563eb', bg:'#eff6ff', border:'#bfdbfe' },
                    ].map(s=>(
                      <div key={s.label} style={{ padding:'18px 20px', background:s.bg, border:`1px solid ${s.border}`, borderRadius:14 }}>
                        <p style={{ fontSize:11, fontWeight:700, color:s.color, textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 8px' }}>{s.label}</p>
                        <p style={{ fontSize:24, fontWeight:800, color:s.color, margin:0 }}>{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Table */}
                  <div style={{ border:'1px solid #e2e8f0', borderRadius:14, overflow:'hidden' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                      <thead>
                        <tr style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
                          {['Receipt No','Date','Fee Head','Amount','Mode','Status'].map(h=>(
                            <th key={h} style={{ padding:'11px 16px', textAlign:'left', fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.08em', whiteSpace:'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {FEES.map((f,i)=>(
                          <tr key={f.receipt} style={{ borderBottom: i<FEES.length-1?'1px solid #f1f5f9':'none' }}
                            onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'}
                            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                            <td style={{ padding:'13px 16px', fontSize:12, fontWeight:800, color:'#2563eb' }}>{f.receipt}</td>
                            <td style={{ padding:'13px 16px', fontSize:12, color:'#64748b' }}>{fmtDate(f.date)}</td>
                            <td style={{ padding:'13px 16px', fontSize:13, fontWeight:600, color:'#1e293b' }}>{f.head}</td>
                            <td style={{ padding:'13px 16px', fontSize:13, fontWeight:800, color:'#0f172a' }}>₹{f.amount.toLocaleString('en-IN')}</td>
                            <td style={{ padding:'13px 16px' }}>
                              <span style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:8, background:f.mode==='Cash'?'#fffbeb':'#eff6ff', color:f.mode==='Cash'?'#d97706':'#2563eb' }}>{f.mode}</span>
                            </td>
                            <td style={{ padding:'13px 16px' }}>
                              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                                {f.status==='Paid'
                                  ? <CheckCircle2 size={14} color="#22c55e"/>
                                  : <AlertCircle size={14} color="#f59e0b"/>}
                                <span style={{ fontSize:12, fontWeight:700, color:f.status==='Paid'?'#16a34a':'#d97706' }}>{f.status}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* ── TAB 4: Documents ── */}
              {tab===3 && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                  <p style={{ fontSize:13, color:'#64748b', margin:'0 0 20px' }}>
                    {DOCS.filter(d=>d.uploaded).length} of {DOCS.length} documents uploaded
                  </p>

                  {/* Progress bar */}
                  <div style={{ height:6, background:'#f1f5f9', borderRadius:99, marginBottom:24, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${(DOCS.filter(d=>d.uploaded).length/DOCS.length)*100}%`, background:'linear-gradient(90deg,#2563eb,#7c3aed)', borderRadius:99, transition:'width .5s' }}/>
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:14 }}>
                    {DOCS.map(doc=>(
                      <div key={doc.key} style={{ border:`2px ${doc.uploaded?'solid':'dashed'} ${doc.uploaded?'#86efac':'#e2e8f0'}`, borderRadius:18, padding:'22px 16px', textAlign:'center', background:doc.uploaded?'#f0fdf4':'#fafbfc', transition:'all .2s' }}>
                        <div style={{ fontSize:36, marginBottom:12 }}>{doc.emoji}</div>
                        <p style={{ fontSize:12, fontWeight:700, color:'#334155', margin:'0 0 8px', lineHeight:1.4 }}>{doc.label}</p>
                        {doc.uploaded ? (
                          <>
                            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:4, marginBottom:10 }}>
                              <CheckCircle2 size={12} color="#22c55e"/>
                              <span style={{ fontSize:11, fontWeight:700, color:'#16a34a' }}>Uploaded</span>
                            </div>
                            <button style={{ width:'100%', height:32, borderRadius:10, border:'none', background:'#059669', color:'#fff', fontSize:11, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
                              <Download size={11}/> Download
                            </button>
                          </>
                        ) : (
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}>
                            <Clock size={12} color="#94a3b8"/>
                            <span style={{ fontSize:11, fontWeight:700, color:'#94a3b8' }}>Not Uploaded</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
