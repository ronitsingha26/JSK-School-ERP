import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Banknote, CheckCircle2, ChevronLeft, ChevronRight, Clock, Download,
  Eye, Pencil, Play, Search, ShieldAlert, TrendingUp, Users, Wallet, X, Zap
} from 'lucide-react';
import EditPayrollModal from '../../components/EditPayrollModal';
import GeneratePayrollModal from '../../components/GeneratePayrollModal';
import MarkAllPaidModal from '../../components/MarkAllPaidModal';
import MarkPaidModal from '../../components/MarkPaidModal';
import PaySlipModal from '../../components/PaySlipModal';
import {
  departments,
  monthsList,
  payrollRecords,
  teacherAttendanceData,
  teachersData,
  getDesignation,
} from '../../data/dummyData';
import PayrollAdvance from './PayrollAdvance';
import PayrollReports from './PayrollReports';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const formatDate = (value) => value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

const StatusPill = ({ status }) => {
  const map = {
    paid: { bg: '#d1fae5', color: '#065f46', label: 'Paid', icon: '✓' },
    pending: { bg: '#fef3c7', color: '#92400e', label: 'Pending', icon: '⏳' },
    processing: { bg: '#dbeafe', color: '#1e40af', label: 'Processing', icon: '↻' },
    'on-hold': { bg: '#fee2e2', color: '#991b1b', label: 'On Hold', icon: '!' },
  };
  const item = map[status] || map.pending;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: item.bg, color: item.color, fontSize: 11, fontWeight: 700, borderRadius: 999, padding: '4px 10px', whiteSpace: 'nowrap' }}>
      <span>{item.icon}</span>{item.label}
    </span>
  );
};

const Avatar = ({ teacher }) => (
  <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${teacher?.avatarColor || '#64748b'}22`, color: teacher?.avatarColor || '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>
    {teacher?.avatar || 'ST'}
  </div>
);

const SkeletonRow = () => (
  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
    {[32, 230, 100, 120, 110, 100, 110, 110, 110, 120].map((width, index) => (
      <td key={index} style={{ padding: '16px' }}>
        <div style={{ width, height: 14, borderRadius: 999, background: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)', backgroundSize: '400% 100%', animation: 'shimmer 1.4s infinite' }} />
      </td>
    ))}
  </tr>
);

export default function Payroll() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [payroll, setPayroll] = useState(payrollRecords);
  const [selectedMonth, setSelectedMonth] = useState('May');
  const [selectedYear] = useState(2026);
  const [activeTab, setActiveTab] = useState('payroll');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ department: '', status: '', employment: '' });
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showMarkAllModal, setShowMarkAllModal] = useState(false);
  const [markPaidTarget, setMarkPaidTarget] = useState(null);
  const [slipTarget, setSlipTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const selectedMonthIndex = monthsList.findIndex(m => m.name === selectedMonth);
  const monthPayroll = useMemo(() => payroll.filter(r => r.month === selectedMonth && r.year === selectedYear), [payroll, selectedMonth, selectedYear]);
  const enrichedPayroll = useMemo(() => monthPayroll.map(record => ({ ...record, teacher: teachersData.find(t => t.id === record.teacherId) })), [monthPayroll]);
  const filteredPayroll = useMemo(() => enrichedPayroll.filter(record => {
    const q = searchQuery.toLowerCase().trim();
    const teacher = record.teacher;
    const matchSearch = !q || teacher?.name.toLowerCase().includes(q) || teacher?.empId.toLowerCase().includes(q);
    const matchDept = !filters.department || String(teacher?.departmentId) === filters.department;
    const matchStatus = !filters.status || record.status === filters.status;
    const matchEmployment = !filters.employment || teacher?.employmentType === filters.employment;
    return matchSearch && matchDept && matchStatus && matchEmployment;
  }), [enrichedPayroll, filters, searchQuery]);

  const stats = useMemo(() => {
    const pendingRecords = monthPayroll.filter(r => ['pending', 'processing'].includes(r.status));
    return {
      totalStaff: monthPayroll.length,
      totalGross: monthPayroll.reduce((sum, r) => sum + r.grossEarnings, 0),
      totalNet: monthPayroll.reduce((sum, r) => sum + r.netSalary, 0),
      totalDeductions: monthPayroll.reduce((sum, r) => sum + r.totalDeductions, 0),
      pendingCount: pendingRecords.length,
      pendingAmount: pendingRecords.reduce((sum, r) => sum + r.netSalary, 0),
      paidCount: monthPayroll.filter(r => r.status === 'paid').length,
      onHoldCount: monthPayroll.filter(r => r.status === 'on-hold').length,
    };
  }, [monthPayroll]);

  const pendingPayableRecords = enrichedPayroll.filter(r => ['pending', 'processing'].includes(r.status));

  const goMonth = (direction) => {
    const next = (selectedMonthIndex + direction + monthsList.length) % monthsList.length;
    setSelectedMonth(monthsList[next].name);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilters({ department: '', status: '', employment: '' });
  };

  const generatePayroll = ({ workingDays, applyLop }) => {
    const monthPrefix = `${selectedYear}-${String(selectedMonthIndex + 1).padStart(2, '0')}`;
    const nextId = Math.max(0, ...payroll.map(r => r.id)) + 1;
    const newRecords = teachersData.map((teacher, index) => {
      const attendance = teacherAttendanceData.filter(a => a.teacherId === teacher.id && a.date.startsWith(monthPrefix));
      const presentCount = attendance.filter(a => a.status === 'present').length;
      const presentDays = applyLop && attendance.length ? Math.min(workingDays, presentCount) : workingDays;
      const lopDays = Math.max(0, workingDays - presentDays);
      const gross = teacher.basicSalary + teacher.hra + teacher.da + teacher.ta;
      const lopAmount = applyLop ? Math.round((gross / workingDays) * lopDays) : 0;
      const adjustedGross = Math.max(0, gross - lopAmount);
      const pf = Math.round(teacher.basicSalary * 0.12);
      const totalDeductions = pf + teacher.esi + teacher.tds + lopAmount;
      return {
        id: nextId + index, teacherId: teacher.id, month: selectedMonth, year: selectedYear,
        workingDays, presentDays, lopDays, basic: teacher.basicSalary, hra: teacher.hra, da: teacher.da, ta: teacher.ta,
        grossEarnings: adjustedGross, pf, esi: teacher.esi, tds: teacher.tds, otherDeduction: lopAmount,
        totalDeductions, netSalary: adjustedGross - totalDeductions, advanceRecovery: 0,
        status: teacher.status === 'on-leave' ? 'on-hold' : 'pending', paidOn: null, paidMode: '',
        remarks: lopDays > 0 ? `LOP applied: ${lopDays} days` : '',
      };
    });
    setPayroll(prev => [...prev, ...newRecords]);
    setShowGenerateModal(false);
    toast.success(`Payroll generated for ${teachersData.length} staff members!`);
  };

  const handleMarkPaid = (recordId, data) => {
    setPayroll(prev => prev.map(record => record.id === recordId ? { ...record, status: 'paid', paidOn: data.paidOn, paidMode: data.paidMode, remarks: data.remarks, transactionRef: data.transactionRef } : record));
    toast.success(`Payment marked for ${markPaidTarget?.teacher?.name}!`);
    setMarkPaidTarget(null);
  };

  const handleMarkAllPaid = (data) => {
    const count = pendingPayableRecords.length;
    setPayroll(prev => prev.map(record => (
      record.month === selectedMonth && record.year === selectedYear && ['pending', 'processing'].includes(record.status)
        ? { ...record, status: 'paid', paidOn: data.paidOn, paidMode: data.paidMode, remarks: data.remarks }
        : record
    )));
    toast.success(`${count} salary payments marked as paid!`);
    setShowMarkAllModal(false);
  };

  const handleEditSave = (recordId, updatedData) => {
    setPayroll(prev => prev.map(record => record.id === recordId ? { ...record, ...updatedData } : record));
    toast.success('Payroll record updated!');
    setEditTarget(null);
  };

  const releaseHold = (recordId) => {
    setPayroll(prev => prev.map(record => record.id === recordId ? { ...record, status: 'pending', remarks: 'Released from hold' } : record));
    toast.success('Payroll record released!');
  };

  const banner = getBanner(monthPayroll, stats, selectedMonth, selectedYear);
  const inputStyle = { height: 40, border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff', padding: '0 12px', fontSize: 13, fontWeight: 600, color: '#475569', outline: 'none', fontFamily: 'inherit' };

  if (activeTab === 'advance') return <PageShell activeTab={activeTab} setActiveTab={setActiveTab}><PayrollAdvance /></PageShell>;
  if (activeTab === 'reports') return <PageShell activeTab={activeTab} setActiveTab={setActiveTab}><PayrollReports payroll={payroll} /></PageShell>;

  return (
    <div style={{ paddingBottom: 40, minWidth: 0 }}>
      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .payroll-row:hover { background: #f8fafc; }
        .payroll-row .payroll-actions { opacity: 0; }
        .payroll-row:hover .payroll-actions { opacity: 1; }
      `}</style>

      <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, marginBottom: 8 }}>JSK ERP / Payroll Management</div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 }}>Payroll Management</h1>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 4, fontWeight: 500 }}>Process and manage staff salaries · Academic Year 2025-26</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: 999, background: '#fff', overflow: 'hidden' }}>
            <button onClick={() => goMonth(-1)} style={monthNavButton}><ChevronLeft size={16} /></button>
            <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} style={{ ...inputStyle, border: 'none', height: 36, borderRadius: 0, cursor: 'pointer' }}>
              {monthsList.map(month => <option key={month.id} value={month.name}>{month.name} {selectedYear}</option>)}
            </select>
            <button onClick={() => goMonth(1)} style={monthNavButton}><ChevronRight size={16} /></button>
          </div>
          <button onClick={() => monthPayroll.length ? toast.success('Payroll already generated!') : setShowGenerateModal(true)} style={primaryButton(monthPayroll.length ? '#10b981' : '#2563eb')}>
            {monthPayroll.length ? <CheckCircle2 size={15} /> : <Zap size={15} />}{monthPayroll.length ? 'Payroll Generated' : 'Generate Payroll'}
          </button>
          <button onClick={() => toast.success('Excel exported!')} style={outlineButton}><Download size={15} /> Export</button>
        </div>
      </div>

      <PayrollTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={{ background: banner.bg, borderLeft: `4px solid ${banner.border}`, borderRadius: 14, padding: '16px 18px', marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: banner.color }}>{banner.title}</div>
          <div style={{ fontSize: 13, color: banner.color, opacity: 0.82, marginTop: 3 }}>{banner.body}</div>
        </div>
        <button onClick={() => {
          if (!monthPayroll.length) setShowGenerateModal(true);
          else if (stats.paidCount === monthPayroll.length) toast.success('Summary report ready!');
          else setShowMarkAllModal(true);
        }} style={{ border: 'none', background: '#fff', color: banner.color, borderRadius: 10, padding: '9px 14px', fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
          {banner.action}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 18 }}>
        {[
          { label: 'Total Staff', value: stats.totalStaff, sub: 'All departments', icon: Users, color: '#3b82f6', bg: '#dbeafe' },
          { label: 'Gross Payroll', value: fmt(stats.totalGross), sub: 'Before deductions', icon: TrendingUp, color: '#10b981', bg: '#d1fae5' },
          { label: 'Net Payable', value: fmt(stats.totalNet), sub: 'After all deductions', icon: Wallet, color: '#8b5cf6', bg: '#ede9fe' },
          { label: 'Pending Payment', value: stats.pendingCount, sub: `${fmt(stats.pendingAmount)} remaining`, icon: Clock, color: '#f59e0b', bg: '#fef3c7' },
          { label: 'Total Deductions', value: fmt(stats.totalDeductions), sub: 'PF + TDS + Other', icon: ShieldAlert, color: '#ef4444', bg: '#fee2e2' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderTop: `4px solid ${card.color}`, borderRadius: 14, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: card.bg, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={20} /></div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{card.value}</div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', marginTop: 5, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{card.label}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginTop: 10 }}>{card.sub}</div>
            </div>
          );
        })}
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', minWidth: 240, flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name, Emp ID..." style={{ ...inputStyle, width: '100%', paddingLeft: 36 }} />
        </div>
        <select value={filters.department} onChange={e => setFilters(prev => ({ ...prev, department: e.target.value }))} style={inputStyle}>
          <option value="">All Departments</option>{departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
        </select>
        <select value={filters.status} onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))} style={inputStyle}>
          <option value="">All Status</option><option value="paid">Paid</option><option value="pending">Pending</option><option value="processing">Processing</option><option value="on-hold">On Hold</option>
        </select>
        <select value={filters.employment} onChange={e => setFilters(prev => ({ ...prev, employment: e.target.value }))} style={inputStyle}>
          <option value="">All Employment</option><option value="Permanent">Permanent</option><option value="Contract">Contract</option>
        </select>
        <button onClick={() => setShowMarkAllModal(true)} disabled={!pendingPayableRecords.length} style={{ height: 40, border: '1px solid #10b981', borderRadius: 10, background: '#fff', color: pendingPayableRecords.length ? '#059669' : '#94a3b8', fontSize: 13, fontWeight: 800, padding: '0 13px', cursor: pendingPayableRecords.length ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>Mark All Paid</button>
        <button onClick={resetFilters} style={{ display: 'flex', alignItems: 'center', gap: 5, height: 40, border: 'none', background: 'transparent', color: '#2563eb', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}><X size={14} /> Reset</button>
      </div>

      <PayrollTable
        loading={loading}
        filteredPayroll={filteredPayroll}
        navigate={navigate}
        setMarkPaidTarget={setMarkPaidTarget}
        setSlipTarget={setSlipTarget}
        setEditTarget={setEditTarget}
        releaseHold={releaseHold}
      />

      <MonthlySummary departments={departments} enrichedPayroll={enrichedPayroll} stats={stats} selectedMonth={selectedMonth} selectedYear={selectedYear} />

      {showGenerateModal && <GeneratePayrollModal month={selectedMonth} year={selectedYear} defaultWorkingDays={selectedMonth === 'May' ? 27 : 26} onClose={() => setShowGenerateModal(false)} onGenerate={generatePayroll} />}
      {markPaidTarget && <MarkPaidModal record={markPaidTarget} teacher={markPaidTarget.teacher} month={selectedMonth} year={selectedYear} onClose={() => setMarkPaidTarget(null)} onConfirm={(data) => handleMarkPaid(markPaidTarget.id, data)} />}
      {showMarkAllModal && <MarkAllPaidModal records={pendingPayableRecords} month={selectedMonth} year={selectedYear} onClose={() => setShowMarkAllModal(false)} onConfirm={handleMarkAllPaid} />}
      {slipTarget && <PaySlipModal record={slipTarget} teacher={slipTarget.teacher} onClose={() => setSlipTarget(null)} />}
      {editTarget && <EditPayrollModal record={editTarget} teacher={editTarget.teacher} onClose={() => setEditTarget(null)} onSave={(updatedData) => handleEditSave(editTarget.id, updatedData)} />}
    </div>
  );
}

function PayrollTable({ loading, filteredPayroll, navigate, setMarkPaidTarget, setSlipTarget, setEditTarget, releaseHold }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1120 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['#', 'Employee', 'Emp ID', 'Designation', 'Working Days', 'Gross', 'Deductions', 'Net Salary', 'Status', 'Actions'].map(head => (
                <th key={head} style={{ padding: '13px 16px', textAlign: 'left', fontSize: 11, color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 8 }).map((_, index) => <SkeletonRow key={index} />)}
            {!loading && filteredPayroll.map((record, index) => {
              const teacher = record.teacher;
              const designation = getDesignation(teacher?.designationId);
              return (
                <tr key={record.id} className="payroll-row" style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}>
                  <td style={tdMuted}>{index + 1}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={() => teacher && navigate(`/teacher/${teacher.id}`)} style={{ display: 'flex', alignItems: 'center', gap: 10, border: 'none', background: 'transparent', padding: 0, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}>
                      <Avatar teacher={teacher} />
                      <span><span style={{ display: 'block', fontSize: 13, color: '#0f172a', fontWeight: 800 }}>{teacher?.name || 'Unknown'}</span><span style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{teacher?.email || '-'}</span></span>
                    </button>
                  </td>
                  <td style={{ padding: '14px 16px' }}><span style={{ background: '#dbeafe', color: '#1e40af', fontSize: 11, fontWeight: 800, borderRadius: 999, padding: '3px 9px', fontFamily: 'monospace' }}>{teacher?.empId || '-'}</span></td>
                  <td style={{ padding: '14px 16px' }}><span style={{ border: '1px solid #e2e8f0', color: '#475569', fontSize: 11, fontWeight: 800, borderRadius: 999, padding: '3px 9px' }}>{designation?.short || '-'}</span></td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#334155', fontWeight: 700 }}>{record.presentDays} / {record.workingDays} days{record.lopDays > 0 && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 3 }}>LOP: {record.lopDays} days</div>}</td>
                  <td style={tdStrong}>{fmt(record.grossEarnings)}</td>
                  <td title={`PF: ${fmt(record.pf)} | TDS: ${fmt(record.tds)} | Other: ${fmt(record.otherDeduction)}`} style={{ padding: '14px 16px', fontSize: 13, color: '#ef4444', fontWeight: 700 }}>{fmt(record.totalDeductions)}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#10b981', fontWeight: 900 }}>{fmt(record.netSalary)}</td>
                  <td style={{ padding: '14px 16px' }}><StatusPill status={record.status} />{record.paidOn && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>Paid on {formatDate(record.paidOn)}</div>}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div className="payroll-actions" style={{ display: 'flex', gap: 6, transition: 'opacity 0.15s' }}>
                      {['pending', 'processing'].includes(record.status) && <button onClick={() => setMarkPaidTarget(record)} title="Mark Paid" style={iconButton('#059669')}><Wallet size={14} /></button>}
                      <button onClick={() => setSlipTarget(record)} title="View Slip" style={iconButton('#1e40af')}><Eye size={14} /></button>
                      <button onClick={() => setEditTarget(record)} title="Edit" style={iconButton('#475569')}><Pencil size={14} /></button>
                      {record.status === 'on-hold' && <button onClick={() => releaseHold(record.id)} title="Release" style={iconButton('#7c3aed')}><Play size={14} /></button>}
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && filteredPayroll.length === 0 && (
              <tr><td colSpan={10} style={{ padding: '46px 20px', textAlign: 'center' }}><Banknote size={48} color="#d1d5db" style={{ margin: '0 auto 12px' }} /><div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>No payroll records for this month</div><div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Generate payroll to create records for all staff.</div></td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#64748b', fontWeight: 700, borderTop: '1px solid #f1f5f9' }}>
        <span>Showing {filteredPayroll.length ? 1 : 0}-{filteredPayroll.length} of {filteredPayroll.length} records</span><span>Prev / Next</span>
      </div>
    </div>
  );
}

function MonthlySummary({ departments, enrichedPayroll, stats, selectedMonth, selectedYear }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginTop: 18 }}>
      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>Monthly Summary - {selectedMonth} {selectedYear}</h3>
      <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 14px', fontWeight: 600 }}>Department-wise payroll breakdown</p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
          <thead><tr>{['Department', 'Staff', 'Gross', 'Deductions', 'Net', 'Status'].map(head => <th key={head} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase' }}>{head}</th>)}</tr></thead>
          <tbody>
            {departments.map(dept => {
              const records = enrichedPayroll.filter(r => r.teacher?.departmentId === dept.id);
              if (!records.length) return null;
              const pending = records.filter(r => r.status !== 'paid').length;
              return (
                <tr key={dept.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={summaryCellStrong}>{dept.name}</td><td style={summaryCell}>{records.length}</td>
                  <td style={summaryCell}>{fmt(records.reduce((s, r) => s + r.grossEarnings, 0))}</td>
                  <td style={{ ...summaryCell, color: '#ef4444' }}>{fmt(records.reduce((s, r) => s + r.totalDeductions, 0))}</td>
                  <td style={{ ...summaryCell, color: '#10b981', fontWeight: 900 }}>{fmt(records.reduce((s, r) => s + r.netSalary, 0))}</td>
                  <td style={{ ...summaryCell, color: pending ? '#f59e0b' : '#10b981', fontWeight: 800 }}>{pending ? `${pending} Pending` : 'Completed'}</td>
                </tr>
              );
            })}
            <tr style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
              <td style={summaryTotal}>TOTAL</td><td style={summaryTotal}>{stats.totalStaff}</td><td style={summaryTotal}>{fmt(stats.totalGross)}</td><td style={{ ...summaryTotal, color: '#ef4444' }}>{fmt(stats.totalDeductions)}</td><td style={{ ...summaryTotal, color: '#10b981' }}>{fmt(stats.totalNet)}</td><td style={summaryTotal}>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PageShell({ activeTab, setActiveTab, children }) {
  return (
    <div style={{ paddingBottom: 40, minWidth: 0 }}>
      <PayrollTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {children}
    </div>
  );
}

function PayrollTabs({ activeTab, setActiveTab }) {
  const tabs = [{ key: 'payroll', label: 'Monthly Payroll' }, { key: 'advance', label: 'Advance Management' }, { key: 'reports', label: 'Reports' }];
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 18, background: '#f1f5f9', padding: 4, borderRadius: 14, width: 'fit-content' }}>
      {tabs.map(tab => {
        const active = activeTab === tab.key;
        return <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '9px 18px', borderRadius: 10, border: active ? '1px solid #1e40af' : '1px solid transparent', background: active ? '#eff6ff' : 'transparent', color: active ? '#1e40af' : '#64748b', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>{tab.label}</button>;
      })}
    </div>
  );
}

function getBanner(monthPayroll, stats, month, year) {
  if (!monthPayroll.length) return { bg: '#eff6ff', border: '#3b82f6', color: '#1e40af', title: 'Payroll not generated for this month', body: 'Click Generate Payroll to auto-create salary records for all staff.', action: 'Generate Now' };
  if (stats.paidCount === monthPayroll.length) return { bg: '#d1fae5', border: '#10b981', color: '#065f46', title: `${month} ${year} Payroll - COMPLETED`, body: `All ${monthPayroll.length} staff members paid successfully.`, action: 'View Summary Report' };
  return { bg: '#fef3c7', border: '#f59e0b', color: '#92400e', title: `${month} ${year} Payroll - IN PROGRESS`, body: `${stats.pendingCount} pending/processing · ${stats.onHoldCount} on hold · ${stats.paidCount} paid`, action: 'Mark All Paid' };
}

const monthNavButton = { width: 36, height: 36, border: 'none', background: '#fff', cursor: 'pointer', color: '#64748b' };
const outlineButton = { display: 'flex', alignItems: 'center', gap: 8, height: 38, border: '1px solid #e2e8f0', borderRadius: 10, padding: '0 14px', background: '#fff', color: '#475569', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' };
const primaryButton = (bg) => ({ display: 'flex', alignItems: 'center', gap: 8, height: 38, border: 'none', borderRadius: 10, padding: '0 14px', background: bg, color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' });
const tdMuted = { padding: '14px 16px', color: '#94a3b8', fontSize: 13, fontWeight: 700 };
const tdStrong = { padding: '14px 16px', fontSize: 13, color: '#0f172a', fontWeight: 700 };
const summaryCell = { padding: '12px', fontSize: 13, color: '#475569', fontWeight: 700 };
const summaryCellStrong = { padding: '12px', fontSize: 13, fontWeight: 800, color: '#0f172a' };
const summaryTotal = { padding: '12px', fontSize: 13, fontWeight: 900, color: '#0f172a' };
function iconButton(color) {
  return { width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', color, cursor: 'pointer' };
}
