import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { Vector3 } from 'three';
import * as THREE from 'three';
import { useGitlantisStore } from '../../hooks/useGitlantisStore';
import { getAssetConfig } from '../../data/assets';
import { GLTFAsset } from './GLTFAsset';

const KEYS = {
  forward: 'KeyW',
  backward: 'KeyS',
  left: 'KeyA',
  right: 'KeyD',
};

export const Boat = () => {
  const boatRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();
  const {
    boatPosition,
    boatRotation,
    setBoatPosition,
    setBoatRotation,
    cameraFollow,
    setIsNavigating,
    setHasMoved,
  } = useGitlantisStore();
  

  const boatConfig = getAssetConfig('boat');
  const [, getKeys] = useKeyboardControls();

  const speed = 0.1;
  const rotationSpeed = 0.02;

  // Camera control state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState<{ x: number; y: number } | null>(null);

  const zoomRef = useRef(30); // distance from boat
  const orbitYaw = useRef(0); // horizontal rotation
  const orbitPitch = useRef(Math.PI / 8); // vertical rotation slightly above

  // Fullscreen listener
  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Mouse + scroll control
  useEffect(() => {
    if (!isFullscreen) return;

    const handleWheel = (e: WheelEvent) => {
      zoomRef.current = Math.min(Math.max(zoomRef.current + e.deltaY * 0.01, 5), 30);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2) {
        setIsDragging(true);
        setLastMouse({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && lastMouse) {
        const dx = e.clientX - lastMouse.x;
        const dy = e.clientY - lastMouse.y;

        orbitYaw.current -= dx * 0.002;
        orbitPitch.current -= dy * 0.002;

        const minPitch = 0;
        const maxPitch = Math.PI / 3;
        orbitPitch.current = Math.max(minPitch, Math.min(maxPitch, orbitPitch.current));

        setLastMouse({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 2) setIsDragging(false);
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    gl.domElement.addEventListener('wheel', handleWheel);
    gl.domElement.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      gl.domElement.removeEventListener('wheel', handleWheel);
      gl.domElement.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isFullscreen, isDragging, lastMouse, gl]);

  useFrame(() => {
    if (!boatRef.current) return;

    const keys = getKeys();
    let moved = false;

    // --- Boat rotation ---
    if (keys.left) {
      boatRef.current.rotation.y += rotationSpeed;
      moved = true;
    }
    if (keys.right) {
      boatRef.current.rotation.y -= rotationSpeed;
      moved = true;
    }

    // --- Boat movement ---
    const direction = new Vector3();
    if (keys.forward) {
      direction.z = speed;
      moved = true;
    }
    if (keys.backward) {
      direction.z = -speed;
      moved = true;
    }

    if (moved) {
      // mark that the boat has started moving
      setHasMoved(true);
      setIsNavigating(true);

      direction.applyEuler(boatRef.current.rotation);
      boatRef.current.position.add(direction);
    } else {
      setIsNavigating(false);
    }

    // Update store
    setBoatPosition([
      boatRef.current.position.x,
      boatRef.current.position.y,
      boatRef.current.position.z,
    ]);
    setBoatRotation([
      boatRef.current.rotation.x,
      boatRef.current.rotation.y,
      boatRef.current.rotation.z,
    ]);

    // --- Gentle bobbing ---
    const time = performance.now() * 0.001;
    boatRef.current.position.y = Math.sin(time * 2) * 0.1;

    // --- Camera follow with orbit ---
    if (cameraFollow) {
      const boatPos = boatRef.current.position;
      const radius = zoomRef.current;

      if (moved) {
        orbitYaw.current = boatRef.current.rotation.y + Math.PI;
        orbitPitch.current = Math.PI / 8;
      }

      const offset = new Vector3(
        Math.sin(orbitYaw.current) * radius * Math.cos(orbitPitch.current),
        radius * Math.sin(orbitPitch.current) + 2,
        Math.cos(orbitYaw.current) * radius * Math.cos(orbitPitch.current)
      );

      const idealCameraPos = boatPos.clone().add(offset);
      camera.position.lerp(idealCameraPos, 0.05);
      camera.lookAt(boatPos);
    }
  });

  useEffect(() => {
    if (boatRef.current) {
      boatRef.current.position.set(...boatPosition);
      boatRef.current.rotation.set(...boatRotation);
    }
  }, []);

  return (
    <group ref={boatRef} castShadow>
      <GLTFAsset config={boatConfig!}>
        {!boatConfig?.path && (
          <>
            {/* Boat Hull */}
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[2, 0.5, 4]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* Mast */}
            <mesh position={[0, 2, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.1, 4]} />
              <meshStandardMaterial color="#654321" />
            </mesh>
            {/* Sail */}
            <mesh position={[1, 2, 0]} castShadow>
              <planeGeometry args={[2, 3]} />
              <meshStandardMaterial color="#ffffff" side={2} />
            </mesh>
          </>
        )}
      </GLTFAsset>
    </group>
  );
};
