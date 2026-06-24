import React, { useState } from 'react';
import { Save, Settings, BookOpen, IndianRupee, Calendar, RefreshCw, Users, Library } from 'lucide-react';
import { toast } from 'react-hot-toast';

const WORKING_DAYS_ALL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function LibrarySettingsTab({ settings, setSettings, libStats }) {
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleDay = (day) => {
    setForm(f => ({
      ...f,
      workingDays: f.workingDays.includes(day)
        ? f.workingDays.filter(d => d !== day)
        : [...f.workingDays, day]
    }));
  };

  const handleSave = () => {
    setSettings({ ...form });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    toast.success('Library settings saved successfully!');
  };

  const handleReset = () => {
    setForm({ ...settings });
    toast('Settings reset to last saved values', { icon: '🔄' });
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', borderRadius: 16, padding: '20px 24px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid rgba(255, 255, 255, 0.8)', marginBottom: 16
  };
  const inputStyle = {
    padding: '9px 12px', border: '1px solid rgba(255, 255, 255, 0.6)', borderRadius: 9,
    fontSize: 13, color: '#374151', background: '#f8fafc', outline: 'none', width: '100%'
  };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 5, display: 'block' };
  const sectionTitle = (icon, title, sub) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: '#94a3b8' }}>{sub}</div>}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <style>{`
        .setting-input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 2px rgba(59,130,246,0.1); }
        .day-btn { padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: 2px solid #e2e8f0; background: #f8fafc; color: #64748b; transition: all 150ms; }
        .day-btn.active { border-color: #3b82f6; background: #eff6ff; color: #1e40af; }
        .toggle-wrap { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
        .toggle-wrap:last-child { border-bottom: none; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>Library Settings</h2>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>Configure circulation rules, fines, and working days</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleReset} style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid rgba(255, 255, 255, 0.6)', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', color: '#64748b', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            <RefreshCw size={13} /> Reset
          </button>
          <button onClick={handleSave} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: saved ? '#059669' : '#1e40af', color: '#fff', border: 'none',
            padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'background 300ms'
          }}>
            <Save size={14} /> {saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* ── SECTION 1: Circulation Settings ── */}
      <div style={cardStyle}>
        {sectionTitle(<BookOpen size={18} style={{ color: '#1e40af' }} />, 'Circulation Settings', 'Issue duration and book limits')}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <label style={labelStyle}>📅 Issue Duration — Students (days)</label>
            <input type="number" min="1" max="60" className="setting-input" style={inputStyle}
              value={form.issueDurationStudent} onChange={e => set('issueDurationStudent', Number(e.target.value))} />
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Books issued to students must be returned within these days</div>
          </div>
          <div>
            <label style={labelStyle}>📅 Issue Duration — Teachers (days)</label>
            <input type="number" min="1" max="90" className="setting-input" style={inputStyle}
              value={form.issueDurationTeacher} onChange={e => set('issueDurationTeacher', Number(e.target.value))} />
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Books issued to teachers must be returned within these days</div>
          </div>
          <div>
            <label style={labelStyle}>📚 Max Books — Students</label>
            <input type="number" min="1" max="10" className="setting-input" style={inputStyle}
              value={form.maxBooksStudent} onChange={e => set('maxBooksStudent', Number(e.target.value))} />
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Maximum books a student can borrow at once</div>
          </div>
          <div>
            <label style={labelStyle}>📚 Max Books — Teachers</label>
            <input type="number" min="1" max="15" className="setting-input" style={inputStyle}
              value={form.maxBooksTeacher} onChange={e => set('maxBooksTeacher', Number(e.target.value))} />
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Maximum books a teacher can borrow at once</div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: Fine Settings ── */}
      <div style={cardStyle}>
        {sectionTitle(<IndianRupee size={18} style={{ color: '#dc2626' }} />, 'Fine & Penalty Settings', 'Overdue fine configuration')}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <label style={labelStyle}>💰 Fine Per Day (₹)</label>
            <input type="number" min="0" max="100" className="setting-input" style={inputStyle}
              value={form.finePerDay} onChange={e => set('finePerDay', Number(e.target.value))} />
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Amount charged per day after the due date</div>
          </div>
          <div>
            <label style={labelStyle}>⏳ Grace Period (days)</label>
            <input type="number" min="0" max="10" className="setting-input" style={inputStyle}
              value={form.graceDays} onChange={e => set('graceDays', Number(e.target.value))} />
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Days before fine starts after due date (0 = no grace)</div>
          </div>
        </div>

        {/* Preview */}
        <div style={{ marginTop: 16, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 14px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#991b1b', marginBottom: 8 }}>💡 Fine Preview</div>
          <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#7f1d1d' }}>
            <span>1 week overdue → <strong>₹{Math.max(0, 7 - form.graceDays) * form.finePerDay}</strong></span>
            <span>2 weeks overdue → <strong>₹{Math.max(0, 14 - form.graceDays) * form.finePerDay}</strong></span>
            <span>1 month overdue → <strong>₹{Math.max(0, 30 - form.graceDays) * form.finePerDay}</strong></span>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: Renewal Settings ── */}
      <div style={cardStyle}>
        {sectionTitle(<RefreshCw size={18} style={{ color: '#8b5cf6' }} />, 'Renewal Settings', 'Book renewal rules')}

        <div className="toggle-wrap">
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Allow Book Renewals</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Members can renew books before the due date</div>
          </div>
          <button
            onClick={() => set('renewalAllowed', !form.renewalAllowed)}
            style={{
              width: 48, height: 26, borderRadius: 999, border: 'none', cursor: 'pointer',
              background: form.renewalAllowed ? '#1e40af' : '#e2e8f0',
              transition: 'background 200ms', position: 'relative'
            }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)',
              position: 'absolute', top: 3,
              left: form.renewalAllowed ? 24 : 4,
              transition: 'left 200ms',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }} />
          </button>
        </div>

        {form.renewalAllowed && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 16 }}>
            <div>
              <label style={labelStyle}>🔢 Max Renewals Per Issue</label>
              <input type="number" min="1" max="5" className="setting-input" style={inputStyle}
                value={form.maxRenewals} onChange={e => set('maxRenewals', Number(e.target.value))} />
            </div>
            <div>
              <label style={labelStyle}>📅 Renewal Extension (days)</label>
              <input type="number" min="1" max="30" className="setting-input" style={inputStyle}
                value={form.renewalDays} onChange={e => set('renewalDays', Number(e.target.value))} />
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 4: Working Days ── */}
      <div style={cardStyle}>
        {sectionTitle(<Calendar size={18} style={{ color: '#059669' }} />, 'Working Days', 'Days when library is open')}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {WORKING_DAYS_ALL.map(day => (
            <button
              key={day}
              className={`day-btn ${form.workingDays.includes(day) ? 'active' : ''}`}
              onClick={() => toggleDay(day)}>
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 10 }}>
          {form.workingDays.length} days selected: {form.workingDays.join(', ')}
        </div>
      </div>

      {/* ── SECTION 5: Library Stats Summary ── */}
      {libStats && (
        <div style={cardStyle}>
          {sectionTitle(<Library size={18} style={{ color: '#f59e0b' }} />, 'Current Library Status', 'Live snapshot of library')}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { label: 'Total Books', val: libStats.totalBooks, icon: '📚', color: '#1e40af', bg: '#eff6ff' },
              { label: 'Available Copies', val: libStats.available, icon: '✅', color: '#059669', bg: '#f0fdf4' },
              { label: 'Issued', val: libStats.issued, icon: '📤', color: '#d97706', bg: '#fffbeb' },
              { label: 'Overdue', val: libStats.overdue, icon: '⚠️', color: '#dc2626', bg: '#fef2f2' },
              { label: 'Total Members', val: libStats.totalMembers, icon: '👥', color: '#7c3aed', bg: '#f5f3ff' },
              { label: 'Students', val: libStats.studentMembers, icon: '🎓', color: '#0369a1', bg: '#f0f9ff' },
              { label: 'Teachers', val: libStats.teacherMembers, icon: '👨‍🏫', color: '#6d28d9', bg: '#f5f3ff' },
              { label: 'Fine Pending', val: `₹${libStats.pendingFine}`, icon: '💰', color: '#be123c', bg: '#fff1f2' },
            ].map(s => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>{s.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color, marginTop: 4 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save button (sticky bottom) */}
      <div style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', borderTop: '1px solid #f1f5f9', padding: '14px 0', display: 'flex', justifyContent: 'flex-end', gap: 10, position: 'sticky', bottom: 0 }}>
        <button onClick={handleReset} style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid rgba(255, 255, 255, 0.6)', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', color: '#64748b', padding: '9px 18px', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <RefreshCw size={13} /> Reset Changes
        </button>
        <button onClick={handleSave} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: saved ? '#059669' : '#1e40af', color: '#fff', border: 'none',
          padding: '9px 24px', borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'background 300ms'
        }}>
          <Save size={15} /> {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
