import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGitlantisStore } from '../../hooks/useGitlantisStore';
import { getAssetConfig } from '../../data/assets';
import { GLTFAsset } from './GLTFAsset';

interface SkillBuoysProps {
  skills: any[];
  baseHeight?: number; // lift/lower all buoys
  scale?: number;      // scale all buoys
  spawnArea?: { x: [number, number]; z: [number, number] };
}

const Buoy = ({
  skill,
  position,
  scale = 1
}: {
  skill: any;
  position: [number, number, number];
  scale?: number;
}) => {
  const buoyRef = useRef<THREE.Group>(null);
  const nameTextRef = useRef<THREE.Mesh>(null);
  const levelTextRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { setHoveredObject, boatPosition } = useGitlantisStore();

  const buoyConfig = getAssetConfig('buoy');

  useFrame((state) => {
    if (buoyRef.current) {
      const time = state.clock.getElapsedTime();
      const baseY = position[1];
      buoyRef.current.position.y = baseY + Math.sin(time * 1.5 + position[0]) * 0.3;
    }

    const boatPos = new THREE.Vector3(...boatPosition);
    nameTextRef.current?.lookAt(boatPos);
    levelTextRef.current?.lookAt(boatPos);
  });

  const getColorByCategory = (category: string) => {
    const colors = {
      'Frontend': '#61dafb',
      'Backend': '#68a063',
      'Language': '#f7df1e',
      'Framework': '#ff6b6b',
      'Styling': '#06b6d4',
      'Database': '#336791'
    };
    return colors[category as keyof typeof colors] || '#888';
  };

  return (
    <group
      ref={buoyRef}
      position={position}
      scale={[scale, scale, scale]}
      onPointerEnter={() => {
        setHovered(true);
        setHoveredObject(skill.name);
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={() => {
        setHovered(false);
        setHoveredObject(null);
        document.body.style.cursor = 'auto';
      }}
    >
      <GLTFAsset config={buoyConfig!}>
        {!buoyConfig?.path && (
          <>
            <mesh position={[0, 0, 0]} castShadow>
              <sphereGeometry args={[1]} />
              <meshStandardMaterial color={hovered ? '#ffffff' : getColorByCategory(skill.category)} />
            </mesh>
            <mesh position={[0, 1.5, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.1, 2]} />
              <meshStandardMaterial color="#654321" />
            </mesh>
            <mesh position={[0, 1.5 + (skill.level / 100), 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, (skill.level / 100) * 2]} />
              <meshStandardMaterial color={getColorByCategory(skill.category)} />
            </mesh>
          </>
        )}
      </GLTFAsset>

      <Text ref={nameTextRef} position={[0, 5, 0]} fontSize={2} color={hovered ? getColorByCategory(skill.category) : "#333"} anchorX="center" anchorY="middle">
        {skill.name}
      </Text>
      <Text ref={levelTextRef} position={[0, 3.3, 0]} fontSize={2} color="#666" anchorX="center" anchorY="middle">
        {skill.level}%
      </Text>
    </group>
  );
};

export const SkillBuoys = ({
  skills,
  baseHeight = 3,
  scale = 0.3,
  spawnArea = { x: [-80, 80], z: [-80, 80] }
}: SkillBuoysProps) => {
  const { setSkills } = useGitlantisStore();
  const buoyPositionsRef = useRef<[number, number, number][]>([]);

  // Generate random positions only on first load
  if (buoyPositionsRef.current.length === 0) {
    buoyPositionsRef.current = skills.map(() => {
      const x = Math.random() * (spawnArea.x[1] - spawnArea.x[0]) + spawnArea.x[0];
      const z = Math.random() * (spawnArea.z[1] - spawnArea.z[0]) + spawnArea.z[0];
      return [x, baseHeight, z] as [number, number, number];
    });

    // Register positions in the store for the minimap
    setSkills(skills.map((s, i) => ({
      ...s,
      position: buoyPositionsRef.current[i]
    })));
  }

  return (
    <group>
      {skills.map((skill, index) => (
        <Buoy
          key={skill.name}
          skill={skill}
          position={buoyPositionsRef.current[index]}
          scale={scale}
        />
      ))}
    </group>
  );
};
