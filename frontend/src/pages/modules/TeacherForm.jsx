import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft, Check, Camera, X, User, Briefcase,
  IndianRupee, FileText, ChevronDown, Plus
} from 'lucide-react';
import {
  teachersData, subjects, classes,
  departments, designations,
} from '../../data/dummyData';

// ──────────────────────────────────────────────
// numberToWords — Indian system
// ──────────────────────────────────────────────
const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function numToWords(n) {
  if (n === 0) return 'Zero';
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
  if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
  if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
  if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
  return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
}
const numberToWords = (n) => {
  const num = parseInt(n) || 0;
  return num === 0 ? 'Zero Only' : numToWords(num) + ' Only';
};

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
const calcAge = (dob) => {
  if (!dob) return null;
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};

const BANK_SUGGESTIONS = ['State Bank of India', 'Punjab National Bank', 'Bank of India', 'UCO Bank', 'Axis Bank', 'HDFC Bank', 'ICICI Bank', 'Canara Bank'];
const STATES = ['Bihar', 'Uttar Pradesh', 'Jharkhand', 'West Bengal', 'Delhi', 'Maharashtra', 'Rajasthan', 'Madhya Pradesh', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Other'];

const INPUT = {
  width: '100%', border: '1px solid #e2e8f0', borderRadius: 10, background: '#f8fafc',
  padding: '9px 12px', fontSize: 13, color: '#0f172a', outline: 'none',
  fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 150ms',
};
const LABEL = { fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4, display: 'block' };
const ERR   = { fontSize: 11, color: '#ef4444', marginTop: 3 };

const Field = ({ label, required, error, children }) => (
  <div>
    <label style={LABEL}>{label}{required && <span style={{ color: '#ef4444' }}> *</span>}</label>
    {children}
    {error && <div style={ERR}>{error}</div>}
  </div>
);

const RadioPill = ({ name, value, checked, onChange, label }) => (
  <label style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '6px 14px', borderRadius: 999, cursor: 'pointer', fontSize: 13,
    border: `1px solid ${checked ? '#1e40af' : '#e2e8f0'}`,
    background: checked ? '#eff6ff' : '#fff',
    color: checked ? '#1e40af' : '#374151',
    fontWeight: checked ? 600 : 500, transition: 'all 150ms',
  }}>
    <input type="radio" name={name} value={value} checked={checked} onChange={onChange} style={{ display: 'none' }} />
    {checked && <Check size={12} />}{label}
  </label>
);

// ──────────────────────────────────────────────
// Step Indicator
// ──────────────────────────────────────────────
const STEP_LABELS = ['Personal Info', 'Professional', 'Salary & Bank', 'Documents'];
const STEP_ICONS  = [User, Briefcase, IndianRupee, FileText];

const StepIndicator = ({ current }) => (
  <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {STEP_LABELS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        const Icon = STEP_ICONS[i];
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: done || active ? '#1e40af' : '#f1f5f9',
                color: done || active ? '#fff' : '#94a3b8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 14, transition: 'all 300ms',
              }}>
                {done ? <Check size={16} /> : <Icon size={16} />}
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: active ? '#1e40af' : done ? '#1e40af' : '#94a3b8', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div style={{
                width: 80, height: 2, margin: '0 8px', marginBottom: 18,
                background: i < current ? '#1e40af' : '#e2e8f0',
                transition: 'background 300ms',
              }} />
            )}
          </div>
        );
      })}
    </div>
    {/* Progress bar */}
    <div style={{ height: 4, background: '#e2e8f0', borderRadius: 99, marginTop: 16 }}>
      <div style={{
        height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #1e40af, #3b82f6)',
        width: `${((current + 1) / 4) * 100}%`, transition: 'width 300ms ease',
      }} />
    </div>
  </div>
);

// ──────────────────────────────────────────────
// Step 1 — Personal Information
// ──────────────────────────────────────────────
const Step1 = ({ data, onChange, errors }) => {
  const [photoPreview, setPhotoPreview] = useState(data.photoPreview || null);
  const age = calcAge(data.dob);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
    onChange('photoPreview', url);
    onChange('photoFile', file);
  };

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>Personal Information</h3>

      {/* Photo Upload */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <label style={{ cursor: 'pointer' }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            border: `2px dashed ${photoPreview ? '#10b981' : '#d1d5db'}`,
            background: photoPreview ? 'transparent' : '#f8fafc',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', position: 'relative', transition: 'all 150ms',
          }}>
            {photoPreview
              ? <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <>
                <Camera size={28} style={{ color: '#94a3b8' }} />
                <span style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>Upload Photo</span>
              </>
            }
          </div>
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
        </label>
        {photoPreview && (
          <button onClick={() => { setPhotoPreview(null); onChange('photoPreview', null); onChange('photoFile', null); }}
            style={{ position: 'relative', marginLeft: -16, marginTop: -4, width: 20, height: 20, borderRadius: '50%', background: '#ef4444', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={10} />
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="First Name" required error={errors.firstName}>
          <input value={data.firstName} onChange={e => onChange('firstName', e.target.value)}
            placeholder="Ramesh" style={{ ...INPUT, borderColor: errors.firstName ? '#ef4444' : '#e2e8f0' }} />
        </Field>
        <Field label="Last Name" required error={errors.lastName}>
          <input value={data.lastName} onChange={e => onChange('lastName', e.target.value)}
            placeholder="Sharma" style={{ ...INPUT, borderColor: errors.lastName ? '#ef4444' : '#e2e8f0' }} />
        </Field>
        <Field label="Father's Name" required error={errors.fatherName}>
          <input value={data.fatherName} onChange={e => onChange('fatherName', e.target.value)}
            placeholder="Shiv Kumar Sharma" style={{ ...INPUT, borderColor: errors.fatherName ? '#ef4444' : '#e2e8f0' }} />
        </Field>
        <Field label="Date of Birth" required error={errors.dob}>
          <div>
            <input type="date" value={data.dob} onChange={e => onChange('dob', e.target.value)}
              style={{ ...INPUT, borderColor: errors.dob ? '#ef4444' : '#e2e8f0' }} />
            {age !== null && <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Age: {age} years</div>}
          </div>
        </Field>

        {/* Gender */}
        <Field label="Gender" required error={errors.gender}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 2 }}>
            {['Male', 'Female', 'Other'].map(g => (
              <RadioPill key={g} name="gender" value={g} checked={data.gender === g} onChange={e => onChange('gender', e.target.value)} label={g} />
            ))}
          </div>
        </Field>

        {/* Blood Group */}
        <Field label="Blood Group">
          <select value={data.bloodGroup} onChange={e => onChange('bloodGroup', e.target.value)} style={{ ...INPUT }}>
            <option value="">Select</option>
            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
          </select>
        </Field>

        {/* Religion */}
        <Field label="Religion">
          <select value={data.religion} onChange={e => onChange('religion', e.target.value)} style={{ ...INPUT }}>
            <option value="">Select</option>
            {['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Others'].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>

        {/* Category */}
        <Field label="Category" required error={errors.category}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 2 }}>
            {['General', 'OBC', 'SC', 'ST'].map(c => (
              <RadioPill key={c} name="category" value={c} checked={data.category === c} onChange={e => onChange('category', e.target.value)} label={c} />
            ))}
          </div>
        </Field>

        {/* Mobile */}
        <Field label="Mobile Number" required error={errors.mobile}>
          <input type="tel" value={data.mobile} onChange={e => onChange('mobile', e.target.value.replace(/\D/, '').slice(0, 10))}
            placeholder="9876543210" maxLength={10} style={{ ...INPUT, borderColor: errors.mobile ? '#ef4444' : '#e2e8f0' }} />
        </Field>

        <Field label="Alternate Mobile">
          <input type="tel" value={data.alternateMobile} onChange={e => onChange('alternateMobile', e.target.value.replace(/\D/, '').slice(0, 10))}
            placeholder="Optional" maxLength={10} style={INPUT} />
        </Field>

        {/* Email — full width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <Field label="Email Address" required error={errors.email}>
            <input type="email" value={data.email} onChange={e => onChange('email', e.target.value)}
              placeholder="teacher@jsk.edu.in" style={{ ...INPUT, borderColor: errors.email ? '#ef4444' : '#e2e8f0' }} />
          </Field>
        </div>

        {/* Address — full width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <Field label="Full Address" required error={errors.address}>
            <textarea value={data.address} onChange={e => onChange('address', e.target.value)}
              rows={2} placeholder="House No., Street, Area..."
              style={{ ...INPUT, resize: 'none', borderColor: errors.address ? '#ef4444' : '#e2e8f0' }} />
          </Field>
        </div>

        <Field label="City" required error={errors.city}>
          <input value={data.city} onChange={e => onChange('city', e.target.value)} placeholder="Bhagalpur" style={{ ...INPUT, borderColor: errors.city ? '#ef4444' : '#e2e8f0' }} />
        </Field>

        <Field label="State" required error={errors.state}>
          <select value={data.state} onChange={e => onChange('state', e.target.value)} style={{ ...INPUT, borderColor: errors.state ? '#ef4444' : '#e2e8f0' }}>
            <option value="">Select State</option>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>

        <Field label="PIN Code">
          <input value={data.pin} onChange={e => onChange('pin', e.target.value.replace(/\D/, '').slice(0, 6))}
            placeholder="813105" maxLength={6} style={INPUT} />
        </Field>

        <Field label="Nationality">
          <input value={data.nationality} onChange={e => onChange('nationality', e.target.value)} placeholder="Indian" style={INPUT} />
        </Field>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// Step 2 — Professional Information
// ──────────────────────────────────────────────
const Step2 = ({ data, onChange, errors }) => {
  const [empIdEditable, setEmpIdEditable] = useState(false);

  const toggleSubject = (id) => {
    const cur = data.subjectIds || [];
    onChange('subjectIds', cur.includes(id) ? cur.filter(s => s !== id) : [...cur, id]);
  };
  const toggleClass = (id) => {
    const cur = data.classIds || [];
    onChange('classIds', cur.includes(id) ? cur.filter(c => c !== id) : [...cur, id]);
  };

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>Professional Information</h3>

      {/* Employee ID */}
      <div style={{ marginBottom: 20 }}>
        <label style={LABEL}>Employee ID</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input value={data.empId} onChange={e => onChange('empId', e.target.value)}
            readOnly={!empIdEditable}
            style={{ ...INPUT, background: empIdEditable ? '#f8fafc' : '#f1f5f9', color: '#1e40af', fontWeight: 700, flex: 1 }} />
          <button onClick={() => setEmpIdEditable(v => !v)} style={{
            padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0',
            background: '#fff', cursor: 'pointer', fontSize: 12, color: '#374151', whiteSpace: 'nowrap'
          }}>{empIdEditable ? '🔒 Lock' : '✏️ Edit'}</button>
        </div>
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Auto-generated. Change only if needed.</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Designation" required error={errors.designationId}>
          <select value={data.designationId} onChange={e => onChange('designationId', parseInt(e.target.value))}
            style={{ ...INPUT, borderColor: errors.designationId ? '#ef4444' : '#e2e8f0' }}>
            <option value="">Select Designation</option>
            {designations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </Field>

        <Field label="Department" required error={errors.departmentId}>
          <select value={data.departmentId} onChange={e => onChange('departmentId', parseInt(e.target.value))}
            style={{ ...INPUT, borderColor: errors.departmentId ? '#ef4444' : '#e2e8f0' }}>
            <option value="">Select Department</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </Field>

        {/* Employment Type — full width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <Field label="Employment Type" required error={errors.employmentType}>
            <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
              {['Permanent', 'Contract', 'Part Time'].map(t => (
                <RadioPill key={t} name="employmentType" value={t} checked={data.employmentType === t}
                  onChange={e => onChange('employmentType', e.target.value)} label={t} />
              ))}
            </div>
          </Field>
        </div>

        <Field label="Join Date" required error={errors.joinDate}>
          <input type="date" value={data.joinDate} onChange={e => onChange('joinDate', e.target.value)}
            style={{ ...INPUT, borderColor: errors.joinDate ? '#ef4444' : '#e2e8f0' }} />
        </Field>

        <Field label="Qualification" required error={errors.qualification}>
          <input value={data.qualification} onChange={e => onChange('qualification', e.target.value)}
            placeholder="M.A. English, B.Ed" style={{ ...INPUT, borderColor: errors.qualification ? '#ef4444' : '#e2e8f0' }} />
        </Field>

        <div style={{ gridColumn: '1 / -1' }}>
          <Field label="Experience">
            <input value={data.experience} onChange={e => onChange('experience', e.target.value)}
              placeholder="8 Years" style={INPUT} />
          </Field>
        </div>
      </div>

      {/* Subject Assignment */}
      <div style={{ marginTop: 20 }}>
        <label style={LABEL}>Subjects Teaching <span style={{ color: '#ef4444' }}>*</span></label>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>Click to select subjects this teacher handles</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {subjects.map(s => {
            const sel = (data.subjectIds || []).includes(s.id);
            return (
              <button key={s.id} onClick={() => toggleSubject(s.id)} style={{
                padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: sel ? 700 : 500,
                cursor: 'pointer', border: `1px solid ${sel ? s.color : '#e2e8f0'}`,
                background: sel ? s.color + '22' : '#fff', color: sel ? s.color : '#374151',
                transition: 'all 150ms',
              }}>{s.name}</button>
            );
          })}
        </div>
        {errors.subjectIds && <div style={ERR}>{errors.subjectIds}</div>}
      </div>

      {/* Class Assignment */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <label style={LABEL}>Classes Assigned To <span style={{ color: '#ef4444' }}>*</span></label>
            <div style={{ fontSize: 12, color: '#64748b' }}>Select all classes this teacher teaches</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => onChange('classIds', classes.map(c => c.id))}
              style={{ fontSize: 12, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Select All</button>
            <button onClick={() => onChange('classIds', [])}
              style={{ fontSize: 12, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear All</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {classes.map(c => {
            const sel = (data.classIds || []).includes(c.id);
            return (
              <label key={c.id} style={{
                display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                padding: '7px 10px', borderRadius: 8,
                background: sel ? '#eff6ff' : '#f8fafc',
                border: `1px solid ${sel ? '#bfdbfe' : '#e2e8f0'}`,
                transition: 'all 150ms',
              }}>
                <input type="checkbox" checked={sel} onChange={() => toggleClass(c.id)} style={{ accentColor: '#1e40af' }} />
                <span style={{ fontSize: 12, fontWeight: sel ? 600 : 400, color: sel ? '#1e40af' : '#374151' }}>{c.name}</span>
              </label>
            );
          })}
        </div>
        {errors.classIds && <div style={ERR}>{errors.classIds}</div>}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// Step 3 — Salary & Bank
// ──────────────────────────────────────────────
const Step3 = ({ data, onChange, errors }) => {
  const basic = parseFloat(data.basicSalary) || 0;
  const hra   = parseFloat(data.hra)   || 0;
  const da    = parseFloat(data.da)    || 0;
  const ta    = parseFloat(data.ta)    || 0;
  const pf    = parseFloat(data.pf)    || 0;
  const esi   = parseFloat(data.esi)   || 0;
  const tds   = parseFloat(data.tds)   || 0;
  const other = parseFloat(data.otherDeduction) || 0;

  const grossEarnings   = basic + hra + da + ta;
  const totalDeductions = pf + esi + tds + other;
  const netSalary       = grossEarnings - totalDeductions;

  const fmt = n => '₹' + Number(n).toLocaleString('en-IN');

  const handleBasicChange = (val) => {
    const b = parseFloat(val) || 0;
    onChange('basicSalary', val);
    onChange('hra', Math.round(b * 0.20).toString());
    onChange('da',  Math.round(b * 0.10).toString());
    onChange('pf',  Math.round(b * 0.12).toString());
  };

  const [bankSuggestions, setBankSuggestions] = useState([]);

  const SalaryRow = ({ label, value, color }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
      <span style={{ fontSize: 13, color: '#64748b' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: color || '#0f172a' }}>{fmt(value)}</span>
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      {/* LEFT FORM */}
      <div style={{ flex: '0 0 60%', background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>Salary & Bank Details</h3>

        {/* Earnings */}
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>EARNINGS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Basic Salary" required error={errors.basicSalary}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 13 }}>₹</span>
              <input type="number" value={data.basicSalary} onChange={e => handleBasicChange(e.target.value)}
                placeholder="18000" style={{ ...INPUT, paddingLeft: 24, borderColor: errors.basicSalary ? '#ef4444' : '#e2e8f0' }} />
            </div>
          </Field>
          <Field label="HRA">
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 13 }}>₹</span>
              <input type="number" value={data.hra} onChange={e => onChange('hra', e.target.value)}
                style={INPUT} placeholder="3600" style={{ ...INPUT, paddingLeft: 24 }} />
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>20% of Basic (auto)</div>
          </Field>
          <Field label="DA">
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 13 }}>₹</span>
              <input type="number" value={data.da} onChange={e => onChange('da', e.target.value)}
                style={{ ...INPUT, paddingLeft: 24 }} placeholder="1800" />
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>10% of Basic (auto)</div>
          </Field>
          <Field label="Transport Allowance">
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 13 }}>₹</span>
              <input type="number" value={data.ta} onChange={e => onChange('ta', e.target.value)}
                style={{ ...INPUT, paddingLeft: 24 }} placeholder="1000" />
            </div>
          </Field>
        </div>

        {/* Deductions */}
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '20px 0 12px' }}>DEDUCTIONS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="PF (Provident Fund)">
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 13 }}>₹</span>
              <input type="number" value={data.pf} onChange={e => onChange('pf', e.target.value)}
                style={{ ...INPUT, paddingLeft: 24 }} placeholder="2160" />
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>12% of Basic (auto)</div>
          </Field>
          <Field label="ESI">
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 13 }}>₹</span>
              <input type="number" value={data.esi} onChange={e => onChange('esi', e.target.value)}
                style={{ ...INPUT, paddingLeft: 24 }} placeholder="0" />
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>If salary ≤ ₹21,000</div>
          </Field>
          <Field label="TDS">
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 13 }}>₹</span>
              <input type="number" value={data.tds} onChange={e => onChange('tds', e.target.value)}
                style={{ ...INPUT, paddingLeft: 24 }} placeholder="0" />
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>As applicable</div>
          </Field>
          <Field label="Other Deduction">
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 13 }}>₹</span>
              <input type="number" value={data.otherDeduction} onChange={e => onChange('otherDeduction', e.target.value)}
                style={{ ...INPUT, paddingLeft: 24 }} placeholder="0" />
            </div>
          </Field>
        </div>

        {/* Bank Details */}
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '20px 0 12px' }}>BANK DETAILS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Account Number" required error={errors.accountNo}>
            <input type="number" value={data.accountNo} onChange={e => onChange('accountNo', e.target.value)}
              placeholder="1234567890" style={{ ...INPUT, borderColor: errors.accountNo ? '#ef4444' : '#e2e8f0' }} />
          </Field>

          {/* Bank Name with suggestions */}
          <Field label="Bank Name" required error={errors.bankName}>
            <div style={{ position: 'relative' }}>
              <input value={data.bankName} onChange={e => {
                onChange('bankName', e.target.value);
                setBankSuggestions(e.target.value
                  ? BANK_SUGGESTIONS.filter(b => b.toLowerCase().includes(e.target.value.toLowerCase()))
                  : []);
              }}
                onBlur={() => setTimeout(() => setBankSuggestions([]), 200)}
                placeholder="State Bank of India"
                style={{ ...INPUT, borderColor: errors.bankName ? '#ef4444' : '#e2e8f0' }} />
              {bankSuggestions.length > 0 && (
                <div style={{
                  position: 'absolute', top: '110%', left: 0, right: 0,
                  background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 10
                }}>
                  {bankSuggestions.map(b => (
                    <div key={b} onMouseDown={() => { onChange('bankName', b); setBankSuggestions([]); }}
                      style={{ padding: '8px 12px', fontSize: 13, cursor: 'pointer', color: '#374151' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >{b}</div>
                  ))}
                </div>
              )}
            </div>
          </Field>

          <Field label="IFSC Code" required error={errors.ifsc}>
            <input value={data.ifsc} onChange={e => onChange('ifsc', e.target.value.toUpperCase())}
              placeholder="SBIN0001234" style={{ ...INPUT, borderColor: errors.ifsc ? '#ef4444' : '#e2e8f0', textTransform: 'uppercase' }} />
          </Field>

          <Field label="Branch">
            <input value={data.branch} onChange={e => onChange('branch', e.target.value)}
              placeholder="Main Branch" style={INPUT} />
          </Field>

          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Account Type" required error={errors.accountType}>
              <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
                {['Savings', 'Current'].map(t => (
                  <RadioPill key={t} name="accountType" value={t} checked={data.accountType === t}
                    onChange={e => onChange('accountType', e.target.value)} label={t} />
                ))}
              </div>
            </Field>
          </div>
        </div>
      </div>

      {/* RIGHT — Live Salary Preview */}
      <div style={{
        flex: '0 0 38%', background: '#eff6ff', borderRadius: 16, padding: 20,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: '4px solid #1e40af',
        position: 'sticky', top: 24,
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
          💰 Salary Preview
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>EARNINGS</div>
        <SalaryRow label="Basic Salary" value={basic} />
        <SalaryRow label="HRA" value={hra} />
        <SalaryRow label="DA" value={da} />
        <SalaryRow label="Transport" value={ta} />
        <div style={{ borderTop: '1px dashed #bfdbfe', margin: '8px 0' }} />
        <SalaryRow label="Total Earnings" value={grossEarnings} color="#10b981" />

        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '16px 0 8px' }}>DEDUCTIONS</div>
        <SalaryRow label="Provident Fund" value={pf} />
        <SalaryRow label="ESI" value={esi} />
        <SalaryRow label="TDS" value={tds} />
        {other > 0 && <SalaryRow label="Other" value={other} />}
        <div style={{ borderTop: '1px dashed #bfdbfe', margin: '8px 0' }} />
        <SalaryRow label="Total Deductions" value={totalDeductions} color="#ef4444" />

        <div style={{ borderTop: '2px solid #1e40af', margin: '12px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>NET SALARY</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{fmt(netSalary)}</span>
        </div>
        <div style={{ fontSize: 11, color: '#3b82f6', marginTop: 6, fontStyle: 'italic', lineHeight: 1.5 }}>
          {numberToWords(netSalary)}
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// Step 4 — Documents Upload
// ──────────────────────────────────────────────
const DOC_SLOTS = [
  { key: 'photo',       label: 'Profile Photo',      icon: '📷', required: true,  accept: 'image/*',                   maxMb: 2  },
  { key: 'aadhar',      label: 'Aadhar Card',         icon: '🪪', required: true,  accept: 'image/*,application/pdf',   maxMb: 5  },
  { key: 'pan',         label: 'PAN Card',            icon: '💳', required: true,  accept: 'image/*,application/pdf',   maxMb: 5  },
  { key: 'degree',      label: 'Degree / Marksheet',  icon: '🎓', required: true,  accept: 'application/pdf,image/*',   maxMb: 10 },
  { key: 'appointment', label: 'Appointment Letter',  icon: '📋', required: false, accept: 'application/pdf',           maxMb: 5  },
  { key: 'cheque',      label: 'Cancelled Cheque',    icon: '🏦', required: true,  accept: 'image/*,application/pdf',   maxMb: 2  },
];

const Step4 = ({ data, onChange }) => {
  const docs = data.docFiles || {};

  const handleFile = (key, e) => {
    const file = e.target.files[0];
    if (!file) return;
    onChange('docFiles', { ...docs, [key]: file });
  };

  const removeDoc = (key) => {
    const updated = { ...docs };
    delete updated[key];
    onChange('docFiles', updated);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Upload Documents</h3>
      <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px' }}>Upload supporting documents. Max file size: 5MB each.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {DOC_SLOTS.map(slot => {
          const file = docs[slot.key];
          const hasFile = !!file;

          return (
            <div key={slot.key} style={{
              border: `1px solid ${hasFile ? '#86efac' : '#e2e8f0'}`,
              borderRadius: 14, padding: 16,
              background: hasFile ? '#f0fdf4' : '#fff',
              transition: 'all 150ms',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 24 }}>{slot.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{slot.label}</div>
                  <div style={{ fontSize: 11, color: slot.required ? '#ef4444' : '#94a3b8' }}>
                    {slot.required ? 'Required' : 'Optional'} · Max {slot.maxMb}MB
                  </div>
                </div>
                {hasFile && (
                  <button onClick={() => removeDoc(slot.key)} style={{
                    marginLeft: 'auto', width: 22, height: 22, borderRadius: '50%',
                    background: '#fee2e2', border: 'none', color: '#dc2626',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}><X size={11} /></button>
                )}
              </div>

              {hasFile ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#16a34a', fontWeight: 500 }}>
                  <Check size={14} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>{file.name}</span>
                  <span style={{ color: '#64748b', whiteSpace: 'nowrap' }}>· {formatSize(file.size)}</span>
                </div>
              ) : (
                <label style={{ cursor: 'pointer', display: 'block' }}>
                  <div style={{
                    border: '2px dashed #d1d5db', borderRadius: 8, padding: '16px 12px',
                    textAlign: 'center', background: '#f8fafc',
                    transition: 'border-color 150ms',
                  }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>📎</div>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Drag & drop or click to browse</div>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>Accepted: JPG, PNG, PDF</div>
                  </div>
                  <input type="file" accept={slot.accept} style={{ display: 'none' }} onChange={e => handleFile(slot.key, e)} />
                </label>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// Success Modal
// ──────────────────────────────────────────────
const SuccessModal = ({ teacher, onViewProfile, onAddAnother }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
  }}>
    <div style={{
      background: '#fff', borderRadius: 24, padding: 36,
      maxWidth: 420, width: '92%', textAlign: 'center',
      boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      animation: 'fadeInUp 0.4s ease',
    }}>
      <style>{`@keyframes bounceIn{0%{transform:scale(0.5);opacity:0}60%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}`}</style>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px', animation: 'bounceIn 0.6s ease',
        boxShadow: '0 8px 24px rgba(16,185,129,0.3)'
      }}>
        <Check size={32} style={{ color: '#fff' }} />
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Teacher Added Successfully!</h3>
      <span style={{
        display: 'inline-block', background: '#dbeafe', color: '#1e40af',
        fontSize: 13, fontWeight: 700, borderRadius: 999,
        padding: '4px 14px', fontFamily: 'monospace', marginBottom: 16
      }}>{teacher.empId}</span>
      <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0 0 16px' }} />
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32 }}>
        {[
          { label: 'Name', value: teacher.firstName + ' ' + teacher.lastName },
          { label: 'Department', value: departments.find(d => d.id === teacher.departmentId)?.name || '—' },
          { label: 'Designation', value: designations.find(d => d.id === teacher.designationId)?.short || '—' },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: 13, color: '#0f172a', fontWeight: 600, marginTop: 2 }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
        <button onClick={onViewProfile} style={{
          flex: 1, padding: '11px 0', borderRadius: 10, border: '1px solid #1e40af',
          background: '#1e40af', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer'
        }}>👁 View Profile</button>
        <button onClick={onAddAnother} style={{
          flex: 1, padding: '11px 0', borderRadius: 10, border: '1px solid #e2e8f0',
          background: '#fff', color: '#374151', fontWeight: 600, fontSize: 14, cursor: 'pointer'
        }}>➕ Add Another</button>
      </div>
    </div>
  </div>
);

// ──────────────────────────────────────────────
// MAIN FORM COMPONENT
// ──────────────────────────────────────────────
const nextEmpId = () => {
  const ids = teachersData.map(t => parseInt(t.empId.replace('JSK-T-', ''))).filter(Boolean);
  const next = Math.max(...ids, 0) + 1;
  return `JSK-T-${String(next).padStart(3, '0')}`;
};

const EMPTY = {
  // Step 1
  firstName: '', lastName: '', fatherName: '', dob: '', gender: '',
  bloodGroup: '', religion: '', category: '', nationality: 'Indian',
  mobile: '', alternateMobile: '', email: '', address: '', city: '', state: '', pin: '',
  photoPreview: null, photoFile: null,
  // Step 2
  empId: nextEmpId(), designationId: '', departmentId: '', employmentType: '',
  joinDate: '', qualification: '', experience: '', subjectIds: [], classIds: [],
  // Step 3
  basicSalary: '', hra: '', da: '', ta: '',
  pf: '', esi: '0', tds: '0', otherDeduction: '0',
  accountNo: '', bankName: '', ifsc: '', branch: '', accountType: 'Savings',
  // Step 4
  docFiles: {},
};

export default function TeacherForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [step, setStep]       = useState(0);
  const [form, setForm]       = useState(EMPTY);
  const [errors, setErrors]   = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedTeacher, setSavedTeacher] = useState(null);
  const [allTeachers, setAllTeachers]   = useState(teachersData);

  // Pre-fill on edit
  useEffect(() => {
    if (isEdit) {
      const t = teachersData.find(t => t.id === parseInt(id));
      if (t) {
        setForm({
          ...EMPTY, ...t,
          basicSalary: t.basicSalary?.toString() || '',
          hra: t.hra?.toString() || '',
          da:  t.da?.toString()  || '',
          ta:  t.ta?.toString()  || '',
          pf:  t.pf?.toString()  || '',
          esi: t.esi?.toString() || '0',
          tds: t.tds?.toString() || '0',
          otherDeduction: '0',
          docFiles: {},
        });
      }
    }
  }, [id, isEdit]);

  const onChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  // Validation per step
  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.firstName.trim()) e.firstName = 'Required';
      if (!form.lastName.trim())  e.lastName  = 'Required';
      if (!form.fatherName.trim()) e.fatherName = 'Required';
      if (!form.dob)              e.dob       = 'Required';
      if (!form.gender)           e.gender    = 'Select gender';
      if (!form.category)         e.category  = 'Select category';
      if (!form.mobile || form.mobile.length !== 10) e.mobile = 'Enter valid 10-digit mobile';
      if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter valid email';
      if (!form.address.trim())   e.address   = 'Required';
      if (!form.city.trim())      e.city      = 'Required';
      if (!form.state)            e.state     = 'Select state';
    }
    if (step === 1) {
      if (!form.designationId)    e.designationId   = 'Select designation';
      if (!form.departmentId)     e.departmentId    = 'Select department';
      if (!form.employmentType)   e.employmentType  = 'Select type';
      if (!form.joinDate)         e.joinDate        = 'Required';
      if (!form.qualification.trim()) e.qualification = 'Required';
      if (!form.subjectIds.length) e.subjectIds    = 'Select at least one subject';
      if (!form.classIds.length)   e.classIds      = 'Select at least one class';
    }
    if (step === 2) {
      if (!form.basicSalary || parseFloat(form.basicSalary) <= 0) e.basicSalary = 'Enter valid salary';
      if (!form.accountNo.trim()) e.accountNo = 'Required';
      if (!form.bankName.trim())  e.bankName  = 'Required';
      if (!form.ifsc.trim())      e.ifsc      = 'Required';
      if (!form.accountType)      e.accountType = 'Select type';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) { toast.error('Please fix the errors before continuing'); return; }
    setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => Math.max(0, s - 1));

  const handleSave = () => {
    const newTeacher = {
      ...form,
      id: allTeachers.length + 1,
      name: `${form.firstName} ${form.lastName}`,
      status: 'active',
      avatar: (form.firstName[0] + (form.lastName[0] || '')).toUpperCase(),
      avatarColor: '#3b82f6',
      basicSalary: parseFloat(form.basicSalary) || 0,
      hra: parseFloat(form.hra) || 0, da: parseFloat(form.da) || 0, ta: parseFloat(form.ta) || 0,
      pf:  parseFloat(form.pf)  || 0, esi: parseFloat(form.esi) || 0, tds: parseFloat(form.tds) || 0,
    };
    setAllTeachers(prev => [...prev, newTeacher]);
    setSavedTeacher(newTeacher);
    setShowSuccess(true);
  };

  const title = isEdit
    ? `Edit Teacher — ${form.firstName} ${form.lastName}`
    : 'Add New Teacher';

  return (
    <div style={{ padding: '24px 28px', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/teacher')} style={{
            display: 'flex', alignItems: 'center', gap: 4, background: 'none',
            border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 12px',
            cursor: 'pointer', fontSize: 13, color: '#374151', fontWeight: 500,
          }}>
            <ArrowLeft size={14} /> Back
          </button>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0 }}>{title}</h1>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {step > 0 && (
            <button onClick={handleBack} style={{
              padding: '9px 18px', borderRadius: 10, border: '1px solid #e2e8f0',
              background: '#fff', color: '#374151', fontWeight: 600, fontSize: 14, cursor: 'pointer'
            }}>← Back</button>
          )}
          {step < 3 ? (
            <button onClick={handleNext} style={{
              padding: '9px 20px', borderRadius: 10, border: 'none',
              background: '#1e40af', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer'
            }}>Next →</button>
          ) : (
            <button onClick={handleSave} style={{
              padding: '9px 24px', borderRadius: 10, border: 'none',
              background: '#10b981', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer'
            }}>✅ Save Teacher</button>
          )}
        </div>
      </div>

      {/* Step Indicator */}
      <StepIndicator current={step} />

      {/* Step Content */}
      {step === 0 && <Step1 data={form} onChange={onChange} errors={errors} />}
      {step === 1 && <Step2 data={form} onChange={onChange} errors={errors} />}
      {step === 2 && <Step3 data={form} onChange={onChange} errors={errors} />}
      {step === 3 && <Step4 data={form} onChange={onChange} />}

      {/* Bottom Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <button onClick={() => navigate('/teacher')} style={{
          padding: '9px 18px', borderRadius: 10, border: '1px solid #e2e8f0',
          background: '#fff', color: '#94a3b8', fontSize: 14, cursor: 'pointer'
        }}>Cancel</button>
        <div style={{ display: 'flex', gap: 8 }}>
          {step > 0 && (
            <button onClick={handleBack} style={{
              padding: '9px 18px', borderRadius: 10, border: '1px solid #e2e8f0',
              background: '#fff', color: '#374151', fontWeight: 600, fontSize: 14, cursor: 'pointer'
            }}>← Previous</button>
          )}
          {step < 3 ? (
            <button onClick={handleNext} style={{
              padding: '9px 20px', borderRadius: 10, border: 'none',
              background: '#1e40af', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer'
            }}>Next Step →</button>
          ) : (
            <button onClick={handleSave} style={{
              padding: '9px 28px', borderRadius: 10, border: 'none',
              background: '#10b981', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer'
            }}>✅ Save Teacher</button>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && savedTeacher && (
        <SuccessModal
          teacher={savedTeacher}
          onViewProfile={() => navigate(`/teacher/${savedTeacher.id}`)}
          onAddAnother={() => { setForm({ ...EMPTY, empId: nextEmpId() }); setStep(0); setShowSuccess(false); }}
        />
      )}
    </div>
  );
}
