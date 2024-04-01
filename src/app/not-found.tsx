import Link from 'next/link';
import { SmallPage } from '@/components/layout/Layouts';
import GroupAvatar from '@/components/avatar/GroupAvatar';

export default function NotFound() {
  return (
    <SmallPage
      title="Unable to find that..."
      back={{
        to: '/',
        text: 'Return Home',
      }}
      className="flex flex-col"
    >
      <div className="flex gap-3 items-center mb-4">
        <GroupAvatar iconIndex={16} />
        <h2 className="text-lg">Whatever you were looking for, we could not find it.</h2>
      </div>
      <p className="mb-4">You could also have attempted to load something you don't have access to.</p>
      <Link href="/" className="underline">
        Return Home
      </Link>
    </SmallPage>
  );
}
