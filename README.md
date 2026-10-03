# shehabulalam.github.io

Personal developer portfolio — static site, deployed on GitHub Pages.

**Live:** https://shehabulalam.github.io

## Stack

Plain HTML5, Tailwind CSS via CDN, vanilla JavaScript. No build step, no
dependencies, no backend — every file is served exactly as committed.

## Structure

```
index.html              single page: hero, about, skills, experience, projects, contact
404.html                themed not-found page
.nojekyll               tells GitHub Pages to serve files as-is, without Jekyll
css/styles.css          neumorphic design system — colour tokens, elevation, motion
js/tailwind.config.js   Tailwind theme (loads AFTER the CDN script — order matters)
js/main.js              theme toggle, nav, scroll reveal, project filter, contact form
assets/img/             images
assets/icons/           favicon
assets/resume/          resume PDF
_refs/                  design references — gitignored, never deployed
```

## Design

Neumorphic (soft-UI): surfaces share the page background and gain depth purely
from a paired light/dark shadow, lit from the top-left.

Light is the default theme. Dark is a navy variant of the same language — matte
surfaces, identical elevation rules — switched via `data-theme` on `<html>` and
remembered in `localStorage`. Every colour is a CSS custom property in
`css/styles.css`, so no component style is written twice.

Tailwind's colour tokens point at those same custom properties, which means
utilities like `text-muted` follow the active theme with no `dark:` variants.
The trade-off is that slash-opacity syntax (`bg-accent/20`) does not work —
use the pre-mixed `--accent-soft` token instead.

## Local development

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Edit and refresh; there is nothing to compile.

## Setup still required

- **Contact form** — get a free access key at [web3forms.com](https://web3forms.com)
  and replace `YOUR_WEB3FORMS_ACCESS_KEY` in the `data-access-key` attribute on
  `#contactForm` in `index.html`. Until then the form is disabled and shows a
  mailto fallback.
- **Experience section** — `index.html` has three placeholder roles marked with
  a `TODO` comment. Replace with real history.
- **OG image** — `assets/img/og-cover.png` is referenced in the meta tags but
  not yet created (1200×630).

## Note on the Tailwind CDN

The CDN compiles classes in the browser. It logs a "should not be used in
production" warning and causes a brief unstyled flash on slow connections. To
remove both, generate the CSS ahead of time and commit it:

```bash
npx tailwindcss -i css/styles.css -o css/tailwind.css --minify
```

then swap the two CDN `<script>` tags for a single `<link>`. GitHub Pages serves
the result identically — it is still a pure static site.
