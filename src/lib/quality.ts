import type { Location, QualityResult, Service } from "./types";

/**
 * Quality gate. A page is only generated, linked and listed in the sitemap if
 * it carries enough location-specific substance to stand on its own.
 *
 * Google's spam policies treat pages mass-produced from a template with
 * little unique value as "scaled content abuse". The gate below is how this
 * starter avoids shipping those: no unique local copy, no page.
 */

export const MIN_INTRO_CHARS = 200;
export const MIN_LOCAL_FACTS = 2;
export const MIN_FAQS = 2;
export const MAX_INTRO_SIMILARITY = 0.6;

/** Word 3-gram shingles, for a cheap near-duplicate check between intros. */
function shingles(text: string, size = 3): Set<string> {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const out = new Set<string>();
  for (let i = 0; i + size <= words.length; i++) out.add(words.slice(i, i + size).join(" "));
  return out;
}

export function similarity(a: string, b: string): number {
  const sa = shingles(a);
  const sb = shingles(b);
  if (sa.size === 0 || sb.size === 0) return 0;
  let shared = 0;
  for (const s of sa) if (sb.has(s)) shared++;
  return shared / (sa.size + sb.size - shared);
}

export function evaluate(service: Service, location: Location, allLocations: Location[]): QualityResult {
  const reasons: string[] = [];

  if (location.intro.trim().length < MIN_INTRO_CHARS) {
    reasons.push(`intro is shorter than ${MIN_INTRO_CHARS} characters`);
  }

  const localFacts = location.airports.length + location.landmarks.length;
  if (localFacts < MIN_LOCAL_FACTS) {
    reasons.push(`fewer than ${MIN_LOCAL_FACTS} local facts (airports + landmarks)`);
  }

  if (service.faqs.length < MIN_FAQS) {
    reasons.push(`service has fewer than ${MIN_FAQS} FAQs`);
  }

  for (const other of allLocations) {
    if (other.slug === location.slug) continue;
    const score = similarity(location.intro, other.intro);
    if (score > MAX_INTRO_SIMILARITY) {
      reasons.push(`intro is ${Math.round(score * 100)}% similar to ${other.slug}`);
    }
  }

  return { publishable: reasons.length === 0, reasons };
}
