/**
 * Content audit: which service × location pages will be built, which are held
 * back by the quality gate, and why. Run before every data change:
 *
 *   npm run audit
 *
 * Exits with code 1 when nothing would be published, which usually means a
 * data file is empty or malformed. Wire it into CI to catch that before deploy.
 */
import { getAllCandidatePages } from "../src/lib/pages";

const pages = getAllCandidatePages();
const live = pages.filter((p) => p.quality.publishable);
const held = pages.filter((p) => !p.quality.publishable);

console.log(`\nCandidates: ${pages.length}   Publishable: ${live.length}   Held back: ${held.length}\n`);

for (const p of live) {
  console.log(`  ✔ ${p.path.padEnd(42)} ${p.title}`);
}

if (held.length) {
  console.log("\nHeld back by the quality gate:");
  for (const p of held) {
    console.log(`  ✘ ${p.path}`);
    for (const r of p.quality.reasons) console.log(`      - ${r}`);
  }
}

const longTitles = live.filter((p) => p.title.length > 60);
if (longTitles.length) {
  console.log(`\nWarning: ${longTitles.length} titles over 60 characters.`);
}

console.log("");
if (live.length === 0) process.exit(1);
