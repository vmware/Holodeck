/*
 * version-badge.js
 *
 * Moves the MkDocs Material / mike version picker (.md-version) from the
 * header into the RIGHT end of the sticky navigation tabs bar.
 *
 * Uses both polling (initial load) and a MutationObserver (instant
 * navigation) so the picker survives Material Theme re-rendering the
 * tabs bar when changing the active tab between pages.
 */

(function () {
  'use strict';

  var WRAPPER_ID = 'md-version-tab-wrapper';
  var tabsObserver = null;

  /* ── Dropdown repositioning ─────────────────────────────────────────── */

  function setupDropdown(wrapper) {
    var btn  = wrapper.querySelector('.md-version__current');
    var list = wrapper.querySelector('.md-version__list');
    if (!btn || !list) return;

    function pin() {
      var r = btn.getBoundingClientRect();
      list.style.cssText = [
        'position: fixed !important',
        'top: '   + (r.bottom + 4)                  + 'px !important',
        'right: ' + (window.innerWidth - r.right)   + 'px !important',
        'left: auto !important',
        'bottom: auto !important',
        'z-index: 9999 !important'
      ].join(';');
    }

    btn.addEventListener('mouseenter', pin);
    btn.addEventListener('focus',      pin);
    list.addEventListener('mouseenter', pin);
  }

  /* ── Move picker into the tabs bar ──────────────────────────────────── */

  function tryMove() {
    var tabsList = document.querySelector('.md-tabs__list');
    if (!tabsList) return false;

    var picker = document.querySelector('.md-version');
    if (!picker) return false;

    var wrapper = document.getElementById(WRAPPER_ID);

    /* Already in place inside the current tabs list */
    if (wrapper && tabsList.contains(wrapper) && wrapper.contains(picker)) {
      return true;
    }

    /* Create a fresh wrapper (tabs bar was re-rendered or first run) */
    wrapper = document.createElement('li');
    wrapper.id = WRAPPER_ID;
    wrapper.appendChild(picker);
    tabsList.appendChild(wrapper);

    setTimeout(function () { setupDropdown(wrapper); }, 0);

    /* (Re-)attach the MutationObserver to the new tabs container */
    attachObserver();

    return true;
  }

  /* ── MutationObserver: recover if the tabs bar is re-rendered ────────── */

  function attachObserver() {
    if (tabsObserver) tabsObserver.disconnect();

    var tabsEl = document.querySelector('.md-tabs');
    if (!tabsEl) return;

    tabsObserver = new MutationObserver(function () {
      var wrapper  = document.getElementById(WRAPPER_ID);
      var tabsList = document.querySelector('.md-tabs__list');
      /* Wrapper is gone or detached → re-place the picker immediately */
      if (!wrapper || !tabsList || !tabsList.contains(wrapper)) {
        tryMove();
      }
    });

    tabsObserver.observe(tabsEl, { childList: true, subtree: true });
  }

  /* ── Poll every 100 ms until the picker appears (max 8 s) ───────────── */

  function startPolling() {
    var attempts = 0;
    var poll = setInterval(function () {
      if (tryMove() || ++attempts >= 80) clearInterval(poll);
    }, 100);
  }

  startPolling();

  /* ── Re-run after MkDocs Material instant-navigation page switches ───── */
  document.addEventListener('DOMContentSwitch', function () {
    startPolling();
  });

})();
