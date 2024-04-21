import React, { PropsWithChildren } from 'react';

import { TrackSkeleton } from './Track';
import { FullPageDescription } from '@/components/layout/Layouts';
import { Skeleton } from '@/components/ui/skeleton';

export function TrackGrid({ children }: PropsWithChildren) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-2 p-2">
      {children}
    </div>
  );
}

export function TrackGridSkeleton() {
  return (
    <TrackGrid>
      {[...Array(20)].map((_, index) => (
        <TrackSkeleton key={index} />
      ))}
    </TrackGrid>
  );
}
