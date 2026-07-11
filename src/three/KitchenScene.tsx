import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Environment,
  ContactShadows,
  Sparkles,
  RoundedBox,
  MeshReflectorMaterial,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

const OAK = "#c9a06a";
const OAK_LIGHT = "#e0c393";
const WALNUT = "#4a2c18";
const WALNUT_DARK = "#2b1810";
const GOLD = "#cba463";

function Rig() {
  const target = useRef(new THREE.Vector3(0, 0.7, 0));
  useFrame(({ camera, pointer, clock }) => {
    const t = clock.getElapsedTime();
    const targetX = Math.sin(t * 0.07) * 1.6 + pointer.x * 0.9;
    const targetY = 1.35 + Math.sin(t * 0.09) * 0.18 + pointer.y * 0.35;
    const targetZ = 6.4 + Math.cos(t * 0.05) * 0.4;
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    camera.position.z += (targetZ - camera.position.z) * 0.02;
    camera.lookAt(target.current);
  });
  return null;
}

function MouseLight() {
  const light = useRef<THREE.PointLight>(null);
  useFrame(({ pointer }) => {
    if (!light.current) return;
    light.current.position.x += (pointer.x * 3.5 - light.current.position.x) * 0.06;
    light.current.position.y += (1.8 - pointer.y * 1.2 - light.current.position.y) * 0.06;
  });
  return <pointLight ref={light} position={[0, 2, 2]} intensity={8} color={GOLD} distance={8} decay={2} />;
}

function CabinetRun() {
  const uppers = useMemo(() => Array.from({ length: 5 }, (_, i) => i), []);
  const lowers = useMemo(() => Array.from({ length: 5 }, (_, i) => i), []);
  return (
    <group position={[0, 0, -2.4]}>
      {/* Back wall */}
      <mesh position={[0, 2.2, -0.15]} receiveShadow>
        <boxGeometry args={[12, 4.6, 0.1]} />
        <meshStandardMaterial color="#151513" roughness={0.9} />
      </mesh>

      {/* Window glow */}
      <mesh position={[2.6, 2.5, -0.08]}>
        <planeGeometry args={[3.1, 3.4]} />
        <meshBasicMaterial color="#fff3da" toneMapped={false} />
      </mesh>
      <mesh position={[2.6, 2.5, -0.07]}>
        <planeGeometry args={[3.1, 3.4]} />
        <meshBasicMaterial color="#ffdca0" transparent opacity={0.35} toneMapped={false} />
      </mesh>

      {/* Lower cabinet run */}
      <group position={[-3.2, 0.5, 0.4]}>
        {lowers.map((i) => (
          <RoundedBox key={i} args={[1.55, 1, 0.7]} radius={0.03} smoothness={4} position={[i * 1.6, 0, 0]} castShadow receiveShadow>
            <meshStandardMaterial color={i % 2 === 0 ? WALNUT : WALNUT_DARK} roughness={0.4} metalness={0.08} />
          </RoundedBox>
        ))}
        {/* countertop */}
        <mesh position={[3.2, 0.56, 0.02]} castShadow receiveShadow>
          <boxGeometry args={[8.4, 0.12, 0.82]} />
          <meshPhysicalMaterial color="#efe9df" roughness={0.2} metalness={0.05} clearcoat={0.6} />
        </mesh>
      </group>

      {/* Upper cabinets */}
      <group position={[-3.2, 2.55, 0.15]}>
        {uppers.map((i) => (
          <RoundedBox key={i} args={[1.5, 1.15, 0.42]} radius={0.02} smoothness={4} position={[i * 1.6, 0, 0]} castShadow>
            <meshStandardMaterial color={OAK} roughness={0.45} metalness={0.05} />
          </RoundedBox>
        ))}
      </group>
    </group>
  );
}

function FloatingIsland() {
  return (
    <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.55}>
      <group position={[0, 0.55, 1.6]}>
        <RoundedBox args={[3.4, 0.95, 1.6]} radius={0.04} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color={WALNUT} roughness={0.32} metalness={0.12} />
        </RoundedBox>
        {/* subtle panel lines */}
        <mesh position={[0, 0, 0.81]}>
          <planeGeometry args={[3.2, 0.7]} />
          <meshStandardMaterial color={WALNUT_DARK} roughness={0.4} />
        </mesh>
        {/* countertop */}
        <mesh position={[0, 0.53, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.6, 0.09, 1.8]} />
          <meshPhysicalMaterial color="#f4efe6" roughness={0.12} metalness={0.05} clearcoat={0.8} clearcoatRoughness={0.2} />
        </mesh>
      </group>
    </Float>
  );
}

function PendantLights() {
  const positions: [number, number, number][] = [
    [-0.9, 3.1, 1.6],
    [0, 3.1, 1.6],
    [0.9, 3.1, 1.6],
  ];
  return (
    <group>
      {positions.map((p, i) => (
        <group key={i} position={p}>
          <mesh position={[0, 0.75, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 1.5, 6]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={1.4} roughness={0.3} metalness={0.6} />
          </mesh>
          <pointLight position={[0, -0.05, 0]} intensity={2.2} color="#ffdca0" distance={3.2} decay={2} />
        </group>
      ))}
    </group>
  );
}

function FloatingShapes() {
  return (
    <group>
      <Float speed={0.8} rotationIntensity={1.2} floatIntensity={1.4}>
        <mesh position={[-4.4, 2.6, -0.4]}>
          <icosahedronGeometry args={[0.32, 0]} />
          <meshStandardMaterial color={GOLD} roughness={0.25} metalness={0.7} wireframe />
        </mesh>
      </Float>
      <Float speed={1.3} rotationIntensity={0.8} floatIntensity={1.1}>
        <mesh position={[4.3, 3.4, 0.6]}>
          <torusGeometry args={[0.28, 0.06, 16, 48]} />
          <meshStandardMaterial color={OAK_LIGHT} roughness={0.3} metalness={0.4} />
        </mesh>
      </Float>
      <Float speed={1} rotationIntensity={0.5} floatIntensity={1.6}>
        <mesh position={[3.6, 1.1, 2.6]}>
          <octahedronGeometry args={[0.2, 0]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.05} transmission={0.9} thickness={0.5} />
        </mesh>
      </Float>
      <Float speed={0.6} rotationIntensity={0.6} floatIntensity={1.2}>
        <mesh position={[-3.7, 1.4, 2.8]}>
          <sphereGeometry args={[0.14, 24, 24]} />
          <meshStandardMaterial color={GOLD} roughness={0.2} metalness={0.8} />
        </mesh>
      </Float>
    </group>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={512}
        mixBlur={1}
        mixStrength={12}
        roughness={0.9}
        depthScale={1}
        minDepthThreshold={0.85}
        color="#0a0a0a"
        metalness={0.4}
        mirror={0.3}
      />
    </mesh>
  );
}

export default function KitchenScene() {
  const { gl } = useThree();
  gl.toneMapping = THREE.ACESFilmicToneMapping;

  return (
    <>
      <Rig />
      <fog attach="fog" args={["#08090a", 6, 16]} />
      <ambientLight intensity={0.35} color="#e8dcc8" />
      <directionalLight
        position={[3, 5, 2]}
        intensity={1.4}
        color="#ffe8c2"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <MouseLight />

      <CabinetRun />
      <FloatingIsland />
      <PendantLights />
      <FloatingShapes />
      <Floor />

      <Sparkles count={70} scale={[8, 4, 6]} size={2} speed={0.25} opacity={0.5} color="#f5e2bb" position={[0, 2, 1]} />

      <ContactShadows position={[0, 0.01, 1.6]} opacity={0.55} scale={8} blur={2.4} far={2} />

      <Environment preset="apartment" />

      <EffectComposer>
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.35} intensity={0.6} mipmapBlur />
        <Vignette eskil={false} offset={0.15} darkness={0.85} />
      </EffectComposer>
    </>
  );
}
