import type { SectionHeader, SiteContent } from "./types";

export const CMS_IMAGE_HOSTS = ["www.afto.works", "afto.works"];

type Raw = Record<string, unknown>;

const isObj = (v: unknown): v is Raw => typeof v === "object" && v !== null && !Array.isArray(v);
const missing = (v: unknown) => v === undefined || v === null;

/** Tekst z CMS-a (pusty też jest poprawny — wtedy element się chowa). Brak pola → fallback. */
function text(v: unknown, fallback: string, max = 2000): string {
  if (missing(v)) return fallback;
  return typeof v === "string" ? v.trim().slice(0, max) : fallback;
}

/** Tekst, bez którego strona nie ma sensu (np. logo) — pusty też zastępujemy fallbackiem. */
function required(v: unknown, fallback: string, max = 2000): string {
  return text(v, "", max) || fallback;
}

function num(v: unknown, fallback: number): number {
  if (missing(v) || v === "") return missing(v) ? fallback : 0;
  const n = typeof v === "string" ? Number(v.replace(",", ".")) : v;
  return typeof n === "number" && Number.isFinite(n) && n >= 0 ? n : fallback;
}

function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
}

/** Tylko bezpieczne schematy: http(s), mailto, tel, kotwice i ścieżki względne. Pusty → "". */
function url(v: unknown, fallback: string): string {
  if (missing(v)) return fallback;
  const t = text(v, "");
  if (!t) return "";
  if (t.startsWith("#") || (t.startsWith("/") && !t.startsWith("//"))) return t;
  try {
    const u = new URL(t);
    return ["http:", "https:", "mailto:", "tel:"].includes(u.protocol) ? u.toString() : fallback;
  } catch {
    return fallback;
  }
}

/** Obrazy tylko z dozwolonych hostów (next.config images.remotePatterns) albo lokalne. */
function image(v: unknown, fallback: string): string {
  if (missing(v)) return fallback;
  const t = text(v, "");
  if (!t) return "";
  if (t.startsWith("/") && !t.startsWith("//")) return t;
  try {
    const u = new URL(t);
    return u.protocol === "https:" && CMS_IMAGE_HOSTS.includes(u.hostname) ? u.toString() : "";
  } catch {
    return "";
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
  if (missing(v)) return fallback;
  return text(v, "").split(sep).map((s) => s.trim()).filter(Boolean).slice(0, 20);
}

/** Lista w kolejności z API; pozycje bez wymaganych pól są pomijane. Pusta lista = ukryta sekcja. */
function list<T>(v: unknown, fallback: T[], map: (item: Raw, i: number) => T | null): T[] {
  if (!Array.isArray(v)) return fallback;
  return v.flatMap((item, i) => {
    if (!isObj(item)) return [];
    const mapped = map(item, i);
    return mapped ? [mapped] : [];
  });
}

const id = (item: Raw, i: number) => required(item.id, String(i), 100);

function section(v: unknown, f: SectionHeader): SectionHeader {
  if (!isObj(v)) return f;
  return {
    hidden: bool(v.hidden, f.hidden),
    eyebrow: text(v.eyebrow, f.eyebrow, 120),
    title: text(v.title, f.title, 200),
    subtitle: text(v.subtitle, f.subtitle, 600),
  };
}

/**
 * Zamienia surową treść z CMS-a na bezpieczne, otypowane dane strony.
 * Brakujące sekcje/pola biorą wartość z `fb`; obecne (nawet puste) są respektowane.
 */
export function normalizeContent(raw: unknown, fb: SiteContent): SiteContent {
  const c = isObj(raw) ? raw : {};
  const obj = (key: string): Raw => (isObj(c[key]) ? (c[key] as Raw) : {});

  const settings = obj("settings");
  const seo = obj("seo");
  const navbar = obj("navbar");
  const hero = obj("hero");
  const footer = obj("footer");

  return {
    settings: {
      site_name: required(settings.site_name, fb.settings.site_name, 60),
      accent_color: color(settings.accent_color, fb.settings.accent_color),
      email: email(settings.email, fb.settings.email),
    },
    seo: {
      title: required(seo.title, fb.seo.title, 120),
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
        icon: required(it.icon, "code", 20).toLowerCase(),
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
