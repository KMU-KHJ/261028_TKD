import { useCallback, useEffect, useMemo, useState } from 'react';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PostCard from '../components/PostCard';
import { PAGE_SIZE } from '../lib/config';
import { postService, type PageCursor } from '../services';
import type { Category, Post } from '../types';
import { CATEGORY_LABELS } from '../utils/category';
import { getErrorMessage } from '../utils/errors';

type Filter = 'all' | Category;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'research', label: CATEGORY_LABELS.research },
  { value: 'course', label: CATEGORY_LABELS.course },
];

export default function PostListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<PageCursor | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const loadFirst = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await postService.listPosts({ pageSize: PAGE_SIZE });
      setPosts(page.posts);
      setCursor(page.nextCursor);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFirst();
  }, [loadFirst]);

  async function loadMore() {
    setLoadingMore(true);
    setError(null);
    try {
      const page = await postService.listPosts({ pageSize: PAGE_SIZE, cursor });
      setPosts((prev) => [...prev, ...page.posts]);
      setCursor(page.nextCursor);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingMore(false);
    }
  }

  // 카테고리·검색은 이미 불러온 글 안에서 거릅니다.
  // (서버에서 거르면 Firestore 복합 색인 설정이 추가로 필요해 단순하게 유지)
  const visiblePosts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return posts.filter((post) => {
      if (filter !== 'all' && post.category !== filter) return false;
      if (!keyword) return true;
      return (
        post.title.toLowerCase().includes(keyword) ||
        post.tags.some((tag) => tag.toLowerCase().includes(keyword))
      );
    });
  }, [posts, filter, search]);

  const isFiltering = filter !== 'all' || search.trim() !== '';

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900">자료 목록</h1>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <fieldset>
          <legend className="sr-only">카테고리</legend>
          <div className="inline-flex rounded-md border border-slate-300 p-0.5">
            {FILTERS.map((item) => (
              <label
                key={item.value}
                className={`cursor-pointer rounded px-4 py-1.5 text-sm font-medium focus-within:ring-2 focus-within:ring-navy-600 ${
                  filter === item.value ? 'bg-navy-800 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={item.value}
                  checked={filter === item.value}
                  onChange={() => setFilter(item.value)}
                  className="sr-only"
                />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="w-full sm:w-72">
          <label htmlFor="search" className="label">
            제목·태그 검색
          </label>
          <input
            id="search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="예: 품새, 겨루기"
            className="input"
          />
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <LoadingState />
        ) : error && posts.length === 0 ? (
          <ErrorState message={error} onRetry={loadFirst} />
        ) : visiblePosts.length === 0 ? (
          <EmptyState message={isFiltering ? '조건에 맞는 자료가 없습니다.' : '아직 등록된 자료가 없습니다.'} />
        ) : (
          <ul className="space-y-4">
            {visiblePosts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}

        {!loading && error && posts.length > 0 && (
          <p role="alert" className="mt-4 text-center text-sm text-red-700">
            {error}
          </p>
        )}

        {!loading && cursor !== null && (
          <div className="mt-6 text-center">
            {isFiltering && (
              <p className="mb-2 text-xs text-slate-500">
                검색·필터는 지금까지 불러온 {posts.length}개 자료 안에서 적용됩니다.
              </p>
            )}
            <button type="button" onClick={loadMore} disabled={loadingMore} className="btn-secondary">
              {loadingMore ? '불러오는 중…' : '더 보기'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
