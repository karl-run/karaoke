import React, { ReactElement } from 'react';

import sheet from './sheet.png';

type Props = {
  iconIndex: number;
};

const ROW_PADDING = 10.7;
const COL_PADDING = 7.8;
const ROW_SIZE = 48.2;
const COL_SIZE = 48;
const ROWS = 6;

function GroupAvatar({ iconIndex }: Props): ReactElement {
  const rowIndex = iconIndex % ROWS;
  const colIndex = Math.floor(iconIndex / ROWS);

  return (
    <div
      className="min-h-12 min-w-12 max-h-12 max-w-12 rounded-xl border"
      style={{
        backgroundImage: `url(${sheet.src})`,
        backgroundPosition: `${-10 - ROW_PADDING * rowIndex - rowIndex * ROW_SIZE}px ${-10 - COL_PADDING * colIndex - colIndex * COL_SIZE}px`,
        backgroundSize: '360px 346px',
      }}
      aria-hidden
    />
  );
}

export default GroupAvatar;
