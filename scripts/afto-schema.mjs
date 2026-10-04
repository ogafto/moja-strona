// Wysyła schemat (cms/schema.json) razem z obecną treścią strony (cms/defaults.json) do panelu afto.works.
// Użycie: npm run cms:schema   (czyta AFTO_CMS_URL, AFTO_CMS_SECRET i REVALIDATE_TOKEN z .env.local)
import { readFile } from "node:fs/promises";

const { AFTO_CMS_URL, AFTO_CMS_SECRET, REVALIDATE_TOKEN } = process.env;
const SITE_URL = process.env.SITE_URL || "https://moja-strona-weld.vercel.app";

if (!AFTO_CMS_URL || !AFTO_CMS_SECRET) {
  console.error("Brak AFTO_CMS_URL lub AFTO_CMS_SECRET w zmiennych środowiskowych.");
  process.exit(1);
}

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
const schema = await readJson("../cms/schema.json");
const defaults = await readJson("../cms/defaults.json");

const body = {
  ...(REVALIDATE_TOKEN && { webhook: `${SITE_URL}/api/revalidate?token=${REVALIDATE_TOKEN}` }),
  collections: schema.collections.map((c) => ({ ...c, defaults: defaults[c.key] })),
};

const base = AFTO_CMS_URL.replace(/\/$/, "");
const headers = { Authorization: `Bearer ${AFTO_CMS_SECRET}`, "Content-Type": "application/json" };

const res = await fetch(`${base}/schema`, { method: "PUT", headers, body: JSON.stringify(body) });
const json = await res.json().catch(() => ({}));
if (!res.ok) {
  console.error(`PUT /schema nie powiódł się: ${res.status} ${JSON.stringify(json)}`);
  process.exit(1);
}

const warnings = json.warnings ?? [];
for (const c of json.collections ?? []) console.log(`  ${c.key}: seeded=${c.seeded ?? "?"}`);
if (warnings.length) {
  console.error("Ostrzeżenia z panelu:", warnings);
  process.exit(1);
}
console.log(`Schemat wysłany (${body.collections.length} sekcji)${body.webhook ? " + webhook" : ""}.`);
