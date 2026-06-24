import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { bookCategories, publishers } from '../../data/dummyData';
import { toast } from 'react-hot-toast';

const INPUT_STYLE = {
  width: '100%', height: 38, padding: '0 12px',
  border: '1.5px solid #e2e8f0', borderRadius: 9,
  fontSize: 13, fontWeight: 500, color: '#0f172a',
  background: '#f8fafc', outline: 'none',
  fontFamily: 'inherit', boxSizing: 'border-box',
  transition: 'border-color 0.15s, background 0.15s',
};

const TEXTAREA_STYLE = {
  ...INPUT_STYLE, height: 'auto', padding: '10px 12px',
  resize: 'none', lineHeight: 1.6,
};

export default function AddEditBookModal({ isOpen, onClose, book, onSave, allBooks }) {
  const [formData, setFormData] = useState({
    title: '', author: '', publisherId: '', categoryId: '', language: 'English',
    isbn: '', edition: '', pages: '', price: '', description: '',
    totalCopies: '', availableCopies: '', rack: '', shelf: 'Top', coverColor: '#3b82f6',
  });

  const colorSwatches = ['#8b5cf6', '#10b981', '#3b82f6', '#f97316', '#ef4444', '#06b6d4', '#f59e0b', '#ec4899'];

  useEffect(() => {
    if (book) {
      setFormData({ ...book });
    } else {
      setFormData({
        title: '', author: '', publisherId: '', categoryId: '', language: 'English',
        isbn: '', edition: '', pages: '', price: '', description: '',
        totalCopies: '', availableCopies: '', rack: '', shelf: 'Top', coverColor: '#3b82f6',
      });
    }
  }, [book, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (['totalCopies', 'availableCopies', 'pages', 'price', 'categoryId', 'publisherId'].includes(name)) {
      value = value ? Number(value) : '';
    }
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'totalCopies' && !book) next.availableCopies = value;
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.categoryId || !formData.price || !formData.totalCopies) {
      toast.error('Please fill all required fields');
      return;
    }
    let finalData = { ...formData };
    if (!book) {
      const maxId = allBooks.reduce((max, b) => {
        const num = parseInt(b.bookId.replace('LIB-B-', ''), 10);
        return num > max ? num : max;
      }, 0);
      finalData.bookId        = `LIB-B-${String(maxId + 1).padStart(4, '0')}`;
      finalData.id            = Date.now();
      finalData.addedOn       = new Date().toISOString().split('T')[0];
      finalData.isActive      = true;
      finalData.issuedCopies  = 0;
      finalData.lostCopies    = 0;
    }
    onSave(finalData);
  };

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', justifyContent: 'flex-end', background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(3px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#fff', width: '100%', maxWidth: 520, height: '100%', boxShadow: '0 0 40px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.25s ease-out' }}
      >

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1.5px solid #e2e8f0' }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {book ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button
            onClick={onClose}
            style={{ width: 34, height: 34, borderRadius: '50%', border: '1.5px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── FORM BODY ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <form id="book-form" onSubmit={handleSubmit}>

            {/* Section 1: Book Information */}
            <FormSection title="📚 Book Information">
              <FormField label="Book Title *">
                <input type="text" name="title" value={formData.title} onChange={handleChange} required style={INPUT_STYLE}
                  onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                />
              </FormField>

              <TwoCol>
                <FormField label="Author *">
                  <input type="text" name="author" value={formData.author} onChange={handleChange} required style={INPUT_STYLE}
                    onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                  />
                </FormField>
                <FormField label="Publisher">
                  <select name="publisherId" value={formData.publisherId} onChange={handleChange} style={INPUT_STYLE}
                    onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                  >
                    <option value="">Select Publisher</option>
                    {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </FormField>
              </TwoCol>

              <TwoCol>
                <FormField label="Category *">
                  <select name="categoryId" value={formData.categoryId} onChange={handleChange} required style={INPUT_STYLE}
                    onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                  >
                    <option value="">Select Category</option>
                    {bookCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </FormField>
                <FormField label="Language">
                  <select name="language" value={formData.language} onChange={handleChange} style={INPUT_STYLE}
                    onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Sanskrit">Sanskrit</option>
                    <option value="Other">Other</option>
                  </select>
                </FormField>
              </TwoCol>

              <TwoCol>
                <FormField label="ISBN">
                  <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} style={INPUT_STYLE}
                    onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                  />
                </FormField>
                <FormField label="Edition / Year">
                  <input type="text" name="edition" value={formData.edition} onChange={handleChange} style={INPUT_STYLE}
                    onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                  />
                </FormField>
              </TwoCol>

              <TwoCol>
                <FormField label="Total Pages">
                  <input type="number" name="pages" value={formData.pages} onChange={handleChange} style={INPUT_STYLE}
                    onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                  />
                </FormField>
                <FormField label="Price (₹) *">
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required style={INPUT_STYLE}
                    onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                  />
                </FormField>
              </TwoCol>

              <FormField label="Description">
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} style={TEXTAREA_STYLE}
                  onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                />
              </FormField>
            </FormSection>

            {/* Section 2: Stock & Location */}
            <FormSection title="📦 Stock & Location">
              <TwoCol>
                <FormField label="Total Copies *">
                  <input type="number" name="totalCopies" value={formData.totalCopies} onChange={handleChange} required style={INPUT_STYLE}
                    onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                  />
                </FormField>
                <FormField label="Available Copies *">
                  <input type="number" name="availableCopies" value={formData.availableCopies} onChange={handleChange} required style={INPUT_STYLE}
                    onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                  />
                </FormField>
              </TwoCol>

              <TwoCol>
                <FormField label="Rack *">
                  <input type="text" name="rack" value={formData.rack} onChange={handleChange} required placeholder="e.g. A-01" style={INPUT_STYLE}
                    onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                  />
                </FormField>
                <FormField label="Shelf *">
                  <select name="shelf" value={formData.shelf} onChange={handleChange} required style={INPUT_STYLE}
                    onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                  >
                    <option value="Top">Top</option>
                    <option value="Middle">Middle</option>
                    <option value="Bottom">Bottom</option>
                  </select>
                </FormField>
              </TwoCol>
            </FormSection>

            {/* Section 3: Cover Color */}
            <FormSection title="🎨 Cover Color">
              <div style={{ display: 'flex', gap: 10 }}>
                {colorSwatches.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, coverColor: color }))}
                    style={{
                      width: 34, height: 34, borderRadius: '50%', border: formData.coverColor === color ? '3px solid #0f172a' : '3px solid transparent',
                      background: color, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'transform 0.15s', transform: formData.coverColor === color ? 'scale(1.15)' : 'scale(1)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    }}
                  >
                    {formData.coverColor === color && <Check size={15} color="#fff" strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </FormSection>

          </form>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ padding: '16px 24px', borderTop: '1.5px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <FooterBtn label="Cancel" onClick={onClose} />
          <button
            type="submit" form="book-form"
            style={{ height: 40, padding: '0 20px', borderRadius: 10, border: 'none', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}
            onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
            onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}
          >
            {book ? 'Save Changes' : 'Save Book →'}
          </button>
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

function FormSection({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h3 style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', margin: '0 0 14px', paddingBottom: 10, borderBottom: '1.5px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function TwoCol({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {children}
    </div>
  );
}

function FooterBtn({ label, onClick }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ height: 40, padding: '0 18px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: hov ? '#f1f5f9' : '#fff', color: '#475569', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
    >
      {label}
    </button>
  );
}
