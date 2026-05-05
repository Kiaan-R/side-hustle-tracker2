'use client';
// components/screens/Insights.tsx
import { useStore } from '@/lib/store';
import { getRecommendation } from '@/lib/score';
import ScoreRing from '@/components/ScoreRing';

const REC_STYLES = {
  INCREASE: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', emoji: '📈', body: 'text-emerald-600' },
  DECREASE: { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   emoji: '📉', body: 'text-amber-600' },
  REPLACE:  { bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-700',     emoji: '🔄', body: 'text-red-500' },
  OPTIMIZE: { bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-700',    emoji: '🔍', body: 'text-blue-600' },
};

const REC_REASON = {
  INCREASE: (h: any, top: any) => `Top Value Score at ${h.score}/100 with $${h.dph.toFixed(2)}/hr. This is your best time investment — prioritize it.`,
  DECREASE: (h: any, top: any) => `At $${h.dph.toFixed(2)}/hr you're leaving $${(top.dph - h.dph).toFixed(2)}/hr on the table vs ${top.name}. Consider reducing hours here.`,
  REPLACE:  (h: any, top: any) => `Score of ${h.score}/100 is significantly below average. Time here costs you $${(top.dph - h.dph).toFixed(2)}/hr vs your best hustle.`,
  OPTIMIZE: (h: any, top: any) => `Solid performer at ${h.score}/100. Raise your $/hr by negotiating rates, cutting prep time, or growing skill depth.`,
};

export default function Insights({ onAddHustle }: { onAddHustle: () => void }) {
  const { hustles, sessions } = useStore();

  if (hustles.length === 0) {
    return (
      <div className="text-center py-20 px-6">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="font-display font-bold text-xl text-[#0A2558] mb-2">No data yet</h2>
        <p className="text-sm text-slate-400 mb-6 max-w-xs mx-auto">Add at least 2 hustles and log sessions to unlock insights.</p>
        <button onClick={onAddHustle} className="bg-[#0A2558] hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all">
          + Add Your First Hustle
        </button>
      </div>
    );
  }

  const sorted   = [...hustles].sort((a, b) => b.score - a.score);
  const byDPH    = [...hustles].sort((a, b) => b.dph - a.dph);
  const bySkill  = [...hustles].sort((a, b) => b.skillAvg - a.skillAvg);
  const topDPH   = byDPH[0]?.dph ?? 0;
  const topScore = sorted[0];
  const worst    = sorted[sorted.length - 1];
  const WEEKLY_HOURS = 20;
  const totalScore   = sorted.reduce((a, h) => a + h.score, 0) || 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-[#0A2558]">Insights 📊</h1>
        <p className="text-sm text-slate-400 mt-0.5">Data-driven decisions for your time</p>
      </div>

      {/* Top performers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Best Overall',      hustle: topScore,   metric: `Score ${topScore?.score}`, accent: true },
          { label: 'Best $/hr',         hustle: byDPH[0],   metric: `$${byDPH[0]?.dph.toFixed(2)}/hr` },
          { label: 'Best Skill Builder',hustle: bySkill[0], metric: `${bySkill[0]?.skillAvg.toFixed(1)}/5 skills` },
          { label: 'Lowest Performer',  hustle: worst,      metric: `Score ${worst?.score}` },
        ].map(({ label, hustle, metric, accent }) => (
          hustle ? (
            <div key={label} className={`rounded-2xl p-4 border ${accent ? 'bg-[#0A2558] border-[#0A2558]' : 'bg-white border-blue-100 shadow-card'}`}>
              <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${accent ? 'text-blue-300' : 'text-slate-400'}`}>{label}</p>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{hustle.emoji}</span>
                <p className={`font-semibold text-sm truncate ${accent ? 'text-white' : 'text-[#0A2558]'}`}>{hustle.name}</p>
              </div>
              <p className={`font-display font-bold text-xl ${accent ? 'text-blue-300' : 'text-blue-600'}`}>{metric}</p>
            </div>
          ) : null
        ))}
      </div>

      {/* Opportunity Cost Table */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-card p-5">
        <h2 className="font-display font-bold text-[#0A2558] text-base mb-4">⏱ Opportunity Cost Analysis</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Hustle', '$/hr', 'Best $/hr', 'Cost vs Best', 'Weekly Cost (10h)'].map((h) => (
                  <th key={h} className="text-left py-2 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((h) => {
                const cost = topDPH - h.dph;
                return (
                  <tr key={h.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-2 font-semibold text-[#0A2558]">
                      <span className="mr-1">{h.emoji}</span>{h.name}
                    </td>
                    <td className="py-3 px-2 text-blue-600 font-semibold">${h.dph.toFixed(2)}</td>
                    <td className="py-3 px-2 text-slate-400">${topDPH.toFixed(2)}</td>
                    <td className="py-3 px-2">
                      <span className={cost > 0.5 ? 'text-red-500 font-bold' : 'text-emerald-600 font-semibold'}>
                        {cost > 0.5 ? `-$${cost.toFixed(2)}` : '🏆 Best'}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={cost > 0.5 ? 'text-red-500 font-bold' : 'text-emerald-600 font-semibold'}>
                        {cost > 0.5 ? `-$${(cost * 10).toFixed(0)}` : '—'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-card p-5">
        <h2 className="font-display font-bold text-[#0A2558] text-base mb-4">🎯 Recommendations</h2>
        <div className="space-y-3">
          {sorted.map((h) => {
            const tag = getRecommendation(h, hustles);
            const s = REC_STYLES[tag];
            const top = sorted[0];
            return (
              <div key={h.id} className={`flex items-start gap-3 ${s.bg} border ${s.border} rounded-xl p-4`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${s.bg} border ${s.border}`}>
                  {s.emoji}
                </div>
                <div>
                  <p className={`font-bold text-sm ${s.text}`}>
                    {tag} · {h.emoji} {h.name}
                  </p>
                  <p className={`text-xs mt-0.5 leading-relaxed ${s.body}`}>
                    {REC_REASON[tag](h, top)}
                  </p>
                </div>
                <div className="ml-auto flex-shrink-0">
                  <ScoreRing score={h.score} size={40} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Time Allocation */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-card p-5">
        <h2 className="font-display font-bold text-[#0A2558] text-base mb-1">📅 Suggested Weekly Allocation</h2>
        <p className="text-xs text-slate-400 mb-4">Based on {WEEKLY_HOURS}h/week, optimized by Value Score</p>
        <div className="space-y-3">
          {sorted.map((h) => {
            const hrs = ((h.score / totalScore) * WEEKLY_HOURS);
            const pct = (h.score / totalScore) * 100;
            return (
              <div key={h.id} className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-36 flex-shrink-0">
                  <span className="text-base">{h.emoji}</span>
                  <span className="text-sm font-semibold text-[#0A2558] truncate">{h.name}</span>
                </div>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-[#0A2558] w-14 text-right">
                  {hrs.toFixed(1)}h/wk
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
