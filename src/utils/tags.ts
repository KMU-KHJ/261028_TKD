/** "품새, 겨루기 ,#지도법" → ["품새", "겨루기", "지도법"] (중복 제거) */
export function parseTags(input: string): string[] {
  const tags = input
    .split(',')
    .map((tag) => tag.trim().replace(/^#/, ''))
    .filter(Boolean);
  return Array.from(new Set(tags));
}
