/*
 * version-badge.js
 *
 * Moves the MkDocs Material / mike version picker (.md-version) from the
 * header into the RIGHT end of the sticky navigation tabs bar, placing it
 * directly below the GitHub source button — permanently visible on scroll.
 *
 * The dropdown is repositioned with position:fixed + getBoundingClientRect()
 * so it always appears directly below the button regardless of scroll depth
 * or CSS containing-block quirks caused by the sticky tabs bar.
 */

(function () {
  'use strict';

  var WRAPPER_ID = 'md-version-tab-wrapper';

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

    /* Pin when the user opens the dropdown (hover + focus for keyboard nav) */
    btn.addEventListener('mouseenter', pin);
    btn.addEventListener('focus',      pin);
    list.addEventListener('mouseenter', pin); /* re-pin if user lingers */
  }

  /* ── Move picker into the tabs bar ──────────────────────────────────── */

  function tryMove() {
    if (document.getElementById(WRAPPER_ID)) return true;

    var picker = document.querySelector('.md-version');
    if (!picker) return false;

    var tabsList = document.querySelector('.md-tabs__list');
    if (!tabsList) return false;

    var li = document.createElement('li');
    li.id = WRAPPER_ID;
    li.appendChild(picker);
    tabsList.appendChild(li);

    /* Wait one tick so the element is rendered before we query it */
    setTimeout(function () { setupDropdown(li); }, 0);

    return true;
  }

  /* Poll every 100 ms; give up after 8 s (80 attempts) */
  var attempts = 0;
  var poll = setInterval(function () {
    if (tryMove() || ++attempts >= 80) clearInterval(poll);
  }, 100);

  /* Re-run after MkDocs Material instant-navigation page switches */
  document.addEventListener('DOMContentSwitch', function () {
    attempts = 0;
    var old = document.getElementById(WRAPPER_ID);
    if (old) old.remove();
    clearInterval(poll);
    poll = setInterval(function () {
      if (tryMove() || ++attempts >= 80) clearInterval(poll);
    }, 100);
  });
})();
