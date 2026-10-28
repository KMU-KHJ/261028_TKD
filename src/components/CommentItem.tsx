import type { Comment } from '../types';
import { formatDateTime } from '../utils/date';
import Avatar from './Avatar';

interface Props {
  comment: Comment;
  canDelete: boolean;
  deleting: boolean;
  onDelete: (comment: Comment) => void;
}

export default function CommentItem({ comment, canDelete, deleting, onDelete }: Props) {
  return (
    <li className="flex gap-3 border-b border-slate-100 py-4 last:border-b-0">
      <Avatar name={comment.authorName} photoURL={comment.authorPhotoURL} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 text-sm">
          <span className="font-semibold text-slate-800">{comment.authorName}</span>
          <time dateTime={comment.createdAt.toISOString()} className="text-xs text-slate-500">
            {formatDateTime(comment.createdAt)}
          </time>
          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(comment)}
              disabled={deleting}
              className="ml-auto text-xs text-red-600 hover:underline disabled:opacity-50"
            >
              {deleting ? '삭제 중…' : '삭제'}
            </button>
          )}
        </div>
        <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-700">{comment.text}</p>
      </div>
    </li>
  );
}
