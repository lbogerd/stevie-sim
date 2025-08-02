import { CameraControls, KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { Floor } from "./Floor";
import { RobotVacuum } from "./RobotVacuum";
import { Room } from "./Room";

const map = [
  { name: "forward", keys: ["ArrowUp", "w", "W"] },
  { name: "backward", keys: ["ArrowDown", "s", "S"] },
  { name: "leftward", keys: ["ArrowLeft", "a", "A"] },
  { name: "rightward", keys: ["ArrowRight", "d", "D"] },
];

function App() {
  return (
    <KeyboardControls map={map}>
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

          <CameraControls makeDefault />
          <Suspense>
            <Physics
              timeStep={1 / 60}
              numSolverIterations={8}
              numAdditionalFrictionIterations={4}
              debug
            >
              <Floor />
              <RobotVacuum />
              <Room />
            </Physics>
          </Suspense>
        </Canvas>
      </div>
    </KeyboardControls>
  );
}

export default App;
