import React, { PropsWithChildren, ReactElement, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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
    <div className="container">
      {title && (
        <div className="mt-6 my-4 ml-4 sm:ml-8 sm:mt-10 relative">
          {back && (
            <div className="text-xs underline absolute -top-5">
              {back === 'search' && <BackToSearch />}
              {back && typeof back !== 'string' && <BackLink href={back.to} text={back.text} />}
            </div>
          )}

          <h1 className="text-xl">{title}</h1>
          <div className="absolute -top-4 right-0">{actions}</div>
        </div>
      )}
      {children}
    </div>
  );
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
    <div className="container">
      <div className="my-4 mx-8 mt-10 relative">
        {back && (
          <div className="text-xs underline absolute -top-5">
            {back === 'search' && (
              <Link href="/?focus=true&q=" className="flex items-center gap-1 mb-4 max-w-fit">
                <ArrowLeft className="h-4 w-4" />
                Back to search
              </Link>
            )}
            {back && typeof back !== 'string' && (
              <Link href={back.to} className="flex items-center gap-1 mb-4 max-w-fit">
                <ArrowLeft className="h-4 w-4" />
                {back.text}
              </Link>
            )}
          </div>
        )}
        <h1 className="text-xl">{title}</h1>
        <div className="absolute -top-4 right-0">{actions}</div>
      </div>
      <div className={cn('max-w-prose p-8 pt-4', className)}>{children}</div>
    </div>
  );
}
