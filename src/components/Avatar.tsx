interface Props {
  name: string;
  photoURL: string;
  size?: 'sm' | 'md';
}

export default function Avatar({ name, photoURL, size = 'md' }: Props) {
  const sizeClass = size === 'sm' ? 'h-7 w-7 text-xs' : 'h-9 w-9 text-sm';
  if (photoURL) {
    // Google 프로필 사진은 referrer가 있으면 가끔 차단되어 no-referrer로 요청합니다.
    return (
      <img
        src={photoURL}
        alt={`${name} 프로필 사진`}
        referrerPolicy="no-referrer"
        className={`${sizeClass} shrink-0 rounded-full object-cover`}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`${sizeClass} inline-flex shrink-0 items-center justify-center rounded-full bg-belt-100 font-semibold text-belt-800`}
    >
      {name.slice(0, 1)}
    </span>
  );
}
