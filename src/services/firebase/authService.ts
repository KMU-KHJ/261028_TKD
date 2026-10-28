import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { isAdminEmail } from '../../lib/config';
import { getDb, getFirebaseAuth } from '../../lib/firebase';
import type { AppUser } from '../../types';
import type { AuthService } from '../types';

function toAppUser(user: User): AppUser {
  return {
    uid: user.uid,
    displayName: user.displayName ?? user.email ?? '이름 없음',
    email: user.email ?? '',
    photoURL: user.photoURL ?? '',
    // 보안 규칙과 똑같이 "인증된 이메일"일 때만 관리자로 봅니다.
    isAdmin: user.emailVerified && isAdminEmail(user.email),
  };
}

export const firebaseAuthService: AuthService = {
  onAuthChange(callback) {
    return onAuthStateChanged(getFirebaseAuth(), (user) => callback(user ? toAppUser(user) : null));
  },

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const { user } = await signInWithPopup(getFirebaseAuth(), provider);

    // 회원 정보 저장(upsert). 실패해도 로그인 자체는 유지되도록 오류만 기록합니다.
    try {
      await setDoc(
        doc(getDb(), 'users', user.uid),
        {
          displayName: user.displayName ?? '',
          email: user.email ?? '',
          photoURL: user.photoURL ?? '',
          lastLoginAt: serverTimestamp(),
        },
        { merge: true },
      );
    } catch (error) {
      console.warn('사용자 정보를 저장하지 못했습니다.', error);
    }
  },

  async signInAsTestUser() {
    throw new Error('테스트 로그인은 테스트 모드에서만 사용할 수 있습니다.');
  },

  async signOut() {
    await signOut(getFirebaseAuth());
  },
};
