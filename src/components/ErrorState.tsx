import type { ReactNode } from 'react';

interface Props {
  title?: string;
  message: string;
  onRetry?: () => void;
  children?: ReactNode;
}

export default function ErrorState({ title = '문제가 발생했습니다', message, onRetry, children }: Props) {
  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-8 text-center">
      <p className="font-semibold text-red-800">{title}</p>
      <p className="mt-1 text-sm text-red-700">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary mt-4">
          다시 시도
        </button>
      )}
      {children}
    </div>
  );
}
