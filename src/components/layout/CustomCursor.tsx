"use client";

import { useEffect, useRef, useState } from "react";

type CursorState = "default" | "hover" | "view";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>("default");
  const [label, setLabel] = useState("");

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    setEnabled(!mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => setEnabled(!event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("has-custom-cursor", enabled);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    function handlePointerMove(event: PointerEvent) {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }
    }

    function handlePointerOver(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const trigger = target.closest<HTMLElement>("[data-cursor]");
      if (!trigger) return;
      setState((trigger.dataset.cursor as CursorState) ?? "hover");
      setLabel(trigger.dataset.cursorLabel ?? "");
    }

    function handlePointerOut(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const trigger = target.closest("[data-cursor]");
      if (!trigger) return;
      setState("default");
      setLabel("");
    }

    window.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);

    let frame: number;
    function tick() {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.18;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-200 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember"
      />
      <div
        ref={ringRef}
        data-state={state}
        className="pointer-events-none fixed left-0 top-0 z-200 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-text/40 transition-[width,height,border-color,background-color] duration-200 ease-out data-[state=default]:size-7 data-[state=hover]:size-12 data-[state=hover]:border-ember data-[state=view]:size-20 data-[state=view]:border-ember data-[state=view]:bg-ember/10"
      >
        {state === "view" ? (
          <span className="font-mono text-[10px] uppercase tracking-wider text-text">
            {label || "View"}
          </span>
        ) : null}
      </div>
    </>
  );
}
