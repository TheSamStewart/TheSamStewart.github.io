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
   Task 5.12 — Nav visibility controller
   ------------------------------------------------------------
   .site-nav--hidden now has two independent reasons to be on:
   - a section is open (all viewports — Task 3.4 behaviour), and
   - on mobile, the hero has scrolled out of view (Task 5.12).
   This controller is the single writer of the class so the two
   sources can't fight over it: the bar is hidden while EITHER
   reason holds and shown only when both clear.
   ------------------------------------------------------------ */
const createNavVisibility = () => {
  const nav = document.querySelector('.site-nav');
  const state = { sectionOpen: false, pastHero: false };
  const apply = () => {
    if (!nav) {
      return;
    }
    nav.classList.toggle(
      'site-nav--hidden',
      state.sectionOpen || state.pastHero
    );
  };
  return {
    setSectionOpen: (value) => {
      state.sectionOpen = value;
      apply();
    },
    setPastHero: (value) => {
      state.pastHero = value;
      apply();
    },
  };
};

/* ------------------------------------------------------------
   Task 5.12 — Mobile: hide the nav once the hero scrolls away
   ------------------------------------------------------------
   On phones the stacked nav bar is tall, so once the user scrolls
   past the hero (name + portrait) it gets out of the way instead
   of shadowing the content; scrolling back up brings it back.
   Desktop keeps the bar until a section is opened (Task 3.4).

   An IntersectionObserver on .hero (not the scroll-effect
   listener) drives this so it also works when the hero effect is
   disabled under prefers-reduced-motion. The 620px media query
   must match the stacked-nav breakpoint in css/style.css.
   ------------------------------------------------------------ */
const initMobileNavAutoHide = (navVisibility) => {
  const hero = document.querySelector('.hero');
  if (!hero || !('IntersectionObserver' in window)) {
    return; // No hero / very old browser: keep Task 3.4 behaviour.
  }

  const mobileViewport = window.matchMedia('(max-width: 620px)');
  let observer = null;

  const start = () => {
    if (observer) {
      return;
    }
    observer = new IntersectionObserver((entries) => {
      // Entries are batched; the last one is the current state.
      navVisibility.setPastHero(!entries[entries.length - 1].isIntersecting);
    });
    observer.observe(hero);
  };

  const stop = () => {
    if (!observer) {
      return;
    }
    observer.disconnect();
    observer = null;
    navVisibility.setPastHero(false);
  };

  const applyViewport = () => {
    if (mobileViewport.matches) {
      start();
    } else {
      stop();
    }
  };

  // React live to rotation / window resizes across the breakpoint.
  // (addListener fallback covers older Safari.)
  if (typeof mobileViewport.addEventListener === 'function') {
    mobileViewport.addEventListener('change', applyViewport);
  } else if (typeof mobileViewport.addListener === 'function') {
    mobileViewport.addListener(applyViewport);
  }

  applyViewport();
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
   is engaged: this module reports open/closed state to the shared
   nav-visibility controller (Task 5.12), which owns
   .site-nav--hidden.

   Templating contract: entries are copy-pasted inside
   .section-body, which is never rewritten here — adding or
   removing entries requires no accordion-related markup.

   Returns a tiny API ({ open }) so the nav module can expand the
   section a clicked link scrolls to. Returns null if there are
   no sections to enhance.
   ------------------------------------------------------------ */
const initSectionAccordion = (navVisibility) => {
  const sections = Array.from(document.querySelectorAll('.section'));
  if (sections.length === 0) {
    return null;
  }

  const isOpen = (section) => section.classList.contains('section--open');

  /* Hide the nav while any section is open; bring it back when all
     are closed. Visual treatment lives in CSS (.site-nav--hidden). */
  const updateNavVisibility = () => {
    navVisibility.setSectionOpen(sections.some(isOpen));
  };

  const setOpen = (section, open) => {
    if (!section.classList.contains('section--collapsible')) {
      return; // Only enhanced sections participate (e.g. not #top).
    }
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
   Tasks 3.3 / 3.4 — Site nav: sticky-bar height for anchor offsets
   ------------------------------------------------------------
   Publishes --nav-height on <html> so CSS can land anchors below
   the sticky bar (scroll-margin-top on .section) and size the
   hero to the remaining viewport.
   ------------------------------------------------------------ */
const initSiteNav = () => {
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
};

/* ------------------------------------------------------------
   Tasks 3.3 / 3.4 / 3.5 — In-page anchors: accordion + focus hand-off
   ------------------------------------------------------------
   Scrolling itself stays native: nav links, the hero CTA and the
   footer back-to-top are plain in-page anchors, and css/style.css
   sets `html { scroll-behavior:smooth }` (with a reduced-motion
   fallback). One delegated listener covers them all and adds:
   - accordion hand-off: the target section expands before the
     native scroll, so the user never lands on a collapsed sliver
     (accordion.open ignores non-section targets like #top);
   - focus hand-off: focus moves to the most useful target (toggle
     button > heading > the element itself) with preventScroll so
     the native smooth scroll is untouched.
   Default anchor behaviour is never prevented — without JS every
   anchor still scrolls to fully expanded content.
   ------------------------------------------------------------ */
const initAnchorNavigation = (accordion) => {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) {
      return;
    }

    const targetId = link.getAttribute('href').slice(1);
    if (!targetId) {
      return; // Bare "#" placeholder links: leave native behaviour.
    }
    const target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    // Land on an open section, not a collapsed sliver.
    if (accordion) {
      accordion.open(target);
    }

    // Focus hand-off: prefer the real toggle button, fall back to
    // the heading (made programmatically focusable), then the target.
    const focusTarget =
      target.querySelector('.section-toggle') ||
      target.querySelector('.section-title') ||
      target;
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
   (hashchange), which bypass the anchor click handler.
   scrollToTarget (load only, QA advisory): the browser's own hash
   jump happened against the collapsed pre-JS layout, so reposition
   deterministically after opening. scrollIntoView honours
   scroll-margin-top and the page's CSS scroll-behavior (which is
   already `auto` under prefers-reduced-motion).
   ------------------------------------------------------------ */
const openSectionForHash = (accordion, scrollToTarget = false) => {
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
    if (scrollToTarget) {
      target.scrollIntoView();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const navVisibility = createNavVisibility();
  const accordion = initSectionAccordion(navVisibility);
  initMobileNavAutoHide(navVisibility);
  // Nav first: it publishes --nav-height, which the hero's CSS
  // min-height (and therefore the hero effect's fade distance)
  // depends on — the hero must measure itself after that.
  initSiteNav();
  initHeroScrollEffect();
  initAnchorNavigation(accordion);
  openSectionForHash(accordion, true);
  window.addEventListener('hashchange', () => openSectionForHash(accordion));
});
