# Researcher Portfolio Site

A static, single-page-architecture portfolio site designed for researchers targeting **adoption/PhD applications**. Goal: communicate your research identity in under 30 seconds.

## Design System

- **Aesthetic**: Refined academic luxury — deep slate backgrounds, warm gold accents, Cormorant Garamond display, Crimson Pro body
- **Theme**: Auto dark/light based on OS preference
- **Motion**: Subtle parallax on Hero scroll (±4 px), card micro-tilt on hover. All animations respect `prefers-reduced-motion`.
- **Noise**: Static SVG-based grain overlay (no animated backgrounds)

---

## Project Structure

```
researcher-site/
├── index.html          # Home (Hero + Highlights)
├── publications.html   # Full publications list
├── cv.html             # CV embed + download
├── contact.html        # Contact links
├── sitemap.xml         # SEO sitemap
├── css/
│   └── style.css       # Full design system
├── js/
│   ├── main.js         # Parallax, nav, modal, fade-in
│   ├── home.js         # Highlights card renderer
│   └── publications.js # Publications list renderer
└── data/
    └── publications.json  # ← EDIT THIS to update papers
```

**Files to add yourself:**
- `cv.pdf` — your CV (place in root)
- `research-figure.png` — your research diagram/figure (place in root)

---

## Quick Start (Local Preview)

```bash
# Option 1: Python (built-in)
python3 -m http.server 8080
# Open http://localhost:8080

# Option 2: Node
npx serve .
# Open http://localhost:3000

# Option 3: VS Code
# Install "Live Server" extension → right-click index.html → Open with Live Server
```

> **Important**: Open via a local server, not directly as `file://` — the `fetch('data/publications.json')` call requires HTTP.

---

## Personalizing the Site

### 1. Your Information

Search and replace `[Your Name]`, `[Affiliation]`, `[Email]`, `[URL]`, etc. in all `.html` files.

| Placeholder | Replace with |
|---|---|
| `[Your Name]` | Your full name |
| `[Affiliation]` | Your institution |
| `[Email]` | Your email address |
| `[URL]` (Scholar) | Google Scholar URL |
| `[URL]` (LinkedIn) | LinkedIn profile URL |
| `[URL]` (Twitter) | Twitter/X profile URL |
| `@[handle]` | Your Twitter handle |

### 2. Research Figure

Place your figure at the root as `research-figure.png` (or any name), then in `index.html` find the Hero Visual section and:

1. Remove the `<div class="figure-placeholder">` block
2. Uncomment the `<img>` tag and set `src` to your filename:
   ```html
   <img src="research-figure.png" alt="Describe your figure here" loading="eager" />
   ```

### 3. Update CV

Place your `cv.pdf` in the root directory. The CV page will auto-embed it.

### 4. Research Summary Text

In `index.html`, update the `hero-summary` paragraph to describe your actual research focus.

---

## Adding / Updating Publications

Edit `data/publications.json`. Each entry follows this schema:

```json
{
  "id": "unique-string",
  "title": "Full paper title",
  "authors": ["Your Name", "Co-Author Name"],
  "venue": "NeurIPS",
  "year": 2025,
  "pdf": "https://link-to-pdf.com",
  "doi": "https://doi.org/10.xxxx/xxxx",
  "bibtex": "@inproceedings{...}",
  "highlight": true,
  "abstract": "Full abstract text...",
  "mini_abstract": "One sentence shown on card.",
  "contributions": [
    "Contribution 1",
    "Contribution 2"
  ],
  "results": [
    "Key result 1",
    "Key result 2"
  ]
}
```

**Key fields:**
- `"highlight": true` — appears in the Home Highlights section (max 3 recommended)
- `"pdf": "#"` — shows a disabled PDF button (paper not publicly available yet)
- `"pdf": null` — hides the PDF button entirely
- `contributions` and `results` are shown in the modal; can be `[]` for non-highlighted papers

---

## Deployment

### GitHub Pages (Recommended)

```bash
# 1. Create a repo: yourname.github.io (or any repo)
git init
git add .
git commit -m "Initial portfolio"
git remote add origin https://github.com/yourusername/yourname.github.io.git
git push -u origin main

# 2. In GitHub repo Settings → Pages → Source: Deploy from branch → main / (root)
# 3. Your site will be live at https://yourname.github.io/
```

After deploying, update the `siteUrl` values in `sitemap.xml` and OGP `og:url` tags in each HTML file.

### Netlify (Drag & Drop)

1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag your `researcher-site/` folder
3. Get an instant live URL (e.g. `https://mystical-einstein-abc123.netlify.app`)
4. Optionally connect to GitHub for auto-deploy on push

### Vercel

```bash
npm i -g vercel
cd researcher-site
vercel
# Follow prompts → deployed in ~30 seconds
```

---

## SEO / OGP Checklist

After deploying, update in every HTML file:

```html
<!-- Update these with your real URL -->
<meta property="og:url" content="https://YOUR-REAL-URL.com/page.html" />
```

And in `sitemap.xml`:
```xml
<loc>https://YOUR-REAL-URL.com/</loc>
```

---

## Customization Tips

### Changing Colors

All colors are CSS variables in `css/style.css`. Find `:root { ... }` at the top:

```css
--c-gold: #c9a84c;    /* Accent color — try #4c8fc9 for blue */
--c-bg:   #0d0f14;    /* Dark background */
```

### Changing the research summary caption (bottom of figure)

In `index.html`, find `.figure-caption` and update:
```html
<div class="figure-caption">
  Your Research Area · Second Topic · Third Topic
</div>
```

### Light mode only

Remove the `@media (prefers-color-scheme: light)` block from `style.css` and paste its variables directly into `:root { ... }`.

---

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). PDF embed uses native `<iframe>` — falls back to download-only on mobile.

---

## License

MIT — free to use and modify.
