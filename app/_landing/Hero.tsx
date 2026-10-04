"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import type { SiteContent, Stat } from "@/lib/cms/types";
import GlyphField from "./GlyphField";
import { useScramble } from "./useScramble";

const ease = [0.16, 1, 0.3, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease } },
};

type Hero = SiteContent["hero"];

export default function Hero({ hero, stats }: { hero: Hero; stats: Stat[] }) {
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-20 pt-32">
      <GlyphField />
      <div aria-hidden className="pointer-events-none absolute -top-40 right-[-10%] -z-10 size-[620px] rounded-full bg-accent/15 blur-[140px]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-4 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
          {hero.badge && <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2.5 rounded-full border border-line bg-bg/60 py-1.5 pl-2.5 pr-4 font-mono text-xs text-muted backdrop-blur"
          >
            <span className="relative flex size-2">
              {hero.available && <span className="ping-soft absolute inset-0 rounded-full bg-accent" />}
              <span className={`relative size-2 rounded-full ${hero.available ? "bg-accent" : "bg-muted"}`} />
            </span>
            {hero.badge}
          </motion.div>}

          <motion.h1 variants={fadeUp} className="mt-7 text-[clamp(2.6rem,7vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-fg">
            <ScrambleText text={hero.title_lead} />
            <br />
            <RotatingWord words={hero.rotating_words} />
          </motion.h1>

          {hero.subtitle && <motion.p variants={fadeUp} className="mt-7 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            {hero.subtitle}
          </motion.p>}

          <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-3 sm:flex-row">
            {hero.primary_cta_label && hero.primary_cta_url && <a
              href={hero.primary_cta_url}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-accent px-6 py-3.5 font-semibold text-bg transition-transform hover:-translate-y-0.5"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              {hero.primary_cta_label}
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
            </a>}
            {hero.secondary_cta_label && hero.secondary_cta_url && <a
              href={hero.secondary_cta_url}
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white/[0.03] px-6 py-3.5 font-medium text-fg backdrop-blur transition-colors hover:border-accent/50 hover:bg-white/[0.06]"
            >
              {hero.secondary_cta_label}
              <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
            </a>}
          </motion.div>

          {stats.length > 0 && (
            <motion.dl variants={fadeUp} className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.id} className="bg-bg/80 px-4 py-4 backdrop-blur">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-mono text-2xl font-medium tracking-tight text-fg">{s.value}</dd>
                  <dd className="mt-1 text-xs text-muted">{s.label}</dd>
                </div>
              ))}
            </motion.dl>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40, rotateX: 18 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 1.2, delay: 0.35, ease }} className="[perspective:1200px]">
          <Terminal hero={hero} />
        </motion.div>
      </div>

      <a href="#uslugi" aria-label="Przewiń w dół" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col [@media(min-width:768px)_and_(min-height:860px)]:flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-fg">
        scroll
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <motion.span className="absolute inset-x-0 top-0 h-4 bg-accent" animate={{ y: [-16, 40] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
        </span>
      </a>
    </section>
  );
}

function ScrambleText({ text }: { text: string }) {
  const out = useScramble(text, 1100);
  return (
    <span aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  );
}

function RotatingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (words.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % words.length), 2800);
    return () => clearInterval(id);
  }, [words.length]);
  const out = useScramble(words[i] ?? "", 650);

  return (
    <span className="relative inline-block font-serif text-[1.08em] font-normal italic tracking-[-0.02em] text-accent" aria-live="polite">
      <span aria-label={words[i]}>
        <span aria-hidden>{out}</span>
      </span>
      <span className="caret ml-1 inline-block h-[0.75em] w-[0.08em] translate-y-[0.06em] bg-accent" aria-hidden />
    </span>
  );
}

/** Okno terminala, które samo „wpisuje” komendy. Lekko obraca się za kursorem. */
function Terminal({ hero }: { hero: Hero }) {
  const steps: { cmd: string; out: ReactNode }[] = [
    {
      cmd: "whoami",
      out: (
        <>
          <p className="text-fg">
            {hero.name} <span className="text-muted">—</span> <span className="text-accent">{hero.role}</span>
          </p>
          <p className="text-muted">↳ {hero.location}</p>
        </>
      ),
    },
    {
      cmd: "cat stack.json",
      out: (
        <p className="text-muted">
          [
          {hero.stack.map((s, i) => (
            <span key={s + i}>
              <span className="text-[#7dd3fc]">&quot;{s}&quot;</span>
              {i < hero.stack.length - 1 && ", "}
            </span>
          ))}
          ]
        </p>
      ),
    },
    {
      cmd: "status --now",
      out: (
        <p className={hero.available ? "text-accent" : "text-muted"}>
          {hero.available ? "●" : "○"} {hero.badge || (hero.available ? "dostępny" : "brak wolnych terminów")}
        </p>
      ),
    },
  ];

  const [step, setStep] = useState(0);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setStep(steps.length));
      return () => cancelAnimationFrame(id);
    }
    if (step >= steps.length) return;
    const cmd = steps[step].cmd;
    const id = setTimeout(
      () => {
        if (chars < cmd.length) setChars((c) => c + 1);
        else {
          setStep((s) => s + 1);
          setChars(0);
        }
      },
      chars === 0 ? 650 : chars < cmd.length ? 55 + Math.random() * 60 : 380,
    );
    return () => clearTimeout(id);
  }, [step, chars, steps.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 18 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 18 });

  return (
    <motion.div
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative"
    >
      <div aria-hidden className="absolute -inset-px rounded-2xl bg-gradient-to-br from-accent/50 via-transparent to-accent/10 opacity-70 blur-[2px]" />
      <div className="relative overflow-hidden rounded-2xl border border-line bg-panel/90 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-xs text-muted">zsh — ~/portfolio</span>
          {hero.avatar && (
            <Image src={hero.avatar} alt={hero.name} width={28} height={28} className="ml-auto size-7 rounded-full object-cover ring-1 ring-line" />
          )}
        </div>

        <div className="min-h-[300px] space-y-3 p-5 font-mono text-[13px] leading-relaxed" style={{ transform: "translateZ(30px)" }}>
          {steps.map((s, i) =>
            i > step ? null : (
              <div key={s.cmd}>
                <p>
                  <span className="text-accent">❯</span> <span className="text-muted">~/portfolio</span>{" "}
                  <span className="text-fg">{i === step ? s.cmd.slice(0, chars) : s.cmd}</span>
                  {i === step && <span className="caret ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 bg-fg" />}
                </p>
                {i < step && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-1 pl-4">
                    {s.out}
                  </motion.div>
                )}
              </div>
            ),
          )}
          {step >= steps.length && (
            <p>
              <span className="text-accent">❯</span> <span className="text-muted">~/portfolio</span>{" "}
              <span className="caret inline-block h-3.5 w-2 translate-y-0.5 bg-fg" />
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
