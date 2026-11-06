import Link from "next/link";
import { getPublishableLocationsFor, services } from "@/lib/pages";
import { SITE } from "@/lib/site";

export default function HomePage() {
  const live = services.filter((s) => getPublishableLocationsFor(s.slug).length > 0);

  return (
    <main>
      <h1>{SITE.name}</h1>
      <ul>
        {live.map((s) => (
          <li key={s.slug}>
            <Link href={`/${s.slug}`}>{s.name}</Link>: {s.summary}
          </li>
        ))}
      </ul>
    </main>
  );
}
