/*
 * version-badge.js
 *
 * The wrapper is appended to document.body (NOT inside .md-tabs) and
 * positioned with position:fixed so that .md-tabs's overflow:auto
 * cannot clip it to zero size.  JS reads .md-tabs.getBoundingClientRect()
 * to align the wrapper to the right end of the sticky tabs bar.
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

  /* ── Position wrapper over the right end of .md-tabs ────────────────── */

  function positionWrapper(wrapper) {
    var mdTabs = document.querySelector('.md-tabs');
    if (!mdTabs || !wrapper) return;
    var r = mdTabs.getBoundingClientRect();
    wrapper.style.cssText = [
      'position: fixed',
      'top: '            + r.top                      + 'px',
      'right: '          + (window.innerWidth - r.right) + 'px',
      'height: '         + r.height                   + 'px',
      'left: auto',
      'bottom: auto',
      'z-index: 9999',
      'display: flex',
      'align-items: center',
      'padding-right: 0.8rem',
      'pointer-events: auto',
    ].join(';');
  }

  /* ── Build picker ────────────────────────────────────────────────────── */

  function buildPicker(versions) {
    var base       = getBasePath();
    var urlSeg     = getCurrentVersion();
    var page       = getCurrentPage();
    var resolved   = resolveVersion(urlSeg, versions) || {};
    var displayVer = resolved.version || urlSeg || '?';

    /* Ensure .md-tabs exists before placing the wrapper */
    var mdTabs = document.querySelector('.md-tabs');
    if (!mdTabs) return;

    /* Wrapper lives on body — immune to any overflow/contain on .md-tabs */
    var wrapper = document.getElementById(WRAPPER_ID);
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.id = WRAPPER_ID;
      document.body.appendChild(wrapper);
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

    positionWrapper(wrapper);
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
        'position: fixed',
        'top: '   + (r.bottom + 4)                + 'px',
        'right: ' + (window.innerWidth - r.right)  + 'px',
        'left: auto',
        'bottom: auto',
        'z-index: 99999',
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

  /* ── Navigation hooks + position updates (one-time setup) ───────────── */

  if (!window.__versionBadgeActive) {
    window.__versionBadgeActive = true;

    /* Material Theme 9.x instant-navigation observable */
    if (window.document$ && typeof window.document$.subscribe === 'function') {
      window.document$.subscribe(function () { init(); });
    }

    document.addEventListener('DOMContentSwitch', function () { init(); });

    /* Keep wrapper glued to .md-tabs on scroll / resize */
    function reposition() {
      var w = document.getElementById(WRAPPER_ID);
      if (w) positionWrapper(w);
    }
    window.addEventListener('scroll', reposition, { passive: true });
    window.addEventListener('resize', reposition, { passive: true });

    /* Polling: rebuild if URL changed or wrapper was removed */
    var lastUrl = '';
    setInterval(function () {
      if (!window.__versionBadgeData) return;

      var currentUrl  = window.location.href;
      var wrapper     = document.getElementById(WRAPPER_ID);
      var mdTabs      = document.querySelector('.md-tabs');
      var urlChanged  = (currentUrl !== lastUrl);
      var wrapperGone = !wrapper;

      if (urlChanged || wrapperGone) {
        lastUrl = currentUrl;
        buildPicker(window.__versionBadgeData);
      } else if (wrapper && mdTabs) {
        positionWrapper(wrapper);     /* keep in sync while scrolled */
      }

      /* Hide picker when there is no tabs bar (e.g. narrow-screen) */
      if (wrapper) {
        wrapper.style.display = mdTabs ? 'flex' : 'none';
      }
    }, 300);
  }

})();
