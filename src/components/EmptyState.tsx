import type { ReactNode } from 'react';

export default function EmptyState({ message, children }: { message: string; children?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 px-4 py-12 text-center text-slate-500">
      <p>{message}</p>
      {children}
    </div>
  );
}
