import { useEffect } from "react";
import type Lenis from "lenis";

// Scroll suave (Lenis), mesmo ajuste usado na Carrera: 1.2s com saída expo.
// Fica desligado para quem pede menos movimento. No toque o scroll é nativo.

let instance: Lenis | null = null;
let pauseCount = 0;

export function getLenis() {
  return instance;
}

export function pauseScroll() {
  pauseCount += 1;
  instance?.stop();
}

export function resumeScroll() {
  pauseCount = Math.max(0, pauseCount - 1);
  if (pauseCount === 0) instance?.start();
}

export function scrollToY(y: number, smooth = true) {
  if (instance) {
    instance.scrollTo(y, { immediate: !smooth, force: true });
    return;
  }
  window.scrollTo({ top: y, behavior: smooth ? "smooth" : "auto" });
}

export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let cancelled = false;

    const start = async () => {
      if (instance || reduced.matches) return;
      const { default: LenisCtor } = await import("lenis");
      if (cancelled || instance) return;

      instance = new LenisCtor({
        duration: 1.2,
        easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      if (pauseCount > 0) instance.stop();
      // só em desenvolvimento: deixa o Lenis acessível para testes no console
      if (import.meta.env.DEV) {
        document.addEventListener("qa:scroll", () => {
          const y = Number(document.documentElement.dataset.qaScroll || 0);
          instance?.scrollTo(y, { immediate: true, force: true });
        });
      }

      const raf = (time: number) => {
        instance?.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    };

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      instance?.destroy();
      instance = null;
    };

    const apply = () => (reduced.matches ? stop() : void start());
    apply();
    reduced.addEventListener("change", apply);

    return () => {
      cancelled = true;
      reduced.removeEventListener("change", apply);
      stop();
    };
  }, []);

  return null;
}
