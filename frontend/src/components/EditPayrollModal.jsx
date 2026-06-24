import { useMemo, useState } from 'react';
import { Save, X } from 'lucide-react';
import { numberToWords } from './PaySlipModal';

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

export default function EditPayrollModal({ record, teacher, onClose, onSave }) {
  const [form, setForm] = useState({
    workingDays: record.workingDays,
    presentDays: record.presentDays,
    lopDays: record.lopDays,
    basic: record.basic,
    hra: record.hra,
    da: record.da,
    ta: record.ta,
    pf: record.pf,
    esi: record.esi,
    tds: record.tds,
    otherDeduction: record.otherDeduction,
    advanceRecovery: record.advanceRecovery,
    remarks: record.remarks || '',
  });

  const totals = useMemo(() => {
    const gross = Number(form.basic) + Number(form.hra) + Number(form.da) + Number(form.ta);
    const totalDeductions = Number(form.pf) + Number(form.esi) + Number(form.tds) + Number(form.otherDeduction) + Number(form.advanceRecovery);
    return { gross, totalDeductions, netSalary: gross - totalDeductions };
  }, [form]);

  const update = (key, value) => {
    setForm(prev => {
      const next = { ...prev, [key]: key === 'remarks' ? value : Number(value) || 0 };
      if (key === 'workingDays' || key === 'presentDays') {
        next.lopDays = Math.max(0, Number(next.workingDays) - Number(next.presentDays));
      }
      return next;
    });
  };

  const input = { width: '100%', height: 38, border: '1px solid #e2e8f0', borderRadius: 10, padding: '0 10px', fontSize: 13, fontWeight: 700, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };

  return (
    <div style={overlay}>
      <div style={{ width: '100%', maxWidth: 760, maxHeight: '94vh', overflow: 'auto', background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 24px 80px rgba(15,23,42,0.22)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 19, fontWeight: 900, color: '#0f172a' }}>Edit Payroll - {teacher?.name}</h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>{record.month} {record.year}</p>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', color: '#64748b' }}><X size={16} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.9fr', gap: 18 }}>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              {[
                ['workingDays', 'Working Days'],
                ['presentDays', 'Present Days'],
                ['lopDays', 'LOP Days'],
              ].map(([key, label]) => (
                <label key={key} style={{ fontSize: 12, fontWeight: 900, color: '#334155' }}>{label}
                  <input type="number" value={form[key]} onChange={e => update(key, e.target.value)} style={{ ...input, marginTop: 5 }} />
                </label>
              ))}
            </div>

            <div style={{ fontSize: 12, fontWeight: 800, color: '#ef4444', marginBottom: 14 }}>
              LOP Amount: {fmt(form.otherDeduction)}
            </div>

            <Section title="Earnings">
              {[
                ['basic', 'Basic'],
                ['hra', 'HRA'],
                ['da', 'DA'],
                ['ta', 'TA'],
              ].map(([key, label]) => <MoneyInput key={key} label={label} value={form[key]} onChange={v => update(key, v)} input={input} />)}
            </Section>

            <Section title="Deductions">
              {[
                ['pf', 'PF'],
                ['esi', 'ESI'],
                ['tds', 'TDS'],
                ['otherDeduction', 'Other'],
                ['advanceRecovery', 'Advance Recovery'],
              ].map(([key, label]) => <MoneyInput key={key} label={label} value={form[key]} onChange={v => update(key, v)} input={input} />)}
            </Section>

            <label style={{ display: 'block', fontSize: 12, fontWeight: 900, color: '#334155' }}>Remarks
              <textarea value={form.remarks} onChange={e => update('remarks', e.target.value)} rows={2} style={{ ...input, height: 74, paddingTop: 9, resize: 'vertical', marginTop: 5 }} />
            </label>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: 16, alignSelf: 'start' }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#0f172a', marginBottom: 12 }}>Live Preview</div>
            <Preview label="Gross" value={totals.gross} color="#10b981" />
            <Preview label="Total Deductions" value={totals.totalDeductions} color="#ef4444" />
            <Preview label="Net Salary" value={totals.netSalary} color="#0f172a" large />
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, lineHeight: 1.45, marginTop: 10 }}>{numberToWords(totals.netSalary)}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ height: 40, padding: '0 18px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          <button onClick={() => onSave({ ...form, grossEarnings: totals.gross, totalDeductions: totals.totalDeductions, netSalary: totals.netSalary })} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 18px', borderRadius: 10, border: 'none', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' }}>
            <Save size={15} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 900, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase' }}>{title}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>{children}</div>
    </div>
  );
}

function MoneyInput({ label, value, onChange, input }) {
  return (
    <label style={{ fontSize: 12, fontWeight: 900, color: '#334155' }}>{label}
      <input type="number" value={value} onChange={e => onChange(e.target.value)} style={{ ...input, marginTop: 5 }} />
    </label>
  );
}

function Preview({ label, value, color, large }) {
  return (
    <div style={{ padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: large ? 23 : 18, fontWeight: 900, color, marginTop: 3 }}>{fmt(value)}</div>
    </div>
  );
}
