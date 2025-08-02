import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { RapierRigidBody, RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { Propellor } from "./Propellor";

export function RobotVacuum() {
  const robotBody = useRef<null | RapierRigidBody>(null);
  const { camera } = useThree();

  const [, get] = useKeyboardControls();

  const { world } = useRapier();
  const offset = 0.01;

  const characterController = useRef(world.createCharacterController(offset));

  useEffect(() => {
    const controller = characterController.current;
    controller.enableSnapToGround(0.5);
    return () => {
      world.removeCharacterController(controller);
    };
  }, [world]);

  useFrame((_, delta) => {
    if (!robotBody.current) return;

    // update camera to chase robot
    const robotPosition = robotBody.current.translation();
    camera.position.set(robotPosition.x, 5, robotPosition.z + 10);
    camera.lookAt(robotPosition.x, 0, robotPosition.z);

    const { forward, backward, leftward, rightward } = get();
    const keysPressed = forward || backward || leftward || rightward;

    const maxSpeed = 2.5;

    // calculate desired direction
    const direction = { x: 0, z: 0 };
    if (forward) direction.z -= 1;
    if (backward) direction.z += 1;
    if (leftward) direction.x -= 1;
    if (rightward) direction.x += 1;

    // normalize direction
    const dirLength = Math.sqrt(
      direction.x * direction.x + direction.z * direction.z
    );
    if (dirLength > 0) {
      direction.x /= dirLength;
      direction.z /= dirLength;
    }

    // calculate desired translation based on input
    let desiredTranslation = { x: 0, y: 0, z: 0 };
    if (keysPressed) {
      desiredTranslation = {
        x: direction.x * maxSpeed * delta,
        y: 0,
        z: direction.z * maxSpeed * delta,
      };
    }

    // use character controller to compute collision-aware movement
    characterController.current.computeColliderMovement(
      robotBody.current.collider(0),
      desiredTranslation
    );

    // get the corrected movement from the character controller
    const correctedMovement = characterController.current.computedMovement();

    // apply the corrected movement to the kinematic rigid body
    const currentPosition = robotBody.current.translation();
    robotBody.current.setNextKinematicTranslation({
      x: currentPosition.x + correctedMovement.x,
      y: currentPosition.y + correctedMovement.y,
      z: currentPosition.z + correctedMovement.z,
    });
  });

  const height = 0.2; // Height of the robot vacuum

  return (
    <RigidBody
      ref={robotBody}
      type="kinematicPosition"
      position={[0, height, 0]}
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

        {/* Propellors */}
        <Propellor
          position={[0.4, height + 0.05, 0]}
          orientation="horizontal"
          size={0.3}
          blades={3}
        />
        <Propellor
          position={[-0.4, height + 0.05, 0]}
          orientation="horizontal"
          size={0.3}
          blades={3}
        />
      </group>
    </RigidBody>
  );
}
