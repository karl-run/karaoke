import React, { ReactElement } from 'react';

function Page(): ReactElement {
  return (
    <div className="container">
      <div className="p-2 xs:p-4 sm:p-8 flex flex-col">
        <h1 className="text-xl mb-2">My groups</h1>
      </div>
    </div>
  );
}

export default Page;
