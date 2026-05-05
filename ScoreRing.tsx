'use client';
// components/ScoreRing.tsx

interface Props {
  score: number;
  size?: number;
}

export default function ScoreRing({ score, size = 56 }: Props) {
  const r = (size / 2) - 5;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;

  const color =
    score >= 65 ? '#059669' :
    score >= 40 ? '#D97706' :
    '#DC2626';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
      <circle
        cx={cx} cy={cy} r={r}
        fill="none" stroke="#EEF2F7" strokeWidth="4.5"
      />
      <circle
        cx={cx} cy={cy} r={r}
        fill="none" stroke={color} strokeWidth="4.5"
        strokeDasharray={`${fill} ${circ}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      <text
        x={cx} y={cy + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size < 44 ? 10 : 13}
        fontWeight="700"
        fontFamily="'Syne', sans-serif"
        fill={color}
      >
        {score}
      </text>
    </svg>
  );
}
