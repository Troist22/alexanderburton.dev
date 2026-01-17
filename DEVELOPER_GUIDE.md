# Developer Guide - How This Site Works

Technical details for people working on the code.

## Table of Contents

1. [File Relationships](#file-relationships)
2. [JavaScript Execution Flow](#javascript-execution-flow)
3. [Cache Versioning](#cache-versioning)
4. [localStorage](#localstorage)
5. [Editor Workflow](#editor-workflow)
6. [Making Changes](#making-changes)
7. [Troubleshooting](#troubleshooting)

---

## File Relationships

### The _writer Pattern

I have two versions of important files. One for live (index.html), one for testing (index_writer.html).

| What | Live Version | Testing Version | Why |
|------|--------------|-----------------|-----|
| Home page | `index.html` | `index_writer.html` | Edit and test locally first |
| About page | `about_me.html` | `about_me_writer.html` | Don't break the live site |
| Projects page | `software.html` | `software_writer.html` | Same reason |
| Blog | `my_journey.html` | `myjourneywriter.html` | Same reason |
| Menu | `nav.html` | `nav_writer.html` | Test menu changes |
| Menu logic | `menu.js` | `menu_writer.js` | Debug without affecting live |
| Nav injector | `nav-loader.js` | `nav_loaderwriter.js` | Test cache logic |
| Styles | `style.css` | `style_writer.css` | Try new colors first |

The idea: Always edit the _writer version first. Test it in your browser. Once it looks good, copy the changes to the live version.

---

## How JavaScript Runs When You Load a Page

Here's what happens when someone visits index.html:

```
1. Browser downloads and reads index.html

   In the <head>:
   - Loads style.css (colors and layout)
   - Hints browser to fetch nav.html early (optimization)
   - Loads menu.js (defines what menu buttons do)
   - Loads nav-loader.js (injects menu into page)

2. Browser reads the <body> and renders it
   - <header> is empty (waiting for menu)
   - <main> has page content
   - Page is shown, but menu isn't there yet

3. When page finishes loading:

   nav-loader.js checks: "Is nav.html already cached?"
   
   If NO: Fetch nav.html from server
           Save it in browser storage
   
   Then: Take the nav.html code and inject it at the top of the page
         Now the menu appears

4. Once menu is in the page:
   
   Call the function from menu.js: initMenuListeners()
   This function adds click handlers:
   - Menu button opens/closes
   - Menu items respond to clicks
   - Music volume slider works
   - Music state gets restored

5. Page is now interactive
   User can click everything
```

**Important rule:** menu.js must load before nav-loader.js. That way when nav-loader.js runs and calls initMenuListeners(), that function already exists.

---

## Caching and Version Numbers

### The nav.html Cache

The browser saves nav.html (the menu) in storage so it doesn't have to fetch it every single time. The key name includes a version number.

When you change nav.html (add a menu item, change button text, etc.), you bump the version number. Browsers see "Oh, there's a new version" and re-fetch the new menu.

### When to Bump the Version

Edit nav-loader.js and change the version (3.2 → 3.3) if:
- Menu items added or removed
- Menu button structure changed
- Audio file path changed
- Anything that would break menu.js lookups

Do the same in nav_loaderwriter.js for testing.

### How to Do It

```javascript
// In nav-loader.js (live)
const NAV_CACHE_VERSION = '3.2';  // Change to: '3.3'

// In nav_loaderwriter.js (testing)
const NAV_CACHE_VERSION = '3.2';  // Change to whatever version you're testing
```

When you push with a new version number, all browsers will automatically fetch the new nav.html on their next page load.

---

## Browser Storage

Two things get saved in browser storage:

### Music State
```javascript
bgMusicTime: '45.3'        // Current position in song (seconds)
bgMusicPlaying: 'true'     // Is it playing or paused?
bgMusicVolume: '75'        // Volume 0-100
```

Every 500ms while music is playing, these get updated. When someone comes back to the site, their music resumes from exactly where they left off.

### Cached Menu (nav.html)
```javascript
// The key name includes version
navbar_html_cache_v3.2 = "<nav> ... entire menu code ... </nav>"
```

This is the full HTML of the menu. Cached so the next page load doesn't have to fetch it.

---

## Editing and Testing Workflow

### Let's say you want to add a new blog post

1. Open `my_journey_writer.html`
2. Add your blog post
3. Open that file in your browser
4. Check that it looks good
5. Copy the changes to the live `my_journey.html`
6. Push to git
7. Done

### Let's say you want to change the menu

1. Edit `nav_writer.html` (add/remove a menu item)
2. Go to `nav_loaderwriter.js` and bump the version (3.2 → 3.3)
3. Open `index_writer.html` in your browser
4. Check that the menu looks right and works
5. Copy both files to production (`nav.html`, `nav-loader.js`)
6. Bump the version in the production `nav-loader.js` too
7. Push to git
8. Users get the new menu next time they refresh

---

## Styling and Colors

All colors are defined in one place in `style.css`. Look for the `:root` section:

```css
:root {
    --primary-green: #00ff41;
    --black: #000000;
    --dark-grey: #2a2a2a;
    --font-mono: 'Courier New', monospace;
}
```

Everywhere in the CSS that uses green, it's `var(--primary-green)`. So if you want to change the accent color from green to blue, just edit that one line and everything updates.

---

## Responsive Design

The site works on phones, tablets, and desktops. CSS media queries handle different screen sizes. Check `style.css` for the breakpoints.

Mobile-specific stuff already implemented:
- No horizontal scrolling
- Text doesn't zoom when rotating phone
- Tap response is fast
- Menu works with touch

---

## Troubleshooting

**Menu doesn't appear**
- Open DevTools (F12) and check Console for errors
- Check Network tab to see if nav.html loaded
- If not loaded, the file might be missing

**Music doesn't resume after reload**
- Check DevTools → Application → Storage → localStorage
- Look for bgMusicTime
- Note: Phones often block autoplay - user has to click play

**Menu works but buttons don't respond**
- Verify menu.js loaded (DevTools → Network tab)
- Check Console for JavaScript errors
- Check inspector - is there an element with id="menuBtn"?

**Changed nav.html but menu didn't update**
- Did you bump the version number in nav-loader.js?
- Try a hard reload: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

**Debugging in console**

```javascript
// See what's cached
localStorage.getItem('navbar_html_cache_v3.2')

// Check music state
localStorage.getItem('bgMusicTime')
localStorage.getItem('bgMusicVolume')

// Clear everything
localStorage.clear()

// Does the menu function exist?
window.initMenuListeners
```

---

## Git Workflow

```bash
# Start working on something
git checkout -b feature/add-blog-post

# Make changes to _writer files
# Test them
# Copy to production files
# Bump cache versions if needed

git add .
git commit -m "Add blog post: whatever the topic is"
git push origin feature/add-blog-post

# Make a pull request, merge to main
# Live site auto-updates
```

---

## Performance Notes

- Nav cache is only ~600 bytes
- Music state is ~50 bytes
- Pages load in ~500ms with cached nav
- No database or server processing needed

If you want to optimize further in the future:
- Minify CSS and JavaScript
- Convert images to WebP
- Add a service worker for offline mode
