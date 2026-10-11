function renderHighlights() {
  const container = document.getElementById('highlights-grid');
  if (!container || !window.PUBLICATIONS) return;
  container.innerHTML = '';

  window.PUBLICATIONS.filter(pub => pub.highlight).forEach(pub => {
    const card = document.createElement('article');
    card.className = 'highlight-card';
    card.innerHTML = `
      ${pub.teaser ? `<div class="card-teaser"><img src="${pub.teaser}" alt="" loading="lazy" /></div>` : ''}
      <p class="card-venue-year">${pub.short_venue} · ${pub.year}</p>
      <h3 class="card-title">${pub.title}</h3>
      <p class="card-abstract">${pub.mini_abstract}</p>
      <div class="card-links">
        ${buildLinkButtons(pub)}
        <button class="card-link details-btn" aria-label="Details: ${escapeHtml(pub.title)}">Details →</button>
      </div>`;
    card.querySelector('.details-btn').addEventListener('click', () => openModal(pub));
    container.appendChild(card);
  });
}
