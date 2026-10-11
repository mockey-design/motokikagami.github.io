# Motoki Kagami — Research Website

Static research website published with GitHub Pages at:
https://mockey-design.github.io/motokikagami.github.io/

## Content

- `index.html`: biography, education, research experience, teaching, support, and skills.
- `data/publications.json`: publication citations, summaries, contributions, and links. Both the home page and publications page use this file.
- `cv.html`: CV page; currently displays an update-in-preparation notice.
- `contact.html`: contact information.

## Publish the new CV

1. Place the completed **public version** at `cv-public.pdf` (or change `cvFile` in `js/config.js`).
2. Set `cvReady: true` and fill in `cvUpdated` (for example, `October 2026`) in `js/config.js`.
3. Change the contact-page CV link label to `View / Download CV`.
4. Commit and push to the branch configured for GitHub Pages. Verify the PDF on the live site. Bump the asset version query in HTML when changing JavaScript or styles; bump the publications JSON version in `js/load-publications.js` when updating publication data.

Keep current, unpublished research details out of this website and its public CV. A separate CV sent privately to prospective supervisors may include those details; do not upload that private version to this repository.

The CV page will then show a download link and PDF viewer. The old placeholder is not a PDF.

## Preview

Serve the repository with a local static HTTP server (for example, `python -m http.server 8765`) and open `http://localhost:8765/`. Serving over HTTP is required for the publications JSON to load.

## License

MIT — free to use and modify (as stated in the original repository).
