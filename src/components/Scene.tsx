import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Sphere } from './Sphere';
import { UserNodes } from './UserNodes';
import { AboutNode } from './AboutNode';
import { Suspense } from 'react';
import { useThemeStore } from '../store/themeStore';
import { useModalStore } from '../store/modalStore';
import { useChatStore } from '../store/chatStore';
import { useDropdownStore } from '../store/dropdownStore';

export function Scene() {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const setProfileUserId = useModalStore((state) => state.setProfileUserId);
  const setActiveChat = useChatStore((state) => state.setActiveChat);
  const closeAllDropdowns = useDropdownStore((state) => state.closeAll);

  const getFogColor = () => {
    switch (currentTheme) {
      case 'classicElegance':
        return '#1a365d';
      case 'modernTech':
        return '#1a1a1a';
      case 'executiveSuite':
        return '#000000';
      case 'auroraNetwork':
        return '#2d1b4e';
      case 'minimalistZen':
        return '#f8fafc';
      case 'globalConnect':
        return '#2d3b2d';
      case 'futuristicMatrix':
        return '#001100';
      case 'corporateHorizon':
        return '#1e3a5f';
      case 'neoVintage':
        return '#2b1810';
      case 'sleekMonochrome':
        return '#121212';
      default:
        return '#1a365d';
    }
  };

  const handleSphereClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setProfileUserId(null);
      setActiveChat(null);
      closeAllDropdowns();
    }
  };

  return (
    <div className="w-full h-full" onClick={handleSphereClick}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={[getFogColor()]} />
        <fog attach="fog" args={[getFogColor(), 5, 20]} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Suspense fallback={null}>
          <Sphere />
          <UserNodes />
          <AboutNode />
        </Suspense>

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          minDistance={5}
          maxDistance={15}
        />
      </Canvas>
    </div>
  );
}