/*
 * version-badge.js
 *
 * Moves mike's native version picker element ([data-md-component="version"])
 * from the header into the sticky navigation tabs bar so it remains visible
 * while scrolling — without rebuilding any picker logic ourselves.
 */

(function () {
  'use strict';

  var WRAPPER_ID = 'md-version-tab-wrapper';

  function move() {
    /* Already done */
    if (document.getElementById(WRAPPER_ID)) return true;

    /* Mike renders the picker asynchronously; bail if not ready yet */
    var picker = document.querySelector('[data-md-component="version"]');
    if (!picker) return false;

    var tabsList = document.querySelector('.md-tabs__list');
    if (!tabsList) return false;

    /* Wrap in a <li> so it sits cleanly in the tabs flex list */
    var li = document.createElement('li');
    li.id = WRAPPER_ID;

    /* Move (not clone) — preserves all mike event listeners */
    li.appendChild(picker);
    tabsList.appendChild(li);

    return true;
  }

  function start() {
    if (move()) return;

    var timer   = null;
    var observer = new MutationObserver(function (_, obs) {
      if (move()) {
        obs.disconnect();
        clearTimeout(timer);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    timer = setTimeout(function () { observer.disconnect(); }, 5000);
  }

  /* Initial load */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  /* MkDocs Material instant-navigation re-renders the header; re-move on each switch */
  document.addEventListener('DOMContentSwitch', function () {
    var old = document.getElementById(WRAPPER_ID);
    if (old) old.remove();
    start();
  });
})();
