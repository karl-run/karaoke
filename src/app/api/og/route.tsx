/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */

import { ImageResponse } from 'next/og';
import { CSSProperties } from 'react';

export const runtime = 'edge';

const canvasWidth = 1200;
const canvasHeight = 630;
const imgWidth = 128;
const imgHeight = 128;

export async function GET() {
  const cols = Math.floor(canvasWidth / imgWidth); // Max columns that fit entirely
  const rows = Math.floor(canvasHeight / imgHeight); // Max rows that fit entirely
  const positions: { x: number; y: number }[] = [];

  const generateImageStyle = (): CSSProperties => {
    let x: number, y: number;
    do {
      const baseCol = Math.floor(Math.random() * cols);
      const baseRow = Math.floor(Math.random() * rows);
      const offsetX = Math.floor(Math.random() * (imgWidth / 4)); // Offset up to 1/4th of the width
      const offsetY = Math.floor(Math.random() * (imgHeight / 4)); // Offset up to 1/4th of the height

      x = baseCol * imgWidth + offsetX;
      y = baseRow * imgHeight + offsetY;
    } while (positions.some((pos) => Math.abs(pos.x - x) < imgWidth && Math.abs(pos.y - y) < imgHeight));

    positions.push({ x, y });

    const rotation = Math.floor(Math.random() * 360); // Random rotation

    return {
      position: 'absolute',
      opacity: 0.1,
      height: imgHeight,
      width: imgWidth,
      top: `${y}px`,
      left: `${x}px`,
      transform: `rotate(${rotation}deg)`,
    };
  };

  const imageData = await fetch(new URL('./_logo.png', import.meta.url)).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'black',
          position: 'relative',
        }}
      >
        {new Array(20).fill(null).map((_, i) => (
          <img key={i} style={generateImageStyle()} height={128} width={128} src={imageData as unknown as string} />
        ))}
        <div tw="flex text-gray-100">
          <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-start gap-8 p-8">
            <img tw="grow-0 mr-8 border-4 rounded-xl -p-2" height={169} width={169} src={imageData as unknown as string} />
            <h2 tw="flex flex-col font-bold tracking-tight text-left grow">
              <span tw="text-4xl sm:text-6xl">Karaoke Match!</span>
              <span tw="text-3xl max-w-2/3">The best way to find karaoke songs that you and your friends love {`❤️`}</span>
            </h2>
          </div>
        </div>
        <div tw="absolute bottom-6 right-6 text-gray-100 max-w-lg text-xl">
          Start building your list today, invite your friends and find your hits over at https://karaoke.karl.run
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
