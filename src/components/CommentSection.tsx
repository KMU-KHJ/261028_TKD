import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { commentService } from '../services';
import type { Comment } from '../types';
import { getErrorMessage } from '../utils/errors';
import { useAuth } from './AuthProvider';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import LoadingState from './LoadingState';

export default function CommentSection({ postId }: { postId: string }) {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 댓글은 로그인한 사용자만 읽을 수 있으므로(보안 규칙), 로그인했을 때만 조회합니다.
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setComments(await commentService.listComments(postId));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const uid = user?.uid;
  useEffect(() => {
    if (uid) load();
    else setComments([]);
  }, [uid, load]);

  async function handleAdd(text: string) {
    if (!user) return;
    try {
      const created = await commentService.addComment(postId, text, user);
      // 다시 조회하지 않고 화면 목록에만 추가 (읽기 횟수 절약)
      setComments((prev) => [...prev, created]);
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }

  async function handleDelete(comment: Comment) {
    if (!window.confirm('이 댓글을 삭제할까요?')) return;
    setDeletingId(comment.id);
    try {
      await commentService.deleteComment(postId, comment.id);
      setComments((prev) => prev.filter((c) => c.id !== comment.id));
    } catch (err) {
      window.alert(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section aria-labelledby="comments-heading" className="mt-12 border-t border-slate-200 pt-8">
      <h2 id="comments-heading" className="text-xl font-bold text-belt-900">
        토론 {user && !loading && !error && <span className="text-base font-normal text-slate-500">({comments.length})</span>}
      </h2>

      {authLoading ? (
        <LoadingState message="로그인 정보를 확인하는 중입니다…" />
      ) : !user ? (
        <div className="mt-4 rounded-lg bg-belt-50 px-4 py-6 text-center">
          <p className="text-slate-700">로그인 후 토론에 참여하세요</p>
          <Link to="/login" state={{ from: location.pathname }} className="btn-primary mt-3">
            로그인하기
          </Link>
        </div>
      ) : (
        <>
          {loading ? (
            <LoadingState message="댓글을 불러오는 중입니다…" />
          ) : error ? (
            <div className="mt-4">
              <ErrorState message={error} onRetry={load} />
            </div>
          ) : comments.length === 0 ? (
            <div className="mt-4">
              <EmptyState message="아직 댓글이 없습니다. 첫 의견을 남겨 보세요." />
            </div>
          ) : (
            <ul className="mt-2">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  canDelete={user.isAdmin || comment.authorUid === user.uid}
                  deleting={deletingId === comment.id}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          )}
          <CommentForm onSubmit={handleAdd} />
        </>
      )}
    </section>
  );
}
