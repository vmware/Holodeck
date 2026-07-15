/*
 * version-badge.js
 *
 * Moves the MkDocs Material / mike version picker (.md-version) from the
 * header into the RIGHT end of the sticky navigation tabs bar, placing it
 * directly below the GitHub source button — permanently visible on scroll.
 *
 * bundle.js creates .md-version asynchronously (via RxJS), so we poll
 * every 100 ms for up to 8 seconds rather than relying on DOMContentLoaded.
 */

(function () {
  'use strict';

  var WRAPPER_ID = 'md-version-tab-wrapper';

  function tryMove() {
    /* Already done */
    if (document.getElementById(WRAPPER_ID)) return true;

    /*
     * bundle.js creates the picker dynamically with class "md-version".
     * data-md-component="version" is absent from the static HTML, so we
     * target the class directly.
     */
    var picker = document.querySelector('.md-version');
    if (!picker) return false;

    var tabsList = document.querySelector('.md-tabs__list');
    if (!tabsList) return false;

    /* Wrap in a <li> so it sits naturally in the flex tab list */
    var li = document.createElement('li');
    li.id = WRAPPER_ID;

    /* Physical move — all mike event listeners travel with the node */
    li.appendChild(picker);
    tabsList.appendChild(li);

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
