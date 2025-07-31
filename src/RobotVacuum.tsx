import { useFrame } from "@react-three/fiber";
import * as RAPIER from "@react-three/rapier";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";

export function RobotVacuum() {
  const ref = useRef<null | test>(null);

  type test = typeof RAPIER.CuboidCollider;
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

    const force = 2; // tweak this!
    const impulse = [0, 0, 0];
    if (keys.current["w"] || keys.current["ArrowUp"]) impulse[2] -= force;
    if (keys.current["s"] || keys.current["ArrowDown"]) impulse[2] += force;
    if (keys.current["a"] || keys.current["ArrowLeft"]) impulse[0] -= force;
    if (keys.current["d"] || keys.current["ArrowRight"]) impulse[0] += force;
    if (impulse[0] !== 0 || impulse[2] !== 0) {
      // Apply impulse per frame, mass-independent
      ref.current.applyImpulse(impulse, true);
    }
    // Optional: apply some drag to prevent perpetual sliding
    ref.current.setLinvel(
      ref.current.linvel().multiply({ x: 0.8, y: 0, z: 0.8 })
    );
  });

  return (
    <RigidBody
      ref={ref}
      colliders="cylinder"
      mass={1}
      position={[0, 0.3, 0]}
      restitution={0.2} // Bounciness
      friction={1.2}
      linearDamping={2} // slows it down automatically
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
