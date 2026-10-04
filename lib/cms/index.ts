import "server-only";
import { cache } from "react";
import { fallbackContent as fb } from "./fallback";
import type { SectionHeader, SiteContent } from "./types";

export type * from "./types";

const DEFAULT_CMS_URL = "https://www.afto.works/api/cms/pk_SyWT2aRGoN9mOrex";
export const CMS_TAG = "cms";
export const CMS_IMAGE_HOSTS = ["www.afto.works", "afto.works"];

type Raw = Record<string, unknown>;

const isObj = (v: unknown): v is Raw => typeof v === "object" && v !== null && !Array.isArray(v);

/** Niepusty tekst albo fallback. */
function text(v: unknown, fallback: string, max = 2000): string {
  if (typeof v !== "string") return fallback;
  const t = v.trim();
  return t ? t.slice(0, max) : fallback;
}

function num(v: unknown, fallback: number): number {
  const n = typeof v === "string" ? Number(v.replace(",", ".")) : v;
  return typeof n === "number" && Number.isFinite(n) && n >= 0 ? n : fallback;
}

function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
}

/** Tylko bezpieczne schematy: http(s), mailto, tel, kotwice i ścieżki względne. */
function url(v: unknown, fallback: string): string {
  const t = text(v, "");
  if (!t) return fallback;
  if (t.startsWith("#") || (t.startsWith("/") && !t.startsWith("//"))) return t;
  try {
    const u = new URL(t);
    return ["http:", "https:", "mailto:", "tel:"].includes(u.protocol) ? u.toString() : fallback;
  } catch {
    return fallback;
  }
}

/** Obrazy tylko z dozwolonych hostów (patrz next.config images.remotePatterns) albo lokalne. */
function image(v: unknown, fallback: string): string {
  const t = text(v, "");
  if (!t) return fallback;
  if (t.startsWith("/") && !t.startsWith("//")) return t;
  try {
    const u = new URL(t);
    return u.protocol === "https:" && CMS_IMAGE_HOSTS.includes(u.hostname) ? u.toString() : fallback;
  } catch {
    return fallback;
  }
}

function color(v: unknown, fallback: string): string {
  const t = text(v, "");
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(t) ? t : fallback;
}

function email(v: unknown, fallback: string): string {
  const t = text(v, "", 254);
  return /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(t) ? t : fallback;
}

function splitList(v: unknown, fallback: string[], sep: RegExp): string[] {
  const t = text(v, "");
  if (!t) return fallback;
  const items = t.split(sep).map((s) => s.trim()).filter(Boolean).slice(0, 20);
  return items.length ? items : fallback;
}

/** Lista z API w oryginalnej kolejności; pozycje bez wymaganych pól są pomijane. Pusta → fallback. */
function list<T>(v: unknown, fallback: T[], map: (item: Raw, i: number) => T | null): T[] {
  if (!Array.isArray(v)) return fallback;
  const out = v.flatMap((item, i) => {
    if (!isObj(item)) return [];
    const mapped = map(item, i);
    return mapped ? [mapped] : [];
  });
  return out.length ? out : fallback;
}

const id = (item: Raw, i: number) => text(item.id, String(i), 100);

function section(v: unknown, f: SectionHeader): SectionHeader {
  const s = isObj(v) ? v : {};
  return {
    hidden: bool(s.hidden, f.hidden),
    eyebrow: text(s.eyebrow, f.eyebrow, 120),
    title: text(s.title, f.title, 200),
    subtitle: text(s.subtitle, f.subtitle, 600),
  };
}

export function normalizeContent(raw: unknown): SiteContent {
  const c = isObj(raw) ? raw : {};
  const obj = (key: string): Raw => (isObj(c[key]) ? (c[key] as Raw) : {});

  const settings = obj("settings");
  const seo = obj("seo");
  const navbar = obj("navbar");
  const hero = obj("hero");
  const footer = obj("footer");

  return {
    settings: {
      site_name: text(settings.site_name, fb.settings.site_name, 60),
      accent_color: color(settings.accent_color, fb.settings.accent_color),
      email: email(settings.email, fb.settings.email),
    },
    seo: {
      title: text(seo.title, fb.seo.title, 120),
      description: text(seo.description, fb.seo.description, 320),
      og_image: image(seo.og_image, fb.seo.og_image),
    },
    navbar: {
      cta_label: text(navbar.cta_label, fb.navbar.cta_label, 40),
      cta_url: url(navbar.cta_url, fb.navbar.cta_url),
    },
    nav_links: list(c.nav_links, fb.nav_links, (it, i) => {
      const label = text(it.label, "", 40);
      const href = url(it.href, "");
      return label && href ? { id: id(it, i), label, href } : null;
    }),
    hero: {
      badge: text(hero.badge, fb.hero.badge, 80),
      available: bool(hero.available, fb.hero.available),
      title_lead: text(hero.title_lead, fb.hero.title_lead, 80),
      rotating_words: splitList(hero.rotating_words, fb.hero.rotating_words, /\r?\n/).map((w) => w.slice(0, 40)),
      subtitle: text(hero.subtitle, fb.hero.subtitle, 500),
      primary_cta_label: text(hero.primary_cta_label, fb.hero.primary_cta_label, 40),
      primary_cta_url: url(hero.primary_cta_url, fb.hero.primary_cta_url),
      secondary_cta_label: text(hero.secondary_cta_label, fb.hero.secondary_cta_label, 40),
      secondary_cta_url: url(hero.secondary_cta_url, fb.hero.secondary_cta_url),
      name: text(hero.name, fb.hero.name, 60),
      role: text(hero.role, fb.hero.role, 60),
      location: text(hero.location, fb.hero.location, 60),
      stack: splitList(hero.stack, fb.hero.stack, /[,\n]/).map((s) => s.slice(0, 30)),
      avatar: image(hero.avatar, fb.hero.avatar),
    },
    hero_stats: list(c.hero_stats, fb.hero_stats, (it, i) => {
      const value = text(it.value, "", 12);
      const label = text(it.label, "", 40);
      return value && label ? { id: id(it, i), value, label } : null;
    }).slice(0, 4),
    services_section: section(c.services_section, fb.services_section),
    services: list(c.services, fb.services, (it, i) => {
      const title = text(it.title, "", 80);
      const description = text(it.description, "", 600);
      if (!title || !description) return null;
      return {
        id: id(it, i),
        title,
        description,
        file_name: text(it.file_name, "", 40),
        icon: text(it.icon, "code", 20).toLowerCase(),
        tags: splitList(it.tags, [], /,/).map((t) => t.slice(0, 24)).slice(0, 6),
        price_from: num(it.price_from, 0),
      };
    }),
    faq_section: section(c.faq_section, fb.faq_section),
    faq: list(c.faq, fb.faq, (it, i) => {
      const question = text(it.question, "", 200);
      const answer = text(it.answer, "", 2000);
      return question && answer ? { id: id(it, i), question, answer } : null;
    }),
    footer: {
      cta_title: text(footer.cta_title, fb.footer.cta_title, 120),
      cta_subtitle: text(footer.cta_subtitle, fb.footer.cta_subtitle, 400),
      copyright: text(footer.copyright, fb.footer.copyright, 160).replaceAll("{rok}", String(new Date().getFullYear())),
    },
    social_links: list(c.social_links, fb.social_links, (it, i) => {
      const platform = text(it.platform, "", 20).toLowerCase();
      const href = url(it.url, "");
      return platform && href ? { id: id(it, i), platform, url: href } : null;
    }),
  };
}

/**
 * Pobiera treści z afto.works (publiczny endpoint, cache 60 s + tag do natychmiastowego odświeżenia).
 * Nigdy nie rzuca — przy błędzie zwraca treści awaryjne.
 */
export const getContent = cache(async (): Promise<SiteContent> => {
  const endpoint = process.env.AFTO_CMS_URL || DEFAULT_CMS_URL;
  try {
    const res = await fetch(endpoint, {
      next: { revalidate: 60, tags: [CMS_TAG] },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: unknown = await res.json();
    return normalizeContent(isObj(json) ? json.content : undefined);
  } catch (err) {
    console.warn(`[cms] Używam treści awaryjnych: ${err instanceof Error ? err.message : "nieznany błąd"}`);
    return normalizeContent(undefined);
  }
});
