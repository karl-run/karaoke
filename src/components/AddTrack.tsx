"use client";

import { ReactElement, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { CardStackPlusIcon } from "@radix-ui/react-icons";
import { addBangerAction } from "@/components/AddTrackActions";
import { toast } from "sonner";

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
      className="absolute h-auto top-0 left-0 right-0 bottom-12 hover:bg-green-800/40 flex justify-center items-center"
      disabled={justAdded || transitioning}
      onClick={() => {
        startTransition(async () => {
          await addBangerAction(id);

          setJustAdded(true);
          toast(`${shortname} added to your bangers`);
        });
      }}
    >
      {!justAdded && <CardStackPlusIcon className="h-16 w-16" />}
    </Button>
  );
}

export default AddTrack;
