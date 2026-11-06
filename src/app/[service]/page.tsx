import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishableLocationsFor, getService, pagePath, services } from "@/lib/pages";
import { breadcrumbSchema, toJsonLd } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

type Params = { service: string };

export const dynamicParams = false;

/** A hub page only exists if at least one location page under it is publishable. */
export function generateStaticParams(): Params[] {
  return services
    .filter((s) => getPublishableLocationsFor(s.slug).length > 0)
    .map((s) => ({ service: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { service: slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: `${service.name} | Locations We Serve`,
    description: service.summary,
    alternates: { canonical: absoluteUrl(`/${service.slug}`) },
  };
}

export default async function ServiceHubPage({ params }: { params: Promise<Params> }) {
  const { service: slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const cities = getPublishableLocationsFor(service.slug);
  if (cities.length === 0) notFound();

  const byRegion = new Map<string, typeof cities>();
  for (const l of cities) byRegion.set(l.region, [...(byRegion.get(l.region) ?? []), l]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: toJsonLd(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: service.name, path: `/${service.slug}` },
            ]),
          ),
        }}
      />
      <h1>{service.name}</h1>
      <p>{service.summary}</p>

      {[...byRegion.entries()].map(([region, list]) => (
        <section key={region}>
          <h2>{region}</h2>
          <ul>
            {list.map((l) => (
              <li key={l.slug}>
                <Link href={pagePath(service.slug, l.slug)}>
                  {service.name} in {l.city}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
