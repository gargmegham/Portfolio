"use client";

import React, { lazy, Suspense } from "react";
import { useHydrated } from "@/hooks/useHydrated";

const DisplacementSphere = lazy(() =>
  import("@/ui/three/displacement-sphere").then((module) => ({
    default: module.DisplacementSphere,
  }))
);

export default function Background() {
  const isHydrated = useHydrated();
  return isHydrated ? (
    <Suspense>
      <DisplacementSphere />
    </Suspense>
  ) : null;
}
