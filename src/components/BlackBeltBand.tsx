/** 검은 띠를 가로로 두른 모양의 장식 띠 (금색 자수 글씨와 매듭 포함) */
export default function BlackBeltBand() {
  return (
    <div aria-hidden="true" className="relative">
      <div className="flex h-11 items-center justify-between border-y-2 border-dashed border-gold/60 bg-belt-900 px-6 outline outline-4 outline-belt-900">
        <span className="font-serif text-sm tracking-[0.3em] text-gold">跆拳道</span>
        <span className="hidden text-xs font-semibold tracking-[0.35em] text-gold sm:inline">TAEKWONDO</span>
      </div>
      <svg viewBox="0 0 60 72" className="absolute left-1/2 top-[-6px] h-[72px] w-[60px] -translate-x-1/2">
        <g fill="#0c0a09" stroke="#c9a227" strokeWidth="1" strokeDasharray="2 2">
          <path d="M22 26 L8 68 L19 70 L29 30 Z" />
          <path d="M38 26 L52 68 L41 70 L31 30 Z" />
          <rect x="17" y="4" width="26" height="26" rx="5" />
        </g>
      </svg>
    </div>
  );
}
