/*
 * version-badge.js
 *
 * Builds a custom version picker in the RIGHT end of the sticky tabs bar.
 * Reads from /Holodeck/versions.json (fetched once, cached on window).
 *
 * Key design decisions:
 *  1. window.__versionBadge guard — Material Theme 9.x re-executes body
 *     scripts on every instant-navigation page switch.  The guard lets the
 *     init block run only once while still re-using the cached data and
 *     re-building the picker on each switch via document$ / interval.
 *  2. window.document$ subscription — the correct Material Theme 9.x hook
 *     for instant navigation (replaces the old DOMContentSwitch event).
 *  3. 300 ms interval fallback — rebuilds if the tabs bar is re-rendered
 *     and the picker disappears for any reason.
 */

(function () {
  'use strict';

  var WRAPPER_ID = 'md-version-tab-wrapper';

  /* ── URL helpers ─────────────────────────────────────────────────────── */

  function getBasePath() {
    var m = window.location.pathname.match(/^(\/[^/]+\/)/);
    return m ? m[1] : '/';
  }

  function getCurrentVersion() {
    var base = getBasePath();
    var rest = window.location.pathname.slice(base.length);
    var m    = rest.match(/^([^/]+)/);
    return m ? m[1] : null;
  }

  function getCurrentPage() {
    var base = getBasePath();
    var rest = window.location.pathname.slice(base.length);
    var m    = rest.match(/^[^/]+\/(.*)/);
    return m ? m[1] : '';
  }

  function resolveVersion(urlSeg, versions) {
    for (var i = 0; i < versions.length; i++) {
      var v = versions[i];
      if (v.version === urlSeg) return v;
      if (v.aliases && v.aliases.indexOf(urlSeg) >= 0) return v;
    }
    return null;
  }

  /* ── Build picker ────────────────────────────────────────────────────── */

  function buildPicker(versions) {
    var base       = getBasePath();
    var urlSeg     = getCurrentVersion();
    var page       = getCurrentPage();
    var resolved   = resolveVersion(urlSeg, versions) || {};
    var displayVer = resolved.version || urlSeg || '?';

    var tabsList = document.querySelector('.md-tabs__list');
    if (!tabsList) return;

    var wrapper = document.getElementById(WRAPPER_ID);
    if (!wrapper || !tabsList.contains(wrapper)) {
      wrapper = document.createElement('li');
      wrapper.id = WRAPPER_ID;
      tabsList.appendChild(wrapper);
    }

    var items = versions.map(function (v) {
      var isActive = (v.version === resolved.version);
      var cls  = 'md-version__link' + (isActive ? ' md-version__link--active' : '');
      var href = base + v.version + '/' + page;
      return '<li class="md-version__item"><a class="' + cls + '" href="' + href + '">' +
             (v.title || v.version) + '</a></li>';
    }).join('');

    wrapper.innerHTML =
      '<div class="md-version">' +
        '<button class="md-version__current" aria-label="Select version">' +
          displayVer +
        '</button>' +
        '<ul class="md-version__list">' + items + '</ul>' +
      '</div>';

    setupDropdown(wrapper);
  }

  /* ── Dropdown pin ────────────────────────────────────────────────────── */

  function setupDropdown(wrapper) {
    var btn  = wrapper.querySelector('.md-version__current');
    var list = wrapper.querySelector('.md-version__list');
    if (!btn || !list) return;

    function pin() {
      var r = btn.getBoundingClientRect();
      list.style.cssText = [
        'position: fixed !important',
        'top: '   + (r.bottom + 4)                + 'px !important',
        'right: ' + (window.innerWidth - r.right) + 'px !important',
        'left: auto !important',
        'bottom: auto !important',
        'z-index: 9999 !important'
      ].join(';');
    }

    btn.addEventListener('mouseenter', pin);
    btn.addEventListener('focus',      pin);
    list.addEventListener('mouseenter', pin);
  }

  /* ── Fetch versions.json (result stored on window for re-use) ────────── */

  function fetchAndBuild() {
    if (window.__versionBadgeData) {
      buildPicker(window.__versionBadgeData);
      return;
    }
    var url = window.location.origin + getBasePath() + 'versions.json';
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        window.__versionBadgeData = data;
        buildPicker(data);
      })
      .catch(function (e) {
        console.warn('[version-badge] failed to load versions.json:', e);
      });
  }

  /* ── One-time setup (guard prevents re-running on script re-execution) ── */

  if (!window.__versionBadgeActive) {
    window.__versionBadgeActive = true;

    /* Subscribe to Material Theme 9.x document$ observable (instant nav) */
    if (window.document$ && typeof window.document$.subscribe === 'function') {
      window.document$.subscribe(function () {
        if (window.__versionBadgeData) buildPicker(window.__versionBadgeData);
        else fetchAndBuild();
      });
    }

    /* Fallback: older Material Theme versions used DOMContentSwitch */
    document.addEventListener('DOMContentSwitch', function () {
      if (window.__versionBadgeData) buildPicker(window.__versionBadgeData);
      else fetchAndBuild();
    });

    /* Interval fallback: catches re-renders the events miss (300 ms) */
    var lastUrl = '';
    setInterval(function () {
      if (!window.__versionBadgeData) return;

      var currentUrl    = window.location.href;
      var tabsList      = document.querySelector('.md-tabs__list');
      var wrapper       = document.getElementById(WRAPPER_ID);
      var urlChanged    = currentUrl !== lastUrl;
      var wrapperGone   = !wrapper || !tabsList || !tabsList.contains(wrapper);

      if (urlChanged || wrapperGone) {
        lastUrl = currentUrl;
        buildPicker(window.__versionBadgeData);
      }
    }, 300);
  }

  /* ── Always build on (re-)execution of this script ──────────────────── */
  /* Runs on first load AND every time Material Theme re-injects the script */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchAndBuild);
  } else {
    fetchAndBuild();
  }

})();
