import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";

export function RobotVacuum() {
  const ref = useRef<null | RapierRigidBody>(null);

  // Keyboard controls
  const keys = useRef<{ [key: string]: boolean }>({});
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Physics step
  useFrame(() => {
    if (!ref.current) return;

    const force = 0.1;
    const impulse = {
      x: 0,
      y: 0,
      z: 0,
    };

    if (keys.current["w"] || keys.current["ArrowUp"]) impulse.z -= force;
    if (keys.current["s"] || keys.current["ArrowDown"]) impulse.z += force;
    if (keys.current["a"] || keys.current["ArrowLeft"]) impulse.x -= force;
    if (keys.current["d"] || keys.current["ArrowRight"]) impulse.x += force;

    ref.current.addForce(impulse, true);
  });

  return (
    <RigidBody
      ref={ref}
      mass={1}
      position={[0, 0.5, 0]}
      restitution={0} // Bounciness
      friction={5}
      linearDamping={0} // slows it down automatically
    >
      <group>
        {/* Main body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.6, 0.6, 0.2, 32]} />
          <meshStandardMaterial color="#22223b" />
        </mesh>
        {/* Top */}
        <mesh position={[0, 0.11, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.05, 32]} />
          <meshStandardMaterial color="#f2e9e4" />
        </mesh>
        {/* Button */}
        <mesh position={[0.2, 0.16, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
          <meshStandardMaterial color="#c9ada7" />
        </mesh>
      </group>
    </RigidBody>
  );
}
