import { css } from '@emotion/css';
import { Stage as KonvaStage } from 'konva/types/Stage';
import { Vector2d } from 'konva/types/types';
import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { Layer, Stage } from 'react-konva';
import Gun from './Gun';
import StaticAssets from './StaticAssets';

const classes = {
  game: css`
    border: 8px solid red;
    width: 500px;
    margin: 0 auto;
  `,
};

function Game() {
  const stageRef = useRef<KonvaStage>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [clickedPos, setClickedPos] = useState<Vector2d | null>(null);
  const [isMouseHeld, setIsMouseHeld] = useState(false);

  useEffect(() => {
    let animFrameId: number;
    function onAnimationFrame() {
      if (stageRef.current) {
        const pos = stageRef.current.getPointerPosition();
        if (pos) {
          // GAME LOOP LOGIC GOES HERE
          // TODO: any logic in here that needs to be frame limited needs care taken
          // should be based on 'time passed' rather than strictly 'per frame'
          setCursorPos(pos);
        }
      }
      animFrameId = requestAnimationFrame(onAnimationFrame);
    }

    animFrameId = requestAnimationFrame(onAnimationFrame);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  const measureClickPos = useCallback(() => {
    if (!stageRef.current) return;
    const pos = stageRef.current.getPointerPosition();
    if (!pos) return;
    setClickedPos(pos);
  }, []);

  /**
   * while mouse is held, measure 'click' positions at an interval
   */
  useEffect(() => {
    if (!isMouseHeld) return;
    measureClickPos();
    const intervalId = setInterval(() => {
      measureClickPos();
    }, 150);

    return () => clearInterval(intervalId);
  }, [isMouseHeld, measureClickPos]);

  return (
    <div>
      <Stage
        ref={stageRef}
        width={500}
        height={500}
        className={classes.game}
        onClick={measureClickPos}
        onMouseDown={() => setIsMouseHeld(true)}
        onMouseUp={() => setIsMouseHeld(false)}
        onMouseLeave={() => setIsMouseHeld(false)}
      >
        <Layer>
          <StaticAssets />
          <Gun basePos={{ x: 75, y: 475 }} cursorPos={cursorPos} clickedPos={clickedPos} />
          <Gun basePos={{ x: 425, y: 475 }} cursorPos={cursorPos} clickedPos={clickedPos} />
        </Layer>
      </Stage>
    </div>
  );
}

export default Game;
