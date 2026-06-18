"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Center,
  useGLTF,
  Html,
} from "@react-three/drei";

function Model({ src, onLoaded, nodeVisibility }) {
  // second arg = enable DRACO (uses the default CDN decoder; harmless for
  // non-draco GLBs too). drei caches by URL across mounts/routes.
  const { scene } = useGLTF(src, true);
  // useGLTF suspends until the GLB is parsed; this effect therefore runs only
  // once the model (and everything else inside the same <Suspense>) is ready.
  useEffect(() => {
    onLoaded?.();
    // run once on mount (after the model resolves)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mesh-toggle system: `nodeVisibility` maps GLB node names -> boolean. We
  // look up each named group node and set its `.visible` (three.js visibility
  // is hierarchical, so this hides/shows the group's child geometry too).
  // drei caches the scene by URL, so on unmount we restore everything to
  // visible to avoid leaking hidden meshes into other viewers (e.g. cards).
  useEffect(() => {
    if (!scene || !nodeVisibility) return;
    for (const [name, vis] of Object.entries(nodeVisibility)) {
      const obj = scene.getObjectByName(name);
      if (obj) obj.visible = vis;
    }
    return () => {
      for (const name of Object.keys(nodeVisibility)) {
        const obj = scene.getObjectByName(name);
        if (obj) obj.visible = true;
      }
    };
  }, [scene, nodeVisibility]);

  return <primitive object={scene} />;
}

// Pulsing cream circle on (transparent → card's dark) background.
function Loader() {
  return (
    <Html center>
      <div className="h-10 w-10 animate-pulse rounded-full bg-cream" />
    </Html>
  );
}

/**
 * Reusable WebGL viewer. Used both for the small auto-rotating product cards
 * and the fully-interactive configurator. The <Canvas> auto-disposes its WebGL
 * context + renderer on unmount (R3F handles this), so navigating away frees the
 * GPU resources - no manual teardown needed.
 */
export default function ModelViewer({
  src,
  preset = "apartment",
  controls = true, // when false: static, no OrbitControls, no pointer events
  autoRotate = true,
  enablePan = false,
  enableZoom = true,
  minDistance = 3,
  maxDistance = 10,
  camera = [4, 2, 6],
  contactShadows = true,
  onLoaded,
  nodeVisibility,
}) {
  const [auto, setAuto] = useState(autoRotate);

  return (
    <Canvas
      camera={{ position: camera, fov: 45 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{
        background: "transparent",
        // fully non-interactive when controls are off - lets page scroll pass through
        pointerEvents: controls ? "auto" : "none",
      }}
      // only intercept Lenis when the viewer is actually interactive
      {...(controls ? { "data-lenis-prevent": "" } : {})}
    >
      <ambientLight intensity={0.5} />
      <Suspense fallback={<Loader />}>
        <Center>
          <Model src={src} onLoaded={onLoaded} nodeVisibility={nodeVisibility} />
        </Center>
        <Environment preset={preset} />
        {contactShadows && (
          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0.5}
            scale={12}
            blur={2.6}
            far={5}
          />
        )}
      </Suspense>
      {controls && (
        <OrbitControls
          makeDefault
          enablePan={enablePan}
          enableZoom={enableZoom}
          minDistance={minDistance}
          maxDistance={maxDistance}
          autoRotate={auto}
          autoRotateSpeed={0.8}
          // stop auto-rotating as soon as the user grabs the model
          onStart={() => autoRotate && setAuto(false)}
        />
      )}
    </Canvas>
  );
}
