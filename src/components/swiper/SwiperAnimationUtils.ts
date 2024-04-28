export const to = (i: number) => ({
  x: 0,
  y: 0,
  scale: 1,
  delay: i * 69,
});

export const from = (i: number, max: number) => ({ x: i % 2 === 0 ? -max : max, scale: 1.2, y: 0 });

export const scaleFn = (s: number) => `scale(${s})`;

/** Should move at least 10% of the screen to be considered a swipe */
export function hasMovedEnough(mx: number, width: number) {
  return Math.abs(mx) > width * 0.1;
}
