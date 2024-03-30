'use client';

import { ReactElement, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { CardStackPlusIcon } from '@radix-ui/react-icons';
import { addBangerAction } from '@/components/AddTrackActions';
import { toast } from 'sonner';

type Props = {
  id: string;
  shortname: string;
};

function AddTrack({ id, shortname }: Props): ReactElement {
  const [justAdded, setJustAdded] = useState(false);
  const [transitioning, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      className="absolute w-10 h-10 p-0 xs:w-auto xs:h-auto xs:top-0 xs:left-0 right-0 xs:bottom-12 hover:bg-green-800/40 flex justify-center items-center"
      disabled={justAdded || transitioning}
      onClick={() => {
        startTransition(async () => {
          await addBangerAction(id);

          setJustAdded(true);
          toast(`${shortname} added to your bangers`);
        });
      }}
    >
      {!justAdded && <CardStackPlusIcon className="h-6 w-6 xs:h-16 xs:w-16" />}
    </Button>
  );
}

export default AddTrack;
