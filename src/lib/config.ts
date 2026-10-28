const env = import.meta.env;

export const SITE_NAME = env.VITE_SITE_NAME?.trim() || '태권도 연구실 아카이브';

export const ADMIN_EMAILS: string[] = (env.VITE_ADMIN_EMAILS ?? '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

/** API 키가 있을 때만 Firebase를 사용하고, 없으면 테스트(mock) 모드로 동작 */
export const isFirebaseConfigured = Boolean(env.VITE_FIREBASE_API_KEY?.trim());

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

/** 목록 화면에서 한 번에 불러오는 글 수 (Firestore 읽기 횟수 절약) */
export const PAGE_SIZE = 20;

export const COMMENT_MAX_LENGTH = 2000;
