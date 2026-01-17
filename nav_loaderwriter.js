/**
 * nav_loaderwriter.js — Writer Mode Navigation Loader
 * 
 * PURPOSE:
 *   Dynamically load and cache the navigation HTML into the DOM.
 *   Writer mode variant for content editing (uses nav_writer.html).
 * 
 * HOW IT WORKS:
 *   1. On page load, checks localStorage for cached nav markup
 *   2. If cached: injects cached HTML immediately (fast)
 *   3. If not cached: fetches nav_writer.html from server, caches it, then injects
 *   4. After injection, calls menu.js listener initialization
 * 
 * CACHE INVALIDATION:
 *   Change NAV_CACHE_VERSION below to force all browsers to refetch nav_writer.html
 *   Example: '1.0' → '1.1' when nav structure changes
 * 
 * PERFORMANCE:
 *   - Avoids fetching same HTML on every page load
 *   - insertAdjacentHTML faster than innerHTML
 *   - Works even if DOM not fully loaded (DOMContentLoaded event)
 */

(function () {
  // ─────────────────────────────────────────────────────────────
  // CONFIGURATION: Update this when nav_writer.html structure changes
  // ─────────────────────────────────────────────────────────────
  const NAV_CACHE_VERSION = '3.2';
  const NAV_FILE_NAME = 'nav_writer.html';
  const STORAGE_KEY = `navbar_html_cache_v${NAV_CACHE_VERSION}_writer`;

  /**
   * Loads nav_writer.html, caches it, and injects into DOM
   * Then triggers menu.js initialization for event listeners
   */
  async function loadNavigation() {
    try {
      // STEP 1: Check if we have nav markup cached in localStorage
      let navMarkup = localStorage.getItem(STORAGE_KEY);

      if (!navMarkup) {
        // STEP 2a: Not cached → fetch from server
        const response = await fetch('/' + NAV_FILE_NAME);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${NAV_FILE_NAME} (HTTP ${response.status})`);
        }
        navMarkup = await response.text();

        // STEP 2b: Try to cache for next page load
        try {
          localStorage.setItem(STORAGE_KEY, navMarkup);
        } catch (storageError) {
          // Storage quota exceeded (rare, but handle gracefully)
          console.warn('localStorage quota exceeded; navigation will refetch on next load', storageError);
        }
      }

      // STEP 3: Inject navigation markup at the beginning of <body>
      // insertAdjacentHTML is faster than innerHTML for adding new content
      document.body.insertAdjacentHTML('afterbegin', navMarkup);

      // STEP 4: Initialize menu event listeners (from menu_writer.js)
      // Must happen AFTER nav is injected so elements exist in DOM
      if (typeof window.initMenuListeners === 'function') {
        window.initMenuListeners();
      }

    } catch (error) {
      console.error('Navigation loader error:', error);
      // Page still works without nav, but users won't see navigation
    }
  }

  /**
   * Wait for DOM to be ready, then load navigation
   * If DOM already loaded, call loadNavigation immediately
   */
  if (document.readyState === 'loading') {
    // DOM still parsing HTML
    document.addEventListener('DOMContentLoaded', loadNavigation);
  } else {
    // DOM already ready (script loaded late or cached)
    loadNavigation();
  }
})();
