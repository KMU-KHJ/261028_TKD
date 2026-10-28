// 흰 띠부터 검은 띠까지 승급 순서대로 색을 이어 붙인 장식 줄
const RANKS = ['bg-rank-white', 'bg-rank-yellow', 'bg-rank-green', 'bg-rank-blue', 'bg-rank-red', 'bg-rank-black'];

export default function BeltStripe({ className = 'h-1.5' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex w-full ${className}`}>
      {RANKS.map((color) => (
        <span key={color} className={`flex-1 ${color}`} />
      ))}
    </div>
  );
}
