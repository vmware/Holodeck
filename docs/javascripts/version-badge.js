/*
 * version-badge.js
 *
 * Builds a custom version picker pinned to the RIGHT end of the sticky
 * tabs bar.  The wrapper is appended directly to .md-tabs (not the inner
 * list) and positioned with position:absolute so that contain:strict on
 * .md-tabs__list cannot collapse it to zero size.
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

    /* Attach to .md-tabs, not .md-tabs__list — avoids contain:strict */
    var mdTabs = document.querySelector('.md-tabs');
    if (!mdTabs) return;

    var wrapper = document.getElementById(WRAPPER_ID);
    if (!wrapper || !mdTabs.contains(wrapper)) {
      wrapper = document.createElement('div');
      wrapper.id = WRAPPER_ID;
      mdTabs.appendChild(wrapper);
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

  /* ── Fetch versions.json ─────────────────────────────────────────────── */

  function init() {
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

  /* ── Bootstrap ───────────────────────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── Navigation hooks (one-time setup) ──────────────────────────────── */

  if (!window.__versionBadgeActive) {
    window.__versionBadgeActive = true;

    if (window.document$ && typeof window.document$.subscribe === 'function') {
      window.document$.subscribe(function () { init(); });
    }

    document.addEventListener('DOMContentSwitch', function () { init(); });

    var lastUrl = '';
    setInterval(function () {
      if (!window.__versionBadgeData) return;

      var currentUrl  = window.location.href;
      var mdTabs      = document.querySelector('.md-tabs');
      var wrapper     = document.getElementById(WRAPPER_ID);
      var urlChanged  = currentUrl !== lastUrl;
      var wrapperGone = !wrapper || !mdTabs || !mdTabs.contains(wrapper);

      if (urlChanged || wrapperGone) {
        lastUrl = currentUrl;
        buildPicker(window.__versionBadgeData);
      }
    }, 300);
  }

})();
