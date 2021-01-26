import { Rect } from 'react-konva';

function StaticAssets() {
  return (
    <>
      {/* background */}
      <Rect x={0} y={0} width={500} height={500} fill="black" />
      {/* turret 1 */}
      <Rect x={50} y={450} width={50} height={50} fill="blue" />
      {/* turret 2 */}
      <Rect x={400} y={450} width={50} height={50} fill="blue" />
    </>
  );
}

export default StaticAssets;
