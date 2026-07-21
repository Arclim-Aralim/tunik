import { useEffect } from "react";

export function useSmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    if (reduceMotion || coarsePointer) return undefined;

    let cancelled = false;
    let frame = 0;
    let lenis;
    let cleanupVisibility;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;

      lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.9 });

      const raf = (time) => {
        if (document.visibilityState !== "visible") {
          frame = 0;
          return;
        }

        lenis.raf(time);
        frame = window.requestAnimationFrame(raf);
      };

      const resume = () => {
        if (document.visibilityState === "visible" && !frame) {
          frame = window.requestAnimationFrame(raf);
        }
      };

      frame = window.requestAnimationFrame(raf);
      document.addEventListener("visibilitychange", resume);
      cleanupVisibility = () => document.removeEventListener("visibilitychange", resume);
    });

    return () => {
      cancelled = true;
      if (frame) window.cancelAnimationFrame(frame);
      cleanupVisibility?.();
      lenis?.destroy();
    };
  }, []);
}
