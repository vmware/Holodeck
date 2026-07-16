/*
 * version-badge.js
 *
 * Builds a custom version picker in the RIGHT end of the sticky tabs bar.
 * Reads from /Holodeck/versions.json (fetched once, cached on window).
 */

(function () {
  'use strict';

  var WRAPPER_ID = 'md-version-tab-wrapper';
  var LOG = '[version-badge]';

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
    console.log(LOG, 'buildPicker: tabsList=', !!tabsList, 'url=', window.location.href);
    if (!tabsList) return false;

    var wrapper = document.getElementById(WRAPPER_ID);
    if (!wrapper || !tabsList.contains(wrapper)) {
      wrapper = document.createElement('li');
      wrapper.id = WRAPPER_ID;
      tabsList.appendChild(wrapper);
      console.log(LOG, 'created wrapper');
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
      console.log(LOG, 'init: data cached, building picker directly');
      buildPicker(window.__versionBadgeData);
      return;
    }
    var url = window.location.origin + getBasePath() + 'versions.json';
    console.log(LOG, 'init: fetching', url);
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        console.log(LOG, 'versions loaded:', data.map(function(v){ return v.version; }));
        window.__versionBadgeData = data;
        buildPicker(data);
      })
      .catch(function (e) {
        console.error(LOG, 'FAILED to load versions.json:', e);
      });
  }

  /* ── Bootstrap ───────────────────────────────────────────────────────── */

  console.log(LOG, 'script loaded, readyState=', document.readyState, 'active=', !!window.__versionBadgeActive);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── Navigation hooks (one-time setup) ──────────────────────────────── */

  if (!window.__versionBadgeActive) {
    window.__versionBadgeActive = true;
    console.log(LOG, 'registering hooks');

    /* Material Theme 9.x document$ observable */
    if (window.document$ && typeof window.document$.subscribe === 'function') {
      console.log(LOG, 'subscribing to document$');
      window.document$.subscribe(function () {
        console.log(LOG, 'document$ fired, url=', window.location.href);
        init();
      });
    } else {
      console.log(LOG, 'document$ not available');
    }

    /* Fallback for older Material Theme */
    document.addEventListener('DOMContentSwitch', function () {
      console.log(LOG, 'DOMContentSwitch fired');
      init();
    });

    /* Interval fallback: catches re-renders the events miss */
    var lastUrl = '';
    setInterval(function () {
      if (!window.__versionBadgeData) return;

      var currentUrl  = window.location.href;
      var tabsList    = document.querySelector('.md-tabs__list');
      var wrapper     = document.getElementById(WRAPPER_ID);
      var urlChanged  = currentUrl !== lastUrl;
      var wrapperGone = !wrapper || !tabsList || !tabsList.contains(wrapper);

      if (urlChanged || wrapperGone) {
        console.log(LOG, 'interval rebuild: urlChanged=', urlChanged, 'wrapperGone=', wrapperGone);
        lastUrl = currentUrl;
        buildPicker(window.__versionBadgeData);
      }
    }, 300);
  }

})();
