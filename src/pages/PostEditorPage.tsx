import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import ErrorState from '../components/ErrorState';
import LinksEditor from '../components/LinksEditor';
import LoadingState from '../components/LoadingState';
import Markdown from '../components/Markdown';
import { postService } from '../services';
import type { Category, PostInput, PostLink } from '../types';
import { CATEGORY_LABELS, isCategory } from '../utils/category';
import { getErrorMessage } from '../utils/errors';
import { parseTags } from '../utils/tags';
import { isSafeUrl } from '../utils/url';

interface FormState {
  title: string;
  category: Category;
  summary: string;
  content: string;
  tagsText: string;
  links: PostLink[];
}

const EMPTY_FORM: FormState = {
  title: '',
  category: 'research',
  summary: '',
  content: '',
  tagsText: '',
  links: [],
};

function validate(form: FormState): string | null {
  if (!form.title.trim()) return '제목을 입력해 주세요.';
  if (!form.content.trim()) return '본문을 입력해 주세요.';
  const filledLinks = form.links.filter((l) => l.label.trim() || l.url.trim());
  if (filledLinks.some((l) => !isSafeUrl(l.url))) {
    return '링크 주소는 http:// 또는 https:// 로 시작해야 합니다.';
  }
  return null;
}

function toInput(form: FormState): PostInput {
  return {
    title: form.title.trim(),
    category: form.category,
    summary: form.summary.trim(),
    content: form.content,
    tags: parseTags(form.tagsText),
    links: form.links
      .filter((l) => l.url.trim())
      .map((l) => ({ label: l.label.trim() || l.url.trim(), url: l.url.trim() })),
  };
}

export default function PostEditorPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [tab, setTab] = useState<'write' | 'preview'>('write');

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    postService
      .getPost(id)
      .then((post) => {
        if (cancelled) return;
        if (!post) {
          setNotFound(true);
          return;
        }
        setForm({
          title: post.title,
          category: post.category,
          summary: post.summary,
          content: post.content,
          tagsText: post.tags.join(', '),
          links: post.links,
        });
      })
      .catch((err) => !cancelled && setLoadError(getErrorMessage(err)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const problem = validate(form);
    if (problem) {
      setFormError(problem);
      return;
    }
    if (!user) return;
    setSaving(true);
    setFormError(null);
    try {
      if (id) {
        await postService.updatePost(id, toInput(form));
        navigate(`/posts/${id}`);
      } else {
        const created = await postService.createPost(toInput(form), user);
        navigate(`/posts/${created.id}`);
      }
    } catch (err) {
      setFormError(getErrorMessage(err));
      setSaving(false);
    }
  }

  if (loading) return <LoadingState />;
  if (loadError) return <ErrorState message={loadError} />;
  if (notFound) {
    return (
      <ErrorState title="글을 찾을 수 없습니다" message="삭제되었거나 주소가 잘못되었을 수 있습니다.">
        <Link to="/posts" className="btn-secondary mt-4">
          목록으로
        </Link>
      </ErrorState>
    );
  }

  const tabClass = (active: boolean) =>
    `px-4 py-2 text-sm font-medium border-b-2 ${active ? 'border-navy-800 text-navy-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900">{isEdit ? '글 수정' : '새 글 작성'}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6" noValidate>
        <div>
          <label htmlFor="title" className="label">
            제목 <span className="text-red-600">*</span>
          </label>
          <input
            id="title"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            required
            className="input"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="label">
              카테고리
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => isCategory(e.target.value) && set('category', e.target.value)}
              className="input"
            >
              {(Object.keys(CATEGORY_LABELS) as Category[]).map((value) => (
                <option key={value} value={value}>
                  {CATEGORY_LABELS[value]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tags" className="label">
              태그 (쉼표로 구분)
            </label>
            <input
              id="tags"
              value={form.tagsText}
              onChange={(e) => set('tagsText', e.target.value)}
              placeholder="예: 품새, 동작분석"
              className="input"
            />
          </div>
        </div>

        <div>
          <label htmlFor="summary" className="label">
            요약 (목록에 보이는 짧은 설명)
          </label>
          <textarea
            id="summary"
            value={form.summary}
            onChange={(e) => set('summary', e.target.value)}
            rows={2}
            className="input"
          />
        </div>

        <div>
          <div className="flex items-end justify-between">
            <label htmlFor="content" className="label">
              본문 (마크다운) <span className="text-red-600">*</span>
            </label>
            <div role="tablist" aria-label="본문 보기 방식" className="flex">
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'write'}
                onClick={() => setTab('write')}
                className={tabClass(tab === 'write')}
              >
                작성
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'preview'}
                onClick={() => setTab('preview')}
                className={tabClass(tab === 'preview')}
              >
                미리보기
              </button>
            </div>
          </div>
          {tab === 'write' ? (
            <>
              <textarea
                id="content"
                value={form.content}
                onChange={(e) => set('content', e.target.value)}
                rows={18}
                className="input font-mono"
                placeholder={'## 소제목\n\n본문 내용을 입력하세요. **굵게**, - 목록, [링크](https://...) 등을 쓸 수 있습니다.'}
              />
              <p className="mt-1 text-xs text-slate-500">
                ## 소제목, **굵게**, - 목록, | 표 | 같은 마크다운 문법을 사용할 수 있습니다.
              </p>
            </>
          ) : (
            <div className="min-h-[200px] rounded-md border border-slate-300 p-4">
              {form.content.trim() ? (
                <Markdown content={form.content} />
              ) : (
                <p className="text-sm text-slate-400">미리 볼 내용이 없습니다.</p>
              )}
            </div>
          )}
        </div>

        <LinksEditor links={form.links} onChange={(links) => set('links', links)} />

        {formError && (
          <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </p>
        )}

        <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-6">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? '저장 중…' : isEdit ? '수정 완료' : '등록하기'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
