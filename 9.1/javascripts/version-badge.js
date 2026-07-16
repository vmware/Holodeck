/*
 * version-badge.js
 *
 * Builds a custom version picker in the RIGHT end of the sticky tabs bar.
 * Reads versions from /Holodeck/versions.json so it is fully independent
 * of Material Theme's native .md-version element.
 *
 * Uses DOMContentSwitch + interval polling as dual safety nets so the
 * picker survives Material Theme re-rendering the tabs bar during
 * instant navigation.
 */

(function () {
  'use strict';

  var WRAPPER_ID     = 'md-version-tab-wrapper';
  var cachedVersions = null;
  var lastUrl        = '';

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

  /* ── Build and place picker ──────────────────────────────────────────── */

  function buildPicker(versions) {
    var base       = getBasePath();
    var urlSeg     = getCurrentVersion();
    var page       = getCurrentPage();
    var resolved   = resolveVersion(urlSeg, versions) || {};
    var displayVer = resolved.version || urlSeg || '?';

    var tabsList = document.querySelector('.md-tabs__list');
    if (!tabsList) {
      console.warn('[version-badge] .md-tabs__list not found');
      return false;
    }

    var wrapper = document.getElementById(WRAPPER_ID);
    if (!wrapper || !tabsList.contains(wrapper)) {
      wrapper = document.createElement('li');
      wrapper.id = WRAPPER_ID;
      tabsList.appendChild(wrapper);
      console.log('[version-badge] created wrapper for', urlSeg);
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
    return true;
  }

  /* ── Dropdown fixed positioning ──────────────────────────────────────── */

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
    if (cachedVersions) { buildPicker(cachedVersions); return; }

    var url = window.location.origin + getBasePath() + 'versions.json';
    console.log('[version-badge] fetching', url);

    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        cachedVersions = data;
        console.log('[version-badge] versions loaded:', data.map(function(v){ return v.version; }));
        buildPicker(data);
        lastUrl = window.location.href;
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

  /* ── Instant-navigation hook ─────────────────────────────────────────── */

  document.addEventListener('DOMContentSwitch', function () {
    console.log('[version-badge] DOMContentSwitch fired, url=', window.location.href);
    if (cachedVersions) buildPicker(cachedVersions);
    else init();
    lastUrl = window.location.href;
  });

  /* ── Interval fallback: catches cases DOMContentSwitch misses ────────── */

  setInterval(function () {
    if (!cachedVersions) return;

    var currentUrl = window.location.href;
    var tabsList   = document.querySelector('.md-tabs__list');
    var wrapper    = document.getElementById(WRAPPER_ID);

    if (!tabsList) return;

    var urlChanged     = currentUrl !== lastUrl;
    var wrapperMissing = !wrapper || !tabsList.contains(wrapper);

    if (urlChanged || wrapperMissing) {
      console.log('[version-badge] interval triggered rebuild. urlChanged=' + urlChanged + ' wrapperMissing=' + wrapperMissing);
      lastUrl = currentUrl;
      buildPicker(cachedVersions);
    }
  }, 300);

})();
