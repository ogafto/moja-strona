// Wysyła schemat z cms/schema.json do panelu afto.works (PUT /schema).
// Użycie: npm run cms:schema   (czyta AFTO_CMS_URL i AFTO_CMS_SECRET z .env.local)
import { readFile } from "node:fs/promises";

const { AFTO_CMS_URL, AFTO_CMS_SECRET } = process.env;

if (!AFTO_CMS_URL || !AFTO_CMS_SECRET) {
  console.error("Brak AFTO_CMS_URL lub AFTO_CMS_SECRET w zmiennych środowiskowych.");
  process.exit(1);
}

const schema = JSON.parse(await readFile(new URL("../cms/schema.json", import.meta.url), "utf8"));

const res = await fetch(`${AFTO_CMS_URL.replace(/\/$/, "")}/schema`, {
  method: "PUT",
  headers: {
    Authorization: `Bearer ${AFTO_CMS_SECRET}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(schema),
});

const body = await res.text();
if (!res.ok) {
  console.error(`PUT /schema nie powiódł się: ${res.status} ${body}`);
  process.exit(1);
}

console.log(`Schemat wysłany (${schema.collections.length} sekcji): ${schema.collections.map((c) => c.key).join(", ")}`);
