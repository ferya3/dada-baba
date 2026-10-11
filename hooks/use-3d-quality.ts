"use client";

import { useSyncExternalStore } from "react";
import { useMediaQuery, usePrefersReducedMotion } from "./use-media-query";

/**
 * - `off`  → render the 2D fallback (no WebGL, reduced motion, or data saver)
 * - `lite` → simplified scene for phones / low-end devices
 * - `full` → full scene on capable desktops
 * - `null` → not known yet (server render and first client paint)
 */
export type Quality3D = "off" | "lite" | "full";

let webglSupport: boolean | undefined;

function hasWebGL() {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = !!(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

type NavigatorHints = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

const noop = () => () => {};

export function use3DQuality(): Quality3D | null {
  const isClient = useSyncExternalStore(noop, () => true, () => false);
  const reducedMotion = usePrefersReducedMotion();
  const isSmall = useMediaQuery("(max-width: 767px)");
  const isCoarse = useMediaQuery("(pointer: coarse)");

  if (!isClient) return null;

  const nav = navigator as NavigatorHints;
  if (reducedMotion || nav.connection?.saveData || !hasWebGL()) return "off";

  const lowEnd = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
  return isSmall || isCoarse || lowEnd ? "lite" : "full";
}
