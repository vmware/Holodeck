/*
 * version-badge.js
 *
 * Builds a custom version picker in the RIGHT end of the sticky tabs bar.
 * Reads versions from /Holodeck/versions.json so it is independent of
 * Material Theme's native .md-version element (which can be destroyed when
 * instant navigation re-renders the tabs bar).
 *
 * The native .md-version in the header is hidden via extra.css.
 */

(function () {
  'use strict';

  var WRAPPER_ID  = 'md-version-tab-wrapper';
  var cachedVersions = null;
  var tabsObserver   = null;

  /* ── URL helpers ─────────────────────────────────────────────────────── */

  function getBasePath() {
    /* e.g. "/Holodeck/" from "/Holodeck/9.0.2/release_notes/" */
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
    /* Everything after /Holodeck/VERSION/ */
    var base = getBasePath();
    var rest = window.location.pathname.slice(base.length);
    var m    = rest.match(/^[^/]+\/(.*)/);
    return m ? m[1] : '';
  }

  function resolveVersion(urlSeg, versions) {
    /* Resolves an alias (e.g. "latest") to the real version object */
    for (var i = 0; i < versions.length; i++) {
      var v = versions[i];
      if (v.version === urlSeg) return v;
      if (v.aliases && v.aliases.indexOf(urlSeg) >= 0) return v;
    }
    return null;
  }

  /* ── Build picker DOM ────────────────────────────────────────────────── */

  function buildPicker(versions) {
    var base        = getBasePath();
    var urlSeg      = getCurrentVersion();
    var page        = getCurrentPage();
    var resolved    = resolveVersion(urlSeg, versions) || {};
    var displayVer  = resolved.version || urlSeg || '?';

    var tabsList = document.querySelector('.md-tabs__list');
    if (!tabsList) return;

    /* Reuse or create the wrapper <li> */
    var wrapper = document.getElementById(WRAPPER_ID);
    if (!wrapper || !tabsList.contains(wrapper)) {
      wrapper = document.createElement('li');
      wrapper.id = WRAPPER_ID;
      tabsList.appendChild(wrapper);
    }

    /* Build inner HTML — same class names so existing CSS applies */
    var items = versions.map(function (v) {
      var isActive = (v.version === resolved.version);
      var cls = 'md-version__link' + (isActive ? ' md-version__link--active' : '');
      var href = base + v.version + '/' + page;
      return '<li class="md-version__item">' +
             '<a class="' + cls + '" href="' + href + '">' +
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
    attachObserver();
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

  /* ── MutationObserver: rebuild if the tabs bar is re-rendered ────────── */

  function attachObserver() {
    if (tabsObserver) tabsObserver.disconnect();

    var tabsEl = document.querySelector('.md-tabs');
    if (!tabsEl || !cachedVersions) return;

    tabsObserver = new MutationObserver(function () {
      var wrapper  = document.getElementById(WRAPPER_ID);
      var tabsList = document.querySelector('.md-tabs__list');
      if (!wrapper || !tabsList || !tabsList.contains(wrapper)) {
        buildPicker(cachedVersions);
      }
    });

    tabsObserver.observe(tabsEl, { childList: true, subtree: true });
  }

  /* ── Fetch versions.json and initialise ─────────────────────────────── */

  function init() {
    if (cachedVersions) {
      buildPicker(cachedVersions);
      return;
    }

    var url = window.location.origin + getBasePath() + 'versions.json';
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        cachedVersions = data;
        buildPicker(data);
      })
      .catch(function (e) {
        console.warn('version-badge.js: could not load versions.json', e);
      });
  }

  /* ── Bootstrap ───────────────────────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Rebuild on every instant-navigation switch (updates active version) */
  document.addEventListener('DOMContentSwitch', function () {
    if (cachedVersions) buildPicker(cachedVersions);
    else init();
  });

})();
