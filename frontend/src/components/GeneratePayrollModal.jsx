import { useState } from 'react';
import { X, Zap } from 'lucide-react';
import { teachersData } from '../data/dummyData';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const overlay = {
  position: 'fixed',
  inset: 0,
  zIndex: 999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(15,23,42,0.45)',
  backdropFilter: 'blur(4px)',
  padding: 16,
};

export default function GeneratePayrollModal({ month, year, defaultWorkingDays = 27, onClose, onGenerate }) {
  const [workingDays, setWorkingDays] = useState(defaultWorkingDays);
  const [applyLop, setApplyLop] = useState(true);
  const [includeAdvance, setIncludeAdvance] = useState(true);

  const preview = teachersData.map(teacher => {
    const gross = teacher.basicSalary + teacher.hra + teacher.da + teacher.ta;
    const deductions = teacher.pf + teacher.esi + teacher.tds;
    return { teacher, gross, deductions, net: gross - deductions };
  });

  const totals = preview.reduce((sum, row) => ({
    gross: sum.gross + row.gross,
    deductions: sum.deductions + row.deductions,
    net: sum.net + row.net,
  }), { gross: 0, deductions: 0, net: 0 });

  return (
    <div style={overlay}>
      <div style={{ width: '100%', maxWidth: 720, maxHeight: '92vh', overflow: 'auto', background: '#fff', borderRadius: 20, boxShadow: '0 24px 80px rgba(15,23,42,0.22)' }}>
        <div style={{ padding: '22px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0f172a' }}>Generate Payroll - {month} {year}</h3>
              <p style={{ margin: '3px 0 0', fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Preview salary records for all staff.</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', color: '#64748b' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Employee', 'Basic', 'Gross', 'Deductions', 'Net'].map(h => (
                    <th key={h} style={{ padding: '11px 12px', textAlign: 'left', fontSize: 11, color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map(row => (
                  <tr key={row.teacher.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 800, color: '#0f172a' }}>{row.teacher.name}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#475569' }}>{fmt(row.teacher.basicSalary)}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#475569' }}>{fmt(row.gross)}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#ef4444' }}>{fmt(row.deductions)}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 900, color: '#10b981' }}>{fmt(row.net)}</td>
                  </tr>
                ))}
                <tr style={{ background: '#ecfdf5', borderTop: '1px solid #bbf7d0' }}>
                  <td style={{ padding: '11px 12px', fontWeight: 900, color: '#065f46' }}>TOTAL</td>
                  <td />
                  <td style={{ padding: '11px 12px', fontWeight: 900, color: '#065f46' }}>{fmt(totals.gross)}</td>
                  <td style={{ padding: '11px 12px', fontWeight: 900, color: '#065f46' }}>{fmt(totals.deductions)}</td>
                  <td style={{ padding: '11px 12px', fontWeight: 900, color: '#065f46' }}>{fmt(totals.net)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ background: '#eff6ff', color: '#1e40af', borderRadius: 14, padding: 14, fontSize: 13, fontWeight: 600, lineHeight: 1.55, marginBottom: 16 }}>
            Salary will be auto-calculated from each teacher salary structure. LOP deductions can be applied from attendance data, and records can be edited after generation.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 800, color: '#334155' }}>
              Working Days in {month} {year}
              <input type="number" min="1" max="31" value={workingDays} onChange={e => setWorkingDays(Number(e.target.value) || 1)} style={{ marginTop: 7, width: '100%', height: 40, border: '1px solid #e2e8f0', borderRadius: 10, padding: '0 12px', fontSize: 14, fontWeight: 700, outline: 'none', boxSizing: 'border-box' }} />
              <span style={{ display: 'block', marginTop: 4, fontSize: 11, color: '#94a3b8' }}>Sundays and holidays already excluded.</span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, paddingTop: 2 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}><input type="checkbox" checked={applyLop} onChange={e => setApplyLop(e.target.checked)} /> Apply LOP based on attendance</label>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}><input type="checkbox" checked={includeAdvance} onChange={e => setIncludeAdvance(e.target.checked)} /> Include advance recovery</label>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8' }}><input type="checkbox" disabled /> Send slip via email</label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button onClick={onClose} style={{ height: 40, padding: '0 18px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            <button onClick={() => onGenerate({ workingDays, applyLop, includeAdvance })} style={{ height: 40, padding: '0 20px', borderRadius: 10, border: 'none', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' }}>
              Generate for All {teachersData.length} Staff
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
