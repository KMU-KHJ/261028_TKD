import { Outlet } from 'react-router-dom';
import { SITE_NAME } from '../lib/config';
import { isMockMode } from '../services';
import Header from './Header';
import MockBanner from './MockBanner';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-10 focus:rounded focus:bg-white focus:px-3 focus:py-2"
      >
        본문 바로가기
      </a>
      {isMockMode && <MockBanner />}
      <Header />
      <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {SITE_NAME}
      </footer>
    </div>
  );
}
