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

document.addEventListener('DOMContentLoaded', () => {
  initHeroScrollEffect();
  // Interactivity (nav, section expand/collapse) is added in later tasks.
});
