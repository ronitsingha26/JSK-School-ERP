import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Construction } from 'lucide-react';
import { useState } from 'react';

/* ── Per-module accent color ── */
const MODULE_COLORS = {
  'Examination':          { from: '#8b5cf6', to: '#6d28d9' },
  'Routine / Timetable':  { from: '#6366f1', to: '#4f46e5' },
  'Subject Master':       { from: '#0ea5e9', to: '#0369a1' },
  'Teacher Management':   { from: '#10b981', to: '#059669' },
  'Front Office':         { from: '#f59e0b', to: '#d97706' },
  'Transportation':       { from: '#06b6d4', to: '#0891b2' },
  'Fees Setup':           { from: '#f43f5e', to: '#dc2626' },
  'Fees Collection':      { from: '#10b981', to: '#059669' },
  'Previous Year Dues':   { from: '#ef4444', to: '#b91c1c' },
  'Demand Bill':          { from: '#6366f1', to: '#4338ca' },
  'Other Fee Collection': { from: '#f59e0b', to: '#b45309' },
  'Scholarship':          { from: '#a855f7', to: '#7e22ce' },
  'Payroll':              { from: '#f59e0b', to: '#d97706' },
  'Account':              { from: '#3b82f6', to: '#1d4ed8' },
  'Master Setup':         { from: '#64748b', to: '#334155' },
  'User Permissions':     { from: '#8b5cf6', to: '#6d28d9' },
  'Reports':              { from: '#ef4444', to: '#dc2626' },
  'Library Management':   { from: '#84cc16', to: '#65a30d' },
  'Online Registration':  { from: '#3b82f6', to: '#1d4ed8' },
  'LMS Management':       { from: '#06b6d4', to: '#0891b2' },
  'Sale & Purchase':      { from: '#f59e0b', to: '#d97706' },
};

const DEFAULT_COLOR = { from: '#4f46e5', to: '#818cf8' };

export default function UnderConstruction({ moduleName = 'This Module' }) {
  const navigate = useNavigate();
  const color = MODULE_COLORS[moduleName] || DEFAULT_COLOR;
  const [backHov, setBackHov] = useState(false);
  const [dashHov, setDashHov] = useState(false);

  return (
    <div style={{
      minHeight: 'calc(100vh - 68px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
      background: '#fff',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* ── Subtle background dots ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'radial-gradient(circle, #e2e8f0 1.5px, transparent 1.5px)',
        backgroundSize: '28px 28px',
        opacity: 0.6,
      }} />

      {/* ── Colored glow blobs ── */}
      <div style={{
        position: 'absolute', width: 500, height: 500,
        borderRadius: '50%', top: '-200px', left: '-150px',
        background: `radial-gradient(circle, ${color.from}18, transparent 70%)`,
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400,
        borderRadius: '50%', bottom: '-150px', right: '-100px',
        background: `radial-gradient(circle, ${color.to}14, transparent 70%)`,
        zIndex: 0,
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 680 }}
      >

        {/* ── Workers image ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 8 }}
        >
          <motion.img
            src="/construction_workers.png"
            alt="Construction workers"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 320, height: 'auto', userSelect: 'none' }}
          />
        </motion.div>

        {/* ── BIG MODULE NAME ── */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(48px, 10vw, 88px)',
            fontWeight: 900,
            color: '#0f172a',
            lineHeight: 1,
            letterSpacing: '-3px',
            margin: '0 0 16px',
            fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
          }}
        >
          {moduleName}
        </motion.h1>

        {/* ── COMING SOON badge ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}
        >
          <div style={{ height: 2, width: 40, background: `linear-gradient(90deg, transparent, ${color.from})`, borderRadius: 99 }} />
          <span style={{
            fontSize: 13, fontWeight: 800, letterSpacing: '0.22em',
            textTransform: 'uppercase',
            background: `linear-gradient(90deg, ${color.from}, ${color.to})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            🚧 Coming Soon
          </span>
          <div style={{ height: 2, width: 40, background: `linear-gradient(90deg, ${color.to}, transparent)`, borderRadius: 99 }} />
        </motion.div>

        {/* ── Description ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          style={{
            fontSize: 16, fontWeight: 500, color: '#64748b',
            lineHeight: 1.7, margin: '0 auto 32px', maxWidth: 440,
          }}
        >
          We're building something amazing here. Our team is working hard to bring this module to life.
        </motion.p>

        {/* ── Progress bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: '#fff', border: '1px solid #e2e8f0',
            borderRadius: 16, padding: '16px 20px',
            boxShadow: '0 2px 10px rgba(15,23,42,0.04)',
            marginBottom: 32, display: 'inline-block', width: '100%', maxWidth: 360,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Construction size={14} color={color.from} /> Development Progress
            </span>
            <span style={{ fontSize: 14, fontWeight: 800, color: color.from }}>
              45%
            </span>
          </div>
          <div style={{ height: 8, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '45%' }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.7 }}
              style={{
                height: '100%', borderRadius: 99,
                background: `linear-gradient(90deg, ${color.from}, ${color.to})`,
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                animation: 'barShimmer 1.5s linear infinite',
              }} />
            </motion.div>
          </div>
        </motion.div>

        {/* ── Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center' }}
        >
          <button
            onClick={() => navigate(-1)}
            onMouseEnter={() => setBackHov(true)}
            onMouseLeave={() => setBackHov(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 14,
              border: '2px solid #e2e8f0',
              background: backHov ? '#f8fafc' : '#fff',
              fontSize: 14, fontWeight: 700, color: '#475569',
              cursor: 'pointer', transition: 'all 0.15s',
              transform: backHov ? 'translateY(-1px)' : 'none',
              boxShadow: backHov ? '0 4px 12px rgba(15,23,42,0.08)' : 'none',
            }}
          >
            <ArrowLeft size={16} /> Go Back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            onMouseEnter={() => setDashHov(true)}
            onMouseLeave={() => setDashHov(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 14, border: 'none',
              background: `linear-gradient(135deg, ${color.from}, ${color.to})`,
              fontSize: 14, fontWeight: 700, color: '#fff',
              cursor: 'pointer', transition: 'all 0.18s',
              transform: dashHov ? 'translateY(-2px)' : 'none',
              boxShadow: dashHov
                ? `0 8px 24px ${color.from}66`
                : `0 4px 14px ${color.from}44`,
            }}
          >
            <Home size={16} /> Back to Dashboard
          </button>
        </motion.div>
      </motion.div>

      {/* Keyframes */}
      <style>{`
        @keyframes barShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
