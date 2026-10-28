import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PostCard from '../components/PostCard';
import { SITE_NAME } from '../lib/config';
import { postService } from '../services';
import type { Post } from '../types';
import { getErrorMessage } from '../utils/errors';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await postService.listPosts({ pageSize: 5 });
      setPosts(page.posts);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <section className="rounded-xl bg-navy-50 px-6 py-10 sm:px-10">
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">{SITE_NAME}</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-slate-700">
          태권도학과 연구실의 연구자료와 수업자료를 한곳에 모아 둔 공간입니다.
          <br className="hidden sm:inline" />
          자료를 읽고 댓글로 함께 토론하며 생각을 넓혀 보세요.
        </p>
        <Link to="/posts" className="btn-primary mt-6">
          전체 자료 보기
        </Link>
      </section>

      <section aria-labelledby="latest-heading" className="mt-10">
        <h2 id="latest-heading" className="text-xl font-bold text-navy-900">
          최신 자료
        </h2>
        <div className="mt-4">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : posts.length === 0 ? (
            <EmptyState message="아직 등록된 자료가 없습니다." />
          ) : (
            <ul className="space-y-4">
              {posts.map((post) => (
                <li key={post.id}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
