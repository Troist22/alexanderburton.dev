/*
  menu.js — lightweight navigation menu controller
  Handles click, selection, and outside-click behaviors for the bubble menu.
  Works with both inline nav and injected nav from nav-loader.js
*/

function initMenuListeners() {
  const menuBtn = document.getElementById('menuBtn');
  const menuDropdown = document.getElementById('menuDropdown');

  if (!menuBtn || !menuDropdown) return; // graceful no-op if nav not loaded yet

  menuBtn.addEventListener('click', function () {
    menuDropdown.classList.toggle('active');
    menuBtn.classList.toggle('active');
  });

  // Close menu when any menu link is clicked
  document.querySelectorAll('.menu-item').forEach((item) => {
    item.addEventListener('click', function () {
      menuDropdown.classList.remove('active');
      menuBtn.classList.remove('active');
    });
  });

  // Dismiss menu when clicking outside
  document.addEventListener('click', function (e) {
    if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
      menuDropdown.classList.remove('active');
      menuBtn.classList.remove('active');
    }
  });
}

// Initialize on DOMContentLoaded (supports both inline and injected nav)
document.addEventListener('DOMContentLoaded', initMenuListeners);

// Export for nav-loader.js to call after injection
window.initMenuListeners = initMenuListeners;
