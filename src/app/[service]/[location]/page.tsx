import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPage, getPublishablePages, getRelated } from "@/lib/pages";
import { breadcrumbSchema, faqSchema, serviceSchema, toJsonLd } from "@/lib/schema";
import { absoluteUrl, SITE } from "@/lib/site";

type Params = { service: string; location: string };

/** Build only pages that pass the quality gate; anything else 404s. */
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getPublishablePages().map((p) => ({ service: p.service.slug, location: p.location.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { service, location } = await params;
  const page = getPage(service, location);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: absoluteUrl(page.path) },
    openGraph: {
      title: page.title,
      description: page.description,
      url: absoluteUrl(page.path),
      siteName: SITE.name,
      type: "website",
    },
  };
}

export default async function ServiceLocationPage({ params }: { params: Promise<Params> }) {
  const { service: serviceSlug, location: locationSlug } = await params;
  const page = getPage(serviceSlug, locationSlug);
  if (!page) notFound();

  const { service, location } = page;
  const { nearby, otherServices } = getRelated(page);

  const jsonLd = [
    serviceSchema(page),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: service.name, path: `/${service.slug}` },
      { name: location.city, path: page.path },
    ]),
    faqSchema(service.faqs),
  ];

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLd) }} />

      <nav aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href={`/${service.slug}`}>{service.name}</Link> / {location.city}
      </nav>

      <h1>{page.h1}</h1>
      <p>{service.summary}</p>
      <p>
        From {service.currency} {service.priceFrom}. <a href={`tel:${SITE.phone}`}>Call {SITE.phone}</a>
      </p>

      <section>
        <h2>
          {service.name} around {location.city}
        </h2>
        <p>{location.intro}</p>
      </section>

      {location.airports.length > 0 && (
        <section>
          <h2>Airports we serve from {location.city}</h2>
          <ul>
            {location.airports.map((a) => (
              <li key={a.code}>
                {a.name} ({a.code})
              </li>
            ))}
          </ul>
        </section>
      )}

      {location.landmarks.length > 0 && (
        <section>
          <h2>Popular pickup areas</h2>
          <p>
            We regularly pick up and drop off in {location.landmarks.join(", ")} and across {location.region}.
          </p>
        </section>
      )}

      <section>
        <h2>What&apos;s included</h2>
        <ul>
          {service.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>
          {service.name} in {location.city}: FAQs
        </h2>
        {service.faqs.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>

      {(nearby.length > 0 || otherServices.length > 0) && (
        <aside>
          {nearby.length > 0 && (
            <>
              <h2>
                {service.name} near {location.city}
              </h2>
              <ul>
                {nearby.map((p) => (
                  <li key={p.path}>
                    <Link href={p.path}>{p.h1}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          {otherServices.length > 0 && (
            <>
              <h2>More services in {location.city}</h2>
              <ul>
                {otherServices.map((p) => (
                  <li key={p.path}>
                    <Link href={p.path}>{p.h1}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>
      )}
    </main>
  );
}
