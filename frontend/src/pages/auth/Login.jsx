import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ChevronDown, ArrowRight, Plus } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'principal', label: 'Principal' },
];

// ─── BACKGROUND PARTICLES ───
function Particles() {
  const particles = Array.from({ length: 40 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((_, i) => {
        const size = Math.random() * 3 + 1.5;
        const top = Math.random() * 100 + '%';
        const left = Math.random() * 100 + '%';
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * -20;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]"
            style={{ width: size, height: size, top, left }}
            animate={{
              y: [0, -120, 0],
              x: [0, Math.random() * 60 - 30, 0],
              opacity: [0.1, 0.7, 0.1],
              scale: [1, 1.5, 1]
            }}
            transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
          />
        );
      })}
    </div>
  );
}

// ─── AURORA EFFECT ───
function Aurora() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50 z-0">
      <motion.div
        animate={{ x: ['-10%', '10%', '-10%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[20%] -left-[10%] w-[120%] h-[250px] bg-gradient-to-r from-fuchsia-400/0 via-purple-400/15 to-violet-400/0 blur-[90px] transform -rotate-12"
      />
      <motion.div
        animate={{ x: ['10%', '-10%', '10%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[60%] -left-[10%] w-[120%] h-[300px] bg-gradient-to-r from-blue-400/0 via-fuchsia-500/15 to-purple-400/0 blur-[100px] transform rotate-6"
      />
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const { register, handleSubmit } = useForm({
    defaultValues: { email: 'admin@jsk.com', password: 'Admin@123', role: 'admin' },
  });

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  // ─── GLOBAL MOUSE TRACKING ───
  const globalMouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const globalMouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
  const springX = useSpring(globalMouseX, { damping: 40, stiffness: 150 });
  const springY = useSpring(globalMouseY, { damping: 40, stiffness: 150 });

  useEffect(() => {
    const handleGlobalMove = (e) => {
      globalMouseX.set(e.clientX);
      globalMouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleGlobalMove);
    return () => window.removeEventListener('mousemove', handleGlobalMove);
  }, [globalMouseX, globalMouseY]);

  // ─── CARD 3D TILT EFFECT ───
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x - rect.width / 2);
    mouseY.set(y - rect.height / 2);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const tiltConfig = { damping: 25, stiffness: 120 };
  const rotateX = useSpring(useTransform(mouseY, [-310, 310], [5, -5]), tiltConfig);
  const rotateY = useSpring(useTransform(mouseX, [-210, 210], [-5, 5]), tiltConfig);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password, data.role);
      toast.success('Welcome back to JSK ERP!', { icon: '🎓' });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 lg:p-10 relative overflow-hidden font-sans"
      style={{
        background: `
          radial-gradient(circle at top left, rgba(168,85,247,0.18), transparent 40%),
          radial-gradient(circle at bottom right, rgba(124,58,237,0.18), transparent 40%),
          linear-gradient(135deg, #f8f5ff, #f5f3ff, #faf7ff)
        `
      }}
    >
      {/* ─── PREMIUM GRID TEXTURE ─── */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168,85,247,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
        }}
      />

      {/* ─── AMBIENT MOUSE GLOW ─── */}
      <motion.div
        className="fixed top-0 left-0 w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-multiply"
        style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
      />

      {/* ─── ANIMATED GRADIENT BLOBS ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div animate={{ x: [0, 80, 0], y: [0, -80, 0], scale: [1, 1.2, 1] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-35" />
        <motion.div animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.1, 1] }} transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/4 -right-32 w-[700px] h-[700px] bg-pink-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-35" />
        <motion.div animate={{ x: [0, 60, 0], y: [0, 60, 0], scale: [1, 1.3, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-40 left-1/4 w-[800px] h-[800px] bg-violet-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-35" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.5, 0.35] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-35" />
      </div>

      <Particles />
      <Aurora />

      {/* ─── MAIN CONTAINER ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[1400px] lg:h-[780px] min-h-[600px] bg-white/80 backdrop-blur-xl rounded-[40px] flex flex-col lg:flex-row overflow-hidden border border-white/60 shadow-[0_25px_60px_rgba(128,90,213,0.15)] z-10"
      >
        
        {/* ═══ LEFT SIDE: Illustration Enhancements ═══ */}
        <div className="hidden lg:flex w-[60%] h-full relative items-center justify-center p-16 overflow-hidden">
          
          {/* Enhanced Subtle ambient shadow behind illustration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-400/20 blur-[100px] rounded-full" />

          {/* Floating UI Decorative Elements */}
          <motion.div animate={{ y: [-15, 15, -15], rotate: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/4 left-[15%] w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-purple-50">
            <Plus className="text-purple-400 w-8 h-8" />
          </motion.div>
          <motion.div animate={{ y: [15, -15, 15], rotate: [0, -10, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-1/4 right-[20%] w-24 h-24 bg-white rounded-3xl shadow-xl border border-purple-50 opacity-80" />
          
          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-full max-w-[650px] relative z-10"
          >
            <img 
              src="https://illustrations.popsy.co/purple/web-design.svg" 
              alt="Dashboard Illustration" 
              className="w-full h-auto drop-shadow-[0_30px_50px_rgba(124,58,237,0.2)]"
              style={{ filter: 'hue-rotate(-15deg) saturate(1.1)' }}
            />
          </motion.div>
        </div>

        {/* ═══ RIGHT SIDE: Interactive Premium Login Card ═══ */}
        <div 
          className="w-full lg:w-[40%] h-full flex items-center justify-center relative p-6 perspective-[1000px]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Deep ambient lighting behind card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[650px] bg-[#9333ea]/30 blur-[120px] pointer-events-none rounded-[40px]" />

          <motion.div 
            ref={cardRef}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            style={{
              width: '420px',
              height: '620px',
              borderRadius: '36px',
              background: 'linear-gradient(135deg, rgba(139,92,246,0.95), rgba(168,85,247,0.92), rgba(192,132,252,0.90))',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 25px 80px rgba(124,58,237,0.35), 0 10px 30px rgba(0,0,0,0.12)',
              padding: '48px 42px',
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d'
            }}
            className="flex flex-col relative z-20 group"
          >
            {/* Dynamic Glass Reflection Overlay */}
            <div className="absolute inset-0 rounded-[36px] overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/25 blur-[60px] rounded-full transform translate-x-10 -translate-y-10 group-hover:bg-white/30 transition-colors duration-500" />
            </div>

            {/* ── Top Logo Section ── */}
            <div className="w-full text-center relative z-10 flex flex-col items-center" style={{ transform: 'translateZ(30px)' }}>
              <h1 className="text-white font-extrabold tracking-[-1px] leading-none m-0" style={{ fontSize: '42px' }}>
                JSK School
              </h1>
              <p className="text-white font-semibold uppercase" style={{ fontSize: '12px', letterSpacing: '3px', opacity: 0.75, marginTop: '-6px' }}>
                ERP Management System
              </p>
            </div>

            {/* ── Login Heading ── */}
            <h2 className="text-white font-bold w-full text-center relative z-10" style={{ fontSize: '30px', marginTop: '50px', marginBottom: '35px', transform: 'translateZ(40px)' }}>
              Login your account
            </h2>

            {/* ── Form Inputs ── */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col relative z-10" style={{ gap: '18px', transform: 'translateZ(50px)' }}>
              
              {/* Role Dropdown */}
              <motion.div className="relative w-full" animate={focusedInput === 'role' ? { scale: 1.02 } : { scale: 1 }} transition={{ duration: 0.2 }}>
                <select
                  style={{
                    height: '62px', borderRadius: '18px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)',
                    border: focusedInput === 'role' ? '1px solid rgba(255,255,255,0.35)' : '1px solid rgba(255,255,255,0.08)',
                    padding: '0 45px 0 20px', fontSize: '15px', fontWeight: 500,
                    boxShadow: focusedInput === 'role' ? '0 0 25px rgba(255,255,255,0.25)' : 'none',
                  }}
                  className="w-full text-white outline-none appearance-none cursor-pointer transition-all duration-300"
                  onFocus={() => setFocusedInput('role')} onBlur={() => setFocusedInput(null)}
                  {...register('role')}
                >
                  {roles.map(r => <option key={r.value} value={r.value} className="text-slate-900 bg-white">{r.label}</option>)}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-5 h-5 text-white/65" />
                </div>
              </motion.div>

              {/* Email Input */}
              <motion.div className="relative w-full" animate={focusedInput === 'email' ? { scale: 1.02 } : { scale: 1 }} transition={{ duration: 0.2 }}>
                <input
                  type="text" placeholder="Username or email"
                  style={{
                    height: '62px', borderRadius: '18px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)',
                    border: focusedInput === 'email' ? '1px solid rgba(255,255,255,0.35)' : '1px solid rgba(255,255,255,0.08)',
                    padding: '0 20px', fontSize: '15px', fontWeight: 500,
                    boxShadow: focusedInput === 'email' ? '0 0 25px rgba(255,255,255,0.25)' : 'none',
                  }}
                  className="w-full text-white placeholder-white/65 outline-none transition-all duration-300"
                  onFocus={() => setFocusedInput('email')} onBlur={() => setFocusedInput(null)}
                  {...register('email', { required: true })}
                />
              </motion.div>

              {/* Password Input */}
              <motion.div className="relative w-full" animate={focusedInput === 'password' ? { scale: 1.02 } : { scale: 1 }} transition={{ duration: 0.2 }}>
                <input
                  type={showPassword ? 'text' : 'password'} placeholder="Password"
                  style={{
                    height: '62px', borderRadius: '18px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)',
                    border: focusedInput === 'password' ? '1px solid rgba(255,255,255,0.35)' : '1px solid rgba(255,255,255,0.08)',
                    padding: '0 50px 0 20px', fontSize: '15px', fontWeight: 500,
                    boxShadow: focusedInput === 'password' ? '0 0 25px rgba(255,255,255,0.25)' : 'none',
                  }}
                  className="w-full text-white placeholder-white/65 outline-none transition-all duration-300"
                  onFocus={() => setFocusedInput('password')} onBlur={() => setFocusedInput(null)}
                  {...register('password', { required: true })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/65 hover:text-white transition-colors" tabIndex={-1}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </motion.div>

              {/* Forgot Password */}
              <div className="w-full text-right mt-1 mb-4" style={{ transform: 'translateZ(55px)' }}>
                <a href="#" className="text-white hover:underline transition-all" style={{ opacity: 0.75, fontSize: '14px' }}>
                  Forgot password?
                </a>
              </div>

              {/* Secure Login Button */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 15px 35px rgba(255,255,255,0.35)' }}
                whileTap={{ scale: 0.98 }}
                type="submit" disabled={isLoading}
                className="w-full bg-white text-[#7c3aed] flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden group"
                style={{ height: '60px', borderRadius: '999px', fontSize: '18px', fontWeight: 700, boxShadow: '0 8px 25px rgba(0,0,0,0.15)', transform: 'translateZ(60px)' }}
              >
                {/* Button Ripple/Shine effect */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
                {isLoading ? (
                  <svg className="w-6 h-6 animate-spin text-[#7c3aed]" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                ) : (
                  <>
                    Secure Login
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Bottom Section */}
            <div className="mt-auto pt-6 w-full relative z-10 flex flex-col items-center" style={{ transform: 'translateZ(30px)' }}>
              <div className="w-full h-px bg-white/15 mb-4" />
              <p className="text-white text-center" style={{ opacity: 0.70, fontSize: '13px', fontWeight: 500 }}>
                Need help? Contact Administrator
              </p>
            </div>

          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
