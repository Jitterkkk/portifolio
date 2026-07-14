"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { isWebGLAvailable } from "@/lib/webgl";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const ParticleScene = dynamic(() => import("./ParticleScene"), { ssr: false });

export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [webglChecked, setWebglChecked] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    setWebglAvailable(isWebGLAvailable());
    setWebglChecked(true);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const showScene = webglChecked && webglAvailable && !prefersReducedMotion;

  return (
    <div ref={containerRef} className="absolute inset-0">
      {showScene ? (
        <ParticleScene active={isVisible} />
      ) : (
        <div className="hero-fallback" aria-hidden />
      )}
    </div>
  );
}
