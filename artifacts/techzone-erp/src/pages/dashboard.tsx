import {
  DollarSign, Package, Users, HeadphonesIcon,
  AlertTriangle, ShoppingCart, TrendingUp, CheckCircle,
  Clock, XCircle, UserCheck, ArrowRight, Zap,
} from 'lucide-react';
import {
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import { StatCard } from '@/components/StatCard';
import { useERP } from '@/context/ERPContext';
import { dashboardData } from '@/data/dummyData';

/* ── formatters ── */
const fmt = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

/* ── status helpers ── */
const statusIcon: Record<string, React.ReactNode> = {
  Completed:  <CheckCircle  className="w-3.5 h-3.5 text-emerald-500" />,
  Pending:    <Clock        className="w-3.5 h-3.5 text-amber-500"   />,
  Processing: <TrendingUp   className="w-3.5 h-3.5 text-blue-500"   />,
  Cancelled:  <XCircle      className="w-3.5 h-3.5 text-rose-500"   />,
};
const statusBadge: Record<string, string> = {
  Completed:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending:    'bg-amber-50  text-amber-700  border-amber-200',
  Processing: 'bg-blue-50   text-blue-700   border-blue-200',
  Cancelled:  'bg-rose-50   text-rose-700   border-rose-200',
};

/* ── static chart data ── */
const revenueData = [
  { month: 'Jan', revenue: 340000, target: 300000 },
  { month: 'Feb', revenue: 420000, target: 350000 },
  { month: 'Mar', revenue: 380000, target: 400000 },
  { month: 'Apr', revenue: 510000, target: 420000 },
  { month: 'May', revenue: 475000, target: 450000 },
  { month: 'Jun', revenue: 647320, target: 500000 },
];
const monthlySalesBar = [
  { month: 'Jan', Smartphones: 120, Laptops: 85, TVs: 42, Audio: 95,  Accessories: 210 },
  { month: 'Feb', Smartphones: 145, Laptops: 92, TVs: 38, Audio: 110, Accessories: 240 },
  { month: 'Mar', Smartphones: 132, Laptops: 78, TVs: 55, Audio: 88,  Accessories: 195 },
  { month: 'Apr', Smartphones: 168, Laptops: 105,TVs: 61, Audio: 130, Accessories: 280 },
  { month: 'May', Smartphones: 155, Laptops: 98, TVs: 49, Audio: 115, Accessories: 265 },
  { month: 'Jun', Smartphones: 201, Laptops: 134,TVs: 72, Audio: 148, Accessories: 320 },
];
const BAR_COLORS: Record<string, string> = {
  Smartphones: '#3b82f6', Laptops: '#6366f1', TVs: '#8b5cf6',
  Audio: '#10b981', Accessories: '#f59e0b',
};
const categoryBreakdown = [
  { name: 'Smartphones', value: 38, color: '#0f172a' },
  { name: 'Laptops',     value: 27, color: '#3b82f6' },
  { name: 'TVs',         value: 18, color: '#6366f1' },
  { name: 'Audio',       value: 10, color: '#8b5cf6' },
  { name: 'Accessories', value: 7,  color: '#c4b5fd' },
];

/* ── custom tooltip ── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl shadow-xl px-4 py-3 text-sm">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-5 mb-0.5">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="text-xs font-bold text-foreground">
            {p.value > 10000 ? fmt(p.value) : p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};
const DonutLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.06) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/* ── framer variants ── */
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } } };

/* ════════════════════════════════════════════════ */
export default function Dashboard() {
  const {
    orders, products,
    totalRevenue, totalOrders, totalProductsCount,
    lowStockProducts,
  } = useERP();

  /* Recent 8 orders from live context */
  const recentOrders = orders.slice(0, 8);

  /* Products sold = sum of quantities from completed orders */
  const productsSold = orders
    .filter(o => o.status === 'Completed' && o.quantity)
    .reduce((sum, o) => sum + (o.quantity ?? 0), 0);

  /* Low stock alert count */
  const criticalCount = lowStockProducts.length;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            TechZone Electronics — Performance Overview · July 2026
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          {criticalCount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5" />
              {criticalCount} Critical Stock Alert{criticalCount > 1 ? 's' : ''}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Data
          </span>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">

        {/* ── 5 KPI cards (live from context) ── */}
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard variants={item} title="Total Revenue"   value={fmt(totalRevenue)}                     icon={<DollarSign />}    trend={{ value: 12.5, label: 'vs last month' }} accent="blue"   />
          <StatCard variants={item} title="Total Orders"    value={totalOrders.toLocaleString()}           icon={<ShoppingCart />}  trend={{ value: 8.3,  label: 'vs last month' }} accent="violet" />
          <StatCard variants={item} title="Total Products"  value={totalProductsCount.toLocaleString()}    icon={<Package />}       description="Active catalog items"               accent="green"  />
          <StatCard variants={item} title="Total Customers" value={dashboardData.customers.toLocaleString()} icon={<HeadphonesIcon />} trend={{ value: 4.2, label: 'vs last month' }} accent="amber" />
          <StatCard variants={item} title="Total Employees" value={dashboardData.employees}                icon={<UserCheck />}     trend={{ value: 3.1,  label: 'new this quarter' }} accent="rose" />
        </div>

        {/* ── Live sync notice (when new orders exist) ── */}
        {productsSold > 0 && (
          <motion.div variants={item} className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-5 py-3">
            <Zap className="w-4 h-4 text-primary flex-shrink-0" />
            <p className="text-sm font-medium text-foreground">
              <span className="font-bold text-primary">{productsSold} units</span> sold via completed orders this session —
              inventory quantities and finance ledger updated automatically.
            </p>
          </motion.div>
        )}

        {/* ── Row 2: Revenue Area + Donut ── */}
        <div className="grid gap-5 xl:grid-cols-3">

          <motion.div variants={item} className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground tracking-tight">Revenue Chart</h2>
                <p className="text-xs font-medium text-muted-foreground mt-0.5">Revenue vs Target · H1 2026</p>
              </div>
              <div className="flex items-center gap-5 text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-2"><span className="w-3 h-[3px] rounded-full bg-primary" /> Revenue</span>
                <span className="flex items-center gap-2"><span className="w-3 h-[3px] rounded-full bg-blue-200" /> Target</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={270}>
              <AreaChart data={revenueData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="target"  name="Target"  stroke="#93c5fd" strokeWidth={2} strokeDasharray="5 5" fill="none" dot={false} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#gradRev)" activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(var(--primary))' }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div variants={item} className="bg-white rounded-2xl shadow-sm border border-border p-6 flex flex-col">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-foreground tracking-tight">Sales by Category</h2>
              <p className="text-xs font-medium text-muted-foreground mt-0.5">Revenue distribution</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value" stroke="none" labelLine={false} label={DonutLabel}>
                    {categoryBreakdown.map((c, i) => <Cell key={i} fill={c.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v}%`, 'Share']} contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', fontSize: 12, fontWeight: 500, padding: '8px 12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2.5 mt-2">
              {categoryBreakdown.map(c => (
                <div key={c.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2.5 font-medium text-muted-foreground">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                    {c.name}
                  </span>
                  <span className="font-bold text-foreground">{c.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Row 3: Monthly Sales Bar Chart (full width) ── */}
        <motion.div variants={item} className="bg-white rounded-2xl shadow-sm border border-border p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground tracking-tight">Monthly Sales</h2>
              <p className="text-xs font-medium text-muted-foreground mt-0.5">Units sold by category · H1 2026</p>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {Object.entries(BAR_COLORS).map(([cat, color]) => (
                <span key={cat} className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />{cat}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlySalesBar} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} barSize={14} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--muted))" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }} />
              {Object.entries(BAR_COLORS).map(([cat, color]) => (
                <Bar key={cat} dataKey={cat} stackId="a" fill={color} radius={cat === 'Accessories' ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ── Row 4: Recent Orders Table + Low Stock ── */}
        <div className="grid gap-5 xl:grid-cols-3">

          {/* Recent Orders */}
          <motion.div variants={item} className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground tracking-tight">Recent Orders</h2>
                <p className="text-xs font-medium text-muted-foreground mt-0.5">
                  Latest {recentOrders.length} of {orders.length} total orders
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a href="/sales" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ShoppingCart className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-6 py-3 text-xs font-bold text-muted-foreground tracking-wider">Order ID</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground tracking-wider">Customer</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground tracking-wider hidden md:table-cell">Product</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground tracking-wider hidden lg:table-cell">Date</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground tracking-wider">Total</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-3.5">
                        <span className="font-mono text-xs font-bold text-primary">{order.id}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-foreground text-sm">{order.customer}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground truncate max-w-[160px] block">{order.products}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span className="text-xs font-medium text-muted-foreground">{order.date}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="font-bold text-foreground">{fmt(order.total)}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${statusBadge[order.status] ?? 'bg-muted text-muted-foreground border-border'}`}>
                          {statusIcon[order.status]}
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Low Stock Products (live from context — threshold < 5) */}
          <motion.div variants={item} className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground tracking-tight">Low Stock</h2>
                <p className="text-xs font-medium text-muted-foreground mt-0.5">
                  Items below 5 units — updates live
                </p>
              </div>
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
            </div>

            {/* summary */}
            <div className="px-6 pt-4 pb-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                {lowStockProducts.filter(x => x.stock === 0).length} Out of Stock
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {lowStockProducts.filter(x => x.stock > 0).length} Critical
              </span>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center px-6">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                  <Package className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-sm font-bold text-foreground">All stocked up!</p>
                <p className="text-xs text-muted-foreground mt-1">No products below 5 units.</p>
              </div>
            ) : (
              <div className="divide-y divide-border flex-1">
                {lowStockProducts.map(p => {
                  const pct    = Math.max(0, Math.round((p.stock / 5) * 100));
                  const isOut  = p.stock === 0;
                  return (
                    <div key={p.id} className="px-6 py-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between mb-2.5">
                        <div className="min-w-0 pr-3">
                          <p className="text-sm font-bold text-foreground truncate">{p.name}</p>
                          <p className="text-xs font-medium text-muted-foreground mt-0.5">{p.category} · {p.id}</p>
                        </div>
                        <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border ${
                          isOut
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {isOut ? 'Out' : `${p.stock} left`}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.9, ease: 'easeOut' }}
                            className={`h-full rounded-full ${isOut ? 'bg-rose-500' : 'bg-amber-500'}`}
                          />
                        </div>
                        <span className="text-xs font-bold text-muted-foreground w-8 text-right flex-shrink-0">
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
