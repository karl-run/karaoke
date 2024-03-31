'use client';

import { ReactElement, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { CardStackPlusIcon, CheckboxIcon } from '@radix-ui/react-icons';
import { addBangerAction } from '@/components/AddTrackActions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Props = {
  id: string;
  shortname: string;
  className?: string;
};

function AddTrack({ id, shortname, className }: Props): ReactElement {
  const [justAdded, setJustAdded] = useState(false);
  const [transitioning, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      className={cn(className, 'p-2 hover:bg-green-800/40 flex justify-center items-center')}
      disabled={justAdded || transitioning}
      onClick={() => {
        startTransition(async () => {
          await addBangerAction(id);

          setJustAdded(true);
          toast(`${shortname} added to your bangers`);
        });
      }}
    >
      {!justAdded && <CardStackPlusIcon className="h-full w-full xs:h-16 xs:w-16" />}
      {justAdded && <CheckboxIcon className="h-full w-full xs:h-16 xs:w-16" />}
    </Button>
  );
}

export default AddTrack;
