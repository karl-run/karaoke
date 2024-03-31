import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

export function BackLink(props: { href: string; text: string }) {
  return (
    <Link href={props.href} className="flex items-center gap-1 mb-4 max-w-fit">
      <ArrowLeft className="h-4 w-4" />
      {props.text}
    </Link>
  );
}

export function BackToSearch() {
  return <BackLink href="/?focus=true&q=" text="Back to search" />;
}
