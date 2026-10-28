import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const env = import.meta.env;

// Firebase 콘솔의 firebaseConfig를 그대로 복사하면 "값", 처럼 따옴표·쉼표가 섞여 들어오기 쉬워 정리합니다.
function clean(value: string | undefined): string | undefined {
  return value?.trim().replace(/,$/, '').replace(/^["']|["']$/g, '').trim();
}

// 설정값은 코드에 직접 쓰지 않고 환경변수(.env 또는 Netlify)에서만 읽습니다.
const firebaseConfig = {
  apiKey: clean(env.VITE_FIREBASE_API_KEY),
  authDomain: clean(env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: clean(env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: clean(env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: clean(env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: clean(env.VITE_FIREBASE_APP_ID),
};

// 테스트 모드에서는 Firebase를 아예 초기화하지 않도록, 처음 필요할 때 초기화합니다.
function getFirebaseApp(): FirebaseApp {
  return getApps()[0] ?? initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}
