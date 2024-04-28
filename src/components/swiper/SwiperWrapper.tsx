import React, { PropsWithChildren, ReactElement } from 'react';

function SwiperWrapper({ children }: PropsWithChildren): ReactElement {
  return <div className="max-w-full min-[480px]:max-w-[520px] overflow-hidden">{children}</div>;
}

export default SwiperWrapper;
