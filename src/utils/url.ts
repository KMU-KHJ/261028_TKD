/** javascript: 같은 위험한 주소를 막기 위해 http/https 링크만 허용 */
export function isSafeUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
