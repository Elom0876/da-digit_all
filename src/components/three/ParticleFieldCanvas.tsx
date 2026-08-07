"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Position normalisée du pointeur (-1..1), suivie globalement — le canvas
 *  reste pointer-events:none pour ne jamais intercepter le formulaire posé
 *  au-dessus, donc on ne peut pas s'appuyer sur les events internes de R3F. */
function usePointer() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return pointer;
}

const COUNT = 70;
const BOUNDS: [number, number, number] = [7, 4, 4];
const MAX_LINKS = 90;
const LINK_DISTANCE = 1.7;
const RELINK_EVERY = 22; // frames

/** Palette de marque, en RGB linéaire pour les vertex colors. */
const PALETTE = [
  new THREE.Color("#F2921F"),
  new THREE.Color("#6B3FD4"),
  new THREE.Color("#2E6BE6"),
];

function Field() {
  const points = useRef<THREE.Points>(null);
  const lines = useRef<THREE.LineSegments>(null);
  const group = useRef<THREE.Group>(null);
  const frame = useRef(0);
  const pointer = usePointer();

  /* Vitesse et phase de dérive de chaque point : purement auxiliaire (pas
     un attribut de géométrie), tiré au hasard hors du rendu, dans l'effet
     ci-dessous — jamais lu ou écrit pendant le rendu lui-même. */
  const phases = useRef(new Float32Array(COUNT * 3));

  /* La géométrie est un objet mémoïsé, déterministe (positions à zéro,
     couleurs de la palette qui ne dépendent d'aucun hasard) : elle peut
     être lue pendant le rendu sans réserve. Le tirage aléatoire des
     positions se fait ensuite dans un effet, via la ref `points`. */
  const pointsGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const c = PALETTE[i % PALETTE.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  const linesGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(MAX_LINKS * 2 * 3), 3),
    );
    return geo;
  }, []);

  useEffect(() => {
    const pos = points.current?.geometry.attributes.position as
      | THREE.BufferAttribute
      | undefined;
    if (!pos) return;

    for (let i = 0; i < COUNT; i++) {
      pos.array[i * 3] = (Math.random() * 2 - 1) * BOUNDS[0];
      pos.array[i * 3 + 1] = (Math.random() * 2 - 1) * BOUNDS[1];
      pos.array[i * 3 + 2] = (Math.random() * 2 - 1) * BOUNDS[2];

      phases.current[i * 3] = Math.random() * Math.PI * 2;
      phases.current[i * 3 + 1] = Math.random() * Math.PI * 2;
      phases.current[i * 3 + 2] = 0.15 + Math.random() * 0.25; // vitesse
    }
    pos.needsUpdate = true;
  }, []);

  // La mutation de buffers de géométrie à chaque frame est le fonctionnement
  // normal de react-three-fiber (voir AgencyOrbCanvas) ; la règle de pureté
  // expérimentale du compilateur React ne modélise pas ce cas imprévisible.
  /* eslint-disable react-hooks/immutability */
  useFrame((state, delta) => {
    frame.current += 1;
    const t = state.clock.elapsedTime;
    const pos = points.current?.geometry.attributes.position as
      | THREE.BufferAttribute
      | undefined;

    if (pos) {
      const arr = pos.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        const speed = phases.current[i * 3 + 2];
        arr[i * 3] += Math.sin(t * speed + phases.current[i * 3]) * 0.0009;
        arr[i * 3 + 1] += Math.cos(t * speed + phases.current[i * 3 + 1]) * 0.0009;
      }
      pos.needsUpdate = true;
    }

    // Parallaxe : le nuage tourne très légèrement vers le pointeur.
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        pointer.current.x * 0.18,
        4,
        delta,
      );
      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        -pointer.current.y * 0.12,
        4,
        delta,
      );
    }

    // Les liaisons se recalculent périodiquement, pas à chaque frame.
    if (frame.current % RELINK_EVERY === 0 && pos && lines.current) {
      const arr = pos.array as Float32Array;
      const lineAttr = lines.current.geometry.attributes
        .position as THREE.BufferAttribute;
      const lineArr = lineAttr.array as Float32Array;

      let used = 0;
      for (let i = 0; i < COUNT && used < MAX_LINKS; i++) {
        for (let j = i + 1; j < COUNT && used < MAX_LINKS; j++) {
          const dx = arr[i * 3] - arr[j * 3];
          const dy = arr[i * 3 + 1] - arr[j * 3 + 1];
          const dz = arr[i * 3 + 2] - arr[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < LINK_DISTANCE) {
            lineArr[used * 6] = arr[i * 3];
            lineArr[used * 6 + 1] = arr[i * 3 + 1];
            lineArr[used * 6 + 2] = arr[i * 3 + 2];
            lineArr[used * 6 + 3] = arr[j * 3];
            lineArr[used * 6 + 4] = arr[j * 3 + 1];
            lineArr[used * 6 + 5] = arr[j * 3 + 2];
            used += 1;
          }
        }
      }
      lineAttr.needsUpdate = true;
      lines.current.geometry.setDrawRange(0, used * 2);
    }
  });
  /* eslint-enable react-hooks/immutability */

  return (
    <group ref={group}>
      <points ref={points} geometry={pointsGeometry}>
        <pointsMaterial
          size={0.11}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      <lineSegments ref={lines} geometry={linesGeometry}>
        <lineBasicMaterial color="#6B3FD4" transparent opacity={0.16} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

export default function ParticleFieldCanvas({ className = "" }: { className?: string }) {
  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0, 9], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      style={{ pointerEvents: "none" }}
    >
      <Field />
    </Canvas>
  );
}
