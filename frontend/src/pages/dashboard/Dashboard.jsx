import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, IndianRupee, GraduationCap, BookOpen, Bus, BarChart3,
  Receipt, ShoppingBag, Monitor, Library, Cake, UserX, Home,
  ChevronRight, Calendar, TrendingUp, MoreVertical
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import useAuth from '../../hooks/useAuth';

/* ── Animations ── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.03 } }
};
const fade = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }
};

/* ── Top Quick-Access Modules (like Purnank top bar) ── */
const topModules = [
  { title: 'Payroll',            path: '/payroll',       icon: Receipt,     bg: '#2563eb', hoverBg: '#1d4ed8' },
  { title: 'Examination',       path: '/examination',   icon: BookOpen,    bg: '#2563eb', hoverBg: '#1d4ed8' },
  { title: 'Sale & Purchase',   path: '/sale-purchase',  icon: ShoppingBag, bg: '#2563eb', hoverBg: '#1d4ed8' },
  { title: 'LMS Management',    path: '/lms',           icon: Monitor,     bg: '#2563eb', hoverBg: '#1d4ed8' },
  { title: 'Library Management', path: '/library',       icon: Library,     bg: '#2563eb', hoverBg: '#1d4ed8' },
];

/* ── Stat Cards Data ── */
const statCardsData = [
  { title: 'Total Students(Active)', value: 319, icon: Users,     color: '#ec4899', bg: '#fce7f3', iconBg: 'linear-gradient(135deg, #ec4899, #db2777)' },
  { title: 'Total Day Scholar Students', value: 290, icon: Users, color: '#10b981', bg: '#d1fae5', iconBg: 'linear-gradient(135deg, #10b981, #059669)' },
  { title: 'Total Hostel Students',  value: 29, icon: Home,       color: '#8b5cf6', bg: '#ede9fe', iconBg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
  { title: 'Total Transport Students', value: 152, icon: Bus,     color: '#eab308', bg: '#fef9c3', iconBg: 'linear-gradient(135deg, #eab308, #ca8a04)' },
  { title: 'Total Inactive Students', value: 55, icon: UserX,     color: '#ef4444', bg: '#fee2e2', iconBg: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  { title: "Today's Birthday Students", value: 0, icon: Cake,     color: '#f97316', bg: '#ffedd5', iconBg: 'linear-gradient(135deg, #f97316, #ea580c)' },
];

/* ── Today Collection Data ── */
const todayCollection = [
  { label: 'Monthly Fee',    amount: 0, color: '#3b82f6' },
  { label: 'Transport Fee',  amount: 0, color: '#10b981' },
  { label: 'Hostel Fee',     amount: 0, color: '#8b5cf6' },
  { label: 'Admission Fee',  amount: 0, color: '#f59e0b' },
];

/* ── Student Summary Bar Chart Data ── */
const classwiseData = [
  { name: 'LKG', sectionA: 25 },
  { name: 'UKG', sectionA: 30 },
  { name: 'I',   sectionA: 35 },
  { name: 'II',  sectionA: 28 },
  { name: 'III', sectionA: 42 },
  { name: 'IV',  sectionA: 38 },
  { name: 'V',   sectionA: 45 },
  { name: 'VI',  sectionA: 40 },
  { name: 'VII', sectionA: 33 },
  { name: 'VIII',sectionA: 20 },
  { name: 'IX',  sectionA: 15 },
  { name: 'X',   sectionA: 10 },
];

/* ── Pie Chart Data ── */
const studentTypeData = [
  { name: 'New Student', value: 32, color: '#10b981' },
  { name: 'Old Student', value: 287, color: '#fbbf24' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  })();

  const dateLabel = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const totalCollected = todayCollection.reduce((s, t) => s + t.amount, 0);

  return (
    <motion.div variants={container} initial="hidden" animate="show" style={{ paddingBottom: 40, minWidth: 0 }}>

      {/* ═══ HEADER ═══ */}
      <motion.div variants={fade} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.2)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Live Overview</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px', lineHeight: 1.1 }}>
            {greeting}, <span style={{ color: '#4f46e5' }}>{user?.name?.split(' ')[0] || 'Admin'}</span>
          </h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 6, fontWeight: 500 }}>
            Here's what's happening at JSK School today.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '9px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <Calendar size={15} color="#4f46e5" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#475569', whiteSpace: 'nowrap' }}>{dateLabel}</span>
          </div>
        </div>
      </motion.div>

      {/* ═══ TOP MODULE QUICK ACCESS BAR ═══ */}
      <motion.div variants={fade} style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 22 }}>
        {topModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <motion.button
              key={mod.path}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(mod.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px',
                background: mod.bg, color: '#fff',
                border: 'none', borderRadius: 12,
                fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
                transition: 'all 0.15s',
              }}
            >
              <Icon size={16} />
              {mod.title}
            </motion.button>
          );
        })}
      </motion.div>

      {/* ═══ STAT CARDS + TODAY COLLECTION (main grid) ═══ */}
      <motion.div variants={fade} style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 18, marginBottom: 22 }}>

        {/* LEFT — 6 stat cards in a 3x2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {statCardsData.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 18,
                  padding: '22px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  cursor: 'default',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Subtle accent top border */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: card.color, borderRadius: '18px 18px 0 0' }} />

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, lineHeight: 1.3 }}>
                    {card.title}
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: card.color, lineHeight: 1 }}>
                    {card.value.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Icon */}
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: card.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 4px 12px ${card.color}33`,
                }}>
                  <Icon size={24} color="#fff" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* RIGHT — Today Collection Panel */}
        <motion.div
          whileHover={{ boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
          style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 18,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '18px 20px 14px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Today Collection</div>
            <MoreVertical size={16} color="#94a3b8" style={{ cursor: 'pointer' }} />
          </div>

          {/* Fee items */}
          <div style={{ flex: 1, padding: '6px 0' }}>
            {todayCollection.map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 20px',
                  borderBottom: '1px solid #f8fafc',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: item.color, flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{item.label}</span>
                </div>
                <span style={{
                  fontSize: 14, fontWeight: 800,
                  color: item.amount > 0 ? '#0f172a' : '#3b82f6',
                  background: item.amount > 0 ? '#ecfdf5' : '#eff6ff',
                  padding: '4px 14px', borderRadius: 8,
                  minWidth: 40, textAlign: 'center',
                }}>
                  {item.amount}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{
            padding: '14px 20px',
            borderTop: '1.5px solid #e2e8f0',
            background: '#f8fafc',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Total Collection</span>
            <span style={{
              fontSize: 16, fontWeight: 800, color: '#ef4444',
              background: '#fef2f2', padding: '5px 16px', borderRadius: 8,
            }}>
              {totalCollected.toFixed(2)}
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* ═══ CHARTS SECTION — Bar + Donut ═══ */}
      <motion.div variants={fade} style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 18 }}>

        {/* LEFT — Student Summary Bar Chart */}
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 18,
          padding: '22px 24px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Student Summary</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3, fontWeight: 500 }}>Class-wise student count</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: '#22c55e' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>Section A</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={classwiseData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
              />
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />
              <Bar
                dataKey="sectionA"
                name="Section A"
                fill="#22c55e"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RIGHT — New vs Old Student Donut */}
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 18,
          padding: '22px 24px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Student Ratio</div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            {studentTypeData.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: d.color }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>{d.name}</span>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={studentTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${value}`}
                  labelLine={false}
                >
                  {studentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#fff', border: '1px solid #e2e8f0',
                    borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    fontSize: 12, fontWeight: 600,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats below */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
            {studentTypeData.map(d => (
              <div key={d.name} style={{
                background: '#f8fafc', borderRadius: 12, padding: '12px 14px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: d.color }}>{d.value}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d.name}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}
