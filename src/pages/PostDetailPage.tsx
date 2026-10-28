import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import CategoryBadge from '../components/CategoryBadge';
import CommentSection from '../components/CommentSection';
import ErrorState from '../components/ErrorState';
import LinkList from '../components/LinkList';
import LoadingState from '../components/LoadingState';
import Markdown from '../components/Markdown';
import TagList from '../components/TagList';
import { postService } from '../services';
import type { Post } from '../types';
import { formatDate } from '../utils/date';
import { getErrorMessage } from '../utils/errors';

export default function PostDetailPage() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPost(await postService.getPost(id));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete() {
    if (!post || !window.confirm(`"${post.title}" 글과 댓글을 모두 삭제할까요? 되돌릴 수 없습니다.`)) return;
    setDeleting(true);
    try {
      await postService.deletePost(post.id);
      navigate('/posts', { replace: true });
    } catch (err) {
      window.alert(getErrorMessage(err));
      setDeleting(false);
    }
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!post) {
    return (
      <ErrorState title="글을 찾을 수 없습니다" message="삭제되었거나 주소가 잘못되었을 수 있습니다.">
        <Link to="/posts" className="btn-secondary mt-4">
          목록으로
        </Link>
      </ErrorState>
    );
  }

  const edited = post.updatedAt.getTime() - post.createdAt.getTime() > 60_000;

  return (
    <article>
      <Link to="/posts" className="text-sm text-chung-600 hover:underline">
        ← 목록으로
      </Link>

      <header className="mt-4 border-b border-slate-200 pb-6">
        <CategoryBadge category={post.category} />
        <h1 className="mt-2 text-2xl font-bold leading-snug text-belt-900 sm:text-3xl">{post.title}</h1>
        <p className="mt-2 text-sm text-slate-500">
          {post.authorName && <span>{post.authorName} · </span>}
          <time dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt)}</time>
          {edited && <span> (수정됨 {formatDate(post.updatedAt)})</span>}
        </p>
        {post.summary && <p className="mt-4 text-slate-700">{post.summary}</p>}
        <div className="mt-4">
          <TagList tags={post.tags} />
        </div>
        {user?.isAdmin && (
          <div className="mt-4 flex gap-2">
            <Link to={`/admin/edit/${post.id}`} className="btn-secondary">
              수정
            </Link>
            <button type="button" onClick={handleDelete} disabled={deleting} className="btn-danger">
              {deleting ? '삭제 중…' : '삭제'}
            </button>
          </div>
        )}
      </header>

      <div className="mt-8">
        <Markdown content={post.content} />
      </div>

      <div className="mt-8">
        <LinkList links={post.links} />
      </div>

      <CommentSection postId={post.id} />
    </article>
  );
}
