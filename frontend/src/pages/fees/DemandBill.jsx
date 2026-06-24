import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Printer, Download, Search, Calendar, GraduationCap, IndianRupee, Eye, ChevronDown, X } from 'lucide-react';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts;

const MONTHS_UPCOMING = [
  { month:'Jun 2025', heads:[
    { name:'Tuition Fee', amount:2500 },{ name:'Transport Fee', amount:1200 },{ name:'Computer Fee', amount:400 },
  ]},
  { month:'Jul 2025', heads:[
    { name:'Tuition Fee', amount:2500 },{ name:'Transport Fee', amount:1200 },{ name:'Computer Fee', amount:400 },
  ]},
  { month:'Aug 2025', heads:[
    { name:'Tuition Fee', amount:2500 },{ name:'Transport Fee', amount:1200 },{ name:'Computer Fee', amount:400 },
  ]},
  { month:'Sep 2025', heads:[
    { name:'Tuition Fee', amount:2500 },{ name:'Transport Fee', amount:1200 },{ name:'Computer Fee', amount:400 },
  ]},
  { month:'Oct 2025', heads:[
    { name:'Tuition Fee', amount:2500 },{ name:'Transport Fee', amount:1200 },{ name:'Computer Fee', amount:400 },
  ]},
  { month:'Nov 2025', heads:[
    { name:'Tuition Fee', amount:2500 },{ name:'Transport Fee', amount:1200 },{ name:'Computer Fee', amount:400 },
  ]},
];

const STUDENTS = [
  { id:1, name:'Aaditya Kumar',  admNo:'JSK20250001', cls:'I – A',  father:'Rajesh Kumar' },
  { id:2, name:'Priya Sharma',   admNo:'JSK20250002', cls:'III – B', father:'Suresh Sharma' },
  { id:3, name:'Rahul Verma',    admNo:'JSK20250003', cls:'V – A',   father:'Anil Verma' },
  { id:4, name:'Sneha Gupta',    admNo:'JSK20250004', cls:'II – C',  father:'Vikram Gupta' },
];

const COLORS = [['#3b82f6','#1d4ed8'],['#8b5cf6','#6d28d9'],['#10b981','#059669'],['#f59e0b','#d97706']];
const fade = { hidden:{opacity:0,y:10}, show:{opacity:1,y:0,transition:{duration:0.3}} };

export default function DemandBill() {
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonths, setSelectedMonths] = useState(3);
  const [previewStudent, setPreviewStudent] = useState(null);

  const filteredStudents = STUDENTS.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.admNo.toLowerCase().includes(q);
    
    const [c, sec] = s.cls.split(' – ').map(str => str ? str.trim() : '');
    const matchClass = !selectedClass || c === selectedClass;
    const matchSection = !selectedSection || sec === selectedSection;
    
    return matchSearch && matchClass && matchSection;
  });

  const totalPerMonth = MONTHS_UPCOMING[0]?.heads.reduce((s,h) => s + h.amount, 0) || 0;
  const grandTotal = totalPerMonth * selectedMonths;
  const initials = n => n.split(' ').map(w => w[0]).join('').toUpperCase();
  const avatarBg = id => { const [a,b] = COLORS[id % COLORS.length]; return `linear-gradient(135deg,${a},${b})`; };

  const generatePDF = (studentsToPrint, action = 'open') => {
    if (studentsToPrint.length === 0) return;

    const content = [];

    studentsToPrint.forEach((student, index) => {
      content.push({ text: 'JSK EDUCATIONAL ACADEMY', style: 'header', alignment: 'center', margin: [0, 0, 0, 5] });
      content.push({ text: 'Demand Bill', style: 'subheader', alignment: 'center', margin: [0, 0, 0, 20] });

      content.push({
        columns: [
          { width: '*', text: [ { text: 'Student Name: ', bold: true }, `${student.name}\n`, { text: 'Admission No: ', bold: true }, `${student.admNo}\n`, { text: 'Class: ', bold: true }, `${student.cls}` ] },
          { width: '*', alignment: 'right', text: [ { text: 'Demand Period: ', bold: true }, `${selectedMonths} Months\n`, { text: 'Generated On: ', bold: true }, `${new Date().toLocaleDateString()}` ] }
        ],
        margin: [0, 0, 0, 20]
      });

      const tableBody = [
        [
          { text: 'Fee Head', style: 'tableHeader' },
          ...MONTHS_UPCOMING.slice(0, selectedMonths).map(m => ({ text: m.month, style: 'tableHeader', alignment: 'right' })),
          { text: 'Total', style: 'tableHeader', alignment: 'right' }
        ]
      ];

      MONTHS_UPCOMING[0]?.heads.forEach(h => {
        tableBody.push([
          { text: h.name, bold: true },
          ...MONTHS_UPCOMING.slice(0, selectedMonths).map(() => ({ text: `Rs. ${h.amount.toLocaleString('en-IN')}`, alignment: 'right' })),
          { text: `Rs. ${(h.amount * selectedMonths).toLocaleString('en-IN')}`, alignment: 'right', bold: true }
        ]);
      });

      tableBody.push([
        { text: 'Grand Total', bold: true, fillColor: '#eff6ff' },
        ...MONTHS_UPCOMING.slice(0, selectedMonths).map(() => ({ text: `Rs. ${totalPerMonth.toLocaleString('en-IN')}`, alignment: 'right', bold: true, fillColor: '#eff6ff' })),
        { text: `Rs. ${grandTotal.toLocaleString('en-IN')}`, alignment: 'right', bold: true, fillColor: '#eff6ff' }
      ]);

      content.push({ table: { headerRows: 1, widths: ['*', ...MONTHS_UPCOMING.slice(0, selectedMonths).map(() => 'auto'), 'auto'], body: tableBody }, layout: 'lightHorizontalLines' });

      if (index < studentsToPrint.length - 1) {
        content.push({ text: '', pageBreak: 'after', margin: [0, 20] });
      }
    });

    const docDefinition = {
      content: content,
      styles: {
        header: { fontSize: 18, bold: true, color: '#1e40af' },
        subheader: { fontSize: 14, bold: true, color: '#475569' },
        tableHeader: { bold: true, fontSize: 10, color: '#475569', fillColor: '#fafbfc' }
      },
      defaultStyle: { fontSize: 10 }
    };

    if (action === 'print') pdfMake.createPdf(docDefinition).print();
    else if (action === 'download') pdfMake.createPdf(docDefinition).download(`Demand_Bills_${selectedClass || 'All'}.pdf`);
    else pdfMake.createPdf(docDefinition).open();
  };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show:{transition:{staggerChildren:.07}} }} style={{ paddingBottom:40 }}>
      {/* Header */}
      <motion.div variants={fade} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:800, color:'#0f172a', margin:0, letterSpacing:'-0.5px' }}>Demand Bill</h1>
          <p style={{ fontSize:14, color:'#94a3b8', marginTop:6, fontWeight:500 }}>Generate and print demand bills for upcoming fee payments</p>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={fade} style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
        {[
          { label:'Monthly Fee', value:`₹${totalPerMonth.toLocaleString('en-IN')}`, icon:IndianRupee, color:'#2563eb', bg:'#eff6ff' },
          { label:'Demand Period', value:`${selectedMonths} Months`, icon:Calendar, color:'#7c3aed', bg:'#f5f3ff' },
          { label:'Grand Total', value:`₹${grandTotal.toLocaleString('en-IN')}`, icon:FileText, color:'#059669', bg:'#ecfdf5' },
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

      {/* Config Card */}
      <motion.div variants={fade} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:18, padding:'20px 24px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)', marginBottom:20, display:'flex', gap:16, alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <Search size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#94a3b8', pointerEvents:'none' }}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student name or admission no..."
            style={{ width:'100%', height:40, paddingLeft:36, border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:13, fontWeight:500, color:'#0f172a', outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}/>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}
            style={{ height:40, border:'1.5px solid #e2e8f0', borderRadius:10, padding:'0 12px', fontSize:13, fontWeight:600, color:'#0f172a', outline:'none', fontFamily:'inherit', background:'#fff', minWidth:110 }}>
            <option value="">All Years</option>
            <option value="2025-26">Year: 25-26</option>
            <option value="2024-25">Year: 24-25</option>
          </select>
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
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
          <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)}
            style={{ height:40, border:'1.5px solid #e2e8f0', borderRadius:10, padding:'0 12px', fontSize:13, fontWeight:600, color:'#0f172a', outline:'none', fontFamily:'inherit', background:'#fff', minWidth:110 }}>
            <option value="">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
            <option value="D">Section D</option>
          </select>
          <select value={selectedMonths} onChange={e => setSelectedMonths(parseInt(e.target.value))}
            style={{ height:40, border:'1.5px solid #e2e8f0', borderRadius:10, padding:'0 12px', fontSize:13, fontWeight:600, color:'#0f172a', outline:'none', fontFamily:'inherit', background:'#fff', minWidth:110 }}>
            {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Months Ahead</option>)}
          </select>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => generatePDF(filteredStudents, 'open')} style={{ display:'flex', alignItems:'center', gap:5, height:40, padding:'0 20px', background:'#2563eb', color:'#fff', border:'none', borderRadius:10, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 2px 8px rgba(37,99,235,0.25)' }}>
            <Printer size={14}/> Generate for All
          </button>
          <button onClick={() => generatePDF(filteredStudents, 'download')} style={{ display:'flex', alignItems:'center', gap:5, height:40, padding:'0 20px', border:'1.5px solid #e2e8f0', background:'#fff', borderRadius:10, fontSize:13, fontWeight:700, color:'#475569', cursor:'pointer', fontFamily:'inherit' }}>
            <Download size={14}/> Export PDF
          </button>
        </div>
      </motion.div>

      {/* Fee Structure Preview */}
      <motion.div variants={fade} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:18, padding:'22px 24px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)', marginBottom:20 }}>
        <p style={{ fontSize:14, fontWeight:800, color:'#0f172a', margin:'0 0 14px' }}>Upcoming Fee Structure — Class {selectedClass || 'All'}</p>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead>
              <tr style={{ background:'#fafbfc', borderBottom:'1.5px solid #e2e8f0' }}>
                <th style={{ padding:'12px 14px', textAlign:'left', fontSize:10, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em' }}>Fee Head</th>
                {MONTHS_UPCOMING.slice(0, selectedMonths).map(m => (
                  <th key={m.month} style={{ padding:'12px 14px', textAlign:'right', fontSize:10, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em' }}>{m.month}</th>
                ))}
                <th style={{ padding:'12px 14px', textAlign:'right', fontSize:10, fontWeight:800, color:'#2563eb', textTransform:'uppercase', letterSpacing:'0.06em' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {MONTHS_UPCOMING[0]?.heads.map(h => (
                <tr key={h.name} style={{ borderBottom:'1px solid #f1f5f9' }}>
                  <td style={{ padding:'12px 14px', fontWeight:700, color:'#0f172a' }}>{h.name}</td>
                  {MONTHS_UPCOMING.slice(0, selectedMonths).map(m => (
                    <td key={m.month} style={{ padding:'12px 14px', textAlign:'right', fontWeight:600 }}>₹{h.amount.toLocaleString('en-IN')}</td>
                  ))}
                  <td style={{ padding:'12px 14px', textAlign:'right', fontWeight:800, color:'#2563eb' }}>₹{(h.amount * selectedMonths).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background:'#eff6ff', borderTop:'2px solid #2563eb' }}>
                <td style={{ padding:'14px', fontWeight:800, color:'#1e40af' }}>Grand Total</td>
                {MONTHS_UPCOMING.slice(0, selectedMonths).map(m => (
                  <td key={m.month} style={{ padding:'14px', textAlign:'right', fontWeight:800, color:'#1e40af' }}>₹{totalPerMonth.toLocaleString('en-IN')}</td>
                ))}
                <td style={{ padding:'14px', textAlign:'right', fontWeight:900, fontSize:16, color:'#2563eb' }}>₹{grandTotal.toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </motion.div>

      {/* Student List */}
      <motion.div variants={fade} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:18, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ padding:'16px 20px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <p style={{ fontSize:13, fontWeight:700, color:'#475569', margin:0 }}>Students — Class {selectedClass || 'All'}</p>
          <p style={{ fontSize:12, fontWeight:600, color:'#94a3b8', margin:0 }}>{filteredStudents.length} students</p>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13, fontWeight:500, color:'#475569' }}>
            <thead>
              <tr style={{ background:'#fafbfc', borderBottom:'1.5px solid #e2e8f0' }}>
                {['#','Student','Admission No','Father Name','Demand Amount','Actions'].map(h => (
                  <th key={h} style={{ padding:'14px 16px', textAlign:'left', fontSize:11, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s, i) => (
                <tr key={s.id} style={{ borderBottom:'1px solid #f1f5f9', transition:'background 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#fafbfc'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'14px 16px', color:'#94a3b8', fontWeight:700 }}>{i+1}</td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:34, height:34, borderRadius:'50%', background:avatarBg(s.id), display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, fontWeight:800, flexShrink:0 }}>{initials(s.name)}</div>
                      <div><span style={{ fontWeight:700, color:'#0f172a' }}>{s.name}</span><div style={{ fontSize:11, color:'#94a3b8' }}>{s.cls}</div></div>
                    </div>
                  </td>
                  <td style={{ padding:'14px 16px', fontWeight:600, color:'#2563eb', fontSize:12 }}>{s.admNo}</td>
                  <td style={{ padding:'14px 16px' }}>{s.father}</td>
                  <td style={{ padding:'14px 16px', fontWeight:800, color:'#0f172a', fontSize:14 }}>₹{grandTotal.toLocaleString('en-IN')}</td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', gap:4 }}>
                      <button onClick={() => generatePDF([s], 'open')} style={{ display:'flex', alignItems:'center', gap:4, padding:'7px 12px', border:'1.5px solid #e2e8f0', borderRadius:8, background:'#fff', fontSize:11, fontWeight:700, color:'#475569', cursor:'pointer', fontFamily:'inherit' }}><Eye size={12}/> Preview</button>
                      <button onClick={() => generatePDF([s], 'print')} style={{ display:'flex', alignItems:'center', gap:4, padding:'7px 12px', background:'#2563eb', color:'#fff', border:'none', borderRadius:8, fontSize:11, fontWeight:700, cursor:'pointer', boxShadow:'0 2px 6px rgba(37,99,235,0.2)' }}><Printer size={12}/> Print</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding:40, textAlign:'center', color:'#94a3b8', fontWeight:600 }}>No students found matching your filters</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
