import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import LoadingState from '../components/LoadingState';
import { authService, isMockMode, type TestRole } from '../services';
import { getErrorMessage } from '../utils/errors';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: string } | null)?.from ?? '/';

  if (loading) return <LoadingState message="로그인 정보를 확인하는 중입니다…" />;
  if (user) return <Navigate to={from} replace />;

  async function run(action: () => Promise<void>) {
    setPending(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  const testLogin = (role: TestRole) => run(() => authService.signInAsTestUser(role));

  return (
    <div className="mx-auto max-w-md rounded-xl border border-slate-200 p-8 text-center">
      <h1 className="text-2xl font-bold text-navy-900">로그인</h1>
      <p className="mt-2 text-sm text-slate-600">로그인하면 자료에 댓글을 남기며 토론에 참여할 수 있습니다.</p>

      <div className="mt-8 flex flex-col gap-3">
        {isMockMode ? (
          <>
            <button type="button" onClick={() => testLogin('admin')} disabled={pending} className="btn-primary">
              테스트 로그인(관리자)
            </button>
            <button type="button" onClick={() => testLogin('student')} disabled={pending} className="btn-secondary">
              테스트 로그인(학생)
            </button>
            <p className="text-xs text-slate-500">
              지금은 테스트 모드입니다. Firebase를 연결하면 이 자리에 Google 로그인 버튼이 나타납니다.
            </p>
          </>
        ) : (
          <button
            type="button"
            onClick={() => run(() => authService.signInWithGoogle())}
            disabled={pending}
            className="btn-secondary py-3"
          >
            <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
            </svg>
            {pending ? '로그인 중…' : 'Google 계정으로 로그인'}
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
