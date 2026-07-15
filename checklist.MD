# Portfolio Implementation Checklist

## Progress Summary (as of 2026-07-14)

**Completed: ALL TASKS (Phases 1–4)** — 11 of 11 tasks done, each reviewed and committed individually.

- **Task 1.1** (commit `a2e9e3e`): Scaffolded `index.html`, `css/style.css`, `js/main.js` per CLAUDE.md — semantic HTML5, relative paths, deferred script, no libraries.
- **Task 1.2** (commit `86d7b45`): Palette as CSS variables in `:root` (`--color-bg` #EEEEEE, `--color-secondary` #141E61, `--color-third` #787A91, `--color-fourth` #0F044C) plus base reset, system font stack, smooth scroll with reduced-motion fallback. QA advisory: #787A91 is only ~3.7:1 contrast on the background — use for large text/borders only.
- **Task 2.1** (commit `14f2b43`): Semantic skeleton (header/nav/main/footer, four section anchors: `#professional-experience`, `#education`, `#extra-curricular`, `#technical-projects`) and the copy-paste templating contract: `<article class="{block}">` with `{block}-title` / `{block}-subtitle` / `{block}-meta` / `{block}-main-text`, where {block} is `experience`, `education-item`, `activity`, or `project`. Shared card styling means new entries need zero CSS edits. QA fix applied: card background tokenized as `--color-surface`.
- **Task 2.2** (commit `c5251c8`): All four sections populated with 2 placeholder (bracketed) template entries each, demonstrating both bulleted and paragraph `-main-text` variants; list styling and section separators added.
- **Task 3.1** (commit `cced2dc`): Hero section — single `<h1>` "Sam Stewart" left, circular portrait `images/1781003854566.png` right (800x800 verified, no layout shift), fills the viewport, stacks name-over-portrait on mobile. QA fix applied: mobile stack order corrected to `flex-direction: column`.

- **Task 3.2** (commit `51bcf09`): Hero scroll-shrink — `js/main.js` writes a 0..1 `--hero-progress` custom property onto `.hero` (rAF-throttled passive scroll listener, measured fade distance = 75% of hero height); CSS maps it to fade (`opacity: 1 - p`), upward slide (`translateY(p * -45vh)`) and shrink (`scale(1 - 0.45p)`). Reduced-motion double-guarded in JS and CSS; hero renders statically with JS disabled. QA verdict: PASS (advisories only: pending-rAF race in `disable()`, permanent `will-change`).

- **Task 3.3** (commit `0f051ab`): Navigation bar — semantic `nav > ul.site-nav-list > li > a.site-nav-link` linking to the four section IDs; card-token styling, 44px tap targets, stacks ≤600px, wraps on desktop; native smooth scroll (no JS scrolling), JS adds only focus hand-off to the target `.section-title` (`tabindex="-1"` + `focus({preventScroll:true})`); AAA contrast on links. Task 3.2 advisory `if (!active) return;` guard applied. QA verdict: PASS. **Lead decision for 3.4:** per CLAUDE.md the nav must be visible on the landing view — 3.4 will make `.site-nav` sticky/visible on landing and hide it once a section is engaged.

- **Task 3.4** (commit `7542de5` — note: commit message reads "add changes up to task 3.3" but it IS the Task 3.4 implementation, verified by QA post-commit): Sticky top nav visible on landing (`position: sticky`, hides via `.site-nav--hidden` transform/opacity/visibility while any section is open; `--nav-height` published by JS drives `scroll-margin-top` anchor offsets and hero `min-height: calc(100vh - nav)`); accordion sections via JS-injected `<button class="section-toggle">` in each heading (aria-expanded/aria-controls, `grid-template-rows: min-content 0fr↔1fr` animation, reduced-motion instant); nav clicks and hash deep-links auto-expand the target section; full no-JS fallback (everything expanded); templating contract untouched. QA verdict: PASS. Advisories to fold into 3.5 build: static `scroll-margin-top` fallback for no-JS (~4.5rem), `scrollIntoView` after load-time hash expand.

- **Task 3.5** (this commit): Design research + implementation. Research Agent (Opus, deep-research config) produced `design-research.md` — 13 priority-tagged instructions from 2025/26 trend research, all cross-checked for the vanilla/no-external-resource constraints. ALL 13 implemented: head metadata (description, OG/Twitter cards, theme-color, inline-SVG data-URI favicon); motion/focus/measure/radius/spacing tokens; two-layer card shadows + hover lift (gated `hover:hover` + reduced-motion); fluid rem-based `clamp()` type scale; `text-wrap: balance/pretty`; 68ch reading measure; `::selection`; hero tagline + single CTA (11.6:1 contrast); populated footer (mailto, placeholder LinkedIn/GitHub, auto-year JS, back-to-top); unified focus-ring token; pure-CSS scroll-reveal (`animation-timeline: view()` behind `@supports` + reduced-motion); scrollbar tint. Both 3.4 QA advisories applied (4.5rem `scroll-margin-top` no-JS fallback; deterministic `scrollIntoView` on load-time hash). Anchor handling unified into one delegated listener covering nav links, hero CTA and back-to-top. Verified: `node --check` passes, CSS braces balanced, templating contract untouched. NOTE for owner: replace `[LinkedIn]`/`[GitHub]` placeholder links, the bracketed hero tagline, and confirm the canonical/OG base URL.

- **Tasks 4.1 + 4.2** (this commit): Final audits. **4.1 Responsiveness:** breakpoints verified (≤600px hero stack + 2×2 nav grid, ≥700px section spacing, fluid rem-based clamp() type in between, no fixed-width elements, all transforms vertical → no horizontal overflow at 320px); fix applied: hero now uses `100dvh` (with `100vh` fallback) so mobile URL-bar collapse no longer jumps the layout. **4.2 Accessibility/semantics/paths:** landmarks (nav/header/main/footer), h1→h2→h3 order, aria-labelledby sections, aria-expanded/aria-controls accordion wiring, alt text, lang, visible focus rings via single token, reduced-motion coverage on every animation, full no-JS fallback, all contrast pairs AA+; all asset paths relative and verified on disk (`images/1781003854566.png` exists; OG/canonical absolute URLs are intentional metadata); fix applied: footer text links padded past the WCAG 2.5.8 24px minimum target size. `node --check` and CSS brace balance pass.

- **Final independent QA (post-commit `1bfdb44`): PASS.** QA agent re-reviewed the full site at HEAD against CLAUDE.md — `node --check` passes, CSS braces balanced (92/92), image path verified on disk, no external runtime resources, templating contract intact, user journey and accordion/nav-hide logic sound, accessibility wiring complete. No blockers; 5 advisories, all either owner-content placeholders (bracketed tagline, `href="#"` LinkedIn/GitHub links) or documented judgment calls/micro-nits (`--color-surface` as a fifth surface color, nav hidden on section-engage per Lead decision, permanent `will-change` on `.hero-inner`). Site is deployment-ready pending owner content.

**Process:** Builder agent implements each task, QA agent reviews against CLAUDE.md and issues a verdict; fixes are applied and re-verified before the task is checked off and committed.

## Phase 1: Core Skeleton & Architecture

- [x] Task 1.1: Verify tech stack and create directory files (`index.html`, `css/style.css`, `js/main.js`) according to CLAUDE.md guidelines.
- [x] Task 1.2: Establish the color palette as CSS variables in `css/style.css`. Define the base styling.

## Phase 2: Structural HTML & Templating Classes

- [x] Task 2.1: Write the main HTML skeleton structure. Define clean, reusable CSS utility classes for the template blocks (`project`, `project-main-text`, etc.) so the user can manually copy-paste to scale sections.
- [x] Task 2.2: Add HTML structure and styling for sections: "Professional Experience", "Education", "Extra Curricular/Competitions", and "Technical Projects" using semantic elements (`<section>`, `<article>`).

## Phase 3: Interactive Features & UI Animation

- [x] Task 3.1: Build Hero Section (Section 1). Display name "Sam Stewart" and image `1781003854566.png`.
- [x] Task 3.2: Implement scroll trigger mechanism (JS/CSS). As user scrolls down, make the hero text and image shrink/disappear upwards.
- [x] Task 3.3: Build navigation bar (links to each section). Ensure smooth-scroll functionality to section anchors.
- [x] Task 3.4: Implement accordion/expandable logic (JS/CSS) for the content sections. Sections should start collapsed and expand smoothly when clicked. Ensure nav bar disappears once a section is engaged.
- [x] Task 3.5: After all implementations have been made, the Research Agent will conduct deep research into design trends and strategies with the goal of proffesionality and aesthetics. The Research Agent will then create instructions for the Builder Agent to implement.

## Phase 4: Quality Assurance & Deployment Prep

- [x] Task 4.1: Audit responsiveness across mobile and desktop breakpoints.
- [x] Task 4.2: Audit accessibility tags, semantic structure, and relative path compliance.

## Phase 5: Changes After Human Check

- [] Task 5.1: Ensure all header items are spaced evenly, they are currently wrapping.
- [] Task 5.2: Ensure when back to top button is pressed that it lands so that the Face and title are not in view (end of the scroll animation where Professional experience is at top of page)
- [] Task 5.3: Remove © 2026 Sam Stewart from footer
- [] Task 5.4: Change view my experience button to "Down" with a downward arrow, make it so lands at the same position as back to top.
- [] Task 5.5: replace `[LinkedIn]`/`[GitHub]` placeholder hrefs with TheSamStewart as username of both LinkedIn and Github, the bracketed hero tagline and section placeholder entries; confirm `https://thesamstewart.github.io/` as the canonical/OG base URL.
- [] Task 5.6: Make proportions of slightly smaller
- [] Task 5.7: Ensure the design-research.md has been implemented correctly - pick a colour scheme that is close to the current but pick for optimal proffesionality.
