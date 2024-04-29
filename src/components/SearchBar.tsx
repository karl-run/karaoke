'use client';

import { ReactElement, useEffect, useRef, useTransition } from 'react';
import { useQueryState } from 'nuqs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

function SearchBar(): ReactElement | null {
  const [, startTransition] = useTransition();
  const path = usePathname();
  const router = useRouter();
  const query = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useQueryState('q', {
    startTransition,
    throttleMs: 1500,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const invisible = typeof query.get('q') !== 'string';

  return (
    <div
      className={cn('transition-[max-height] p-3 max-h-16', {
        // Not visible because we're not in search mode on phones
        'p-0 max-h-0 overflow-hidden sm:block sm:p-3 sm:max-h-16': invisible,
      })}
      hidden={invisible}
    >
      <Input
        id="primary-search"
        autoFocus={path === '/' && query.has('focus')}
        ref={searchRef}
        placeholder="Search for a song"
        onChange={(e) => {
          if (path !== '/') {
            router.push(`/?focus=true&q=${e.target.value}`);
            return;
          }

          return setSearch(e.target.value);
        }}
        value={search || ''}
      />
    </div>
  );
}

export default SearchBar;
