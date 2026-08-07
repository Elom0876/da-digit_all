"use client";

import { useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type RotationState = { x: number; y: number };
type ProgressState = { value: number };

const ORANGE = new THREE.Color("#F2921F");
const VIOLET = new THREE.Color("#6B3FD4");
const AZURE = new THREE.Color("#2E6BE6");

function Orb({
  rotationRef,
  progressRef,
}: {
  rotationRef: RefObject<RotationState>;
  progressRef: RefObject<ProgressState>;
}) {
  const group = useRef<THREE.Group>(null);
  const wireMat = useRef<THREE.LineBasicMaterial>(null);
  const pointMat = useRef<THREE.PointsMaterial>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2, 1);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const y = (pos.getY(i) + 2) / 4; // 0..1
      const c = ORANGE.clone().lerp(y > 0.5 ? AZURE : VIOLET, Math.abs(y - 0.5) * 2);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

  useFrame((state) => {
    if (!group.current) return;
    const autoSpin = state.clock.elapsedTime * 0.09;
    group.current.rotation.y = autoSpin + rotationRef.current.y;
    group.current.rotation.x = rotationRef.current.x;

    const p = THREE.MathUtils.clamp(progressRef.current.value, 0, 1);
    const scale = THREE.MathUtils.lerp(0.72, 1, p);
    group.current.scale.setScalar(scale);

    if (wireMat.current) wireMat.current.opacity = THREE.MathUtils.lerp(0, 0.4, p);
    if (pointMat.current) pointMat.current.opacity = THREE.MathUtils.lerp(0, 0.95, p);
  });

  return (
    <group ref={group}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial ref={wireMat} color="#241b4b" transparent opacity={0} />
      </lineSegments>
      <points geometry={geometry}>
        <pointsMaterial
          ref={pointMat}
          size={0.14}
          vertexColors
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export default function AgencyOrbCanvas({
  rotationRef,
  progressRef,
  className = "",
}: {
  rotationRef: RefObject<RotationState>;
  progressRef: RefObject<ProgressState>;
  className?: string;
}) {
  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0, 6.5], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
      style={{ touchAction: "none" }}
    >
      <Orb rotationRef={rotationRef} progressRef={progressRef} />
    </Canvas>
  );
}
