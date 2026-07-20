import React from 'react';
import {
  DollarSign, Package, Users, HeadphonesIcon,
  AlertTriangle, ShoppingCart, TrendingUp, CheckCircle, Clock, XCircle
} from 'lucide-react';
import {
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { StatCard } from '@/components/StatCard';
import { dashboardData } from '@/data/dummyData';
import { Badge } from '@/components/ui/badge';

/* ── helpers ── */
const fmt = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

const statusIcon: Record<string, React.ReactNode> = {
  Completed:  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />,
  Pending:    <Clock className="w-3.5 h-3.5 text-amber-500" />,
  Processing: <TrendingUp className="w-3.5 h-3.5 text-blue-500" />,
  Cancelled:  <XCircle className="w-3.5 h-3.5 text-rose-400" />,
};

const statusBadge: Record<string, string> = {
  Completed:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending:    'bg-amber-50 text-amber-700 border-amber-200',
  Processing: 'bg-blue-50 text-blue-700 border-blue-200',
  Cancelled:  'bg-rose-50 text-rose-600 border-rose-200',
};

/* ── donut chart data ── */
const categoryBreakdown = [
  { name: 'Smartphones', value: 38, color: '#1e3a8a' },
  { name: 'Laptops',     value: 27, color: '#3b82f6' },
  { name: 'TVs',         value: 18, color: '#6366f1' },
  { name: 'Audio',       value: 10, color: '#8b5cf6' },
  { name: 'Accessories', value: 7,  color: '#a78bfa' },
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
    <div className="bg-white border border-border rounded-xl shadow-md px-4 py-3 text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="text-xs">
          {p.name}: <span className="font-medium">{fmt(p.value)}</span>
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
      fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/* ════════════════════════════════════════════════ */
export default function Dashboard() {
  return (
    <div className="space-y-7">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          TechZone Electronics — performance overview · July 2026
        </p>
      </div>

      {/* ── KPI stat cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={fmt(dashboardData.totalSales)}
          icon={<DollarSign />}
          trend={{ value: 12.5, label: 'vs last month' }}
          accent="blue"
          data-testid="stat-revenue"
        />
        <StatCard
          title="Products"
          value={dashboardData.totalProducts.toLocaleString()}
          icon={<Package />}
          description="Active catalog items"
          accent="violet"
          data-testid="stat-products"
        />
        <StatCard
          title="Employees"
          value={dashboardData.employees}
          icon={<Users />}
          trend={{ value: 3.1, label: 'new this quarter' }}
          accent="green"
          data-testid="stat-employees"
        />
        <StatCard
          title="Customers"
          value={dashboardData.customers.toLocaleString()}
          icon={<HeadphonesIcon />}
          trend={{ value: 4.2, label: 'vs last month' }}
          accent="amber"
          data-testid="stat-customers"
        />
      </div>

      {/* ── Charts row ── */}
      <div className="grid gap-4 xl:grid-cols-3">

        {/* Area chart — 2/3 width */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-border p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-foreground">Revenue vs Target</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Jan – Jun 2026</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded bg-blue-600 inline-block" /> Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded bg-blue-200 inline-block border-dashed border border-blue-300" /> Target
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlySales} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1e3a8a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#93c5fd" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#93c5fd" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(220 16% 93%)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false}
                tick={{ fill: 'hsl(220 18% 52%)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false}
                tick={{ fill: 'hsl(220 18% 52%)', fontSize: 11 }}
                tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="target" name="Target"
                stroke="#93c5fd" strokeWidth={1.5} strokeDasharray="5 4"
                fill="url(#gradTarget)" dot={false} />
              <Area type="monotone" dataKey="revenue" name="Revenue"
                stroke="#1e3a8a" strokeWidth={2.5}
                fill="url(#gradRevenue)"
                dot={{ r: 4, fill: '#1e3a8a', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart — 1/3 width */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-6 flex flex-col">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-foreground">Sales by Category</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Revenue share %</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryBreakdown} cx="50%" cy="50%"
                  innerRadius={52} outerRadius={82}
                  dataKey="value" labelLine={false} label={renderDonutLabel}>
                  {categoryBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}%`, 'Share']}
                  contentStyle={{ borderRadius: 10, border: '1px solid hsl(220 16% 90%)', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {categoryBreakdown.map(c => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                  <span className="text-muted-foreground">{c.name}</span>
                </span>
                <span className="font-semibold text-foreground">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom row: Recent Sales + Low Stock ── */}
      <div className="grid gap-4 xl:grid-cols-2">

        {/* Recent Sales */}
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">Recent Orders</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Last 5 transactions</p>
            </div>
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="divide-y divide-border">
            {dashboardData.recentSales.map(sale => (
              <div key={sale.id} data-testid={`row-sale-${sale.id}`}
                className="flex items-center px-6 py-3.5 hover:bg-muted/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{sale.customer}</p>
                  <p className="text-xs text-muted-foreground truncate">{sale.product}</p>
                </div>
                <div className="mx-4 text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-foreground">{fmt(sale.amount)}</p>
                  <p className="text-xs text-muted-foreground">{sale.id}</p>
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${statusBadge[sale.status] ?? 'bg-muted text-muted-foreground border-border'}`}>
                  {statusIcon[sale.status]}
                  {sale.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">Low Stock Alerts</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Items requiring reorder</p>
            </div>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="divide-y divide-border">
            {dashboardData.lowStockAlerts.map(item => {
              const pct = Math.max(0, Math.round((item.stock / item.threshold) * 100));
              const isOut = item.stock === 0;
              return (
                <div key={item.id} data-testid={`row-alert-${item.id}`}
                  className="px-6 py-3.5 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border
                      ${isOut
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {isOut ? 'Out of Stock' : `${item.stock} left`}
                    </span>
                  </div>
                  {/* Stock progress bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isOut ? 'bg-rose-500' : 'bg-amber-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {item.stock}/{item.threshold}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
