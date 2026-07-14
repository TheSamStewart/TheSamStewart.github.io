# Design Research & Builder Instructions — Task 3.5

**Role:** Research Agent (read-only on site code). This document is the sole deliverable.
**Scope:** Elevate the professionalism and aesthetics of the Sam Stewart portfolio without violating the hard constraints in `CLAUDE.md`: vanilla HTML/CSS/JS only, **no external resources** (no CDN fonts or icons), the four-colour palette, the copy-paste templating contract, no accessibility regressions, and mobile + desktop both first-class.

Everything below was cross-checked against multiple 2025/2026 sources (design-trend roundups, CSS-Tricks, Smashing, Modern Font Stacks, MDN, WCAG guidance, Chrome/Web.dev, and hiring-manager portfolio write-ups). Sources are listed at the end.

---

## 1. Executive Summary

The site should feel like a **quiet, confident, editorial résumé** — the kind of page a recruiter opens and immediately trusts. The current build is already structurally strong (semantic HTML, progressive-enhancement accordion, scroll-shrink hero, sound contrast decisions). What it is missing is the last 15% of *polish and intent* that separates a competent skeleton from a page that reads as professionally designed: a hero that states a value proposition rather than just a name, generous and rhythmic whitespace, fluid typography that scales smoothly instead of jumping at breakpoints, cards with restrained modern depth, tasteful sub-250 ms micro-interactions, a real footer with contact affordances, and the invisible credibility signals (favicon, social preview cards, selection styling). The palette is deployed in a disciplined 60/30/10 way — light `#EEEEEE` field, navy structure, deep-navy accents — with no new colours introduced. Motion stays subtle, compositor-friendly, and fully respectful of `prefers-reduced-motion`. Dark mode is deliberately deferred as out of scope. The net effect: the same content, presented so it looks intentional, current, and hireable.

---

## 2. Research Findings

### 2.1 Typography
- **System font stacks are the right call here** and are not a compromise. Modern OSes ship excellent UI faces (Segoe UI Variable on Win11, San Francisco on Apple, Roboto on Android). The existing `system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` stack is essentially the recommended "System UI" stack from Modern Font Stacks. It costs zero network requests, eliminates FOUT, and covers this site's needs. Self-hosting a webfont would add weight and a maintenance surface for a marginal aesthetic gain — **rejected** for this scope. Keep the system stack.
- **Fluid type with `clamp()`** is the current standard for responsive type: one declaration scales smoothly between a min and max with no media-query jumps, and reduces CSS. The critical accessibility caveat: the "preferred" term must be **`rem`-based with only a small `vw` component** (e.g. `1rem + 0.2vw`), never pure `vw`, or browser-zoom/user-font-size scaling breaks. The current hero already uses `clamp()` correctly; the body and card scale should be brought onto the same system.
- **Body size trending to 16–18px.** Bumping body from a flat `1rem` to a fluid `clamp(1rem … 1.125rem)` improves readability on large screens, which is where recruiters often read.
- **Measure (line length) matters more than container width.** The 900px container is fine for layout, but body copy at 18px across ~810px runs ~75–90 characters — past the comfortable 45–75ch reading range. Constraining `-main-text` paragraphs to ~68ch keeps prose readable while leaving cards full-width.
- **`text-wrap: balance`** (headings) and **`text-wrap: pretty`** (body) are well-supported 2025 niceties that prevent orphans/ragged headline wraps — a cheap, high-impact professionalism signal.
- Two type styles max, contrast via **scale and weight**, not extra families — matches the minimalist brief. The site already does this (one family, weight 600 for emphasis).

### 2.2 Spacing / Layout
- Whitespace is the defining tool of minimalist professional design; generous vertical rhythm reads as "premium." The current spacing scale jumps `1rem → 1.5rem → 2.5rem`; adding a `--space-2xl` (4rem) gives sections room to breathe on desktop without cramping mobile.
- Card refinement trend: a thin border **plus** a soft layered shadow (the "Stripe/Linear/Notion" recipe) rather than either alone. The site already uses this hybrid — it just needs a two-layer shadow for more realistic depth.
- Grid-based, aligned layout with consistent gutters — already present via `.section-body { display:grid; gap }`.

### 2.3 Colour Usage
- **60/30/10 fits the palette perfectly:** ~60% `#EEEEEE` background field, ~30% navy structure (`#141E61` headings, nav, card accent bar, buttons), ~10% deep-navy accents (`#0F044C` primary text, hover states, focus ring). No new colours needed — the discipline is in *proportion*, not palette expansion.
- **Surface elevation:** white cards on the `#EEEEEE` field already create a subtle "raised" plane. This is the correct way to signal hierarchy in a light UI. A very subtle field/surface contrast is enough; avoid heavy gradients.
- **`#787A91` (third) fails normal-size contrast on `#EEEEEE` (~3.7:1)** — the codebase already correctly routes normal-size muted text to navy via `--color-muted-accessible`. Preserve this; do not "restore" grey text at body size.
- **Dark mode: deferred.** For a single-page minimalist résumé with a fixed light palette, a full second theme doubles the contrast-testing and token surface for limited recruiter value. It is feasible later via `prefers-color-scheme` + a parallel token set, but is **out of scope** now (see §4).

### 2.4 Micro-interactions & Motion
- **Durations:** 150–250 ms for simple UI transitions (hover/focus), up to ~350 ms for larger state changes (the accordion already uses 350 ms — good). Anything longer feels sluggish.
- **Easing:** `ease-out` for entrances/hovers (fast start, gentle settle → feels responsive). A refined `cubic-bezier(0.22, 1, 0.36, 1)` reads more premium than the default `ease`.
- **Restraint is the #1 rule.** Animate a *few* friction points (nav, CTA, cards, focus), not everything. Consistency of timing/easing across the site matters as much as consistency of colour.
- **Reduced-motion etiquette:** every effect must degrade to no-motion under `prefers-reduced-motion: reduce`. The codebase is already exemplary here — keep that standard for any new effect.
- **Scroll-reveal (optional):** modern CSS `animation-timeline: view()` can fade elements in as they enter the viewport with **no JS**, degrading gracefully where unsupported. Must be gated behind `@supports` + reduced-motion, and content must be visible by default without the effect. Lower priority here because accordion bodies are hidden until opened (see §3, item 12).

### 2.5 Professional Portfolio Conventions (what recruiters respond to)
- **Hero must state a value proposition, not just a name.** A bold name + a one-line "what I do / who I help" subhead + one focused CTA is the current best-practice hero. A name alone reads as unfinished. Add a tagline and a single primary CTA.
- **Single, focused CTA** keeps momentum — don't stack competing buttons in the hero.
- **Footer = contact + trust.** Recruiters look for an obvious way to reach you: email (as `mailto:`), LinkedIn/GitHub links, copyright, and a "back to top." An empty footer is a missed credibility opportunity (the current footer is empty).
- **Credibility signals:** a real favicon, clean social-share preview cards, and a descriptive `<title>`/meta description make the site look legitimate everywhere it's linked. Their *absence* is one of the fastest ways a site reads as "unfinished."

### 2.6 Polish Details
- **Shadows vs borders:** hybrid (thin border + soft layered shadow) is the dominant 2025 card pattern; keep border-radius constant and animate shadow/transform on hover (cheaper, shape stays stable).
- **Border-radius:** 10–12px reads as modern-professional for cards; ~6–8px for buttons/pills. Consistency matters more than the exact value.
- **Focus ring:** never `outline: none` without a replacement (WCAG failure). Best practice: `:focus-visible` with a ≥2px (use 3px) ring, `outline-offset`, and ≥3:1 contrast against both element and background. The site already does this well — unify it into a token so it stays consistent.
- **`::selection`** styling (navy highlight, light text) is a small, brand-reinforcing touch.
- **Custom scrollbar:** optional and low-value; if used, keep ≥3:1 contrast and don't shrink it (usability). Recommend a very light touch or skip.
- **Meta/OG/favicon:** `<title>` ~60 chars, meta description ~120–160 chars, Open Graph (`og:title/description/image/url/type`) + `twitter:card=summary_large_image`, favicon (an inline SVG data-URI avoids any external request). OG image ideally 1200×630.

---

## 3. Builder Instructions

Ordered, concrete, each tagged `[HIGH] / [MEDIUM] / [LOW]`. All changes stay within `index.html`, `css/style.css`, `js/main.js`. **Do not** rename or restructure the `{block}-title / -subtitle / -meta / -main-text` sub-classes — the templating contract must remain copy-paste compatible. Test at ≤600px and desktop after each visual change.

### A. `<head>` metadata, favicon, social cards — `index.html`

**1. [HIGH] Add meta description, Open Graph, Twitter card, favicon, and theme-color.**
Insert inside `<head>` (after the existing `<title>`):
```html
<meta name="description" content="Sam Stewart — portfolio and professional profile. Experience, education, competitions, and technical projects.">
<meta name="author" content="Sam Stewart">
<link rel="canonical" href="https://thesamstewart.github.io/">

<!-- Social share preview -->
<meta property="og:type" content="website">
<meta property="og:title" content="Sam Stewart | Portfolio">
<meta property="og:description" content="Experience, education, competitions, and technical projects.">
<meta property="og:url" content="https://thesamstewart.github.io/">
<meta property="og:image" content="https://thesamstewart.github.io/images/1781003854566.png">
<meta property="og:site_name" content="Sam Stewart">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Sam Stewart | Portfolio">
<meta name="twitter:description" content="Experience, education, competitions, and technical projects.">
<meta name="twitter:image" content="https://thesamstewart.github.io/images/1781003854566.png">

<meta name="theme-color" content="#141E61">

<!-- Inline SVG favicon: no external request, honours the no-CDN rule -->
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23141E61'/%3E%3Ctext x='16' y='23' font-family='system-ui,sans-serif' font-size='19' font-weight='700' text-anchor='middle' fill='%23EEEEEE'%3ES%3C/text%3E%3C/svg%3E">
```
Note: ideally supply a dedicated 1200×630 `og:image` later; the square portrait works as a fallback. Confirm the deployed base URL (`https://thesamstewart.github.io/`) before shipping.

### B. Design tokens — `css/style.css` `:root`

**2. [HIGH] Add motion, focus, measure, radius, and 2xl-spacing tokens.** Add to `:root`:
```css
/* --- Motion --- */
--dur-fast: 150ms;
--dur-mid: 250ms;
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);

/* --- Focus (unify existing per-element rings) --- */
--focus-ring: 3px solid var(--color-fourth);
--focus-offset: 3px;

/* --- Layout --- */
--space-2xl: 4rem;
--measure: 68ch;      /* comfortable reading line length for body copy */
--radius-btn: 8px;
```
Keep `--radius-card: 10px` (or bump to `12px` if preferred — apply consistently).

**3. [HIGH] Upgrade the card shadow to a two-layer soft shadow and add a hover shadow.** Replace the existing `--shadow-card`:
```css
--shadow-card: 0 1px 2px rgba(15, 4, 76, 0.05), 0 4px 14px rgba(15, 4, 76, 0.07);
--shadow-card-hover: 0 2px 4px rgba(15, 4, 76, 0.06), 0 10px 24px rgba(15, 4, 76, 0.10);
```

**4. [MEDIUM] Introduce a fluid type scale (rem-based, small vw term for zoom safety).** Add to `:root`:
```css
--text-meta:  clamp(0.80rem, 0.77rem + 0.12vw, 0.875rem);
--text-body:  clamp(1.00rem, 0.96rem + 0.20vw, 1.125rem);
--text-card-title: clamp(1.10rem, 1.02rem + 0.40vw, 1.375rem);
--text-section:    clamp(1.50rem, 1.24rem + 1.20vw, 2.00rem);
```
Then wire them up: `body { font-size: var(--text-body); }`, `.section-title { font-size: var(--text-section); }`, the four `*-title` rules → `var(--text-card-title)`, the four `*-meta` rules → `var(--text-meta)`. Leave the hero `clamp()` as-is (already correct). Verify nothing overflows at 320px width.

### C. Typography polish — `css/style.css`

**5. [HIGH] Add `text-wrap` refinements.**
```css
.hero-name, .section-title,
.experience-title, .education-item-title, .activity-title, .project-title {
  text-wrap: balance;
}
.experience-main-text p, .education-item-main-text p,
.activity-main-text p, .project-main-text p { text-wrap: pretty; }
```

**6. [MEDIUM] Constrain body copy to a readable measure** (keeps cards full-width, tightens prose only):
```css
.experience-main-text, .education-item-main-text,
.activity-main-text, .project-main-text { max-width: var(--measure); }
```
This uses only existing contract sub-classes — copy-paste compatibility is unaffected.

**7. [HIGH] Add `::selection` styling.**
```css
::selection { background: var(--color-secondary); color: var(--color-bg); }
```

### D. Hero: value proposition + CTA — `index.html` + `css/style.css`

**8. [HIGH] Add a tagline and one focused CTA to the hero.** Replace the current `.hero-inner` contents so the text is grouped:
```html
<div class="hero-inner">
  <div class="hero-text">
    <h1 class="hero-name">Sam Stewart</h1>
    <p class="hero-tagline">[Your role — e.g. "Software Engineer building reliable, well-crafted web apps."]</p>
    <a class="hero-cta" href="#professional-experience">View my experience</a>
  </div>
  <img
    class="hero-image"
    src="images/1781003854566.png"
    alt="Portrait of Sam Stewart"
    width="800" height="800" decoding="async">
</div>
```
The CTA reuses the existing nav/accordion hand-off: `js/main.js` already opens `#professional-experience` and moves focus when an in-page anchor to it is clicked. **Note for the Builder:** the current nav click handler is scoped to `.site-nav`; the hero CTA is a plain anchor + `scroll-behavior:smooth` will still scroll to the (fully-expanded, no-JS or JS) section. If you want the CTA to also *open* the accordion like nav links do, broaden the handler's delegation target, or add `class="site-nav-link"`-equivalent handling — optional, `[LOW]`.

CSS:
```css
.hero-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-sm);
}
.hero-tagline {
  margin: 0;
  max-width: 40ch;
  color: var(--color-secondary);
  font-size: var(--text-body);
  line-height: 1.4;
}
.hero-cta {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  margin-top: var(--space-xs);
  padding: 0.7rem 1.5rem;
  background: var(--color-secondary);
  color: var(--color-bg);
  border-radius: var(--radius-btn);
  box-shadow: var(--shadow-card);
  font-weight: 600;
  text-decoration: none;
  transition: background var(--dur-fast) var(--ease-out),
              transform var(--dur-mid) var(--ease-out),
              box-shadow var(--dur-mid) var(--ease-out);
}
.hero-cta:hover { background: var(--color-fourth); transform: translateY(-2px); box-shadow: var(--shadow-card-hover); }
.hero-cta:focus-visible { outline: var(--focus-ring); outline-offset: var(--focus-offset); }
```
Contrast: `#EEEEEE` on `#141E61` ≈ 11.6:1 and on `#0F044C` higher — both pass AA. In the existing `@media (max-width: 600px)` hero rule, add `align-items: center;` to `.hero-text` so the stacked mobile hero stays centred:
```css
@media (max-width: 600px) {
  .hero-text { align-items: center; text-align: center; }
}
```
Reduced-motion: add `.hero-cta` transform to the existing reduced-motion guard, or wrap the `transform` change in `@media (prefers-reduced-motion: no-preference)`.

### E. Card micro-interaction — `css/style.css`

**9. [MEDIUM] Add a subtle hover lift to entry cards** (only where a real pointer exists; disable transform under reduced motion). Extend the shared card rule:
```css
.experience, .education-item, .activity, .project {
  transition: transform var(--dur-mid) var(--ease-out),
              box-shadow var(--dur-mid) var(--ease-out);
}
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .experience:hover, .education-item:hover, .activity:hover, .project:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-card-hover);
  }
}
```
`@media (hover: hover)` prevents sticky-hover on touch; the reduced-motion clause removes the movement for users who opt out (shadow-only fallback is fine). Keeps border-radius constant per performance best practice.

### F. Focus ring unification — `css/style.css`

**10. [MEDIUM] Replace the repeated `outline: 3px solid var(--color-fourth)` rules with the token** so all focus rings stay identical. Update `.site-nav-link:focus-visible`, `.section-title:focus-visible`, `.section-toggle:focus-visible` (and the new `.hero-cta:focus-visible`) to:
```css
outline: var(--focus-ring);
outline-offset: var(--focus-offset);   /* keep existing per-element offsets where they were larger (e.g. 4px on headings) */
```
Purely a consistency refactor — no visual regression, no behaviour change.

### G. Footer: contact + trust — `index.html` + `css/style.css` + `js/main.js`

**11. [HIGH] Populate the footer.** Replace the empty `<footer>`:
```html
<footer class="site-footer">
  <ul class="footer-links" aria-label="Contact">
    <li><a href="mailto:samstew367@gmail.com">samstew367@gmail.com</a></li>
    <li><a href="#" rel="me noopener">LinkedIn</a></li>
    <li><a href="#" rel="me noopener">GitHub</a></li>
  </ul>
  <p class="footer-copy">&copy; <span id="footer-year">2026</span> Sam Stewart</p>
  <a class="footer-top" href="#top">Back to top &uarr;</a>
</footer>
```
Replace the `#` placeholders with real profile URLs when available. CSS:
```css
.footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-md);
  margin: 0 0 var(--space-sm);
  padding: 0;
  list-style: none;
}
.footer-links a, .footer-top {
  color: var(--color-secondary);
  text-decoration: none;
  font-weight: 600;
  border-bottom: 1px solid transparent;
  transition: border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
}
.footer-links a:hover, .footer-top:hover { color: var(--color-fourth); border-bottom-color: currentColor; }
.footer-links a:focus-visible, .footer-top:focus-visible { outline: var(--focus-ring); outline-offset: var(--focus-offset); }
.footer-copy { margin: 0 0 var(--space-sm); }
.footer-top { display: inline-block; }
```
The existing `.site-footer` already centres and sets muted colour — keep it. Optional tiny JS (auto-year, so the copyright never goes stale) added inside the existing `DOMContentLoaded` handler in `js/main.js`:
```js
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
```

### H. Optional scroll-reveal — `css/style.css`

**12. [LOW] Pure-CSS scroll reveal for section blocks** (no JS, degrades to fully visible where unsupported or reduced-motion). Gate strictly:
```css
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .section {
      animation: reveal-up linear both;
      animation-timeline: view();
      animation-range: entry 5% cover 20%;
    }
    @keyframes reveal-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: none; }
    }
  }
}
```
**Caveat to verify:** a `transform` on `.section` creates a containing block; confirm it doesn't visually fight the sticky nav or the `scroll-margin-top` anchor landing. If any jitter appears, restrict the effect to a wrapper inside the section, or drop this item — it is the lowest-value change here.

### I. Optional scrollbar tint — `css/style.css`

**13. [LOW] Subtle scrollbar colour** (keep it full-width for usability, ≥3:1 contrast):
```css
html { scrollbar-color: var(--color-third) var(--color-bg); }
```
Standard property only; skip WebKit pseudo-elements to avoid shrinking the bar. Optional — low value, ship only if desired.

---

## 4. Out of Scope / Rejected

- **Dark mode / `prefers-color-scheme` theme** — doubles token + contrast-testing surface for a fixed-palette minimalist résumé; low recruiter payoff. Revisit later with a parallel token set.
- **Self-hosted / webfont** — adds page weight and a build/maintenance surface; violates the spirit of the no-external-resource rule and the system stack already looks professional. Rejected.
- **Icon library / SVG icon set (social/UI icons)** — no CDN allowed and inlining a full set is overkill; text links + the existing CSS chevron suffice. Rejected.
- **Parallax / large decorative scroll animations** — reads as flashy, not professional; conflicts with the minimalist brief and reduced-motion etiquette.
- **Testimonials / logo wall / stats band** — strong credibility patterns, but this is a personal skeleton the owner fills in; adding empty trust-signal scaffolding would look unfinished. Owner-driven, not a design task.
- **Replacing the boxed nav pills with underline-only text links** — a valid minimalist alternative, but it would override contrast/tap-target decisions already QA'd in Tasks 3.3/3.4 for marginal gain. Left as-is.
- **Restyling the portrait to a rounded-rect / square** — the circular framed portrait is a clean, conventional professional choice; no change recommended.

---

## 5. Sources

- Envato Elements — Portfolio design trends: https://elements.envato.com/learn/portfolio-trends
- Digital Silk — Minimalist web design trends 2026: https://www.digitalsilk.com/digital-trends/minimalist-web-design-trends/
- Figma — Web design trends: https://www.figma.com/resource-library/web-design-trends/
- Modern Font Stacks: https://modernfontstacks.com/ · https://github.com/system-fonts/modern-font-stacks
- CSS-Tricks — System font stack: https://css-tricks.com/snippets/css/system-font-stack/
- getButterfly — Moving to a system font stack: https://getbutterfly.com/moving-to-a-system-font-stack-how-and-why/
- ClampGenerator — Clamp & typescale for fluid typography: https://clampgenerator.com/guides/clamp-and-typescale-for-fluid-typography/
- Smashing Magazine — Modern fluid typography with CSS clamp: https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/
- OddBird — Reimagining fluid typography: https://www.oddbird.net/2025/02/12/fluid-type/
- Justinmind — Micro-interaction examples & guidelines 2025: https://www.justinmind.com/web-design/micro-interactions
- PixelFreeStudio — Best practices for animating micro-interactions with CSS: https://blog.pixelfreestudio.com/best-practices-for-animating-micro-interactions-with-css/
- Hype4 Academy — 60-30-10 in UI design: https://hype4.academy/articles/design/60-30-10-rule-in-ui
- sixtythirtyten — 60-30-10 developer guide: https://www.sixtythirtyten.co/blog/60-30-10-rule-complete-guide
- Vision Australia — Accessible palettes with 60-30-10: https://www.visionaustralia.org/business-consulting/digital-access/Creating-accessible-colour-palettes-60-30-10-design-rule
- Jakub — Using shadows instead of borders: https://jakub.kr/work/shadows
- theosoti — Designing better CSS box shadows: https://theosoti.com/blog/designing-shadows/
- Modern CSS — Expanded use of box-shadow & border-radius: https://moderncss.dev/expanded-use-of-box-shadow-and-border-radius/
- OpenDoors Careers — How recruiters actually look at your portfolio: https://blog.opendoorscareers.com/p/how-recruiters-and-hiring-managers-actually-look-at-your-portfolio
- Fueler — Must-have portfolio sections 2025: https://fueler.io/blog/must-have-sections-for-portfolio-website
- Perfect Afternoon — Hero section design: https://www.perfectafternoon.com/2025/hero-section-design/
- MDN — :focus-visible: https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible
- TestParty — WCAG 2.4.7 focus-visible guide: https://testparty.ai/blog/wcag-focus-visible-guide
- Adrian Roselli — Baseline rules for scrollbar usability: https://adrianroselli.com/2019/01/baseline-rules-for-scrollbar-usability.html
- CSSAWWWARDS — Technical SEO: meta tags, OG, favicons: https://cssawwwards.com/blog/technical-seo-meta-tags-favicons-2026
- Chrome for Developers — Scroll-triggered animations: https://developer.chrome.com/blog/scroll-triggered-animations
- CSS-Tricks — Unleash the power of scroll-driven animations: https://css-tricks.com/unleash-the-power-of-scroll-driven-animations/
