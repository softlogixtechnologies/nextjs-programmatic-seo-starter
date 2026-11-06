import { SITE, absoluteUrl } from "./site";
import type { Faq, Page } from "./types";

type JsonLd = Record<string, unknown>;

export function serviceSchema(page: Page): JsonLd {
  const { service, location } = page;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.h1,
    serviceType: service.name,
    description: service.summary,
    url: absoluteUrl(page.path),
    provider: {
      "@type": "LocalBusiness",
      name: SITE.name,
      url: SITE.url,
      telephone: SITE.phone,
    },
    areaServed: {
      "@type": "City",
      name: location.city,
      containedInPlace: { "@type": "State", name: location.region },
      geo: { "@type": "GeoCoordinates", latitude: location.geo.lat, longitude: location.geo.lng },
    },
    offers: {
      "@type": "Offer",
      priceCurrency: service.currency,
      price: service.priceFrom,
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: service.priceFrom,
        priceCurrency: service.currency,
      },
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: Faq[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Serialise JSON-LD safely for a <script> tag (no closing-tag injection). */
export const toJsonLd = (data: JsonLd | JsonLd[]) => JSON.stringify(data).replace(/</g, "\\u003c");
