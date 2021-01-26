import { Circle as KonvaCircle } from 'konva/types/shapes/Circle';
import { useEffect, useRef } from 'react';
import { Circle } from 'react-konva';
import laserSound from '../assets/laser.mp3';

type BulletProps = {
  from: {
    x: number;
    y: number;
  };
  to: {
    x: number;
    y: number;
  };
};

function Bullet({ from, to }: BulletProps) {
  const circleRef = useRef<KonvaCircle>(null);

  useEffect(() => {
    const audio = new Audio(laserSound);
    audio.volume = 0.3;
    audio.play();
  }, []);

  useEffect(() => {
    const circleEl = circleRef.current;
    if (!circleEl) return;

    circleEl.to({
      x: to.x,
      y: to.y,
      scaleX: 5,
      scaleY: 5,
      duration: 0.25,
    });
  }, [to.x, to.y]);

  return (
    <Circle ref={circleRef} x={from.x} y={from.y} radius={2.5} fill="yellow" />
  );
}

export default Bullet;
