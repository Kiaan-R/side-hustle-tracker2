'use client';
// components/AddHustleModal.tsx
import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useStore } from '@/lib/store';
import { calcSkillAvg, calcValueScore, uid } from '@/lib/score';
import { HUSTLE_PRESETS, SKILL_LABELS, CATEGORY_OPTIONS, CARD_COLORS } from '@/lib/presets';
import type { HustleCategory, SkillRatings } from '@/lib/types';

const DEFAULT_SKILLS: SkillRatings = {
  sales: 3, communication: 3, tech: 3,
  marketing: 3, leadership: 3, creative: 3,
};

type TabId = 'presets' | 'custom';

export default function AddHustleModal({ onClose }: { onClose: () => void }) {
  const { addHustle, hustles } = useStore();
  const [tab, setTab] = useState<TabId>('presets');

  // Custom form state
  const [name, setName]               = useState('');
  const [category, setCategory]       = useState<HustleCategory>('Freelance');
  const [emoji, setEmoji]             = useState('💼');
  const [rate, setRate]               = useState('');
  const [hours, setHours]             = useState('');
  const [consistency, setConsistency] = useState(3);
  const [skills, setSkills]           = useState<SkillRatings>({ ...DEFAULT_SKILLS });

  const overlayRef = useRef<HTMLDivElement>(null);
  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);

  const dph = rate ? parseFloat(rate) : hours && rate ? parseFloat(rate) / parseFloat(hours) : 0;
  const skillAvg = calcSkillAvg(skills);
  const previewScore = dph > 0 ? calcValueScore(dph, skillAvg, consistency, hustles) : null;

  function handlePreset(idx: number) {
    const p = HUSTLE_PRESETS[idx];
    const colorIdx = hustles.length % CARD_COLORS.length;
    addHustle({
      name: p.name,
      category: p.category,
      emoji: p.emoji,
      color: p.color,
      dph: p.dph,
      weeklyHours: p.weeklyHours,
      consistency: p.consistency,
      skills: p.skills,
      skillAvg: calcSkillAvg(p.skills),
    });
    onClose();
  }

  function handleCustomSubmit() {
    if (!name.trim()) return;
    const parsedRate = parseFloat(rate);
    if (!parsedRate || parsedRate <= 0) return;
    const parsedHours = parseFloat(hours) || 8;
    const colorIdx = hustles.length % CARD_COLORS.length;
    addHustle({
      name: name.trim(),
      category,
      emoji,
      color: CARD_COLORS[colorIdx],
      dph: parsedRate,
      weeklyHours: parsedHours,
      consistency,
      skills,
      skillAvg: calcSkillAvg(skills),
    });
    onClose();
  }

  function setSkillVal(key: keyof SkillRatings, val: number) {
    setSkills((prev) => ({ ...prev, [key]: val }));
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2558]/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 sticky top-0 bg-white z-10 border-b border-slate-100">
          <div>
            <h2 className="font-display font-bold text-[#0A2558] text-lg">Add a Hustle</h2>
            <p className="text-xs text-slate-400 mt-0.5">Pick a template or build your own</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-4 pb-0">
          {(['presets', 'custom'] as TabId[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                tab === t
                  ? 'bg-[#0A2558] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {t === 'presets' ? '⚡ Quick Templates' : '✏️ Custom Hustle'}
            </button>
          ))}
        </div>

        <div className="p-5 pt-4">
          {/* ── PRESETS TAB ── */}
          {tab === 'presets' && (
            <div className="space-y-3">
              {/* Teen section */}
              <SectionLabel emoji="🧑‍🎓" label="Popular for Teens" />
              {HUSTLE_PRESETS.filter((p) => p.audience === 'teen').map((p, i) => (
                <PresetCard key={i} preset={p} onClick={() => handlePreset(HUSTLE_PRESETS.indexOf(p))} />
              ))}
              {/* Adult section */}
              <SectionLabel emoji="💼" label="Popular for Adults" />
              {HUSTLE_PRESETS.filter((p) => p.audience === 'adult').map((p, i) => (
                <PresetCard key={i} preset={p} onClick={() => handlePreset(HUSTLE_PRESETS.indexOf(p))} />
              ))}
              <p className="text-center text-xs text-slate-400 pt-1">Want full control? Switch to Custom Hustle →</p>
            </div>
          )}

          {/* ── CUSTOM TAB ── */}
          {tab === 'custom' && (
            <div className="space-y-4">
              {/* Score preview */}
              {previewScore !== null && (
                <div className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Value Score Preview</p>
                    <p className="font-display font-bold text-2xl text-[#0A2558]">{previewScore}<span className="text-sm font-normal text-slate-400">/100</span></p>
                  </div>
                  <div className="ml-auto text-xs text-blue-600 text-right">
                    <p>60% income · 25% skills</p>
                    <p>15% consistency</p>
                  </div>
                </div>
              )}

              {/* Name + emoji */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label>Hustle Name</Label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Freelance Design"
                    className="input w-full"
                  />
                </div>
                <div className="w-20">
                  <Label>Emoji</Label>
                  <input
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    className="input w-full text-center text-xl"
                    maxLength={2}
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <Label>Category</Label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as HustleCategory)}
                    className="input w-full appearance-none pr-8"
                  >
                    {CATEGORY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-3 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Rate + hours */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Your $/hr Rate</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                    <input
                      type="number"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      placeholder="e.g. 25"
                      className="input w-full pl-6"
                      min="0"
                      step="0.5"
                    />
                  </div>
                </div>
                <div>
                  <Label>Hours / Week</Label>
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="e.g. 8"
                    className="input w-full"
                    min="0.5"
                    step="0.5"
                  />
                </div>
              </div>

              {/* Consistency */}
              <div>
                <Label>Income Consistency</Label>
                <div className="flex gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setConsistency(n)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-100 ${
                        consistency === n
                          ? 'bg-[#0A2558] text-white border-[#0A2558]'
                          : 'bg-white text-slate-400 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">1 = very unpredictable · 5 = rock-solid</p>
              </div>

              {/* Skills */}
              <div>
                <Label>Skill Growth Ratings <span className="font-normal text-slate-400">(how much does this build each skill?)</span></Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {SKILL_LABELS.map(({ key, label, emoji: se }) => (
                    <div key={key} className="bg-slate-50 rounded-xl p-3">
                      <p className="text-[11px] font-semibold text-slate-500 mb-1.5">{se} {label}</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            onClick={() => setSkillVal(key, n)}
                            className={`w-6 h-6 rounded-md text-[11px] font-bold transition-all duration-100 ${
                              skills[key] >= n
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-slate-300 border border-slate-200'
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCustomSubmit}
                disabled={!name.trim() || !rate}
                className="w-full bg-[#0A2558] hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-150 text-sm"
              >
                Add Hustle {previewScore !== null ? `· Score ${previewScore}` : ''}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-[#0A2558] mb-1.5">{children}</label>;
}

function SectionLabel({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <span className="text-base">{emoji}</span>
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}

function PresetCard({ preset, onClick }: { preset: typeof HUSTLE_PRESETS[0]; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-slate-100 hover:border-blue-200 hover:shadow-card rounded-xl p-4 transition-all duration-150 group"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: preset.color }}>
          {preset.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-[#0A2558] text-sm">{preset.name}</p>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
              {preset.avgEarnings}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{preset.description}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-end">
        <span className="text-[11px] text-blue-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          Add this hustle →
        </span>
      </div>
    </button>
  );
}
