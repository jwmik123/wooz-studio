import * as THREE from 'three';
import React, {useRef, useState} from 'react';
import {useGLTF} from '@react-three/drei';
import {ShaderMaterial, Uniform} from 'three';
import {useLoader} from '@react-three/fiber';
import {Selection, Select} from '@react-three/postprocessing';
import {useNavigate} from '@remix-run/react';

import Effects from './Effects';

import {vertex, fragment} from '../shaders/baked/studio-glsl';

export function Studio({onHandleChange, ...props}) {
  const {nodes} = useGLTF('/models/studio.glb');

  const navigate = useNavigate();
  const [handle, setHandle] = useState('hagd'); // Default handle or derived from URL

  const modelRef = useRef();
  const [hovered, setHovered] = useState(null);

  const bakedFinalTexture = useLoader(
    THREE.TextureLoader,
    '/baked/bakedFinal.jpg',
  );
  bakedFinalTexture.flipY = false;
  bakedFinalTexture.colorSpace = THREE.SRGBColorSpace;

  const modelMaterial = new ShaderMaterial({
    uniforms: {
      uBakedDayTexture: new Uniform(bakedFinalTexture),
    },
    vertexShader: vertex,
    fragmentShader: fragment,
  });

  function handleHagdClick() {
    const newHandle = 'have-a-great-day';
    onHandleChange(newHandle);
  }

  return (
    <>
      <group
        {...props}
        dispose={null}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={handleHagdClick}
      >
        <mesh
          ref={modelRef}
          geometry={nodes.building.geometry}
          material={modelMaterial}
          position={[0, 1.5, 0]}
        />
        <Shirt />
      </group>
    </>
  );

  function Shirt() {
    const shirtTexture = useLoader(
      THREE.TextureLoader,
      '/baked/bakedShirts.jpg',
    );
    shirtTexture.flipY = false;
    shirtTexture.colorSpace = THREE.SRGBColorSpace;
    const shirtMaterial = new THREE.MeshBasicMaterial({
      map: shirtTexture,
      side: THREE.DoubleSide,
    });
    const handlePointerOver = () => {
      setHovered(true);
      document.body.style.cursor = 'pointer';
    };
    const handlePointerOut = () => {
      setHovered(false);
      document.body.style.cursor = 'auto';
    };

    return (
      <>
        <Selection>
          <Select enabled={hovered}>
            <group
              onPointerOver={handlePointerOver}
              onPointerOut={handlePointerOut}
            >
              {['White', 'Green', 'Brown', 'Black', 'Blue'].map(
                (color, index) => (
                  <mesh
                    key={color}
                    geometry={nodes[`uv_longsleeve${color}`].geometry}
                    material={shirtMaterial}
                    position={[index * 0.2 - 0.4, -0.44, -1.485]} // Adjust positions as needed
                    rotation={[Math.PI / 2, 0, 1.5 + index * 0.1]} // Adjust rotations as needed
                  />
                ),
              )}
            </group>
          </Select>
          <Effects />
        </Selection>
      </>
    );
  }
}

useGLTF.preload('/models/studio/studio.glb');
