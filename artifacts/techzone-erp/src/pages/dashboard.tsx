import {
  DollarSign, Package, Users, HeadphonesIcon,
  AlertTriangle, ShoppingCart, TrendingUp, CheckCircle, Clock, XCircle
} from 'lucide-react';
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { StatCard } from '@/components/StatCard';
import { dashboardData } from '@/data/dummyData';

/* ── helpers ── */
const fmt = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

const statusIcon: Record<string, React.ReactNode> = {
  Completed:  <CheckCircle className="w-4 h-4 text-emerald-600" />,
  Pending:    <Clock className="w-4 h-4 text-amber-600" />,
  Processing: <TrendingUp className="w-4 h-4 text-blue-600" />,
  Cancelled:  <XCircle className="w-4 h-4 text-rose-500" />,
};

const statusBadge: Record<string, string> = {
  Completed:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending:    'bg-amber-50 text-amber-700 border-amber-200',
  Processing: 'bg-blue-50 text-blue-700 border-blue-200',
  Cancelled:  'bg-rose-50 text-rose-700 border-rose-200',
};

/* ── donut chart data ── */
const categoryBreakdown = [
  { name: 'Smartphones', value: 38, color: '#0f172a' },
  { name: 'Laptops',     value: 27, color: '#3b82f6' },
  { name: 'TVs',         value: 18, color: '#6366f1' },
  { name: 'Audio',       value: 10, color: '#8b5cf6' },
  { name: 'Accessories', value: 7,  color: '#c4b5fd' },
];

/* ── richer monthly data ── */
const monthlySales = [
  { name: 'Jan', revenue: 340000, target: 300000 },
  { name: 'Feb', revenue: 420000, target: 350000 },
  { name: 'Mar', revenue: 380000, target: 400000 },
  { name: 'Apr', revenue: 510000, target: 420000 },
  { name: 'May', revenue: 475000, target: 450000 },
  { name: 'Jun', revenue: 647320, target: 500000 },
];

/* ── custom tooltip ── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-lg px-4 py-3 text-sm z-50 relative">
      <p className="font-semibold text-foreground mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="text-xs font-medium flex justify-between gap-4">
          <span>{p.name}</span> <span>{fmt(p.value)}</span>
        </p>
      ))}
    </div>
  );
};

/* ── custom donut label ── */
const renderDonutLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.06) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={12} fontWeight={600} className="drop-shadow-md">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

/* ════════════════════════════════════════════════ */
export default function Dashboard() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm font-medium text-muted-foreground mt-1">
          TechZone Electronics — Performance Overview · July 2026
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* ── KPI stat cards ── */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            variants={itemVariants}
            title="Total Revenue"
            value={fmt(dashboardData.totalSales)}
            icon={<DollarSign />}
            trend={{ value: 12.5, label: 'vs last month' }}
            accent="blue"
            data-testid="stat-revenue"
          />
          <StatCard
            variants={itemVariants}
            title="Active Products"
            value={dashboardData.totalProducts.toLocaleString()}
            icon={<Package />}
            description="Catalog items"
            accent="violet"
            data-testid="stat-products"
          />
          <StatCard
            variants={itemVariants}
            title="Employees"
            value={dashboardData.employees}
            icon={<Users />}
            trend={{ value: 3.1, label: 'new this quarter' }}
            accent="green"
            data-testid="stat-employees"
          />
          <StatCard
            variants={itemVariants}
            title="Total Customers"
            value={dashboardData.customers.toLocaleString()}
            icon={<HeadphonesIcon />}
            trend={{ value: 4.2, label: 'vs last month' }}
            accent="amber"
            data-testid="stat-customers"
          />
        </div>

        {/* ── Charts row ── */}
        <div className="grid gap-5 xl:grid-cols-3">
          {/* Area chart — 2/3 width */}
          <motion.div variants={itemVariants} className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-border p-6 relative overflow-hidden">
            <div className="flex items-start justify-between mb-8 relative z-10">
              <div>
                <h2 className="text-lg font-semibold text-foreground tracking-tight">Revenue vs Target</h2>
                <p className="text-xs font-medium text-muted-foreground mt-1">First Half 2026 Overview</p>
              </div>
              <div className="flex items-center gap-5 text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-1 rounded-full bg-primary inline-block" /> Revenue
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-1 rounded-full bg-blue-200 inline-block border-dashed border border-blue-300" /> Target
                </span>
              </div>
            </div>
            <div className="relative z-10">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--muted))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }} tickFormatter={v => `$${v / 1000}k`} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="target" name="Target" stroke="#93c5fd" strokeWidth={2} strokeDasharray="5 5" fill="none" dot={false} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#gradRevenue)" activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(var(--primary))' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Donut chart — 1/3 width */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-border p-6 flex flex-col">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground tracking-tight">Sales by Category</h2>
              <p className="text-xs font-medium text-muted-foreground mt-1">Revenue distribution</p>
            </div>
            <div className="flex-1 flex items-center justify-center mb-6">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none" labelLine={false} label={renderDonutLabel}>
                    {categoryBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v}%`, 'Share']} contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', fontSize: 12, fontWeight: 500, padding: '8px 12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {categoryBreakdown.map(c => (
                <div key={c.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-3 font-medium text-muted-foreground">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: c.color }} />
                    {c.name}
                  </span>
                  <span className="font-bold text-foreground">{c.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Bottom row: Recent Sales + Low Stock ── */}
        <div className="grid gap-5 xl:grid-cols-2">
          {/* Recent Sales */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-border overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-card">
              <div>
                <h2 className="text-lg font-semibold text-foreground tracking-tight">Recent Orders</h2>
                <p className="text-xs font-medium text-muted-foreground mt-1">Last 5 transactions</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="divide-y divide-border flex-1">
              {dashboardData.recentSales.map(sale => (
                <div key={sale.id} className="flex items-center px-6 py-4 hover:bg-muted/40 transition-colors group">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-bold text-foreground truncate mb-0.5">{sale.customer}</p>
                    <p className="text-xs font-medium text-muted-foreground truncate">{sale.product}</p>
                  </div>
                  <div className="text-right flex-shrink-0 mr-6">
                    <p className="text-sm font-bold text-foreground mb-0.5">{fmt(sale.amount)}</p>
                    <p className="text-xs font-medium text-muted-foreground">{sale.id}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border w-28 justify-center flex-shrink-0 ${statusBadge[sale.status] ?? 'bg-muted text-muted-foreground border-border'}`}>
                    {statusIcon[sale.status]}
                    {sale.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Low Stock Alerts */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-border overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-card">
              <div>
                <h2 className="text-lg font-semibold text-foreground tracking-tight">Inventory Alerts</h2>
                <p className="text-xs font-medium text-muted-foreground mt-1">Items requiring immediate reorder</p>
              </div>
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div className="divide-y divide-border flex-1">
              {dashboardData.lowStockAlerts.map(item => {
                const pct = Math.max(0, Math.round((item.stock / item.threshold) * 100));
                const isOut = item.stock === 0;
                return (
                  <div key={item.id} className="px-6 py-4 hover:bg-muted/40 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-bold text-foreground mb-0.5">{item.name}</p>
                        <p className="text-xs font-medium text-muted-foreground">{item.category} • {item.id}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border
                        ${isOut
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {isOut ? 'Out of Stock' : `${item.stock} left`}
                      </span>
                    </div>
                    {/* Stock progress bar */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full ${isOut ? 'bg-rose-500' : 'bg-amber-500'}`}
                        />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground flex-shrink-0 w-8 text-right">
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
