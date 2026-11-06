# Programmatic SEO methodology

How we plan, write and roll out service × location pages. The code enforces the minimum; this document covers the judgment around it.

## 1. Validate the pattern before building pages

Pick the page pattern from search demand, not from what's easy to generate.

- Check that people search the pattern in a few sample places (`airport transfer jersey city`, `wedding limo boston`), in Google Ads Keyword Planner or Search Console queries from existing pages.
- Look at what currently ranks. If the results are aggregators and directories, a single-business location page has a harder job and needs stronger local content.
- Confirm the business actually serves every location you plan to publish. A page for a city you can't service is a bad lead even when it ranks.

## 2. Decide what makes each page different

Every page needs something a visitor in that place would care about and couldn't get from the page next door. For transportation businesses that usually means:

- Which airports and terminals apply, and which one is faster from here.
- Traffic patterns, tunnels, bridges and peak windows that change pickup timing.
- Where pickups really happen (lobbies, loading docks, hotel forecourts, baggage claim).
- Local demand spikes: conferences, university calendars, wedding season, events.

If a location doesn't have at least a paragraph of that, it isn't ready. That's what `intro` and the quality gate are for.

## 3. Write intros by hand, then check for overlap

Draft each `intro` individually. Run `npm run audit`: any intro more than 60% similar (3-gram Jaccard) to another location's is flagged, which catches copy-paste-and-swap drafts.

Keep template text (features, FAQs) at the service level, where repetition across cities is honest because the service really is the same.

## 4. Roll out in batches

Launch the strongest 10 to 30 locations first, ideally the ones with the most demand and the best local copy. Then:

- Submit the sitemap in Search Console.
- Watch the Page indexing report for "Crawled, currently not indexed" and "Duplicate without user-selected canonical". A high rate on a batch means the pages aren't differentiated enough; improve them before publishing more.
- Watch impressions and clicks per page in the Performance report, filtered by the `/{service}/` prefix.

Expand only after the first batch is indexed and earning impressions.

## 5. Link like a site, not a list

- Hubs link to every live location for that service, grouped by region.
- Each location page links to the same service in nearby locations and to other services in the same location.
- Never link to a page the gate held back. `getRelated()` already enforces this.

## 6. Measure what matters

Rankings are a means. Track leads and bookings per page with the [GA4 + GTM Conversion Tracking Kit](https://github.com/softlogixtechnologies/ga4-gtm-conversion-tracking-kit), then prune or rewrite pages that get traffic but no conversions.

## 7. Maintain

- Re-run the audit on every data change; the build runs it automatically.
- Review held-back pages monthly and either write real local copy or drop the location.
- Remove pages for areas the business stops serving, and redirect them to the nearest hub.
