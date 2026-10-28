// ─────────────────────────────────────────────────────────────
// 사이트 기본 설정 (이 파일만 고치면 됩니다)
//
// Firebase 웹 설정값은 비밀번호가 아니라 브라우저에 공개되는 "주소" 같은 값이라
// 코드에 넣어도 괜찮습니다. 데이터 보호는 firestore.rules(보안 규칙)가 담당합니다.
// ─────────────────────────────────────────────────────────────

export const SITE_SETTINGS = {
  siteName: '태권도 연구실 아카이브',

  // 관리자(글 작성·수정·삭제) Google 이메일. 여러 명이면 쉼표로 추가.
  // firestore.rules 안의 관리자 이메일과 반드시 같게 맞춰 주세요.
  adminEmails: ['gudwns2984@gmail.com'],

  // Firebase 콘솔 → 프로젝트 설정 → 내 앱 → firebaseConfig 값
  // apiKey를 빈 문자열('')로 두면 테스트 모드(이 브라우저에만 저장)로 동작합니다.
  firebase: {
    apiKey: 'AIzaSyDqkuVZqJSarIXGxfQLR3vtF69G4-p19_0',
    authDomain: 'khj1-4fbfd.firebaseapp.com',
    projectId: 'khj1-4fbfd',
    storageBucket: 'khj1-4fbfd.firebasestorage.app',
    messagingSenderId: '620949623545',
    appId: '1:620949623545:web:3b819300d71bbcfb418828',
  },
};
