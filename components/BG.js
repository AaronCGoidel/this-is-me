import React, { useRef, useState, useEffect, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader, useThree } from "react-three-fiber";
import { MathUtils, Mesh } from "three";

const Star = ({ pos, ref }) => {
  return (
    <mesh position={pos}>
      <sphereGeometry
        attach="geometry"
        args={[MathUtils.randFloat(0.5, 1), 24, 24]}
      />
      <meshStandardMaterial
        attach="material"
        color={"#ffffff"}
        roughness={0.1}
        metalness={0.1}
      />
    </mesh>
  );
};

const Stars = () => {
  const group = useRef();
  useFrame(() => {
    group.current.position.z -= 0.06;
    group.current.position.x -= 0.003;
    group.current.rotation.y -= 0.0003;
  });
  return (
    <group ref={group}>
      {Array(550)
        .fill()
        .map((_, i) => {
          const pos = Array(3)
            .fill()
            .map(() => MathUtils.randFloatSpread(500));
          return <Star pos={pos} />;
        })}
    </group>
  );
};

const BG = () => {
  return (
    <div className={"bg-container"}>
      <Canvas>
        <ambientLight intensity={2} />
        <pointLight position={[40, 40, 40]} />
        <Suspense fallback={null}></Suspense>
        <Stars />
      </Canvas>
    </div>
  );
};

export default BG;
