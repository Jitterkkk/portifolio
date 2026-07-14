"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

type QuickTo = (value: number) => void;

export function Magnetic({
  children,
  strength = 0.4,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const quick = useRef<{ x: QuickTo; y: QuickTo } | null>(null);

  function getQuick() {
    if (!quick.current && ref.current) {
      quick.current = {
        x: gsap.quickTo(ref.current, "x", { duration: 0.5, ease: "power3.out" }),
        y: gsap.quickTo(ref.current, "y", { duration: 0.5, ease: "power3.out" }),
      };
    }
    return quick.current;
  }

  function handleMouseMove(event: MouseEvent<HTMLSpanElement>) {
    const el = ref.current;
    const q = getQuick();
    if (!el || !q) return;
    const rect = el.getBoundingClientRect();
    q.x((event.clientX - (rect.left + rect.width / 2)) * strength);
    q.y((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function handleMouseLeave() {
    const q = getQuick();
    q?.x(0);
    q?.y(0);
  }

  return (
    <span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block will-change-transform ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
