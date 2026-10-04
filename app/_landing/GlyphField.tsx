"use client";

import { useEffect, useRef } from "react";

const CHARS = "01{}[]<>/\\=+-*;:$#&|!?()abcdef";
const CELL = 22;
const RADIUS = 170;

/** Tło hero: siatka znaków, która „zapala się” i miesza pod kursorem (albo dryfuje sama na dotyku). */
export default function GlyphField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--accent").trim() || "#b6ff3b";
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const base = document.createElement("canvas");
    const bctx = base.getContext("2d")!;

    let w = 0, h = 0, cols = 0, rows = 0, dpr = 1;
    let glyphs = new Uint8Array(0);
    let heat = new Float32Array(0);
    const active = new Set<number>();
    const pointer = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4, last: 0 };
    let raf = 0;
    let visible = true;

    const font = `500 13px ${styles.getPropertyValue("--font-geist-mono") || "monospace"}`;
    const rand = () => Math.floor(Math.random() * CHARS.length);

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      for (const c of [canvas!, base]) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / CELL);
      glyphs = Uint8Array.from({ length: cols * rows }, rand);
      heat = new Float32Array(cols * rows);
      active.clear();

      bctx.clearRect(0, 0, w, h);
      bctx.font = font;
      bctx.textAlign = "center";
      bctx.textBaseline = "middle";
      for (let i = 0; i < glyphs.length; i++) {
        bctx.fillStyle = `rgba(255,255,255,${0.035 + Math.random() * 0.07})`;
        bctx.fillText(CHARS[glyphs[i]], (i % cols) * CELL + CELL / 2, Math.floor(i / cols) * CELL + CELL / 2);
      }
      ctx!.clearRect(0, 0, w, h);
      ctx!.drawImage(base, 0, 0, w, h);
    }

    function heatUp(px: number, py: number) {
      const c0 = Math.max(0, Math.floor((px - RADIUS) / CELL));
      const c1 = Math.min(cols - 1, Math.floor((px + RADIUS) / CELL));
      const r0 = Math.max(0, Math.floor((py - RADIUS) / CELL));
      const r1 = Math.min(rows - 1, Math.floor((py + RADIUS) / CELL));
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const d = Math.hypot(c * CELL + CELL / 2 - px, r * CELL + CELL / 2 - py);
          if (d > RADIUS) continue;
          const i = r * cols + c;
          const v = (1 - d / RADIUS) ** 1.6;
          if (v > heat[i]) {
            heat[i] = v;
            active.add(i);
          }
        }
      }
    }

    function frame(t: number) {
      raf = requestAnimationFrame(frame);
      if (!visible) return;

      // Bez ruchu myszy (lub na dotyku) światło dryfuje samo.
      if (t - pointer.last > 2500) {
        pointer.tx = w * (0.62 + 0.28 * Math.sin(t * 0.00033));
        pointer.ty = h * (0.45 + 0.3 * Math.sin(t * 0.00051 + 1));
      }
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      heatUp(pointer.x, pointer.y);

      // Losowe „glitche” w tle.
      for (let k = 0; k < 3; k++) {
        const i = Math.floor(Math.random() * heat.length);
        heat[i] = Math.max(heat[i], 0.45 + Math.random() * 0.3);
        active.add(i);
      }

      ctx!.font = font;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      for (const i of active) {
        const x = (i % cols) * CELL;
        const y = Math.floor(i / cols) * CELL;
        heat[i] *= 0.93;
        if (Math.random() < heat[i] * 0.25) glyphs[i] = rand();

        ctx!.globalAlpha = 1;
        ctx!.clearRect(x, y, CELL, CELL);
        ctx!.drawImage(base, x * dpr, y * dpr, CELL * dpr, CELL * dpr, x, y, CELL, CELL);

        if (heat[i] < 0.02) {
          heat[i] = 0;
          active.delete(i);
          continue;
        }
        ctx!.clearRect(x, y, CELL, CELL);
        ctx!.globalAlpha = Math.min(1, heat[i] * 1.15);
        ctx!.fillStyle = heat[i] > 0.82 ? "#ffffff" : accent;
        ctx!.fillText(CHARS[glyphs[i]], x + CELL / 2, y + CELL / 2);
      }
      ctx!.globalAlpha = 1;
    }

    function onMove(e: PointerEvent) {
      if (e.pointerType === "touch") return;
      const rect = canvas!.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
      pointer.last = performance.now();
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);
    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_80%_70%_at_60%_45%,black_30%,transparent_100%)]"
    />
  );
}
