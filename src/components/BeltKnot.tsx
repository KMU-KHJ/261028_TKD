/** 띠 매듭 모양 아이콘 (로고·장식용) */
export default function BeltKnot({ className = 'h-7 w-7', color = '#0c0a09', stitch = '#c9a227' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className={className}>
      <rect x="2" y="22" width="60" height="12" rx="2" fill={color} />
      <path d="M26 33 L14 58 L22 60 L31 37 Z" fill={color} />
      <path d="M38 33 L50 58 L42 60 L33 37 Z" fill={color} />
      <rect x="24" y="18" width="16" height="20" rx="4" fill={color} stroke={stitch} strokeWidth="1.5" />
      <line x1="2" y1="25" x2="62" y2="25" stroke={stitch} strokeWidth="0.8" strokeDasharray="2 2" />
      <line x1="2" y1="31" x2="62" y2="31" stroke={stitch} strokeWidth="0.8" strokeDasharray="2 2" />
    </svg>
  );
}
