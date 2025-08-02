import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { RapierRigidBody, RigidBody, vec3 } from "@react-three/rapier";
import { useRef } from "react";

export function RobotVacuum() {
  const robotBody = useRef<null | RapierRigidBody>(null);
  const { camera } = useThree();

  const [, get] = useKeyboardControls();

  useFrame(() => {
    if (!robotBody.current) return;

    // Update camera to chase robot
    const robotPosition = robotBody.current.translation();
    camera.position.set(robotPosition.x, 5, robotPosition.z + 10);
    camera.lookAt(robotPosition.x, 0, robotPosition.z);

    const { forward, backward, leftward, rightward } = get();
    const keysPressed = forward || backward || leftward || rightward;

    const currentVel = vec3(robotBody.current.linvel());
    const currentSpeed = Math.sqrt(
      currentVel.x * currentVel.x + currentVel.z * currentVel.z
    );

    // Engine-like parameters
    const maxSpeed = 2.5; // Low max speed like a vacuum cleaner
    const acceleration = 0.12; // Gradual acceleration

    if (keysPressed) {
      // Calculate desired direction
      const direction = { x: 0, z: 0 };
      if (forward) direction.z -= 1;
      if (backward) direction.z += 1;
      if (leftward) direction.x -= 1;
      if (rightward) direction.x += 1;

      // Normalize direction
      const dirLength = Math.sqrt(
        direction.x * direction.x + direction.z * direction.z
      );
      if (dirLength > 0) {
        direction.x /= dirLength;
        direction.z /= dirLength;
      }

      // Apply acceleration force if under max speed
      if (currentSpeed < maxSpeed) {
        const force = acceleration * (1 - currentSpeed / maxSpeed); // Diminishing acceleration as speed increases
        robotBody.current.addForce(
          {
            x: direction.x * force,
            y: 0,
            z: direction.z * force,
          },
          true
        );
      }
    } else if (currentSpeed < 0.05) {
      // Stop completely when very slow
      robotBody.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }

    // Ensure we don't exceed max speed
    if (currentSpeed > maxSpeed) {
      const scale = maxSpeed / currentSpeed;
      robotBody.current.setLinvel(
        {
          x: currentVel.x * scale,
          y: currentVel.y,
          z: currentVel.z * scale,
        },
        true
      );
    }
  });

  const height = 0.2; // Height of the robot vacuum

  return (
    <RigidBody
      ref={robotBody}
      mass={5}
      position={[0, height, 0]}
      linearDamping={5.0}
      angularDamping={3.0}
      friction={2.5}
      restitution={0.1}
      enabledTranslations={[true, false, true]}
      enabledRotations={[false, true, false]}
      colliders="hull"
    >
      <group>
        {/* Main body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.6, 0.6, height, 32]} />
          <meshStandardMaterial color="#22223b" />
        </mesh>
        {/* Top */}
        <mesh position={[0, 0.11, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.05, 32]} />
          <meshStandardMaterial color="#f2e9e4" />
        </mesh>
        {/* Button */}
        <mesh position={[height, 0.16, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
          <meshStandardMaterial color="#c9ada7" />
        </mesh>
      </group>
    </RigidBody>
  );
}
