import type { PostLink } from '../types';
import { isSafeUrl } from '../utils/url';

export default function LinkList({ links }: { links: PostLink[] }) {
  const safeLinks = links.filter((link) => isSafeUrl(link.url));
  if (safeLinks.length === 0) return null;
  return (
    <section aria-labelledby="links-heading" className="rounded-lg border border-belt-100 bg-belt-50 p-4">
      <h2 id="links-heading" className="text-sm font-semibold text-belt-900">
        관련 링크
      </h2>
      <ul className="mt-2 space-y-1">
        {safeLinks.map((link, index) => (
          <li key={`${link.url}-${index}`}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-chung-600 underline underline-offset-2 hover:text-chung-700"
            >
              {link.label || link.url}
              <span className="sr-only"> (새 창에서 열림)</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
