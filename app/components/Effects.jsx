import {
  EffectComposer,
  Outline,
  TiltShift2,
  N8AO,
} from '@react-three/postprocessing';

import {useThree, useFrame} from '@react-three/fiber';
import {easing} from 'maath';

function Effects() {
  const {size} = useThree();
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [state.pointer.x, state.pointer.y / 2, 5],
      0.3,
      delta,
    );
    state.camera.lookAt(
      state.camera.position.x * 0.01,
      state.camera.position.y * 0.01,
      -4,
    );
  });
  return (
    <EffectComposer
      stencilBuffer
      disableNormalPass
      autoClear={false}
      multisampling={4}
      antialias
    >
      <N8AO
        halfRes
        aoSamples={5}
        aoRadius={0.1}
        distanceFalloff={0.75}
        intensity={1}
      />
      <Outline
        visibleEdgeColor="white"
        hiddenEdgeColor="white"
        blur
        width={size.width * 2}
        edgeStrength={10}
      />
      {/* <TiltShift2 samples={3} blur={0.05} /> */}
    </EffectComposer>
  );
}

export default Effects;
