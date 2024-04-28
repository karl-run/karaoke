'use client';

import React, { ReactElement } from 'react';
import { useQueryState, parseAsBoolean } from 'nuqs';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

function SwiperExtraActions(): ReactElement {
  const [noAuto, setNoAuto] = useQueryState(
    'no-auto',
    parseAsBoolean.withDefault(false).withOptions({
      shallow: true,
      clearOnDefault: true,
    }),
  );

  return (
    <div className="flex items-center space-x-2 mt-2">
      <Label htmlFor="airplane-mode">Autoplay</Label>
      <Switch id="airplane-mode" checked={!noAuto} onClick={() => setNoAuto(!noAuto)} />
    </div>
  );
}

export default SwiperExtraActions;
