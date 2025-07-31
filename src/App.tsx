import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { Floor } from "./Floor";
import { RobotVacuum } from "./RobotVacuum";
import { Room } from "./Room";

function App() {
  return (
    <div className="w-screen h-dvh bg-white">
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }} shadows>
        <group name="lights">
          <ambientLight intensity={Math.PI / 2} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            decay={0}
            intensity={Math.PI}
            castShadow
          />
          <pointLight
            position={[-10, -10, -10]}
            decay={0}
            intensity={Math.PI}
          />
        </group>

        <Suspense>
          <Physics gravity={[0, 0, 0]}>
            <Floor />
            <RobotVacuum />
            <Room />
          </Physics>
        </Suspense>

        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
