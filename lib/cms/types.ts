export type NavLink = { id: string; label: string; href: string };
export type Stat = { id: string; value: string; label: string };
export type Service = {
  id: string;
  title: string;
  description: string;
  file_name: string;
  icon: string;
  tags: string[];
  price_from: number;
};
export type FaqItem = { id: string; question: string; answer: string };
export type SocialLink = { id: string; platform: string; url: string };
export type SectionHeader = { hidden: boolean; eyebrow: string; title: string; subtitle: string };

export type SiteContent = {
  settings: { site_name: string; accent_color: string; email: string };
  seo: { title: string; description: string; og_image: string };
  navbar: { cta_label: string; cta_url: string };
  nav_links: NavLink[];
  hero: {
    badge: string;
    available: boolean;
    title_lead: string;
    rotating_words: string[];
    subtitle: string;
    primary_cta_label: string;
    primary_cta_url: string;
    secondary_cta_label: string;
    secondary_cta_url: string;
    name: string;
    role: string;
    location: string;
    stack: string[];
    avatar: string;
  };
  hero_stats: Stat[];
  services_section: SectionHeader;
  services: Service[];
  faq_section: SectionHeader;
  faq: FaqItem[];
  footer: { cta_title: string; cta_subtitle: string; copyright: string };
  social_links: SocialLink[];
};
