export const from = (i: number, max: number) => ({
  x: i % 2 === 0 ? -max : max,
  y: 0,
  rot: 0,
  scale: 0.6,
});

export const trans = (rotate: number, scale: number) => `rotateY(${rotate}deg) rotateZ(${rotate}deg) scale(${scale})`;

/** Should move at least 10% of the screen to be considered a swipe */
export function hasMovedEnough(mx: number, width: number) {
  return Math.abs(mx) > width * 0.1;
}
