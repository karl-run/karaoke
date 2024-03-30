'use client';

import { ReactElement, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { CardStackMinusIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';
import { removeBangerAction } from '@/components/AddTrackActions';

type Props = {
  id: string;
  shortname: string;
};

function RemoveTrack({ id, shortname }: Props): ReactElement {
  const [justRemoved, setJustRemoved] = useState(false);
  const [transitioning, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      className="absolute w-10 h-10 p-0 xs:w-auto xs:h-auto xs:top-0 xs:left-0 right-0 xs:bottom-12 hover:bg-red-800/40 flex justify-center items-center"
      disabled={justRemoved || transitioning}
      onClick={() => {
        startTransition(async () => {
          await removeBangerAction(id);

          setJustRemoved(true);
          toast(`${shortname} removed to your bangers`);
        });
      }}
    >
      {!justRemoved && <CardStackMinusIcon className="h-6 w-6 xs:h-16 xs:w-16" />}
    </Button>
  );
}

export default RemoveTrack;
