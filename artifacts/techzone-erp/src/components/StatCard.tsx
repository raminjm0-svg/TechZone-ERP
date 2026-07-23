import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  description?: string;
  accent: 'blue' | 'green' | 'violet' | 'amber' | 'rose';
  className?: string;
  variants?: any;
}

const accentMap = {
  blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   bar: 'bg-blue-500' },
  green:  { bg: 'bg-emerald-50', icon: 'text-emerald-600', bar: 'bg-emerald-500' },
  violet: { bg: 'bg-violet-50', icon: 'text-violet-600', bar: 'bg-violet-500' },
  amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600',  bar: 'bg-amber-500' },
  rose:   { bg: 'bg-rose-50',   icon: 'text-rose-600',   bar: 'bg-rose-500' },
};

export function StatCard({ title, value, icon, trend, description, accent, className, variants }: StatCardProps) {
  const colors = accentMap[accent];
  const isPositive = trend && trend.value > 0;
  const isNegative = trend && trend.value < 0;

  return (
    <motion.div 
      variants={variants}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn('relative bg-white rounded-xl shadow-sm border border-border overflow-hidden group', className)}
    >
      {/* Colored top accent bar */}
      <div className={cn('absolute top-0 left-0 right-0 h-1 transition-all duration-300 opacity-80 group-hover:opacity-100', colors.bar)} />

      <div className="p-6 pt-7">
        <div className="flex items-start justify-between mb-4">
          <p className="text-sm font-semibold text-muted-foreground tracking-wide">{title}</p>
          <div className={cn('p-2.5 rounded-xl transition-colors duration-300 group-hover:shadow-sm', colors.bg, colors.icon)}>
            <div className="w-5 h-5">{icon}</div>
          </div>
        </div>

        <p className="text-3xl font-bold text-foreground tracking-tight leading-none mb-1">{value}</p>

        <div className="mt-4 flex items-center gap-2">
          {trend ? (
            <>
              <span className={cn(
                'inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full border',
                isPositive ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                isNegative ? 'text-rose-700 bg-rose-50 border-rose-200' :
                'text-muted-foreground bg-muted border-border'
              )}>
                {isPositive ? <ArrowUpRight className="w-3 h-3" /> :
                 isNegative ? <ArrowDownRight className="w-3 h-3" /> :
                 <Minus className="w-3 h-3" />}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground font-medium">{trend.label}</span>
            </>
          ) : description ? (
            <span className="text-xs text-muted-foreground font-medium">{description}</span>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
