'use client';

import { useRef, ReactElement, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useQueryState } from 'nuqs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function SearchBar(): ReactElement | null {
  const path = usePathname();
  const router = useRouter();
  const query = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useQueryState('q', {
    shallow: false,
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

  return (
    <div className="p-3">
      <Input
        onFocus={() => {
          if (path !== '/') {
            router.push('/?focus=true&q=');
          }
        }}
        autoFocus={path === '/' && query.has('focus')}
        ref={searchRef}
        placeholder="Search for a song"
        onChange={(e) => setSearch(e.target.value)}
        value={search || ''}
      />
    </div>
  );
}

export default SearchBar;
