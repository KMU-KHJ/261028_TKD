import type { ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import ErrorState from './ErrorState';
import LoadingState from './LoadingState';

/** 관리자만 볼 수 있는 화면을 감싸는 보호막 */
export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingState message="로그인 정보를 확인하는 중입니다…" />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!user.isAdmin) {
    return (
      <ErrorState title="접근 권한이 없습니다" message="글 작성·수정은 관리자(교수)만 할 수 있습니다.">
        <Link to="/" className="btn-secondary mt-4">
          홈으로
        </Link>
      </ErrorState>
    );
  }
  return <>{children}</>;
}
