/**
 * @param level - an integer number representing the needed xp to move on
*/
export function xpNeededFor(level: number): number {
  const base = 100;
  const growth = 25;
  return base + growth * (level - 1);
}
