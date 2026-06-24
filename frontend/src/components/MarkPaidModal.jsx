import { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const today = () => new Date().toISOString().split('T')[0];

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

export default function MarkPaidModal({ record, teacher, month, year, onClose, onConfirm }) {
  const [paidOn, setPaidOn] = useState(today());
  const [paidMode, setPaidMode] = useState('Bank Transfer');
  const [transactionRef, setTransactionRef] = useState('');
  const [remarks, setRemarks] = useState(record?.remarks || '');

  const input = { width: '100%', height: 40, border: '1px solid #e2e8f0', borderRadius: 10, padding: '0 12px', fontSize: 13, fontWeight: 600, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };

  return (
    <div style={overlay}>
      <div style={{ width: '100%', maxWidth: 460, background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 24px 80px rgba(15,23,42,0.22)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0f172a' }}>Mark as Paid</h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Record payment for {teacher?.name}</p>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', color: '#64748b' }}><X size={16} /></button>
        </div>

        <div style={{ background: '#eff6ff', borderRadius: 14, padding: 14, marginBottom: 16 }}>
          {[
            ['Employee', teacher?.name],
            ['EMP ID', teacher?.empId],
            ['Month', `${month} ${year}`],
            ['Net Salary', fmt(record?.netSalary)],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13, marginBottom: 7 }}>
              <span style={{ color: '#64748b', fontWeight: 700 }}>{label}</span>
              <span style={{ color: '#0f172a', fontWeight: 900 }}>{value}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <label style={{ fontSize: 13, fontWeight: 800, color: '#334155' }}>Payment Date *
            <input type="date" value={paidOn} onChange={e => setPaidOn(e.target.value)} style={{ ...input, marginTop: 6 }} />
          </label>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#334155', marginBottom: 7 }}>Payment Mode *</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['Bank Transfer', 'Cash', 'Cheque'].map(mode => (
                <button key={mode} onClick={() => setPaidMode(mode)} style={{ flex: 1, minWidth: 110, height: 38, borderRadius: 10, border: `1px solid ${paidMode === mode ? '#10b981' : '#e2e8f0'}`, background: paidMode === mode ? '#ecfdf5' : '#fff', color: paidMode === mode ? '#047857' : '#475569', fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>{mode}</button>
              ))}
            </div>
          </div>
          <label style={{ fontSize: 13, fontWeight: 800, color: '#334155' }}>Transaction Ref / Cheque No
            <input value={transactionRef} onChange={e => setTransactionRef(e.target.value)} placeholder="Optional" style={{ ...input, marginTop: 6 }} />
          </label>
          <label style={{ fontSize: 13, fontWeight: 800, color: '#334155' }}>Remarks
            <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={2} style={{ ...input, height: 74, paddingTop: 10, resize: 'vertical', marginTop: 6 }} />
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
          <button onClick={onClose} style={{ height: 40, padding: '0 18px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          <button onClick={() => onConfirm({ paidOn, paidMode, remarks, transactionRef })} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 18px', borderRadius: 10, border: 'none', background: '#10b981', color: '#fff', fontSize: 13, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' }}>
            <CheckCircle2 size={15} /> Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}
