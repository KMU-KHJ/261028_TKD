export default function TagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <ul aria-label="태그" className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li key={tag} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
          #{tag}
        </li>
      ))}
    </ul>
  );
}
