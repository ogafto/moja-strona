"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight, Bot, Cloud, CodeXml, Database, Gauge, Globe, LayoutDashboard,
  Palette, Server, ShieldCheck, ShoppingCart, Smartphone, type LucideIcon,
} from "lucide-react";
import type { SectionHeader, Service } from "@/lib/cms/types";
import SectionHeading from "./SectionHeading";

const ICONS: Record<string, LucideIcon> = {
  globe: Globe,
  layout: LayoutDashboard,
  cart: ShoppingCart,
  server: Server,
  bot: Bot,
  gauge: Gauge,
  smartphone: Smartphone,
  database: Database,
  shield: ShieldCheck,
  code: CodeXml,
  palette: Palette,
  cloud: Cloud,
};

const price = new Intl.NumberFormat("pl-PL");

type Props = { section: SectionHeader; services: Service[]; contactUrl: string };

export default function Services({ section, services, contactUrl }: Props) {
  return (
    <section id="uslugi" className="relative mx-auto max-w-6xl px-4 py-28 md:py-36">
      <SectionHeading eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} />

      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => {
          const Icon = ICONS[s.icon] ?? CodeXml;
          return (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-panel transition-colors duration-300 hover:border-accent/30"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "radial-gradient(420px circle at var(--mx) var(--my), color-mix(in srgb, var(--accent) 13%, transparent), transparent 60%)" }}
              />

              <div className="relative flex items-center gap-1.5 border-b border-line px-4 py-2.5 font-mono text-[11px] text-muted">
                <span className="size-2 rounded-full bg-white/10 transition-colors group-hover:bg-[#ff5f57]" />
                <span className="size-2 rounded-full bg-white/10 transition-colors delay-75 group-hover:bg-[#febc2e]" />
                <span className="size-2 rounded-full bg-white/10 transition-colors delay-150 group-hover:bg-[#28c840]" />
                {s.file_name && <span className="ml-2">{s.file_name}</span>}
                <span className="ml-auto text-accent/70">{String(i + 1).padStart(2, "0")}</span>
              </div>

              <div className="relative flex flex-1 flex-col p-6">
                <div className="grid size-11 place-items-center rounded-xl border border-line bg-bg text-accent transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                  <Icon className="size-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight text-fg">{s.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  <span className="font-mono text-accent/60">{"// "}</span>
                  {s.description}
                </p>

                {s.tags.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <li key={t} className="rounded-md border border-line bg-white/[0.02] px-2 py-0.5 font-mono text-[11px] text-muted">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-6 flex items-center justify-between border-t border-dashed border-line pt-4">
                  {s.price_from > 0 ? (
                    <p className="font-mono text-sm text-fg">
                      <span className="text-muted">od </span>
                      {price.format(s.price_from)} zł
                    </p>
                  ) : (
                    <p className="font-mono text-sm text-muted">wycena indywidualna</p>
                  )}
                  <a
                    href={contactUrl}
                    aria-label={`Zapytaj o: ${s.title}`}
                    className="grid size-9 place-items-center rounded-full border border-line text-muted transition-all group-hover:border-accent group-hover:bg-accent group-hover:text-bg"
                  >
                    <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
                  </a>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
