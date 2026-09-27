# La Bruja Artesana · Roadmap

Step-by-step order for carrying out `PLAN.md`, with the design-file fixes added first.

**Main constraint:** the author's writing, not the code, is what will slow the launch most. No tool can go live while its data is still marked `draft`. The author should start writing as soon as the data templates exist (Step 5), while the code work continues.

---

## Step 0 · Decisions needed before any code

- [x] **GitHub account and repo name.** `camcamRV/La-Bruja-Artesana` (public, so GitHub Pages is free).
- [x] **Own domain now or later?** Now: `brujartesana.com`. No `base` path; `site: 'https://brujartesana.com'`, `public/CNAME`, and DNS pointed at GitHub Pages.
- [x] **Wordmark:** the script logo (`BA_LOGO.png`). Needs a transparent SVG version (vector from the designer if possible, otherwise traced). Cinzel text stays as the compact version in the nav.
- [x] **Tarot images:** our own deck, drawn in code as SVG from the design system (engraved gold lines, number, suit symbols, name in Cinzel, astrolabe motifs). No pictorial scenes, no scans, no AI images. Replaces the 1909 RWS scans.

**Follow-ups from these decisions (handled in Step 1):**

- [x] Update `PLAN.md` 4.1: `site: 'https://brujartesana.com'`, remove `base`, add `public/CNAME`.
- [x] Update `STYLE-GUIDE.md` 7.3 and `PLAN.md` 8.1/8.2: images come from the code-drawn deck, not RWS scans. Add `TarotCard` (generative) to `ornaments.json` and `components/ornaments/`.
- [x] Get or make `BA_LOGO.svg` (transparent, `currentColor`) and add it to `design/`.
- [ ] DNS at the registrar: apex `A` records to GitHub Pages IPs and `www` `CNAME` to `camcamrv.github.io` (done at deploy, Step 3).

## Step 1 · Fix the design files and bring `PLAN.md` in line with them

Done 2026-09-26. Editorial badge now `gold.700` (4.88:1). Realm-dependent tokens are emitted on `[data-realm]` (tested in Chrome, including print). Logo traced from the PNG to `design/BA_LOGO.svg`; replace it with the designer's vector if one turns up.

- [x] Rename `Design/` to `design/` (GitHub's Ubuntu CI is case-sensitive; all code refers to `design/`).
- [x] Fix the `var(--realm-*)` bug: `gradient.nebula`, `component.nav.bg`, `component.input.bg` and `component.plate.bg` resolve to nothing in `:root`. Move `data-realm` to `<html>` or write those tokens per realm.
- [x] Print theme: CSS can't set `data-realm="pergamino"`. Have the build script also write the parchment values inside `@media print`.
- [x] "Author's voice" badge fails contrast (`parchment.200` on `gold.600` = 3.13:1). Pick a darker background or a dark text color.
- [x] Font subsets: Noto Sans Symbols and Noto Sans Runic need their own subsets, not only `latin` and `latin-ext`.
- [x] Add Noto Sans Runic to the font table (section 4.1) and to the tokens' font list.
- [x] Remove `any` from `build-tokens.ts`.
- [x] Add `width`/`height` props to `Ornament.astro` for dividers.
- [x] Update `PLAN.md`: add `design/`, `scripts/build-tokens.ts` and `components/ornaments/` to the structure, and replace "`prefers-color-scheme`" (section 4.4) with the realm system.

## Step 2 · Phase 0: Repo and GitHub

- [ ] `git init`, add `CLAUDE.md` (from section 0 of the plan), connect to the existing `camcamRV/La-Bruja-Artesana` remote.
- [ ] Labels, issue templates, PR template, project board.
- [ ] Protect `main`: pull requests required, CI must pass.
- [ ] One issue per task. Create issues for Phases 1–3 now and add later phases as they are reached.

## Step 3 · Phase 1: Foundations

Built 2026-09-26, before Step 2 (git) by choice. Astro 7.3, Preact, TypeScript 6 (`@astrojs/check` does not support 7 yet). `astro check`: 0 errors. Vitest: 15 tests. Playwright: 35 tests at 320/768/1280 in both languages, including axe (WCAG 2.2 AA). Note: `astro preview` in Astro 7 keeps a lock file; Playwright runs it on port 4329 with `--ignore-lock`.

- [x] Set up Astro, Preact and strict TypeScript; write `astro.config.mjs`.
- [x] i18n: `ui.ts`, `routes.ts`, `utils.ts`, plus a test that ES and EN have the same text keys.
- [x] Design base: `build-tokens.ts` (running before `dev` and `build`), self-hosted fonts, `global.css`, `print.css`.
- [x] Page layout: `Base`, `Seo` (hreflang), `LangSwitcher`, `Header`, `Footer`.
- [x] CI and deploy workflows (written; first real run happens on push).
- [ ] **Milestone:** an empty site in both languages is live on GitHub Pages.

## Step 4 · Design system components

- [ ] `Ornament.astro` and the generated ornaments (StarField, Astrolabe, MoonPhase, Constellation).
- [ ] UI components: Button, Plate, Badge, ArchHero, PaperNote, Divider, Field, BookShelf.
- [ ] Preview page at `/dev/ui`, kept out of production.
- [ ] Automatic accessibility checks (axe in Playwright) in all three themes.

## Step 5 · Phase 2: Data (the author's work starts here)

- [ ] Data schemas (Zod) for every dataset.
- [ ] `rws.json` (78 cards) and `elder-futhark.json` (24 runes) containing **only verifiable facts**. Every interpretive field stays empty with `status: draft`.
- [ ] `check-datasets.ts`, data tests, `versions.json`.
- [ ] **Hand-off:** one `bloqueado-autora` issue per dataset. From here on the author writes in parallel with Steps 6–10.

## Step 6 · Phase 3: Core pages

- [ ] Home, Explore (tools without content show "Próximamente" / "Coming soon"), Readings, Works, About, FAQ, Contact, legal pages, 404, all in both languages.

## Step 7 · Shared code for all tools

- [ ] `random.ts` and `daily.ts` with their tests.
- [ ] `ToolResult`, saving to the device, sharing (canvas image plus Web Share), "Save as PDF" through printing.

## Step 8 · Phase 4: Random tools

- [ ] Card of the Day first (featured on the home page).
- [ ] Ask the Tarot, Runes, Shadow Work.
- [ ] Each goes live once the author's content for it is reviewed.

## Step 9 · Phase 5: Astronomy (the hardest technically)

- [ ] `time.ts` (local time to UTC, including daylight saving) and the GeoNames city data.
- [ ] Moon calendar, birth chart, star map, astrocartography.
- [ ] **Needed:** 10 reference birth charts from a recognized astrology program to check the calculations against.

## Step 10 · Phase 6: Symbolic tools

- [ ] Correspondences, Rituals, Sigils (write `docs/sigil-algorithm.md` first), Tu Esencia.

## Step 11 · Phase 7: Library and SEO

- [ ] Article pages, glossary, downloadable PDFs.
- [ ] Pagefind search, structured data (JSON-LD), social-preview (OG) images.
- [ ] Lighthouse 90+.

## Step 12 · Launch

Go through the plan's definition of done (section 12):

- [ ] Both languages work at 320px, tablet and desktop.
- [ ] `astro check`, Vitest and Playwright all pass.
- [ ] No `draft` data in published tools.
- [ ] WCAG 2.2 AA verified in both languages.
- [ ] No user data leaves the browser.

---

## How each session runs

One phase or one issue per session. Start in plan mode and get approval, then build on a branch, run `npm run check && npm test && npm run build`, and open a PR.
