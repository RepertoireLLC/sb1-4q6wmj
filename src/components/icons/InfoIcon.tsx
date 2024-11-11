import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface InfoIconProps {
  position: [number, number, number];
}

export function InfoIcon({ position }: InfoIconProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshPhongMaterial
        color="#60a5fa"
        emissive="#3b82f6"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}