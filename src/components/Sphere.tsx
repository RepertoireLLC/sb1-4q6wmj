import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh, Color, MathUtils } from 'three';
import { useThemeStore } from '../store/themeStore';

const themeConfigs = {
  classicElegance: {
    sphereColor: '#3b82f6',
    wireframe: true,
    opacity: 0.15,
    emissive: '#1d4ed8',
    rotationSpeed: 0.001,
    segments: 64,
    pulseIntensity: 0.1,
    pulseSpeed: 1,
    scale: 1,
    particleCount: 100,
    particleSize: 0.02,
    particleColor: '#60a5fa',
    wireframeOpacity: 1
  },
  modernTech: {
    sphereColor: '#00aaff',
    wireframe: true,
    opacity: 0.2,
    emissive: '#0088cc',
    rotationSpeed: 0.002,
    segments: 48,
    pulseIntensity: 0.3,
    pulseSpeed: 2,
    scale: 1.1,
    particleCount: 150,
    particleSize: 0.015,
    particleColor: '#38bdf8',
    wireframeOpacity: 0.8
  },
  executiveSuite: {
    sphereColor: '#ffd700',
    wireframe: true,
    opacity: 0.3,
    emissive: '#b8860b',
    rotationSpeed: 0.001,
    segments: 96,
    pulseIntensity: 0.2,
    pulseSpeed: 0.5,
    scale: 1.05,
    particleCount: 80,
    particleSize: 0.025,
    particleColor: '#facc15',
    wireframeOpacity: 0.6
  },
  auroraNetwork: {
    sphereColor: '#9333ea',
    wireframe: true,
    opacity: 0.5,
    emissive: '#7e22ce',
    rotationSpeed: 0.0015,
    segments: 96,
    pulseIntensity: 0.2,
    pulseSpeed: 0.5,
    scale: 1.15,
    particleCount: 200,
    particleSize: 0.02,
    particleColor: '#a855f7',
    wireframeOpacity: 0.7
  },
  minimalistZen: {
    sphereColor: '#e2e8f0',
    wireframe: true,
    opacity: 0.1,
    emissive: '#94a3b8',
    rotationSpeed: 0.0005,
    segments: 32,
    pulseIntensity: 0.05,
    pulseSpeed: 0.5,
    scale: 0.95,
    particleCount: 50,
    particleSize: 0.01,
    particleColor: '#cbd5e1',
    wireframeOpacity: 0.4
  },
  globalConnect: {
    sphereColor: '#22c55e',
    wireframe: true,
    opacity: 0.3,
    emissive: '#16a34a',
    rotationSpeed: 0.001,
    segments: 64,
    pulseIntensity: 0.15,
    pulseSpeed: 1,
    scale: 1.1,
    particleCount: 120,
    particleSize: 0.02,
    particleColor: '#4ade80',
    wireframeOpacity: 0.9
  },
  futuristicMatrix: {
    sphereColor: '#22c55e',
    wireframe: true,
    opacity: 0.3,
    emissive: '#16a34a',
    rotationSpeed: 0.003,
    segments: 32,
    pulseIntensity: 0.4,
    pulseSpeed: 3,
    scale: 1.2,
    particleCount: 300,
    particleSize: 0.015,
    particleColor: '#86efac',
    wireframeOpacity: 1
  },
  corporateHorizon: {
    sphereColor: '#1e40af',
    wireframe: true,
    opacity: 0.2,
    emissive: '#1e3a8a',
    rotationSpeed: 0.001,
    segments: 48,
    pulseIntensity: 0.2,
    pulseSpeed: 1,
    scale: 1.05,
    particleCount: 100,
    particleSize: 0.02,
    particleColor: '#3b82f6',
    wireframeOpacity: 0.8
  },
  neoVintage: {
    sphereColor: '#b45309',
    wireframe: true,
    opacity: 0.4,
    emissive: '#92400e',
    rotationSpeed: 0.001,
    segments: 48,
    pulseIntensity: 0.1,
    pulseSpeed: 0.5,
    scale: 1,
    particleCount: 70,
    particleSize: 0.025,
    particleColor: '#f59e0b',
    wireframeOpacity: 0.7
  },
  sleekMonochrome: {
    sphereColor: '#e5e5e5',
    wireframe: true,
    opacity: 0.1,
    emissive: '#a3a3a3',
    rotationSpeed: 0.001,
    segments: 32,
    pulseIntensity: 0.1,
    pulseSpeed: 1,
    scale: 0.98,
    particleCount: 90,
    particleSize: 0.015,
    particleColor: '#d4d4d4',
    wireframeOpacity: 0.5
  },
};

export function Sphere() {
  const sphereRef = useRef<Mesh>(null);
  const particlesRef = useRef<Mesh>(null);
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const config = themeConfigs[currentTheme];

  useFrame(({ clock }) => {
    if (sphereRef.current && config) {
      const time = clock.getElapsedTime();
      
      // Base rotation
      sphereRef.current.rotation.y += config.rotationSpeed;
      
      // Theme-specific animations
      switch (currentTheme) {
        case 'modernTech':
          sphereRef.current.material.emissiveIntensity = 
            0.5 + Math.sin(time * config.pulseSpeed) * config.pulseIntensity;
          sphereRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
          if (particlesRef.current) {
            particlesRef.current.rotation.y = time * 0.1;
          }
          break;
          
        case 'auroraNetwork':
          sphereRef.current.rotation.z = Math.sin(time * 0.3) * 0.2;
          sphereRef.current.material.emissiveIntensity = 
            0.3 + Math.sin(time * 0.5) * 0.2;
          if (particlesRef.current) {
            particlesRef.current.rotation.x = time * 0.2;
          }
          break;
          
        case 'globalConnect':
          if (particlesRef.current) {
            particlesRef.current.rotation.y = -time * 0.15;
            particlesRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
          }
          break;
          
        case 'neoVintage':
          sphereRef.current.material.emissiveIntensity = 
            0.3 + Math.sin(time * 0.8) * 0.15;
          break;
          
        default:
          sphereRef.current.scale.setScalar(
            config.scale * (1 + Math.sin(time * config.pulseSpeed) * 0.03)
          );
      }

      // Smooth color transitions
      const targetColor = new Color(config.sphereColor);
      const currentColor = sphereRef.current.material.color;
      currentColor.lerp(targetColor, 0.1);
      
      const targetEmissive = new Color(config.emissive);
      const currentEmissive = sphereRef.current.material.emissive;
      currentEmissive.lerp(targetEmissive, 0.1);
    }
  });

  if (!config) return null;

  return (
    <group>
      {/* Main sphere with wireframe */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[3 * config.scale, config.segments, config.segments]} />
        <meshPhongMaterial
          color={new Color(config.sphereColor)}
          wireframe={true}
          transparent
          opacity={config.wireframeOpacity}
          emissive={new Color(config.emissive)}
          emissiveIntensity={0.3}
          wireframeLinewidth={2}
        />
      </mesh>
      
      {/* Inner sphere for solid effect */}
      <mesh>
        <sphereGeometry args={[2.98 * config.scale, config.segments, config.segments]} />
        <meshPhongMaterial
          color={new Color(config.sphereColor)}
          transparent
          opacity={config.opacity}
          emissive={new Color(config.emissive)}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Particle system for enhanced visual effects */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={config.particleCount}
            array={new Float32Array(config.particleCount * 3).map(() => 
              (Math.random() - 0.5) * 8
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={config.particleSize}
          color={config.particleColor}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  );
}