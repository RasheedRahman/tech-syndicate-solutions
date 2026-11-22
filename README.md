# Tech Syndicate Solutions

Company site for **Tech Syndicate Solutions** — a software studio building SaaS platforms,
business websites and mobile apps. Static, zero-build: open `index.html` or serve the folder.

**Live:** <https://rasheedrahman.github.io/tech-syndicate-solutions/>

## Structure

```
index.html            all sections
assets/css/styles.css design system (tokens + components)
assets/js/data.js     ALL content — projects, services, team, FAQ
assets/js/main.js     rendering + interactions
assets/img/work/      project screenshots (webp)
assets/img/team/      portraits
```

## Editing content

Everything you'd want to change lives in `assets/js/data.js`:

- `services` — what we sell
- `projects` — add a card: `{ name, subtitle, owner: "rasheed"|"gokul", category, tag, desc, stack, images, link }`
  - `category`: `saas` | `mobile` | `webapp` | `website` (drives the filter buttons)
  - `featured: true` makes it a full-width split card
  - `images: []` renders a gradient placeholder instead of a broken carousel
- `team` — bios, stats, skills, links
- `process`, `faqs`, `marquee`

## Local preview

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Deploy — GitHub Pages

Live URL: <https://rasheedrahman.github.io/tech-syndicate-solutions/>

```bash
git add .
git commit -m "update site"
git push
```

Pages deploys automatically from `main` branch root (~1 min). No build step.

`.nojekyll` is present so GitHub serves files as-is (no Jekyll processing).

### Moving to a custom domain later

1. Buy the domain.
2. Add a file named `CNAME` at the repo root containing just the domain, e.g. `techsyndicatesolutions.com`.
3. Add DNS records at the registrar:

   | Type | Name | Value |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | CNAME | `www` | `rasheedrahman.github.io` |

4. Settings → Pages → tick **Enforce HTTPS**.
5. Update these to the new domain: `<link rel="canonical">` + `og:url` + JSON-LD `url` in `index.html`, plus `sitemap.xml`, `robots.txt`, `llms.txt`.

Note: all internal links are **relative**, so the site works unchanged in a subfolder and after moving to a root domain.

## Notes

- `_refs/` holds read-only clones of both original portfolios for reference. It is gitignored and never modified.

## Brand assets

`assets/img/brand/` — generated from the original PNGs in `brand/source/`:

| File | Use |
|---|---|
| `mark-light.webp` / `mark-dark.webp` | nav mark (141×64) |
| `logo-light.webp` / `logo-dark.webp` | footer lockup (804×112) |
| `favicon-180.png` | favicon / apple-touch-icon |
| `../og-image.png` | social share card (1200×630) |

Brand navy: `#024377`. The site accent is derived from it; dark mode uses `#e9f1fb`
so the logo stays visible on the dark background. Both variants swap via CSS
(`.on-light` / `.on-dark`), so no JS is involved.
