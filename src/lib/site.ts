/** Site-wide settings. Override with environment variables in production. */
export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Example Limo Co.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  phone: process.env.NEXT_PUBLIC_SITE_PHONE ?? "+1-000-000-0000",
};

export const absoluteUrl = (path: string) => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
