import { useImmerState } from '@shrugsy/use-immer-state';
import { Vector2d } from 'konva/types/types';
import { useEffect, useRef } from 'react';
import { Circle, Rect } from 'react-konva';
import { v4 as uuidV4 } from 'uuid';
import useSetSafeTimeout from 'use-set-safe-timeout';
import { calcAngle } from './helpers';
import Bullet from './Bullet';

type GunProps = {
  basePos: Vector2d;
  cursorPos: Vector2d;
  clickedPos: Vector2d | null;
};

type BulletsState = {
  id: string;
  from: {
    x: number;
    y: number;
  };
  to: {
    x: number;
    y: number;
  }
}[];

const width = 5;
const height = 50;

function Gun({
  basePos, cursorPos, clickedPos,
}: GunProps) {
  const setSafeTimeout = useSetSafeTimeout();
  const [bullets, setBullets] = useImmerState<BulletsState>([]);
  const gunTipPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!clickedPos) return;

    // add a bullet when we receive a 'click'
    const bulletId = uuidV4();
    // const from = { x: 50, y: 50 };
    const from = gunTipPosRef.current;
    const to = { x: clickedPos.x, y: clickedPos.y };
    setBullets((draft) => {
      draft.push({ id: bulletId, from, to });
    });

    setSafeTimeout(() => {
      // remove the bullet after a set time
      setBullets((draft) => {
        const bulletIdx = draft.findIndex((bullet) => bullet.id === bulletId);
        if (bulletIdx !== -1) {
          draft.splice(bulletIdx, 1);
        }
      });
    }, 1000);
  }, [clickedPos, setBullets, setSafeTimeout]);

  const rawAngle = calcAngle(basePos, cursorPos);
  const gunAngle = rawAngle + 90;

  // calculate gun tip position
  const gunTipOffsetY = height * Math.sin(-degToRad(rawAngle));
  const gunTipOffsetX = height * Math.cos(-degToRad(rawAngle));
  gunTipPosRef.current = { x: basePos.x + gunTipOffsetX, y: basePos.y - gunTipOffsetY };

  return (
    <>
      <Rect
        x={basePos.x}
        y={basePos.y}
        width={width}
        height={height}
        fill="green"
        rotation={gunAngle}
        offset={{ x: width / 2, y: height }}
      />
      <Circle x={basePos.x + gunTipOffsetX} y={basePos.y - gunTipOffsetY} radius={2.5} fill="red" />
      {bullets.map((bullet) => <Bullet key={bullet.id} from={bullet.from} to={bullet.to} />)}
    </>
  );
}

export default Gun;

/**
 * converts an angle from degrees to radians
 * @param degrees angle in degrees
 */
function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
