'use client';
// components/HustleCard.tsx
import { Trash2 } from 'lucide-react';
import ScoreRing from './ScoreRing';
import { useStore } from '@/lib/store';
import { getRecommendation, fmtDPH } from '@/lib/score';
import type { Hustle } from '@/lib/types';

const TAG_STYLES = {
  INCREASE: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  DECREASE: 'bg-amber-50  text-amber-700  border border-amber-200',
  REPLACE:  'bg-red-50    text-red-700    border border-red-200',
  OPTIMIZE: 'bg-blue-50   text-blue-700   border border-blue-200',
};

const TAG_EMOJI = {
  INCREASE: '📈',
  DECREASE: '📉',
  REPLACE:  '🔄',
  OPTIMIZE: '🔍',
};

export default function HustleCard({ hustle }: { hustle: Hustle }) {
  const { hustles, sessions, removeHustle } = useStore();
  const tag = getRecommendation(hustle, hustles);
  const hSessions = sessions.filter((s) => s.hustleId === hustle.id);
  const totalIncome = hSessions.reduce((a, s) => a + s.income, 0);
  const bestHustle = [...hustles].sort((a, b) => b.dph - a.dph)[0];
  const oppCost = bestHustle && bestHustle.id !== hustle.id
    ? bestHustle.dph - hustle.dph
    : 0;

  return (
    <div
      className="group bg-white rounded-2xl border border-blue-100 shadow-card hover:shadow-card-hover transition-all duration-200 p-5 flex flex-col gap-3"
      style={{ borderTop: `3px solid ${hustle.color === '#EFF6FF' ? '#3B82F6' : hustle.color === '#F0FDF4' ? '#10B981' : hustle.color === '#FFFBEB' ? '#F59E0B' : '#EC4899'}` }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: hustle.color }}
          >
            {hustle.emoji}
          </div>
          <div>
            <p className="font-semibold text-[#0A2558] text-sm leading-tight">{hustle.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{hustle.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TAG_STYLES[tag]}`}>
            {TAG_EMOJI[tag]} {tag}
          </span>
          <button
            onClick={() => removeHustle(hustle.id)}
            className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all duration-150 p-1"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Score + stats */}
      <div className="flex items-center gap-3">
        <ScoreRing score={hustle.score} size={56} />
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 flex-1">
          <Stat label="$/hr" value={fmtDPH(hustle.dph)} highlight />
          <Stat label="Sessions" value={String(hSessions.length)} />
          <Stat label="Total Earned" value={`$${totalIncome.toFixed(0)}`} />
          <Stat label="Skill Avg" value={`${hustle.skillAvg.toFixed(1)}/5`} />
        </div>
      </div>

      {/* Score bar */}
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-700"
          style={{ width: `${hustle.score}%` }}
        />
      </div>

      {/* Opportunity cost */}
      {oppCost > 0.5 && (
        <div className="bg-blue-50 rounded-xl px-3 py-2 text-[11px] text-blue-700">
          <span className="font-semibold">⏱ Opp. cost:</span> Every hour here = <span className="font-bold">${oppCost.toFixed(2)}</span> less than your best hustle
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? 'text-blue-600' : 'text-[#0A2558]'}`}>{value}</p>
    </div>
  );
}
