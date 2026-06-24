import React, { useState, useMemo } from 'react';
import {
  ClipboardList, Search, BookOpen, Eye, RefreshCw,
  ChevronLeft, ChevronRight, Download
} from 'lucide-react';

// ── Helpers ─────────────────────────────────────────────────
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const diffDays = (a, b) =>
  Math.round((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24));

// ── Status pill ──────────────────────────────────────────────
const StatusPill = ({ status }) => {
  const map = {
    issued:   { bg: '#dbeafe', color: '#1e40af', label: '📤 Issued' },
    overdue:  { bg: '#fee2e2', color: '#991b1b', label: '⚠️ Overdue' },
    returned: { bg: '#d1fae5', color: '#065f46', label: '✅ Returned' },
    lost:     { bg: '#f3f4f6', color: '#374151', label: '❌ Lost' },
  };
  const s = map[status] || map.issued;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, borderRadius: 999, padding: '3px 10px', whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
};

// ── Avatar ──────────────────────────────────────────────────
const Avatar = ({ initials, color, size = 32 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%', flexShrink: 0,
    background: color + '33', color,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: size * 0.33, fontWeight: 800
  }}>{initials}</div>
);

const PAGE_SIZE = 10;

export default function IssueHistoryTab({
  issues, books, members,
  search, setSearch, filters, setFilters,
  setTargetIssue, setActiveTab
}) {
  const [page, setPage] = useState(1);
  const today = new Date().toISOString().split('T')[0];

  // Filter + search
  const filtered = useMemo(() => {
    return issues.filter(issue => {
      const book = books.find(b => b.id === issue.bookId);
      const member = members.find(m => m.id === issue.memberId);

      if (search) {
        const q = search.toLowerCase();
        if (
          !issue.issueId.toLowerCase().includes(q) &&
          !book?.title.toLowerCase().includes(q) &&
          !member?.name.toLowerCase().includes(q) &&
          !member?.memberId.toLowerCase().includes(q)
        ) return false;
      }

      if (filters.status && issue.status !== filters.status) return false;

      if (filters.type && member?.memberType !== filters.type) return false;

      if (filters.dateFrom && issue.issueDate < filters.dateFrom) return false;
      if (filters.dateTo && issue.issueDate > filters.dateTo) return false;

      return true;
    });
  }, [issues, books, members, search, filters]);

  // Sort newest first
  const sorted = [...filtered].sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));

  // Pagination
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const reset = () => {
    setSearch('');
    setFilters({ status: '', type: '', dateFrom: '', dateTo: '' });
    setPage(1);
  };

  // Stats
  const stats = useMemo(() => ({
    total: issues.length,
    returned: issues.filter(i => i.status === 'returned').length,
    pending: issues.filter(i => i.status === 'issued' || i.status === 'overdue').length,
    fineCollected: issues.filter(i => i.finePaid).reduce((s, i) => s + i.fineAmount, 0),
  }), [issues]);

  const inputStyle = { padding: '8px 12px', border: '1px solid rgba(255, 255, 255, 0.6)', borderRadius: 8, fontSize: 13, color: '#374151', background: '#f8fafc', outline: 'none' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>{`
        .hist-row:hover { background: #f8fafc !important; }
        .hist-action { opacity: 0; transition: opacity 150ms; }
        .hist-row:hover .hist-action { opacity: 1; }
        .hist-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.1); }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>Issue History</h2>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>All book issue & return records</p>
        </div>
        <button
          onClick={() => {}}
          style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid rgba(255, 255, 255, 0.6)', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', color: '#374151', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          <Download size={14} /> Export
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Total Issues', val: stats.total, icon: '📋', bg: '#eff6ff', color: '#1e40af' },
          { label: 'Returned', val: stats.returned, icon: '✅', bg: '#f0fdf4', color: '#15803d' },
          { label: 'Pending', val: stats.pending, icon: '📤', bg: '#fff7ed', color: '#c2410c' },
          { label: 'Fine Collected', val: `₹${stats.fineCollected}`, icon: '💰', bg: '#fefce8', color: '#a16207' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', borderRadius: 12, padding: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid rgba(255, 255, 255, 0.8)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', borderRadius: 12, padding: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid rgba(255, 255, 255, 0.8)', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <div style={{ position: 'relative', minWidth: 260, flex: 1 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
          <input
            className="hist-input"
            style={{ ...inputStyle, width: '100%', paddingLeft: 30, boxSizing: 'border-box' }}
            placeholder="Search issue ID, book title, member name..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <select className="hist-input" style={inputStyle}
          value={filters.status} onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1); }}>
          <option value="">All Status</option>
          <option value="issued">Issued</option>
          <option value="overdue">Overdue</option>
          <option value="returned">Returned</option>
          <option value="lost">Lost</option>
        </select>

        <select className="hist-input" style={inputStyle}
          value={filters.type} onChange={e => { setFilters(f => ({ ...f, type: e.target.value })); setPage(1); }}>
          <option value="">All Types</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <input type="date" className="hist-input" style={inputStyle}
          value={filters.dateFrom} onChange={e => { setFilters(f => ({ ...f, dateFrom: e.target.value })); setPage(1); }} />
        <span style={{ fontSize: 12, color: '#94a3b8' }}>to</span>
        <input type="date" className="hist-input" style={inputStyle}
          value={filters.dateTo} onChange={e => { setFilters(f => ({ ...f, dateTo: e.target.value })); setPage(1); }} />

        <button onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: '#3b82f6', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          <RefreshCw size={12} /> Reset
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid rgba(255, 255, 255, 0.8)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['#', 'ISSUE ID', 'BOOK', 'MEMBER', 'ISSUED', 'DUE DATE', 'RETURN DATE', 'FINE', 'STATUS'].map(col => (
                  <th key={col} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '60px 0', textAlign: 'center' }}>
                    <ClipboardList size={48} style={{ color: '#e2e8f0', display: 'block', margin: '0 auto 12px' }} />
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#374151' }}>No records found</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Try changing your filters</div>
                    <button onClick={reset} style={{ marginTop: 12, padding: '7px 16px', borderRadius: 8, border: '1px solid #3b82f6', color: '#3b82f6', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Reset Filters</button>
                  </td>
                </tr>
              ) : paginated.map((issue, idx) => {
                const book = books.find(b => b.id === issue.bookId);
                const member = members.find(m => m.id === issue.memberId);
                const dueD = new Date(issue.dueDate);
                const todayD = new Date(today);
                const daysLate = issue.status !== 'returned' ? Math.max(0, diffDays(issue.dueDate, today)) : 0;
                const isOverdue = issue.status === 'overdue' || (issue.status === 'issued' && daysLate > 0);

                return (
                  <tr key={issue.id} className="hist-row" style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 150ms' }}>
                    {/* # */}
                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#94a3b8' }}>{(page - 1) * PAGE_SIZE + idx + 1}</td>

                    {/* Issue ID */}
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ background: '#dbeafe', color: '#1e40af', fontFamily: 'monospace', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 6, whiteSpace: 'nowrap' }}>
                        {issue.issueId}
                      </span>
                    </td>

                    {/* Book */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: (book?.coverColor || '#6366f1') + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <BookOpen size={13} style={{ color: book?.coverColor || '#6366f1' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book?.title || '—'}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>{book?.author || '—'}</div>
                        </div>
                      </div>
                    </td>

                    {/* Member */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar initials={member?.avatar || '?'} color={member?.avatarColor || '#94a3b8'} size={28} />
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{member?.name || '—'}</div>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 999, background: member?.memberType === 'student' ? '#dbeafe' : '#ede9fe', color: member?.memberType === 'student' ? '#1e40af' : '#6d28d9' }}>
                            {member?.memberType === 'student' ? '🎓' : '👨‍🏫'} {member?.memberType || '—'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Issued */}
                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#374151', whiteSpace: 'nowrap' }}>{fmtDate(issue.issueDate)}</td>

                    {/* Due Date */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: isOverdue ? '#dc2626' : '#374151', whiteSpace: 'nowrap' }}>{fmtDate(issue.dueDate)}</div>
                      {isOverdue && issue.status !== 'returned' && (
                        <div style={{ fontSize: 10, color: '#dc2626', fontWeight: 600 }}>⚠️ {daysLate} days late</div>
                      )}
                    </td>

                    {/* Return Date */}
                    <td style={{ padding: '12px 14px', fontSize: 12, color: issue.returnDate ? '#059669' : '#94a3b8', fontWeight: issue.returnDate ? 600 : 400, whiteSpace: 'nowrap' }}>
                      {fmtDate(issue.returnDate)}
                    </td>

                    {/* Fine */}
                    <td style={{ padding: '12px 14px' }}>
                      {issue.fineAmount > 0 ? (
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#dc2626' }}>₹{issue.fineAmount}</div>
                          <div style={{ fontSize: 10, fontWeight: 600, color: issue.finePaid ? '#059669' : '#f97316' }}>
                            {issue.finePaid ? '✅ Paid' : '⏳ Pending'}
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>₹0</span>
                      )}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '12px 14px' }}>
                      <StatusPill status={issue.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {sorted.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length} records
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid rgba(255, 255, 255, 0.6)', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#d1d5db' : '#374151' }}>
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => Math.abs(p - page) <= 2).map(p => (
                <button key={p}
                  onClick={() => setPage(p)}
                  style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid rgba(255, 255, 255, 0.6)', background: p === page ? '#eff6ff' : '#fff', color: p === page ? '#1e40af' : '#374151', fontWeight: p === page ? 700 : 500, fontSize: 13, cursor: 'pointer' }}>
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid rgba(255, 255, 255, 0.6)', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: page === totalPages ? 'not-allowed' : 'pointer', color: page === totalPages ? '#d1d5db' : '#374151' }}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
