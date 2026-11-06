export interface Faq {
  q: string;
  a: string;
}

export interface Service {
  slug: string;
  name: string;
  /** Lowercase noun used inside sentences: "airport transfer". */
  noun: string;
  summary: string;
  priceFrom: number;
  currency: string;
  features: string[];
  faqs: Faq[];
}

export interface Airport {
  code: string;
  name: string;
}

export interface Location {
  slug: string;
  city: string;
  region: string;
  regionCode: string;
  country: string;
  geo: { lat: number; lng: number };
  airports: Airport[];
  landmarks: string[];
  /** Slugs of other locations to cross-link. */
  nearby: string[];
  /** Hand-written local copy. The quality gate requires it. */
  intro: string;
}

export interface QualityResult {
  publishable: boolean;
  reasons: string[];
}

export interface Page {
  service: Service;
  location: Location;
  path: string;
  title: string;
  description: string;
  h1: string;
  quality: QualityResult;
}
