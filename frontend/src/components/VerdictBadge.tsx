import React from 'react';
import { Verdict } from '../types';
import { ShieldAlert, ShieldCheck, AlertTriangle, HelpCircle } from 'lucide-react';

interface VerdictBadgeProps {
  verdict: Verdict;
  size?: 'sm' | 'md' | 'lg';
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict, size = 'md' }) => {
  const configs: Record<Verdict, { label: string; bg: string; text: string; border: string; icon: any }> = {
    likely_ai: {
      label: 'Likely AI-Generated',
      bg: 'bg-wine/10',
      text: 'text-wine',
      border: 'border-wine/30',
      icon: ShieldAlert,
    },
    likely_human: {
      label: 'Likely Human-Created',
      bg: 'bg-emerald-950/10',
      text: 'text-emerald-800',
      border: 'border-emerald-600/30',
      icon: ShieldCheck,
    },
    potentially_manipulated: {
      label: 'Potentially Manipulated',
      bg: 'bg-amber-950/10',
      text: 'text-amber-800',
      border: 'border-amber-600/30',
      icon: AlertTriangle,
    },
    inconclusive: {
      label: 'Inconclusive Result',
      bg: 'bg-stone-500/10',
      text: 'text-stone-700',
      border: 'border-stone-400/30',
      icon: HelpCircle,
    },
  };

  const config = configs[verdict] || configs.inconclusive;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    md: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
    lg: 'text-base px-5 py-2.5 gap-2.5 font-semibold tracking-wide',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} transition-all shadow-sm`}
    >
      <Icon className={size === 'lg' ? 'w-5 h-5' : size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      <span>{config.label}</span>
    </span>
  );
};

