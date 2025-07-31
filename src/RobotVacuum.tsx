import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody, vec3 } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";

export function RobotVacuum() {
  const robotBody = useRef<null | RapierRigidBody>(null);
  const [logCounter, setLogCounter] = useState(0);
  const [frameCounter, setFrameCounter] = useState(0);

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
    setLogCounter(logCounter + 1);
    setFrameCounter(frameCounter + 1);

    if (!robotBody.current) return;

    // log every 30 frames
    if (logCounter >= 29) {
      console.log(`CURRENT VELOCITIES | frame: ${frameCounter}`);
      console.log(
        `linear velocity: ${JSON.stringify(robotBody.current.linvel())}`
      );
      console.log(
        `angular velocity: ${JSON.stringify(robotBody.current.angvel())}`
      );

      setLogCounter(0);
    }

    const keysPressed = Object.values(keys.current).length !== 0;

    if (keysPressed) {
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

      robotBody.current.addForce(impulse, true);
    } else {
      const linearVector = vec3(robotBody.current.linvel());
      const angularVector = vec3(robotBody.current.linvel());

      if (linearVector.length() < 100) {
        robotBody.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      }
      if (angularVector.length() < 100) {
        robotBody.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      }
    }
  });

  return (
    <RigidBody
      ref={robotBody}
      mass={1}
      position={[0, 0.1, 0]}
      restitution={8} // Bounciness
      friction={1}
      linearDamping={12} // slows it down automatically
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
