import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  description?: string;
  accent: 'blue' | 'green' | 'violet' | 'amber';
  className?: string;
}

const accentMap = {
  blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-100 text-blue-700',   bar: 'bg-blue-600' },
  green:  { bg: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500' },
  violet: { bg: 'bg-violet-50', icon: 'bg-violet-100 text-violet-700', bar: 'bg-violet-500' },
  amber:  { bg: 'bg-amber-50',  icon: 'bg-amber-100 text-amber-700',  bar: 'bg-amber-500' },
};

export function StatCard({ title, value, icon, trend, description, accent, className }: StatCardProps) {
  const colors = accentMap[accent];
  const isPositive = trend && trend.value > 0;
  const isNegative = trend && trend.value < 0;

  return (
    <div className={cn('relative bg-white rounded-2xl shadow-sm border border-border overflow-hidden', className)}>
      {/* Colored top accent bar */}
      <div className={cn('absolute top-0 left-0 right-0 h-1 rounded-t-2xl', colors.bar)} />

      <div className="p-6 pt-7">
        <div className="flex items-start justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">{title}</p>
          <div className={cn('p-2.5 rounded-xl', colors.icon)}>
            <div className="w-5 h-5">{icon}</div>
          </div>
        </div>

        <p className="text-3xl font-bold text-foreground tracking-tight leading-none">{value}</p>

        <div className="mt-3 flex items-center gap-1.5">
          {trend ? (
            <>
              <span className={cn(
                'inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full',
                isPositive ? 'text-emerald-700 bg-emerald-50' :
                isNegative ? 'text-rose-700 bg-rose-50' :
                'text-muted-foreground bg-muted'
              )}>
                {isPositive ? <ArrowUpRight className="w-3 h-3" /> :
                 isNegative ? <ArrowDownRight className="w-3 h-3" /> :
                 <Minus className="w-3 h-3" />}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground">{trend.label}</span>
            </>
          ) : description ? (
            <span className="text-xs text-muted-foreground">{description}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
