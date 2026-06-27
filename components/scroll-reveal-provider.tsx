"use client";

import { useEffect, useRef } from "react";

export default function ScrollRevealProvider({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    const scanAndObserve = () => {
      containerRef.current?.querySelectorAll("[data-reveal]").forEach((el) => {
        if (!el.classList.contains("revealed")) {
          observer.observe(el);
        }
      });

      containerRef.current?.querySelectorAll("[data-stagger]").forEach((group) => {
        const children = Array.from(group.children);
        children.forEach((child, i) => {
          (child as HTMLElement).style.transitionDelay = `${i * 0.08}s`;
          observer.observe(child);
        });
      });
    };

    scanAndObserve();

    const mutationObserver = new MutationObserver(scanAndObserve);
    mutationObserver.observe(containerRef.current, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
