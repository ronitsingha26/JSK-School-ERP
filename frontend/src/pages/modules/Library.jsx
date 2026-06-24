import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { BookPlus, CornerDownLeft, PlusCircle, LayoutDashboard, BookOpen, Users, ClipboardList, AlertTriangle, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import {
  booksData,
  libraryMembers,
  bookIssues,
  librarySettings
} from '../../data/dummyData';

// Subcomponents (tabs)
import LibraryDashboard from '../../components/library/LibraryDashboard';
import BookCatalog from '../../components/library/BookCatalog';
import MembersTab from '../../components/library/MembersTab';
import IssueBookTab from '../../components/library/IssueBookTab';
import ReturnBookTab from '../../components/library/ReturnBookTab';
import IssueHistoryTab from '../../components/library/IssueHistoryTab';
import OverdueTab from '../../components/library/OverdueTab';
import LibrarySettingsTab from '../../components/library/LibrarySettingsTab';

// Modals
import AddEditBookModal from '../../components/library/AddEditBookModal';
import BookDetailPanel from '../../components/library/BookDetailPanel';

export default function Library({ defaultTab = 'dashboard' }) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const [books, setBooks] = useState(booksData);
  const [members, setMembers] = useState(libraryMembers);
  const [issues, setIssues] = useState(bookIssues);
  const [settings, setSettings] = useState(librarySettings);

  const today = new Date().toISOString().split('T')[0];

  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [issueDate, setIssueDate] = useState(today);
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (selectedMember && settings) {
      const isTeacher = selectedMember.memberType === 'teacher';
      const days = isTeacher ? settings.issueDurationTeacher : settings.issueDurationStudent;
      const d = new Date(issueDate);
      d.setDate(d.getDate() + days);
      setDueDate(d.toISOString().split('T')[0]);
    }
  }, [selectedMember, issueDate, settings]);

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [returnDate, setReturnDate] = useState(today);
  const [bookCondition, setBookCondition] = useState('good');
  const [damageFine, setDamageFine] = useState(0);
  const [fineCollected, setFineCollected] = useState(0);
  const [fineMode, setFineMode] = useState('cash');

  const [catalogSearch, setCatalogSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [issueSearch, setIssueSearch] = useState('');
  const [historySearch, setHistorySearch] = useState('');

  const [catalogFilters, setCatalogFilters] = useState({ category: '', language: '', availability: '', rack: '' });
  const [memberFilters, setMemberFilters] = useState({ type: '', status: '', hasFine: '' });
  const [historyFilters, setHistoryFilters] = useState({ status: '', type: '', dateFrom: '', dateTo: '' });

  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showEditBookModal, setShowEditBookModal] = useState(false);
  const [showBookDetail, setShowBookDetail] = useState(false);
  const [showMemberDetail, setShowMemberDetail] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showIssueSlip, setShowIssueSlip] = useState(false);
  const [showReturnReceipt, setShowReturnReceipt] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [targetBook, setTargetBook] = useState(null);
  const [targetMember, setTargetMember] = useState(null);
  const [targetIssue, setTargetIssue] = useState(null);

  const handleIssueBook = (formData) => {
    const newIssueId = `LIB-I-${String(issues.length + 1).padStart(4, '0')}`;
    const newIssue = {
      id: issues.length + 1,
      issueId: newIssueId,
      bookId: selectedBook.id,
      memberId: selectedMember.id,
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      returnDate: null,
      finePerDay: settings.finePerDay,
      fineAmount: 0,
      finePaid: false,
      status: 'issued',
      issuedBy: 'Admin',
      returnedTo: null,
      remarks: formData.remarks || '',
    };
    setIssues(prev => [...prev, newIssue]);
    setBooks(prev => prev.map(b =>
      b.id === selectedBook.id
        ? { ...b, availableCopies: b.availableCopies - 1, issuedCopies: b.issuedCopies + 1 }
        : b
    ));
    setMembers(prev => prev.map(m =>
      m.id === selectedMember.id ? { ...m, currentIssued: m.currentIssued + 1 } : m
    ));
    setShowIssueSlip(true);
    toast.success(`Book issued: ${newIssueId}`);
  };

  const handleReturnBook = (formData) => {
    const issue = selectedIssue;
    if (!issue) return;
    const dDate = new Date(issue.dueDate);
    const rDate = new Date(formData.returnDate);
    const overdueDays = Math.max(0, Math.floor((rDate - dDate) / (1000 * 60 * 60 * 24)) - settings.graceDays);
    const overdFine = overdueDays * settings.finePerDay;
    const totalFine = overdFine + formData.damageFine;
    setIssues(prev => prev.map(i =>
      i.id === issue.id
        ? { ...i, returnDate: formData.returnDate, fineAmount: totalFine, finePaid: formData.fineCollected >= totalFine, status: formData.condition === 'lost' ? 'lost' : 'returned', returnedTo: 'Admin', remarks: formData.remarks || '' }
        : i
    ));
    setBooks(prev => prev.map(b =>
      b.id === issue.bookId
        ? { ...b, availableCopies: formData.condition !== 'lost' ? b.availableCopies + 1 : b.availableCopies, issuedCopies: b.issuedCopies - 1, lostCopies: formData.condition === 'lost' ? b.lostCopies + 1 : b.lostCopies }
        : b
    ));
    setMembers(prev => prev.map(m =>
      m.id === issue.memberId
        ? { ...m, currentIssued: Math.max(0, m.currentIssued - 1), fineBalance: m.fineBalance + Math.max(0, totalFine - formData.fineCollected) }
        : m
    ));
    setShowReturnReceipt(true);
    toast.success('Book returned successfully!');
  };

  const handleRenewBook = (issueId, newDueDate) => {
    setIssues(prev => prev.map(i => i.id === issueId ? { ...i, dueDate: newDueDate, status: 'issued' } : i));
    toast.success(`Book renewed until ${newDueDate}`);
    setShowRenewalModal(false);
  };

  const libStats = useMemo(() => ({
    totalBooks:     books.length,
    totalCopies:    books.reduce((s, b) => s + b.totalCopies, 0),
    available:      books.reduce((s, b) => s + b.availableCopies, 0),
    issued:         issues.filter(i => i.status === 'issued').length,
    overdue:        issues.filter(i => i.status === 'overdue').length,
    totalMembers:   members.length,
    studentMembers: members.filter(m => m.memberType === 'student').length,
    teacherMembers: members.filter(m => m.memberType === 'teacher').length,
    pendingFine:    issues.reduce((s, i) => s + (i.finePaid ? 0 : i.fineAmount), 0),
    lostBooks:      books.reduce((s, b) => s + b.lostCopies, 0),
  }), [books, issues, members]);

  const TABS = [
    { id: 'dashboard', label: 'Dashboard',    icon: LayoutDashboard },
    { id: 'catalog',   label: 'Book Catalog', icon: BookOpen },
    { id: 'members',   label: 'Members',      icon: Users },
    { id: 'issue',     label: 'Issue Book',   icon: BookPlus },
    { id: 'return',    label: 'Return Book',  icon: CornerDownLeft },
    { id: 'history',   label: 'Issue History',icon: ClipboardList },
    { id: 'overdue',   label: 'Overdue',      icon: AlertTriangle },
    { id: 'settings',  label: 'Settings',     icon: SettingsIcon },
  ];

  return (
    <div style={{ padding: '32px 36px', minHeight: '100vh', background: '#f8fafc' }}>

      {/* ── HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>
            Library Management
          </h1>
          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 6, fontWeight: 500 }}>
            Manage books, members, issues &amp; returns · 2025-26
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <LibHeaderBtn
            icon={<BookPlus size={17} />}
            label="Issue Book"
            primary
            onClick={() => { setActiveTab('issue'); navigate('/library/issue'); }}
          />
          <LibHeaderBtn
            icon={<CornerDownLeft size={17} />}
            label="Return Book"
            onClick={() => { setActiveTab('return'); navigate('/library/return'); }}
          />
          <LibHeaderBtn
            icon={<PlusCircle size={17} />}
            label="Add Book"
            onClick={() => setShowAddBookModal(true)}
          />
        </div>
      </div>

      {/* ── TAB NAV ── */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 28,
        padding: 6, background: '#fff',
        border: '1.5px solid #e2e8f0', borderRadius: 14,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        width: 'fit-content', overflowX: 'auto',
      }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'issue') navigate('/library/issue');
                else if (tab.id === 'return') navigate('/library/return');
                else navigate('/library');
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '8px 16px', borderRadius: 9, border: 'none',
                fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                background: isActive ? '#2563eb' : 'transparent',
                color: isActive ? '#fff' : '#64748b',
                boxShadow: isActive ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
              }}
            >
              <Icon size={15} color={isActive ? '#fff' : '#94a3b8'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── TAB CONTENT ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          {activeTab === 'dashboard' && (
            <LibraryDashboard
              libStats={libStats}
              issues={issues}
              books={books}
              members={members}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'catalog' && (
            <BookCatalog
              books={books}
              setBooks={setBooks}
              search={catalogSearch}
              setSearch={setCatalogSearch}
              filters={catalogFilters}
              setFilters={setCatalogFilters}
              setShowAddModal={setShowAddBookModal}
              setTargetBook={setTargetBook}
              setShowEditModal={setShowEditBookModal}
              setShowDetail={setShowBookDetail}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'members' && (
            <MembersTab
              members={members}
              setMembers={setMembers}
              search={memberSearch}
              setSearch={setMemberSearch}
              filters={memberFilters}
              setFilters={setMemberFilters}
              setShowAddModal={setShowAddMember}
              setTargetMember={setTargetMember}
              setShowDetail={setShowMemberDetail}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'issue' && (
            <IssueBookTab
              books={books}
              members={members}
              issues={issues}
              settings={settings}
              selectedMember={selectedMember}
              setSelectedMember={setSelectedMember}
              selectedBook={selectedBook}
              setSelectedBook={setSelectedBook}
              issueDate={issueDate}
              setIssueDate={setIssueDate}
              dueDate={dueDate}
              setDueDate={setDueDate}
              handleIssueBook={handleIssueBook}
            />
          )}
          {activeTab === 'return' && (
            <ReturnBookTab
              issues={issues}
              books={books}
              members={members}
              settings={settings}
              selectedIssue={selectedIssue}
              setSelectedIssue={setSelectedIssue}
              returnDate={returnDate}
              setReturnDate={setReturnDate}
              bookCondition={bookCondition}
              setBookCondition={setBookCondition}
              damageFine={damageFine}
              setDamageFine={setDamageFine}
              fineCollected={fineCollected}
              setFineCollected={setFineCollected}
              fineMode={fineMode}
              setFineMode={setFineMode}
              handleReturnBook={handleReturnBook}
            />
          )}
          {activeTab === 'history' && (
            <IssueHistoryTab
              issues={issues}
              books={books}
              members={members}
              search={historySearch}
              setSearch={setHistorySearch}
              filters={historyFilters}
              setFilters={setHistoryFilters}
              setTargetIssue={setTargetIssue}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'overdue' && (
            <OverdueTab
              issues={issues}
              books={books}
              members={members}
              settings={settings}
              setActiveTab={setActiveTab}
              setShowRenewalModal={setShowRenewalModal}
              setTargetIssue={setTargetIssue}
            />
          )}
          {activeTab === 'settings' && (
            <LibrarySettingsTab
              settings={settings}
              setSettings={setSettings}
              libStats={libStats}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── MODALS ── */}
      <AddEditBookModal
        isOpen={showAddBookModal || showEditBookModal}
        onClose={() => { setShowAddBookModal(false); setShowEditBookModal(false); setTargetBook(null); }}
        book={showEditBookModal ? targetBook : null}
        allBooks={books}
        onSave={(data) => {
          if (showEditBookModal) {
            setBooks(prev => prev.map(b => b.id === data.id ? data : b));
            toast.success('Book updated successfully!');
          } else {
            setBooks(prev => [data, ...prev]);
            toast.success('Book added successfully!');
          }
          setShowAddBookModal(false);
          setShowEditBookModal(false);
          setTargetBook(null);
        }}
      />
      <BookDetailPanel
        isOpen={showBookDetail}
        onClose={() => { setShowBookDetail(false); setTargetBook(null); }}
        book={targetBook}
        issues={issues}
        members={members}
        onEdit={(book) => { setShowBookDetail(false); setTargetBook(book); setShowEditBookModal(true); }}
        onIssue={(book) => { setShowBookDetail(false); setTargetBook(book); setActiveTab('issue'); }}
      />
    </div>
  );
}

function LibHeaderBtn({ icon, label, onClick, primary = false }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        height: 44, padding: '0 20px', borderRadius: 12, border: primary ? 'none' : '1.5px solid #e2e8f0',
        background: primary ? (hov ? '#1d4ed8' : '#2563eb') : (hov ? '#f8fafc' : '#fff'),
        color: primary ? '#fff' : '#475569',
        fontSize: 14, fontWeight: 700,
        cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
        boxShadow: primary ? '0 4px 14px rgba(37,99,235,0.35)' : '0 1px 3px rgba(0,0,0,0.04)',
        transform: hov ? 'translateY(-1px)' : 'none',
        transition: 'all 0.2s',
      }}
    >
      {icon} {label}
    </button>
  );
}