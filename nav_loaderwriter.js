/*
  nav_loaderwriter.js — DRY navigation injection for writer mode
  - Caches nav_writer.html in localStorage (persists across browser sessions)
  - Cache versioning: invalidate cache by incrementing NAV_CACHE_VERSION
  - Injects once per load; CSS media queries handle responsive behavior
*/

(function () {
  // Increment this version to invalidate cache across all browsers
  const NAV_CACHE_VERSION = '1.0';
  const NAV_CACHE_KEY = `navbar_html_cache_v${NAV_CACHE_VERSION}_writer`;
  const NAV_FILE = 'nav_writer.html';

  async function loadNav() {
    try {
      // Check localStorage cache first (persists across browser sessions)
      let navHTML = localStorage.getItem(NAV_CACHE_KEY);

      if (!navHTML) {
        // Fetch if not cached
        const response = await fetch(NAV_FILE);
        if (!response.ok) throw new Error(`Failed to fetch ${NAV_FILE}`);
        navHTML = await response.text();

        // Cache in localStorage (persists until cache version changes)
        try {
          localStorage.setItem(NAV_CACHE_KEY, navHTML);
        } catch (e) {
          // graceful fallback if localStorage quota exceeded
          console.warn('localStorage full; nav will refetch next load', e);
        }
      }

      // Inject into DOM (insertAdjacentHTML is faster than innerHTML)
      document.body.insertAdjacentHTML('afterbegin', navHTML);

      // Trigger menu.js initialization (if present)
      // This ensures event listeners attach after nav is in the DOM
      if (window.initMenuListeners) {
        window.initMenuListeners();
      }
    } catch (error) {
      console.error('Error loading navigation:', error);
    }
  }

  // Load nav when DOM is interactive
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNav);
  } else {
    loadNav();
  }
})();
