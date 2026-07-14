'use strict';

/* ============================================================
   Sam Stewart Portfolio — Main Script
   Vanilla ES6+. No external libraries.
   ============================================================ */

/* ------------------------------------------------------------
   Task 3.2 — Hero scroll-shrink effect
   ------------------------------------------------------------
   Writes a 0..1 progress value to the --hero-progress custom
   property on .hero; css/style.css maps it to transform/opacity
   on .hero-inner (compositor-friendly, no layout reads in CSS).

   - Scroll handling is throttled with requestAnimationFrame:
     the passive scroll listener only schedules a frame; all
     work happens at most once per frame in update().
   - Progress is proportional to scrollY, reaching 1 at ~75% of
     the hero's height, so the hero is fully faded just before
     it scrolls out of the viewport.
   - prefers-reduced-motion: the effect is never enabled (and is
     torn down live if the preference changes mid-session).
   ------------------------------------------------------------ */
const initHeroScrollEffect = () => {
  const hero = document.querySelector('.hero');
  if (!hero) {
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let active = false;
  let ticking = false;
  let fadeDistance = 1;
  let lastProgress = -1;

  /* Fully faded by ~75% of the hero's height (just before it
     leaves the viewport). Measured once and on resize — never
     inside the scroll handler. */
  const measure = () => {
    fadeDistance = Math.max(hero.offsetHeight * 0.75, 1);
  };

  const update = () => {
    ticking = false;
    /* QA advisory: a frame scheduled just before disable() ran must
       not re-write --hero-progress after teardown. (ticking is reset
       first so a later enable() can schedule frames again.) */
    if (!active) {
      return;
    }
    const raw = window.scrollY / fadeDistance;
    const progress = Math.round(Math.min(Math.max(raw, 0), 1) * 1000) / 1000;
    if (progress === lastProgress) {
      return;
    }
    lastProgress = progress;
    hero.style.setProperty('--hero-progress', String(progress));
    hero.classList.toggle('hero--faded', progress >= 1);
  };

  /* rAF throttle: at most one update per animation frame. */
  const requestUpdate = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };

  const onResize = () => {
    measure();
    requestUpdate();
  };

  const enable = () => {
    if (active) {
      return;
    }
    active = true;
    measure();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', onResize);
    // Apply the correct state immediately (e.g. page restored mid-scroll).
    requestUpdate();
  };

  const disable = () => {
    if (!active) {
      return;
    }
    active = false;
    window.removeEventListener('scroll', requestUpdate);
    window.removeEventListener('resize', onResize);
    lastProgress = -1;
    hero.style.removeProperty('--hero-progress');
    hero.classList.remove('hero--faded');
  };

  const applyMotionPreference = () => {
    if (reducedMotion.matches) {
      disable();
    } else {
      enable();
    }
  };

  // React live if the user toggles their reduced-motion preference.
  // (addListener fallback covers older Safari.)
  if (typeof reducedMotion.addEventListener === 'function') {
    reducedMotion.addEventListener('change', applyMotionPreference);
  } else if (typeof reducedMotion.addListener === 'function') {
    reducedMotion.addListener(applyMotionPreference);
  }

  applyMotionPreference();
};

/* ------------------------------------------------------------
   Task 3.4 — Section accordion (expand / collapse)
   ------------------------------------------------------------
   Progressive enhancement: the static HTML renders every section
   fully expanded. This module upgrades each .section by
   - wrapping the heading text in a real <button class=
     "section-toggle"> (button-in-heading pattern) carrying
     aria-expanded + aria-controls -> the .section-body id,
   - adding .section--collapsible, the class css/style.css keys
     ALL collapsed styling on — so no-JS users always see every
     section fully open and content is never trapped.

   Animation is pure CSS (grid-template-rows 0fr -> 1fr) and
   prefers-reduced-motion gets an instant toggle via CSS alone —
   no motion branching needed here.

   Per the design spec, the nav bar disappears while any section
   is engaged: this module toggles .site-nav--hidden accordingly.

   Templating contract: entries are copy-pasted inside
   .section-body, which is never rewritten here — adding or
   removing entries requires no accordion-related markup.

   Returns a tiny API ({ open }) so the nav module can expand the
   section a clicked link scrolls to. Returns null if there are
   no sections to enhance.
   ------------------------------------------------------------ */
const initSectionAccordion = () => {
  const sections = Array.from(document.querySelectorAll('.section'));
  const nav = document.querySelector('.site-nav');
  if (sections.length === 0) {
    return null;
  }

  const isOpen = (section) => section.classList.contains('section--open');

  /* Hide the nav while any section is open; bring it back when all
     are closed. Visual treatment lives in CSS (.site-nav--hidden). */
  const updateNavVisibility = () => {
    if (!nav) {
      return;
    }
    nav.classList.toggle('site-nav--hidden', sections.some(isOpen));
  };

  const setOpen = (section, open) => {
    if (open === isOpen(section)) {
      return;
    }
    section.classList.toggle('section--open', open);
    const toggle = section.querySelector('.section-toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(open));
    }
    updateNavVisibility();
  };

  sections.forEach((section, index) => {
    const title = section.querySelector('.section-title');
    const body = section.querySelector('.section-body');
    if (!title || !body) {
      return; // Malformed section: leave it fully expanded.
    }

    if (!body.id) {
      body.id = `${section.id || `section-${index}`}-body`;
    }

    // Button-in-heading: move the heading's text into a real button.
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'section-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', body.id);
    while (title.firstChild) {
      toggle.appendChild(title.firstChild);
    }
    title.appendChild(toggle);

    toggle.addEventListener('click', () => {
      setOpen(section, !isOpen(section));
    });

    // Collapse only now that the working toggle exists.
    section.classList.add('section--collapsible');
  });

  return {
    open: (section) => setOpen(section, true),
  };
};

/* ------------------------------------------------------------
   Tasks 3.3 / 3.4 — Site nav: sticky offset + scroll/focus hand-off
   ------------------------------------------------------------
   Scrolling itself stays native: the nav links are plain in-page
   anchors and css/style.css sets `html { scroll-behavior:smooth }`
   (with a reduced-motion fallback). This module adds:
   - --nav-height on <html>: the sticky bar's measured height, so
     CSS can land anchors below it (scroll-margin-top on .section);
   - accordion hand-off: a clicked nav link expands its target
     section, so the user never lands on a collapsed sliver;
   - focus hand-off: focus moves to the section's toggle button
     (preventScroll, so the native smooth scroll is untouched).
   Default anchor behaviour is never prevented — without JS the
   nav still scrolls to fully expanded sections.
   ------------------------------------------------------------ */
const initSiteNav = (accordion) => {
  const nav = document.querySelector('.site-nav');
  if (!nav) {
    return;
  }

  /* visibility:hidden (the hidden-nav state) keeps layout, so this
     measurement stays valid even while the bar is hidden. */
  const publishNavHeight = () => {
    document.documentElement.style.setProperty(
      '--nav-height',
      `${nav.offsetHeight}px`
    );
  };
  publishNavHeight();
  window.addEventListener('resize', publishNavHeight);

  nav.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || !nav.contains(link)) {
      return;
    }

    const targetId = link.getAttribute('href').slice(1);
    const section = document.getElementById(targetId);
    if (!section) {
      return;
    }

    // Land on an open section, not a collapsed sliver.
    if (accordion) {
      accordion.open(section);
    }

    // Focus hand-off: prefer the real toggle button, fall back to
    // the heading (made programmatically focusable), then the section.
    const focusTarget =
      section.querySelector('.section-toggle') ||
      section.querySelector('.section-title') ||
      section;
    if (
      focusTarget.tagName !== 'BUTTON' &&
      !focusTarget.hasAttribute('tabindex')
    ) {
      focusTarget.setAttribute('tabindex', '-1');
    }
    focusTarget.focus({ preventScroll: true });
  });
};

/* ------------------------------------------------------------
   Task 3.4 — Deep links land on OPEN sections
   ------------------------------------------------------------
   Covers page load with a #section-id hash and back/forward
   (hashchange), which bypass the nav click handler.
   ------------------------------------------------------------ */
const openSectionForHash = (accordion) => {
  if (!accordion || !window.location.hash) {
    return;
  }
  let target = null;
  try {
    target = document.getElementById(
      decodeURIComponent(window.location.hash.slice(1))
    );
  } catch {
    return; // Malformed hash — nothing to open.
  }
  if (target && target.classList.contains('section--collapsible')) {
    accordion.open(target);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const accordion = initSectionAccordion();
  // Nav first: it publishes --nav-height, which the hero's CSS
  // min-height (and therefore the hero effect's fade distance)
  // depends on — the hero must measure itself after that.
  initSiteNav(accordion);
  initHeroScrollEffect();
  openSectionForHash(accordion);
  window.addEventListener('hashchange', () => openSectionForHash(accordion));
});
