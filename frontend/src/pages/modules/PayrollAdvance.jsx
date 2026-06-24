import { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Eye, Pencil, Plus, X } from 'lucide-react';
import { advanceRecords, teachersData } from '../../data/dummyData';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export default function PayrollAdvance() {
  const [advances, setAdvances] = useState(advanceRecords);
  const [showModal, setShowModal] = useState(false);

  const enriched = useMemo(() => advances.map(a => ({ ...a, teacher: teachersData.find(t => t.id === a.teacherId) })), [advances]);
  const active = enriched.filter(a => a.status === 'active');

  const saveAdvance = (data) => {
    const amount = Number(data.amount);
    const perMonth = Number(data.recoveryPerMonth);
    const teacher = teachersData.find(t => t.id === Number(data.teacherId));
    setAdvances(prev => [...prev, {
      id: Math.max(0, ...prev.map(a => a.id)) + 1,
      teacherId: Number(data.teacherId),
      amount,
      givenDate: data.givenDate,
      reason: data.reason,
      recoveryPerMonth: perMonth,
      recoveredSoFar: 0,
      remainingAmount: amount,
      status: 'active',
    }]);
    setShowModal(false);
    toast.success(`Advance of ${fmt(amount)} given to ${teacher?.name}`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 }}>Advance Management</h1>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 4, fontWeight: 500 }}>Salary advances given to staff and recovery tracking</p>
        </div>
        <button onClick={() => setShowModal(true)} style={primaryButton}><Plus size={16} /> Give New Advance</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 18 }}>
        <Stat label="Total Active Advances" value={active.length} color="#2563eb" />
        <Stat label="Total Advance Amount" value={fmt(active.reduce((s, a) => s + a.amount, 0))} color="#10b981" />
        <Stat label="Remaining Recovery" value={fmt(active.reduce((s, a) => s + a.remainingAmount, 0))} color="#f59e0b" />
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 920 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Employee', 'Amount', 'Given Date', 'Reason', 'Per Month', 'Recovered', 'Remaining', 'Status', 'Actions'].map(h => <th key={h} style={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {enriched.map(row => (
                <tr key={row.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={tdStrong}>{row.teacher?.name}</td>
                  <td style={td}>{fmt(row.amount)}</td>
                  <td style={td}>{fmtDate(row.givenDate)}</td>
                  <td style={td}>{row.reason}</td>
                  <td style={td}>{fmt(row.recoveryPerMonth)}/month</td>
                  <td style={td}>{fmt(row.recoveredSoFar)}</td>
                  <td style={{ ...td, color: '#ef4444', fontWeight: 800 }}>{fmt(row.remainingAmount)}</td>
                  <td style={td}><Status status={row.status} /></td>
                  <td style={td}><div style={{ display: 'flex', gap: 6 }}><IconButton><Eye size={14} /></IconButton>{row.status === 'active' && <IconButton><Pencil size={14} /></IconButton>}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <AdvanceModal onClose={() => setShowModal(false)} onSave={saveAdvance} />}
    </div>
  );
}

function AdvanceModal({ onClose, onSave }) {
  const [form, setForm] = useState({ teacherId: teachersData[0]?.id || '', amount: '', givenDate: new Date().toISOString().split('T')[0], reason: '', recoveryPerMonth: '' });
  const months = form.amount && form.recoveryPerMonth ? Math.ceil(Number(form.amount) / Number(form.recoveryPerMonth)) : 0;
  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const input = { width: '100%', height: 40, border: '1px solid #e2e8f0', borderRadius: 10, padding: '0 12px', fontSize: 13, fontWeight: 600, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 460, background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 24px 80px rgba(15,23,42,0.22)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div><h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#0f172a' }}>Give New Advance</h3><p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Create a salary advance record.</p></div>
          <button onClick={onClose} style={closeBtn}><X size={16} /></button>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          <label style={label}>Select Employee *<select value={form.teacherId} onChange={e => update('teacherId', e.target.value)} style={{ ...input, marginTop: 6 }}>{teachersData.map(t => <option key={t.id} value={t.id}>{t.name} - {t.empId}</option>)}</select></label>
          <label style={label}>Advance Amount *<input type="number" value={form.amount} onChange={e => update('amount', e.target.value)} style={{ ...input, marginTop: 6 }} /></label>
          <label style={label}>Given Date *<input type="date" value={form.givenDate} onChange={e => update('givenDate', e.target.value)} style={{ ...input, marginTop: 6 }} /></label>
          <label style={label}>Reason *<textarea value={form.reason} onChange={e => update('reason', e.target.value)} rows={2} style={{ ...input, height: 74, paddingTop: 9, marginTop: 6 }} /></label>
          <label style={label}>Recovery Per Month *<input type="number" value={form.recoveryPerMonth} onChange={e => update('recoveryPerMonth', e.target.value)} style={{ ...input, marginTop: 6 }} />{months > 0 && <span style={{ display: 'block', fontSize: 11, color: '#10b981', marginTop: 5 }}>Will be recovered in {months} months</span>}</label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
          <button onClick={onClose} style={secondaryBtn}>Cancel</button>
          <button onClick={() => onSave(form)} style={primaryButton}>Save Advance</button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderTop: `4px solid ${color}`, borderRadius: 14, padding: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}><div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>{value}</div><div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', marginTop: 5 }}>{label}</div></div>;
}
function Status({ status }) {
  const active = status === 'active';
  return <span style={{ background: active ? '#d1fae5' : '#f1f5f9', color: active ? '#065f46' : '#64748b', borderRadius: 999, padding: '4px 10px', fontSize: 11, fontWeight: 900, textTransform: 'uppercase' }}>{status}</span>;
}
function IconButton({ children }) {
  return <button style={{ width: 32, height: 32, border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{children}</button>;
}

const th = { padding: '13px 16px', textAlign: 'left', fontSize: 11, color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' };
const td = { padding: '13px 16px', fontSize: 13, color: '#475569', fontWeight: 700 };
const tdStrong = { ...td, color: '#0f172a', fontWeight: 900 };
const label = { fontSize: 13, fontWeight: 800, color: '#334155' };
const closeBtn = { width: 34, height: 34, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', color: '#64748b' };
const primaryButton = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 40, padding: '0 16px', borderRadius: 10, border: 'none', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' };
const secondaryBtn = { height: 40, padding: '0 18px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' };
