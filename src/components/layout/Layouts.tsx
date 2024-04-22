import React, { PropsWithChildren, ReactElement, ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { cn } from '@/lib/utils';
import { BackLink, BackToSearch } from '@/components/layout/BackLinks';

type FullPageProps = {
  title?: string;
  className?: string;
  back?:
    | {
        text: string;
        to: string;
      }
    | 'search';
  actions?: ReactNode;
};

export function FullPage({ title, back, children, actions }: PropsWithChildren<FullPageProps>): ReactElement {
  return (
    <div className="container pb-8">
      {title && (
        <div className="mt-6 my-4 ml-4 sm:ml-8 sm:mt-10 relative">
          {back && (
            <div className="text-xs underline absolute -top-5">
              {back === 'search' && <BackToSearch />}
              {back && typeof back !== 'string' && <BackLink href={back.to} text={back.text} />}
            </div>
          )}

          <h1 className="text-xl">{title}</h1>
          <div className="absolute -top-4 right-3">{actions}</div>
        </div>
      )}
      {children}
    </div>
  );
}

export function FullPageDescription({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn(className, 'ml-2 pt-2 sm:ml-8')}>{children}</div>;
}

export function FullPageDetails({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn(className, 'mx-2 sm:mx-8')}>{children}</div>;
}

type SmallPageProps = {
  title: string;
  className?: string;
  back?:
    | {
        text: string;
        to: string;
      }
    | 'search';
  actions?: ReactNode;
};

export function SmallPage({
  children,
  title,
  className,
  back,
  actions,
}: PropsWithChildren<SmallPageProps>): ReactElement {
  return (
    <div className="container pb-8">
      <div className="mt-6 my-4 ml-4 sm:ml-8 mx-8 sm:mt-10 relative">
        {back && (
          <div className="text-xs underline absolute -top-5">
            {back === 'search' && (
              <Link href="/?focus=true&q=" className="flex items-center gap-1 mb-4 max-w-fit">
                <ArrowLeft className="h-4 w-4" />
                Back to search
              </Link>
            )}
            {back && typeof back !== 'string' && (
              // @ts-expect-error TODO can this strong typing be used in custom components?
              <Link href={back.to} className="flex items-center gap-1 mb-4 max-w-fit">
                <ArrowLeft className="h-4 w-4" />
                {back.text}
              </Link>
            )}
          </div>
        )}
        <h1 className="text-xl">{title}</h1>
        <div className="absolute -top-4 -right-5">{actions}</div>
      </div>
      <div className={cn('max-w-prose p-2 sm:p-8 sm:pt-0', className)}>{children}</div>
    </div>
  );
}
