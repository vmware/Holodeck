/*
 * version-badge.js
 *
 * Injects a persistent version chip into the sticky navigation tabs bar so the
 * current Holodeck docs version stays visible while scrolling.
 *
 * Strategy:
 *  1. mike populates ".md-version__current" asynchronously after page load.
 *  2. We use a MutationObserver to detect that moment and read the version text.
 *  3. A styled <li> badge is appended to the tabs list; clicking it scrolls
 *     back to the top where the full mike version picker is accessible.
 */

(function () {
  'use strict';

  var BADGE_ID = 'md-version-sticky-badge';

  /* ── render ──────────────────────────────────────────────────────────── */
  function injectBadge(version) {
    var tabsList = document.querySelector('.md-tabs__list');
    if (!tabsList || !version) return;

    /* update text if badge already exists (instant-navigation re-runs) */
    var existing = document.getElementById(BADGE_ID);
    if (existing) {
      var span = existing.querySelector('.md-version-sticky-badge');
      if (span) span.textContent = 'v' + version;
      return;
    }

    var li   = document.createElement('li');
    li.id    = BADGE_ID;

    var span = document.createElement('span');
    span.className = 'md-version-sticky-badge';
    span.textContent = 'v' + version;
    span.setAttribute('title', 'Current version — click to access version picker');
    span.setAttribute('role', 'button');
    span.setAttribute('tabindex', '0');

    span.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    span.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    li.appendChild(span);
    tabsList.appendChild(li);
  }

  /* ── version detection ───────────────────────────────────────────────── */
  function tryInject() {
    /* Primary source: mike's version picker (most accurate) */
    var el = document.querySelector('.md-version__current');
    if (el && el.textContent.trim()) {
      injectBadge(el.textContent.trim());
      return true;
    }
    return false;
  }

  function startObserver() {
    if (tryInject()) return;

    var timer    = null;
    var observer = new MutationObserver(function (_, obs) {
      if (tryInject()) {
        obs.disconnect();
        clearTimeout(timer);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    /* Abort observation after 3 s to avoid memory leaks */
    timer = setTimeout(function () { observer.disconnect(); }, 3000);
  }

  /* ── init ────────────────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver);
  } else {
    startObserver();
  }

  /*
   * MkDocs Material with `navigation.instant` performs SPA-style navigation.
   * Re-inject on each navigation so the badge survives page transitions.
   */
  document.addEventListener('DOMContentSwitch', startObserver);
})();
