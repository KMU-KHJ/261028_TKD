import type { Comment, Post } from '../../types';
import { SEED_POSTS } from './seed';

const POSTS_KEY = 'tkd-archive:posts';
const COMMENTS_KEY = 'tkd-archive:comments';
export const USER_KEY = 'tkd-archive:user';

// localStorage에는 날짜를 문자열로 저장하므로, 읽을 때 Date로 되돌립니다.
type Stored<T> = Omit<T, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt?: string };

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadPosts(): Post[] {
  const stored = readJson<Stored<Post>[]>(POSTS_KEY);
  if (!stored) {
    savePosts(SEED_POSTS);
    return [...SEED_POSTS];
  }
  return stored.map((p) => ({
    ...p,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt ?? p.createdAt),
  }));
}

export function savePosts(posts: Post[]): void {
  writeJson(POSTS_KEY, posts);
}

export function loadComments(): Comment[] {
  const stored = readJson<Stored<Comment>[]>(COMMENTS_KEY) ?? [];
  return stored.map((c) => ({ ...c, createdAt: new Date(c.createdAt) }));
}

export function saveComments(comments: Comment[]): void {
  writeJson(COMMENTS_KEY, comments);
}

export function readStoredUser<T>(): T | null {
  return readJson<T>(USER_KEY);
}

export function writeStoredUser(user: unknown): void {
  if (user === null) localStorage.removeItem(USER_KEY);
  else writeJson(USER_KEY, user);
}

/** 실제 서버처럼 잠깐 기다리게 해서 로딩 화면도 확인할 수 있게 합니다. */
export function delay(ms = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
