import React, { useState, useRef, useEffect } from 'react';
import {
  Search, CornerDownLeft, X, CheckCircle, AlertTriangle,
  BookOpen, IndianRupee, Calendar, RefreshCw, Printer, Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { bookCategories } from '../../data/dummyData';

// ── Helpers ─────────────────────────────────────────────────
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const diffDays = (a, b) =>
  Math.round((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24));

// ── Avatar ──────────────────────────────────────────────────
const Avatar = ({ initials, color, size = 40 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%', flexShrink: 0,
    background: color + '33', color,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: size * 0.33, fontWeight: 800
  }}>{initials}</div>
);

export default function ReturnBookTab({
  issues, books, members, settings,
  selectedIssue, setSelectedIssue,
  returnDate, setReturnDate,
  bookCondition, setBookCondition,
  damageFine, setDamageFine,
  fineCollected, setFineCollected,
  fineMode, setFineMode,
  handleReturnBook
}) {
  const today = new Date().toISOString().split('T')[0];

  const [searchQuery, setSearchQuery] = useState('');
  const [dropOpen, setDropOpen] = useState(false);
  const searchRef = useRef(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastReturn, setLastReturn] = useState(null);

  // Only active issues
  const activeIssues = issues.filter(i => i.status === 'issued' || i.status === 'overdue');

  // Search filter
  const filtered = activeIssues.filter(i => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const book = books.find(b => b.id === i.bookId);
    const member = members.find(m => m.id === i.memberId);
    return (
      book?.title.toLowerCase().includes(q) ||
      member?.name.toLowerCase().includes(q) ||
      i.issueId.toLowerCase().includes(q)
    );
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Get book and member from selected issue
  const issueBook = selectedIssue ? books.find(b => b.id === selectedIssue.bookId) : null;
  const issueMember = selectedIssue ? members.find(m => m.id === selectedIssue.memberId) : null;
  const cat = issueBook ? bookCategories.find(c => c.id === issueBook.categoryId) : null;

  // Overdue fine calculation
  const overdueDays = selectedIssue
    ? Math.max(0, diffDays(selectedIssue.dueDate, returnDate) - (settings?.graceDays || 0))
    : 0;
  const overdueFine = overdueDays * (settings?.finePerDay || 2);
  const totalFine = overdueFine + Number(damageFine || 0);
  const balanceDue = Math.max(0, totalFine - Number(fineCollected || 0));

  const onSelectIssue = (issue) => {
    setSelectedIssue(issue);
    const book = books.find(b => b.id === issue.bookId);
    const member = members.find(m => m.id === issue.memberId);
    setSearchQuery(`${book?.title || ''} — ${member?.name || ''}`);
    setDropOpen(false);
    setReturnDate(today);
    setBookCondition('good');
    setDamageFine(0);
    setFineCollected(totalFine);
  };

  const onReturn = () => {
    if (!selectedIssue) return;
    setLastReturn({
      issue: selectedIssue,
      book: issueBook,
      member: issueMember,
      returnDate,
      overdueDays,
      overdueFine,
      damageFine: Number(damageFine || 0),
      totalFine,
      fineCollected: Number(fineCollected || 0),
      balanceDue,
      condition: bookCondition,
    });
    handleReturnBook({
      returnDate,
      condition: bookCondition,
      damageFine: Number(damageFine || 0),
      fineCollected: Number(fineCollected || 0),
      remarks: bookCondition === 'lost' ? 'Book reported lost' : '',
    });
    setShowReceipt(true);
    setSearchQuery('');
    setSelectedIssue(null);
  };

  const cardStyle = { background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', borderRadius: 16, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid rgba(255, 255, 255, 0.8)' };
  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid rgba(255, 255, 255, 0.6)', borderRadius: 10, fontSize: 13, color: '#374151', background: '#f8fafc', outline: 'none' };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 4, display: 'block' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <style>{`
        .ret-input:focus { border-color: #10b981 !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
        .ret-drop-item:hover { background: #f0fdf4; }
        .cond-btn { padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: 2px solid #e2e8f0; background: #f8fafc; color: #64748b; transition: all 150ms; }
        .cond-btn.active-good { border-color: #10b981; background: #d1fae5; color: #065f46; }
        .cond-btn.active-damaged { border-color: #f59e0b; background: #fef3c7; color: #92400e; }
        .cond-btn.active-lost { border-color: #ef4444; background: #fee2e2; color: #991b1b; }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* ── LEFT: SEARCH ISSUED BOOK ── */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={18} style={{ color: '#10b981' }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Search Issued Book</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Search by member name, book title, or issue ID</div>
            </div>
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }} ref={searchRef}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
            <input
              className="ret-input"
              style={{ ...inputStyle, paddingLeft: 36, paddingRight: selectedIssue ? 36 : 14 }}
              placeholder="🔍 Search member name, book title, or issue ID..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setDropOpen(true); if (!e.target.value) { setSelectedIssue(null); } }}
              onFocus={() => setDropOpen(true)}
            />
            {selectedIssue && (
              <button onClick={() => { setSelectedIssue(null); setSearchQuery(''); }} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={14} />
              </button>
            )}

            {/* Dropdown */}
            {dropOpen && (
              <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.6)', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 50, maxHeight: 240, overflowY: 'auto' }}>
                {filtered.length === 0 ? (
                  <div style={{ padding: 16, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No active issues found</div>
                ) : filtered.map(issue => {
                  const b = books.find(bk => bk.id === issue.bookId);
                  const m = members.find(mb => mb.id === issue.memberId);
                  const isOverdue = issue.status === 'overdue';
                  return (
                    <div key={issue.id} className="ret-drop-item" onClick={() => onSelectIssue(issue)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f8fafc' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 6, background: (b?.coverColor || '#6366f1') + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <BookOpen size={16} style={{ color: b?.coverColor || '#6366f1' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b?.title || '—'}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>Issued to: {m?.name || '—'} · Due: {fmtDate(issue.dueDate)}</div>
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 999,
                        background: isOverdue ? '#fee2e2' : '#dbeafe',
                        color: isOverdue ? '#991b1b' : '#1e40af',
                        whiteSpace: 'nowrap'
                      }}>
                        {isOverdue ? '⚠️ Overdue' : '📤 Issued'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Issue Details */}
          {selectedIssue && issueBook && issueMember && (
            <div style={{ marginTop: 14, border: '1px solid rgba(255, 255, 255, 0.6)', borderRadius: 12, overflow: 'hidden' }}>
              {/* Book row */}
              <div style={{ background: issueBook.coverColor + '18', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: issueBook.coverColor + '33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <BookOpen size={18} style={{ color: issueBook.coverColor }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{issueBook.title}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{issueBook.author} · <span style={{ fontFamily: 'monospace', color: '#1e40af', fontWeight: 700 }}>{issueBook.bookId}</span></div>
                </div>
              </div>
              {/* Member row */}
              <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #e2e8f0' }}>
                <Avatar initials={issueMember.avatar} color={issueMember.avatarColor} size={32} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{issueMember.name}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{issueMember.memberId} · {issueMember.memberType}</div>
                </div>
              </div>
              {/* Issue meta */}
              <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                {[
                  { icon: '📤', label: 'Issue ID', val: selectedIssue.issueId },
                  { icon: '📅', label: 'Issue Date', val: fmtDate(selectedIssue.issueDate) },
                  { icon: '⏰', label: 'Due Date', val: fmtDate(selectedIssue.dueDate), red: selectedIssue.status === 'overdue' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#64748b' }}>{row.icon} {row.label}</span>
                    <span style={{ fontWeight: 600, color: row.red ? '#dc2626' : '#374151' }}>{row.val}</span>
                  </div>
                ))}
                {overdueDays > 0 && (
                  <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 8, padding: '6px 10px', marginTop: 4, fontSize: 12, fontWeight: 700, color: '#991b1b' }}>
                    ⚠️ {overdueDays} days overdue · Fine: ₹{overdueFine}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: RETURN DETAILS ── */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CornerDownLeft size={18} style={{ color: '#10b981' }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Return Details</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Condition, fine & collection</div>
            </div>
          </div>

          {!selectedIssue ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
              <CornerDownLeft size={40} style={{ color: '#e2e8f0', display: 'block', margin: '0 auto 10px' }} />
              <div style={{ fontSize: 14, fontWeight: 600 }}>Search and select an issue first</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Return Date */}
              <div>
                <label style={labelStyle}>Return Date *</label>
                <input type="date" className="ret-input" style={inputStyle} value={returnDate}
                  onChange={e => setReturnDate(e.target.value)} min={selectedIssue.issueDate} />
              </div>

              {/* Book Condition */}
              <div>
                <label style={labelStyle}>Book Condition *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { val: 'good', label: '✅ Good' },
                    { val: 'damaged', label: '⚠️ Damaged' },
                    { val: 'lost', label: '❌ Lost' },
                  ].map(opt => (
                    <button key={opt.val}
                      className={`cond-btn ${bookCondition === opt.val ? `active-${opt.val}` : ''}`}
                      onClick={() => setBookCondition(opt.val)}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Damage fine (only if damaged/lost) */}
              {(bookCondition === 'damaged' || bookCondition === 'lost') && (
                <div>
                  <label style={labelStyle}>{bookCondition === 'lost' ? 'Lost Book Fine (₹)' : 'Damage Fine (₹)'}</label>
                  <input type="number" min="0" className="ret-input" style={inputStyle}
                    value={damageFine} onChange={e => setDamageFine(Number(e.target.value))}
                    placeholder="Enter fine amount" />
                </div>
              )}

              {/* Fine Summary */}
              <div style={{ background: totalFine > 0 ? '#fff7ed' : '#f0fdf4', border: `1px solid ${totalFine > 0 ? '#fed7aa' : '#bbf7d0'}`, borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: totalFine > 0 ? '#c2410c' : '#065f46', marginBottom: 8 }}>
                  {totalFine > 0 ? '💰 Fine Details' : '✅ No Fine Applicable'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Overdue Fine ({overdueDays} days × ₹{settings?.finePerDay || 2})</span>
                    <span style={{ fontWeight: 600, color: overdueFine > 0 ? '#dc2626' : '#374151' }}>₹{overdueFine}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Damage / Lost Fine</span>
                    <span style={{ fontWeight: 600, color: Number(damageFine) > 0 ? '#dc2626' : '#374151' }}>₹{damageFine || 0}</span>
                  </div>
                  <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, color: '#374151' }}>Total Fine</span>
                    <span style={{ fontWeight: 800, color: totalFine > 0 ? '#dc2626' : '#10b981', fontSize: 14 }}>₹{totalFine}</span>
                  </div>
                </div>
              </div>

              {/* Fine Collection */}
              {totalFine > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Fine Collected (₹)</label>
                    <input type="number" min="0" max={totalFine} className="ret-input" style={inputStyle}
                      value={fineCollected} onChange={e => setFineCollected(Number(e.target.value))}
                      placeholder="Amount collected" />
                  </div>
                  <div>
                    <label style={labelStyle}>Payment Mode</label>
                    <select className="ret-input" style={inputStyle} value={fineMode} onChange={e => setFineMode(e.target.value)}>
                      <option value="cash">Cash</option>
                      <option value="online">Online / UPI</option>
                      <option value="card">Card</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Balance due warning */}
              {balanceDue > 0 && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#991b1b', fontWeight: 600 }}>
                  ⚠️ Balance due: ₹{balanceDue} — will be added to member's fine balance
                </div>
              )}

              {/* Lost book warning */}
              {bookCondition === 'lost' && (
                <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#991b1b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle size={14} /> Book will be marked as LOST. This cannot be undone.
                </div>
              )}

              {/* Process Return Button */}
              <button
                onClick={onReturn}
                style={{
                  width: '100%', padding: '13px 0',
                  background: '#059669', color: '#fff', border: 'none',
                  borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'background 150ms'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#047857'}
                onMouseLeave={e => e.currentTarget.style.background = '#059669'}
              >
                <CornerDownLeft size={18} />
                {bookCondition === 'lost' ? 'Mark as Lost' : 'Process Return'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── RETURN RECEIPT MODAL ── */}
      {showReceipt && lastReturn && (
        <ReturnReceiptModal
          data={lastReturn}
          settings={settings}
          onClose={() => { setShowReceipt(false); setLastReturn(null); }}
          onReturnAnother={() => { setShowReceipt(false); setLastReturn(null); }}
        />
      )}
    </div>
  );
}

// ── Return Receipt Modal ────────────────────────────────────
function ReturnReceiptModal({ data, settings, onClose, onReturnAnother }) {
  const [animIn, setAnimIn] = useState(false);
  useEffect(() => { setTimeout(() => setAnimIn(true), 50); }, []);

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20,
      opacity: animIn ? 1 : 0, transition: 'opacity 250ms'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', borderRadius: 20, padding: 28, maxWidth: 480, width: '100%',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.20)',
        transform: animIn ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
        transition: 'all 300ms ease'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <CheckCircle size={32} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Book Returned Successfully!</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Issue ID: <strong>{data.issue.issueId}</strong></div>
        </div>

        {/* Receipt card */}
        <div style={{ border: '2px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ background: '#059669', color: '#fff', padding: '12px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.05em' }}>JSK EDUCATIONAL FOUNDATION</div>
            <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>LIBRARY RETURN RECEIPT</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', fontSize: 12 }}>
            <span>Issue ID: <strong style={{ fontFamily: 'monospace', color: '#1e40af' }}>{data.issue.issueId}</strong></span>
            <span>Return Date: <strong>{fmtDate(data.returnDate)}</strong></span>
          </div>

          {/* Book & Member */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
            {[
              { label: 'Book', val: data.book?.title },
              { label: 'Book ID', val: data.book?.bookId },
              { label: 'Member', val: data.member?.name },
              { label: 'Member ID', val: data.member?.memberId },
              { label: 'Condition', val: data.condition.toUpperCase() },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: '#64748b' }}>{row.label}:</span>
                <span style={{ fontWeight: 600, color: row.label === 'Condition' && data.condition !== 'good' ? '#dc2626' : '#0f172a' }}>{row.val}</span>
              </div>
            ))}
          </div>

          {/* Fine summary */}
          <div style={{ padding: '12px 16px', background: data.totalFine > 0 ? '#fff7ed' : '#f0fdf4' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Fine Summary</div>
            {[
              { label: 'Overdue Fine', val: `₹${data.overdueFine}` },
              { label: 'Damage / Lost Fine', val: `₹${data.damageFine}` },
              { label: 'Total Fine', val: `₹${data.totalFine}`, bold: true },
              { label: 'Fine Collected', val: `₹${data.fineCollected}`, green: true },
              { label: 'Balance Due', val: `₹${data.balanceDue}`, red: data.balanceDue > 0 },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: '#64748b' }}>{row.label}:</span>
                <span style={{ fontWeight: row.bold ? 800 : 600, color: row.red ? '#dc2626' : row.green ? '#10b981' : '#374151' }}>{row.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => window.print()} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, border: '1px solid rgba(255, 255, 255, 0.6)', background: '#f8fafc', color: '#374151', borderRadius: 10, padding: '10px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Printer size={15} /> Print Receipt
          </button>
          <button onClick={onReturnAnother} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, border: '1px solid #059669', background: '#f0fdf4', color: '#059669', borderRadius: 10, padding: '10px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <RefreshCw size={15} /> Return Another
          </button>
          <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: '#059669', color: '#fff', borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
