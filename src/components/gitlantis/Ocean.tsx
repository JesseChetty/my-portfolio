import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Ocean = () => {
  const oceanRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const waterMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
      color1: { value: new THREE.Color(0x006994) },
      color2: { value: new THREE.Color(0x0088cc) },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float time;

      // Layered sine noise function
      float noise(vec2 p, float freq, float amp, float speed) {
        return sin(p.x * freq + time * speed) * sin(p.y * freq + time * speed) * amp;
      }

      void main() {
        vUv = uv;
        vPosition = position;

        vec3 pos = position;

        // Combine multiple layers for realistic waves
        pos.z += noise(uv, 5.0, 0.2, 0.5);       // coarse
        pos.z += noise(uv, 15.0, 0.08, 1.2);     // medium
        pos.z += noise(uv, 30.0, 0.03, 1.5);     // fine
        pos.z += noise(uv + vec2(0.5), 50.0, 0.01, 2.0); // extra fine ripples

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float time;
      uniform vec3 color1;
      uniform vec3 color2;

      // Layered sine noise
      float noise(vec2 p, float freq, float amp, float speed) {
        return sin(p.x * freq + time * speed) * sin(p.y * freq + time * speed) * amp;
      }

      void main() {
        vec2 uv = vUv;

        float n1 = noise(uv, 5.0, 0.4, 0.5);
        float n2 = noise(uv, 15.0, 0.2, 1.2);
        float n3 = noise(uv, 30.0, 0.1, 1.5);
        float n4 = noise(uv + vec2(0.5), 50.0, 0.05, 2.0);

        float pattern = (n1 + n2 + n3 + n4) * 0.5 + 0.5;

        vec3 color = mix(color1, color2, pattern);

        gl_FragColor = vec4(color, 0.95);
      }
    `,
    transparent: true,
  });

  useFrame((state) => {
    if (oceanRef.current && materialRef.current) {
      const time = state.clock.getElapsedTime();

      // Gentle bobbing
      oceanRef.current.position.y = Math.sin(time * 0.4) * 0.1;

      // Update shader time
      materialRef.current.uniforms.time.value = time;
    }
  });

  return (
    <mesh
      ref={oceanRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1, 0]}
      receiveShadow
    >
      <planeGeometry args={[1000, 1000, 100, 100]} /> {/* super dense mesh for fine waves */}
      <primitive object={waterMaterial} ref={materialRef} />
    </mesh>
  );
};
