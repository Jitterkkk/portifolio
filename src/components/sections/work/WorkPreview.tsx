"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const PreviewScene = dynamic(() => import("@/components/three/PreviewScene"), {
  ssr: false,
});

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function WorkPreview({ active }: { active: boolean }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const velocityRef = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const lerped = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setEnabled(mediaQuery.matches);
    const handleChange = (event: MediaQueryListEvent) => setEnabled(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!enabled || !el) return;

    gsap.set(el, { opacity: 0, scale: 0.9 });

    function handleMove(event: PointerEvent) {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
    }
    window.addEventListener("pointermove", handleMove);

    let frame: number;
    function tick() {
      const prevX = lerped.current.x;
      const prevY = lerped.current.y;

      lerped.current.x += (mouse.current.x - lerped.current.x) * 0.15;
      lerped.current.y += (mouse.current.y - lerped.current.y) * 0.15;

      velocityRef.current.x = clamp((lerped.current.x - prevX) * 0.05, -1.2, 1.2);
      velocityRef.current.y = clamp((lerped.current.y - prevY) * 0.05, -1.2, 1.2);

      if (el) {
        el.style.transform = `translate3d(${lerped.current.x}px, ${lerped.current.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!enabled || !el) return;

    if (active) {
      setMounted(true);
      gsap.to(el, { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" });
    } else {
      gsap.to(el, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => setMounted(false),
      });
    }
  }, [active, enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none fixed left-0 top-0 z-150 h-[220px] w-[320px] overflow-hidden rounded-editorial opacity-0"
    >
      {mounted ? <PreviewScene velocityRef={velocityRef} /> : null}
    </div>
  );
}
