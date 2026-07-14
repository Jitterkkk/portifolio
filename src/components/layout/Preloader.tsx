"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { dispatchPreloaderDone } from "@/lib/preloader-events";

const STORAGE_KEY = "portfolio-preloader-shown";

export function Preloader({ name = "BERNARDO" }: { name?: string }) {
  const [mounted, setMounted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(STORAGE_KEY) === "1";
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    document.documentElement.classList.add("preloading");

    const finish = () => {
      document.documentElement.classList.remove("preloading");
      sessionStorage.setItem(STORAGE_KEY, "1");
      dispatchPreloaderDone();
      setMounted(false);
    };

    const ctx = gsap.context(() => {
      if (alreadyShown || prefersReducedMotion) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.35,
          ease: "power1.out",
          onComplete: finish,
        });
        return;
      }

      const counter = { value: 0 };
      const tl = gsap.timeline();

      tl.fromTo(
        nameRef.current,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 2.2, ease: "power3.out" },
        0,
      ).to(
        counter,
        {
          value: 100,
          duration: 2.2,
          ease: "power2.inOut",
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = String(
                Math.floor(counter.value),
              ).padStart(3, "0");
            }
          },
        },
        0,
      );

      tl.to(containerRef.current, {
        yPercent: -100,
        duration: 0.9,
        ease: "power4.inOut",
        onComplete: finish,
      });
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-300 flex items-center justify-center bg-bg"
    >
      <h1
        ref={nameRef}
        className="font-display text-[13vw] leading-none tracking-tight text-text"
      >
        {name}
      </h1>
      <span
        ref={counterRef}
        className="absolute bottom-8 right-8 font-mono text-sm text-text-muted"
      >
        000
      </span>
    </div>
  );
}
