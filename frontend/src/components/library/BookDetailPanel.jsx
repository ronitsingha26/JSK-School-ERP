import React from 'react';
import { X, BookOpen, Edit2, Camera, CornerUpRight, Clock } from 'lucide-react';
import { bookCategories } from '../../data/dummyData';
import { toast } from 'react-hot-toast';

export default function BookDetailPanel({ isOpen, onClose, book, issues, members, onEdit, onIssue }) {
  if (!isOpen || !book) return null;

  const category = bookCategories.find(c => c.id === book.categoryId);
  const currentIssues = issues.filter(i => i.bookId === book.id && i.status !== 'returned');
  const pastIssues = [...issues].reverse().filter(i => i.bookId === book.id && i.status === 'returned').slice(0, 5);

  const formatDate = (ds) => new Date(ds).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const availPct  = book.totalCopies > 0 ? (book.availableCopies / book.totalCopies) * 100 : 0;
  const issuedPct = book.totalCopies > 0 ? (book.issuedCopies   / book.totalCopies) * 100 : 0;
  const lostPct   = book.totalCopies > 0 ? (book.lostCopies     / book.totalCopies) * 100 : 0;

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', justifyContent: 'flex-end', background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(3px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#fff', width: '100%', maxWidth: 640, height: '100%', boxShadow: '0 0 40px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.25s ease-out' }}
      >

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '18px 24px', borderBottom: '1.5px solid #e2e8f0' }}>
          <div style={{ flex: 1, paddingRight: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>{book.title}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <span style={{ background: '#eff6ff', color: '#2563eb', fontFamily: 'monospace', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, border: '1px solid #bfdbfe' }}>
                {book.bookId}
              </span>
              {category && (
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: `${category.color}18`, color: category.color }}>
                  📚 {category.name}
                </span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <PanelBtn label="Edit Book" icon={<Edit2 size={13} />} onClick={() => onEdit(book)} />
            <button
              onClick={onClose}
              style={{ width: 34, height: 34, borderRadius: '50%', border: '1.5px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#475569'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#94a3b8'; }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex' }}>

          {/* LEFT SIDEBAR */}
          <div style={{ width: '38%', flexShrink: 0, padding: '20px 20px', borderRight: '1.5px solid #f1f5f9', background: '#fafbfc', display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Cover */}
            <div style={{ width: '100%', aspectRatio: '4/5', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: `${book.coverColor}18`, border: `1.5px solid ${book.coverColor}30` }}>
              <BookOpen size={60} color={book.coverColor} />
              {category && (
                <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.95)', padding: '3px 7px', borderRadius: 6, fontSize: 10, fontWeight: 800, color: category.color, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
                  {category.name.substring(0, 3).toUpperCase()}
                </div>
              )}
            </div>

            {/* Availability */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: '1.5px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>
                <span>Copies</span><span>{book.totalCopies} Total</span>
              </div>
              {[
                { label: 'Available', value: book.availableCopies, color: '#059669' },
                { label: 'Issued',    value: book.issuedCopies,   color: '#d97706' },
                { label: 'Lost',      value: book.lostCopies,     color: '#dc2626' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: r.color, marginBottom: 6 }}>
                  <span>{r.label}:</span><span>{r.value} copies</span>
                </div>
              ))}
              {/* Progress bar */}
              <div style={{ height: 6, borderRadius: 99, background: '#e2e8f0', overflow: 'hidden', display: 'flex', marginTop: 10 }}>
                <div style={{ width: `${availPct}%`,  background: '#059669', height: '100%', transition: 'width 0.4s' }} />
                <div style={{ width: `${issuedPct}%`, background: '#d97706', height: '100%', transition: 'width 0.4s' }} />
                <div style={{ width: `${lostPct}%`,   background: '#dc2626', height: '100%', transition: 'width 0.4s' }} />
              </div>
              <button
                disabled={book.availableCopies === 0}
                onClick={() => onIssue(book)}
                style={{
                  width: '100%', marginTop: 14, height: 38, borderRadius: 10, border: 'none',
                  background: book.availableCopies === 0 ? '#e2e8f0' : '#2563eb',
                  color: book.availableCopies === 0 ? '#94a3b8' : '#fff',
                  fontSize: 13, fontWeight: 700, cursor: book.availableCopies === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  fontFamily: 'inherit', transition: 'all 0.2s',
                  boxShadow: book.availableCopies > 0 ? '0 2px 8px rgba(37,99,235,0.3)' : 'none',
                }}
              >
                <CornerUpRight size={15} /> Issue Book
              </button>
            </div>

            {/* Location */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: '1.5px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Location</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 10 }}>
                📍 Rack: {book.rack} / {book.shelf} Shelf
              </div>
              <button
                onClick={() => toast('Coming soon!', { icon: '📸' })}
                style={{ width: '100%', height: 32, borderRadius: 8, border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit' }}
              >
                <Camera size={13} /> View Shelf Photo
              </button>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 22, overflowY: 'auto' }}>

            {/* Details */}
            <Section title="Details">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {[
                    ['Author',    book.author],
                    ['Publisher', book.publisher],
                    ['ISBN',      book.isbn || 'N/A'],
                    ['Edition',   book.edition],
                    ['Language',  book.language],
                    ['Pages',     book.pages],
                    ['Price',     `₹${book.price}`],
                    ['Added On',  formatDate(book.addedOn)],
                  ].map(([label, val]) => (
                    <tr key={label} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 0', fontSize: 12, color: '#94a3b8', fontWeight: 600, width: '35%' }}>{label}</td>
                      <td style={{ padding: '8px 0', fontSize: 13, color: '#0f172a', fontWeight: 600 }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>

            {/* Description */}
            <Section title="Description">
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#475569', lineHeight: 1.7, border: '1px solid #f1f5f9' }}>
                {book.description || 'No description available for this book.'}
              </div>
            </Section>

            {/* Currently Issued */}
            <Section title="Currently Issued To">
              {currentIssues.length === 0 ? (
                <p style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>Not issued to anyone currently.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {currentIssues.map(issue => {
                    const member = members.find(m => m.id === issue.memberId);
                    if (!member) return null;
                    return (
                      <div key={issue.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1.5px solid #e2e8f0', padding: '10px 14px', borderRadius: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: member.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                            {member.avatar}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{member.name}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Due: {formatDate(issue.dueDate)}</div>
                          {issue.status === 'overdue' && (
                            <div style={{ fontSize: 10, color: '#dc2626', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>Overdue</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Section>

            {/* Past Issues */}
            {pastIssues.length > 0 && (
              <Section title="Recent Issue History">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {pastIssues.map((issue, i) => {
                    const member = members.find(m => m.id === issue.memberId);
                    return (
                      <div key={issue.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < pastIssues.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>{member?.name || 'Unknown'}</span>
                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Returned: {formatDate(issue.returnDate)}</span>
                      </div>
                    );
                  })}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', margin: '0 0 10px', paddingBottom: 8, borderBottom: '1.5px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function PanelBtn({ label, icon, onClick }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        height: 34, padding: '0 12px', borderRadius: 9,
        border: '1.5px solid #e2e8f0',
        background: hov ? '#f1f5f9' : '#fff',
        color: hov ? '#0f172a' : '#475569',
        fontSize: 12, fontWeight: 700, cursor: 'pointer',
        fontFamily: 'inherit', transition: 'all 0.15s',
      }}
    >
      {icon} {label}
    </button>
  );
}
