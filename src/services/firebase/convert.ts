import { Timestamp, type DocumentData } from 'firebase/firestore';
import type { Comment, Post, PostLink } from '../../types';
import { isCategory } from '../../utils/category';

/** Firestore Timestamp → Date (값이 없으면 현재 시각) */
export function toDate(value: unknown): Date {
  return value instanceof Timestamp ? value.toDate() : new Date();
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
}

function toLinks(value: unknown): PostLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is PostLink => typeof v?.label === 'string' && typeof v?.url === 'string')
    .map(({ label, url }) => ({ label, url }));
}

export function toPost(id: string, data: DocumentData): Post {
  return {
    id,
    title: String(data.title ?? ''),
    category: isCategory(data.category) ? data.category : 'research',
    summary: String(data.summary ?? ''),
    content: String(data.content ?? ''),
    tags: toStringArray(data.tags),
    links: toLinks(data.links),
    authorName: String(data.authorName ?? ''),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt ?? data.createdAt),
  };
}

export function toComment(id: string, postId: string, data: DocumentData): Comment {
  return {
    id,
    postId,
    authorUid: String(data.authorUid ?? ''),
    authorName: String(data.authorName ?? '익명'),
    authorPhotoURL: String(data.authorPhotoURL ?? ''),
    text: String(data.text ?? ''),
    createdAt: toDate(data.createdAt),
  };
}
