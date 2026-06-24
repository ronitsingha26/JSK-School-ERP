import { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3, Calendar, Download, FileText, Printer, User } from 'lucide-react';
import { monthsList, payrollRecords, teachersData } from '../../data/dummyData';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export default function PayrollReports({ payroll = payrollRecords }) {
  const [month, setMonth] = useState('May');
  const [year, setYear] = useState(2026);
  const [teacherId, setTeacherId] = useState(teachersData[0]?.id || 1);

  const reportRows = useMemo(() => payroll
    .filter(r => r.month === month && r.year === Number(year))
    .map(r => ({ ...r, teacher: teachersData.find(t => t.id === r.teacherId) })), [payroll, month, year]);

  const totals = reportRows.reduce((sum, row) => ({
    gross: sum.gross + row.grossEarnings,
    pf: sum.pf + row.pf,
    tds: sum.tds + row.tds,
    other: sum.other + row.otherDeduction,
    net: sum.net + row.netSalary,
  }), { gross: 0, pf: 0, tds: 0, other: 0, net: 0 });

  const monthlyData = monthsList.map(m => {
    const row = payroll.find(r => r.teacherId === Number(teacherId) && r.month === m.name && r.year === Number(year));
    return { month: m.short, net: row?.netSalary || 0, status: row?.status || 'future' };
  });

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 }}>Payroll Reports</h1>
        <p style={{ fontSize: 14, color: '#64748b', marginTop: 4, fontWeight: 500 }}>Generate and export payroll summaries</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 14, marginBottom: 20 }}>
        {[
          { title: 'Monthly Payroll Summary', sub: 'All staff, one month', icon: BarChart3 },
          { title: 'Individual Salary Report', sub: 'Single staff full year', icon: User },
          { title: 'PF Statement', sub: 'Monthly PF contribution', icon: FileText },
          { title: 'Annual Salary Statement', sub: 'Year-wise breakup', icon: Calendar },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}><Icon size={20} /></div>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#0f172a' }}>{card.title}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, marginTop: 4 }}>{card.sub}</div>
              <button onClick={() => toast.success('Report generated!')} style={smallBlueBtn}>Generate</button>
            </div>
          );
        })}
      </div>

      <section style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
          <div>
            <h3 style={sectionTitle}>Monthly Payroll Summary Report</h3>
            <p style={sectionSub}>All staff payroll details for selected month.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <select value={month} onChange={e => setMonth(e.target.value)} style={input}>{monthsList.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}</select>
            <select value={year} onChange={e => setYear(e.target.value)} style={input}><option value={2026}>2026</option><option value={2025}>2025</option></select>
            <button onClick={() => toast.success('Report generated!')} style={smallBlueBtn}>Generate Report</button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 850 }}>
            <thead><tr style={{ background: '#f8fafc' }}>{['#', 'Employee', 'Gross', 'PF', 'TDS', 'Other', 'LOP', 'Net', 'Status'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {reportRows.map((row, index) => (
                <tr key={row.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={td}>{index + 1}</td><td style={tdStrong}>{row.teacher?.name}</td><td style={td}>{fmt(row.grossEarnings)}</td><td style={td}>{fmt(row.pf)}</td><td style={td}>{fmt(row.tds)}</td><td style={td}>{fmt(row.otherDeduction)}</td><td style={td}>{row.lopDays}</td><td style={{ ...tdStrong, color: '#10b981' }}>{fmt(row.netSalary)}</td><td style={td}>{row.status}</td>
                </tr>
              ))}
              <tr style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <td style={tdStrong}>TOTAL</td><td /><td style={tdStrong}>{fmt(totals.gross)}</td><td style={tdStrong}>{fmt(totals.pf)}</td><td style={tdStrong}>{fmt(totals.tds)}</td><td style={tdStrong}>{fmt(totals.other)}</td><td /><td style={{ ...tdStrong, color: '#10b981' }}>{fmt(totals.net)}</td><td />
              </tr>
            </tbody>
          </table>
        </div>
        <ActionButtons />
      </section>

      <section style={{ ...cardStyle, marginTop: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
          <div>
            <h3 style={sectionTitle}>Individual Salary Report</h3>
            <p style={sectionSub}>Full-year salary chart for selected staff.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <select value={teacherId} onChange={e => setTeacherId(e.target.value)} style={input}>{teachersData.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
            <select value={year} onChange={e => setYear(e.target.value)} style={input}><option value={2026}>2026</option><option value={2025}>2025</option></select>
          </div>
        </div>

        <div style={{ height: 220, marginBottom: 16 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={fmt} />
              <Tooltip formatter={(value) => fmt(value)} />
              <Bar dataKey="net" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 650 }}>
            <thead><tr style={{ background: '#f8fafc' }}>{['Month', 'Days', 'Gross', 'Deductions', 'Net', 'Status'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {monthsList.map(m => {
                const row = payroll.find(r => r.teacherId === Number(teacherId) && r.month === m.name && r.year === Number(year));
                return <tr key={m.id} style={{ borderTop: '1px solid #f1f5f9' }}><td style={tdStrong}>{m.name}</td><td style={td}>{row ? `${row.presentDays}/${row.workingDays}` : '-'}</td><td style={td}>{row ? fmt(row.grossEarnings) : '-'}</td><td style={td}>{row ? fmt(row.totalDeductions) : '-'}</td><td style={{ ...tdStrong, color: '#10b981' }}>{row ? fmt(row.netSalary) : '-'}</td><td style={td}>{row?.status || '-'}</td></tr>;
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ActionButtons() {
  return <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14, flexWrap: 'wrap' }}><button onClick={() => toast.success('PDF exported!')} style={outlineBtn}><Download size={14} /> Export PDF</button><button onClick={() => toast.success('Excel exported!')} style={outlineBtn}><Download size={14} /> Export Excel</button><button onClick={() => window.print()} style={outlineBtn}><Printer size={14} /> Print</button></div>;
}

const cardStyle = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' };
const sectionTitle = { margin: 0, fontSize: 16, fontWeight: 900, color: '#0f172a' };
const sectionSub = { margin: '4px 0 0', fontSize: 13, color: '#94a3b8', fontWeight: 600 };
const input = { height: 40, border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff', padding: '0 12px', fontSize: 13, fontWeight: 700, color: '#475569', outline: 'none', fontFamily: 'inherit' };
const smallBlueBtn = { marginTop: 14, height: 36, border: 'none', borderRadius: 10, background: '#2563eb', color: '#fff', padding: '0 13px', fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' };
const outlineBtn = { display: 'flex', alignItems: 'center', gap: 7, height: 36, border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff', color: '#475569', padding: '0 12px', fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' };
const th = { padding: '12px 14px', textAlign: 'left', fontSize: 11, color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' };
const td = { padding: '12px 14px', fontSize: 13, color: '#475569', fontWeight: 700 };
const tdStrong = { ...td, color: '#0f172a', fontWeight: 900 };
