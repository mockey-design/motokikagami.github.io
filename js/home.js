/* ===================================================
   HOME PAGE — HIGHLIGHTS RENDERER
   =================================================== */

function renderHighlights() {
  const pubs = window.PUBLICATIONS;
  if (!pubs) return;

  const container = document.getElementById('highlights-grid');
  if (!container) return;

  const highlights = pubs.filter(p => p.highlight).slice(0, 3);
  container.innerHTML = '';

  highlights.forEach((pub) => {
    const card = document.createElement('div');
    card.className = 'highlight-card fade-in';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'Read more: ' + pub.title);

    let linkHtml = '';
    if (pub.pdf) {
      const href = pub.pdf !== '#' ? 'href="' + pub.pdf + '" target="_blank"' : '';
      const dim = pub.pdf === '#' ? 'style="opacity:0.5;pointer-events:none"' : '';
      linkHtml += '<a ' + href + ' class="card-link" ' + dim + '>PDF</a>';
    }
    if (pub.doi) {
      linkHtml += '<a href="' + pub.doi + '" target="_blank" class="card-link">DOI</a>';
    }
    if (pub.bibtex) {
      linkHtml += '<button class="card-link bibtex-btn">BibTeX</button>';
    }
    linkHtml += '<button class="card-link details-btn">Details →</button>';

card.innerHTML =
  (pub.teaser
    ? '<div class="card-teaser"><img src="' + pub.teaser + '" alt="" loading="lazy" /></div>'
    : '') +
  '<p class="card-venue-year">' + pub.venue + ' · ' + pub.year + '</p>' +
  '<h3 class="card-title">' + pub.title + '</h3>' +
  '<p class="card-abstract">' + pub.mini_abstract + '</p>' +
  '<div class="card-links">' + linkHtml + '</div>';

    card.addEventListener('click', () => openModal(pub));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') openModal(pub); });

    card.querySelectorAll('.card-links a, .card-links button').forEach(el => {
      el.addEventListener('click', e => e.stopPropagation());
    });

    const bibtexBtn = card.querySelector('.bibtex-btn');
    if (bibtexBtn && pub.bibtex) {
      bibtexBtn.addEventListener('click', e => {
        e.stopPropagation();
        copyBibtex(pub.bibtex);
      });
    }

    const detailsBtn = card.querySelector('.details-btn');
    if (detailsBtn) {
      detailsBtn.addEventListener('click', e => {
        e.stopPropagation();
        openModal(pub);
      });
    }

    container.appendChild(card);
  });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    container.querySelectorAll('.fade-in').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.12) + 's';
      obs.observe(el);
    });
  } else {
    container.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.PUBLICATIONS) renderHighlights();
});
