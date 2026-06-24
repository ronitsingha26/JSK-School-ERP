import React, { useState, useMemo, useEffect } from 'react';
import {
  AlertTriangle, BookOpen, Bell, CornerDownLeft, RefreshCw, X, CheckCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ── Helpers ─────────────────────────────────────────────────
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const diffDays = (from, to) =>
  Math.round((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24));

// ── Avatar ──────────────────────────────────────────────────
const Avatar = ({ initials, color, size = 36 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%', flexShrink: 0,
    background: color + '33', color,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: size * 0.33, fontWeight: 800
  }}>{initials}</div>
);

export default function OverdueTab({
  issues, books, members, settings,
  setActiveTab, setShowRenewalModal, setTargetIssue
}) {
  const today = new Date().toISOString().split('T')[0];

  const [renewalIssue, setRenewalIssue] = useState(null);
  const [showRenewal, setShowRenewal] = useState(false);

  // Overdue = status 'overdue' OR status 'issued' but past due date
  const overdueIssues = useMemo(() =>
    issues.filter(i =>
      i.status === 'overdue' ||
      (i.status === 'issued' && i.dueDate < today)
    ).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)),
    [issues, today]
  );

  const totalFine = overdueIssues.reduce((sum, i) => {
    const days = Math.max(0, diffDays(i.dueDate, today) - (settings?.graceDays || 0));
    return sum + days * (settings?.finePerDay || 2);
  }, 0);

  const onSendReminder = (member) => {
    toast.success(`📱 Reminder sent to ${member.name}!`, { duration: 3000 });
  };

  const onStartRenewal = (issue) => {
    setRenewalIssue(issue);
    setShowRenewal(true);
  };

  const onGoReturn = (issue) => {
    setTargetIssue && setTargetIssue(issue);
    setActiveTab('return');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Alert banner */}
      <div style={{
        background: overdueIssues.length > 0 ? '#fef2f2' : '#f0fdf4',
        border: `1px solid ${overdueIssues.length > 0 ? '#fecaca' : '#bbf7d0'}`,
        borderRadius: 14, padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 14
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: overdueIssues.length > 0 ? '#fee2e2' : '#d1fae5',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          {overdueIssues.length > 0
            ? <AlertTriangle size={24} style={{ color: '#dc2626' }} />
            : <CheckCircle size={24} style={{ color: '#10b981' }} />}
        </div>
        <div style={{ flex: 1 }}>
          {overdueIssues.length > 0 ? (
            <>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#991b1b' }}>
                {overdueIssues.length} Overdue Book{overdueIssues.length > 1 ? 's' : ''} — Action Required
              </div>
              <div style={{ fontSize: 13, color: '#b91c1c', marginTop: 2 }}>
                Total fine pending: <strong>₹{totalFine}</strong> · Sorted by oldest due date first
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#15803d' }}>All books returned on time!</div>
              <div style={{ fontSize: 13, color: '#16a34a', marginTop: 2 }}>No overdue books at this time.</div>
            </>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: overdueIssues.length > 0 ? '#dc2626' : '#10b981' }}>{overdueIssues.length}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>OVERDUE</div>
          </div>
          <div style={{ width: 1, background: '#e2e8f0' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#f59e0b' }}>₹{totalFine}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>FINE DUE</div>
          </div>
        </div>
      </div>

      {/* Overdue list */}
      {overdueIssues.length === 0 ? (
        <div style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', borderRadius: 14, padding: '60px 20px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid rgba(255, 255, 255, 0.8)' }}>
          <CheckCircle size={56} style={{ color: '#d1fae5', display: 'block', margin: '0 auto 12px' }} />
          <div style={{ fontSize: 17, fontWeight: 700, color: '#374151' }}>No overdue books!</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>All issued books are within their due dates.</div>
        </div>
      ) : (
        <div style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid rgba(255, 255, 255, 0.8)', overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ background: '#fef2f2', borderBottom: '1px solid #fecaca', padding: '12px 16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '220px 180px 100px 80px 80px 100px 1fr', gap: 12, fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              <span>MEMBER</span>
              <span>BOOK</span>
              <span>DUE DATE</span>
              <span>DAYS LATE</span>
              <span>FINE</span>
              <span>ISSUE ID</span>
              <span style={{ textAlign: 'right' }}>ACTIONS</span>
            </div>
          </div>

          {overdueIssues.map((issue, idx) => {
            const book = books.find(b => b.id === issue.bookId);
            const member = members.find(m => m.id === issue.memberId);
            const daysLate = Math.max(0, diffDays(issue.dueDate, today) - (settings?.graceDays || 0));
            const fine = daysLate * (settings?.finePerDay || 2);

            return (
              <div key={issue.id} style={{
                padding: '14px 16px',
                borderBottom: idx < overdueIssues.length - 1 ? '1px solid #fef2f2' : 'none',
                background: idx % 2 === 0 ? '#fff' : '#fffcfc',
                transition: 'background 150ms'
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#fffcfc'}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '220px 180px 100px 80px 80px 100px 1fr', gap: 12, alignItems: 'center' }}>
                  {/* Member */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar initials={member?.avatar || '?'} color={member?.avatarColor || '#94a3b8'} size={34} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member?.name || '—'}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{member?.classOrDesig}</div>
                    </div>
                  </div>

                  {/* Book */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 5, background: (book?.coverColor || '#6366f1') + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <BookOpen size={12} style={{ color: book?.coverColor || '#6366f1' }} />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book?.title || '—'}</div>
                  </div>

                  {/* Due date */}
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#dc2626' }}>{fmtDate(issue.dueDate)}</div>

                  {/* Days late */}
                  <div>
                    <span style={{ background: '#fee2e2', color: '#991b1b', fontSize: 12, fontWeight: 800, padding: '3px 8px', borderRadius: 999 }}>
                      {daysLate}d
                    </span>
                  </div>

                  {/* Fine */}
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#dc2626' }}>₹{fine}</div>

                  {/* Issue ID */}
                  <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#1e40af', fontWeight: 700, background: '#dbeafe', padding: '2px 7px', borderRadius: 6, display: 'inline-block' }}>
                    {issue.issueId}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => onSendReminder(member)}
                      title="Send Reminder"
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 7, border: '1px solid #fde68a', background: '#fefce8', color: '#92400e', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      <Bell size={12} /> Remind
                    </button>
                    {settings?.renewalAllowed && (
                      <button
                        onClick={() => onStartRenewal(issue)}
                        title="Renew Book"
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 7, border: '1px solid #bfdbfe', background: '#eff6ff', color: '#1e40af', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        <RefreshCw size={12} /> Renew
                      </button>
                    )}
                    <button
                      onClick={() => onGoReturn(issue)}
                      title="Process Return"
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 7, border: '1px solid #bbf7d0', background: '#f0fdf4', color: '#15803d', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      <CornerDownLeft size={12} /> Return
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Renewal Modal */}
      {showRenewal && renewalIssue && (
        <RenewalModal
          issue={renewalIssue}
          books={books}
          members={members}
          settings={settings}
          onClose={() => { setShowRenewal(false); setRenewalIssue(null); }}
        />
      )}
    </div>
  );
}

// ── Renewal Modal ───────────────────────────────────────────
function RenewalModal({ issue, books, members, settings, onClose }) {
  const today = new Date().toISOString().split('T')[0];
  const [animIn, setAnimIn] = useState(false);
  useEffect(() => { setTimeout(() => setAnimIn(true), 50); }, []);

  const book = books.find(b => b.id === issue.bookId);
  const member = members.find(m => m.id === issue.memberId);
  const renewDays = settings?.renewalDays || 7;

  const newDueDateD = new Date(issue.dueDate > today ? issue.dueDate : today);
  newDueDateD.setDate(newDueDateD.getDate() + renewDays);
  const newDueDate = newDueDateD.toISOString().split('T')[0];

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  const handleRenew = () => {
    toast.success(`Book renewed until ${fmtDate(newDueDate)}`);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20,
      opacity: animIn ? 1 : 0, transition: 'opacity 250ms'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', borderRadius: 20, padding: 28, maxWidth: 420, width: '100%',
        boxShadow: '0 25px 60px rgba(0,0,0,0.20)',
        transform: animIn ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
        transition: 'all 300ms ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>🔄 Renew Book</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Extend due date by {renewDays} days</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ background: '#f8fafc', borderRadius: 12, padding: 14, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: '📚 Book', val: book?.title },
            { label: '👤 Member', val: member?.name },
            { label: '📅 Current Due', val: fmtDate(issue.dueDate), red: issue.dueDate < today },
            { label: '✅ New Due Date', val: fmtDate(newDueDate), green: true },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: '#64748b' }}>{row.label}</span>
              <span style={{ fontWeight: 700, color: row.red ? '#dc2626' : row.green ? '#059669' : '#0f172a' }}>{row.val}</span>
            </div>
          ))}
        </div>

        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#1e40af' }}>
          ℹ️ Max {settings?.maxRenewals || 1} renewal(s) allowed per issue. Overdue fines up to today will still apply.
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px 0', border: '1px solid rgba(255, 255, 255, 0.6)', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', color: '#374151', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleRenew} style={{ flex: 2, padding: '10px 0', background: '#1e40af', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <RefreshCw size={14} /> Renew until {fmtDate(newDueDate)}
          </button>
        </div>
      </div>
    </div>
  );
}


