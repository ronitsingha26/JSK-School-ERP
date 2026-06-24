import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Center, Float } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField({ count = 1500 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.01;
      ref.current.rotation.y -= delta * 0.02;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#3b82f6"
          size={0.03}
          sizeAttenuation
          depthWrite={false}
          opacity={0.4}
        />
      </Points>
    </group>
  );
}

function GlowOrbs() {
  const group = useRef();
  const orbData = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 3 - 2,
      ],
      scale: 0.1 + Math.random() * 0.2,
      speed: 0.2 + Math.random() * 0.4,
      color: ['#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'][i],
    }));
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.children.forEach((orb, i) => {
        const t = state.clock.elapsedTime * orbData[i].speed;
        orb.position.y += Math.sin(t) * 0.002;
        orb.position.x += Math.cos(t * 0.7) * 0.001;
      });
    }
  });

  return (
    <group ref={group}>
      {orbData.map((orb, i) => (
        <mesh key={i} position={orb.position}>
          <sphereGeometry args={[orb.scale, 32, 32]} />
          <meshBasicMaterial
            color={orb.color}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ThreeBackground({ fullScreen = false }) {
  return (
    <div className={`${fullScreen ? 'absolute inset-0 bg-slate-50' : 'fixed inset-0 -z-10 bg-slate-50'}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <ParticleField />
          <GlowOrbs />
        </Suspense>
      </Canvas>

      {fullScreen && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10">
          <h1
            className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight drop-shadow-sm"
          >
            JSK School
          </h1>
          <p className="text-lg md:text-xl font-semibold text-blue-600 mt-2 tracking-[0.2em] uppercase">
            ERP System
          </p>
        </div>
      )}
    </div>
  );
}
