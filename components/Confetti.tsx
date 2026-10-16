"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

const COLORS = ["#6a2ff0", "#4b17c9", "#8b45ff", "#fbbf24", "#e879f9", "#1c0f45", "#7b3bff"];

export function Confetti({ fire }: { fire: number }) {
  const reduce = useReducedMotion();
  const pieces = useMemo(() => {
    return Array.from({ length: reduce ? 0 : 72 }, (_, index) => {
      const left = (index * 37) % 100;
      return {
        id: `${fire}-${index}`,
        left,
        delay: (index % 12) * 0.03,
        duration: 1.7 + (index % 5) * 0.28,
        rotate: (index * 47) % 360,
        drift: ((index % 9) - 4) * 28,
        color: COLORS[index % COLORS.length],
        width: 6 + (index % 4) * 3,
        height: 8 + (index % 3) * 4,
        radius: index % 3 === 0 ? 999 : 2,
      };
    });
    // fire reseeds the burst
  }, [fire, reduce]);

  if (!fire || pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute top-0"
          style={{
            left: `${piece.left}%`,
            width: piece.width,
            height: piece.height,
            background: piece.color,
            borderRadius: piece.radius,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0, x: 0 }}
          animate={{ y: "105vh", opacity: 0.9, rotate: piece.rotate, x: piece.drift }}
          transition={{ duration: piece.duration, delay: piece.delay, ease: [0.2, 0.7, 0.2, 1] }}
        />
      ))}
    </div>
  );
}
