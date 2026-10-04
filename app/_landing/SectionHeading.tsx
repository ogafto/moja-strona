"use client";

import { motion } from "framer-motion";

type Props = { eyebrow: string; title: string; subtitle?: string; className?: string };

/** Nagłówek sekcji; ostatnie słowo tytułu pisane kursywą szeryfową. */
export default function SectionHeading({ eyebrow, title, subtitle, className = "" }: Props) {
  const cut = title.lastIndexOf(" ");
  const head = cut > 0 ? title.slice(0, cut + 1) : "";
  const tail = cut > 0 ? title.slice(cut + 1) : title;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
        <span className="h-px w-8 bg-accent/60" />
        {eyebrow}
      </p>
      <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-fg md:text-6xl">
        {head}
        <span className="font-serif font-normal italic tracking-[-0.01em]">{tail}</span>
      </h2>
      {subtitle && <p className="mt-5 max-w-xl leading-relaxed text-muted">{subtitle}</p>}
    </motion.div>
  );
}
