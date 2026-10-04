"use client";

import { motion } from "framer-motion";
import { Check, Copy, GitBranch, Link as LinkIcon, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import {
  FaDiscord, FaDribbble, FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaTiktok, FaXTwitter, FaYoutube,
} from "react-icons/fa6";
import type { SiteContent, SocialLink } from "@/lib/cms/types";

const SOCIAL: Record<string, IconType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  x: FaXTwitter,
  twitter: FaXTwitter,
  instagram: FaInstagram,
  youtube: FaYoutube,
  discord: FaDiscord,
  facebook: FaFacebook,
  tiktok: FaTiktok,
  dribbble: FaDribbble,
};

type Props = { footer: SiteContent["footer"]; email: string; siteName: string; socials: SocialLink[] };

export default function Footer({ footer, email, siteName, socials }: Props) {
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  const cut = footer.cta_title.lastIndexOf(" ");
  const head = cut > 0 ? footer.cta_title.slice(0, cut + 1) : "";
  const tail = cut > 0 ? footer.cta_title.slice(cut + 1) : footer.cta_title;

  return (
    <footer id="kontakt" className="relative overflow-hidden border-t border-line">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />

      <div className="mx-auto max-w-6xl px-4 pb-10 pt-28 md:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{"<kontakt />"}</p>
          <h2 className="mt-6 max-w-4xl text-[clamp(2.6rem,7.5vw,6rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-fg">
            {head}
            <span className="font-serif font-normal italic text-accent">{tail}</span>
          </h2>
          <p className="mt-6 max-w-xl leading-relaxed text-muted">{footer.cta_subtitle}</p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={`mailto:${email}`}
              className="group inline-flex items-center gap-3 rounded-2xl border border-line bg-panel px-5 py-4 font-mono text-base text-fg transition-colors hover:border-accent/50 md:text-lg"
            >
              <Mail className="size-5 text-accent" />
              {email}
            </a>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-4 font-semibold text-bg transition-transform hover:-translate-y-0.5"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Skopiowano!" : "Kopiuj adres"}
            </button>
          </div>

          {socials.length > 0 && (
            <ul className="mt-10 flex flex-wrap gap-2">
              {socials.map((s) => {
                const Icon = SOCIAL[s.platform];
                return (
                  <li key={s.id}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.platform}
                      className="grid size-11 place-items-center rounded-xl border border-line text-muted transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
                    >
                      {Icon ? <Icon className="size-[18px]" /> : <LinkIcon className="size-[18px]" />}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </motion.div>
      </div>

      <p
        aria-hidden
        className="pointer-events-none select-none whitespace-nowrap bg-gradient-to-b from-white/[0.09] to-transparent bg-clip-text text-center font-semibold leading-none tracking-[-0.06em] text-transparent"
        style={{ fontSize: `min(${Math.max(8, 150 / Math.max(siteName.length, 1))}vw, 13rem)` }}
      >
        {siteName}
      </p>

      {/* Pasek statusu w stylu edytora kodu */}
      <div className="border-t border-line bg-panel/80 font-mono text-[11px] text-muted">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5">
          <span className="flex items-center gap-1.5 text-accent">
            <GitBranch className="size-3.5" /> main
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="size-3.5" /> 0 błędów
          </span>
          {time && <span>{time} · Warszawa</span>}
          <span className="hidden sm:inline">UTF-8</span>
          <span className="w-full sm:ml-auto sm:w-auto">{footer.copyright}</span>
        </div>
      </div>
    </footer>
  );
}
