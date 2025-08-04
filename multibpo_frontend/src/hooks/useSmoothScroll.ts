import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

let lenis: Lenis | null = null;

export const useSmoothScroll = () => {
  useEffect(() => {
    // Inicializa o Lenis apenas uma vez
    if (!lenis) {
      lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        infinite: false,
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        touchMultiplier: 2,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      // Função para atualizar o scroll
      function raf(time: number) {
        lenis?.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    }

    return () => {
      // Não destruímos o lenis aqui para manter o smooth scroll global
    };
  }, []);

  return {
    scrollTo: (
      target: string | number,
      options?: { offset?: number; duration?: number }
    ) => {
      if (lenis) {
        lenis.scrollTo(target, {
          offset: options?.offset || 0,
          duration: options?.duration || 1.2,
        });
      }
    },
    stop: () => lenis?.stop(),
    start: () => lenis?.start(),
    destroy: () => {
      if (lenis) {
        lenis.destroy();
        lenis = null;
      }
    },
  };
};
