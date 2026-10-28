import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { SITE_SETTINGS } from './siteSettings';

// 테스트 모드에서는 Firebase를 아예 초기화하지 않도록, 처음 필요할 때 초기화합니다.
function getFirebaseApp(): FirebaseApp {
  return getApps()[0] ?? initializeApp(SITE_SETTINGS.firebase);
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}
