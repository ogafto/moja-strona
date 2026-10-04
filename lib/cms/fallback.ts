import defaults from "@/cms/defaults.json";
import { normalizeContent } from "./normalize";
import type { SiteContent } from "./types";

const header = { hidden: false, eyebrow: "", title: "", subtitle: "" };

const EMPTY: SiteContent = {
  settings: { site_name: "", accent_color: "#B6FF3B", email: "" },
  seo: { title: "", description: "", og_image: "" },
  navbar: { cta_label: "", cta_url: "" },
  nav_links: [],
  hero: {
    badge: "", available: false, title_lead: "", rotating_words: [], subtitle: "",
    primary_cta_label: "", primary_cta_url: "", secondary_cta_label: "", secondary_cta_url: "",
    name: "", role: "", location: "", stack: [], avatar: "",
  },
  hero_stats: [],
  services_section: header,
  services: [],
  faq_section: header,
  faq: [],
  footer: { cta_title: "", cta_subtitle: "", copyright: "" },
  social_links: [],
};

/**
 * Treści awaryjne (gdy API CMS-a nie odpowiada) — ta sama treść, którą skrypt
 * `npm run cms:schema` wysyła do panelu jako `defaults`. Jedno źródło: cms/defaults.json.
 */
export const fallbackContent: SiteContent = normalizeContent(defaults, EMPTY);
