import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { Group } from "three";

export interface PropellorProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  blades?: number;
  size?: number;
  orientation?: "horizontal" | "vertical";
  spinning?: boolean;
  spinSpeed?: number;
  color?: string;
}

export function Propellor({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  blades = 2,
  size = 1,
  orientation = "horizontal",
  spinning = true,
  spinSpeed = 20,
  color = "#9a8c98",
}: PropellorProps) {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (spinning && groupRef.current) {
      if (orientation === "horizontal") {
        groupRef.current.rotation.y += spinSpeed * delta;
      } else {
        groupRef.current.rotation.z += spinSpeed * delta;
      }
    }
  });

  const bladeLength = size * 0.8;
  const bladeWidth = size * 0.1;
  const hubRadius = size * 0.08;
  const thickness = size * 0.02;

  const Blades = () => {
    const bladeElements = [];
    for (let i = 0; i < blades; i++) {
      const angle = (i / blades) * Math.PI * 2;
      const x = Math.cos(angle) * (bladeLength / 2);
      const z = Math.sin(angle) * (bladeLength / 2);

      bladeElements.push(
        <mesh key={i} position={[x, 0, z]} rotation={[0, angle, 0]}>
          <boxGeometry args={[bladeLength, thickness, bladeWidth]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
    }

    return <>{bladeElements}</>;
  };

  const propellorRotation: [number, number, number] =
    orientation === "vertical"
      ? [Math.PI / 2, rotation[1], rotation[2]]
      : rotation;

  return (
    <RigidBody>
      <group position={position} rotation={propellorRotation}>
        <group ref={groupRef}>
          {/* Central hub */}
          <mesh>
            <cylinderGeometry
              args={[hubRadius, hubRadius, thickness * 2, 16]}
            />
            <meshStandardMaterial color={color} />
          </mesh>

          {/* Blades */}
          <Blades />
        </group>
      </group>
    </RigidBody>
  );
}
