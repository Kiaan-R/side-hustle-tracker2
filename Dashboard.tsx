'use client';
// components/screens/Dashboard.tsx
import { useStore } from '@/lib/store';
import HustleCard from '@/components/HustleCard';

export default function Dashboard({ onAddHustle, onLogSession }: { onAddHustle: () => void; onLogSession: () => void }) {
  const { hustles, sessions } = useStore();

  const weekAgo = new Date(Date.now() - 7 * 86400000);
  const weekSessions = sessions.filter((s) => new Date(s.date) >= weekAgo);
  const weekIncome = weekSessions.reduce((a, s) => a + s.income, 0);
  const weekHours  = weekSessions.reduce((a, s) => a + s.hours, 0);
  const bestHustle = hustles[0];
  const sorted     = [...hustles]; // already sorted by score via recalcScores

  return (
    <div>
      {/* Page header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#0A2558]">Dashboard 👋</h1>
          <p className="text-sm text-slate-400 mt-0.5">Ranked by Value Score · highest first</p>
        </div>
        {hustles.length > 0 && (
          <button
            onClick={onLogSession}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-150 shadow-sm"
          >
            ⏱ Log Session
          </button>
        )}
      </div>

      {/* KPI bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <KPI emoji="💵" label="This Week" value={weekIncome > 0 ? `$${weekIncome.toFixed(0)}` : '—'} sub="income earned" />
        <KPI emoji="⚡" label="Best $/hr"   value={bestHustle ? `$${bestHustle.dph.toFixed(2)}` : '—'} sub={bestHustle?.name ?? 'No hustles yet'} />
        <KPI emoji="⏰" label="Hours"       value={weekHours > 0 ? `${weekHours.toFixed(1)}h` : '—'}  sub="this week" />
        <KPI emoji="🏆" label="Top Score"   value={bestHustle ? String(bestHustle.score) : '—'} sub={bestHustle?.name ?? 'No hustles yet'} accent />
      </div>

      {/* Hustle cards */}
      {hustles.length === 0 ? (
        <EmptyState onAdd={onAddHustle} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((h) => (
            <HustleCard key={h.id} hustle={h} />
          ))}
          <button
            onClick={onAddHustle}
            className="border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-blue-500 transition-all duration-200 min-h-[180px]"
          >
            <span className="text-3xl">➕</span>
            <span className="text-sm font-semibold">Add Hustle</span>
          </button>
        </div>
      )}
    </div>
  );
}

function KPI({ emoji, label, value, sub, accent }: { emoji: string; label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 border ${accent ? 'bg-[#0A2558] border-[#0A2558]' : 'bg-white border-blue-100 shadow-card'}`}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-sm">{emoji}</span>
        <p className={`text-[10px] font-bold uppercase tracking-wider ${accent ? 'text-blue-300' : 'text-slate-400'}`}>{label}</p>
      </div>
      <p className={`font-display font-bold text-2xl leading-none ${accent ? 'text-white' : 'text-[#0A2558]'}`}>{value}</p>
      <p className={`text-[11px] mt-1 truncate ${accent ? 'text-blue-300' : 'text-slate-400'}`}>{sub}</p>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-20 px-6">
      <div className="text-6xl mb-5">💼</div>
      <h2 className="font-display font-bold text-xl text-[#0A2558] mb-2">No hustles yet</h2>
      <p className="text-sm text-slate-400 mb-6 max-w-xs mx-auto">
        Add your first hustle to start tracking your income, skills, and Value Score.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onAdd}
          className="bg-[#0A2558] hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-150 shadow-sm"
        >
          ⚡ Add from Templates
        </button>
        <button
          onClick={onAdd}
          className="bg-white border border-blue-200 hover:border-blue-400 text-[#0A2558] font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-150"
        >
          ✏️ Add Custom Hustle
        </button>
      </div>
    </div>
  );
}
