'use client';

import { ReactElement, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { CardStackPlusIcon, CheckIcon, PlusIcon, UpdateIcon } from '@radix-ui/react-icons';
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
          const result = await addBangerAction(id).catch(() => {
            toast.error('Failed to add track :(');
            return {
              error: 'unknown',
            };
          });

          setLoading(false);
          if ('error' in result) {
            if (result.error === 'not-logged-in') {
              toast.error('You have to be logged in to add bangers!');
            } else {
              toast.error('Failed to add track :(');
            }
          } else {
            setSuccess(true);
            toast.success(`${shortname} added to your bangers`);
          }
        });
      }}
    >
      {loading && <UpdateIcon className="h-full w-full xs:h-16 xs:w-16 animate-spin" />}
      {!loading && !success && <PlusIcon className="h-full w-full xs:h-16 xs:w-16 animate-out" />}
      {!loading && success && <CheckIcon className="h-full w-full xs:h-18 xs:w-18 animate-in fade-in zoom-in" />}
    </Button>
  );
}

export default AddTrack;
