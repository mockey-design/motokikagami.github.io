/* ===================================================
   PUBLICATIONS PAGE RENDERER
   =================================================== */

function renderPublications() {
  const pubs = window.PUBLICATIONS;
  if (!pubs) return;

  // Group by year (descending)
  const byYear = {};
  pubs.forEach(p => {
    if (!byYear[p.year]) byYear[p.year] = [];
    byYear[p.year].push(p);
  });

  const years = Object.keys(byYear).sort((a, b) => b - a);
  const container = document.getElementById('pub-list');
  if (!container) return;

  let html = '';
  years.forEach(year => {
    html += `<div class="year-group fade-in">
      <p class="year-label">${year}</p>`;
    byYear[year].forEach(pub => {
      const authors = pub.authors.map(a =>
        a === SITE_CONFIG.name ? `<strong>${a}</strong>` : a
      ).join(', ');

      let links = '';
      if (pub.pdf) {
        links += `<a href="${pub.pdf !== '#' ? pub.pdf : 'javascript:void(0)'}" 
          ${pub.pdf !== '#' ? 'target="_blank"' : ''} 
          class="card-link" 
          ${pub.pdf === '#' ? 'style="opacity:0.5"' : ''}>PDF</a>`;
      }
      if (pub.doi) {
        links += `<a href="${pub.doi}" target="_blank" class="card-link">DOI</a>`;
      }
      if (pub.bibtex) {
        links += `<button class="card-link" 
          onclick="togglePubBibtex(this, '${pub.id}')">BibTeX</button>`;
      }

      html += `
        <div class="pub-item">
          <div class="pub-meta">
            <p class="pub-title">${pub.title}</p>
            <p class="pub-authors">${authors}</p>
            <p class="pub-venue">${pub.venue} &middot; ${pub.year}</p>
            ${pub.bibtex ? `<pre class="bibtex-block" id="bibtex-${pub.id}">${escapeHtml(pub.bibtex)}</pre>` : ''}
          </div>
          <div class="pub-links">${links}</div>
        </div>`;
    });
    html += `</div>`;
  });

  container.innerHTML = html;

  // Re-run fade-in observer for newly created elements
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.05 });
    container.querySelectorAll('.fade-in').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.06}s`;
      obs.observe(el);
    });
  } else {
    container.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
  }
}

function togglePubBibtex(btn, id) {
  const block = document.getElementById(`bibtex-${id}`);
  if (!block) return;
  const visible = block.classList.toggle('visible');
  btn.textContent = visible ? 'Hide BibTeX' : 'BibTeX';
  if (visible) {
    const pub = window.PUBLICATIONS.find(p => p.id === id);
    if (pub) {
      const copyBtn = document.createElement('button');
      copyBtn.className = 'bibtex-copy-btn';
      copyBtn.style.marginLeft = '8px';
      copyBtn.textContent = 'Copy';
      copyBtn.onclick = () => copyBibtex(pub.bibtex);
      if (!block.nextElementSibling?.classList.contains('bibtex-copy-btn')) {
        block.insertAdjacentElement('afterend', copyBtn);
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderPublications();
});
