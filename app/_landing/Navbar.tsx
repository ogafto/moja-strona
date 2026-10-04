"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { NavLink } from "@/lib/cms/types";

type Props = { siteName: string; links: NavLink[]; ctaLabel: string; ctaUrl: string };

export default function Navbar({ siteName, links, ctaLabel, ctaUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState("");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Podświetlenie linku do sekcji, która jest aktualnie na ekranie.
  useEffect(() => {
    const sections = links
      .filter((l) => l.href.startsWith("#") && l.href.length > 1)
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveId(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [links]);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
    >
      <nav
        className={`relative mx-auto flex max-w-6xl items-center justify-between overflow-hidden rounded-2xl border px-4 py-3 transition-all duration-500 md:px-5 ${
          scrolled ? "border-line bg-bg/70 shadow-2xl shadow-black/40 backdrop-blur-xl" : "border-transparent bg-transparent"
        }`}
      >
        <a href="#top" className="group flex items-center gap-1 font-mono text-sm font-medium tracking-tight">
          <span className="text-accent">~/</span>
          <span className="text-fg">{siteName}</span>
          <span className="caret ml-0.5 inline-block h-4 w-2 translate-y-px bg-accent" />
        </a>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {links.map((l, i) => {
            const active = l.href === `#${activeId}`;
            return (
              <li key={l.id}>
                <a
                  href={l.href}
                  className={`relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    active ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {active && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-lg bg-white/[0.06]" transition={{ type: "spring", stiffness: 400, damping: 35 }} />
                  )}
                  <span className="font-mono text-[11px] text-accent/80">{String(i + 1).padStart(2, "0")}</span>
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {ctaLabel && ctaUrl && <a
            href={ctaUrl}
            className="group hidden items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-bg transition-transform hover:-translate-y-0.5 sm:flex"
          >
            {ctaLabel}
            <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
          </a>}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            className="grid size-10 place-items-center rounded-xl border border-line text-fg md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        <motion.span aria-hidden style={{ scaleX: progress }} className="absolute inset-x-0 bottom-0 h-px origin-left bg-accent/70" />
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="mx-auto mt-2 max-w-6xl rounded-2xl border border-line bg-bg/95 p-3 backdrop-blur-xl md:hidden"
          >
            {links.map((l, i) => (
              <a
                key={l.id}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-lg text-fg hover:bg-white/5"
              >
                <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                {l.label}
              </a>
            ))}
            {ctaLabel && ctaUrl && <a
              href={ctaUrl}
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 font-semibold text-bg"
            >
              {ctaLabel} <ArrowUpRight className="size-4" />
            </a>}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
