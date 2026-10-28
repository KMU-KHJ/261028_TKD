// Firebase 오류 코드를 사용자가 이해할 수 있는 한국어 문장으로 바꿉니다.
const MESSAGES: Record<string, string> = {
  'permission-denied': '권한이 없습니다. 로그인 상태나 관리자 설정을 확인해 주세요.',
  unavailable: '서버에 연결할 수 없습니다. 인터넷 연결을 확인해 주세요.',
  'auth/popup-closed-by-user': '로그인 창이 닫혔습니다. 다시 시도해 주세요.',
  'auth/cancelled-popup-request': '로그인 창이 닫혔습니다. 다시 시도해 주세요.',
  'auth/popup-blocked': '브라우저가 로그인 팝업을 차단했습니다. 팝업 허용 후 다시 시도해 주세요.',
  'auth/unauthorized-domain':
    '이 사이트 주소가 Firebase에 등록되지 않았습니다. Firebase 콘솔 → Authentication → 승인된 도메인에 주소를 추가해 주세요.',
  'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
    'Firebase API 키가 올바르지 않습니다. src/lib/siteSettings.ts 의 apiKey 값을 Firebase 콘솔의 웹 API 키와 비교해 주세요.',
  'auth/invalid-api-key':
    'Firebase API 키가 올바르지 않습니다. src/lib/siteSettings.ts 의 apiKey 값을 Firebase 콘솔의 웹 API 키와 비교해 주세요.',
  'auth/network-request-failed': '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.',
};

export function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const code = (error as { code?: unknown }).code;
    if (typeof code === 'string' && MESSAGES[code]) return MESSAGES[code];
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message) return message;
  }
  return '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
}
