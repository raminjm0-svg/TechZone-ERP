import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Users, 
  Headphones,
  LogOut,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TZLogo } from '@/components/TZLogo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const navItems = [
  { title: 'Dashboard', href: '/', icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
  { title: 'Sales', href: '/sales', icon: <ShoppingCart className="w-[18px] h-[18px]" /> },
  { title: 'Inventory', href: '/inventory', icon: <Package className="w-[18px] h-[18px]" /> },
  { title: 'Finance', href: '/finance', icon: <DollarSign className="w-[18px] h-[18px]" /> },
  { title: 'Human Resources', href: '/hr', icon: <Users className="w-[18px] h-[18px]" /> },
  { title: 'Customer Service', href: '/customers', icon: <Headphones className="w-[18px] h-[18px]" /> },
];

export function Layout({ children, onLogout }: LayoutProps) {
  const [location] = useLocation();

  if (location === '/login') {
    return <>{children}</>;
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-xl z-20">
      <div className="p-6 flex items-center gap-3 border-b border-white/5 relative">
        <TZLogo size={36} />
        <span className="font-bold text-xl tracking-tight text-white">TechZone ERP</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div 
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 cursor-pointer overflow-hidden group ${
                  isActive 
                    ? 'text-white font-medium' 
                    : 'text-sidebar-foreground/70 hover:text-white'
                }`}
                data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}
              >
                {/* Background highlight pill */}
                <div className={`absolute inset-0 transition-opacity duration-300 ${isActive ? 'bg-sidebar-accent' : 'bg-white/5 opacity-0 group-hover:opacity-100'}`} />
                
                {/* Left border highlight */}
                {isActive && (
                  <motion.div layoutId="nav-active-border" className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r-full" />
                )}

                <div className="relative z-10 flex items-center gap-3">
                  <div className={`${isActive ? 'text-primary' : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80'}`}>
                    {item.icon}
                  </div>
                  <span className="text-[14px]">{item.title}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 bg-sidebar/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <Avatar className="h-10 w-10 border-2 border-sidebar-border bg-sidebar-accent">
            <AvatarFallback className="bg-primary/20 text-primary font-medium">RA</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">Rami Admin</span>
            <span className="text-xs text-sidebar-foreground/60">rami@techzone.com</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-center gap-2 border-white/10 text-sidebar-foreground/80 hover:bg-white/5 hover:text-white bg-transparent rounded-lg h-9"
          onClick={onLogout}
          data-testid="btn-logout"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-xs font-medium">Logout</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">
      {/* Mobile Header & Sidebar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-sidebar-border bg-sidebar text-white shadow-sm z-30 relative">
        <div className="flex items-center gap-3">
          <TZLogo size={28} />
          <span className="font-bold text-lg tracking-tight">TechZone</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-lg">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px] bg-sidebar border-sidebar-border">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[256px] shrink-0 h-screen sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-30">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden relative">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
