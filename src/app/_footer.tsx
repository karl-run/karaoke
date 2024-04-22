import React, { ReactElement } from 'react';
import Link from 'next/link';

function Footer(): ReactElement {
  return (
    <div className="border-t-2 p-4 text-sm grid gap-6 md:gap-3 grid-cols-1 md:grid-cols-3 pb-24 sm:pb-4">
      <div className="max-w-prose">
        <div className="font-semibold">About</div>
        Karaoke Match is an open source project by Karl J. O. The source code is available on{' '}
        <a className="underline" href="https://github.com/karl-run/karaoke" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
      <div>
        <div className="font-semibold">Privacy policy</div>
        You can find the privacy policy on the{' '}
        <Link className="underline" href="/privacy">
          Privacy page
        </Link>
        .
      </div>
      <div>
        <div className="font-semibold">Contact</div>
        <p>
          If you find any bugs or issues, the prefered way to contact me is through{' '}
          <a className="underline" href="https://github.com/karl-run/karaoke/issues" target="_blank" rel="noreferrer">
            GitHub issues
          </a>
          .
        </p>
        <p className="mt-2">Alternatively, you can reach out at k@rl.run.</p>
      </div>
    </div>
  );
}

export default Footer;
