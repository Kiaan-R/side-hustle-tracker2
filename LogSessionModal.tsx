'use client';
// components/LogSessionModal.tsx
import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function LogSessionModal({ onClose }: { onClose: () => void }) {
  const { hustles, logSession } = useStore();
  const [selectedId, setSelectedId] = useState(hustles[0]?.id ?? '');
  const [date, setDate]             = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours]           = useState('');
  const [income, setIncome]         = useState('');
  const [notes, setNotes]           = useState('');
  const overlayRef                  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const dph =
    parseFloat(hours) > 0 && parseFloat(income) > 0
      ? parseFloat(income) / parseFloat(hours)
      : null;

  const selectedHustle = hustles.find((h) => h.id === selectedId);

  function handleSubmit() {
    if (!selectedId || !date || !hours || !income) return;
    const h = parseFloat(hours);
    const inc = parseFloat(income);
    if (h <= 0 || inc <= 0) return;
    logSession({
      hustleId: selectedId,
      hustleName: selectedHustle?.name ?? '',
      date,
      hours: h,
      income: inc,
      notes,
    });
    onClose();
  }

  if (hustles.length === 0) {
    return (
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2558]/40 backdrop-blur-sm p-4"
        onClick={(e) => e.target === overlayRef.current && onClose()}
      >
        <div className="bg-white rounded-2xl shadow-modal p-8 text-center max-w-sm">
          <p className="text-4xl mb-3">💼</p>
          <p className="font-display font-bold text-[#0A2558] text-lg mb-2">No hustles yet</p>
          <p className="text-sm text-slate-500 mb-4">Add at least one hustle before logging a session.</p>
          <button onClick={onClose} className="bg-[#0A2558] text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
            Got it
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2558]/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-display font-bold text-[#0A2558] text-lg">Log a Session</h2>
            <p className="text-xs text-slate-400 mt-0.5">Record hours worked and income earned</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Live DPH display */}
          <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">$/hr this session</p>
            <p className="font-display font-bold text-2xl text-[#0A2558]">
              {dph ? `$${dph.toFixed(2)}` : '—'}
            </p>
          </div>

          {/* Select hustle */}
          <div>
            <label className="block text-xs font-semibold text-[#0A2558] mb-2">Which Hustle?</label>
            <div className="grid grid-cols-2 gap-2">
              {hustles.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSelectedId(h.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all duration-100 ${
                    selectedId === h.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-blue-200'
                  }`}
                >
                  <span className="text-lg">{h.emoji}</span>
                  <div>
                    <p className="text-xs font-semibold text-[#0A2558] leading-tight">{h.name}</p>
                    <p className="text-[10px] text-slate-400">${h.dph.toFixed(2)}/hr avg</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-[#0A2558] mb-1.5">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input w-full" />
          </div>

          {/* Hours + Income */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0A2558] mb-1.5">Hours Worked</label>
              <input
                type="number" value={hours} onChange={(e) => setHours(e.target.value)}
                placeholder="e.g. 3.5" className="input w-full" min="0.25" step="0.25"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0A2558] mb-1.5">Income Earned ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                <input
                  type="number" value={income} onChange={(e) => setIncome(e.target.value)}
                  placeholder="e.g. 75" className="input w-full pl-6" min="0" step="1"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#0A2558] mb-1.5">Notes <span className="font-normal text-slate-400">(optional)</span></label>
            <textarea
              value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Any context about this session..."
              className="input w-full min-h-[64px] resize-y"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedId || !date || !hours || !income}
            className="w-full bg-[#0A2558] hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-150 text-sm"
          >
            Log Session {dph ? `· $${dph.toFixed(2)}/hr` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
