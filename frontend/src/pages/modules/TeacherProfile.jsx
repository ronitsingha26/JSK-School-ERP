import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft, Pencil, Printer, UserX, Check, X,
  Phone, Mail, MapPin, Droplets, IndianRupee, Calendar,
  IdCard, ChevronLeft, ChevronRight, BookOpen, Users,
  Building2, ClipboardList, Banknote, FileText, Clock
} from 'lucide-react';
import {
  teachersData, teacherAttendanceData, payrollRecords,
  subjects, classes, timetableData, periods,
  departments, designations,
  getDepartment, getDesignation,
} from '../../data/dummyData';

// ──────────────────────────────────────────────
// Shared helpers
// ──────────────────────────────────────────────
const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const fmtJoin = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
};

const calcAge = (dob) => {
  if (!dob) return '—';
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)) + ' years';
};

const StatusBadge = ({ status }) => {
  const map = {
    active:    { bg: '#d1fae5', color: '#065f46', dot: '#10b981', label: 'Active'   },
    'on-leave':{ bg: '#fef3c7', color: '#92400e', dot: '#f59e0b', label: 'On Leave' },
    inactive:  { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444', label: 'Inactive' },
  };
  const s = map[status] || map.inactive;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: s.bg, color: s.color, fontSize: 12, fontWeight: 600,
      borderRadius: 999, padding: '4px 12px',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
      {s.label}
    </span>
  );
};

const InfoRow = ({ icon: Icon, value }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
    <Icon size={15} style={{ color: '#94a3b8', marginTop: 1, flexShrink: 0 }} />
    <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.4 }}>{value || '—'}</span>
  </div>
);

const Pill = ({ label, color, bg }) => (
  <span style={{
    fontSize: 11, fontWeight: 600, borderRadius: 999,
    padding: '3px 10px', background: bg, color,
  }}>{label}</span>
);

const DetailCard = ({ title, children }) => (
  <div style={{ border: '1px solid #f1f5f9', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
    <div style={{ background: '#f8fafc', padding: '10px 16px', fontSize: 12, fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{title}</div>
    <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>{children}</div>
  </div>
);

const DetailField = ({ label, value, fullWidth }) => (
  <div style={{ gridColumn: fullWidth ? '1/-1' : undefined }}>
    <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{label}</div>
    <div style={{ fontSize: 14, fontWeight: 500, color: '#0f172a' }}>{value || '—'}</div>
  </div>
);

// ──────────────────────────────────────────────
// TAB 1 — Personal Details
// ──────────────────────────────────────────────
const TabPersonal = ({ teacher }) => {
  const dept  = getDepartment(teacher.departmentId);
  const desig = getDesignation(teacher.designationId);
  return (
    <div>
      <DetailCard title="Personal Information">
        <DetailField label="Full Name"    value={teacher.name} />
        <DetailField label="Father's Name" value={teacher.fatherName} />
        <DetailField label="Date of Birth" value={fmtDate(teacher.dob)} />
        <DetailField label="Age"           value={calcAge(teacher.dob)} />
        <DetailField label="Gender"        value={teacher.gender} />
        <DetailField label="Blood Group"   value={teacher.bloodGroup} />
        <DetailField label="Religion"      value={teacher.religion} />
        <DetailField label="Category"      value={teacher.category} />
        <DetailField label="Nationality"   value={teacher.nationality} />
      </DetailCard>

      <DetailCard title="Contact Information">
        <DetailField label="Mobile"           value={teacher.mobile} />
        <DetailField label="Alternate Mobile" value={teacher.alternateMobile || '—'} />
        <DetailField label="Email" value={teacher.email} fullWidth />
        <DetailField label="Address" value={teacher.address} fullWidth />
        <DetailField label="City"    value={teacher.city} />
        <DetailField label="State"   value={teacher.state} />
        <DetailField label="PIN Code" value={teacher.pin} />
      </DetailCard>

      <DetailCard title="Professional Details">
        <DetailField label="Employee ID"      value={teacher.empId} />
        <DetailField label="Employment Type"  value={teacher.employmentType} />
        <DetailField label="Designation"      value={desig?.name} />
        <DetailField label="Department"       value={dept?.name} />
        <DetailField label="Qualification"    value={teacher.qualification} />
        <DetailField label="Experience"       value={teacher.experience} />
        <DetailField label="Date of Joining"  value={fmtDate(teacher.joinDate)} />
      </DetailCard>
    </div>
  );
};

// ──────────────────────────────────────────────
// TAB 2 — Timetable
// ──────────────────────────────────────────────
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIOD_IDS = [2, 3, 4, 6, 7, 9, 10]; // Non-break period IDs

const TabTimetable = ({ teacher }) => {
  const teacherSubjects = subjects.filter(s => teacher.subjectIds.includes(s.id));
  const teacherClasses  = classes.filter(c => teacher.classIds.includes(c.id));

  // Build a map: day → periodId → { className, subjectName, color }
  const schedule = {};
  DAYS.forEach(day => { schedule[day] = {}; });

  Object.entries(timetableData).forEach(([key, dayMap]) => {
    const classId = parseInt(key.split('-')[0]);   // "4-1" → 4
    DAYS.forEach(day => {
      if (!dayMap[day]) return;
      Object.entries(dayMap[day]).forEach(([pId, cell]) => {
        if (cell.teacherId === teacher.id) {
          const pid = parseInt(pId);
          const cls = classes.find(c => c.id === classId);
          const sub = subjects.find(s => s.id === cell.subjectId);
          if (!schedule[day][pid]) {
            schedule[day][pid] = {
              className:   cls?.name   || `Class ${classId}`,
              subjectName: sub?.name   || '—',
              color:       sub?.color  || '#94a3b8',
            };
          }
        }
      });
    });
  });


  // Stats
  let totalPeriods = 0;
  DAYS.forEach(d => { totalPeriods += Object.keys(schedule[d]).length; });
  const assignedClasses = [...new Set(
    Object.values(timetableData).flatMap((dayMap) =>
      Object.values(dayMap).flatMap(dayData =>
        Object.values(dayData).filter(c => c.teacherId === teacher.id)
      )
    ).map(c => c.classId)
  )];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Weekly Schedule</h3>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Academic Year 2025-26</p>
        </div>
        <button onClick={() => { toast.success('Schedule ready to print!'); window.print?.(); }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 12, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
          🖨️ Print Schedule
        </button>
      </div>

      {/* Summary chips */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        {[
          { icon: '📅', label: `Total Periods/Week: ${totalPeriods}`, bg: '#dbeafe', color: '#1e40af' },
          { icon: '🏫', label: `Classes: ${teacherClasses.slice(0, 3).map(c => c.name).join(', ')}${teacherClasses.length > 3 ? '...' : ''}`, bg: '#d1fae5', color: '#065f46' },
          { icon: '📚', label: `Subjects: ${teacherSubjects.map(s => s.name).join(', ')}`, bg: '#ede9fe', color: '#5b21b6' },
        ].map((chip, i) => (
          <span key={i} style={{ background: chip.bg, color: chip.color, fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 999 }}>
            {chip.icon} {chip.label}
          </span>
        ))}
      </div>

      {/* Timetable Grid */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '10px 12px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>PERIOD</th>
              {DAYS.map(d => (
                <th key={d} style={{ padding: '10px 12px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textAlign: 'center', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{d.slice(0, 3).toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERIOD_IDS.map(pid => {
              const period = periods.find(p => p.id === pid);
              return (
                <tr key={pid} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{period?.name}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>{period?.startTime}–{period?.endTime}</div>
                  </td>
                  {DAYS.map(day => {
                    const cell = schedule[day][pid];
                    return (
                      <td key={day} style={{ padding: 6, textAlign: 'center' }}>
                        {cell ? (
                          <div style={{
                            borderLeft: `3px solid ${cell.color}`,
                            background: cell.color + '15',
                            borderRadius: 6, padding: '5px 8px', textAlign: 'left',
                          }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>{cell.className}</div>
                            <div style={{ fontSize: 10, color: '#64748b' }}>{cell.subjectName}</div>
                          </div>
                        ) : (
                          <div style={{ border: '1px dashed #e2e8f0', borderRadius: 6, padding: '5px 8px', fontSize: 11, color: '#d1d5db' }}>Free</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPeriods === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
          <Clock size={36} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.4 }} />
          <div style={{ fontSize: 14 }}>No timetable assigned for this teacher yet.</div>
        </div>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────
// TAB 3 — Attendance
// ──────────────────────────────────────────────
const MONTHS = ['January 2026', 'February 2026', 'March 2026', 'April 2026', 'May 2026', 'June 2026'];
const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TabAttendance = ({ teacher }) => {
  const [monthIdx, setMonthIdx] = useState(4); // May 2026 = index 4
  const currentMonthLabel = MONTHS[monthIdx];

  const myAttendance = teacherAttendanceData.filter(a => a.teacherId === teacher.id);

  // Build attendance map for current month
  const attMap = {};
  myAttendance.forEach(a => { attMap[a.date] = a.status; });

  // Calendar grid
  const [year, month] = [2026, monthIdx + 1]; // Jan=1
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Sun
  // Shift to Mon-first
  const startOffset = (firstDay === 0 ? 6 : firstDay - 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const calCells = [];
  for (let i = 0; i < startOffset; i++) calCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calCells.push(d);

  const pad = n => String(n).padStart(2, '0');
  const dateKey = (d) => `${year}-${pad(month)}-${pad(d)}`;

  const statusStyle = {
    present:    { bg: '#d1fae5', color: '#065f46' },
    absent:     { bg: '#fee2e2', color: '#991b1b' },
    'half-day': { bg: '#fef3c7', color: '#92400e' },
    'on-leave': { bg: '#dbeafe', color: '#1e40af' },
  };

  // Summary
  const monthAtt = myAttendance.filter(a => a.date.startsWith(`${year}-${pad(month)}`));
  const summary = {
    present:    monthAtt.filter(a => a.status === 'present').length,
    absent:     monthAtt.filter(a => a.status === 'absent').length,
    'half-day': monthAtt.filter(a => a.status === 'half-day').length,
    'on-leave': monthAtt.filter(a => a.status === 'on-leave').length,
  };

  const dayName = (d) => new Date(year, month - 1, d).toLocaleDateString('en-IN', { weekday: 'long' });

  return (
    <div>
      {/* Month Navigator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => setMonthIdx(i => Math.max(0, i - 1))} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={16} style={{ color: '#374151' }} />
        </button>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', minWidth: 130, textAlign: 'center' }}>{currentMonthLabel}</span>
        <button onClick={() => setMonthIdx(i => Math.min(MONTHS.length - 1, i + 1))} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronRight size={16} style={{ color: '#374151' }} />
        </button>
      </div>

      {/* Summary mini-cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { key: 'present',    icon: '✅', label: 'Present',  bg: '#d1fae5', color: '#065f46' },
          { key: 'absent',     icon: '❌', label: 'Absent',   bg: '#fee2e2', color: '#991b1b' },
          { key: 'half-day',   icon: '🟡', label: 'Half Day', bg: '#fef3c7', color: '#92400e' },
          { key: 'on-leave',   icon: '📋', label: 'On Leave', bg: '#dbeafe', color: '#1e40af' },
        ].map(({ key, icon, label, bg, color }) => (
          <div key={key} style={{ background: bg, borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color }}>{summary[key]}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color, opacity: 0.8 }}>{label} days</div>
          </div>
        ))}
      </div>

      {monthAtt.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8', border: '1px dashed #e2e8f0', borderRadius: 12, marginBottom: 20 }}>
          <ClipboardList size={32} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.4 }} />
          <div style={{ fontSize: 14 }}>No attendance data for {currentMonthLabel}</div>
        </div>
      ) : (
        <>
          {/* Calendar */}
          <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 8 }}>
              {DAY_HEADERS.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#94a3b8', padding: '4px 0' }}>{d}</div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
              {calCells.map((d, i) => {
                if (!d) return <div key={i} />;
                const key = dateKey(d);
                const dow = new Date(year, month - 1, d).getDay(); // 0=Sun
                const isSunday = dow === 0;
                const status = attMap[key];
                const ss = status ? statusStyle[status] : null;
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 36, height: 36, borderRadius: '50%', margin: '0 auto',
                    background: isSunday ? '#f8fafc' : ss ? ss.bg : 'transparent',
                    color: isSunday ? '#d1d5db' : ss ? ss.color : '#374151',
                    fontSize: 13, fontWeight: ss ? 700 : 400, cursor: 'default',
                    border: isSunday ? '1px solid #f1f5f9' : 'none',
                  }}>{d}</div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20, fontSize: 12 }}>
            {[
              { color: '#10b981', label: 'Present'  },
              { color: '#ef4444', label: 'Absent'   },
              { color: '#f59e0b', label: 'Half Day' },
              { color: '#3b82f6', label: 'On Leave' },
            ].map(({ color, label }) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#64748b' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
                {label}
              </span>
            ))}
          </div>

          {/* Detail Table */}
          <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>Attendance Log</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['DATE', 'DAY', 'STATUS', 'REMARK'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textAlign: 'left', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthAtt.sort((a, b) => a.date.localeCompare(b.date)).map(a => {
                const d = new Date(a.date);
                const ss = statusStyle[a.status];
                return (
                  <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px', fontSize: 13, color: '#374151', fontWeight: 500 }}>
                      {d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: 13, color: '#64748b' }}>
                      {d.toLocaleDateString('en-IN', { weekday: 'long' })}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ background: ss?.bg, color: ss?.color, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999 }}>
                        {a.status.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: 13, color: '#94a3b8' }}>—</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────
// TAB 4 — Salary History
// ──────────────────────────────────────────────
const TabSalary = ({ teacher }) => {
  const gross     = (teacher.basicSalary || 0) + (teacher.hra || 0) + (teacher.da || 0) + (teacher.ta || 0);
  const deductions= (teacher.pf || 0) + (teacher.esi || 0) + (teacher.tds || 0);
  const net       = gross - deductions;

  const [history, setHistory] = useState(
    payrollRecords
      .filter(s => s.teacherId === teacher.id)
      .sort((a, b) => b.id - a.id)
  );

  const markPaid = (id) => {
    setHistory(prev => prev.map(h =>
      h.id === id ? { ...h, status: 'paid', paidOn: new Date().toISOString().split('T')[0] } : h
    ));
    toast.success('Salary marked as paid!');
  };

  return (
    <div>
      {/* Current Salary Structure */}
      <div style={{ background: '#eff6ff', borderRadius: 14, padding: 20, marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>Current Salary Structure</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14 }}>
          {[
            { label: 'Basic', value: teacher.basicSalary },
            { label: 'HRA',   value: teacher.hra },
            { label: 'DA',    value: teacher.da },
            { label: 'TA',    value: teacher.ta },
            { label: 'PF',    value: teacher.pf, isDeduction: true },
            { label: 'ESI',   value: teacher.esi, isDeduction: true },
            { label: 'TDS',   value: teacher.tds, isDeduction: true },
            { label: 'Net',   value: net, isNet: true },
          ].map(({ label, value, isDeduction, isNet }) => (
            <div key={label} style={{ background: '#fff', borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: isNet ? '#0f172a' : isDeduction ? '#ef4444' : '#10b981' }}>{fmt(value)}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 20 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>Total Gross</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#10b981' }}>{fmt(gross)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>Net Salary</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>{fmt(net)}</div>
          </div>
        </div>
      </div>

      {/* Salary History Table */}
      <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>Salary History — {teacher.name}</h4>
      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8', border: '1px dashed #e2e8f0', borderRadius: 12 }}>
          No salary records found for this teacher.
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #f1f5f9' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['MONTH', 'GROSS', 'DEDUCTIONS', 'NET', 'STATUS', 'PAID ON', 'ACTION'].map(h => (
                  <th key={h} style={{ padding: '11px 14px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textAlign: 'left', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map(h => (
                <tr key={h.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{h.month} {h.year}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#10b981', fontWeight: 600 }}>{fmt(h.grossEarnings)}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#ef4444', fontWeight: 600 }}>{fmt(h.totalDeductions)}</td>
                  <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{fmt(h.netSalary)}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      background: h.status === 'paid' ? '#d1fae5' : '#fef3c7',
                      color:      h.status === 'paid' ? '#065f46' : '#92400e',
                      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999
                    }}>{h.status === 'paid' ? '✅ Paid' : '⏳ Pending'}</span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748b' }}>
                    {h.paidOn ? fmtDate(h.paidOn) : '—'}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {h.status === 'pending' && (
                      <button onClick={() => markPaid(h.id)} style={{
                        padding: '5px 12px', borderRadius: 7, border: '1px solid #10b981',
                        background: '#fff', color: '#10b981', fontSize: 12, fontWeight: 600, cursor: 'pointer'
                      }}>Mark Paid</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────
// TAB 5 — Documents
// ──────────────────────────────────────────────
const DOC_META = [
  { key: 'photo',       label: 'Profile Photo',     icon: '📷', required: true  },
  { key: 'aadhar',      label: 'Aadhar Card',        icon: '🪪', required: true  },
  { key: 'pan',         label: 'PAN Card',           icon: '💳', required: true  },
  { key: 'degree',      label: 'Degree / Marksheet', icon: '🎓', required: true  },
  { key: 'appointment', label: 'Appointment Letter', icon: '📋', required: false },
  { key: 'cheque',      label: 'Cancelled Cheque',   icon: '🏦', required: true  },
];

const TabDocuments = ({ teacher }) => {
  const docs = teacher.documents || {};
  const uploaded = DOC_META.filter(d => docs[d.key]).length;
  const total    = DOC_META.length;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Document Status</h3>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
            {uploaded}/{total} documents uploaded
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>{Math.round((uploaded / total) * 100)}% Complete</div>
          <div style={{ width: 120, height: 6, background: '#e2e8f0', borderRadius: 99 }}>
            <div style={{ width: `${(uploaded / total) * 100}%`, height: '100%', background: uploaded === total ? '#10b981' : '#f59e0b', borderRadius: 99, transition: 'width 300ms' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {DOC_META.map(doc => {
          const has = docs[doc.key];
          return (
            <div key={doc.key} style={{
              border: `1px solid ${has ? '#86efac' : '#fecaca'}`,
              borderRadius: 14, padding: 18,
              background: has ? '#f0fdf4' : '#fff7f7',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: has ? '#d1fae5' : '#fee2e2',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}>{doc.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{doc.label}</div>
                <div style={{ fontSize: 11, color: doc.required ? '#ef4444' : '#94a3b8', marginTop: 2 }}>
                  {doc.required ? 'Required' : 'Optional'}
                </div>
              </div>
              <div style={{ flexShrink: 0 }}>
                {has ? (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={16} style={{ color: '#10b981' }} />
                  </div>
                ) : (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={16} style={{ color: '#ef4444' }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {uploaded < total && (
        <div style={{ marginTop: 20, background: '#fef3c7', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>Pending Documents</div>
            <div style={{ fontSize: 12, color: '#78350f', marginTop: 2 }}>
              {DOC_META.filter(d => !docs[d.key] && d.required).map(d => d.label).join(', ')} {DOC_META.filter(d => !docs[d.key] && d.required).length > 0 ? 'are required.' : ''}
            </div>
          </div>
          <button onClick={() => toast('Please use Edit Profile to upload documents.', { icon: '📎' })}
            style={{ marginLeft: 'auto', padding: '7px 14px', borderRadius: 8, border: '1px solid #f59e0b', background: '#fff', color: '#92400e', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Upload Now
          </button>
        </div>
      )}

      {uploaded === total && (
        <div style={{ marginTop: 20, background: '#d1fae5', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Check size={20} style={{ color: '#10b981', flexShrink: 0 }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: '#065f46' }}>All documents are uploaded and complete! ✅</div>
        </div>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────
// Mark Inactive Modal
// ──────────────────────────────────────────────
const InactiveModal = ({ teacher, onConfirm, onCancel }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
    <div style={{ background: '#fff', borderRadius: 20, padding: 32, maxWidth: 400, width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
      <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
        <UserX size={26} style={{ color: '#dc2626' }} />
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Mark as Inactive?</h3>
      <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px' }}>
        This will mark <strong>{teacher.name}</strong> as inactive. They will no longer appear as active staff.
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onCancel} style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', color: '#374151' }}>Cancel</button>
        <button onClick={onConfirm} style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: '#dc2626', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Yes, Mark Inactive</button>
      </div>
    </div>
  </div>
);

// ──────────────────────────────────────────────
// MAIN PROFILE COMPONENT
// ──────────────────────────────────────────────
const TABS = [
  { key: 'personal',   label: 'Personal Details', icon: IdCard       },
  { key: 'timetable',  label: 'Timetable',         icon: Calendar     },
  { key: 'attendance', label: 'Attendance',         icon: ClipboardList},
  { key: 'salary',     label: 'Salary History',     icon: Banknote     },
  { key: 'documents',  label: 'Documents',          icon: FileText     },
];

export default function TeacherProfile() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const [teacher, setTeacher] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [showInactiveModal, setShowInactiveModal] = useState(false);

  useEffect(() => {
    const t = teachersData.find(t => t.id === parseInt(id));
    if (t) setTeacher({ ...t });
    else navigate('/teacher');
  }, [id, navigate]);

  if (!teacher) return (
    <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>Loading…</div>
  );

  const dept  = getDepartment(teacher.departmentId);
  const desig = getDesignation(teacher.designationId);
  const teacherSubjects = subjects.filter(s => teacher.subjectIds.includes(s.id));
  const teacherClasses  = classes.filter(c => teacher.classIds.includes(c.id));
  const gross = (teacher.basicSalary || 0) + (teacher.hra || 0) + (teacher.da || 0) + (teacher.ta || 0);
  const deductions = (teacher.pf || 0) + (teacher.esi || 0) + (teacher.tds || 0);
  const netSalary  = gross - deductions;

  const markInactive = () => {
    setTeacher(prev => ({ ...prev, status: 'inactive' }));
    toast.success(`${teacher.name} marked as inactive`);
    setShowInactiveModal(false);
  };

  return (
    <div style={{ padding: '24px 28px', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => navigate('/teacher')} style={{
          display: 'flex', alignItems: 'center', gap: 4, background: 'none',
          border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 12px',
          cursor: 'pointer', fontSize: 13, color: '#374151', fontWeight: 500,
        }}>
          <ArrowLeft size={14} /> Back
        </button>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0 }}>Teacher Profile</h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>JSK ERP / Teacher Management / {teacher.name}</p>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* ── LEFT PANEL (sticky) ── */}
        <div style={{ width: '28%', flexShrink: 0, position: 'sticky', top: 24, alignSelf: 'flex-start' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            {/* Avatar */}
            <div style={{ textAlign: 'center' }}>
              {teacher.photo ? (
                <img src={teacher.photo} alt="" style={{ width: 96, height: 96, borderRadius: '50%', border: '3px solid #1e40af', objectFit: 'cover', display: 'block', margin: '0 auto' }} />
              ) : (
                <div style={{
                  width: 96, height: 96, borderRadius: '50%', margin: '0 auto',
                  background: teacher.avatarColor + '33', color: teacher.avatarColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 800,
                }}>{teacher.avatar}</div>
              )}
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '12px 0 3px' }}>{teacher.name}</h2>
              <div style={{ fontSize: 13, color: '#64748b' }}>{desig?.name}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{dept?.name}</div>

              {/* Badges */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                <StatusBadge status={teacher.status} />
                <span style={{ border: '1px solid #d1d5db', color: '#6b7280', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999 }}>
                  {teacher.employmentType?.toUpperCase()}
                </span>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '16px 0' }} />

            {/* Quick Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <InfoRow icon={IdCard}      value={teacher.empId} />
              <InfoRow icon={Calendar}    value={`Joined: ${fmtJoin(teacher.joinDate)}`} />
              <InfoRow icon={Phone}       value={teacher.mobile} />
              <InfoRow icon={Mail}        value={teacher.email} />
              <InfoRow icon={MapPin}      value={`${teacher.city}, ${teacher.state}`} />
              <InfoRow icon={Droplets}    value={`Blood Group: ${teacher.bloodGroup || '—'}`} />
              <InfoRow icon={IndianRupee} value={`Net Salary: ${fmt(netSalary)}/month`} />
            </div>

            {/* Subjects */}
            {teacherSubjects.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '16px 0 8px' }}>Teaching Subjects</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {teacherSubjects.map(s => (
                    <Pill key={s.id} label={s.name} color={s.color} bg={s.color + '22'} />
                  ))}
                </div>
              </>
            )}

            {/* Classes */}
            {teacherClasses.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '14px 0 8px' }}>Classes</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {teacherClasses.map(c => (
                    <Pill key={c.id} label={c.name} color="#374151" bg="#f1f5f9" />
                  ))}
                </div>
              </>
            )}

            <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '16px 0' }} />

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={() => navigate(`/teacher/edit/${teacher.id}`)} style={{
                width: '100%', padding: '10px', borderRadius: 10, border: 'none',
                background: '#1e40af', color: '#fff', fontWeight: 600, fontSize: 14,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <Pencil size={14} /> Edit Profile
              </button>
              <button onClick={() => toast.success('ID Card ready to print!')} style={{
                width: '100%', padding: '10px', borderRadius: 10,
                border: '1px solid #e2e8f0', background: '#fff', color: '#374151',
                fontWeight: 600, fontSize: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <Printer size={14} /> Print ID Card
              </button>
              {teacher.status === 'active' && (
                <button onClick={() => setShowInactiveModal(true)} style={{
                  width: '100%', padding: '10px', borderRadius: 10,
                  border: '1px solid #fecaca', background: '#fff', color: '#dc2626',
                  fontWeight: 600, fontSize: 14, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <UserX size={14} /> Mark Inactive
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL (Tabs) ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            {/* Tab Bar */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', overflowX: 'auto' }}>
              {TABS.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.key;
                return (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '14px 18px', fontSize: 13, fontWeight: active ? 700 : 500,
                    color: active ? '#1e40af' : '#64748b',
                    borderBottom: active ? '2px solid #1e40af' : '2px solid transparent',
                    background: 'none', border: 'none', borderBottom: active ? '2px solid #1e40af' : '2px solid transparent',
                    cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 150ms',
                  }}>
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div style={{ padding: 24 }}>
              {activeTab === 'personal'   && <TabPersonal   teacher={teacher} />}
              {activeTab === 'timetable'  && <TabTimetable  teacher={teacher} />}
              {activeTab === 'attendance' && <TabAttendance teacher={teacher} />}
              {activeTab === 'salary'     && <TabSalary     teacher={teacher} />}
              {activeTab === 'documents'  && <TabDocuments  teacher={teacher} />}
            </div>
          </div>
        </div>
      </div>

      {/* Mark Inactive Modal */}
      {showInactiveModal && (
        <InactiveModal
          teacher={teacher}
          onConfirm={markInactive}
          onCancel={() => setShowInactiveModal(false)}
        />
      )}
    </div>
  );
}
