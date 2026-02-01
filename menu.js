/**
 * menu.js — Navigation Menu & Audio Controller
 * 
 * PURPOSE:
 *   Manages all interactions with the navigation menu:
 *   - Opening/closing menu dropdown
 *   - Closing menu when links clicked
 *   - Closing menu when clicking outside
 *   - Background music playback & persistence
 *   - Volume control visibility
 *   - Writer mode page switching
 * 
 * KEY FLOW:
 *   1. nav-loader.js injects nav.html into DOM
 *   2. nav-loader.js calls window.initMenuListeners()
 *   3. This function attaches event listeners to injected nav elements
 *   4. Background music state is restored from localStorage
 * 
 * STORAGE (localStorage keys):
 *   - bgMusicTime: Current playback position (seconds)
 *   - bgMusicPlaying: true/false (was music playing?)
 *   - bgMusicVolume: 0-100 (volume percentage)
 * 
 * AUTHOR: Alexander Burton
 */

/**
 * WRITER_MODE_PAGE_MAP
 * Maps production pages to their writer mode equivalents.
 * Centralized configuration for easy maintenance and scalability.
 * 
 * To add a new page pair:
 *   1. Add entry to this map
 *   2. Create corresponding _writer.html file
 *   3. Update nav.html links if needed
 * 
 * Format: { 'production.html': 'production_writer.html' }
 */
const WRITER_MODE_PAGE_MAP = Object.freeze({
  'index.html': 'index_writer.html',
  'about_me.html': 'about_me_writer.html',
  'software.html': 'software_writer.html',
  'editing_animations.html': 'editing_animations_writer.html',
  'my_journey.html': 'myjourneywriter.html'
});

function initMenuListeners() {
  // ─────────────────────────────────────────────────────────────
  // GATHER REFERENCES TO DOM ELEMENTS
  // ─────────────────────────────────────────────────────────────
  const menuBtn = document.getElementById('menuBtn');              // Nav button
  const menuDropdown = document.getElementById('menuDropdown');    // Menu items container
  const bgMusic = document.getElementById('bgMusic');              // Audio element
  const muteToggle = document.getElementById('muteToggle');        // Sound on/off button
  const writerModeToggle = document.getElementById('writerModeToggle'); // Mode switch button
  const volumeControl = document.getElementById('volumeControl');  // Volume slider container
  const volumeSlider = document.getElementById('volumeSlider');    // Slider input

  // If nav elements don't exist, return early (nav-loader may not have finished)
  if (!menuBtn || !menuDropdown) return;

  // ─────────────────────────────────────────────────────────────
  // HELPER: Update volume slider visibility
  // ─────────────────────────────────────────────────────────────
  /**
   * Shows volume slider only when:
   *   - Menu is open AND
   *   - Music is currently playing
   * 
   * Hides otherwise (no point showing volume control if music isn't playing)
   */
  function updateVolumeControlVisibility() {
    if (!volumeControl || !bgMusic) return;
    
    const menuIsOpen = menuDropdown.classList.contains('active');
    const musicIsPlaying = !bgMusic.paused;
    
    if (menuIsOpen && musicIsPlaying) {
      volumeControl.classList.add('visible');
    } else {
      volumeControl.classList.remove('visible');
    }
  }

  // ═════════════════════════════════════════════════════════════
  // MENU TOGGLE: Open/close dropdown on button click
  // ═════════════════════════════════════════════════════════════
  menuBtn.addEventListener('click', function () {
    menuDropdown.classList.toggle('active');   // Show/hide menu items
    menuBtn.classList.toggle('active');        // Highlight button state
    updateVolumeControlVisibility();            // Show/hide volume slider
  });

  // ═════════════════════════════════════════════════════════════
  // MENU CLOSE: Click any link to close menu
  // ═════════════════════════════════════════════════════════════
  /**
   * When clicking menu items (links/buttons):
   *   - Special case: muteToggle & writerModeToggle stay open (don't close menu)
   *   - Normal case: close menu and button after clicking
   * 
   * This improves UX:
   *   - Clicking "Home" navigates and closes menu
   *   - Toggling sound doesn't close menu (you might adjust volume next)
   */
  document.querySelectorAll('.menu-item').forEach((item) => {
    item.addEventListener('click', function (e) {
      // Keep menu open for special buttons
      const isSpecialButton = (item.id === 'muteToggle' || item.id === 'writerModeToggle');
      if (isSpecialButton) {
        e.preventDefault();
        return; // Don't close menu
      }
      
      // For regular links: close menu
      menuDropdown.classList.remove('active');
      menuBtn.classList.remove('active');
      updateVolumeControlVisibility();
    });
  });

  // ═════════════════════════════════════════════════════════════
  // MENU CLOSE: Click outside menu to dismiss
  // ═════════════════════════════════════════════════════════════
  /**
   * Standard UX pattern: clicking page content closes menu
   * Allows quick navigation without menu button click
   */
  document.addEventListener('click', function (e) {
    const clickedMenu = menuBtn.contains(e.target) || menuDropdown.contains(e.target);
    if (!clickedMenu) {
      // Clicked outside menu area
      menuDropdown.classList.remove('active');
      menuBtn.classList.remove('active');
      updateVolumeControlVisibility();
    }
  });

  // ═════════════════════════════════════════════════════════════
  // AUDIO MANAGEMENT: Restore state & handle playback
  // ═════════════════════════════════════════════════════════════
  if (bgMusic && muteToggle) {
    // INITIALIZATION: Restore previous playback state
    const savedPlaybackPosition = parseFloat(localStorage.getItem('bgMusicTime')) || 0;
    const wasMusicPlaying = localStorage.getItem('bgMusicPlaying') === 'true';
    
    bgMusic.currentTime = savedPlaybackPosition;
    
    // If music was playing, resume it (with autoplay policy handling)
    if (wasMusicPlaying) {
      const playPromise = bgMusic.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Autoplay allowed, music is now playing
            muteToggle.textContent = '🔊 Sound';
            updateVolumeControlVisibility();
          })
          .catch(() => {
            // Autoplay blocked by browser (common on mobile)
            // User must click sound button manually to start
            bgMusic.pause();
            muteToggle.textContent = '🔇 Sound';
            localStorage.setItem('bgMusicPlaying', 'false');
            if (volumeControl) volumeControl.classList.remove('visible');
          });
      }
    } else {
      // Music wasn't playing before
      muteToggle.textContent = '🔇 Sound';
      if (volumeControl) volumeControl.classList.remove('visible');
    }

    // PERSISTENCE: Save playback position every 500ms
    // This ensures we can resume from exact position on page reload
    setInterval(() => {
      if (!bgMusic.paused) {
        localStorage.setItem('bgMusicTime', bgMusic.currentTime.toString());
      }
    }, 500);

    // PERSISTENCE: Save state when user leaves page
    // beforeunload fires when navigating to new page or closing tab
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('bgMusicTime', bgMusic.currentTime.toString());
      localStorage.setItem('bgMusicPlaying', (!bgMusic.paused).toString());
    });

    // ─────────────────────────────────────────────────────────────
    // SOUND BUTTON: Play/pause toggle
    // ─────────────────────────────────────────────────────────────
    muteToggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (bgMusic.paused) {
        // Resume music
        bgMusic.play();
        muteToggle.textContent = '🔊 Sound';
        localStorage.setItem('bgMusicPlaying', 'true');
      } else {
        // Pause music
        bgMusic.pause();
        muteToggle.textContent = '🔇 Sound';
        localStorage.setItem('bgMusicPlaying', 'false');
      }
      updateVolumeControlVisibility();
    });

    // ─────────────────────────────────────────────────────────────
    // VOLUME SLIDER: Adjust music volume
    // ─────────────────────────────────────────────────────────────
    if (volumeSlider) {
      // Load saved volume (or default to 50%)
      const savedVolume = localStorage.getItem('bgMusicVolume') || '50';
      volumeSlider.value = savedVolume;
      bgMusic.volume = parseInt(savedVolume) / 100;

      // Show volume control if music already playing
      if (!bgMusic.paused && volumeControl) {
        volumeControl.classList.add('visible');
      }

      // Update volume when user moves slider
      volumeSlider.addEventListener('input', function (e) {
        const volumePercent = parseInt(e.target.value);
        bgMusic.volume = volumePercent / 100;
        localStorage.setItem('bgMusicVolume', e.target.value);
      });
    }
  }

  // ═════════════════════════════════════════════════════════════
  // WRITER MODE: Switch between production and editing pages
  // ═════════════════════════════════════════════════════════════
  /**
   * Clicking "Writer Mode" button navigates to editor versions.
   * Uses WRITER_MODE_PAGE_MAP constant to determine target page.
   * 
   * Writer mode allows editing content without affecting production.
   * To add new page pairs, update WRITER_MODE_PAGE_MAP at top of file.
   */
  if (writerModeToggle) {
    writerModeToggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Extract current page filename from URL
      const currentPagePath = window.location.pathname;
      const currentPageFilename = currentPagePath.split('/').pop() || 'index.html';
      
      // Look up writer mode page from centralized map
      const writerPageFilename = WRITER_MODE_PAGE_MAP[currentPageFilename];
      
      if (writerPageFilename) {
        // Navigate to writer mode version of current page
        window.location.href = writerPageFilename;
      }
      // If current page doesn't have writer mode, do nothing
    });
  }
}

// ═════════════════════════════════════════════════════════════
// INITIALIZATION HOOKS
// ═════════════════════════════════════════════════════════════

/**
 * If nav.html is inline in HTML (not injected), initialize immediately on DOMContentLoaded
 * This covers case where menu.js loads and nav already exists in DOM
 */
document.addEventListener('DOMContentLoaded', initMenuListeners);

/**
 * Export function globally so nav-loader.js can call it after injection
 * This covers case where menu.js loads BEFORE nav-loader.js injects nav.html
 * 
 * nav-loader.js will:
 *   1. Inject nav.html into DOM
 *   2. Call window.initMenuListeners()
 *   3. Listeners attach to freshly injected elements
 */
window.initMenuListeners = initMenuListeners;
