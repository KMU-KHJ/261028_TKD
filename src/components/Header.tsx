import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { SITE_NAME } from '../lib/config';
import { authService } from '../services';
import { useAuth } from './AuthProvider';
import Avatar from './Avatar';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-navy-700 text-white' : 'text-navy-100 hover:bg-navy-700 hover:text-white'}`;

export default function Header() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await authService.signOut();
      navigate('/');
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <header className="bg-navy-900 text-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="text-lg font-bold tracking-tight">
          {SITE_NAME}
        </Link>
        <nav aria-label="주 메뉴" className="flex flex-wrap items-center gap-1">
          <NavLink to="/" end className={navClass}>
            홈
          </NavLink>
          <NavLink to="/posts" className={navClass}>
            자료 목록
          </NavLink>
          {user?.isAdmin && (
            <NavLink to="/admin/new" className={navClass}>
              글쓰기
            </NavLink>
          )}
          {!loading &&
            (user ? (
              <div className="ml-2 flex items-center gap-2">
                <Avatar name={user.displayName} photoURL={user.photoURL} size="sm" />
                <span className="hidden text-sm text-navy-100 sm:inline">
                  {user.displayName}
                  {user.isAdmin && ' (관리자)'}
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="rounded-md border border-navy-600 px-3 py-1.5 text-sm text-navy-100 hover:bg-navy-700"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <NavLink to="/login" className={navClass}>
                로그인
              </NavLink>
            ))}
        </nav>
      </div>
    </header>
  );
}
