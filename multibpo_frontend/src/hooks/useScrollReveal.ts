import { useEffect, useRef, useState } from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useScrollReveal = <T extends HTMLElement = HTMLElement>(
  options: UseScrollRevealOptions = {}
) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T>(null);

  const { threshold = 0.2, rootMargin = "-50px" } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin]);

  return { ref, isVisible };
};
