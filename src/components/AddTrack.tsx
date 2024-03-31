'use client';

import { ReactElement, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { CardStackPlusIcon, CheckIcon, CheckboxIcon, UpdateIcon } from '@radix-ui/react-icons';
import { addBangerAction } from '@/components/AddTrackActions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Props = {
  id: string;
  shortname: string;
  className?: string;
};

function AddTrack({ id, shortname, className }: Props): ReactElement {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transitioning, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      className={cn(className, 'p-2 hover:bg-green-800/40 flex justify-center items-center')}
      disabled={success || transitioning}
      onClick={() => {
        setLoading(true);
        startTransition(async () => {
          await addBangerAction(id).catch(() => {
            toast.error('Failed to add track :(');
          });

          setLoading(false);
          setSuccess(true);
          toast.success(`${shortname} added to your bangers`);
        });
      }}
    >
      {loading && <UpdateIcon className="h-full w-full xs:h-16 xs:w-16 animate-spin" />}
      {!loading && !success && (
        <CardStackPlusIcon className="h-full w-full xs:h-16 xs:w-16 animate-out fade-out zoom-out" />
      )}
      {!loading && success && <CheckIcon className="h-full w-full xs:h-22 xs:w-22 animate-in fade-in zoom-in" />}
    </Button>
  );
}

export default AddTrack;
