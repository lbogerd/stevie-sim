import { RigidBody } from "@react-three/rapier";

export function Room() {
  return (
    <group>
      {/* Four walls forming a square room */}
      {/* Back wall */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 1, -10]}>
          <boxGeometry args={[20, 2, 0.4]} />
          <meshStandardMaterial color="#f4f4f3" />
        </mesh>
      </RigidBody>

      {/* Front wall */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 1, 10]}>
          <boxGeometry args={[20, 2, 0.4]} />
          <meshStandardMaterial color="#f4f4f3" />
        </mesh>
      </RigidBody>

      {/* Left wall */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-10, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[20, 2, 0.4]} />
          <meshStandardMaterial color="#f4f4f3" />
        </mesh>
      </RigidBody>

      {/* Right wall */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[10, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[20, 2, 0.4]} />
          <meshStandardMaterial color="#f4f4f3" />
        </mesh>
      </RigidBody>
    </group>
  );
}
