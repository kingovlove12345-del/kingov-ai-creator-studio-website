import { useState } from 'react';
import { Film } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle = 'KingOv AI Creator Studio',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0B192C] via-[#13294B] to-[#1E3A5F] text-white p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Film className="w-8 h-8 text-[#F5C451] mb-3 opacity-90" />
        <span className="font-display text-sm font-semibold tracking-tight text-slate-100">
          {fallbackTitle}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
