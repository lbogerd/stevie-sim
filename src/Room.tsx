import { RigidBody } from "@react-three/rapier";

export function Room() {
  return (
    <group>
      {/* Four walls forming a square room */}
      {/* Back wall */}
      <Wall position={[0, 1, -10]} />

      {/* Front wall */}
      <Wall position={[0, 1, 10]} />

      {/* Left wall */}
      <Wall position={[-10, 1, 0]} rotation={[0, Math.PI / 2, 0]} />

      {/* Right wall */}
      <Wall position={[10, 1, 0]} rotation={[0, -Math.PI / 2, 0]} />
    </group>
  );
}

function Wall({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <RigidBody type="fixed" colliders="cuboid" restitution={0.1}>
      <mesh position={position} rotation={rotation}>
        <boxGeometry args={[20, 2, 0.4]} />
        <meshStandardMaterial color="#f4f4f3" />
      </mesh>
    </RigidBody>
  );
}
