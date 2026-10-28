import { useState, type FormEvent } from 'react';
import { COMMENT_MAX_LENGTH } from '../lib/config';

interface Props {
  onSubmit: (text: string) => Promise<void>;
}

export default function CommentForm({ onSubmit }: Props) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const trimmed = text.trim();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!trimmed) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(trimmed);
      setText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <label htmlFor="comment-text" className="label">
        의견 남기기
      </label>
      <textarea
        id="comment-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={COMMENT_MAX_LENGTH}
        rows={4}
        placeholder="토론 내용을 입력하세요"
        className="input"
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-xs text-slate-500">
          {text.length} / {COMMENT_MAX_LENGTH}자
        </span>
        <button type="submit" disabled={!trimmed || submitting} className="btn-primary">
          {submitting ? '등록 중…' : '댓글 등록'}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </form>
  );
}
