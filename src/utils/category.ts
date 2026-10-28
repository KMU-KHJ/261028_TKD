import type { Category } from '../types';

export const CATEGORY_LABELS: Record<Category, string> = {
  research: '연구자료',
  course: '수업자료',
};

export function isCategory(value: unknown): value is Category {
  return value === 'research' || value === 'course';
}
