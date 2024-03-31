'use client';

import { ReactElement, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { CardStackMinusIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';
import { removeBangerAction } from '@/components/AddTrackActions';
import { cn } from '@/lib/utils';

type Props = {
  id: string;
  shortname: string;
  className?: string;
};

function RemoveTrack({ id, shortname, className }: Props): ReactElement {
  const [justRemoved, setJustRemoved] = useState(false);
  const [transitioning, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      className={cn(className, 'p-2 hover:bg-red-800/40 flex justify-center items-center')}
      disabled={justRemoved || transitioning}
      onClick={() => {
        startTransition(async () => {
          await removeBangerAction(id);

          setJustRemoved(true);
          toast(`${shortname} removed to your bangers`);
        });
      }}
    >
      {!justRemoved && <CardStackMinusIcon className="h-full w-full xs:h-16 xs:w-16" />}
    </Button>
  );
}

export default RemoveTrack;
