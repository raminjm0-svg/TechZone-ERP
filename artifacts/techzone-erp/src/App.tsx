import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { Layout } from '@/components/Layout';

import LoginPage from '@/pages/login';
import DashboardPage from '@/pages/dashboard';
import SalesPage from '@/pages/sales';
import InventoryPage from '@/pages/inventory';
import FinancePage from '@/pages/finance';
import HrPage from '@/pages/hr';
import CustomersPage from '@/pages/customers';

const queryClient = new QueryClient();

function Router({ 
  isLoggedIn, 
  onLogin, 
  onLogout 
}: { 
  isLoggedIn: boolean; 
  onLogin: () => void;
  onLogout: () => void;
}) {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoggedIn && location !== '/login') {
      setLocation('/login');
    }
    if (isLoggedIn && location === '/login') {
      setLocation('/');
    }
  }, [isLoggedIn, location, setLocation]);

  return (
    <Layout onLogout={onLogout}>
      <Switch>
        <Route path="/login">
          <LoginPage onLogin={onLogin} />
        </Route>
        
        {isLoggedIn && (
          <Switch>
            <Route path="/" component={DashboardPage} />
            <Route path="/sales" component={SalesPage} />
            <Route path="/inventory" component={InventoryPage} />
            <Route path="/finance" component={FinancePage} />
            <Route path="/hr" component={HrPage} />
            <Route path="/customers" component={CustomersPage} />
            <Route component={NotFound} />
          </Switch>
        )}
      </Switch>
    </Layout>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router 
            isLoggedIn={isLoggedIn} 
            onLogin={() => setIsLoggedIn(true)}
            onLogout={() => setIsLoggedIn(false)}
          />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
