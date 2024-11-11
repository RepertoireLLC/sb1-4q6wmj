import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';
import { useModalStore } from '../store/modalStore';
import { useSocketStore } from '../store/socketStore';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';

export function UserNodes() {
  const users = useUserStore((state) => state.users);
  const currentUser = useAuthStore((state) => state.user);
  const { profileUserId, setProfileUserId } = useModalStore();
  const updatePosition = useSocketStore((state) => state.updatePosition);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
      
      // Update current user's position
      if (currentUser) {
        const userNode = Array.from(groupRef.current.children).find(
          child => child.userData?.userId === currentUser.id
        );
        if (userNode) {
          const position: [number, number, number] = [
            userNode.position.x,
            userNode.position.y,
            userNode.position.z
          ];
          updatePosition(position);
        }
      }
    }
  });

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.PI * 0.1;
    }
  }, []);

  // Filter out users without names and ensure online status
  const onlineUsers = users.filter(user => user.online && user.name);

  const handleNodeClick = (e: THREE.Event, userId: string) => {
    e.stopPropagation();
    setProfileUserId(profileUserId === userId ? null : userId);
  };

  return (
    <group ref={groupRef}>
      {onlineUsers.map((user, index) => {
        if (!user || !user.name) return null;

        const radius = 3;
        const goldenRatio = (1 + Math.sqrt(5)) / 2;
        const i = index + 1;
        const phi = Math.acos(1 - (2 * i) / onlineUsers.length);
        const theta = 2 * Math.PI * i / goldenRatio;

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        const position = user.position || [x, y, z];
        const displayName = user.name || 'Anonymous';
        const isCurrentUser = currentUser?.id === user.id;
        const nodeRadius = 0.2;

        return (
          <group 
            key={user.id} 
            position={position}
            userData={{ userId: user.id }}
          >
            <mesh
              onClick={(e) => handleNodeClick(e, user.id)}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'default';
              }}
            >
              <sphereGeometry args={[nodeRadius, 32, 32]} />
              <meshStandardMaterial
                color={user.color || '#808080'}
                emissive={user.color || '#808080'}
                emissiveIntensity={isCurrentUser ? 0.8 : 0.5}
              />
            </mesh>
            <Billboard>
              <Text
                position={[0, nodeRadius * 2, 0]}
                fontSize={0.2}
                color={user.color || '#808080'}
                anchorX="center"
                anchorY="middle"
              >
                {displayName}
              </Text>
              <mesh position={[displayName.length * 0.05 + 0.2, nodeRadius * 2, 0]}>
                <sphereGeometry args={[0.04, 16, 16]} />
                <meshBasicMaterial color="#10b981" />
                <pointLight
                  color="#10b981"
                  intensity={0.5}
                  distance={0.5}
                />
              </mesh>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
}