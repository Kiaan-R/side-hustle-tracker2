'use client';
// components/Navbar.tsx
import { useStore } from '@/lib/store';
import type { Screen } from '@/lib/types';

const NAV: { id: Screen; label: string; emoji: string }[] = [
  { id: 'dashboard', label: 'Dashboard', emoji: '⚡' },
  { id: 'insights',  label: 'Insights',  emoji: '📊' },
  { id: 'history',   label: 'History',   emoji: '📋' },
];

export default function Navbar({ onAddHustle }: { onAddHustle: () => void }) {
  const { screen, setScreen, hustles } = useStore();

  return (
    <nav className="sticky top-0 z-40 bg-[#0A2558] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center h-14 gap-2">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-6">
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm">H</div>
          <span className="font-display font-bold text-white text-lg tracking-tight">
            Hustle<span className="text-blue-400">IQ</span>
          </span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-1 flex-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setScreen(n.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                screen === n.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-xs">{n.emoji}</span>
              {n.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onAddHustle}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-150 shadow-sm"
        >
          <span className="text-base leading-none">+</span>
          Add Hustle
        </button>

        {hustles.length > 0 && (
          <div className="ml-2 bg-white/10 text-white/70 text-xs font-medium px-2.5 py-1 rounded-full">
            {hustles.length} hustle{hustles.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </nav>
  );
}
