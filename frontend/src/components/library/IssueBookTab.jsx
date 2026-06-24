import React, { useState, useRef, useEffect } from 'react';
import {
  Search, BookPlus, User, BookOpen, X, ChevronDown,
  AlertTriangle, CheckCircle, IndianRupee, Calendar,
  MapPin, Building2, Hash, Printer, RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { bookCategories } from '../../data/dummyData';

// ── Helpers ────────────────────────────────────────────────
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const daysBetween = (a, b) =>
  Math.round((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24));

// ── Circled step number ────────────────────────────────────
const StepBadge = ({ num, active }) => (
  <div style={{
    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
    background: active ? '#1e40af' : '#e2e8f0',
    color: active ? '#fff' : '#94a3b8',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 800
  }}>{num}</div>
);

// ── Avatar ─────────────────────────────────────────────────
const Avatar = ({ initials, color, size = 40 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%', flexShrink: 0,
    background: color + '33', color,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: size * 0.33, fontWeight: 800
  }}>{initials}</div>
);

// ── Main Component ─────────────────────────────────────────
export default function IssueBookTab({
  books, members, issues, settings,
  selectedMember, setSelectedMember,
  selectedBook, setSelectedBook,
  issueDate, setIssueDate,
  dueDate, setDueDate,
  handleIssueBook
}) {
  const today = new Date().toISOString().split('T')[0];

  // Member search
  const [memberQuery, setMemberQuery] = useState('');
  const [memberDropOpen, setMemberDropOpen] = useState(false);
  const memberRef = useRef(null);

  // Book search
  const [bookQuery, setBookQuery] = useState('');
  const [bookDropOpen, setBookDropOpen] = useState(false);
  const bookRef = useRef(null);

  // Issue form
  const [remarks, setRemarks] = useState('');
  const [issuedBy] = useState('Admin');
  const [showSlip, setShowSlip] = useState(false);
  const [lastIssue, setLastIssue] = useState(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (memberRef.current && !memberRef.current.contains(e.target)) setMemberDropOpen(false);
      if (bookRef.current && !bookRef.current.contains(e.target)) setBookDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Filtered members for dropdown
  const memberResults = members.filter(m => {
    if (!memberQuery) return true;
    const q = memberQuery.toLowerCase();
    return m.name.toLowerCase().includes(q) ||
      m.memberId.toLowerCase().includes(q) ||
      m.mobile.includes(q);
  });

  // Filtered books (available only)
  const bookResults = books.filter(b => {
    if (b.availableCopies <= 0) return false;
    if (!bookQuery) return true;
    const q = bookQuery.toLowerCase();
    return b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q) ||
      b.bookId.toLowerCase().includes(q);
  });

  const getCategoryById = (id) => bookCategories.find(c => c.id === id);

  const canIssue = selectedMember &&
    selectedBook &&
    selectedMember.fineBalance === 0 &&
    selectedMember.currentIssued < selectedMember.maxBooksAllowed;

  const onSelectMember = (m) => {
    setSelectedMember(m);
    setMemberQuery(m.name);
    setMemberDropOpen(false);
  };

  const onSelectBook = (b) => {
    setSelectedBook(b);
    setBookQuery(b.title);
    setBookDropOpen(false);
  };

  const onClearMember = () => {
    setSelectedMember(null);
    setMemberQuery('');
  };

  const onClearBook = () => {
    setSelectedBook(null);
    setBookQuery('');
  };

  const onIssue = () => {
    if (!canIssue) return;
    const newIssueId = `LIB-I-${String(issues.length + 1).padStart(4, '0')}`;
    setLastIssue({ issueId: newIssueId, member: selectedMember, book: selectedBook, issueDate, dueDate });
    handleIssueBook({ issueDate, dueDate, remarks });
    setShowSlip(true);
    setMemberQuery('');
    setBookQuery('');
    setRemarks('');
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: 10, fontSize: 13, color: '#374151', background: '#f8fafc',
    outline: 'none', transition: 'border-color 150ms',
  };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 4, display: 'block' };
  const cardStyle = { background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', borderRadius: 16, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid rgba(255, 255, 255, 0.8)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <style>{`
        .issue-input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .drop-item:hover { background: #f8fafc; }
        .issue-btn-primary { background: #1e40af; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 150ms; display: flex; align-items: center; gap: 6px; }
        .issue-btn-primary:hover { background: #1d4ed8; }
        .issue-btn-primary:disabled { background: #94a3b8; cursor: not-allowed; }
      `}</style>

      {/* ── STEP 1 + 2 SIDE BY SIDE ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* ── STEP 1: SELECT MEMBER ── */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <StepBadge num={1} active={true} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Select Member</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Search by name, member ID or mobile</div>
            </div>
          </div>

          {/* Search input */}
          <div style={{ position: 'relative' }} ref={memberRef}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
            <input
              className="issue-input"
              style={{ ...inputStyle, paddingLeft: 36, paddingRight: selectedMember ? 36 : 14 }}
              placeholder="🔍 Search by name, ID or mobile..."
              value={memberQuery}
              onChange={e => { setMemberQuery(e.target.value); setMemberDropOpen(true); if (!e.target.value) setSelectedMember(null); }}
              onFocus={() => setMemberDropOpen(true)}
            />
            {selectedMember && (
              <button onClick={onClearMember} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={14} />
              </button>
            )}

            {/* Dropdown */}
            {memberDropOpen && memberResults.length > 0 && (
              <div style={{
                position: 'absolute', top: '110%', left: 0, right: 0,
                background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.6)', borderRadius: 12,
                boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 50, maxHeight: 220, overflowY: 'auto'
              }}>
                {memberResults.map(m => (
                  <div key={m.id} className="drop-item" onClick={() => onSelectMember(m)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f8fafc' }}>
                    <Avatar initials={m.avatar} color={m.avatarColor} size={32} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{m.memberId} · {m.memberType === 'student' ? '🎓' : '👨‍🏫'} {m.classOrDesig}</div>
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', whiteSpace: 'nowrap' }}>
                      {m.currentIssued}/{m.maxBooksAllowed} books
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Member info card */}
          {selectedMember && (
            <div style={{ marginTop: 14, border: '1px solid rgba(255, 255, 255, 0.6)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ background: '#f8fafc', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar initials={selectedMember.avatar} color={selectedMember.avatarColor} size={44} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{selectedMember.name}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                    <span style={{ background: '#dbeafe', color: '#1e40af', padding: '1px 6px', borderRadius: 999, fontWeight: 700, fontFamily: 'monospace', fontSize: 10 }}>{selectedMember.memberId}</span>
                    {' · '}
                    {selectedMember.memberType === 'student' ? '🎓 Student' : '👨‍🏫 Teacher'}
                    {' · '}{selectedMember.classOrDesig}
                  </div>
                </div>
              </div>
              <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { icon: '📚', label: 'Books Issued', val: `${selectedMember.currentIssued} / ${selectedMember.maxBooksAllowed}` },
                  { icon: '⚠️', label: 'Outstanding Fine', val: `₹${selectedMember.fineBalance}`, red: selectedMember.fineBalance > 0 },
                  { icon: '📅', label: 'Member Since', val: fmtDate(selectedMember.joinDate) },
                  { icon: '✅', label: 'Valid Till', val: fmtDate(selectedMember.expiryDate) },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                    <span style={{ color: '#64748b' }}>{row.icon} {row.label}</span>
                    <span style={{ fontWeight: 600, color: row.red ? '#dc2626' : '#374151' }}>{row.val}</span>
                  </div>
                ))}
              </div>

              {/* Warnings */}
              {selectedMember.fineBalance > 0 && (
                <div style={{ margin: '0 14px 12px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <AlertTriangle size={14} style={{ color: '#f97316', flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#c2410c' }}>Outstanding fine of ₹{selectedMember.fineBalance}</div>
                    <div style={{ fontSize: 11, color: '#9a3412' }}>Collect fine before issuing new book.</div>
                  </div>
                </div>
              )}
              {selectedMember.currentIssued >= selectedMember.maxBooksAllowed && (
                <div style={{ margin: '0 14px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <AlertTriangle size={14} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#991b1b' }}>
                    ❌ Book limit reached ({selectedMember.currentIssued}/{selectedMember.maxBooksAllowed}). Return a book first.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── STEP 2: SELECT BOOK ── */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <StepBadge num={2} active={!!selectedMember} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Select Book</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Search by title, author, ISBN or Book ID</div>
            </div>
          </div>

          {/* Search input */}
          <div style={{ position: 'relative' }} ref={bookRef}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
            <input
              className="issue-input"
              style={{ ...inputStyle, paddingLeft: 36, paddingRight: selectedBook ? 36 : 14 }}
              placeholder="🔍 Search by title, author, ISBN, Book ID..."
              value={bookQuery}
              onChange={e => { setBookQuery(e.target.value); setBookDropOpen(true); if (!e.target.value) setSelectedBook(null); }}
              onFocus={() => setBookDropOpen(true)}
            />
            {selectedBook && (
              <button onClick={onClearBook} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={14} />
              </button>
            )}

            {/* Dropdown */}
            {bookDropOpen && (
              <div style={{
                position: 'absolute', top: '110%', left: 0, right: 0,
                background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.6)', borderRadius: 12,
                boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 50, maxHeight: 220, overflowY: 'auto'
              }}>
                {bookResults.length === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No available books found</div>
                ) : bookResults.map(b => {
                  const cat = getCategoryById(b.categoryId);
                  return (
                    <div key={b.id} className="drop-item" onClick={() => onSelectBook(b)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f8fafc' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 6, background: b.coverColor + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <BookOpen size={16} style={{ color: b.coverColor }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{b.author} · {b.bookId}</div>
                      </div>
                      <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {b.availableCopies} avail.
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Book info card */}
          {selectedBook && (() => {
            const cat = getCategoryById(selectedBook.categoryId);
            return (
              <div style={{ marginTop: 14, border: '1px solid rgba(255, 255, 255, 0.6)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ background: selectedBook.coverColor + '18', padding: '14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: selectedBook.coverColor + '33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BookOpen size={22} style={{ color: selectedBook.coverColor }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>{selectedBook.title}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                      <span style={{ background: '#dbeafe', color: '#1e40af', padding: '1px 6px', borderRadius: 999, fontWeight: 700, fontFamily: 'monospace', fontSize: 10 }}>{selectedBook.bookId}</span>
                      {cat && <span style={{ marginLeft: 6, background: cat.color + '22', color: cat.color, padding: '1px 6px', borderRadius: 999, fontSize: 10, fontWeight: 600 }}>{cat.name}</span>}
                    </div>
                  </div>
                </div>
                <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { icon: '👤', label: 'Author', val: selectedBook.author },
                    { icon: '🏢', label: 'Publisher', val: selectedBook.publisher },
                    { icon: '📍', label: 'Rack', val: `${selectedBook.rack} / ${selectedBook.shelf}` },
                    { icon: '📚', label: 'Available', val: `${selectedBook.availableCopies} of ${selectedBook.totalCopies} copies`, green: true },
                    { icon: '💰', label: 'Price', val: `₹${selectedBook.price}` },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                      <span style={{ color: '#64748b' }}>{row.icon} {row.label}</span>
                      <span style={{ fontWeight: 600, color: row.green ? '#10b981' : '#374151' }}>{row.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── STEP 3: ISSUE DETAILS ── */}
      {selectedMember && selectedBook && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <StepBadge num={3} active={true} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Issue Details</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Confirm dates and finalize</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Issue Date *</label>
              <input type="date" className="issue-input" style={inputStyle} value={issueDate}
                onChange={e => setIssueDate(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Due Date *</label>
              <input type="date" className="issue-input" style={inputStyle} value={dueDate}
                onChange={e => setDueDate(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Fine Per Day</label>
              <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', cursor: 'default' }}>
                <IndianRupee size={13} /> {settings?.finePerDay || 2} per day
              </div>
            </div>
            <div>
              <label style={labelStyle}>Issued By</label>
              <div style={{ ...inputStyle, color: '#64748b', cursor: 'default' }}>{issuedBy}</div>
            </div>
            <div style={{ gridColumn: '2 / -1' }}>
              <label style={labelStyle}>Remarks (Optional)</label>
              <input className="issue-input" style={inputStyle} placeholder="Any notes..."
                value={remarks} onChange={e => setRemarks(e.target.value)} />
            </div>
          </div>

          {/* Issue Preview */}
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e40af', marginBottom: 10 }}>📤 Issue Summary</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: 'Member', val: `${selectedMember.name} (${selectedMember.memberId})` },
                { label: 'Book', val: `${selectedBook.title} (${selectedBook.bookId})` },
                { label: 'Issue Date', val: fmtDate(issueDate) },
                { label: 'Due Date', val: `${fmtDate(dueDate)} (${daysBetween(issueDate, dueDate)} days)` },
                { label: 'Fine if late', val: `₹${settings?.finePerDay || 2} per day after due date` },
              ].map(row => (
                <div key={row.label} style={{ fontSize: 12 }}>
                  <span style={{ color: '#64748b' }}>{row.label}: </span>
                  <span style={{ fontWeight: 600, color: '#1e3a8a' }}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Issue Button */}
          <button
            onClick={onIssue}
            disabled={!canIssue}
            style={{
              width: '100%', padding: '14px 0',
              background: canIssue ? '#1e40af' : '#94a3b8',
              color: '#fff', border: 'none', borderRadius: 12,
              fontSize: 15, fontWeight: 700, cursor: canIssue ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 150ms'
            }}
            onMouseEnter={e => { if (canIssue) e.currentTarget.style.background = '#1d4ed8'; }}
            onMouseLeave={e => { if (canIssue) e.currentTarget.style.background = '#1e40af'; }}
          >
            <BookPlus size={20} />
            {!canIssue && selectedMember?.fineBalance > 0 ? 'Clear Fine First' :
             !canIssue && selectedMember?.currentIssued >= selectedMember?.maxBooksAllowed ? 'Book Limit Reached' :
             'Issue Book'}
          </button>
        </div>
      )}

      {/* ── ISSUE SLIP MODAL ── */}
      {showSlip && lastIssue && (
        <IssueSlipModal
          issue={lastIssue}
          settings={settings}
          onClose={() => { setShowSlip(false); setLastIssue(null); }}
          onIssueAnother={() => { setShowSlip(false); setLastIssue(null); setSelectedMember(null); setSelectedBook(null); }}
        />
      )}
    </div>
  );
}

// ── Issue Slip Modal ───────────────────────────────────────
function IssueSlipModal({ issue, settings, onClose, onIssueAnother }) {
  const [animIn, setAnimIn] = useState(false);
  useEffect(() => { setTimeout(() => setAnimIn(true), 50); }, []);

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200, padding: 20,
      opacity: animIn ? 1 : 0, transition: 'opacity 250ms'
    }}>
      <style>{`
        @media print {
          body > * { display: none !important; }
          #issue-slip-print { display: block !important; position: fixed; top: 0; left: 0; width: 100%; }
        }
      `}</style>
      <div style={{
        background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', borderRadius: 20, padding: 28,
        maxWidth: 480, width: '100%', maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.20)',
        transform: animIn ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
        transition: 'all 300ms ease'
      }}>
        {/* Success header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: '#d1fae5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px', animation: 'scaleIn 400ms ease'
          }}>
            <CheckCircle size={32} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Book Issued Successfully!</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Issue ID: <strong>{issue.issueId}</strong></div>
        </div>

        {/* Slip content */}
        <div id="issue-slip-print" style={{ border: '2px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
          {/* Slip header */}
          <div style={{ background: '#1e40af', color: '#fff', padding: '14px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.05em' }}>JSK EDUCATIONAL FOUNDATION</div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>LIBRARY ISSUE SLIP</div>
          </div>

          {/* Issue meta */}
          <div style={{ background: '#f8fafc', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', fontSize: 12 }}>
            <span style={{ color: '#64748b' }}>Issue ID: <strong style={{ color: '#1e40af', fontFamily: 'monospace' }}>{issue.issueId}</strong></span>
            <span style={{ color: '#64748b' }}>Date: <strong style={{ color: '#0f172a' }}>{fmtDate(issue.issueDate)}</strong></span>
          </div>

          {/* Member details */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Member Details</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Name:</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{issue.member.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>ID:</span>
                <span style={{ fontWeight: 600, color: '#1e40af', fontFamily: 'monospace', fontSize: 11 }}>
                  {issue.member.memberId} · {issue.member.memberType === 'student' ? 'Student' : 'Teacher'} · {issue.member.classOrDesig}
                </span>
              </div>
            </div>
          </div>

          {/* Book details */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Book Details</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
              {[
                { label: 'Title', val: issue.book.title },
                { label: 'Book ID', val: issue.book.bookId },
                { label: 'Author', val: issue.book.author },
                { label: 'Rack', val: `${issue.book.rack} / ${issue.book.shelf}` },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>{row.label}:</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Due date */}
          <div style={{ padding: '12px 16px', background: '#fffbeb', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: '#92400e', fontWeight: 700 }}>⚠️ Due Date:</span>
              <span style={{ color: '#92400e', fontWeight: 800 }}>{fmtDate(issue.dueDate)}</span>
            </div>
            <div style={{ fontSize: 11, color: '#b45309', marginTop: 3 }}>Fine: ₹{settings?.finePerDay || 2} per day after due date</div>
          </div>

          {/* Signatures */}
          <div style={{ padding: '12px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {['Librarian Signature', 'Member Signature'].map(s => (
              <div key={s} style={{ textAlign: 'center' }}>
                <div style={{ borderTop: '1px solid #94a3b8', paddingTop: 6, fontSize: 11, color: '#94a3b8' }}>{s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => window.print()} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            border: '1px solid rgba(255, 255, 255, 0.6)', background: '#f8fafc', color: '#374151',
            borderRadius: 10, padding: '10px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer'
          }}>
            <Printer size={15} /> Print Slip
          </button>
          <button onClick={onIssueAnother} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            border: '1px solid #1e40af', background: '#eff6ff', color: '#1e40af',
            borderRadius: 10, padding: '10px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer'
          }}>
            <RefreshCw size={15} /> Issue Another
          </button>
          <button onClick={onClose} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', background: '#1e40af', color: '#fff',
            borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer'
          }}>
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
