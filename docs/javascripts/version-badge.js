/*
 * version-badge.js
 *
 * Renders an interactive version picker inside the sticky navigation tabs bar.
 *
 * How it works:
 *  1. Waits (via MutationObserver) for mike to populate its header version
 *     picker (.md-version__current + .md-version__list).
 *  2. Reads the list of versions and their root URLs from that picker.
 *  3. Injects a dropdown button into the tabs bar, right-aligned.
 *  4. On version selection, navigates to the SAME page in the new version
 *     (e.g. /9.1/release_notes/ → /9.0.2/release_notes/).
 */

(function () {
  'use strict';

  var PICKER_ID = 'md-version-tab-picker';

  /* ─── URL helpers ───────────────────────────────────────────────────── */

  /**
   * Build the target URL when switching to another version.
   * Preserves the current page path relative to the version root.
   *
   * @param {HTMLAnchorElement} targetLink  – mike's <a> for the new version
   * @param {string}            currentVersion – text of the active version
   * @returns {string} absolute URL
   */
  function makeVersionUrl(targetLink, currentVersion) {
    var allLinks = document.querySelectorAll('.md-version__list a');
    var currentRoot = null;

    for (var i = 0; i < allLinks.length; i++) {
      if (allLinks[i].textContent.trim() === currentVersion) {
        currentRoot = allLinks[i].href; // e.g. http://host/9.1/
        break;
      }
    }

    if (!currentRoot) return targetLink.href;

    /* Strip fragment + query from current page URL */
    var pageUrl = window.location.href.split('?')[0].split('#')[0];

    var relPath = '';
    if (pageUrl.startsWith(currentRoot)) {
      relPath = pageUrl.slice(currentRoot.length); // e.g. "release_notes/"
    }

    return targetLink.href + relPath;
  }

  /* ─── Picker builder ────────────────────────────────────────────────── */

  function buildPicker() {
    var currentEl = document.querySelector('.md-version__current');
    if (!currentEl) return false;
    var currentVersion = currentEl.textContent.trim();
    if (!currentVersion) return false;

    var mikeLinks = Array.from(
      document.querySelectorAll('.md-version__list a')
    );
    if (!mikeLinks.length) return false;

    var tabsList = document.querySelector('.md-tabs__list');
    if (!tabsList) return false;

    /* Remove stale picker */
    var old = document.getElementById(PICKER_ID);
    if (old) old.remove();

    /* ── outer <li> ────────────────────────────────────────────────── */
    var li = document.createElement('li');
    li.id = PICKER_ID;

    var wrap = document.createElement('div');
    wrap.className = 'md-version-tab-picker';

    /* ── toggle button ─────────────────────────────────────────────── */
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'md-version-tab-picker__btn';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML =
      '<span class="md-version-tab-picker__label">v' + currentVersion + '</span>' +
      '<svg class="md-version-tab-picker__arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M7 10l5 5 5-5z"/>' +
      '</svg>';

    /* ── dropdown list ─────────────────────────────────────────────── */
    var ul = document.createElement('ul');
    ul.className = 'md-version-tab-picker__dropdown';
    ul.setAttribute('role', 'listbox');
    ul.hidden = true;

    mikeLinks.forEach(function (link) {
      var ver      = link.textContent.trim();
      var isActive = ver === currentVersion;
      var destUrl  = makeVersionUrl(link, currentVersion);

      var item = document.createElement('li');
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', String(isActive));
      item.className =
        'md-version-tab-picker__item' +
        (isActive ? ' md-version-tab-picker__item--active' : '');

      var a = document.createElement('a');
      a.href = destUrl;
      a.className = 'md-version-tab-picker__link';
      a.textContent = ver;

      item.appendChild(a);
      ul.appendChild(item);
    });

    /* ── interactions ──────────────────────────────────────────────── */

    /* Open / close */
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !ul.hidden;
      ul.hidden = open;
      btn.setAttribute('aria-expanded', String(!open));
    });

    /* Close on outside click */
    document.addEventListener('click', function () {
      ul.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    });

    /* Prevent dropdown clicks from bubbling to document */
    ul.addEventListener('click', function (e) { e.stopPropagation(); });

    /* Keyboard: Escape closes */
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        ul.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });

    wrap.appendChild(btn);
    wrap.appendChild(ul);
    li.appendChild(wrap);
    tabsList.appendChild(li);

    return true;
  }

  /* ─── Init with MutationObserver ────────────────────────────────────── */

  function startObserver() {
    if (buildPicker()) return;

    var timer = null;
    var observer = new MutationObserver(function (_, obs) {
      if (buildPicker()) {
        obs.disconnect();
        clearTimeout(timer);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    /* Safety net: give up after 4 s */
    timer = setTimeout(function () { observer.disconnect(); }, 4000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver);
  } else {
    startObserver();
  }

  /* Re-run on MkDocs Material instant-navigation page switches */
  document.addEventListener('DOMContentSwitch', startObserver);
})();
