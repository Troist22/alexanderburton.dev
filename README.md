# Alexander Burton - Full Stack Developer Portfolio

Website: https://alexander.burton.dev
Built: January 2026
Status: Live

## What This Is

A personal portfolio website I built using HTML, CSS, and JavaScript. Nothing fancy - no React, no Vue, no frameworks. Just vanilla code.

The main idea: show off some projects and talk about my skills as a developer. Also has background music that remembers where you left off if you come back.

What's included:
- Navigation that gets cached so pages load faster
- Music that pauses and resumes where you left off
- A way to test changes before pushing them live
- Works on phones and desktop
- SEO stuff so search engines can find it
- Video portfolio page showcasing creative work

---

## Project Structure

```
alexanderburton.dev/
├── Production Files
│   ├── index.html              # Homepage
│   ├── about_me.html           # Professional background
│   ├── software.html           # Project portfolio
│   ├── editing_animations.html # Video editing & creative work
│   ├── my_journey.html         # Blog/career narrative
│   ├── nav.html                # Navigation menu (cached)
│   ├── style.css               # Global stylesheet
│   ├── menu.js                 # Menu interaction logic
│   └── nav-loader.js           # Nav injection + caching
│
├── Writer Mode (Local Editing)
│   ├── index_writer.html, about_me_writer.html, etc.
│   ├── editing_animations_writer.html
│   ├── style_writer.css
│   ├── menu_writer.js, nav_loaderwriter.js
│   └── nav_writer.html
│
├── Assets
│   ├── images/                 # Logo, banners, etc.
│   └── music/backgroundsong.mp3
│
└── Documentation
    ├── README.md (you are here)
    └── DEVELOPER_GUIDE.md      # Technical deep dive
```

---

## How It Works

The site has 4 main pages (Home, About, Projects, Blog). They all share the same navigation menu.

Instead of copying the menu code to every page, I put it in one file (nav.html) and inject it into each page when someone visits. The injected nav gets saved in the browser's local storage so it doesn't need to be fetched again.

The menu and music stuff is handled by menu.js. Music position, volume, and whether it's playing gets saved too - so if you leave and come back, the music resumes exactly where you left off.

When nav.html changes, I increment a version number. All browsers notice the version changed and re-fetch the new nav.

### What Happens When You Visit

1. Browser loads the page (like index.html)
2. Two scripts load: menu.js and nav-loader.js
3. nav-loader.js looks for cached nav in browser storage
4. If found, it injects the cached nav. If not, it fetches nav.html first
5. Once nav is injected, menu.js adds the click handlers
6. Music state gets restored from storage
7. Page is ready to use

The key thing: menu.js has to load before nav-loader.js. Otherwise nav-loader tries to call a function that doesn't exist yet.

---

## Design

I used CSS variables to make it easy to change colors. Everything is dark with a bright green accent (kind of a Matrix/hacker vibe). 

If you want to change the green to blue, just edit one line in style.css and everything updates automatically. No need to hunt through the code.

Mobile-friendly. Tested on phones and tablets.

---

## How to Make Changes

### Add a Blog Post
1. Edit my_journey_writer.html with your new blog post
2. Test it in the browser
3. Copy changes to my_journey.html
4. Commit and push.

### Change the Menu
1. Edit nav_writer.html
2. Go to nav_loaderwriter.js
3. Change NAV_CACHE_VERSION (currently at 4.2)
4. Test in writer mode, then copy to nav.html and nav-loader.js
5. Users will get the new menu on their next page load

### Add a Video Project
1. Create editing_animations_writer.html with your project
2. Add video files to assets/videos/
3. Add thumbnails to assets/thumbnails/
4. Test in writer mode
5. Copy to editing_animations.html when ready

### Change Colors
Edit style.css at the top where it says `:root`. Change the hex colors. Everything else updates automatically.

### Change the Background Music
Just replace the file at assets/music/backgroundsong.mp3 with your own music file. Keep the filename the same.

### Test Things Before Going Live
I set up "writer mode" files with _writer in the name (like index_writer.html). Edit those to test. Then copy the changes to the real files when you're happy with them.

This way you don't break the live site while you're experimenting.

---

## Search Engine Stuff

I added some metadata to all pages so Google and Bing can understand what they're about. Each page mentions things like:
- "Full Stack Developer"
- "Indianapolis" (where I'm from)
- "C#", "Python", "JavaScript" (languages I know)
- Tools like "Unity" and "Blender"

Nothing sketchy. I only put keywords that actually match the content on each page. No spamming the same keyword 100 times.

---

## Technical Details

### Why No Framework?

I didn't use React or Vue. Didn't need them. For a portfolio site I just needed:
- Pages that load fast
- No build step to slow things down
- Simple to edit and deploy
- Code that's easy to understand later

### Making Things Fast

- The nav gets cached so I don't fetch it every single time
- I use a method called insertAdjacentHTML (sounds fancy, just means fast DOM updates)
- Color variables are CSS-based, not JavaScript, so no slow computation
- The audio element is created once and reused

### What Browsers Work With This

Modern browsers. Chrome, Firefox, Safari, Edge from around 2020 onward. Works fine on phones too.

---

## File Relationships

| Purpose | Production | Writer Mode | Notes |
|---------|-----------|-------------|-------|
| Navigation | nav.html | nav_writer.html | Injected into DOM dynamically |
| Menu Logic | menu.js | menu_writer.js | Handles interactions |
| Loader | nav-loader.js | nav_loaderwriter.js | Fetches & injects nav |
| Pages | index.html, about_me.html, software.html, my_journey.html | *_writer.html variants | Use _writer to test, copy to production |
| Styles | style.css | style_writer.css | Global stylesheet |

**Key Principle:** Writer files allow local testing without affecting live site. Once changes verified, apply to production files and increment cache version.

---

## Deployment & Maintenance

### Current Setup
- **Server:** Live since January 2026
- **Cache Version:** 3.2 (production), 3.2 (writer mode)
- **Database:** None (static site)
- **Hosting:** alexander.burton.dev

### Deploying Changes

1. Make your edits
2. If you changed nav.html, bump the version number in nav-loader.js (like 3.2 → 3.3)
3. Push to git
4. Next time someone visits, they'll get the new version automatically

If you update the navigation menu without changing the version number, browsers will keep using the cached old version. So don't forget that part.

### Keeping an Eye on Things

If something breaks:
- Open the browser console (F12 → Console tab) and look for red errors
- Check the Network tab to see if files are loading
- Use the Application tab to check localStorage and see what's cached

Mobile testing is important too. Test it on a phone before and after you make big changes.

---

## Documentation

- [LAUNCH_NOTES.md](LAUNCH_NOTES.md) - Status, maintenance tasks, and troubleshooting
- [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) - Technical reference and debugging

---

## What's Been Built So Far

Done:
- All 4 pages (home, about, projects, blog)
- Navigation that loads from cache
- Background music with pause/resume
- Safe editing mode for testing changes
- Works on phones and desktops
- Search engine metadata

Not done (maybe later):
- Analytics
- Contact form
- Search within blog posts
- Image optimization
- Minified CSS/JS
- Service worker (offline mode)
- Fancy schema markup

---

*Last updated January 16, 2026*

