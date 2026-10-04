import { getContent } from "@/lib/cms";
import Faq from "../_landing/Faq";
import Footer from "../_landing/Footer";
import Hero from "../_landing/Hero";
import Navbar from "../_landing/Navbar";
import Services from "../_landing/Services";

// Treści z CMS-a odświeżane co 60 s (ISR) lub od razu przez /api/revalidate.
export const revalidate = 60;

export default async function Home() {
  const c = await getContent();

  return (
    <div className="grain">
      <Navbar siteName={c.settings.site_name} links={c.nav_links} ctaLabel={c.navbar.cta_label} ctaUrl={c.navbar.cta_url} />
      <main>
        <Hero hero={c.hero} stats={c.hero_stats} />
        {!c.services_section.hidden && c.services.length > 0 && <Services section={c.services_section} services={c.services} contactUrl={c.navbar.cta_url} />}
        {!c.faq_section.hidden && c.faq.length > 0 && <Faq section={c.faq_section} items={c.faq} contactUrl={`mailto:${c.settings.email}`} contactLabel={c.settings.email} />}
      </main>
      <Footer footer={c.footer} email={c.settings.email} siteName={c.settings.site_name} socials={c.social_links} />
    </div>
  );
}
