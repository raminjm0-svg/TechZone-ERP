import { useState } from 'react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { TZLogo } from '@/components/TZLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

/* ── validation schema ── */
const loginSchema = z.object({
  email:    z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});
type LoginForm = z.infer<typeof loginSchema>;

/* ════════════════ Tech Illustration ════════════════ */
function TechIllustration() {
  return (
    <svg
      viewBox="0 0 520 460"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[480px]"
      aria-hidden="true"
    >
      <defs>
        {/* Glow filter for nodes */}
        <filter id="nodeGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        {/* Screen gradient */}
        <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#0d1f3c" />
          <stop offset="100%" stopColor="#0a1628" />
        </linearGradient>

        {/* Blue glow gradient */}
        <radialGradient id="blueAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#3b82f6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>

        {/* Bar chart gradient */}
        <linearGradient id="barBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="barViolet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="barGreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* ── Ambient aura behind monitor ── */}
      <ellipse cx="260" cy="195" rx="170" ry="120" fill="url(#blueAura)" />

      {/* ════ Monitor Bezel ════ */}
      <rect x="110" y="72" width="300" height="198" rx="14"
        fill="#0d1e36" stroke="#1e3f6a" strokeWidth="1.5" />
      {/* Screen area */}
      <rect x="120" y="82" width="280" height="178" rx="8"
        fill="url(#screenGrad)" />

      {/* ── Screen: top bar ── */}
      <rect x="120" y="82" width="280" height="22" rx="8" fill="#0d2240" />
      <rect x="120" y="95" width="280" height="9" fill="#0d2240" />
      {/* traffic lights */}
      <circle cx="135" cy="93" r="3.5" fill="#ef4444" opacity="0.8" />
      <circle cx="147" cy="93" r="3.5" fill="#f59e0b" opacity="0.8" />
      <circle cx="159" cy="93" r="3.5" fill="#10b981" opacity="0.8" />
      {/* window title */}
      <rect x="215" y="90" width="90" height="6" rx="3" fill="#1e3f6a" opacity="0.7" />

      {/* ── Screen: stat cards row ── */}
      {/* Card 1 */}
      <rect x="130" y="112" width="58" height="36" rx="5" fill="#122040" />
      <rect x="130" y="112" width="58" height="3" rx="1.5" fill="#3b82f6" />
      <rect x="135" y="120" width="28" height="4" rx="2" fill="#1e3f6a" />
      <rect x="135" y="128" width="38" height="7" rx="2" fill="#3b82f6" opacity="0.9" />
      <rect x="135" y="139" width="22" height="3" rx="1.5" fill="#10b981" opacity="0.7" />
      {/* Card 2 */}
      <rect x="196" y="112" width="58" height="36" rx="5" fill="#122040" />
      <rect x="196" y="112" width="58" height="3" rx="1.5" fill="#8b5cf6" />
      <rect x="201" y="120" width="28" height="4" rx="2" fill="#1e3f6a" />
      <rect x="201" y="128" width="34" height="7" rx="2" fill="#8b5cf6" opacity="0.9" />
      <rect x="201" y="139" width="24" height="3" rx="1.5" fill="#10b981" opacity="0.7" />
      {/* Card 3 */}
      <rect x="262" y="112" width="58" height="36" rx="5" fill="#122040" />
      <rect x="262" y="112" width="58" height="3" rx="1.5" fill="#10b981" />
      <rect x="267" y="120" width="28" height="4" rx="2" fill="#1e3f6a" />
      <rect x="267" y="128" width="30" height="7" rx="2" fill="#10b981" opacity="0.9" />
      <rect x="267" y="139" width="20" height="3" rx="1.5" fill="#10b981" opacity="0.7" />
      {/* Card 4 */}
      <rect x="328" y="112" width="62" height="36" rx="5" fill="#122040" />
      <rect x="328" y="112" width="62" height="3" rx="1.5" fill="#f59e0b" />
      <rect x="333" y="120" width="28" height="4" rx="2" fill="#1e3f6a" />
      <rect x="333" y="128" width="32" height="7" rx="2" fill="#f59e0b" opacity="0.9" />
      <rect x="333" y="139" width="18" height="3" rx="1.5" fill="#10b981" opacity="0.7" />

      {/* ── Screen: chart area ── */}
      <rect x="130" y="156" width="170" height="94" rx="5" fill="#0e1e34" />
      {/* chart label */}
      <rect x="137" y="163" width="60" height="4" rx="2" fill="#1e3f6a" />
      {/* chart grid lines */}
      <line x1="137" y1="200" x2="293" y2="200" stroke="#1e3f6a" strokeWidth="0.5" />
      <line x1="137" y1="220" x2="293" y2="220" stroke="#1e3f6a" strokeWidth="0.5" />
      <line x1="137" y1="240" x2="293" y2="240" stroke="#1e3f6a" strokeWidth="0.5" />
      {/* area chart fill */}
      <path d="M140 238 L157 225 L174 232 L191 215 L208 220 L225 205 L242 210 L259 196 L276 202 L293 188 L293 248 L140 248 Z"
        fill="#3b82f6" opacity="0.12" />
      {/* area chart line */}
      <polyline points="140,238 157,225 174,232 191,215 208,220 225,205 242,210 259,196 276,202 293,188"
        stroke="#3b82f6" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* active dot */}
      <circle cx="293" cy="188" r="3.5" fill="#3b82f6" filter="url(#nodeGlow)" />

      {/* ── Screen: mini bar chart ── */}
      <rect x="308" y="156" width="82" height="94" rx="5" fill="#0e1e34" />
      <rect x="316" y="163" width="40" height="4" rx="2" fill="#1e3f6a" />
      {/* bars */}
      <rect x="318" y="210" width="10" height="35" rx="2" fill="url(#barBlue)" opacity="0.9" />
      <rect x="332" y="200" width="10" height="45" rx="2" fill="url(#barViolet)" opacity="0.9" />
      <rect x="346" y="220" width="10" height="25" rx="2" fill="url(#barGreen)" opacity="0.9" />
      <rect x="360" y="215" width="10" height="30" rx="2" fill="url(#barBlue)" opacity="0.7" />
      <rect x="374" y="205" width="10" height="40" rx="2" fill="url(#barViolet)" opacity="0.7" />
      {/* grid line */}
      <line x1="315" y1="245" x2="387" y2="245" stroke="#1e3f6a" strokeWidth="0.5" />

      {/* ── Monitor stand ── */}
      <rect x="245" y="270" width="30" height="22" rx="3" fill="#0d1e36" />
      <rect x="218" y="290" width="84" height="10" rx="5" fill="#0d1e36" />
      <rect x="222" y="295" width="76" height="3" rx="1.5" fill="#1e3f6a" opacity="0.5" />

      {/* ════ Circuit Traces ════ */}
      {/* Top-left trace */}
      <path d="M130 110 L80 110 L80 55 L32 55" stroke="#3b82f6" strokeWidth="1"
        strokeOpacity="0.45" fill="none" />
      <path d="M80 55 L55 55 L55 24" stroke="#3b82f6" strokeWidth="0.8"
        strokeOpacity="0.3" fill="none" />
      <path d="M80 110 L80 140 L44 140" stroke="#3b82f6" strokeWidth="0.8"
        strokeOpacity="0.25" fill="none" />

      {/* Top-right trace */}
      <path d="M390 110 L440 110 L440 55 L488 55" stroke="#8b5cf6" strokeWidth="1"
        strokeOpacity="0.45" fill="none" />
      <path d="M440 55 L465 55 L465 24" stroke="#8b5cf6" strokeWidth="0.8"
        strokeOpacity="0.3" fill="none" />
      <path d="M440 110 L440 145 L476 145" stroke="#8b5cf6" strokeWidth="0.8"
        strokeOpacity="0.25" fill="none" />

      {/* Bottom-left trace */}
      <path d="M130 220 L80 220 L80 310 L32 310" stroke="#3b82f6" strokeWidth="1"
        strokeOpacity="0.4" fill="none" />
      <path d="M80 310 L80 360 L44 360" stroke="#3b82f6" strokeWidth="0.8"
        strokeOpacity="0.3" fill="none" />
      <path d="M80 310 L44 310" stroke="#3b82f6" strokeWidth="0.8"
        strokeOpacity="0.25" fill="none" />

      {/* Bottom-right trace */}
      <path d="M390 220 L440 220 L440 330 L488 330" stroke="#10b981" strokeWidth="1"
        strokeOpacity="0.4" fill="none" />
      <path d="M440 330 L440 375 L465 375" stroke="#10b981" strokeWidth="0.8"
        strokeOpacity="0.3" fill="none" />
      <path d="M440 330 L476 330" stroke="#10b981" strokeWidth="0.8"
        strokeOpacity="0.25" fill="none" />

      {/* Bottom center trace */}
      <path d="M260 300 L260 360 L200 360 L200 400" stroke="#f59e0b" strokeWidth="0.8"
        strokeOpacity="0.3" fill="none" />
      <path d="M260 360 L320 360 L320 400" stroke="#f59e0b" strokeWidth="0.8"
        strokeOpacity="0.25" fill="none" />

      {/* ════ Nodes ════ */}
      {/* Junction nodes — medium */}
      <circle cx="80" cy="110" r="3.5" fill="#3b82f6" opacity="0.85" filter="url(#nodeGlow)" />
      <circle cx="80" cy="55" r="3.5" fill="#3b82f6" opacity="0.7" />
      <circle cx="440" cy="110" r="3.5" fill="#8b5cf6" opacity="0.85" filter="url(#nodeGlow)" />
      <circle cx="440" cy="55" r="3.5" fill="#8b5cf6" opacity="0.7" />
      <circle cx="80" cy="220" r="3.5" fill="#3b82f6" opacity="0.8" />
      <circle cx="80" cy="310" r="3.5" fill="#3b82f6" opacity="0.85" filter="url(#nodeGlow)" />
      <circle cx="440" cy="220" r="3.5" fill="#10b981" opacity="0.8" />
      <circle cx="440" cy="330" r="3.5" fill="#10b981" opacity="0.85" filter="url(#nodeGlow)" />
      <circle cx="260" cy="360" r="3.5" fill="#f59e0b" opacity="0.7" />

      {/* Terminal nodes — larger, glowing */}
      <circle cx="32" cy="55" r="6.5" fill="#3b82f6" opacity="0.6" filter="url(#softGlow)" />
      <circle cx="32" cy="55" r="3.5" fill="#60a5fa" opacity="0.9" />
      <circle cx="488" cy="55" r="6.5" fill="#8b5cf6" opacity="0.6" filter="url(#softGlow)" />
      <circle cx="488" cy="55" r="3.5" fill="#a78bfa" opacity="0.9" />
      <circle cx="32" cy="310" r="6.5" fill="#3b82f6" opacity="0.6" filter="url(#softGlow)" />
      <circle cx="32" cy="310" r="3.5" fill="#60a5fa" opacity="0.9" />
      <circle cx="488" cy="330" r="6.5" fill="#10b981" opacity="0.6" filter="url(#softGlow)" />
      <circle cx="488" cy="330" r="3.5" fill="#34d399" opacity="0.9" />

      {/* ════ Floating Data Cards ════ */}
      {/* Top-left data card */}
      <rect x="4" y="22" width="122" height="52" rx="8"
        fill="#0d1e36" stroke="#1e3f6a" strokeWidth="1" />
      <rect x="4" y="22" width="122" height="3" rx="1.5" fill="#3b82f6" opacity="0.8" />
      <rect x="12" y="30" width="50" height="4" rx="2" fill="#1e3f6a" />
      <rect x="12" y="38" width="70" height="9" rx="2" fill="#3b82f6" opacity="0.8" />
      <rect x="12" y="52" width="30" height="4" rx="2" fill="#10b981" opacity="0.6" />
      <rect x="46" y="52" width="28" height="4" rx="2" fill="#1e3f6a" opacity="0.6" />

      {/* Top-right data card */}
      <rect x="394" y="22" width="122" height="52" rx="8"
        fill="#0d1e36" stroke="#1e3f6a" strokeWidth="1" />
      <rect x="394" y="22" width="122" height="3" rx="1.5" fill="#8b5cf6" opacity="0.8" />
      <rect x="402" y="30" width="50" height="4" rx="2" fill="#1e3f6a" />
      <rect x="402" y="38" width="65" height="9" rx="2" fill="#8b5cf6" opacity="0.8" />
      <rect x="402" y="52" width="30" height="4" rx="2" fill="#10b981" opacity="0.6" />
      <rect x="436" y="52" width="28" height="4" rx="2" fill="#1e3f6a" opacity="0.6" />

      {/* Bottom-left data card */}
      <rect x="4" y="295" width="120" height="44" rx="8"
        fill="#0d1e36" stroke="#1e3f6a" strokeWidth="1" />
      <rect x="4" y="295" width="120" height="3" rx="1.5" fill="#3b82f6" opacity="0.6" />
      <rect x="12" y="303" width="40" height="4" rx="2" fill="#1e3f6a" />
      <rect x="12" y="311" width="60" height="7" rx="2" fill="#3b82f6" opacity="0.7" />
      <rect x="12" y="323" width="48" height="4" rx="2" fill="#1e3f6a" opacity="0.5" />

      {/* Bottom-right data card */}
      <rect x="394" y="314" width="122" height="44" rx="8"
        fill="#0d1e36" stroke="#1e3f6a" strokeWidth="1" />
      <rect x="394" y="314" width="122" height="3" rx="1.5" fill="#10b981" opacity="0.6" />
      <rect x="402" y="322" width="40" height="4" rx="2" fill="#1e3f6a" />
      <rect x="402" y="330" width="55" height="7" rx="2" fill="#10b981" opacity="0.7" />
      <rect x="402" y="342" width="44" height="4" rx="2" fill="#1e3f6a" opacity="0.5" />

      {/* ── Small decorative dots scattered ── */}
      <circle cx="55" cy="175" r="2" fill="#3b82f6" opacity="0.3" />
      <circle cx="68" cy="248" r="1.5" fill="#3b82f6" opacity="0.25" />
      <circle cx="462" cy="175" r="2" fill="#8b5cf6" opacity="0.3" />
      <circle cx="475" cy="258" r="1.5" fill="#8b5cf6" opacity="0.25" />
      <circle cx="165" cy="420" r="2" fill="#3b82f6" opacity="0.2" />
      <circle cx="355" cy="420" r="2" fill="#8b5cf6" opacity="0.2" />
      <circle cx="260" cy="430" r="2.5" fill="#f59e0b" opacity="0.3" />
    </svg>
  );
}

/* ════════════════════════════════════════════════ */
export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [, setLocation]   = useLocation();
  const [shake, setShake] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  function onSubmit(data: LoginForm) {
    if (data.email === 'rami@techzone.com' && data.password === 'Rami2026') {
      onLogin();
      setLocation('/');
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      form.setError('email',    { message: 'Invalid email or password' });
      form.setError('password', { message: 'Invalid email or password' });
    }
  }

  return (
    <div className="min-h-[100dvh] w-full flex flex-col lg:flex-row bg-[#0b1329] overflow-hidden">

      {/* ══════ Left Panel: Brand + Illustration ══════ */}
      <div className="hidden lg:flex flex-col w-[52%] xl:w-1/2 relative overflow-hidden">

        {/* Subtle dot-grid background */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />

        {/* Top-left gradient bloom */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        {/* Bottom-right gradient bloom */}
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 p-10">
          <div className="flex items-center gap-3">
            <TZLogo size={44} />
            <span className="text-white font-bold text-xl tracking-tight">TechZone ERP</span>
          </div>
        </div>

        {/* Centre: illustration */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="w-full"
          >
            <TechIllustration />
          </motion.div>
        </div>

        {/* Bottom headline */}
        <div className="relative z-10 px-10 pb-12">
          <h2 className="text-3xl font-bold text-white leading-snug tracking-tight mb-3">
            Your operations,<br />
            <span className="text-blue-400">unified in one place.</span>
          </h2>
          <p className="text-[#7b93b8] text-sm font-medium leading-relaxed max-w-sm">
            Sales, inventory, finance, HR, and customer service — all managed from a single command center.
          </p>
        </div>

        {/* Copyright */}
        <div className="relative z-10 px-10 pb-6 text-[#3d5a80] text-xs font-medium">
          © {new Date().getFullYear()} TechZone Electronics. All rights reserved.
        </div>
      </div>

      {/* ══════ Right Panel: Login Form ══════ */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white lg:rounded-l-[2.5rem] relative min-h-[100dvh] lg:min-h-0">

        {/* Mobile logo */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
          <TZLogo size={34} />
          <span className="font-bold text-lg text-[#0b1329]">TechZone ERP</span>
        </div>

        <motion.div
          animate={shake ? { x: [-10, 10, -8, 8, 0] } : {}}
          transition={{ duration: 0.38, ease: 'easeInOut' }}
          className="w-full max-w-[400px] px-8 py-10"
        >
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-[#0b1329] mb-1.5">
              Welcome back
            </h1>
            <p className="text-[#6b7a99] text-sm font-medium">
              Sign in to access your TechZone dashboard
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#1a2540]">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa5bf] pointer-events-none">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </span>
                        <Input
                          {...field}
                          type="email"
                          placeholder="you@techzone.com"
                          autoComplete="email"
                          data-testid="input-email"
                          className="h-12 pl-10 pr-4 rounded-xl border-[#dde3f0] bg-[#f8fafd] focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-1.5">
                      <FormLabel className="text-sm font-semibold text-[#1a2540] mb-0">
                        Password
                      </FormLabel>
                      <button
                        type="button"
                        className="text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors"
                        onClick={() => {/* placeholder — no-op for frontend demo */}}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa5bf] pointer-events-none">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </span>
                        <Input
                          {...field}
                          type={showPw ? 'text' : 'password'}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          data-testid="input-password"
                          className="h-12 pl-10 pr-11 rounded-xl border-[#dde3f0] bg-[#f8fafd] focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw(v => !v)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9aa5bf] hover:text-[#4a5568] transition-colors"
                          aria-label={showPw ? 'Hide password' : 'Show password'}
                        >
                          {showPw
                            ? <EyeOff className="w-4 h-4" />
                            : <Eye     className="w-4 h-4" />
                          }
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Remember Me */}
              <div className="flex items-center gap-2.5 pt-1">
                <input
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-[#c5cfe0] text-blue-500 accent-blue-500 cursor-pointer"
                />
                <label htmlFor="remember" className="text-sm text-[#6b7a99] cursor-pointer select-none">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                data-testid="btn-login"
                className="w-full h-12 mt-2 text-[15px] font-semibold rounded-xl bg-[#1a3bdb] hover:bg-[#1530c7] text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign in
              </Button>

            </form>
          </Form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-[#eaeff8]" />
            <span className="text-[11px] font-semibold text-[#b0bcd4] tracking-widest uppercase">Secure Access</span>
            <div className="flex-1 h-px bg-[#eaeff8]" />
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 text-[#b0bcd4]">
            <span className="flex items-center gap-1.5 text-xs font-medium">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              SSL Encrypted
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              2FA Ready
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              GDPR Compliant
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
