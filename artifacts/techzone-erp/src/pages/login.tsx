import { useState } from 'react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { TZLogo } from '@/components/TZLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [, setLocation] = useLocation();
  const [shake, setShake] = useState(false);
  
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: LoginForm) {
    if (data.email === 'rami@techzone.com' && data.password === 'Rami2026') {
      onLogin();
      setLocation('/');
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      form.setError('email', { message: 'Invalid credentials' });
      form.setError('password', { message: 'Invalid credentials' });
    }
  }

  return (
    <div className="min-h-[100dvh] w-full flex flex-col lg:flex-row bg-white">
      {/* Left Panel: Brand / Abstract Tech Pattern */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-sidebar text-white p-12 relative overflow-hidden">
        {/* Subtle grid/circuit pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-br from-primary/20 to-transparent opacity-30 pointer-events-none blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <TZLogo size={48} />
          </div>
        </div>

        <div className="relative z-10 max-w-lg mb-20">
          <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
            Control your <br/>
            <span className="text-primary">operations</span> with precision.
          </h1>
          <p className="text-lg text-sidebar-foreground/70 font-medium">
            TechZone ERP provides a clear view into sales, inventory, and human resources—all from a single, powerful command center.
          </p>
        </div>

        <div className="relative z-10 text-sm font-medium text-sidebar-foreground/50">
          &copy; {new Date().getFullYear()} TechZone Electronics. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background/50 lg:bg-white relative">
        {/* Mobile Logo fallback */}
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-2">
          <TZLogo size={32} />
          <span className="font-bold text-xl text-sidebar">TechZone ERP</span>
        </div>

        <motion.div 
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-black/[0.03] border border-border lg:border-transparent lg:shadow-none"
        >
          <div className="space-y-2 mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Sign In</h2>
            <p className="text-muted-foreground font-medium">Enter your credentials to access the ERP</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="name@techzone.com" 
                        {...field} 
                        data-testid="input-email" 
                        className="h-12 px-4 rounded-xl border-border bg-background/50 focus:bg-white transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        data-testid="input-password" 
                        className="h-12 px-4 rounded-xl border-border bg-background/50 focus:bg-white transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0" 
                data-testid="btn-login"
              >
                Access Dashboard
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
