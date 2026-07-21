"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  VRM,
  VRMLoaderPlugin,
  VRMUtils,
  VRMExpressionPresetName,
} from "@pixiv/three-vrm";

interface VRMAvatarProps {
  /** Live analyser tapped from the AI audio playback graph. Drives lip sync. */
  analyser: React.RefObject<AnalyserNode | null>;
  /** VRM file served from /public. */
  url?: string;
  /** When false, the head/eyes stop following the cursor (idle drift only). */
  lookAtCursor?: boolean;
}

/**
 * Animates the VRM to feel alive:
 *  - mouth opens proportional to voice amplitude (lip sync)
 *  - head + eyes track the mouse cursor
 *  - periodic eye blink
 *  - breathing, weight-shift sway, gentle arm motion
 *  - "happy" expression + subtle nod while the AI is speaking
 */
function VRMModel({ analyser, url, lookAtCursor }: { analyser: React.RefObject<AnalyserNode | null>; url: string; lookAtCursor: boolean }) {
  const [vrm, setVrm] = useState<VRM | null>(null);
  const { camera, pointer } = useThree();

  // Smoothed lip-sync value + reusable sample buffer (avoid per-frame allocs).
  const mouthRef = useRef(0);
  const waveRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  // Smoothed "is the AI talking" energy, drives happy expression + nod.
  const talkRef = useRef(0);
  // Smoothed look-at direction so head/eyes ease toward the cursor.
  const lookRef = useRef({ x: 0, y: 0 });

  // Blink state machine.
  const nextBlinkRef = useRef(1.5);
  const blinkTimerRef = useRef(0);
  const blinkingRef = useRef(false);

  // One-shot camera framing once the head bone position is known.
  const framedRef = useRef(false);

  useEffect(() => {
    let disposed = false;
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader.loadAsync(url).then((gltf) => {
      if (disposed) return;
      const loaded = gltf.userData.vrm as VRM;

      // Perf + correctness housekeeping for VRM.
      VRMUtils.removeUnnecessaryVertices(gltf.scene);
      VRMUtils.combineSkeletons(gltf.scene);
      // VRM 0.0 faces -Z; rotate so the avatar looks toward the camera.
      VRMUtils.rotateVRM0(loaded);

      loaded.scene.traverse((obj) => {
        obj.frustumCulled = false;
      });

      // Relax the default T-pose into a natural arms-down rest pose.
      const h = loaded.humanoid;
      const lUpper = h?.getNormalizedBoneNode("leftUpperArm");
      const rUpper = h?.getNormalizedBoneNode("rightUpperArm");
      const lLower = h?.getNormalizedBoneNode("leftLowerArm");
      const rLower = h?.getNormalizedBoneNode("rightLowerArm");
      if (lUpper) lUpper.rotation.z = 1.25;
      if (rUpper) rUpper.rotation.z = -1.25;
      if (lLower) lLower.rotation.z = 0.2;
      if (rLower) rLower.rotation.z = -0.2;

      // We drive the eyes manually each frame, so disable auto look-at.
      if (loaded.lookAt) loaded.lookAt.autoUpdate = false;

      framedRef.current = false;
      setVrm(loaded);
    }).catch((err) => {
      console.error("Failed to load VRM:", err);
    });

    return () => {
      disposed = true;
    };
  }, [url]);


  useFrame((_, delta) => {
    if (!vrm) return;
    const em = vrm.expressionManager;
    const t = performance.now() / 1000;
    // Clamp so a tab-throttle resume spike can't fast-forward timed
    // animations (blink, wave) or destabilize spring bones in one frame.
    const dt = Math.min(delta, 0.05);

    // ── Frame the camera on the head once, per model ─────
    // Models have different heights, so derive framing from the actual
    // head bone rather than a hard-coded eye level.
    if (!framedRef.current) {
      const headNode =
        vrm.humanoid?.getRawBoneNode("head") ??
        vrm.humanoid?.getNormalizedBoneNode("head");
      if (headNode) {
        const p = new THREE.Vector3();
        headNode.getWorldPosition(p);
        if (p.y > 0.1) {
          // Pull back a touch and aim just below the head so the hair has
          // headroom and the shoulders/upper body stay in frame.
          camera.position.set(0, p.y, p.z + 1.3);
          camera.lookAt(0, p.y - 0.13, 0);
          framedRef.current = true;
        }
      }
    }

    // ── Lip sync from live audio amplitude ──────────────
    let target = 0;
    const a = analyser.current;
    if (a) {
      if (!waveRef.current || waveRef.current.length !== a.fftSize) {
        waveRef.current = new Uint8Array(new ArrayBuffer(a.fftSize));
      }
      const buf = waveRef.current;
      a.getByteTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) {
        const x = (buf[i] - 128) / 128;
        sum += x * x;
      }
      const rms = Math.sqrt(sum / buf.length);
      // Scale + soft clip; small deadzone kills idle hiss.
      target = Math.min(1, Math.max(0, (rms - 0.02) * 6));
    }
    // Asymmetric smoothing: open fast, close a touch slower.
    const k = target > mouthRef.current ? 0.5 : 0.25;
    mouthRef.current += (target - mouthRef.current) * k;
    // Slow-follow "talking" energy for expression + body liveliness.
    talkRef.current += ((target > 0.15 ? 1 : 0) - talkRef.current) * 0.08;

    if (em) {
      em.setValue(VRMExpressionPresetName.Aa, mouthRef.current);
      // Warm up into a smile while speaking.
      em.setValue(VRMExpressionPresetName.Happy, talkRef.current * 0.55);

      // ── Blink ─────────────────────────────────────────
      blinkTimerRef.current += dt;
      if (blinkingRef.current) {
        const bt = blinkTimerRef.current / 0.12; // ~120ms pulse
        const w = bt < 0.5 ? bt * 2 : Math.max(0, 2 - bt * 2);
        em.setValue(VRMExpressionPresetName.Blink, Math.min(1, w));
        if (bt >= 1) {
          blinkingRef.current = false;
          blinkTimerRef.current = 0;
          nextBlinkRef.current = 2 + Math.random() * 4;
          em.setValue(VRMExpressionPresetName.Blink, 0);
        }
      } else if (blinkTimerRef.current >= nextBlinkRef.current) {
        blinkingRef.current = true;
        blinkTimerRef.current = 0;
      }
    }

    // ── Head + eyes follow the cursor ────────────────────
    // pointer is normalized -1..1 across the canvas. When disabled, ease the
    // look target back to center so the head returns to a neutral idle.
    const tx = lookAtCursor ? THREE.MathUtils.clamp(pointer.x, -1, 1) : 0;
    const ty = lookAtCursor ? THREE.MathUtils.clamp(pointer.y, -1, 1) : 0;
    lookRef.current.x += (tx - lookRef.current.x) * 0.08;
    lookRef.current.y += (ty - lookRef.current.y) * 0.08;

    const head = vrm.humanoid?.getNormalizedBoneNode("head");
    if (head) {
      // Track cursor + a slow idle drift so it never looks frozen.
      // pointer.y is +1 at the top, so a positive term tilts the face up.
      head.rotation.y = lookRef.current.x * 0.5 + Math.sin(t * 0.5) * 0.04;
      head.rotation.x = lookRef.current.y * 0.35 + Math.sin(t * 0.4) * 0.03
        // gentle nodding while speaking
        + Math.sin(t * 6) * 0.03 * talkRef.current;
    }
    // ── Breathing + weight-shift sway ────────────────────
    const spine = vrm.humanoid?.getNormalizedBoneNode("spine");
    if (spine) {
      spine.rotation.x = Math.sin(t * 1.6) * 0.02;   // breathing
      spine.rotation.z = Math.sin(t * 0.35) * 0.02;  // slow weight shift
    }
    const chest = vrm.humanoid?.getNormalizedBoneNode("chest");
    if (chest) {
      chest.rotation.x = Math.sin(t * 1.6 + 0.3) * 0.012;
    }
    const hips = vrm.humanoid?.getNormalizedBoneNode("hips");
    if (hips) {
      hips.rotation.y = Math.sin(t * 0.35) * 0.03; // slow weight-shift turn
    }
    // Gentle arm sway so the pose never reads as a frozen mannequin.
    const lUpper = vrm.humanoid?.getNormalizedBoneNode("leftUpperArm");
    const rUpper = vrm.humanoid?.getNormalizedBoneNode("rightUpperArm");
    const rLower = vrm.humanoid?.getNormalizedBoneNode("rightLowerArm");
    if (lUpper) lUpper.rotation.z = 1.25 + Math.sin(t * 0.9) * 0.04;
    if (rUpper) rUpper.rotation.z = -1.25 - Math.sin(t * 0.9 + 0.5) * 0.04;
    if (rLower) rLower.rotation.z = -0.2;

    vrm.update(dt);

    // Eyes (if rigged) add life on top of the head turn. Set AFTER update
    // so it isn't overwritten. applyYawPitch takes degrees.
    vrm.lookAt?.applier?.applyYawPitch(
      lookRef.current.x * 18,
      lookRef.current.y * 12,
    );
  });

  if (!vrm) return null;
  return <primitive object={vrm.scene} />;
}

export default function VRMAvatar({ analyser, url = "/models/aoi.vrm", lookAtCursor = true }: VRMAvatarProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.32, 1.3], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={1.4} />
      <directionalLight position={[1, 2, 2]} intensity={1.6} />
      <directionalLight position={[-1, 1, -1]} intensity={0.4} />
      <VRMModel analyser={analyser} url={url} lookAtCursor={lookAtCursor} />
    </Canvas>
  );
}
