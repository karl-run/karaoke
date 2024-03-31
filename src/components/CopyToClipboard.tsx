'use client';

import React, { ReactElement } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

function CopyToClipboard({ value }: { value: string }): ReactElement {
  return (
    <Button
      onClick={() => {
        navigator.clipboard.writeText(value);
        toast.success('Copied to clipboard');
      }}
    >
      Copy
    </Button>
  );
}

export default CopyToClipboard;
