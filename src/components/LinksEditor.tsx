import type { PostLink } from '../types';

interface Props {
  links: PostLink[];
  onChange: (links: PostLink[]) => void;
}

/** 파일 업로드 대신 Google Drive·YouTube·DOI 등 외부 링크를 입력받습니다. */
export default function LinksEditor({ links, onChange }: Props) {
  function update(index: number, field: keyof PostLink, value: string) {
    onChange(links.map((link, i) => (i === index ? { ...link, [field]: value } : link)));
  }

  return (
    <fieldset>
      <legend className="label">외부 링크 (Google Drive, YouTube, DOI 등)</legend>
      <ul className="space-y-3">
        {links.map((link, index) => (
          <li key={index} className="flex flex-col gap-2 rounded-md border border-slate-200 p-3 sm:flex-row sm:items-end">
            <div className="sm:w-1/3">
              <label htmlFor={`link-label-${index}`} className="mb-1 block text-xs text-slate-600">
                링크 이름
              </label>
              <input
                id={`link-label-${index}`}
                value={link.label}
                onChange={(e) => update(index, 'label', e.target.value)}
                placeholder="예: 발표 자료"
                className="input"
              />
            </div>
            <div className="flex-1">
              <label htmlFor={`link-url-${index}`} className="mb-1 block text-xs text-slate-600">
                주소(URL)
              </label>
              <input
                id={`link-url-${index}`}
                type="url"
                value={link.url}
                onChange={(e) => update(index, 'url', e.target.value)}
                placeholder="https://"
                className="input"
              />
            </div>
            <button
              type="button"
              onClick={() => onChange(links.filter((_, i) => i !== index))}
              className="btn-danger"
              aria-label={`${index + 1}번째 링크 삭제`}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => onChange([...links, { label: '', url: '' }])} className="btn-secondary mt-3">
        + 링크 추가
      </button>
    </fieldset>
  );
}
