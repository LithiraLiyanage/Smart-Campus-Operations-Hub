import { useEffect, useRef } from "react";

/**
 * useScrollReveal
 * Attaches IntersectionObserver to a container ref.
 * All children with class "reveal" inside will animate in
 * when they reach 15% viewport visibility.
 *
 * Usage:
 *   const ref = useScrollReveal();
 *   <section ref={ref}><div className="reveal">...</div></section>
 */
const useScrollReveal = (threshold = 0.15) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Unobserve after first reveal for performance
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    const elements = container.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold]);

  return containerRef;
};

export default useScrollReveal;
