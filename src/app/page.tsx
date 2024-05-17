"use client";

import Image from "next/image";
import React, { lazy, Suspense } from "react";
import { CardBody, CardContainer, CardItem } from "@/ui/aceternity/3d-card";
import { useHydrated } from "@/hooks/useHydrated";

const DisplacementSphere = lazy(() =>
  import("@/ui/three/displacement-sphere").then((module) => ({
    default: module.DisplacementSphere,
  }))
);

export default function ThreeDCardDemo() {
  const isHydrated = useHydrated();
  return (
    <main>
      {isHydrated ? (
        <Suspense>
          <DisplacementSphere />
        </Suspense>
      ) : null}
    </main>
  );
}
