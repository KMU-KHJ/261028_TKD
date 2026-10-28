import type { Category } from '../types';
import { CATEGORY_LABELS } from '../utils/category';

export default function CategoryBadge({ category }: { category: Category }) {
  // 겨루기의 청(연구자료)·홍(수업자료)으로 구분
  const color = category === 'research' ? 'bg-chung-100 text-chung-700' : 'bg-hong-100 text-hong-700';
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${color}`}>
      {CATEGORY_LABELS[category]}
    </span>
  );
}
