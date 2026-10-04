"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { FaqItem, SectionHeader } from "@/lib/cms/types";
import SectionHeading from "./SectionHeading";

type Props = { section: SectionHeader; items: FaqItem[]; contactUrl: string; contactLabel: string };

export default function Faq({ section, items, contactUrl, contactLabel }: Props) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <section id="faq" className="relative border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-28 md:py-36 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} />
          <a href={contactUrl} className="mt-8 inline-flex items-center gap-2 font-mono text-sm text-accent underline-offset-4 hover:underline">
            {contactLabel} →
          </a>
        </div>

        <ul className="border-t border-line">
          {items.map((item, i) => {
            const isOpen = open === item.id;
            const panelId = `faq-${item.id}`;
            return (
              <li key={item.id} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : item.id)}
                    className="group flex w-full items-start gap-5 py-6 text-left"
                  >
                    <span className={`mt-1 font-mono text-xs transition-colors ${isOpen ? "text-accent" : "text-muted"}`}>
                      Q.{String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`flex-1 text-lg font-medium tracking-tight transition-colors md:text-xl ${isOpen ? "text-fg" : "text-fg/80 group-hover:text-fg"}`}>
                      {item.question}
                    </span>
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                        isOpen ? "rotate-45 border-accent bg-accent text-bg" : "border-line text-muted group-hover:border-fg/40"
                      }`}
                    >
                      <Plus className="size-4" />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="whitespace-pre-line pb-7 pl-[3.25rem] pr-12 leading-relaxed text-muted">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
