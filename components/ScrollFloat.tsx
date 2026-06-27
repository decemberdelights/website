"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ScrollFloatProps {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "div" | "p" | "span";
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  stagger?: number;
}

const ScrollFloat: React.FC<ScrollFloatProps> = ({
  children,
  as: Tag = "span",
  containerClassName = "",
  textClassName = "",
  animationDuration = 0.6,
  stagger = 0.03,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll<HTMLElement>(".sf-char");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          chars.forEach((char, i) => {
            char.style.transition = `opacity ${animationDuration}s cubic-bezier(0.22,1,0.36,1) ${i * stagger}s, transform ${animationDuration}s cubic-bezier(0.22,1,0.36,1) ${i * stagger}s`;
            char.style.opacity = "1";
            char.style.transform = "none";
          });
        } else {
          chars.forEach((char) => {
            char.style.transition = "none";
            char.style.opacity = "0";
            char.style.transform = "translateY(100%)";
          });
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animationDuration, stagger]);

  const text = typeof children === "string" ? children : "";
  const chars = text.split("");

  return (
    <Tag ref={containerRef as React.RefObject<HTMLDivElement>} className={`overflow-hidden ${containerClassName}`}>
      <span className={`inline-block ${textClassName}`}>
        {chars.map((char, i) => (
          <span
            key={i}
            className="sf-char inline-block"
            style={{
              opacity: 0,
              transform: "translateY(100%) translateZ(0)",
              willChange: "transform, opacity",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </Tag>
  );
};

export default ScrollFloat;
