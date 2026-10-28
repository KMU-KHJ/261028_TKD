import { Link } from 'react-router-dom';
import type { Post } from '../types';
import { formatDate } from '../utils/date';
import CategoryBadge from './CategoryBadge';
import TagList from './TagList';

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="rounded-lg border border-slate-200 p-5 transition-shadow hover:shadow-md">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <CategoryBadge category={post.category} />
        <time dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt)}</time>
      </div>
      <h3 className="mt-2 text-lg font-semibold text-navy-900">
        <Link to={`/posts/${post.id}`} className="hover:underline">
          {post.title}
        </Link>
      </h3>
      {post.summary && <p className="mt-1 line-clamp-2 text-sm text-slate-600">{post.summary}</p>}
      <div className="mt-3">
        <TagList tags={post.tags} />
      </div>
    </article>
  );
}
