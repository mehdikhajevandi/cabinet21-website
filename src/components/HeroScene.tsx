import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";

function GoldRing({ position, scale = 1, speed = 1 }: { position: [number, number, number]; scale?: number; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.08 * speed;
      ref.current.rotation.y += delta * 0.12 * speed;
    }
  });
  return (
    <Float speed={1.2 * speed} rotationIntensity={0.4} floatIntensity={1.1}>
      <mesh ref={ref} position={position} scale={scale}>
        <torusGeometry args={[1, 0.03, 16, 64]} />
        <meshStandardMaterial color="#b8935a" metalness={0.9} roughness={0.2} emissive="#3a2a15" emissiveIntensity={0.2} />
      </mesh>
    </Float>
  );
}

function GlassPanel() {
  const ref = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      ref.current.rotation.y = Math.sin(t * 0.15) * 0.25 + 0.3;
      ref.current.rotation.x = Math.cos(t * 0.1) * 0.08;
      ref.current.position.y = Math.sin(t * 0.4) * 0.08;
    }
  });

  const scale = Math.min(viewport.width / 8, 1.15);

  return (
    <group scale={scale}>
      <mesh ref={ref} position={[0, 0, 0]}>
        <boxGeometry args={[2.6, 1.6, 0.12]} />
        <meshPhysicalMaterial
          transmission={0.9}
          thickness={0.4}
          roughness={0.15}
          ior={1.3}
          color="#e8dcc4"
          transparent
          opacity={0.7}
        />
      </mesh>
      <lineSegments position={[0, 0, 0.07]}>
        <edgesGeometry args={[new THREE.BoxGeometry(2.6, 1.6, 0.12)]} />
        <lineBasicMaterial color="#e0bd85" transparent opacity={0.6} />
      </lineSegments>
    </group>
  );
}

function Particles({ count = 30 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#e0bd85" size={0.025} transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

function Rig() {
  const { camera, mouse } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.03;
    camera.position.y += (-mouse.y * 0.25 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setVisible(!mq.matches);
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-10">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} intensity={1.4} color="#e0bd85" />
        <directionalLight position={[-3, -2, -2]} intensity={0.4} color="#8a6141" />
        <Environment preset="apartment" />
        <GlassPanel />
        <GoldRing position={[-1.8, 0.8, -0.5]} scale={0.5} speed={0.8} />
        <GoldRing position={[2, -0.7, -0.8]} scale={0.35} speed={1.3} />
        <Particles />
        <Rig />
      </Canvas>
    </div>
  );
}
