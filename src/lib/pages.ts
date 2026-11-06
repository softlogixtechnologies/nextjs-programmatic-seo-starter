import servicesData from "../../data/services.json";
import locationsData from "../../data/locations.json";
import { evaluate } from "./quality";
import type { Location, Page, Service } from "./types";

export const services = servicesData as Service[];
export const locations = locationsData as Location[];

const byServiceSlug = new Map(services.map((s) => [s.slug, s]));
const byLocationSlug = new Map(locations.map((l) => [l.slug, l]));

export const pagePath = (serviceSlug: string, locationSlug: string) => `/${serviceSlug}/${locationSlug}`;

function clamp(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

function buildPage(service: Service, location: Location): Page {
  const place = `${location.city}, ${location.regionCode}`;
  const airportCodes = location.airports.map((a) => a.code).join(", ");

  return {
    service,
    location,
    path: pagePath(service.slug, location.slug),
    h1: `${service.name} in ${place}`,
    title: clamp(`${service.name} in ${place} | Flat Rates`, 60),
    description: clamp(
      `${service.name} in ${location.city}${airportCodes ? ` for ${airportCodes}` : ""}. ${service.summary}`,
      155,
    ),
    quality: evaluate(service, location, locations),
  };
}

/** Every service × location combination, including ones held back by the gate. */
export function getAllCandidatePages(): Page[] {
  return services.flatMap((s) => locations.map((l) => buildPage(s, l)));
}

/** Only pages that pass the quality gate. Use for routes, links and the sitemap. */
export function getPublishablePages(): Page[] {
  return getAllCandidatePages().filter((p) => p.quality.publishable);
}

export function getPage(serviceSlug: string, locationSlug: string): Page | null {
  const service = byServiceSlug.get(serviceSlug);
  const location = byLocationSlug.get(locationSlug);
  if (!service || !location) return null;
  const page = buildPage(service, location);
  return page.quality.publishable ? page : null;
}

export function getService(slug: string): Service | null {
  return byServiceSlug.get(slug) ?? null;
}

export function getPublishableLocationsFor(serviceSlug: string): Location[] {
  return getPublishablePages()
    .filter((p) => p.service.slug === serviceSlug)
    .map((p) => p.location);
}

/**
 * Internal links for a page: the same service in nearby locations, and other
 * services in the same location. Only publishable targets are returned, so
 * the site never links to a page it chose not to build.
 */
export function getRelated(page: Page): { nearby: Page[]; otherServices: Page[] } {
  const publishable = new Set(getPublishablePages().map((p) => p.path));

  const nearby = page.location.nearby
    .map((slug) => byLocationSlug.get(slug))
    .filter((l): l is Location => Boolean(l))
    .map((l) => buildPage(page.service, l))
    .filter((p) => publishable.has(p.path));

  const otherServices = services
    .filter((s) => s.slug !== page.service.slug)
    .map((s) => buildPage(s, page.location))
    .filter((p) => publishable.has(p.path));

  return { nearby, otherServices };
}
