import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import SwiperMoreButton from '@/components/swiper/SwiperMoreButton';

type Props = {
  mode: 'reset' | 'landing' | 'empty';
  onClick?: () => void;
};

export function SwiperLanding({ mode, onClick }: Props) {
  return (
    <Card className="h-full w-full flex flex-col justify-center">
      <CardHeader>
        {mode === 'empty' ? (
          <CardTitle>No more tracks :(</CardTitle>
        ) : (
          <CardTitle>Explore tracks to discover forgotten bangers!</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        {mode === 'empty' ? (
          <>
            <p className="mb-2">Seems like you have explored all tracks!</p>
            <p>Come back later, if any of your friends add new tracks they might show up here!</p>
          </>
        ) : (
          <>
            <p className="mb-2">These tracks are a mix of your friends songs, and famously good karaoke tracks.</p>
            <p>Swipe left to dismiss and swipe right bang the track, just like a certain dating app. :-)</p>
          </>
        )}
        <div className="flex justify-center mt-8">
          {onClick ? (
            mode === 'landing' ? (
              <Button variant="default" type="button" size="lg" onClick={onClick}>
                Start discovering!
              </Button>
            ) : mode === 'reset' ? (
              <SwiperMoreButton />
            ) : null
          ) : mode !== 'empty' ? (
            <Skeleton className="w-44 h-[44px]" />
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
