export default function LoadingState({ message = '불러오는 중입니다…' }: { message?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center justify-center gap-3 py-12 text-slate-500">
      <span
        aria-hidden="true"
        className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-navy-700"
      />
      <span>{message}</span>
    </div>
  );
}
