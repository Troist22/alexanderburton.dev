/*
  menu.js — lightweight navigation menu controller
  Handles click, selection, and outside-click behaviors for the bubble menu.
  Works with both inline nav and injected nav from nav-loader.js
*/

function initMenuListeners() {
  const menuBtn = document.getElementById('menuBtn');
  const menuDropdown = document.getElementById('menuDropdown');
  const bgMusic = document.getElementById('bgMusic');
  const muteToggle = document.getElementById('muteToggle');

  if (!menuBtn || !menuDropdown) return; // graceful no-op if nav not loaded yet

  menuBtn.addEventListener('click', function () {
    menuDropdown.classList.toggle('active');
    menuBtn.classList.toggle('active');
  });

  // Close menu when any menu link is clicked (except mute button)
  document.querySelectorAll('.menu-item').forEach((item) => {
    item.addEventListener('click', function (e) {
      // Don't close menu if clicking the mute toggle
      if (item.id === 'muteToggle') {
        e.preventDefault();
        return;
      }
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

  // Background music control with persistence across page loads
  if (bgMusic && muteToggle) {
    // Restore previous playback state from localStorage
    const savedTime = parseFloat(localStorage.getItem('bgMusicTime')) || 0;
    const savedPlaying = localStorage.getItem('bgMusicPlaying') === 'true';
    
    bgMusic.currentTime = savedTime;
    
    // Update button state based on saved preference
    if (savedPlaying) {
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          muteToggle.textContent = '🔊 Sound';
        }).catch(() => {
          // Autoplay was prevented
          bgMusic.pause();
          muteToggle.textContent = '🔇 Sound';
          localStorage.setItem('bgMusicPlaying', 'false');
        });
      }
    } else {
      muteToggle.textContent = '🔇 Sound';
    }

    // Save playback position periodically
    setInterval(() => {
      if (!bgMusic.paused) {
        localStorage.setItem('bgMusicTime', bgMusic.currentTime.toString());
      }
    }, 500);

    // Save state before page unload
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('bgMusicTime', bgMusic.currentTime.toString());
      localStorage.setItem('bgMusicPlaying', (!bgMusic.paused).toString());
    });

    // Mute/unmute toggle
    muteToggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (bgMusic.paused) {
        bgMusic.play();
        muteToggle.textContent = '🔊 Sound';
        localStorage.setItem('bgMusicPlaying', 'true');
      } else {
        bgMusic.pause();
        muteToggle.textContent = '🔇 Sound';
        localStorage.setItem('bgMusicPlaying', 'false');
      }
    });
  }
}

// Initialize on DOMContentLoaded (supports both inline and injected nav)
document.addEventListener('DOMContentLoaded', initMenuListeners);

// Export for nav-loader.js to call after injection
window.initMenuListeners = initMenuListeners;
