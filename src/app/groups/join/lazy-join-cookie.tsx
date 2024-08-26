'use client';

import { useEffect } from 'react';

import { setReturnToGroupCookie } from '@/app/groups/_group-actions';

type Props = {
  joinCode: string;
};

function LazyJoinCookie({ joinCode }: Props): null {
  useEffect(() => {
    setReturnToGroupCookie(joinCode);
  }, [joinCode]);

  return null;
}

export default LazyJoinCookie;
