import { Printer, X } from 'lucide-react';
import { getDepartment, getDesignation } from '../data/dummyData';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const underHundred = (num) => {
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  return `${tens[Math.floor(num / 10)]} ${ones[num % 10]}`.trim();
};

const underThousand = (num) => {
  const hundred = Math.floor(num / 100);
  const rest = num % 100;
  return `${hundred ? `${ones[hundred]} Hundred` : ''} ${rest ? underHundred(rest) : ''}`.trim();
};

export const numberToWords = (num) => {
  const value = Math.round(Number(num || 0));
  if (value === 0) return 'Zero Only';
  const lakh = Math.floor(value / 100000);
  const thousand = Math.floor((value % 100000) / 1000);
  const rest = value % 1000;
  return [
    lakh ? `${underThousand(lakh)} Lakh` : '',
    thousand ? `${underThousand(thousand)} Thousand` : '',
    rest ? underThousand(rest) : '',
    'Only',
  ].filter(Boolean).join(' ');
};

export default function PaySlipModal({ record, teacher, onClose }) {
  const dept = getDepartment(teacher?.departmentId);
  const designation = getDesignation(teacher?.designationId);
  const lopAmount = record?.otherDeduction || 0;

  return (
    <div className="pay-slip-overlay" style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)', padding: 16 }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .pay-slip-overlay { position: static !important; display: block !important; background: white !important; padding: 0 !important; backdrop-filter: none !important; }
          .pay-slip-modal-shell { max-width: none !important; max-height: none !important; overflow: visible !important; box-shadow: none !important; border-radius: 0 !important; }
          .print-slip-root { display: none !important; }
          body { background: white !important; }
          .slip-container { width: 100% !important; max-width: none !important; box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
        }
        .print-slip-root { display: none; }
      `}</style>
      <div className="pay-slip-modal-shell" style={{ width: '100%', maxWidth: 720, maxHeight: '94vh', overflow: 'auto', background: '#fff', borderRadius: 20, boxShadow: '0 24px 80px rgba(15,23,42,0.22)' }}>
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#0f172a' }}>Pay Slip - {record.month} {record.year}</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: 7, height: 36, padding: '0 12px', borderRadius: 10, border: '1px solid #bfdbfe', background: '#eff6ff', color: '#1e40af', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}><Printer size={15} /> Print</button>
            <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', color: '#64748b' }}><X size={16} /></button>
          </div>
        </div>

        <SlipContent record={record} teacher={teacher} dept={dept} designation={designation} lopAmount={lopAmount} />
      </div>
      <div className="print-slip-root">
        <SlipContent record={record} teacher={teacher} dept={dept} designation={designation} lopAmount={lopAmount} />
      </div>
    </div>
  );
}

function SlipContent({ record, teacher, dept, designation, lopAmount }) {
  const row = (label, value, color = '#0f172a') => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '7px 0', borderBottom: '1px solid #f1f5f9', fontSize: 13 }}>
      <span style={{ color: '#64748b', fontWeight: 700 }}>{label}</span>
      <span style={{ color, fontWeight: 900 }}>{value}</span>
    </div>
  );

  return (
    <div className="slip-container" style={{ margin: 20, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
      <div style={{ textAlign: 'center', padding: 20, borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>JSK EDUCATIONAL & SOCIAL WELFARE FOUNDATION</div>
        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginTop: 4 }}>Pratapganj, Bhagalpur, Bihar - 813105</div>
        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginTop: 2 }}>9876500000 | jsk@jskeducation.com</div>
      </div>

      <div style={{ textAlign: 'center', padding: 14, borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', letterSpacing: '0.08em' }}>SALARY SLIP</div>
        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 700, marginTop: 3 }}>For the Month of {record.month} {record.year}</div>
      </div>

      <div style={{ padding: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 22px', marginBottom: 14 }}>
          {row('Employee Name', teacher?.name)}
          {row('Employee ID', teacher?.empId)}
          {row('Designation', designation?.name)}
          {row('Department', dept?.name)}
          {row('Date of Joining', fmtDate(teacher?.joinDate))}
          {row('Bank Account', `XXXXX${String(teacher?.accountNo || '').slice(-4)} | ${teacher?.bankName || '-'}`)}
        </div>

        <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12, fontSize: 13, fontWeight: 800, color: '#334155', marginBottom: 14 }}>
          Working Days: {record.workingDays} | Present: {record.presentDays} | LOP Days: {record.lopDays}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 900, color: '#10b981', marginBottom: 8, textTransform: 'uppercase' }}>Earnings</div>
            {row('Basic Salary', fmt(record.basic))}
            {row('HRA', fmt(record.hra))}
            {row('DA', fmt(record.da))}
            {row('Transport', fmt(record.ta))}
            {row('Gross Earnings', fmt(record.grossEarnings), '#10b981')}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 900, color: '#ef4444', marginBottom: 8, textTransform: 'uppercase' }}>Deductions</div>
            {row('Provident Fund (PF)', fmt(record.pf))}
            {row('ESI', fmt(record.esi))}
            {row('TDS', fmt(record.tds))}
            {row('LOP / Other', fmt(lopAmount))}
            {row('Total Deductions', fmt(record.totalDeductions), '#ef4444')}
          </div>
        </div>

        <div style={{ textAlign: 'center', background: '#ecfdf5', borderRadius: 12, padding: 16, marginTop: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#047857' }}>NET SALARY PAYABLE</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#065f46', marginTop: 4 }}>{fmt(record.netSalary)}</div>
          <div style={{ fontSize: 12, color: '#047857', fontWeight: 700, marginTop: 3 }}>({numberToWords(record.netSalary)})</div>
        </div>

        <div style={{ fontSize: 13, fontWeight: 800, color: '#334155', marginTop: 16 }}>
          Payment Status: {record.status === 'paid'
            ? `PAID on ${fmtDate(record.paidOn)} via ${record.paidMode || '-'}`
            : `${record.status.toUpperCase()} - Not yet disbursed`}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 52, fontSize: 12, color: '#64748b', fontWeight: 800 }}>
          <span>Receiver's Signature</span>
          <span>Authorized Signatory</span>
        </div>
        <div style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 22 }}>This is a computer generated slip. No signature required. | JSK ERP v2.0</div>
      </div>
    </div>
  );
}
