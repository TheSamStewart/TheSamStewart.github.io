# Portfolio Implementation Checklist

## Progress Summary (as of 2026-07-14)

**Completed: Phase 1, Phase 2, and Task 3.1** — 5 of 10 tasks done, each QA-approved and committed individually.

- **Task 1.1** (commit `a2e9e3e`): Scaffolded `index.html`, `css/style.css`, `js/main.js` per CLAUDE.md — semantic HTML5, relative paths, deferred script, no libraries.
- **Task 1.2** (commit `86d7b45`): Palette as CSS variables in `:root` (`--color-bg` #EEEEEE, `--color-secondary` #141E61, `--color-third` #787A91, `--color-fourth` #0F044C) plus base reset, system font stack, smooth scroll with reduced-motion fallback. QA advisory: #787A91 is only ~3.7:1 contrast on the background — use for large text/borders only.
- **Task 2.1** (commit `14f2b43`): Semantic skeleton (header/nav/main/footer, four section anchors: `#professional-experience`, `#education`, `#extra-curricular`, `#technical-projects`) and the copy-paste templating contract: `<article class="{block}">` with `{block}-title` / `{block}-subtitle` / `{block}-meta` / `{block}-main-text`, where {block} is `experience`, `education-item`, `activity`, or `project`. Shared card styling means new entries need zero CSS edits. QA fix applied: card background tokenized as `--color-surface`.
- **Task 2.2** (commit `c5251c8`): All four sections populated with 2 placeholder (bracketed) template entries each, demonstrating both bulleted and paragraph `-main-text` variants; list styling and section separators added.
- **Task 3.1** (this commit): Hero section — single `<h1>` "Sam Stewart" left, circular portrait `images/1781003854566.png` right (800x800 verified, no layout shift), fills the viewport, stacks name-over-portrait on mobile. QA fix applied: mobile stack order corrected to `flex-direction: column`.

**Remaining:** Task 3.2 (scroll shrink/disappear of hero), Task 3.3 (nav bar + smooth scroll), Task 3.4 (accordion sections + nav hide), Tasks 4.1–4.2 (responsiveness and accessibility audits).

**Process:** Builder agent implements each task, QA agent reviews against CLAUDE.md and issues a verdict; fixes are applied and re-verified before the task is checked off and committed.

## Phase 1: Core Skeleton & Architecture

- [x] Task 1.1: Verify tech stack and create directory files (`index.html`, `css/style.css`, `js/main.js`) according to CLAUDE.md guidelines.
- [x] Task 1.2: Establish the color palette as CSS variables in `css/style.css`. Define the base styling.

## Phase 2: Structural HTML & Templating Classes

- [x] Task 2.1: Write the main HTML skeleton structure. Define clean, reusable CSS utility classes for the template blocks (`project`, `project-main-text`, etc.) so the user can manually copy-paste to scale sections.
- [x] Task 2.2: Add HTML structure and styling for sections: "Professional Experience", "Education", "Extra Curricular/Competitions", and "Technical Projects" using semantic elements (`<section>`, `<article>`).

## Phase 3: Interactive Features & UI Animation

- [x] Task 3.1: Build Hero Section (Section 1). Display name "Sam Stewart" and image `1781003854566.png`.
- [ ] Task 3.2: Implement scroll trigger mechanism (JS/CSS). As user scrolls down, make the hero text and image shrink/disappear upwards.
- [ ] Task 3.3: Build navigation bar (links to each section). Ensure smooth-scroll functionality to section anchors.
- [ ] Task 3.4: Implement accordion/expandable logic (JS/CSS) for the content sections. Sections should start collapsed and expand smoothly when clicked. Ensure nav bar disappears once a section is engaged.

## Phase 4: Quality Assurance & Deployment Prep

- [ ] Task 4.1: Audit responsiveness across mobile and desktop breakpoints.
- [ ] Task 4.2: Audit accessibility tags, semantic structure, and relative path compliance.
