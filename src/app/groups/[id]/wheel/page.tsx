import React, { ReactElement } from 'react';
import Link from 'next/link';

import { SmallPage } from '@/components/layout/Layouts';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type Props = {
  params: {
    id: string;
  };
};

function Page({ params }: Props): ReactElement {
  return (
    <SmallPage
      title="Spin the wheel!"
      back={{
        to: `/groups/${params.id}/bangers`,
        text: 'Back to group bangers',
      }}
    >
      <div className="flex flex-col gap-3 w-full sm:max-w-60">
        <div>
          <Button asChild className="bg-blue-300 text-wrap h-20 text-lg w-full">
            <Link href={`/groups/${params.id}/wheel/solo-deep-cut`}>
              Solo <span className="font-bold mx-1">deep cut</span>
            </Link>
          </Button>
          <Label>(unique song to the singer)</Label>
        </div>
        <div className="opacity-30 pointer-events-none">
          <Button asChild className="bg-green-300 text-wrap h-20 text-lg w-full">
            <Link href={`/groups/${params.id}/wheel/mega-banger` as any}>
              Real <span className="font-bold mx-1">mega-banger</span>
            </Link>
          </Button>
          <Label>(only the most popular)</Label>
        </div>
        <div className="opacity-30 pointer-events-none">
          <Button asChild className="bg-red-300 text-wrap h-20 text-lg w-full">
            <Link href={`/groups/${params.id}/wheel/hit` as any}>
              A <span className="font-bold mx-1">HIT!</span>
            </Link>
          </Button>
          <Label>(2 or more)</Label>
        </div>
      </div>
    </SmallPage>
  );
}

export default Page;
