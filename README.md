<h1 align="center">Next.js Programmatic SEO Starter</h1>

<p align="center">
  <b>Service × location landing pages from JSON, with a quality gate that refuses to publish thin pages.</b><br/>
  App Router · static generation · JSON-LD · internal linking · sitemap · content audit
</p>

<p align="center">
  <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-green.svg"/>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js_15+-000000?logo=nextdotjs&logoColor=white"/>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript_strict-3178C6?logo=typescript&logoColor=white"/>
  <img alt="Schema.org" src="https://img.shields.io/badge/JSON--LD-Service_·_Breadcrumb_·_FAQ-6B21A8"/>
</p>

---

## Why this exists

Programmatic SEO works when every generated page earns its place, and it backfires when it doesn't. Google's spam policies name "scaled content abuse": many pages produced from a template with little unique value. Swapping a city name into the same paragraph a thousand times is exactly that.

This starter is the pattern we use for service businesses that sell the same thing in many places (ground transportation, movers, home services). It generates `/{service}/{location}` pages from two JSON files, and **a page only exists if it passes a quality gate**: hand-written local copy, real local facts, enough FAQs, and no near-duplicate intros. Pages that fail are not built, not linked and not in the sitemap. The audit tells you why.

## What you get

| Feature | Where |
|---|---|
| Static `/{service}/{location}` pages, `dynamicParams = false` | `src/app/[service]/[location]/page.tsx` |
| Service hub pages grouped by region | `src/app/[service]/page.tsx` |
| Quality gate (length, local facts, FAQs, near-duplicate detection) | `src/lib/quality.ts` |
| Titles ≤ 60 and descriptions ≤ 155 characters, cut on word boundaries | `src/lib/pages.ts` |
| JSON-LD: `Service` + `LocalBusiness` provider, `BreadcrumbList`, `FAQPage` | `src/lib/schema.ts` |
| Internal links: same service nearby, other services same city, only to live pages | `getRelated()` in `src/lib/pages.ts` |
| Canonicals and Open Graph per page | `generateMetadata` |
| `sitemap.xml` and `robots.txt` from the same publishable set | `src/app/sitemap.ts`, `src/app/robots.ts` |
| Content audit that runs before every build | `scripts/audit.ts` |

## Quick start

```bash
npm install
cp .env.example .env.local     # set site name, URL and phone
npm run audit                  # see which pages will be built and which are held back
npm run dev
```

Open `http://localhost:3000/airport-transfer/new-york-ny`.

The sample data has 3 services and 5 locations. One location (`springfield-xx`) is deliberately thin, so the audit shows the gate at work:

```
Candidates: 15   Publishable: 12   Held back: 3

  ✔ /airport-transfer/new-york-ny              Airport Transfer in New York, NY | Flat Rates
  ...
Held back by the quality gate:
  ✘ /airport-transfer/springfield-xx
      - intro is shorter than 200 characters
      - fewer than 2 local facts (airports + landmarks)
```

## Adding your data

**`data/services.json`**: one entry per service with `slug`, `name`, `noun`, `summary`, `priceFrom`, `currency`, `features[]`, `faqs[]`.

**`data/locations.json`**: one entry per city with `slug`, `city`, `region`, `regionCode`, `geo`, `airports[]`, `landmarks[]`, `nearby[]` (slugs to cross-link) and `intro`.

`intro` is the part that makes a page worth indexing. Write it per location, about how the service actually works there: traffic patterns, which airport is quicker, where pickups happen, seasonal demand. If you can't say something specific about a place, the page shouldn't exist yet, and the gate will hold it back.

Tune the thresholds at the top of `src/lib/quality.ts`:

```ts
export const MIN_INTRO_CHARS = 200;
export const MIN_LOCAL_FACTS = 2;
export const MIN_FAQS = 2;
export const MAX_INTRO_SIMILARITY = 0.6;   // 3-gram Jaccard between intros
```

## Scaling it

The JSON files are the simplest source. For hundreds of locations, replace the two imports at the top of `src/lib/pages.ts` with a CMS or database fetch; nothing else changes. The gate, links, schema and sitemap all read from `getPublishablePages()`.

Read [`docs/methodology.md`](docs/methodology.md) for how we plan, write and roll out programmatic pages without tripping quality systems.

## Verified

- `npm run audit` output above is from the sample data in this repo.
- TypeScript strict mode passes on all source files.

## Need it built for you?

Built and maintained by **[SOFTLOGIX Technologies](https://softlogixtechnologies.com/)**, a software development and performance marketing company in Lahore, Pakistan. We build programmatic SEO systems on Next.js, run Google Ads and Meta Ads, and train in-house teams.

Related: [ga4-gtm-conversion-tracking-kit](https://github.com/softlogixtechnologies/ga4-gtm-conversion-tracking-kit), so the traffic these pages earn is measured properly.

📧 [info@softlogixtechnologies.com](mailto:info@softlogixtechnologies.com) · 🌐 [softlogixtechnologies.com](https://softlogixtechnologies.com/)

## License

MIT.
