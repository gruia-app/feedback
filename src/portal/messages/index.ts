import type { PortalLocale } from "../locales.js";
import type { PortalMessages } from "../types.js";
import de from "./de.js";
import en from "./en.js";
import es from "./es.js";
import fr from "./fr.js";
import it from "./it.js";
import pt from "./pt.js";

/** Raw catalogs, with `{appName}`, `{count}` and `{date}` still uninterpolated. */
export const PORTAL_MESSAGES: Readonly<Record<PortalLocale, PortalMessages>> = { es, en, fr, de, pt, it };
