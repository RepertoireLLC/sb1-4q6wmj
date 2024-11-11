import { useRef } from 'react';
import { Text, Billboard } from '@react-three/drei';
import { InfoIcon } from './icons/InfoIcon';
import { useModalStore } from '../store/modalStore';
import * as THREE from 'three';

export function AboutNode() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { setAboutVisible } = useModalStore((state) => ({
    setAboutVisible: state.setAboutVisible
  }));

  const handleClick = (e: THREE.Event) => {
    e.stopPropagation();
    setAboutVisible(true);
  };

  return (
    <group position={[0, 4, 0]}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshPhongMaterial
          color="#60a5fa"
          emissive="#3b82f6"
          emissiveIntensity={0.5}
        />
      </mesh>

      <Billboard>
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.2}
          color="#60a5fa"
          anchorX="center"
          anchorY="middle"
        >
          About
        </Text>
        <InfoIcon position={[0.4, 0.5, 0]} />
      </Billboard>
    </group>
  );
}