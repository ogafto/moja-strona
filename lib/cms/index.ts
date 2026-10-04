import "server-only";
import { cache } from "react";
import { fallbackContent } from "./fallback";
import { normalizeContent } from "./normalize";
import type { SiteContent } from "./types";

export type * from "./types";

const DEFAULT_CMS_URL = "https://www.afto.works/api/cms/pk_SyWT2aRGoN9mOrex";
export const CMS_TAG = "cms";

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Pobiera treści z afto.works (publiczny endpoint, cache 60 s + tag do natychmiastowego odświeżenia).
 * Gdy API odpowie, strona pokazuje dokładnie treść z panelu. Treści awaryjne tylko przy błędzie API.
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
    if (!isObj(json) || !isObj(json.content)) throw new Error("nieprawidłowa odpowiedź");
    return normalizeContent(json.content, fallbackContent);
  } catch (err) {
    console.warn(`[cms] Używam treści awaryjnych: ${err instanceof Error ? err.message : "nieznany błąd"}`);
    return fallbackContent;
  }
});
