'use client';
// components/screens/History.tsx
import { useStore } from '@/lib/store';

export default function History({ onLogSession }: { onLogSession: () => void }) {
  const { sessions, hustles } = useStore();
  const sorted = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalIncome = sessions.reduce((a, s) => a + s.income, 0);
  const totalHours  = sessions.reduce((a, s) => a + s.hours, 0);
  const avgDPH      = totalHours > 0 ? totalIncome / totalHours : 0;

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#0A2558]">History 📋</h1>
          <p className="text-sm text-slate-400 mt-0.5">{sessions.length} session{sessions.length !== 1 ? 's' : ''} logged</p>
        </div>
        <button
          onClick={onLogSession}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-150"
        >
          ⏱ Log Session
        </button>
      </div>

      {sessions.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard label="Total Earned"  value={`$${totalIncome.toFixed(0)}`}    emoji="💵" />
          <StatCard label="Total Hours"   value={`${totalHours.toFixed(1)}h`}     emoji="⏰" />
          <StatCard label="Avg $/hr"      value={`$${avgDPH.toFixed(2)}`}         emoji="⚡" accent />
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="font-display font-bold text-xl text-[#0A2558] mb-2">No sessions yet</h2>
          <p className="text-sm text-slate-400 mb-6 max-w-xs mx-auto">Log your first work session to track your earnings over time.</p>
          <button onClick={onLogSession} className="bg-[#0A2558] hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl text-sm">
            ⏱ Log First Session
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-blue-100 shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFF] border-b border-slate-100">
                {['Date', 'Hustle', 'Hours', 'Income', '$/hr', 'Notes'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((s, i) => {
                const hustle = hustles.find((h) => h.id === s.hustleId);
                return (
                  <tr key={s.id} className={`border-b border-slate-50 hover:bg-[#F8FAFF] transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                    <td className="py-3 px-4 text-slate-500 text-xs">{s.date}</td>
                    <td className="py-3 px-4 font-semibold text-[#0A2558]">
                      <span className="mr-1">{hustle?.emoji ?? '💼'}</span>{s.hustleName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{s.hours}h</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">${s.income.toFixed(2)}</td>
                    <td className="py-3 px-4 font-bold text-blue-600">${s.dph.toFixed(2)}</td>
                    <td className="py-3 px-4 text-slate-400 text-xs max-w-[140px] truncate">{s.notes || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, emoji, accent }: { label: string; value: string; emoji: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 border ${accent ? 'bg-[#0A2558] border-[#0A2558]' : 'bg-white border-blue-100 shadow-card'}`}>
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-sm">{emoji}</span>
        <p className={`text-[10px] font-bold uppercase tracking-wider ${accent ? 'text-blue-300' : 'text-slate-400'}`}>{label}</p>
      </div>
      <p className={`font-display font-bold text-2xl ${accent ? 'text-white' : 'text-[#0A2558]'}`}>{value}</p>
    </div>
  );
}
