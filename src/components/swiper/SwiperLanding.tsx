import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Props = { onClick: () => void };

export function SwiperLanding({ onClick }: Props) {
  return (
    <Card className="h-full w-full flex flex-col justify-center">
      <CardHeader>
        <CardTitle>Explore tracks to discover forgotten bangers!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2">These tracks are a mix of your friends songs, and famously good karaoke tracks.</p>
        <p>Swipe left to dismiss and swipe right bang the track, just like a certain dating app. :-)</p>
        <div className="flex justify-center mt-8">
          <Button variant="default" type="button" size="lg" onClick={onClick}>
            Start discovering!
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
