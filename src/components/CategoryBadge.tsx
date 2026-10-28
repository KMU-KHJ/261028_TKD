import type { Category } from '../types';
import { CATEGORY_LABELS } from '../utils/category';

export default function CategoryBadge({ category }: { category: Category }) {
  const color = category === 'research' ? 'bg-navy-100 text-navy-800' : 'bg-emerald-100 text-emerald-800';
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${color}`}>
      {CATEGORY_LABELS[category]}
    </span>
  );
}
