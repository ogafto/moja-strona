"use client";

import { useEffect, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01";

/** Efekt „dekodowania” tekstu: znaki mieszają się i po kolei wskakują na miejsce. */
export function useScramble(target: string, duration = 900) {
  const [out, setOut] = useState(target);

  useEffect(() => {
    const ms = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : duration;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = ms ? Math.min(1, (now - start) / ms) : 1;
      const revealed = Math.floor(p * target.length);
      let s = target.slice(0, revealed);
      for (let i = revealed; i < target.length; i++) {
        s += target[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(s);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return out;
}
