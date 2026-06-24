import React, { useState } from 'react';
import { Library, BookCheck, BookOpen, AlertTriangle, Users, BookX, ArrowRight, Bell, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const fade = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.28 } } };

export default function LibraryDashboard({ libStats, issues, books, members, setActiveTab }) {

  const [hoverRow, setHoverRow] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const recentIssues = [...issues].reverse().filter(i => i.status !== 'returned').slice(0, 5);
  const overdueIssues = issues.filter(i => i.status === 'overdue');

  const todayStr = new Date().toISOString().split('T')[0];
  const issuesToday   = issues.filter(i => i.issueDate   === todayStr).length;
  const returnsToday  = issues.filter(i => i.returnDate  === todayStr).length;
  const newMembersToday = members.filter(m => m.joinDate  === todayStr).length;

  const donutData = [
    { name: 'Available', value: libStats.available, color: '#10b981' },
    { name: 'Issued',    value: libStats.issued,    color: '#2563eb' },
    { name: 'Overdue',   value: libStats.overdue,   color: '#ef4444' },
  ];

  const catNames = {
    1: 'Mathematics', 2: 'Science', 3: 'English Lit',
    4: 'Hindi Lit',   5: 'Social Science', 6: 'Computer Science', 10: 'Story / Fiction',
  };
  const categoryCounts = {};
  books.forEach(b => {
    const k = b.categoryId;
    if (!categoryCounts[k]) categoryCounts[k] = 0;
    categoryCounts[k] += b.totalCopies;
  });
  const topCategories = Object.keys(categoryCounts)
    .map(k => ({ id: k, name: catNames[k] || `Category ${k}`, copies: categoryCounts[k] }))
    .sort((a, b) => b.copies - a.copies)
    .slice(0, 4);
  const maxCat = Math.max(...topCategories.map(c => c.copies), 1);

  const statsCards = [
    { label: 'TOTAL BOOKS',  value: libStats.totalBooks,  icon: Library,        color: '#2563eb', bg: '#dbeafe', sub: `${libStats.lostBooks} lost` },
    { label: 'AVAILABLE',    value: libStats.available,   icon: BookCheck,      color: '#059669', bg: '#d1fae5', sub: 'Ready to issue' },
    { label: 'ISSUED',       value: libStats.issued,      icon: BookOpen,       color: '#d97706', bg: '#fef3c7', sub: 'Currently out' },
    { label: 'OVERDUE',      value: libStats.overdue,     icon: AlertTriangle,  color: '#dc2626', bg: '#fee2e2', sub: `₹${libStats.pendingFine} fine pending` },
  ];

  return (
    <motion.div
      initial="hidden" animate="show"
      variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      style={{ paddingBottom: 40 }}
    >

      {/* ── STAT CARDS ── */}
      <motion.div variants={fade} style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {statsCards.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18,
              padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              borderTop: `3px solid ${s.color}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
                <div style={{ width: 48, height: 48, borderRadius: 13, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={22} color={s.color} />
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', marginTop: 5, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginTop: 4, paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>{s.sub}</div>
            </div>
          );
        })}
      </motion.div>

      {/* ── OVERDUE BANNER ── */}
      {overdueIssues.length > 0 && (
        <motion.div variants={fade} style={{
          background: '#fef2f2', border: '1px solid #fecaca',
          borderLeft: '4px solid #ef4444', borderRadius: 16,
          padding: '16px 22px', marginBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertTriangle size={18} color="#dc2626" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#7f1d1d', marginBottom: 3 }}>
                Action Required: {overdueIssues.length} Overdue Book{overdueIssues.length > 1 ? 's' : ''}
              </div>
              <p style={{ fontSize: 12, fontWeight: 500, color: '#991b1b', margin: 0 }}>
                Please send reminders to clear pending dues of ₹{libStats.pendingFine}.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('overdue')}
            style={{
              height: 36, padding: '0 16px', borderRadius: 9, border: 'none',
              background: '#dc2626', color: '#fff', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
              boxShadow: '0 2px 8px rgba(220,38,38,0.3)',
            }}
          >
            View Overdue Details
          </button>
        </motion.div>
      )}

      {/* ── MAIN 2-COL GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

        {/* LEFT: RECENT ISSUES TABLE */}
        <motion.div variants={fade} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '18px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>Recent Book Issues</p>
            <button
              onClick={() => setActiveTab('history')}
              style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              VIEW HISTORY <ArrowRight size={14} />
            </button>
          </div>

          {recentIssues.length === 0 ? (
            <div style={{ padding: '48px 22px', textAlign: 'center', color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>
              No active issues found.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#fafbfc', borderBottom: '1.5px solid #e2e8f0' }}>
                    {['BOOK TITLE', 'MEMBER INFO', 'TIMELINE', 'STATUS'].map(h => (
                      <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentIssues.map(issue => {
                    const book   = books.find(b => b.id === issue.bookId);
                    const member = members.find(m => m.id === issue.memberId);
                    if (!book || !member) return null;

                    const due      = new Date(issue.dueDate);
                    const daysDiff = Math.ceil((due - new Date()) / (1000 * 60 * 60 * 24));
                    let dueText  = `Due in ${daysDiff} days`;
                    let dueColor = '#64748b';
                    if (issue.status === 'overdue') { dueText = `${Math.abs(daysDiff)} days late`; dueColor = '#dc2626'; }
                    else if (daysDiff <= 0) { dueText = 'Due Today'; dueColor = '#d97706'; }

                    const isHov = hoverRow === issue.id;

                    return (
                      <tr
                        key={issue.id}
                        onMouseEnter={() => setHoverRow(issue.id)}
                        onMouseLeave={() => setHoverRow(null)}
                        style={{ borderBottom: '1px solid #f1f5f9', background: isHov ? '#fafbfe' : 'transparent', transition: 'background 0.15s' }}
                      >
                        {/* BOOK */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${book.coverColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <BookOpen size={16} color={book.coverColor} />
                            </div>
                            <div style={{ maxWidth: 180, overflow: 'hidden' }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={book.title}>{book.title}</div>
                              <div style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.author}</div>
                            </div>
                          </div>
                        </td>

                        {/* MEMBER */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: member.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                              {member.avatar}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{member.name}</div>
                              <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{member.memberType}</div>
                            </div>
                          </div>
                        </td>

                        {/* TIMELINE */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{formatDate(issue.issueDate)}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                            <Clock size={11} color={dueColor} />
                            <span style={{ fontSize: 11, fontWeight: 600, color: dueColor }}>{dueText}</span>
                          </div>
                        </td>

                        {/* STATUS */}
                        <td style={{ padding: '14px 16px' }}>
                          {issue.status === 'issued' && (
                            <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 99, background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', letterSpacing: '0.05em' }}>ISSUED</span>
                          )}
                          {issue.status === 'overdue' && (
                            <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 99, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', letterSpacing: '0.05em' }}>OVERDUE</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ padding: '12px 22px', borderTop: '1px solid #f1f5f9' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', margin: 0 }}>
              Showing {recentIssues.length} active issues
            </p>
          </div>
        </motion.div>

        {/* RIGHT SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* TODAY'S ACTIVITY */}
          <motion.div variants={fade} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Today's Activity</p>
            </div>
            <div style={{ padding: '16px 20px' }}>
              {[
                { label: 'Books Issued',   value: issuesToday,    color: '#2563eb', bg: '#dbeafe' },
                { label: 'Books Returned', value: returnsToday,   color: '#059669', bg: '#d1fae5' },
                { label: 'New Members',    value: newMembersToday, color: '#7c3aed', bg: '#ede9fe' },
                { label: 'Fine Collected', value: '₹0',           color: '#d97706', bg: '#fef3c7' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 3 ? '1px solid #f8fafc' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* TOP CATEGORIES */}
          <motion.div variants={fade} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Top Categories</p>
            </div>
            <div style={{ padding: '16px 20px' }}>
              {topCategories.map((cat, i) => (
                <div key={cat.id} style={{ marginBottom: i < topCategories.length - 1 ? 14 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                    <span>{cat.name}</span>
                    <span style={{ color: '#94a3b8' }}>{cat.copies} books</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: '#e2e8f0', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(cat.copies / maxCat) * 100}%` }}
                      transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.1 }}
                      style={{ height: '100%', borderRadius: 99, background: '#2563eb' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CATALOG AVAILABILITY DONUT */}
          <motion.div variants={fade} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Catalog Availability</p>
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ height: 200, width: '100%', position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%" cy="50%"
                      innerRadius={65} outerRadius={85}
                      paddingAngle={3} dataKey="value"
                      stroke="none" cornerRadius={5}
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontWeight: 600, fontSize: 13 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{libStats.totalCopies}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>Total Copies</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 8 }}>
                {donutData.map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>{d.name}: {d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
