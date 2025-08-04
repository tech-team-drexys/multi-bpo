import { useEffect, useRef } from "react";

export const useScrollLock = (isLocked: boolean) => {
  const scrollPosition = useRef(0);

  useEffect(() => {
    if (isLocked) {
      // Salvar posição atual do scroll
      scrollPosition.current = window.scrollY;

      // Desabilitar scroll do body
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      // Adicionar padding para compensar o scroll bar que desaparece
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      // Restaurar scroll
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.paddingRight = "";

      // Restaurar posição do scroll usando Lenis se disponível
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.scrollTo === "function") {
        // Pequeno delay para garantir que o DOM foi atualizado
        setTimeout(() => {
          lenis.scrollTo(scrollPosition.current, { duration: 0 });
        }, 10);
      }
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isLocked]);

  return scrollPosition.current;
};
