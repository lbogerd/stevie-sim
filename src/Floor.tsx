import { useTexture } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";

export function Floor() {
  const texture = useTexture("/wood.jpg");
  const meshRef = useRef<THREE.Mesh>(null);

  // Tile the texture
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8); // Tweak numbers for more/less tiling

  return (
    <RigidBody type="fixed" friction={2} restitution={0.1}>
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        {/* <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1.5}
          mixStrength={2}
          roughness={0.5}
          depthScale={0.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.25}
          color="#eab676"
          metalness={0.5}
          map={texture}
        /> */}
      </mesh>
    </RigidBody>
  );
}
