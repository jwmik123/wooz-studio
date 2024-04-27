import React from 'react';
import {Studio} from './StudioOld';
import {WoozStudio} from './world/Studio';
import {Steam} from './world/Steam';
import {Center, OrbitControls, Sky} from '@react-three/drei';

function Experience({onHandleChange}) {
  return (
    <>
      <Center>
        {/* <Studio onHandleChange={onHandleChange} /> */}
        <WoozStudio />
        <Steam />
      </Center>

      <ambientLight intensity={0.5} />
      <OrbitControls />
      <Sky
        distance={1000}
        inclination={0.6} // Adjusted for slightly higher sun
        azimuth={0.1} // Adjusted to move the sun more towards the top left
        sunPosition={[-2, 1, 2]}
      />
    </>
  );
}
export default Experience;
