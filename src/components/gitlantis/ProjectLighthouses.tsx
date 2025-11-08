import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Text } from '@react-three/drei';
import { Box3, Vector3, DoubleSide } from 'three';
import { useGitlantisStore } from '../../hooks/useGitlantisStore';
import { getAssetConfig } from '../../data/assets';

interface LighthouseProps {
  project: any;
  position: [number, number, number];
  onSelect: (project: any) => void;
  desiredHeight: number;
  yOffset?: number;
}

export const Lighthouse = ({ project, position, onSelect, desiredHeight, yOffset = 0 }: LighthouseProps) => {
  const lighthouseRef = useRef<any>(null);
  const lightRef = useRef<any>(null);
  const textRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const { setHoveredObject, boatPosition } = useGitlantisStore();

  const assetConfig = getAssetConfig('lighthouse');
  const gltf = useGLTF(assetConfig?.path || '');

  const clonedScene = useMemo(() => {
    if (!gltf) return null;
    const sceneClone = gltf.scene.clone(true);
    const box = new Box3().setFromObject(sceneClone);
    const minY = box.min.y;

    sceneClone.traverse((child: any) => {
      if (child.isMesh) {
        child.position.y -= minY;
        child.castShadow = true;
        child.receiveShadow = true;

        if (Array.isArray(child.material)) {
          child.material.forEach((m) => {
            m.transparent = false;
            m.opacity = 1;
            m.side = DoubleSide;
          });
        } else {
          child.material.transparent = false;
          child.material.opacity = 1;
          child.material.side = DoubleSide;
        }
      }
    });

    const scaleArr = assetConfig?.scale || [1, 1, 1];
    sceneClone.scale.set(scaleArr[0], scaleArr[1], scaleArr[2]);

    return sceneClone;
  }, [gltf, assetConfig]);

  const modelHeight = clonedScene
    ? new Box3().setFromObject(clonedScene).getSize(new Vector3()).y
    : desiredHeight;

  useFrame(() => {
    if (lightRef.current) lightRef.current.rotation.y += 0.02;

    if (hovered && lighthouseRef.current) {
      lighthouseRef.current.position.y = position[1] + Math.sin(Date.now() * 0.002) * 0.2;
    }

    if (textRef.current && lighthouseRef.current && boatPosition) {
      const lighthousePos = lighthouseRef.current.position.clone();
      const boatPos = new Vector3(...boatPosition);
      const dirToBoat = new Vector3().subVectors(boatPos, lighthousePos);
      const maxRadius = 5;
      if (dirToBoat.length() > maxRadius) dirToBoat.setLength(maxRadius);
      const textYOffset = modelHeight * 0.6 + yOffset;
      textRef.current.position.copy(new Vector3(0, textYOffset, 0).add(dirToBoat));
      textRef.current.lookAt(boatPos);
    }
  });

  const handleClick = () => onSelect(project);

  return (
    <group
      ref={lighthouseRef}
      position={position}
      onPointerEnter={() => {
        setHovered(true);
        setHoveredObject(project.id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={() => {
        setHovered(false);
        setHoveredObject(null);
        document.body.style.cursor = 'auto';
      }}
      onClick={handleClick}
    >
      {clonedScene ? (
        <primitive object={clonedScene} rotation={assetConfig?.rotation || [0, 0, 0]} />
      ) : null}

      <group ref={lightRef} position={[0, modelHeight - 0.5, 0]}>
        <mesh position={[0, 0, 0.8]}>
          <boxGeometry args={[0.2, 0.5, 0.2]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffff00" emissiveIntensity={0.5} />
        </mesh>
      </group>

      <Text ref={textRef} fontSize={1.7} color={hovered ? '#ff6b6b' : '#fafafa'} anchorX="center" anchorY="middle">
        {project.title}
      </Text>

      {project.featured && (
        <mesh position={[0, modelHeight + 1, 0]}>
          <sphereGeometry args={[0.2]} />
          <meshStandardMaterial color="#ffd700" emissive="#ffa500" emissiveIntensity={0.3} />
        </mesh>
      )}
    </group>
  );
};

interface ProjectLighthousesProps {
  projects: any[];
  onProjectSelect: (project: any) => void;
  desiredHeight?: number;
  yOffset?: number;
  spawnArea?: { x: [number, number]; z: [number, number] }; 
}

export const ProjectLighthouses = ({
  projects,
  onProjectSelect,
  desiredHeight = 6,
  yOffset = 0,
  spawnArea = { x: [-80, 80], z: [-80, 80] }
}: ProjectLighthousesProps) => {
  const { setSelectedProject, setProjects } = useGitlantisStore();

  const handleSelect = (project: any) => {
    setSelectedProject(project);
    onProjectSelect(project);
  };

  // Generate positions only once and persist
  const positionsRef = useRef<[number, number, number][]>([]);
  if (positionsRef.current.length === 0) {
    positionsRef.current = projects.map(() => {
      const x = Math.random() * (spawnArea.x[1] - spawnArea.x[0]) + spawnArea.x[0];
      const z = Math.random() * (spawnArea.z[1] - spawnArea.z[0]) + spawnArea.z[0];
      return [x, 0, z];
    });

    // Register projects with positions in the store for minimap
    setProjects(projects.map((p, i) => ({
      ...p,
      position: positionsRef.current[i]
    })));
  }

  return (
    <group>
      {projects.map((project, idx) => (
        <Lighthouse
          key={project.id}
          project={project}
          position={positionsRef.current[idx]}
          onSelect={handleSelect}
          desiredHeight={desiredHeight}
          yOffset={yOffset}
        />
      ))}
    </group>
  );
};
