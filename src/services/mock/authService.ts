import { ADMIN_EMAILS } from '../../lib/config';
import type { AppUser } from '../../types';
import type { AuthService, TestRole } from '../types';
import { delay, readStoredUser, writeStoredUser } from './storage';

const TEST_USERS: Record<TestRole, AppUser> = {
  admin: {
    uid: 'test-admin',
    displayName: '테스트 교수(관리자)',
    email: ADMIN_EMAILS[0] ?? 'admin@test.local',
    photoURL: '',
    isAdmin: true,
  },
  student: {
    uid: 'test-student',
    displayName: '테스트 대학원생',
    email: 'student@test.local',
    photoURL: '',
    isAdmin: false,
  },
};

const listeners = new Set<(user: AppUser | null) => void>();
let currentUser: AppUser | null = readStoredUser<AppUser>();

function setUser(user: AppUser | null): void {
  currentUser = user;
  writeStoredUser(user);
  listeners.forEach((listener) => listener(user));
}

export const mockAuthService: AuthService = {
  onAuthChange(callback) {
    listeners.add(callback);
    callback(currentUser);
    return () => {
      listeners.delete(callback);
    };
  },

  async signInWithGoogle() {
    throw new Error('테스트 모드에서는 Google 로그인을 사용할 수 없습니다. 테스트 로그인 버튼을 이용하세요.');
  },

  async signInAsTestUser(role) {
    await delay(150);
    setUser(TEST_USERS[role]);
  },

  async signOut() {
    setUser(null);
  },
};
