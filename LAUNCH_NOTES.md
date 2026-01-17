# Launch Notes - January 2026

Site: https://alexander.burton.dev
Launched: January 16, 2026
Status: Live one week

## What's Working

- 4 main pages (home, about, portfolio, blog)
- Menu loads from cache (faster)
- Background music that saves where you left off
- Safe mode for testing changes without breaking live site
- Works on phones and computers
- Search engine stuff (keywords, metadata)
- No special frameworks or dependencies

---

## How I Built It

**No framework** - This is just HTML, CSS, and JavaScript. No React or Vue. Simpler to understand and faster to load.

**Navigation system** - Instead of putting the menu code in every page, I put it in nav.html and inject it when the page loads. It gets saved in the browser so the next page doesn't have to fetch it again.

**Writer mode** - I have two versions of each file. The _writer versions are for testing locally. Once I'm happy with changes, I copy them to the real files. This way I can't accidentally break the live site.

**Cache versioning** - When nav.html changes, I bump the version number (3.2 → 3.3). Browsers see the new version and re-fetch the menu. No manual cache clearing needed.

**Music state** - The music player saves three things: where you are in the song, whether it's playing, and the volume. When you come back, it resumes from exactly where you left off.

---

## Search Engine Setup

I added meta tags to all pages so Google can understand what they're about:
- Keywords match the actual content (languages, tools, skills)
- Each page has a description that shows up in search results
- Social media tags so links look nice when shared
- Location data pointing to Indianapolis

No sketchy stuff. Just honest keywords that match the page content.

---

---

## File Names Explained

Live versions end with nothing. Testing versions end with _writer.

```
Live site              Testing version        What it does
─────────────────      ──────────────────     ─────────────
index.html       →     index_writer.html      Homepage
about_me.html    →     about_me_writer.html   About page
software.html    →     software_writer.html   Projects page
my_journey.html  →     myjourneywriter.html   Blog posts
nav.html         →     nav_writer.html        Menu
style.css        →     style_writer.css       Colors and layout
menu.js          →     menu_writer.js         Menu buttons work
nav-loader.js    →     nav_loaderwriter.js    Menu injection
```

Edit the _writer versions. Test them. Then copy to the live versions when they're good.

---

## Common Tasks

### Adding a Blog Post
1. Open `my_journey_writer.html`
2. Add your blog content
3. Test in browser
4. Copy it to `my_journey.html`
5. Commit to git

### Updating the Menu
1. Edit `nav_writer.html`
2. Change the version number in `nav_loaderwriter.js` (3.2 → 3.3)
3. Test in browser
4. Copy both files to the live versions (`nav.html` and `nav-loader.js`)
5. Users will get the new menu on their next page load

### Changing Colors
Edit `style.css` and find the `:root` section at the top. Change the color values. Everything updates automatically.

```css
--primary-green: #00ff41;  /* Change this line for a new color */
```

### Changing the Background Music
Just replace the file at `assets/music/backgroundsong.mp3` with your own music. Keep the filename the same so the HTML doesn't need to change.

### Fixing a Bug
1. Edit the live file directly
2. If you changed nav.html, bump the version in nav-loader.js
3. Test with hard reload: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
4. Commit and push

---

## What Gets Cached and Stored

**Navigation menu** - About 600 bytes, saved in browser storage. Stays there until the version number changes.

**Music state** - About 50 bytes. Three pieces of data:
- `bgMusicTime` - Where you are in the song
- `bgMusicPlaying` - Is it playing or paused?
- `bgMusicVolume` - Volume level (0-100)

Gets updated every 500ms while music is playing.

**Page load speed** - Usually ~500ms with cached menu, ~1 second until interactive. Music resumes instantly from storage.

---

## Known Gaps

Not built yet (could add later):
- Contact form
- Analytics
- Blog search
- Image optimization
- sitemap.xml
- Schema markup (fancy Google stuff)
- Music autoplay on phones (browsers block this - user has to click play)

---

## Troubleshooting

**Menu doesn't show up**
- Open DevTools (F12) and check the Console tab for red errors
- Check the Network tab to see if nav.html loaded
- If not, the file might be missing or the URL is wrong

**Music doesn't remember where it was**
- Check if localStorage is turned on in your browser
- Go to DevTools → Application → Storage → localStorage and look for bgMusicTime
- Phones sometimes block autoplay (browser policy) - user has to click play

**Changed nav.html but it's still showing the old menu**
- Did you bump the version number in nav-loader.js? (3.2 → 3.3)
- If not, browsers are showing the cached old version
- Also try a hard reload: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

**Menu button doesn't respond**
- Check if menu.js and nav-loader.js both loaded (DevTools → Network tab)
- Look for JavaScript errors in the Console
- Make sure nav.html has an element with id="menuBtn"

**Debugging in browser console**

```javascript
// Is nav cached?
localStorage.getItem('navbar_html_cache_v3.2')

// What's the music state?
localStorage.getItem('bgMusicTime')
localStorage.getItem('bgMusicVolume')

// Clear everything
localStorage.clear()

// Does the menu function exist?
window.initMenuListeners
```

---

## Next Steps

Things to do soon:
- Sign up for Google Search Console so Google knows about the site
- Add Google Analytics to track visitors
- Check how we're ranking for our target keywords
- Test on different phones and browsers

Things to do eventually:
- Build a real contact form with email
- Create sitemap.xml for search engines
- Add robots.txt
- Optimize images (WebP format)

Things that could wait:
- Dark/light mode toggle
- Blog search feature
- Minify CSS and JavaScript
- Service worker for offline mode
- Fancy schema markup

---

## Documentation

- [README.md](README.md) - Project overview, architecture, common tasks
- [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) - Technical reference, execution flow, troubleshooting

## Deployment Checklist

Before pushing to live:
- Test changes in _writer files first
- Copy verified changes to the live files
- If you changed nav.html, bump the version in nav-loader.js
- No red errors in DevTools console
- Menu appears and works
- Music plays
- Test on a phone too
- Write a clear commit message
- Push to main

The site updates automatically on the next page load. Cache invalidation happens automatically with the version number.

---

## Version Status

Current state:
- Production cache version: 3.2
- Writer cache version: 3.2
- Site is live and working
- No known issues
- Launched January 16, 2026 (one week ago)
