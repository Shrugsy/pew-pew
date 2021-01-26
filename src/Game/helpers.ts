import { Vector2d } from 'konva/types/types';

/**
 * Calculate angle between two points in degrees
 * @param p1 Point 1
 * @param p2 Point 2
 */
export function calcAngle(p1: Vector2d, p2: Vector2d) {
  const angleDeg = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
  return angleDeg;
}
