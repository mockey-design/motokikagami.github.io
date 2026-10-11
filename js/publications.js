function renderPublications() {
  const container = document.getElementById('pub-list');
  if (!container || !window.PUBLICATIONS) return;
  container.innerHTML = '';
  const years = [...new Set(window.PUBLICATIONS.map(pub => pub.year))].sort((a, b) => b - a);

  years.forEach(year => {
    const group = document.createElement('section');
    group.className = 'year-group';
    group.innerHTML = `<h2 class="year-label">${year}</h2>`;
    window.PUBLICATIONS.filter(pub => pub.year === year).forEach(pub => {
      const item = document.createElement('article');
      item.className = 'pub-item';
      const authors = pub.authors.map(author => author === SITE_CONFIG.name ? `<strong>${author}</strong>` : author).join(', ');
      item.innerHTML = `
        <div class="pub-meta">
          <h3 class="pub-title">${pub.title}</h3>
          <p class="pub-authors">${authors}</p>
          <p class="pub-venue">${pub.venue} · ${pub.year}${pub.citation_details ? ' · ' + pub.citation_details : ''}</p>
          ${pub.presentation ? `<p class="pub-presentation">${pub.presentation}</p>` : ''}
          <div class="pub-bibtex" hidden>
            <pre class="bibtex-block visible">${escapeHtml(pub.bibtex)}</pre>
            <button class="bibtex-copy-btn">Copy BibTeX</button>
          </div>
        </div>
        <div class="pub-links">
          ${buildLinkButtons(pub)}
          <button class="card-link bibtex-toggle" aria-expanded="false">BibTeX</button>
          <button class="card-link details-btn" aria-label="Details: ${escapeHtml(pub.title)}">Details →</button>
        </div>`;
      item.querySelector('.bibtex-toggle').addEventListener('click', event => {
        const block = item.querySelector('.pub-bibtex');
        block.hidden = !block.hidden;
        event.currentTarget.setAttribute('aria-expanded', String(!block.hidden));
        event.currentTarget.textContent = block.hidden ? 'BibTeX' : 'Hide BibTeX';
      });
      item.querySelector('.bibtex-copy-btn').addEventListener('click', () => copyBibtex(pub.bibtex));
      item.querySelector('.details-btn').addEventListener('click', () => openModal(pub));
      group.appendChild(item);
    });
    container.appendChild(group);
  });
}
