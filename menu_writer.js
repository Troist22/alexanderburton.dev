/*
  menu_writer.js — lightweight navigation menu controller for writer mode
  Handles click, selection, and outside-click behaviors for the bubble menu.
  Works with both inline nav and injected nav from nav_loader_writer.js
*/

function initMenuListeners() {
  const menuBtn = document.getElementById('menuBtn');
  const menuDropdown = document.getElementById('menuDropdown');
  const bgMusic = document.getElementById('bgMusic');
  const muteToggle = document.getElementById('muteToggle');
  const writerModeToggle = document.getElementById('writerModeToggle');
  const volumeControl = document.getElementById('volumeControl');
  const volumeSlider = document.getElementById('volumeSlider');

  if (!menuBtn || !menuDropdown) return; // graceful no-op if nav not loaded yet

  // Centralized function to update volume control visibility
  function updateVolumeControlVisibility() {
    if (!volumeControl || !bgMusic) return;
    
    const menuIsOpen = menuDropdown.classList.contains('active');
    const soundIsOn = !bgMusic.paused;
    
    if (menuIsOpen && soundIsOn) {
      volumeControl.classList.add('visible');
    } else {
      volumeControl.classList.remove('visible');
    }
  }

  menuBtn.addEventListener('click', function () {
    menuDropdown.classList.toggle('active');
    menuBtn.classList.toggle('active');
    updateVolumeControlVisibility();
  });

  // Close menu when any menu link is clicked (except mute button and writer mode toggle)
  document.querySelectorAll('.menu-item').forEach((item) => {
    item.addEventListener('click', function (e) {
      // Don't close menu if clicking the mute toggle or writer mode toggle
      if (item.id === 'muteToggle' || item.id === 'writerModeToggle') {
        e.preventDefault();
        return;
      }
      menuDropdown.classList.remove('active');
      menuBtn.classList.remove('active');
      updateVolumeControlVisibility();
    });
  });

  // Dismiss menu when clicking outside
  document.addEventListener('click', function (e) {
    if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
      menuDropdown.classList.remove('active');
      menuBtn.classList.remove('active');
      updateVolumeControlVisibility();
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
          updateVolumeControlVisibility();
        }).catch(() => {
          // Autoplay was prevented
          bgMusic.pause();
          muteToggle.textContent = '🔇 Sound';
          localStorage.setItem('bgMusicPlaying', 'false');
          if (volumeControl) volumeControl.classList.remove('visible');
        });
      }
    } else {
      muteToggle.textContent = '🔇 Sound';
      if (volumeControl) volumeControl.classList.remove('visible');
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
      updateVolumeControlVisibility();
    });

    // Volume slider control
    if (volumeSlider) {
      // Load saved volume or default to 50%
      const savedVolume = localStorage.getItem('bgMusicVolume') || '50';
      volumeSlider.value = savedVolume;
      bgMusic.volume = parseInt(savedVolume) / 100;

      // Show volume control if music is playing
      if (!bgMusic.paused && volumeControl) {
        volumeControl.classList.add('visible');
      }

      volumeSlider.addEventListener('input', function (e) {
        const volume = parseInt(e.target.value) / 100;
        bgMusic.volume = volume;
        localStorage.setItem('bgMusicVolume', e.target.value);
      });
    }
  }

  // Writer Mode toggle - switches back to coder mode
  if (writerModeToggle) {
    writerModeToggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Get current page name
      const currentPage = window.location.pathname.split('/').pop();
      
      // Convert from writer page to normal page
      if (currentPage === 'index_writer.html') {
        window.location.href = 'index.html';
      } else if (currentPage === 'about_me_writer.html') {
        window.location.href = 'about_me.html';
      } else if (currentPage === 'software_writer.html') {
        window.location.href = 'software.html';
      } else if (currentPage === 'editing_animations_writer.html') {
        window.location.href = 'editing_animations.html';
      } else if (currentPage === 'myjourneywriter.html') {
        window.location.href = 'my_journey.html';
      }
    });
  }
}

// Initialize on DOMContentLoaded (supports both inline and injected nav)
document.addEventListener('DOMContentLoaded', initMenuListeners);

// Export for nav-loader.js to call after injection
window.initMenuListeners = initMenuListeners;
